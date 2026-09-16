import { expect, it } from 'vitest';
import { explainTask } from '../js/core/task-explainer.js';

it('explains a 4A1B English weakness task without claiming an official result', () => {
  const reasons = explainTask({ subject:'english', type:'weakness-drill' }, {
    latestGrades:{ chinese:'A', english:'B', math:'A', social:'A', science:'A' },
    priorities:{ english:0.72, math:0.30 },
    mastery:{ grammar:{ sampleSize:8, accuracy:68 } },
    dueCounts:{ english:3 }, currentScopes:{}, staleDays:{}
  });
  expect(reasons).toContain('最近一次模考英語為 B');
  expect(reasons).toContain('英語目前為最高優先科');
  expect(reasons.some(r => r.includes('正式會考'))).toBe(false);
  expect(reasons.length).toBeLessThanOrEqual(4);
});

it('does not call a topic weak before five samples', () => {
  const reasons = explainTask({ subject:'english', type:'weakness-drill' }, {
    latestGrades:{ english:'B' }, priorities:{ english:0.7 }, mastery:{ grammar:{ sampleSize:4, accuracy:25 } }, dueCounts:{}, currentScopes:{}, staleDays:{}
  });
  expect(reasons.some(r => r.includes('25%'))).toBe(false);
});
