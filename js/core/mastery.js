function validPracticeLog(log) {
  return log && typeof log.subject === 'string' && typeof log.correct === 'boolean';
}

function toDay(value) {
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function classifyMastery({ sampleSize, accuracy }) {
  if (sampleSize < 5) return 'insufficient';
  if (accuracy < 60) return 'weak';
  if (accuracy < 75) return 'needs-work';
  if (accuracy < 85) return 'stable';
  return 'maintain';
}

export function summarizeTopic(logs, subject, topic) {
  const matching = (Array.isArray(logs) ? logs : []).filter(
    log => validPracticeLog(log) && log.subject === subject && log.topic === topic
  );
  const correct = matching.filter(log => log.correct).length;
  const sampleSize = matching.length;
  const accuracy = sampleSize === 0 ? 0 : (correct / sampleSize) * 100;
  return { sampleSize, correct, accuracy, state: classifyMastery({ sampleSize, accuracy }) };
}

export function summarizeSubjectRecent(logs, subject, now, days = 30) {
  const nowDate = toDay(now);
  if (!nowDate) return { sampleSize: 0, correct: 0, accuracy: 0 };
  const start = new Date(nowDate);
  start.setUTCDate(start.getUTCDate() - Math.max(0, days));
  const matching = (Array.isArray(logs) ? logs : []).filter(log => {
    if (!validPracticeLog(log) || log.subject !== subject) return false;
    const logDate = toDay(log.date ?? log.completedAt?.slice?.(0, 10));
    return logDate && logDate >= start && logDate <= nowDate;
  });
  const correct = matching.filter(log => log.correct).length;
  const sampleSize = matching.length;
  const accuracy = sampleSize === 0 ? 0 : (correct / sampleSize) * 100;
  return { sampleSize, correct, accuracy };
}
