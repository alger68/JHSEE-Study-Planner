export const EXPORT_SCHEMA = 'jhsee-study-planner/v1';
export const PRACTICE_SCHEMA = 'jhsee-practice-summary/v1';

const PLANNER_FIELDS = [
  'profile', 'diagnostics', 'settings', 'dailyTasks', 'practiceLogs',
  'reviewSchedule', 'miniChecks', 'mastery', 'ui'
];

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('invalid JSON');
  }
}

export function exportPlannerData(data = {}) {
  const safe = Object.fromEntries(PLANNER_FIELDS
    .filter(key => Object.prototype.hasOwnProperty.call(data, key))
    .map(key => [key, data[key]]));
  return JSON.stringify({ schema: EXPORT_SCHEMA, data: safe }, null, 2);
}

export function parsePlannerImport(text) {
  const parsed = parseJson(text);
  if (parsed?.schema !== EXPORT_SCHEMA) throw new Error('unsupported schema');
  const data = parsed.data && typeof parsed.data === 'object' ? parsed.data : {};
  const safe = Object.fromEntries(PLANNER_FIELDS
    .filter(key => Object.prototype.hasOwnProperty.call(data, key))
    .map(key => [key, data[key]]));
  return { schema: EXPORT_SCHEMA, data: safe };
}

export function parseExternalPracticeImport(text) {
  const parsed = parseJson(text);
  if (parsed?.schema !== PRACTICE_SCHEMA) throw new Error('unsupported schema');
  if (!Array.isArray(parsed.records)) throw new Error('invalid practice records');

  return parsed.records.flatMap((record, recordIndex) => {
    const correct = Number(record.correct);
    const total = Number(record.total);
    const valid = /^\d{4}-\d{2}-\d{2}$/.test(record.date ?? '')
      && typeof record.subject === 'string' && record.subject
      && typeof record.topic === 'string' && record.topic
      && Number.isInteger(correct) && Number.isInteger(total)
      && total > 0 && correct >= 0 && correct <= total;
    if (!valid) throw new Error('invalid practice record');

    return Array.from({ length: total }, (_, itemIndex) => ({
      id: `import-${record.date}-${recordIndex + 1}-${itemIndex + 1}`,
      date: record.date,
      subject: record.subject,
      topic: record.topic,
      correct: itemIndex < correct,
      source: 'external-import'
    }));
  });
}
