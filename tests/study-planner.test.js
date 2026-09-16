import { expect, it } from 'vitest';
import { planDay } from '../js/core/study-planner.js';

const priorities = { chinese:0.3, english:0.8, math:0.35, social:0.3, science:0.32 };

it('keeps a 75-minute plan within budget and prioritizes weakest subject', () => {
  const result = planDay({
    date:'2026-09-17', dailyMinutes:75, priorities,
    dueReviews:[{ itemId:'e1', subject:'english', topic:'grammar' }],
    currentScopes:{ math:'二次方根' },
    recentTouches:{ chinese:'2026-09-16', english:'2026-09-16', math:'2026-09-16', social:'2026-09-01', science:'2026-09-16' }
  });
  expect(result.totalMinutes).toBeLessThanOrEqual(75);
  expect(result.tasks.some(t => t.subject === 'english' && t.type === 'weakness-drill')).toBe(true);
  expect(result.tasks.some(t => t.type === 'review-due')).toBe(true);
  expect(result.tasks.some(t => t.subject === 'social' && t.type === 'maintenance')).toBe(true);
});

it('uses only due review plus top priority in short mode', () => {
  const result = planDay({
    date:'2026-09-17', dailyMinutes:20, priorities,
    dueReviews:[{ itemId:'e1', subject:'english', topic:'grammar' }],
    currentScopes:{}, recentTouches:{}
  });
  expect(result.totalMinutes).toBeLessThanOrEqual(20);
  expect(result.tasks.every(t => ['review-due','weakness-drill'].includes(t.type))).toBe(true);
});
