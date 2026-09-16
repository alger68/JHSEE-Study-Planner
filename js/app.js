import { createRouter, startRouter } from './router.js';
import { createStorage } from './core/storage.js';
import { latestBaseline, validateDiagnostic } from './core/diagnostics.js';
import { summarizeSubjectRecent } from './core/mastery.js';
import { calculatePriority } from './core/priority.js';
import { getDueReviews, recordReviewResult } from './core/spaced-review.js';
import { completeTask, planDay, rescheduleUnfinished } from './core/study-planner.js';
import { exportPlannerData, parseExternalPracticeImport, parsePlannerImport } from './core/import-export.js';
import { renderHomePage } from './ui/home.js';
import { renderDiagnosticsPage } from './ui/diagnostics-page.js';
import { renderTodayPage } from './ui/today-page.js';
import { renderReviewPage } from './ui/review-page.js';
import { renderProgressPage } from './ui/progress-page.js';
import { renderSettingsPage } from './ui/settings-page.js';
import { renderImportExportPage } from './ui/import-export-page.js';

const app = document.querySelector('#app');
const storage = createStorage();
const subjectCodes = ['chinese','english','math','social','science'];
const today = () => new Date().toISOString().slice(0,10);

function recentTouches(logs) {
  const result = {};
  for (const log of logs) {
    const date = log.date ?? log.completedAt?.slice?.(0,10);
    if (date && (!result[log.subject] || date > result[log.subject])) result[log.subject] = date;
  }
  return result;
}

function getPriorities() {
  const diagnostics = storage.get('diagnostics', []);
  const baseline = latestBaseline(diagnostics);
  const due = getDueReviews(storage.get('reviewSchedule', []), today());
  const practiceLogs = storage.get('practiceLogs', []);
  const miniChecks = storage.get('miniChecks', []);
  const settings = storage.get('settings', {});
  const priorities = {};
  for (const subject of subjectCodes) {
    const dueCount = due.filter(item => item.subject === subject).length;
    const points = miniChecks.map(check => check.subjects?.[subject]?.accuracy).filter(Number.isFinite);
    const negativeTrend = points.length >= 2 && points.at(-1) < points.at(-2) ? Math.min(1, (points.at(-2)-points.at(-1))/20) : 0;
    const examWeight = settings.currentScopes?.[subject] ? 0.5 : 0;
    const recent = summarizeSubjectRecent(practiceLogs, subject, today(), 30);
    const weakness = recent.sampleSize >= 5 ? Math.max(0, Math.min(1, 1 - recent.accuracy / 100)) : baseline[subject];
    priorities[subject] = calculatePriority({ weakness, overdue:Math.min(1,dueCount/5), negativeTrend, upcomingExamWeight:examWeight });
  }
  return priorities;
}

let refresh = () => {};
const context = {
  storage,
  today,
  validateDiagnostic,
  getDueReviews,
  recordReviewResult,
  parsePlannerImport,
  parseExternalPracticeImport,
  getPriorities,
  completeTask,
  rescheduleUnfinished,
  refresh: () => refresh(),
  generateTodayPlan() {
    const settings = storage.get('settings', { dailyMinutes:75, currentScopes:{} });
    return planDay({
      date:today(),
      dailyMinutes:settings.dailyMinutes ?? 75,
      priorities:getPriorities(),
      dueReviews:getDueReviews(storage.get('reviewSchedule', []), today()),
      currentScopes:settings.currentScopes ?? {},
      recentTouches:recentTouches(storage.get('practiceLogs', []))
    });
  },
  exportSnapshot() {
    const data = {};
    for (const key of ['profile','diagnostics','settings','dailyTasks','practiceLogs','reviewSchedule','miniChecks','mastery','ui']) {
      data[key] = storage.get(key, key === 'settings' ? {} : []);
    }
    return exportPlannerData(data);
  }
};

const routes = createRouter({
  '#/': () => renderHomePage(context),
  '#/diagnostics': () => renderDiagnosticsPage(context),
  '#/today': () => renderTodayPage(context),
  '#/review': () => renderReviewPage(context),
  '#/progress': () => renderProgressPage(context),
  '#/settings': () => renderSettingsPage(context),
  '#/data': () => renderImportExportPage(context)
});

function navigation() {
  const nav=document.createElement('nav'); nav.className='app-nav'; nav.setAttribute('aria-label','主要導覽');
  nav.innerHTML=`
    <a href="#/">首頁</a><a href="#/today">今日</a><a href="#/diagnostics">模考</a>
    <a href="#/review">錯題</a><a href="#/progress">進度</a><a href="#/settings">設定</a><a href="#/data">資料</a>`;
  return nav;
}

function renderPage(page) {
  app.replaceChildren(navigation(), page);
}

refresh = () => renderPage(routes.resolve(window.location.hash || '#/')());
startRouter(routes, renderPage);
