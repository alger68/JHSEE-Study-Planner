function clamp(value) {
  return Math.max(0, Math.min(1, Number(value) || 0));
}

function daysBetween(from, to) {
  const a = new Date(`${from}T00:00:00Z`);
  const b = new Date(`${to}T00:00:00Z`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0;
  return Math.max(0, Math.floor((b - a) / 86400000));
}

export function calculatePriority({ weakness = 0, overdue = 0, negativeTrend = 0, upcomingExamWeight = 0 }) {
  return 0.40 * clamp(weakness)
       + 0.25 * clamp(overdue)
       + 0.20 * clamp(negativeTrend)
       + 0.15 * clamp(upcomingExamWeight);
}

export function rankSubjects(subjectInputs) {
  return Object.entries(subjectInputs ?? {})
    .map(([subject, score]) => ({ subject, score: clamp(score) }))
    .sort((a, b) => b.score - a.score || a.subject.localeCompare(b.subject));
}

export function applyMaintenanceBoost(priorities, lastTouchedBySubject, today) {
  return Object.fromEntries(Object.entries(priorities ?? {}).map(([subject, rawScore]) => {
    const score = clamp(rawScore);
    const last = lastTouchedBySubject?.[subject];
    if (!last) return [subject, clamp(score + 0.20)];
    const days = daysBetween(last, today);
    const boost = days >= 14 ? 0.20 : days >= 7 ? 0.10 : 0;
    return [subject, clamp(score + boost)];
  }));
}
