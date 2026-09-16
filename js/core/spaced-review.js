export const REVIEW_DELAYS = [1, 3, 7, 14, 30];

function addDays(dateText, days) {
  const d = new Date(`${dateText}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) throw new Error('invalid date');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function createReviewItem(input, date) {
  if (!input?.itemId || !input?.subject) throw new Error('itemId and subject are required');
  return {
    ...input,
    firstWrongAt: date,
    stage: 0,
    nextReviewAt: addDays(date, REVIEW_DELAYS[0]),
    lapseCount: 0,
    lastResult: 'wrong',
    mastered: false,
    deleted: false
  };
}

export function recordReviewResult(item, correct, date) {
  if (!item) throw new Error('review item is required');
  if (typeof correct !== 'boolean') throw new Error('correct must be boolean');

  if (!correct) {
    return {
      ...item,
      stage: 0,
      nextReviewAt: addDays(date, REVIEW_DELAYS[0]),
      lapseCount: (item.lapseCount ?? 0) + 1,
      lastResult: 'wrong',
      mastered: false
    };
  }

  const currentStage = Number.isInteger(item.stage) ? item.stage : 0;
  const nextStage = Math.min(currentStage + 1, REVIEW_DELAYS.length - 1);
  const mastered = nextStage >= 4;
  return {
    ...item,
    stage: nextStage,
    nextReviewAt: addDays(date, REVIEW_DELAYS[nextStage]),
    lastResult: 'correct',
    mastered
  };
}

export function getDueReviews(items, date) {
  return (Array.isArray(items) ? items : [])
    .filter(item => !item.deleted && typeof item.nextReviewAt === 'string' && item.nextReviewAt <= date)
    .sort((a, b) => a.nextReviewAt.localeCompare(b.nextReviewAt) || (b.lapseCount ?? 0) - (a.lapseCount ?? 0));
}
