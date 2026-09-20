import { describe, expect, it } from 'vitest';
import { parseQuickGrades } from '../js/core/onboarding.js';

describe('parseQuickGrades', () => {
  it.each([
    ['A B A A A', { chinese:'A', english:'B', math:'A', social:'A', science:'A' }],
    ['A,B,A,A,A', { chinese:'A', english:'B', math:'A', social:'A', science:'A' }],
    ['A+ B++ A A+ B', { chinese:'A+', english:'B++', math:'A', social:'A+', science:'B' }]
  ])('parses %s in subject order', (input, grades) => {
    expect(parseQuickGrades(input)).toEqual({ ok:true, grades });
  });

  it.each(['A B A A', 'A B A A A B', 'A B Z A A'])('rejects invalid quick input %s', input => {
    const result = parseQuickGrades(input);
    expect(result.ok).toBe(false);
    expect(result.error).toBeTruthy();
  });
});
