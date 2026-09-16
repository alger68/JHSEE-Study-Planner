import { expect, it } from 'vitest';
import { classifyMastery, summarizeSubjectRecent, summarizeTopic } from '../js/core/mastery.js';

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
