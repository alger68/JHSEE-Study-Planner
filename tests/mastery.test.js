import { expect, it } from 'vitest';
import { classifyMastery, getEnglishStage, summarizeSubjectRecent, summarizeTopic } from '../js/core/mastery.js';

it('does not label weakness below five samples', () => {
  expect(classifyMastery({ sampleSize: 4, accuracy: 25 })).toBe('insufficient');
});

it('classifies mastery bands', () => {
  expect(classifyMastery({ sampleSize: 5, accuracy: 40 })).toBe('weak');
  expect(classifyMastery({ sampleSize: 10, accuracy: 70 })).toBe('needs-work');
  expect(classifyMastery({ sampleSize: 10, accuracy: 80 })).toBe('stable');
  expect(classifyMastery({ sampleSize: 10, accuracy: 90 })).toBe('maintain');
});

it('summarizes only valid matching topic logs', () => {
  const logs = [
    { subject:'english', topic:'grammar', correct:true, date:'2026-09-10' },
    { subject:'english', topic:'grammar', correct:false, date:'2026-09-11' },
    { subject:'english', topic:'reading', correct:false, date:'2026-09-11' },
    { subject:'english', topic:'grammar', correct:'yes', date:'2026-09-12' }
  ];
  expect(summarizeTopic(logs, 'english', 'grammar')).toMatchObject({ sampleSize:2, correct:1, accuracy:50, state:'insufficient' });
});

it('limits recent subject summary to 30 days', () => {
  const logs = [
    { subject:'english', topic:'grammar', correct:true, date:'2026-09-15' },
    { subject:'english', topic:'grammar', correct:false, date:'2026-07-01' }
  ];
  expect(summarizeSubjectRecent(logs, 'english', '2026-09-16', 30)).toMatchObject({ sampleSize:1, correct:1, accuracy:100 });
});

const fullTopics = {
  vocabulary:{sampleSize:20,accuracy:80}, grammar:{sampleSize:20,accuracy:78},
  cloze:{sampleSize:20,accuracy:76}, reading:{sampleSize:20,accuracy:82}, listening:{sampleSize:20,accuracy:85}
};

it('keeps English in Diagnose until every topic has baseline samples', () => {
  expect(getEnglishStage({ grammar:{sampleSize:5,accuracy:80}, reading:{sampleSize:2,accuracy:90} }, null, [])).toBe('Diagnose');
});

it('moves through Stabilize, Mixed, Timed and Maintain stages', () => {
  const unstable = { ...fullTopics, grammar:{sampleSize:20,accuracy:70} };
  expect(getEnglishStage(unstable, null, [])).toBe('Stabilize');
  expect(getEnglishStage(fullTopics, null, [])).toBe('Mixed');
  expect(getEnglishStage({ ...fullTopics, mixed:{sampleSize:30,accuracy:82} }, null, [])).toBe('Timed');
  expect(getEnglishStage(
    { ...fullTopics, mixed:{sampleSize:30,accuracy:82} },
    { sampleSize:30, accuracy:83 },
    [{accuracy:81},{accuracy:82},{accuracy:84}]
  )).toBe('Maintain');
});
