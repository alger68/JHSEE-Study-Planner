import { describe, expect, it } from 'vitest';
import { renderProgressPage } from '../js/ui/progress-page.js';
import { renderReviewPage } from '../js/ui/review-page.js';
import { renderMorePage } from '../js/ui/more-page.js';
import { renderSettingsPage } from '../js/ui/settings-page.js';

function storage(seed = {}) {
  return {
    get(key, fallback) { return seed[key] ?? fallback; },
    set() {},
    append() {}
  };
}

const baseContext = {
  storage: storage({ miniChecks:[], practiceLogs:[], reviewSchedule:[], settings:{ dailyMinutes:75, currentScopes:{} } }),
  refresh() {},
  today: () => '2026-09-21',
  getDueReviews: () => [],
  recordReviewResult: item => item,
  reviewResultToPracticeLog: () => ({}),
  createReviewItem: input => input
};

describe('secondary page unified UI', () => {
  it.each([
    ['progress', () => renderProgressPage(baseContext)],
    ['review', () => renderReviewPage(baseContext)],
    ['more', () => renderMorePage(baseContext)],
    ['settings', () => renderSettingsPage(baseContext)]
  ])('%s uses canonical page and card structure', (_name, render) => {
    const page = render();
    expect(page.querySelector('.jh-page-header')).not.toBeNull();
    expect(page.querySelector('.jh-card')).not.toBeNull();
  });
});
