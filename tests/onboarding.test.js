import { describe, expect, it } from 'vitest';
import { isBrandNewUser, needsV11Nudge, completeOnboarding } from '../js/core/onboarding.js';

describe('V1.1 onboarding', () => {
  it('forces onboarding only for an empty planner', () => {
    expect(isBrandNewUser({ settings:{}, diagnostics:[], dailyTasks:[], practiceLogs:[], miniChecks:[] })).toBe(true);
  });

  it('does not block a V1 user with existing diagnostics', () => {
    const snapshot = { settings:{}, diagnostics:[{ id:'d1' }], dailyTasks:[], practiceLogs:[], miniChecks:[] };
    expect(isBrandNewUser(snapshot)).toBe(false);
    expect(needsV11Nudge(snapshot)).toBe(true);
  });

  it('does not nudge an already completed V1.1 user', () => {
    const snapshot = { settings:{ onboardingCompleted:true }, diagnostics:[], dailyTasks:[], practiceLogs:[], miniChecks:[] };
    expect(isBrandNewUser(snapshot)).toBe(false);
    expect(needsV11Nudge(snapshot)).toBe(false);
  });

  it('treats an existing daily-minute setting as old V1 data', () => {
    expect(isBrandNewUser({ settings:{ dailyMinutes:75 }, diagnostics:[], dailyTasks:[], practiceLogs:[], miniChecks:[] })).toBe(false);
  });

  it('preserves existing settings while marking V1.1 complete', () => {
    expect(completeOnboarding({ dailyMinutes:60, currentScopes:{ math:'第三冊' } }, { nextExamLabel:'二模' })).toEqual({
      dailyMinutes:60,
      currentScopes:{ math:'第三冊' },
      nextExamLabel:'二模',
      onboardingCompleted:true,
      onboardingVersion:'1.1'
    });
  });
});
