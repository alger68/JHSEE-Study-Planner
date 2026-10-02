'use strict';
const {test}=require('node:test'),A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {JSDOM,VirtualConsole}=require('jsdom');
const source=fs.readFileSync(path.join(__dirname,'../../index.html'),'utf8');
const full=require('../build-complete.cjs').build(source);
const built=require('../build-web.cjs').build(full);
const key='jh-study-notes.progress.v1';
function open(hash='#/learn?g=7&term=1',progress){
 const calls=[],errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(built.html,{url:'https://notes.test/'+hash,runScripts:'dangerously',virtualConsole:vc,beforeParse(w){
  w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.requestAnimationFrame=f=>{f();return 0;};
  w.fetch=async file=>{calls.push(file);return {ok:true,text:async()=>built.files[file]};};
  if(progress)w.localStorage.setItem(key,JSON.stringify(progress));
 }});return {dom,w:dom.window,d:dom.window.document,calls,errors};
}
async function until(fn){for(let i=0;i<200;i++){if(fn())return;await new Promise(r=>setTimeout(r,5));}A.ok(fn(),'requested learning view was not reached');}
test('seventh-grade learning opens the right semester without downloading the whole question bank',async()=>{
 const b=open();try{
  A.ok(b.d.querySelector('[data-view="learn"]'),'learning route must render its own learning page');
  A.equal(b.calls.length,0);A.equal(b.d.querySelector('[data-learning-grade]').textContent,'7年級上學期');
  A.equal(b.d.querySelector('[data-learning-course="115-1-7-math"] [data-next-unit]').dataset.nextUnit,'atlas-math-7-1-1');
  A.equal(b.d.querySelector('[data-learning-course="115-1-7-english"] [data-next-unit]').dataset.nextUnit,'school-en-115-7-get-ready');
  A.ok(b.d.querySelector('[data-learning-course="115-1-7-chinese"] [data-reading-guide]'));
  b.d.querySelector('[data-learning-course="115-1-7-math"] a[data-learn-read]').click();
  await until(()=>b.d.querySelector('#unit-content'));A.equal(b.calls.length,1);
  A.match(b.d.querySelector('h1').textContent,/負數與數線/);A.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});
test('saved wrong fixed questions take priority and open their exact feedback without erasing answers',async()=>{
 const first=built.data.units.find(u=>u.id==='atlas-math-7-1-1'),second=built.data.units.find(u=>u.id==='atlas-math-7-1-2');
 const answers=Object.fromEntries(first.quiz.map(q=>[first.id+'/'+q.id,q.answer]));
 const wrong=second.quiz[0];answers[second.id+'/'+wrong.id]=wrong.options.find(o=>o.id!==wrong.answer).id;
 const other=built.data.units.find(u=>u.grade===8&&u.subject==='math');answers[other.id+'/'+other.quiz[0].id]=other.quiz[0].options.find(o=>o.id!==other.quiz[0].answer).id;
 const progress={app:'jh-study-notes',schemaVersion:1,read:[first.id],starred:[],answers,font:0},b=open(undefined,progress);
 try{
  A.equal(b.d.querySelector('[data-fixed-wrong-count]')?.textContent,'1');
  A.equal(b.d.querySelector('[data-learning-course="115-1-7-math"] [data-next-unit]').dataset.nextUnit,'atlas-math-7-1-2');
  A.equal(b.w.localStorage.getItem(key),JSON.stringify(progress));A.equal(b.calls.length,0);
  b.d.querySelector('[data-correction-link]').click();await until(()=>b.d.querySelector('[data-feedback]'));
  A.ok(b.d.querySelector('[data-feedback]').classList.contains('wrong'));A.equal(b.w.localStorage.getItem(key),JSON.stringify(progress));
  b.d.querySelector('[data-action="retry-wrong"]').click();A.equal(b.d.querySelectorAll('[data-feedback]').length,0);
  b.d.querySelector('[data-option="'+wrong.answer+'"]').click();b.d.querySelector('[data-action="submit-answer"]').click();
  b.d.querySelector('[data-action="next-question"]').click();A.ok(b.d.querySelector('[data-quiz-result]'));
  b.w.location.hash='#/learn?g=7&term=1';await until(()=>b.d.querySelector('[data-view="learn"]'));
  A.equal(b.d.querySelector('[data-fixed-wrong-count]').textContent,'0');
  const saved=JSON.parse(b.w.localStorage.getItem(key));A.equal(saved.answers[other.id+'/'+other.quiz[0].id],answers[other.id+'/'+other.quiz[0].id]);
  for(const q of first.quiz)A.equal(saved.answers[first.id+'/'+q.id],q.answer);
  b.d.querySelector('[data-learning-course="115-1-7-math"] a[href*="/quiz"]').click();
  await until(()=>b.d.querySelector('[data-option]:not(:disabled)'));
  A.equal(b.d.querySelectorAll('[data-quiz-result]').length,0);
  A.equal(JSON.parse(b.w.localStorage.getItem(key)).answers[second.id+'/'+wrong.id],wrong.answer);
  A.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});
test('each subject retains its own source year and historical fixed mistakes',()=>{
 const c=built.data.atlas.courses.find(c=>c.id==='114-1-8-history'),u=built.data.units.find(u=>u.id===c.sections[0].unitId),q=u.quiz[0];
 const progress={app:'jh-study-notes',schemaVersion:1,read:[],starred:[],answers:{[u.id+'/'+q.id]:q.options.find(o=>o.id!==q.answer).id},font:0};
 const b=open('#/learn?g=8&term=1',progress);try{
  A.equal(b.d.querySelector('[data-fixed-wrong-count]').textContent,'1');
  A.ok(b.d.querySelector('[data-learning-course="115-1-8-math"]'));
  A.match(b.d.querySelector('[data-learning-course="114-1-8-history"]')?.textContent||'',/114學年度/);
  A.ok(b.d.querySelector('[data-correction-link]')?.href.includes(u.id));
  A.equal(b.w.localStorage.getItem(key),JSON.stringify(progress));A.equal(b.calls.length,0);
 }finally{b.dom.window.close();}
});
test('unread units and read-only marks are not claimed as mastered; invalid scopes are rejected',()=>{
 const b=open('#/learn?g=12&term=1');try{A.ok(b.d.querySelector('[data-learning-invalid]'));A.equal(b.d.querySelectorAll('[data-next-unit]').length,0);A.equal(b.calls.length,0);}finally{b.dom.window.close();}
 const first=built.data.units.find(u=>u.id==='atlas-math-7-1-1');
 const c=open(undefined,{app:'jh-study-notes',schemaVersion:1,read:[first.id],starred:[],answers:{},font:0});
 try{A.equal(c.d.querySelector('[data-learning-course="115-1-7-math"] [data-next-unit]')?.dataset.nextUnit,first.id);A.equal(c.d.querySelector('[data-fixed-wrong-count]')?.textContent,'0');A.doesNotMatch(c.d.querySelector('[data-learning-course="115-1-7-math"]').textContent,/已熟練|100%/);}finally{c.dom.window.close();}
});
