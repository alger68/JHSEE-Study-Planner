import { expect, it } from 'vitest';
import { baselineFromDiagnostic, latestBaseline, validateDiagnostic } from '../js/core/diagnostics.js';

const diagnostic = {
  id: 'mock-1', date: '2026-09-16', label: '第一次模擬考', scope: '第一次模考範圍',
  subjects: {
    chinese: { grade: 'A' }, english: { grade: 'B' }, math: { grade: 'A' },
    social: { grade: 'A' }, science: { grade: 'A' }
  }, writingLevel: null
};

it('maps grades to weakness baselines', () => {
  expect(baselineFromDiagnostic(diagnostic).english).toBe(0.70);
  expect(baselineFromDiagnostic(diagnostic).math).toBe(0.28);
});

it('rejects unknown grade', () => {
  const bad = structuredClone(diagnostic);
  bad.subjects.english.grade = 'D';
  expect(validateDiagnostic(bad).ok).toBe(false);
});

it('accepts null or 1-6 writing level only', () => {
  expect(validateDiagnostic({ ...diagnostic, writingLevel: 4 }).ok).toBe(true);
  expect(validateDiagnostic({ ...diagnostic, writingLevel: 7 }).ok).toBe(false);
});

it('uses latest valid diagnostic and falls back to neutral baseline', () => {
  const older = structuredClone(diagnostic);
  older.date = '2026-08-01';
  older.subjects.english.grade = 'B+';
  expect(latestBaseline([older, diagnostic]).english).toBe(0.70);
  expect(latestBaseline([]).science).toBe(0.50);
});
