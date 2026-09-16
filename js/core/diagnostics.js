import { SUBJECTS } from '../config/subjects.js';

export const GRADE_BASELINE = {
  'A++': 0.10,
  'A+': 0.18,
  'A': 0.28,
  'B++': 0.45,
  'B+': 0.58,
  'B': 0.70,
  'C': 0.90
};

export function validateDiagnostic(record) {
  const errors = [];
  if (!record || typeof record !== 'object') return { ok: false, errors: ['record is required'] };
  if (!record.id || typeof record.id !== 'string') errors.push('id is required');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.date ?? '')) errors.push('date must be YYYY-MM-DD');
  if (!record.subjects || typeof record.subjects !== 'object') {
    errors.push('subjects are required');
  } else {
    for (const subject of SUBJECTS) {
      const grade = record.subjects?.[subject]?.grade;
      if (!(grade in GRADE_BASELINE)) errors.push(`${subject} grade is invalid`);
    }
  }
  if (record.writingLevel != null) {
    if (!Number.isInteger(record.writingLevel) || record.writingLevel < 1 || record.writingLevel > 6) {
      errors.push('writingLevel must be null or an integer from 1 to 6');
    }
  }
  return { ok: errors.length === 0, errors };
}

export function baselineFromDiagnostic(record) {
  const result = validateDiagnostic(record);
  if (!result.ok) throw new Error(`invalid diagnostic: ${result.errors.join(', ')}`);
  return Object.fromEntries(SUBJECTS.map(subject => [subject, GRADE_BASELINE[record.subjects[subject].grade]]));
}

export function latestBaseline(records) {
  const valid = (Array.isArray(records) ? records : [])
    .filter(record => validateDiagnostic(record).ok)
    .sort((a, b) => b.date.localeCompare(a.date));
  if (valid.length === 0) return Object.fromEntries(SUBJECTS.map(subject => [subject, 0.50]));
  return baselineFromDiagnostic(valid[0]);
}
