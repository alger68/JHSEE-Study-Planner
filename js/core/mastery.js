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

const ENGLISH_REQUIRED_TOPICS = ['vocabulary', 'grammar', 'cloze', 'reading', 'listening'];

export function getEnglishStage(topicSummaries = {}, timedSummary = null, weeklyEnglish = []) {
  const required = ENGLISH_REQUIRED_TOPICS.map(topic => topicSummaries?.[topic]).filter(Boolean);
  if (required.length !== ENGLISH_REQUIRED_TOPICS.length || required.some(summary => (summary.sampleSize ?? 0) < 5)) {
    return 'Diagnose';
  }

  const stable = required.every(summary => (summary.sampleSize ?? 0) >= 20 && (summary.accuracy ?? 0) >= 75);
  if (!stable) return 'Stabilize';

  const mixed = topicSummaries?.mixed;
  if (!mixed || (mixed.sampleSize ?? 0) < 30 || (mixed.accuracy ?? 0) < 80) return 'Mixed';

  if (!timedSummary || (timedSummary.sampleSize ?? 0) < 30 || (timedSummary.accuracy ?? 0) < 80) return 'Timed';

  const recentWeeks = (Array.isArray(weeklyEnglish) ? weeklyEnglish : []).slice(-3);
  const maintained = recentWeeks.length === 3 && recentWeeks.every(entry => (entry.accuracy ?? 0) >= 80);
  return maintained ? 'Maintain' : 'Timed';
}
