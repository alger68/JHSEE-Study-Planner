import { expect, it } from 'vitest';
import { fastestImprovingTopics, subjectTrend, topWeakTopics } from '../js/core/analytics.js';

it('returns insufficient with one data point', () => {
  expect(subjectTrend([{ week:'2026-W38', subjects:{ english:{ accuracy:68 } } }], 'english').status)
    .toBe('insufficient');
});

it('returns delta with two data points', () => {
  const trend = subjectTrend([
    { week:'2026-W38', subjects:{ english:{ accuracy:68 } } },
    { week:'2026-W39', subjects:{ english:{ accuracy:74 } } }
  ], 'english');
  expect(trend.delta).toBe(6);
  expect(trend.direction).toBe('up');
});

it('sorts weak topics and ignores insufficient state', () => {
  const result = topWeakTopics([
    { topic:'grammar', accuracy:58, state:'weak' },
    { topic:'reading', accuracy:72, state:'needs-work' },
    { topic:'cloze', accuracy:10, state:'insufficient' }
  ]);
  expect(result.map(item => item.topic)).toEqual(['grammar','reading']);
});

it('sorts fastest improving topics using at least two points', () => {
  const result = fastestImprovingTopics({ grammar:[60,75], reading:[70,72], cloze:[55] });
  expect(result[0]).toMatchObject({ topic:'grammar', delta:15 });
});
