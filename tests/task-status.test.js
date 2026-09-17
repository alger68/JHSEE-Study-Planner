import { describe, expect, it } from 'vitest';
import { summarizeDay, startTask, skipTask } from '../js/core/task-status.js';

const tasks = [
  { id:'a', status:'completed', plannedMinutes:20 },
  { id:'b', status:'active', plannedMinutes:25, startedAt:'old' },
  { id:'c', status:'pending', plannedMinutes:15 },
  { id:'d', status:'skipped', plannedMinutes:10 }
];

describe('daily task status', () => {
  it('counts only pending and active minutes as remaining', () => {
    expect(summarizeDay(tasks)).toMatchObject({ total:4, completed:1, skipped:1, remainingMinutes:40, completionRate:25 });
  });

  it('keeps only one active task', () => {
    const result = startTask(tasks, 'c', '2026-09-17T06:00:00Z');
    expect(result.find(t => t.id === 'b').status).toBe('pending');
    expect(result.find(t => t.id === 'b').startedAt).toBeUndefined();
    expect(result.find(t => t.id === 'c')).toMatchObject({ status:'active', startedAt:'2026-09-17T06:00:00Z' });
  });

  it('marks a task skipped and stores an optional reason', () => {
    expect(skipTask(tasks, 'c', '沒時間').find(t => t.id === 'c')).toMatchObject({ status:'skipped', skipReason:'沒時間' });
  });
});
