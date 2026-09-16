function numericAccuracy(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function subjectTrend(miniChecks, subject) {
  const points = (Array.isArray(miniChecks) ? miniChecks : [])
    .map(check => ({ week: check.week, accuracy: numericAccuracy(check.subjects?.[subject]?.accuracy) }))
    .filter(point => point.accuracy != null)
    .sort((a, b) => String(a.week).localeCompare(String(b.week)));
  if (points.length < 2) return { status: 'insufficient' };
  const previous = points.at(-2).accuracy;
  const latest = points.at(-1).accuracy;
  const delta = latest - previous;
  return {
    status: 'ready',
    delta,
    direction: delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat',
    previous,
    latest
  };
}

export function topWeakTopics(masteries, limit = 3) {
  const values = Array.isArray(masteries) ? masteries : Object.values(masteries ?? {});
  return values
    .filter(item => item && item.state !== 'insufficient' && numericAccuracy(item.accuracy) != null)
    .sort((a, b) => a.accuracy - b.accuracy || String(a.topic).localeCompare(String(b.topic)))
    .slice(0, limit);
}

export function fastestImprovingTopics(topicSeries, limit = 3) {
  return Object.entries(topicSeries ?? {})
    .map(([topic, rawPoints]) => {
      const points = (Array.isArray(rawPoints) ? rawPoints : [])
        .map(point => numericAccuracy(typeof point === 'number' ? point : point?.accuracy))
        .filter(value => value != null);
      if (points.length < 2) return null;
      return { topic, delta: points.at(-1) - points[0], latest: points.at(-1) };
    })
    .filter(Boolean)
    .sort((a, b) => b.delta - a.delta || a.topic.localeCompare(b.topic))
    .slice(0, limit);
}
