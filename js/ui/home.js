import { subjectTrend, topWeakTopics, fastestImprovingTopics } from '../core/analytics.js';
import { getDueReviews } from '../core/spaced-review.js';
import { getEnglishStage, summarizeTopic } from '../core/mastery.js';
import { renderEnglishPath } from './english-path.js';

const LABELS = { chinese:'國文', english:'英語', math:'數學', social:'社會', science:'自然' };

function card(title, value, detail = '') {
  const el = document.createElement('article');
  el.className = 'card metric';
  el.innerHTML = `<span class="metric__label"></span><strong class="metric__value"></strong><span class="metric__detail"></span>`;
  el.querySelector('.metric__label').textContent = title;
  el.querySelector('.metric__value').textContent = value;
  el.querySelector('.metric__detail').textContent = detail;
  return el;
}

function daysUntil(dateText, today) {
  if (!dateText) return null;
  const target = new Date(`${dateText}T00:00:00Z`);
  const now = new Date(`${today}T00:00:00Z`);
  if (Number.isNaN(target.getTime()) || Number.isNaN(now.getTime())) return null;
  return Math.ceil((target - now) / 86400000);
}

export function renderHomePage(context) {
  const root = document.createElement('section');
  root.className = 'page-stack';
  const today = context.today();
  const tasks = context.storage.get('dailyTasks', []).filter(task => task.date === today);
  const planned = tasks.reduce((sum, task) => sum + (task.plannedMinutes ?? 0), 0);
  const completed = tasks.filter(task => task.status === 'completed').length;
  const completionRate = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const due = getDueReviews(context.storage.get('reviewSchedule', []), today);
  const priorities = context.getPriorities();
  const ranked = Object.entries(priorities).sort((a,b) => b[1] - a[1]).slice(0,3);
  const settings = context.storage.get('settings', {});
  const examDays = daysUntil(settings.nextExamDate, today);
  const cutoff = new Date(`${today}T00:00:00Z`); cutoff.setUTCDate(cutoff.getUTCDate() - 6);
  const last7Minutes = context.storage.get('dailyTasks', []).filter(task => task.status === 'completed' && task.completedAt && new Date(task.completedAt) >= cutoff).reduce((sum, task) => sum + (Number(task.actualMinutes) || 0), 0);

  const hero = document.createElement('header');
  hero.className = 'hero card';
  hero.innerHTML = '<p class="eyebrow">116 會考準備</p><h1>今天要做什麼，一眼就知道</h1><p>依模考、弱點、錯題與近期進度調整每日任務。</p><a class="button" href="#/today">開始今日學習</a>';
  root.append(hero);

  const metrics = document.createElement('div');
  metrics.className = 'dashboard-grid';
  metrics.append(
    card('今日計畫', `${planned || context.storage.get('settings', { dailyMinutes:75 }).dailyMinutes || 75} 分鐘`, tasks.length ? `${tasks.length} 個任務` : '尚未產生今日任務'),
    card('今日完成率', `${completionRate}%`, tasks.length ? `${completed}/${tasks.length} 完成` : '資料不足'),
    card('到期錯題', `${due.length} 題`, due.length ? '優先安排複習' : '目前無到期錯題'),
    card('近 7 天完成', `${last7Minutes} 分鐘`, last7Minutes ? '依實際完成時間統計' : '尚無完成紀錄'),
    card('下一次考試', examDays == null ? '未設定' : examDays >= 0 ? `${examDays} 天` : '已過期', settings.nextExamLabel || '可到設定頁填寫')
  );
  root.append(metrics);

  const priorityCard = document.createElement('section');
  priorityCard.className = 'card';
  priorityCard.innerHTML = '<h2>目前優先科目</h2>';
  const pList = document.createElement('ol');
  pList.className = 'priority-list';
  ranked.forEach(([subject, score]) => {
    const li = document.createElement('li');
    li.textContent = `${LABELS[subject] ?? subject} · ${Math.round(score * 100)}% 優先度`;
    pList.append(li);
  });
  priorityCard.append(pList);
  root.append(priorityCard);

  const miniChecks = context.storage.get('miniChecks', []);
  const trends = document.createElement('section');
  trends.className = 'card';
  trends.innerHTML = '<h2>近週趨勢</h2>';
  const trendGrid = document.createElement('div');
  trendGrid.className = 'subject-grid';
  for (const subject of Object.keys(LABELS)) {
    const trend = subjectTrend(miniChecks, subject);
    const item = document.createElement('div');
    item.className = 'subject-chip';
    item.textContent = trend.status === 'ready'
      ? `${LABELS[subject]} ${trend.delta > 0 ? '+' : ''}${trend.delta}% ${trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'}`
      : `${LABELS[subject]} 資料不足`;
    trendGrid.append(item);
  }
  trends.append(trendGrid);
  root.append(trends);

  const logs = context.storage.get('practiceLogs', []);
  const topics = [...new Set(logs.filter(log => log.topic).map(log => `${log.subject}:${log.topic}`))];
  const masteries = topics.map(key => {
    const [subject, topic] = key.split(':');
    return { subject, topic, ...summarizeTopic(logs, subject, topic) };
  });
  const weak = topWeakTopics(masteries, 3);
  const topicSeries = {};
  for (const item of masteries) {
    const relevant = logs.filter(log => log.subject === item.subject && log.topic === item.topic && typeof log.correct === 'boolean');
    if (relevant.length >= 2) {
      let correct = 0;
      topicSeries[`${item.subject}:${item.topic}`] = relevant.map((log, index) => {
        if (log.correct) correct += 1;
        return Math.round((correct / (index + 1)) * 100);
      });
    }
  }
  const improving = fastestImprovingTopics(topicSeries, 3);
  const insights = document.createElement('section');
  insights.className = 'insight-grid';
  const weakCard = document.createElement('article');
  weakCard.className = 'card';
  weakCard.innerHTML = '<h2>需要加強</h2>';
  const weakList = document.createElement('ul');
  (weak.length ? weak : [{ topic:'資料不足', accuracy:null }]).forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.accuracy == null ? item.topic : `${item.topic} · ${Math.round(item.accuracy)}%`;
    weakList.append(li);
  });
  weakCard.append(weakList);
  const improveCard = document.createElement('article');
  improveCard.className = 'card';
  improveCard.innerHTML = '<h2>改善最快</h2>';
  const improveList = document.createElement('ul');
  (improving.length ? improving : [{ topic:'資料不足', delta:null }]).forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.delta == null ? item.topic : `${item.topic} · +${Math.round(item.delta)}%`;
    improveList.append(li);
  });
  improveCard.append(improveList);
  insights.append(weakCard, improveCard);
  root.append(insights);

  const englishSummaries = Object.fromEntries(['vocabulary','grammar','cloze','reading','listening','mixed'].map(topic => [topic, summarizeTopic(logs, 'english', topic)]));
  const timedSummary = summarizeTopic(logs, 'english', 'timed');
  const weeklyEnglish = miniChecks.map(check => check.subjects?.english).filter(Boolean);
  root.append(renderEnglishPath(getEnglishStage(englishSummaries, timedSummary, weeklyEnglish)));

  return root;
}
