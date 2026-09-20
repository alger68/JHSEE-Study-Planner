import { describe, expect, it } from 'vitest';
import { parseQuickGrades } from '../js/core/onboarding.js';

describe('lazy quick start grade parser', () => {
  it.each([
    ['A B A A A', { chinese:'A', english:'B', math:'A', social:'A', science:'A' }],
    ['A,B,A,A,A', { chinese:'A', english:'B', math:'A', social:'A', science:'A' }],
    ['A+ B++ A A+ B', { chinese:'A+', english:'B++', math:'A', social:'A+', science:'B' }]
  ])('parses %s in subject order', (input, grades) => {
    expect(parseQuickGrades(input)).toEqual({ ok:true, grades });
  });

  it('rejects fewer or more than five grades', () => {
    expect(parseQuickGrades('A B A A').ok).toBe(false);
    expect(parseQuickGrades('A B A A A B').ok).toBe(false);
  });

  it('rejects invalid grade tokens', () => {
    expect(parseQuickGrades('A D A A A').ok).toBe(false);
  });
});
