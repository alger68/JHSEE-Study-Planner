import { expect, it } from 'vitest';
import { baselineFromDiagnostic } from '../js/core/diagnostics.js';
import { calculatePriority } from '../js/core/priority.js';
import { planDay } from '../js/core/study-planner.js';
import { createReviewItem, reviewResultToPracticeLog } from '../js/core/spaced-review.js';
import { classifyMastery } from '../js/core/mastery.js';
import { subjectTrend } from '../js/core/analytics.js';
import { exportPlannerData, parsePlannerImport } from '../js/core/import-export.js';
import { createStorage } from '../js/core/storage.js';

const diagnostic={
  id:'mock-first',date:'2026-09-16',label:'第一次模擬考',scope:'第一次模考範圍',
  subjects:{chinese:{grade:'A'},english:{grade:'B'},math:{grade:'A'},social:{grade:'A'},science:{grade:'A'}},
  writingLevel:null
};

it('4A1B makes English the first weakness drill',()=>{
  const baseline=baselineFromDiagnostic(diagnostic);
  const english=calculatePriority({weakness:baseline.english});
  const a=calculatePriority({weakness:baseline.math});
  const plan=planDay({date:'2026-09-17',dailyMinutes:75,priorities:{chinese:a,english,math:a,social:a,science:a},dueReviews:[],currentScopes:{},recentTouches:{}});
  expect(english).toBeGreaterThan(a);
  expect(plan.tasks.find(t=>t.type==='weakness-drill').subject).toBe('english');
});

it('selects stale current-school scope',()=>{
  const plan=planDay({date:'2026-09-17',dailyMinutes:75,priorities:{english:.8,chinese:.4,math:.39,social:.3,science:.2},dueReviews:[],currentScopes:{chinese:'國文進度',math:'數學進度'},recentTouches:{english:'2026-09-17',chinese:'2026-09-17',math:'2026-09-01',social:'2026-09-17',science:'2026-09-17'}});
  expect(plan.tasks.find(t=>t.type==='current-school')?.subject).toBe('math');
});

it('converts spaced-review result to practice log',()=>{
  const item=createReviewItem({itemId:'eng-g-1',subject:'english',topic:'grammar'},'2026-09-16');
  expect(reviewResultToPracticeLog(item,false,'2026-09-17')).toEqual({date:'2026-09-17',subject:'english',topic:'grammar',correct:false,source:'spaced-review',itemId:'eng-g-1'});
});

it('keeps acceptance rules and foreign storage isolated',()=>{
  expect(classifyMastery({sampleSize:4,accuracy:20})).toBe('insufficient');
  expect(classifyMastery({sampleSize:5,accuracy:20})).toBe('weak');
  expect(subjectTrend([{week:'W1',subjects:{english:{accuracy:68}}}],'english').status).toBe('insufficient');
  expect(subjectTrend([{week:'W1',subjects:{english:{accuracy:68}}},{week:'W2',subjects:{english:{accuracy:74}}}],'english').delta).toBe(6);
  expect(parsePlannerImport(exportPlannerData({diagnostics:[diagnostic]})).data.diagnostics[0].id).toBe('mock-first');
  const map=new Map([['jhsee.v1.settings','foreign']]);
  const fake={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
  createStorage(fake).set('settings',{dailyMinutes:75});
  expect(map.get('jhsee.v1.settings')).toBe('foreign');
  expect(map.has('jhseePlanner.v1.settings')).toBe(true);
});
