const LABELS = { chinese:'國文', english:'英語', math:'數學', social:'社會', science:'自然' };

function topSubject(priorities = {}) {
  return Object.entries(priorities).sort((a,b) => b[1] - a[1])[0]?.[0] ?? null;
}

export function explainTask(task = {}, context = {}) {
  const subject = task.subject;
  const label = LABELS[subject] ?? subject ?? '此科';
  const reasons = [];
  const grade = context.latestGrades?.[subject];
  if (grade) reasons.push(`最近一次模考${label}為 ${grade}`);
  if (subject && topSubject(context.priorities) === subject) reasons.push(`${label}目前為最高優先科`);

  const masteryEntries = Object.entries(context.mastery ?? {})
    .filter(([, value]) => Number(value?.sampleSize) >= 5 && Number.isFinite(Number(value?.accuracy)))
    .sort((a,b) => Number(a[1].accuracy) - Number(b[1].accuracy));
  if (task.type === 'weakness-drill' && masteryEntries.length) {
    const [topic, summary] = masteryEntries[0];
    reasons.push(`${topic} 最近正確率 ${Math.round(Number(summary.accuracy))}%`);
  }

  const due = Number(context.dueCounts?.[subject]) || 0;
  if (due > 0) reasons.push(`今天有 ${due} 題${label}錯題到期`);
  if (context.currentScopes?.[subject]) reasons.push(`目前學校進度：${context.currentScopes[subject]}`);
  const stale = Number(context.staleDays?.[subject]);
  if (Number.isFinite(stale) && stale >= 7) reasons.push(`${label}已 ${stale} 天未複習`);

  return [...new Set(reasons)].slice(0,4);
}
