import { rankSubjects } from './priority.js';

function clampMinutes(value) {
  return Math.max(20, Math.min(180, Math.round(Number(value) || 75)));
}

function daysSince(lastDate, today) {
  if (!lastDate) return Infinity;
  const a = new Date(`${lastDate}T00:00:00Z`);
  const b = new Date(`${today}T00:00:00Z`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return Infinity;
  return Math.max(0, Math.floor((b - a) / 86400000));
}

function makeTask(date, index, { subject = null, type, topic = null, plannedMinutes, note = '', items = [] }) {
  return {
    id: `task-${date}-${String(index + 1).padStart(3, '0')}`,
    date,
    subject,
    type,
    topic,
    plannedMinutes,
    status: 'pending',
    source: 'planner',
    note,
    items
  };
}

export function planDay({ date, dailyMinutes = 75, priorities = {}, dueReviews = [], currentScopes = {}, recentTouches = {} }) {
  const budget = clampMinutes(dailyMinutes);
  const ranked = rankSubjects(priorities);
  if (ranked.length === 0) return { totalMinutes: 0, tasks: [] };

  const tasks = [];
  let remaining = budget;
  let index = 0;
  const topSubject = ranked[0].subject;

  if (dueReviews.length > 0 && remaining > 0) {
    const reviewMinutes = Math.min(remaining, budget <= 30 ? 8 : 15);
    tasks.push(makeTask(date, index++, {
      subject: dueReviews[0].subject ?? null,
      type: 'review-due',
      topic: dueReviews[0].topic ?? null,
      plannedMinutes: reviewMinutes,
      note: `複習 ${dueReviews.length} 個到期錯題`,
      items: dueReviews.map(item => item.itemId)
    }));
    remaining -= reviewMinutes;
  }

  if (remaining > 0) {
    const topMinutes = budget <= 30 ? remaining : Math.min(30, remaining);
    tasks.push(makeTask(date, index++, {
      subject: topSubject,
      type: 'weakness-drill',
      plannedMinutes: topMinutes,
      note: '最高優先科目專項練習'
    }));
    remaining -= topMinutes;
  }

  if (budget <= 30 || remaining <= 0) {
    return { totalMinutes: tasks.reduce((sum, task) => sum + task.plannedMinutes, 0), tasks };
  }

  const overdueMaintenance = ranked
    .filter(item => item.subject !== topSubject && daysSince(recentTouches[item.subject], date) >= 7)
    .sort((a, b) => daysSince(recentTouches[b.subject], date) - daysSince(recentTouches[a.subject], date) || b.score - a.score);
  const maintenanceSubject = overdueMaintenance[0]?.subject ?? ranked.find(item => item.subject !== topSubject)?.subject;

  if (maintenanceSubject && remaining > 0) {
    const maintenanceMinutes = Math.min(15, remaining);
    tasks.push(makeTask(date, index++, {
      subject: maintenanceSubject,
      type: 'maintenance',
      plannedMinutes: maintenanceMinutes,
      note: '維持科目手感'
    }));
    remaining -= maintenanceMinutes;
  }

  if (remaining > 0) {
    const schoolCandidate = ranked
      .filter(item => Boolean(currentScopes[item.subject]))
      .sort((a, b) => daysSince(recentTouches[b.subject], date) - daysSince(recentTouches[a.subject], date) || b.score - a.score)[0];
    if (schoolCandidate) {
      const subject = schoolCandidate.subject;
      tasks.push(makeTask(date, index++, {
        subject,
        type: 'current-school',
        topic: currentScopes[subject],
        plannedMinutes: remaining,
        note: '同步目前學校進度'
      }));
      remaining = 0;
    }
  }

  if (remaining > 0 && tasks.length > 0) {
    tasks[tasks.length - 1].plannedMinutes += remaining;
    remaining = 0;
  }

  return { totalMinutes: tasks.reduce((sum, task) => sum + task.plannedMinutes, 0), tasks };
}

export function completeTask(task, actualMinutes, completedAt) {
  if (!task || typeof task !== 'object') throw new Error('task is required');
  const minutes = Number(actualMinutes);
  if (!Number.isFinite(minutes) || minutes < 0) throw new Error('actualMinutes must be a non-negative number');
  if (typeof completedAt !== 'string' || !completedAt) throw new Error('completedAt is required');
  return { ...task, status: 'completed', actualMinutes: minutes, completedAt };
}

export function rescheduleUnfinished(tasks, nextDate) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(nextDate ?? '')) throw new Error('nextDate must be YYYY-MM-DD');
  const allowed = new Set(['review-due', 'weakness-drill']);
  return (Array.isArray(tasks) ? tasks : [])
    .filter(task => allowed.has(task.type) && ['pending', 'skipped'].includes(task.status) && !task.rescheduledTo)
    .map((task, index) => ({
      ...task,
      id: `task-${nextDate}-retry-${String(index + 1).padStart(3, '0')}`,
      date: nextDate,
      status: 'pending',
      rescheduledFrom: task.id,
      completedAt: undefined,
      actualMinutes: undefined
    }));
}
