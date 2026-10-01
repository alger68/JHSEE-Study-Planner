'use strict';
const {test}=require('node:test'),A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM,VirtualConsole}=require('jsdom');
const root=path.join(__dirname,'..');
test('compiled V2 supports school filters, original notes, graded quizzes and persisted bookmarks',async()=>{
 const html=require('../build-complete.cjs').build(fs.readFileSync(path.join(root,'../index.html'),'utf8'));
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{url:'https://notes.test/#/home',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};}});
 const w=dom.window,d=w.document;
 const route=async h=>{w.location.hash=h;await new Promise(resolve=>w.setTimeout(resolve,10));};
 try{
  A.ok(d.querySelector('.home-welcome'));A.ok(d.querySelector('[aria-label="教材建置狀態"]'));
  for(const grade of [7,8,9])for(const term of [1,2])for(const subject of w.STUDY_DATA.subjects){
   await route(`#/library?g=${grade}&s=${subject.id}&term=${term}`);
   const courses=w.STUDY_DATA.atlas.courses.filter(c=>c.grade===grade&&c.bucket===subject.id&&c.term===term);
   A.equal(d.querySelectorAll('[data-curriculum-section]').length,courses.reduce((n,c)=>n+c.sections.length,0),`${grade}/${term}/${subject.id}`);
   A.equal(d.querySelector('#library-grade').value,String(grade));A.equal(d.querySelector('#library-term').value,String(term));
  }
  await route('#/atlas?g=7&s=chinese&period=115-1');
  const readingCount=w.STUDY_DATA.atlas.courses.find(c=>c.id==='115-1-7-chinese').readingGuideSections;
  A.ok(readingCount>0);A.ok(d.querySelector('.atlas-course-head').textContent.includes(`另有${readingCount}節原創閱讀導引`));
  await route('#/library?g=7&s=chinese&term=1');
  A.doesNotMatch(d.querySelector('.curriculum-course').textContent,/另有\d+節原創閱讀導引/);
  await route('#/library?g=7&s=english&term=1');
  const link=d.querySelector('[data-curriculum-section] a[href$="/notes"]');A.ok(link);link.click();
  await new Promise(resolve=>w.setTimeout(resolve,20));A.ok(d.querySelector('#unit-content'));
  const uid=w.location.hash.split('/')[2],unit=w.STUDY_DATA.units.find(u=>u.id===uid);
  d.querySelector('[data-star]').click();A.equal(d.querySelector('[data-star]').getAttribute('aria-pressed'),'true');
  await route(`#/unit/${uid}/quiz`);
  for(const q of unit.quiz){
   d.querySelector(`[data-option="${q.answer}"]`).click();d.querySelector('[data-action="submit-answer"]').click();
   A.ok(d.querySelector('[data-feedback]'));d.querySelector('[data-action="next-question"]').click();
  }
  A.equal(d.querySelector('.result-score').textContent,`${unit.quiz.length} / ${unit.quiz.length}`);
  await route('#/home');await route(`#/unit/${uid}/notes`);
  A.equal(d.querySelector('[data-star]').getAttribute('aria-pressed'),'true');A.ok(w.localStorage.length>0);
  const codeUnit=w.STUDY_DATA.units.find(u=>u.quiz.some(q=>q.question.includes('\n    ')));A.ok(codeUnit);
  await route(`#/practice?unit=${codeUnit.id}&n=8&seed=code-format`);
  const codeQuestion=[...d.querySelectorAll('.practice-card h3')].find(e=>e.textContent.includes('\n    '));
  A.ok(codeQuestion);A.equal(w.getComputedStyle(codeQuestion).whiteSpace,'pre-wrap');
  await route('#/atlas?g=7&s=pe&period=115-1');
  A.match(d.querySelector('#main').textContent,/PDF頁碼待核對/);A.doesNotMatch(d.querySelector('#main').textContent,/PDF第null頁/);
  A.deepEqual(errors,[]);
 }finally{w.close();}
});
