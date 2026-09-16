import { expect, it } from 'vitest';
import { createReviewItem, getDueReviews, recordReviewResult } from '../js/core/spaced-review.js';

it('schedules first redo for next day', () => {
  const item = createReviewItem({ itemId:'q1', subject:'english', topic:'grammar' }, '2026-09-16');
  expect(item.nextReviewAt).toBe('2026-09-17');
  expect(item.stage).toBe(0);
});

it('advances on correct and resets on wrong', () => {
  const item = createReviewItem({ itemId:'q1', subject:'english', topic:'grammar' }, '2026-09-16');
  const advanced = recordReviewResult(item, true, '2026-09-17');
  expect(advanced.nextReviewAt).toBe('2026-09-20');
  const reset = recordReviewResult(advanced, false, '2026-09-20');
  expect(reset.stage).toBe(0);
  expect(reset.lapseCount).toBe(1);
  expect(reset.nextReviewAt).toBe('2026-09-21');
});

it('marks mastered after completing the +14 stage', () => {
  let item = createReviewItem({ itemId:'q1', subject:'english', topic:'grammar' }, '2026-09-01');
  for (const date of ['2026-09-02','2026-09-05','2026-09-12','2026-09-26']) {
    item = recordReviewResult(item, true, date);
  }
  expect(item.mastered).toBe(true);
  expect(item.nextReviewAt).toBe('2026-10-26');
});

it('returns due items ordered by due date then lapse count', () => {
  const items = [
    { ...createReviewItem({ itemId:'b', subject:'math', topic:'x' }, '2026-09-15'), lapseCount:2 },
    { ...createReviewItem({ itemId:'a', subject:'english', topic:'x' }, '2026-09-15'), lapseCount:0 },
    createReviewItem({ itemId:'c', subject:'science', topic:'x' }, '2026-09-20')
  ];
  expect(getDueReviews(items, '2026-09-16').map(item => item.itemId)).toEqual(['b','a']);
});
