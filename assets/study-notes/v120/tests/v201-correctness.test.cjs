'use strict';
const {test}=require('node:test'),A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JSDOM,VirtualConsole}=require('jsdom');
const P=require('../modules/practice-engine.cjs');
const html=require('../build-complete.cjs').build(fs.readFileSync(path.join(__dirname,'../../index.html'),'utf8'));
const box={window:{}};
vm.runInNewContext([...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].find(s=>s[1].includes('window.STUDY_DATA ='))[1],box);
const D=JSON.parse(JSON.stringify(box.window.STUDY_DATA)),KEY='jh-study-notes.practice.v2';
function open(hash,storage={}){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{url:'https://notes.test/'+hash,runScripts:'dangerously',virtualConsole:vc,beforeParse(w){
  w.scrollTo=()=>{};w.print=()=>{};w.confirm=()=>true;w.HTMLElement.prototype.scrollIntoView=()=>{};
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};
  for(const [k,v] of Object.entries(storage))w.localStorage.setItem(k,v);
 }});
 return {dom,w:dom.window,d:dom.window.document,errors};
}
function snapshot(config,deck){return {app:'jh-study-practice-session',schema:1,version:P.VERSION,signature:JSON.stringify(config),deck,selections:{},submitted:false,retry:false};}
function biologyMistakes(){
 const deck=P.generate(D,{unitId:'bio-3-3',count:8,seed:'leaf-structure-test'});
 A.ok(deck.questions.some(q=>q.templateId==='q3'&&q.concept==='leaf-structure'));
 return deck.questions.reduce((s,q)=>P.record(s,q,q.options.find(o=>o.id!==q.answer).id),P.newState());
}
test('original biology mistakes and hyphenated concept statistics survive a backup round trip',()=>{
 const state=biologyMistakes();A.equal(state.mistakes.length,5);
 A.equal(state.conceptStats['bio-3-3#leaf-structure'].wrong,1);
 A.deepEqual(P.validateState(JSON.parse(JSON.stringify(state)),D),state);
});
test('statistics for every real curriculum concept survive beyond the former 1000-key limit',()=>{
 const state=P.newState();
 for(const u of D.units)for(const c of u.concepts)state.conceptStats[u.id+'#'+c.id]={right:1,wrong:0,last:'right'};
 A.ok(Object.keys(state.conceptStats).length>1000);
 A.deepEqual(P.validateState(JSON.parse(JSON.stringify(state)),D),state);
});
test('statistics reject unknown curriculum keys and malformed counters',()=>{
 for(const key of ['missing-unit#c1','bio-3-3#missing-concept','__proto__','math-7-1#c1<script>']){
  const state=P.newState();state.conceptStats=JSON.parse(JSON.stringify({[key]:{right:0,wrong:1,last:'wrong'}}));
  A.throws(()=>P.validateState(state,D),undefined,key);
 }
 for(const stats of [{right:-1,wrong:1,last:'wrong'},{right:0,wrong:1.5,last:'wrong'},{right:10000,wrong:1,last:'wrong'},{right:0,wrong:1,last:'invalid'}]){
  const state=P.newState();state.conceptStats['math-7-1#c1']=stats;A.throws(()=>P.validateState(state,D));
 }
});
test('statistics reject extra fields that could replace the displayed concept identity',()=>{
 const state=P.newState();state.conceptStats['math-7-1#c1']={right:0,wrong:1,last:'wrong',key:'forged-concept'};
 A.throws(()=>P.validateState(state,D));
});
test('exam generation enforces supplied grade, semester and subject without banning unfiltered mixed exams',()=>{
 const cfg={unitIds:['math-7-1'],count:10,seed:'bad-scope'};
 for(const scope of [{grade:9},{semester:2},{subject:'science'}])A.throws(()=>P.examGenerate(D,{...cfg,...scope},P.newState()),/範圍|年級|學期|科目/);
 A.equal(P.examGenerate(D,{...cfg,grade:7,semester:1,subject:'math'},P.newState()).questions.length,10);
 A.equal(P.examGenerate(D,{...cfg,unitIds:['math-7-1','science-7-1']},P.newState()).unitIds.length,2);
});
test('saved single-unit and exam sessions cannot bypass conflicting explicit filters',()=>{
 for(const cfg of [{unitId:'math-7-1',count:8,seed:'saved-scope'},{unitIds:['math-7-1'],count:10,seed:'saved-scope'}]){
  const deck=cfg.unitIds?P.examGenerate(D,cfg,P.newState()):P.generate(D,cfg);
  const valid=snapshot(cfg,deck);A.deepEqual(P.validateSession(valid,D),valid);
  for(const scope of [{grade:9},{semester:2},{subject:'science'}])A.throws(()=>P.validateSession(snapshot({...cfg,...scope},deck),D));
 }
});
test('reloading displayed biology practice retains all saved mistakes',()=>{
 const state=biologyMistakes(),x=open('#/practice?unit=bio-3-3&n=8&seed=leaf-structure-test',{[KEY]:JSON.stringify(state)});
 try{A.match(x.d.querySelector('[data-ac="wrong"]').textContent,/（5）/);A.equal(x.d.querySelector('[data-ac="wrong"]').disabled,false);A.deepEqual(x.errors,[]);}finally{x.w.close();}
});
test('equivalent explicit unit filters resume selections from the original scope-free session signature',()=>{
 const cfg={unitId:'math-8-1',count:8,seed:'legacy-scoped-resume'},deck=P.generate(D,cfg),prior=snapshot(cfg,deck),q=deck.questions[0];
 prior.selections[q.id]=q.options[1].id;
 const x=open('#/practice?g=8&term=1&s=math&unit=math-8-1&n=8&seed=legacy-scoped-resume',{[KEY+'.session']:JSON.stringify(prior)});
 try{
  A.equal(x.d.querySelector(`[data-ac-question="${q.id}"][data-ac-option="${q.options[1].id}"]`).getAttribute('aria-pressed'),'true');
  A.deepEqual(JSON.parse(x.w.localStorage.getItem(KEY+'.session')).deck,deck);A.deepEqual(x.errors,[]);
 }finally{x.w.close();}
});
test('practice links and saved sessions show a range error instead of questions under conflicting controls',()=>{
 const config={unitIds:['math-7-1'],grade:9,semester:2,subject:'science',count:10,seed:'bad-scope'};
 const prior=snapshot(config,P.examGenerate(D,{unitIds:['math-7-1'],count:10,seed:'bad-scope'},P.newState()));
 for(const [hash,storage] of [
  ['#/practice?g=9&term=2&s=science&exam=math-7-1&n=10&seed=bad-scope',{}],
  ['#/practice?g=9&term=2&s=science&exam=math-7-1&n=10&seed=bad-scope',{[KEY+'.session']:JSON.stringify(prior)}],
  ['#/practice?g=9&term=2&s=science&unit=math-7-1&n=8&seed=bad-scope',{}]
 ]){
  const x=open(hash,storage);try{A.equal(x.d.querySelectorAll('.practice-card').length,0);A.match(x.d.querySelector('#main').textContent,/範圍|年級|學期|科目/);A.deepEqual(x.errors,[]);}finally{x.w.close();}
 }
});
test('invalid or conflicting curriculum course filters never silently show a different course',()=>{
 const ctx={window:{},URLSearchParams};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../modules/curriculum-browser.js'),'utf8'),ctx);
 for(const course of ['missing-course','114-2-7-math','115-1-7-chinese']){
  const page=ctx.window.CurriculumBrowser.render(D,new URLSearchParams({g:7,term:1,s:'math',course}));
  A.match(page,/範圍無效|篩選條件無效/);A.doesNotMatch(page,/data-course-id=/);
 }
 const valid=ctx.window.CurriculumBrowser.render(D,new URLSearchParams({g:7,term:1,s:'math',course:'115-1-7-math'}));
 A.equal((valid.match(/data-course-id=/g)||[]).length,1);A.match(valid,/115-1-7-math/);
});
test('printed reading guides retain their original-text and full-source limitations with escaped review notes',()=>{
 const x=open('#/unit/catalog-285458f7a56563a2/notes');
 try{
  const unit=x.w.STUDY_DATA.units.find(u=>u.id==='catalog-285458f7a56563a2');A.equal(unit.contentMode,'reading-guide');
  unit.reviewNote+=' <svg onload="alert(1)">來源提醒</svg>';
  x.d.querySelector('[data-action="print-open"]').click();x.d.querySelector('[data-action="print-go"]').click();
  const header=x.d.querySelector('#print-root .print-header');A.match(header.textContent,/原創閱讀導引/);A.match(header.textContent,/未核對.*全文/);
  A.ok(header.textContent.includes(unit.reviewNote));A.equal(header.querySelector('svg'),null);A.deepEqual(x.errors,[]);
 }finally{x.w.close();}
});
function assertSources(elements,questions){
 A.equal(elements.length,questions.length);
 for(let i=0;i<questions.length;i++){
  const u=D.units.find(u=>u.id===questions[i].unitId),text=elements[i].textContent;
  for(const label of [u.schoolYear+'學年度',u.grade+'年級',u.semester===1?'上學期':'下學期',D.subjects.find(s=>s.id===u.subject).name,u.title,u.publisher])A.ok(text.includes(label),'missing source label '+label);
 }
}
test('mixed-year practice and printed papers disclose every question source scope',()=>{
 const x=open('#/practice?g=8&term=1&s=social&n=20&seed=demo');
 try{
  const deck=JSON.parse(x.w.localStorage.getItem(KEY+'.session')).deck;
  A.deepEqual([...new Set(deck.questions.map(q=>D.units.find(u=>u.id===q.unitId).schoolYear))].sort(),[114,115]);
  assertSources([...x.d.querySelectorAll('.practice-card')],deck.questions);
  x.d.querySelector('[data-ac="print"]').click();assertSources([...x.d.querySelectorAll('#print-root .print-question')],deck.questions);A.deepEqual(x.errors,[]);
 }finally{x.w.close();}
});
test('exam previews and printouts disclose historical and current source scopes',()=>{
 const cfg={unitIds:['hist114-1-8-history-l1','social-8-1'],count:10,seed:'source-exam'};
 const x=open('#/exam?g=8&term=1&s=social&units='+cfg.unitIds.join(',')+'&n=10&seed='+cfg.seed);
 try{
  const deck=P.examGenerate(D,cfg,P.newState());assertSources([...x.d.querySelectorAll('[data-view="exam"] ol li')],deck.questions);
  x.d.querySelector('[data-ac="exam-print"]').click();assertSources([...x.d.querySelectorAll('#print-root .print-question')],deck.questions);A.deepEqual(x.errors,[]);
 }finally{x.w.close();}
});
test('search results distinguish identical lesson titles by year, grade, semester and publisher',()=>{
 const x=open('#/search?q='+encodeURIComponent('紙船印象'));
 try{
  const results=[...x.d.querySelectorAll('.search-result')];A.ok(results.length>1);
  const scopes=new Set();
  for(const result of results){
   const uid=result.getAttribute('href').split('/')[2],u=D.units.find(u=>u.id===uid),label=result.querySelector('.eyebrow').textContent;
   for(const value of [u.schoolYear+'學年度',({7:'七',8:'八',9:'九'}[u.grade])+'年級',u.semester===1?'上學期':'下學期',u.publisher])A.ok(label.includes(value),'missing search scope '+value);
   scopes.add(label);
  }
  A.ok(scopes.size>1);A.deepEqual(x.errors,[]);
 }finally{x.w.close();}
});
test('detached reading-guide practice and exam printouts retain the publisher-text boundary',()=>{
 const id='catalog-285458f7a56563a2';
 for(const hash of ['#/practice?unit='+id+'&n=8&seed=reading-print','#/exam?g=7&term=1&s=chinese&units='+id+'&n=10&seed=reading-print']){
  const x=open(hash);try{
   const labels=[...x.d.querySelectorAll('.practice-source')];A.ok(labels.length);
   for(const label of labels){A.match(label.textContent,/原創閱讀導引/);A.match(label.textContent,/未核對本課全文/);A.match(label.textContent,/不代表同名課文/);}
   x.d.querySelector(hash.includes('/exam?')?'[data-ac="exam-print"]':'[data-ac="print"]').click();
   for(const label of x.d.querySelectorAll('#print-root .practice-source'))A.match(label.textContent,/未核對本課全文/);
   A.deepEqual(x.errors,[]);
  }finally{x.w.close();}
 }
});
