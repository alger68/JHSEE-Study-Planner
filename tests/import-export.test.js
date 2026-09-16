import { expect, it } from 'vitest';
import { exportPlannerData, parseExternalPracticeImport, parsePlannerImport } from '../js/core/import-export.js';

it('round-trips planner export', () => {
  const json = exportPlannerData({ diagnostics:[], miniChecks:[] });
  const parsed = parsePlannerImport(json);
  expect(parsed.schema).toBe('jhsee-study-planner/v1');
  expect(parsed.data.diagnostics).toEqual([]);
});

it('rejects unknown schema', () => {
  expect(() => parsePlannerImport('{"schema":"jhsee-all-subjects/v1"}')).toThrow('unsupported schema');
});

it('converts external practice summary to practice logs', () => {
  const text = JSON.stringify({
    schema:'jhsee-practice-summary/v1',
    records:[{ date:'2026-09-17', subject:'english', topic:'grammar', correct:7, total:10 }]
  });
  const logs = parseExternalPracticeImport(text);
  expect(logs).toHaveLength(10);
  expect(logs.filter(log => log.correct)).toHaveLength(7);
});

it('rejects invalid correct and total values', () => {
  const text = JSON.stringify({
    schema:'jhsee-practice-summary/v1',
    records:[{ date:'2026-09-17', subject:'english', topic:'grammar', correct:11, total:10 }]
  });
  expect(() => parseExternalPracticeImport(text)).toThrow('invalid practice record');
});

it('rejects planner backup with invalid field types', () => {
  const text=JSON.stringify({schema:'jhsee-study-planner/v1',data:{dailyTasks:'not-an-array'}});
  expect(()=>parsePlannerImport(text)).toThrow('invalid planner data');
});

it('rejects external practice records with unknown subject', () => {
  const text=JSON.stringify({schema:'jhsee-practice-summary/v1',records:[{date:'2026-09-17',subject:'unknown',topic:'x',correct:1,total:1}]});
  expect(()=>parseExternalPracticeImport(text)).toThrow('invalid practice record');
});
