'use strict';
const {test}=require('node:test'),A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),zlib=require('node:zlib');
const {JSDOM,VirtualConsole}=require('jsdom'),P=require('../modules/practice-engine.cjs');
const input=fs.readFileSync(path.join(__dirname,'../../index.html'),'utf8');
function extract(html){const box={window:{}};vm.runInNewContext([...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].find(x=>x[1].includes('window.STUDY_DATA ='))[1],box);return JSON.parse(JSON.stringify(box.window.STUDY_DATA));}
const baseline=extract(require('../build-complete.cjs').build(input));
let html,D,built;
function full(){if(!D){html=require('../build-all-subjects.cjs').build(input);D=extract(html);}return D;}
function web(){full();return built||(built=require('../build-web.cjs').build(html));}
function browser({hash='#/home',saved={}}={}){const calls=[],errors=[],v=new VirtualConsole();v.on('jsdomError',e=>errors.push(e.message));const dom=new JSDOM(web().html,{url:'https://example.test/assets/study-notes/'+hash,runScripts:'dangerously',virtualConsole:v,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.requestAnimationFrame=f=>{f();return 0;};w.confirm=()=>true;w.fetch=async file=>{calls.push(file);return{ok:true,text:async()=>web().files[file]};};for(const[k,x]of Object.entries(saved))w.localStorage.setItem(k,JSON.stringify(x));}});return{w:dom.window,calls,errors};}
async function until(fn){for(let i=0;i<200;i++){if(fn())return;await new Promise(r=>setTimeout(r,5));}A.ok(fn(),'expected UI did not become ready');}
test('published scope contains all 66 subject terms, six questions per unit and 578 worked examples',()=>{
 const D=full();A.equal(D.units.length,763);A.equal(D.units.reduce((n,u)=>n+u.quiz.length,0),4578);A.equal(D.subjectCompletion.workedExamples,578);A.equal(D.subjectCompletion.addedQuestions,1754);
 A.equal(D.subjectCompletion.scopes.length,66);A.equal(new Set(D.subjectCompletion.scopes.map(s=>[s.subject,s.grade,s.semester].join('/'))).size,66);
 for(const scope of D.subjectCompletion.scopes)A.ok(scope.units>0);
 for(const u of D.units){A.equal(u.quiz.length,6,u.id);A.equal(new Set(u.quiz.map(q=>q.id)).size,6,u.id);for(const q of u.quiz)A.equal(q.options.filter(o=>o.id===q.answer).length,1,u.id+'/'+q.id);}
});
test('every existing question and course-source identity survives the full enrichment',()=>{
 const D=full();for(const u of baseline.units){const now=D.units.find(x=>x.id===u.id);A.deepEqual(now.quiz.slice(0,u.quiz.length),u.quiz,u.id);for(const key of ['schoolYear','publisher','contentMode','atlasCourseId','catalogSectionId'])A.equal(now[key],u[key],u.id+'/'+key);if(u.quiz.length<6)A.equal(now.concepts.filter(c=>c.example?.includes('原創延伸例題：')).length,1,u.id);}
 A.equal(D.units.filter(u=>u.contentMode==='reading-guide').length,74);A.equal(D.atlas.courses.length,106);A.equal(D.atlas.exams.length,40);A.equal(D.catalogCompletion.locatedSections,697);A.equal(D.atlas.statistics.sourceCount,146);
 for(const c of D.atlas.courses)for(const s of c.sections)A.equal(s.fixedQuestions,6,s.id);
 A.deepEqual(D.courseMap,baseline.courseMap);A.deepEqual(D.freeResources,baseline.freeResources);
});
test('each new fixed question can be generated and restored as a genuine wrong-question snapshot',()=>{
 const D=full();let checked=0;for(const u of D.units){const added=u.quiz.filter(q=>q.origin==='本站原創補強題，非出版社或校方原題');
  for(const base of added){const q=P.candidate(u,base,'v210-content-integrity',0,'static');A.equal(q.options.find(o=>o.id===q.answer).text,base.options.find(o=>o.id===base.answer).text);const state=P.record(P.newState(),q,q.options.find(o=>o.id!==q.answer).id);A.deepEqual(P.validateState(state,D),state,u.id+'/'+q.templateId);checked++;}
 }A.equal(checked,1754);
});
test('expanded web release preserves the homepage budget and downloads no lesson content initially',()=>{
 const b=web();A.equal(b.data.appVersion,'2.1.0');A.equal(b.manifest.groups.length,66);A.ok(Buffer.byteLength(b.html)<2000000);A.ok(zlib.gzipSync(b.html).length<350000);
 const before=b.html.slice(0,b.html.indexOf('window.STUDY_DATA ='));A.match(before,/V2\.1\.0/);A.match(before,/578則分步例題/);A.match(before,/4578 道固定題/);
 A.equal(JSON.parse(b.files[b.manifest.all.file]).units.length,763);A.ok(b.data.units.every(u=>!u.concepts[0].body&&!u.quiz[0].question));
 const app=browser();try{A.equal(app.calls.length,0);A.ok(app.w.document.querySelector('.home-welcome'));A.deepEqual(app.errors,[]);}finally{app.w.close();}
});
test('real old three-question unfinished session and wrong answer still resume after expansion in the shipped web app',async()=>{
 const cfg={unitId:'school-s7-2-3',count:8,seed:'all-subject-resume'},deck=P.generate(baseline,cfg),q=deck.questions[0],wrong=q.options.find(o=>o.id!==q.answer).id,state=P.record(P.newState(),q,wrong);
 const session={app:'jh-study-practice-session',schema:1,version:P.VERSION,signature:JSON.stringify(cfg),deck,selections:{[q.id]:wrong},submitted:false,retry:false};
 const app=browser({hash:'#/practice?unit='+cfg.unitId+'&n=8&seed='+cfg.seed,saved:{'jh-study-notes.practice.v2':state,'jh-study-notes.practice.v2.session':session}});
 try{await until(()=>app.w.document.querySelector('[data-view="practice"]'));A.equal(app.w.document.querySelectorAll('.practice-card').length,3);A.equal(app.w.document.querySelectorAll('.practice-option.selected').length,1);A.equal(app.w.localStorage.getItem('jh-study-notes.practice.v2'),JSON.stringify(state));A.doesNotMatch(app.w.document.querySelector('#main').textContent,/快照無法驗證|原有異常資料/);A.deepEqual(app.errors,[]);}finally{app.w.close();}
});
test('grade-nine language catalog opens the new guide and a real answer reveals its explanation',async()=>{
 const app=browser({hash:'#/library?g=9&s=hakka&term=2'});try{await until(()=>app.w.document.querySelector('.curriculum-shared[open]'));A.equal(app.calls.length,0);
  app.w.document.querySelector('a[href="#/unit/hakka-9-2-supplement/quiz"]').click();await until(()=>app.w.document.querySelector('[data-option]'));A.equal(app.calls.length,1);A.match(app.w.document.querySelector('#main').textContent,/未核對校方版本/);A.match(app.w.document.querySelector('[data-quiz]').textContent,/共 6 題/);
  app.w.document.querySelector('[data-option]').click();app.w.document.querySelector('[data-action="submit-answer"]').click();A.ok(app.w.document.querySelector('[data-feedback] p').textContent.length>=35);A.deepEqual(app.errors,[]);
 }finally{app.w.close();}
});
test('semester guidance resumes the newly added questions after an old three-question check was completed',async()=>{
 const courseId='115-1-7-chinese',id=baseline.atlas.courses.find(c=>c.id===courseId).sections[0].unitId,before=baseline.units.find(u=>u.id===id),now=full().units.find(u=>u.id===id),key='jh-study-notes.progress.v1';
 A.equal(before.quiz.length,3);
 const progress={app:'jh-study-notes',schemaVersion:1,read:[id],starred:[],answers:Object.fromEntries(before.quiz.map(q=>[id+'/'+q.id,q.answer])),font:0};
 const app=browser({hash:'#/learn?g=7&term=1',saved:{[key]:progress}});
 try{await until(()=>app.w.document.querySelector('[data-view="learn"]'));
  const course=app.w.document.querySelector('[data-learning-course="'+courseId+'"]');A.equal(course.querySelector('[data-next-unit]').dataset.nextUnit,id);A.match(course.textContent,/已答 3 \/ 6 題/);
  course.querySelector('[data-learn-quiz]').click();await until(()=>app.w.document.querySelector('[data-quiz]'));
  A.equal(app.w.document.querySelector('[data-quiz] .question-text').textContent,now.quiz[3].question);A.match(app.w.document.querySelector('.quiz-meta').textContent,/第 4 題 \/ 共 6 題/);
  A.equal(app.w.localStorage.getItem(key),JSON.stringify(progress));A.deepEqual(app.errors,[]);
 }finally{app.w.close();}
});
