import { expect, it } from 'vitest';
import { applyMaintenanceBoost, calculatePriority, rankSubjects } from '../js/core/priority.js';

it('uses the documented weights', () => {
  const score = calculatePriority({ weakness:0.7, overdue:0.4, negativeTrend:0.2, upcomingExamWeight:0.6 });
  expect(score).toBeCloseTo(0.51, 5);
});

it('ranks higher score first', () => {
  expect(rankSubjects({ english:0.8, math:0.4, chinese:0.5 }).map(x => x.subject))
    .toEqual(['english','chinese','math']);
});

it('boosts subjects untouched for 7 and 14 days', () => {
  const boosted = applyMaintenanceBoost(
    { english:0.5, math:0.4, science:0.3 },
    { english:'2026-09-10', math:'2026-09-01', science:'2026-09-15' },
    '2026-09-17'
  );
  expect(boosted.english).toBeCloseTo(0.6, 5);
  expect(boosted.math).toBeCloseTo(0.6, 5);
  expect(boosted.science).toBeCloseTo(0.3, 5);
});
