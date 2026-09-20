import { createRouter, startRouter } from './router.js';
import { createStorage } from './core/storage.js';
import { latestBaseline, validateDiagnostic } from './core/diagnostics.js';
import { summarizeSubjectRecent } from './core/mastery.js';
import { applyMaintenanceBoost, calculatePriority } from './core/priority.js';
import { createReviewItem, getDueReviews, recordReviewResult, reviewResultToPracticeLog } from './core/spaced-review.js';
import { completeTask, planDay, rescheduleUnfinished } from './core/study-planner.js';
import { exportPlannerData, parseExternalPracticeImport, parsePlannerImport } from './core/import-export.js';
import { isBrandNewUser, needsV11Nudge, completeOnboarding } from './core/onboarding.js';
import { startTask, skipTask } from './core/task-status.js';
import { renderAppShell } from './ui/app-shell.js';
import { renderHomePage } from './ui/home.js';
import { renderDiagnosticsPage } from './ui/diagnostics-page.js';
import { renderTodayPage } from './ui/today-page.js';
import { renderReviewPage } from './ui/review-page.js';
import { renderProgressPage } from './ui/progress-page.js';
import { renderSettingsPage } from './ui/settings-page.js';
import { renderImportExportPage } from './ui/import-export-page.js';
import { renderOnboardingPage } from './ui/onboarding-page.js';
import { renderMorePage } from './ui/more-page.js';

const app = document.querySelector('#app');
const storage = createStorage();
const subjectCodes = ['chinese','english','math','social','science'];
const today = () => new Date().toISOString().slice(0,10);

function plannerSnapshot() {
  return Object.fromEntries(['settings','diagnostics','dailyTasks','practiceLogs','miniChecks'].map(key => [key, storage.get(key, key === 'settings' ? {} : [])]));
}
function recentTouches(logs) {
  const result = {};
  for (const log of logs) {
    const date = log.date ?? log.completedAt?.slice?.(0,10);
    if (date && (!result[log.subject] || date > result[log.subject])) result[log.subject] = date;
  }
  return result;
}
function learningTouches() {
  const practice = storage.get('practiceLogs', []);
  const completedTasks = storage.get('dailyTasks', []).filter(task => task.status === 'completed' && task.subject && task.completedAt).map(task => ({ subject:task.subject, date:task.completedAt.slice(0,10) }));
  return recentTouches([...practice, ...completedTasks]);
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
  return applyMaintenanceBoost(priorities, learningTouches(), today());
}

let refresh = () => {};
const context = {
  storage, today, validateDiagnostic, getDueReviews, recordReviewResult, reviewResultToPracticeLog, createReviewItem,
  parsePlannerImport, parseExternalPracticeImport, getPriorities, completeTask, rescheduleUnfinished,
  needsV11Nudge: () => needsV11Nudge(plannerSnapshot()),
  refresh: () => refresh(),
  generateTodayPlan() {
    const settings = storage.get('settings', { dailyMinutes:75, currentScopes:{} });
    return planDay({ date:today(), dailyMinutes:settings.dailyMinutes ?? 75, priorities:getPriorities(), dueReviews:getDueReviews(storage.get('reviewSchedule', []), today()), currentScopes:settings.currentScopes ?? {}, recentTouches:learningTouches() });
  },
  startDailyTask(id) {
    const all=storage.get('dailyTasks', []); storage.set('dailyTasks', startTask(all,id,new Date().toISOString())); this.refresh();
  },
  skipDailyTask(id, reason='') {
    const all=storage.get('dailyTasks', []); storage.set('dailyTasks', skipTask(all,id,reason)); this.refresh();
  },
  finishOnboarding({ diagnostic, settingsPatch }) {
    const checked=validateDiagnostic(diagnostic); if(!checked.ok) return checked;
    const diagnostics=storage.get('diagnostics', []);
    if(!diagnostics.some(row => row.id === diagnostic.id)) storage.set('diagnostics',[...diagnostics,diagnostic]);
    storage.set('settings', completeOnboarding(storage.get('settings', {}), settingsPatch));
    const all=storage.get('dailyTasks', []);
    if(!all.some(task => task.date === today())) { const plan=this.generateTodayPlan(); storage.set('dailyTasks',[...all,...plan.tasks]); }
    window.location.hash='#/today'; return { ok:true, errors:[] };
  },
  exportSnapshot() {
    const data = {}; for (const key of ['profile','diagnostics','settings','dailyTasks','practiceLogs','reviewSchedule','miniChecks','mastery','ui']) data[key] = storage.get(key, key === 'settings' ? {} : []);
    return exportPlannerData(data);
  }
};

const routes = createRouter({
  '#/': () => isBrandNewUser(plannerSnapshot()) ? renderOnboardingPage(context) : renderTodayPage(context),
  '#/onboarding': () => renderOnboardingPage(context),
  '#/diagnostics': () => renderDiagnosticsPage(context),
  '#/today': () => isBrandNewUser(plannerSnapshot()) ? renderOnboardingPage(context) : renderTodayPage(context),
  '#/review': () => renderReviewPage(context), '#/progress': () => renderProgressPage(context), '#/settings': () => renderSettingsPage(context), '#/data': () => renderImportExportPage(context), '#/more': () => renderMorePage(context),
  '#/home': () => renderHomePage(context)
});

const navItems = [['#/today','今日'],['#/progress','進度'],['#/review','錯題'],['#/more','更多']];
const switcherItems = [
  ['https://alger68.github.io/JHSEE-Study-Planner/','Study Planner'],
  ['https://alger68.github.io/JHSEE-All-Subjects/','All Subjects'],
  ['https://alger68.github.io/JHSEE-English-Adventure/','English Adventure']
];

function renderPage(page) {
  app.replaceChildren(renderAppShell({ product:'Study Planner', page, navItems, switcherItems }));
}
refresh = () => renderPage(routes.resolve(window.location.hash || '#/')());
startRouter(routes, renderPage);
