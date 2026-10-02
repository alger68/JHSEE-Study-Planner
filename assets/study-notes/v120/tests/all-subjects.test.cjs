'use strict';
const {test}=require('node:test'),A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),input=fs.readFileSync(path.join(root,'../index.html'),'utf8');
function extract(html){const box={window:{}};vm.runInNewContext([...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].find(x=>x[1].includes('window.STUDY_DATA ='))[1],box);return JSON.parse(JSON.stringify(box.window.STUDY_DATA));}
const old=extract(require('../build-complete.cjs').build(input));
function api(){return require('../modules/all-subjects-completion.cjs');}
function fixture(){return {unitId:'school-s7-2-3',teaching:{conceptId:'c1',scenario:'兩杯不同濃度的色水相通，觀察顏色的分布。',steps:['先比較兩杯的濃度，判斷淨移動方向。','達到均勻後仍有粒子往兩側運動。'],takeaway:'均勻分布不表示粒子停止運動。'},questions:['c1','c2','c3'].map((conceptId,i)=>({conceptId,stem:'原創資料題'+i+'：觀察三次，兩次發生的資料能支持什麼？',correct:'本次三次觀察中有兩次發生',distractors:['每次都發生','每次都不發生','可推論所有環境都相同'],explanation:'題目只提供三次觀察，其中有兩次發生；能支持的結論必須限制在這份資料，不能無條件擴張成所有環境下都相同。',difficulty:'應用'}))};}
test('append-only questions and worked examples retain old answer identity and source labels',()=>{
 const row=fixture(),D=api().enrich(structuredClone(old),{rows:[row],supplements:[],requireComplete:false}),u=D.units.find(u=>u.id===row.unitId),before=old.units.find(u=>u.id===row.unitId);
 A.equal(u.quiz.length,6);A.deepEqual(u.quiz.slice(0,3),before.quiz);A.deepEqual(u.quiz.slice(3).map(q=>q.id),['q4','q5','q6']);
 A.ok(u.concepts[0].example.includes(row.teaching.scenario));A.ok(u.concepts[0].example.includes(row.teaching.steps[1]));
 A.equal(new Set(u.quiz.slice(3).map(q=>q.answer)).size,3);A.equal(u.schoolYear,before.schoolYear);A.equal(u.publisher,before.publisher);
 const c=D.atlas.courses.flatMap(c=>c.sections).find(s=>s.unitId===u.id);if(c)A.equal(c.fixedQuestions,6);
});
test('malformed, duplicate, off-topic concept and incomplete packs fail before mutating input',()=>{
 for(const mutate of [r=>r.questions[0].conceptId='not-real',r=>r.questions[0].distractors[0]=r.questions[0].correct,r=>r.questions.pop(),r=>r.questions[1].stem=r.questions[0].stem,r=>r.teaching.steps=[],r=>r.unitId='not-real']){
  const D=structuredClone(old),before=JSON.stringify(D),row=fixture();mutate(row);A.throws(()=>api().enrich(D,{rows:[row],supplements:[],requireComplete:false}));A.equal(JSON.stringify(D),before);
 }
 const D=structuredClone(old);A.throws(()=>api().enrich(D,{rows:[fixture(),fixture()],supplements:[],requireComplete:false}),/Duplicate/);
 A.throws(()=>api().enrich(structuredClone(old),{rows:[fixture()],supplements:[]}),/missing|incomplete|coverage/i);
});
test('old short-deck sessions and mistakes survive appended question banks',()=>{
 const P=require('../modules/practice-engine.cjs'),cfg={unitId:'school-s7-2-3',count:8,seed:'v202-migration'},deck=P.generate(old,cfg),q=deck.questions[0];
 const session={app:'jh-study-practice-session',schema:1,version:P.VERSION,signature:JSON.stringify(cfg),deck,selections:{[q.id]:q.answer},submitted:false,retry:false};
 const state=P.record(P.newState(),q,q.options.find(o=>o.id!==q.answer).id),D=api().enrich(structuredClone(old),{rows:[fixture()],supplements:[],requireComplete:false});
 A.equal(deck.questions.length,3);A.deepEqual(P.validateSession(session,D),session);A.deepEqual(P.validateState(state,D),state);
 A.equal(P.generate(D,cfg).questions.length,6);
});
test('new grade-nine language guides carry honest scope and expose read and practice actions',()=>{
 const h=require('../build-all-subjects.cjs').build(input,{rows:[fixture()],requireComplete:false}),D=extract(h);
 A.equal(D.appVersion,'2.1.0');
 const scripts=[...h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];const core={module:{exports:{}},URL};vm.runInNewContext(scripts.find(s=>s[1].includes('Shared pure functions'))[1],core);A.deepEqual(Array.from(core.module.exports.validateData(D)),[]);
 const ui={window:{},URLSearchParams};vm.runInNewContext(fs.readFileSync(path.join(root,'modules/curriculum-browser.js'),'utf8'),ui);
 for(const subject of ['taiwanese','hakka'])for(const semester of [1,2]){
  const u=D.units.find(u=>u.id===`${subject}-9-${semester}-supplement`);A.ok(u);A.equal(u.schoolYear,undefined);A.equal(u.quiz.length,6);A.match(u.reviewNote,/未核對|並非已核對/);
  const page=ui.window.CurriculumBrowser.render(D,new URLSearchParams({g:9,s:subject,term:semester}));
  A.match(page,/<details[^>]+curriculum-shared[^>]+open/);A.ok(page.includes(`href="#/unit/${u.id}/notes"`));A.ok(page.includes(`href="#/unit/${u.id}/quiz"`));A.match(page,/通用補充/);
 }
 const web=require('../build-web.cjs').build(h);A.equal(web.data.appVersion,'2.1.0');A.match(web.html.slice(0,web.html.indexOf('window.STUDY_DATA =')),/V2\.1\.0/);A.doesNotMatch(web.html.slice(0,web.html.indexOf('window.STUDY_DATA =')),/V2\.0\.0/);
});
