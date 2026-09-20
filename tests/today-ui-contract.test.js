import { describe, expect, it, vi } from 'vitest';
import { renderTodayPage } from '../js/ui/today-page.js';

function storage(seed) {
  const state = structuredClone(seed);
  return {
    get(key, fallback) { return state[key] ?? fallback; },
    set(key, value) { state[key] = value; }
  };
}

describe('Today professional UI contract', () => {
  it('renders one dominant CTA, canonical task/status classes, and priority language', () => {
    const context = {
      today: () => '2026-09-21',
      storage: storage({
        dailyTasks:[{ id:'e1', date:'2026-09-21', subject:'english', type:'weakness-drill', status:'pending', plannedMinutes:30, topic:'reading' }],
        diagnostics:[{ date:'2026-09-20', subjects:{ english:{grade:'B'} } }],
        practiceLogs:[], reviewSchedule:[], settings:{ currentScopes:{} }
      }),
      rescheduleUnfinished: () => [],
      generateTodayPlan: () => ({ tasks:[] }),
      getDueReviews: () => [],
      getPriorities: () => ({ english:0.72, chinese:0.2, math:0.2, social:0.2, science:0.2 }),
      needsV11Nudge: () => false,
      startDailyTask: vi.fn(),
      skipDailyTask: vi.fn(),
      completeTask: task => ({ ...task, status:'completed' }),
      refresh: vi.fn()
    };

    const page = renderTodayPage(context);
    expect(page.querySelectorAll('.jh-primary-cta')).toHaveLength(1);
    expect(page.querySelector('.jh-hero')).not.toBeNull();
    expect(page.querySelector('.jh-task-card')).not.toBeNull();
    expect(page.querySelector('.jh-status-badge')?.textContent).toBe('優先加強');
    expect(page.textContent).toContain('剩餘 30 分鐘');
  });
});
