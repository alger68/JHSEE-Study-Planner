import { describe, expect, it } from 'vitest';
import { isBrandNewUser, needsV11Nudge } from '../js/core/onboarding.js';
import { summarizeDay, startTask, skipTask } from '../js/core/task-status.js';
import { explainTask } from '../js/core/task-explainer.js';

describe('V1.1 daily learning acceptance', () => {
  it('keeps existing V1 users out of forced onboarding', () => {
    const snapshot={settings:{dailyMinutes:75},diagnostics:[],dailyTasks:[],practiceLogs:[],miniChecks:[]};
    expect(isBrandNewUser(snapshot)).toBe(false);
    expect(needsV11Nudge(snapshot)).toBe(true);
  });

  it('summarizes remaining planned work and supports start then skip', () => {
    const base=[{id:'e',subject:'english',status:'pending',plannedMinutes:30},{id:'m',subject:'math',status:'pending',plannedMinutes:15}];
    const active=startTask(base,'e','2026-09-17T00:00:00Z');
    expect(summarizeDay(active).remainingMinutes).toBe(45);
    const skipped=skipTask(active,'m','沒時間');
    expect(summarizeDay(skipped).remainingMinutes).toBe(30);
  });

  it('explains English priority from a 4A1B diagnostic', () => {
    const reasons=explainTask({subject:'english',type:'weakness-drill'},{latestGrades:{chinese:'A',english:'B',math:'A',social:'A',science:'A'},priorities:{english:.7,chinese:.28,math:.28,social:.28,science:.28},mastery:{},dueCounts:{},currentScopes:{},staleDays:{}});
    expect(reasons).toEqual(expect.arrayContaining(['最近一次模考英語為 B','英語目前為最高優先科']));
  });
});
