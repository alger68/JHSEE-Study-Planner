'use strict';
const {test}=require('node:test'),A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const input=fs.readFileSync(path.join(root,'../index.html'),'utf8');
function extract(h){const box={window:{}};vm.runInNewContext([...h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].find(s=>s[1].includes('window.STUDY_DATA ='))[1],box);return JSON.parse(JSON.stringify(box.window.STUDY_DATA));}
const base=extract(require('../build-free.cjs').build(input));
const modulePath=path.join(root,'modules/catalog-completion.cjs');
function moduleAPI(){A.ok(fs.existsSync(modulePath),'V2 catalog completion module must exist');return require(modulePath);}
function sample(mode='topic-guide'){
 const concepts=Array.from({length:3},(_,i)=>({title:'資料判讀'+i,lead:'先確認資料的條件與範圍',body:'使用資料時必須先辨認題目提供的條件，再逐一比較選項，不能把部分案例推廣為所有情況；結論還必須與觀察證據相符。',example:'原創例子：三次觀察中兩次發生，不能推論永遠發生。',misconception:'一次發生就代表永遠如此',correction:'應檢查樣本範圍及反例。'}));
 return {sectionId:'115-1-7-chinese/第一課',title:'夏夜',mode,summary:'使用原創短文辨認觀察與推論',concepts,questions:concepts.map((_,i)=>({concept:i,stem:'原創資料題'+i+'：觀察三次兩次發生，能推出哪項結論？',correct:'本次三次觀察有兩次發生',distractors:['永遠發生','從未發生','與資料無關也成立'],explanation:'結論只限於題目提供的三次觀察，不能從有限樣本直接推論永遠發生或完全不發生。'})),sources:[],note:'原創閱讀練習；未核對課文全文'};
}
test('English continuation preserves all 169 live units and restores the 22 unpublished English lessons',()=>{
 const D=moduleAPI().enrich(structuredClone(base),{rows:[]});
 A.equal(D.units.length,191);A.equal(D.units.reduce((n,u)=>n+u.quiz.length,0),1120);
 for(const old of base.units)A.deepEqual(D.units.find(u=>u.id===old.id),old);
 for(const g of [7,8,9]){const c=D.atlas.courses.find(c=>c.id===`115-1-${g}-english`);A.equal(c.readySections,c.sections.length);}
 A.equal(D.freeResources.resources.length,29);A.equal(D.atlas.adoptionPolicy.currentYearReplacement,false);
});
test('reading guidance is linked but never counted as completed chapter teaching',()=>{
 const D=moduleAPI().enrich(structuredClone(base),{rows:[sample('reading-guide')]});
 const c=D.atlas.courses.find(c=>c.id==='115-1-7-chinese'),s=c.sections.find(s=>s.label==='第一課');
 A.ok(s.unitId);A.equal(s.noteStatus,'reading-guide');A.equal(c.readySections,0);A.equal(c.readingGuideSections,1);
 const u=D.units.find(u=>u.id===s.unitId);A.equal(u.contentMode,'reading-guide');A.equal(u.quiz.length,3);A.equal(u.schoolYear,115);
});
test('verified PDF themes fill the 22 missing outlines without inventing textbook numbering or PDF pages',()=>{
 const D=moduleAPI().enrich(structuredClone(base),{rows:[]});
 const c=D.atlas.courses.find(c=>c.id==='115-1-7-pe');
 A.equal(c.outlineStatus,'themes-located');A.equal(c.sections[0].title,'體適能');
 A.equal(c.sections[0].label,'主題1');A.equal(c.sections[0].page,null);
 A.equal(c.sections[0].kind,'teaching-theme');A.match(c.outlineBasis,/非課本原課號/);
 A.equal(D.atlas.statistics.locatedCourses,106);A.equal(D.atlas.statistics.locatedSections,697);
 A.equal(D.atlas.statistics.sourceCount,146);A.equal(D.catalogCompletion.untranscribedCourses,0);
 for(const old of base.atlas.courses.filter(c=>c.sections.length))A.deepEqual(D.atlas.courses.find(c=>c.id===old.id).sections.map(s=>[s.id,s.title,s.page]),old.sections.map(s=>[s.id,s.title,s.page]));
});
test('course source and title anchors reject duplicate or wrong lesson bindings',()=>{
 const api=moduleAPI();
 A.throws(()=>api.enrich(structuredClone(base),{rows:[sample(),sample()]}),/Duplicate/);
 A.throws(()=>api.enrich(structuredClone(base),{rows:[{...sample(),title:'不是夏夜'}]}),/title|anchor/i);
 const bad=sample();bad.questions[0].distractors[0]=bad.questions[0].correct;
 A.throws(()=>api.enrich(structuredClone(base),{rows:[bad]}),/option|question/i);
 const repeated=sample();repeated.questions[1].stem=repeated.questions[0].stem;
 A.throws(()=>api.enrich(structuredClone(base),{rows:[repeated]}),/Duplicate question/);
});
test('release data provides original learning content for every located section and theme',()=>{
 const api=moduleAPI(),rows=api.readRows();A.equal(rows.length,568);
 const D=api.enrich(structuredClone(base));
 A.equal(D.units.length,759);A.equal(D.units.reduce((n,u)=>n+u.quiz.length,0),2824);
 A.equal(D.catalogCompletion.pendingSections,0);A.equal(D.catalogCompletion.untranscribedCourses,0);
 A.equal(D.catalogCompletion.locatedSections,697);A.ok(D.catalogCompletion.readingGuideSections>0);
 const unitMap=new Map(D.units.map(u=>[u.id,u])),used=new Set();
 for(const c of D.atlas.courses)for(const s of c.sections){
  const u=unitMap.get(s.unitId);A.ok(u,`Missing learning content: ${s.id}`);A.ok(!used.has(u.id),`Duplicate binding: ${u.id}`);used.add(u.id);
  A.equal(u.title,s.title);A.equal(u.grade,c.grade);A.equal(u.semester,c.term);A.equal(u.schoolYear,c.year);
  if(u.catalogSectionId)A.equal(u.catalogSectionId,s.id);
 }
 for(const c of D.atlas.courses)A.equal(c.readySections+c.readingGuideSections,c.sections.length);
 A.equal(new Set(D.units.map(u=>u.id)).size,D.units.length);
});
test('new questions work with existing practice engine and preserve actual short-deck count',()=>{
 const D=moduleAPI().enrich(structuredClone(base),{rows:[sample()]});
 const u=D.units.find(u=>u.catalogSectionId===sample().sectionId),P=require('../modules/practice-engine.cjs');
 const deck=P.generate(D,{unitId:u.id,count:8,seed:'v2-contract'});
 A.equal(deck.questions.length,3);A.equal(new Set(deck.questions.map(q=>q.id)).size,3);
 for(const q of deck.questions)A.ok(P.validateQuestion(q));
});
test('legacy mathematics/science chapter bookmarks resolve to the same source-aligned V2 lessons',()=>{
 const D=moduleAPI().enrich(structuredClone(base));
 const b=D.courseMap.books.find(b=>b.id==='science-8-1'),s=b.sections.find(s=>s.code==='1-1');
 const c=D.atlas.courses.find(c=>c.url===b.url),expected=c.sections.find(x=>x.label===s.code&&x.title===s.title);
 A.ok(s.unitId);A.equal(s.unitId,expected.unitId);
 A.equal(D.courseMap.books.flatMap(b=>b.sections).filter(s=>s.unitId).length,105);
});
test('curriculum browser retains historical years, displays each chapter, and labels reading guides',()=>{
 const p=path.join(root,'modules/curriculum-browser.js');A.ok(fs.existsSync(p),'Full curriculum browser must exist');
 const D=moduleAPI().enrich(structuredClone(base),{rows:[sample('reading-guide')]});
 const box={window:{},URLSearchParams};vm.runInNewContext(fs.readFileSync(p,'utf8'),box);const render=box.window.CurriculumBrowser.render;
 const upper=render(D,new URLSearchParams({g:7,s:'chinese',term:1}));
 A.match(upper,/夏夜/);A.match(upper,/原創閱讀導引/);A.match(upper,/115/);A.match(upper,/差不多先生傳/);
 const lower=render(D,new URLSearchParams({g:7,s:'chinese',term:2}));
 A.match(lower,/114/);A.match(lower,/聲音鐘/);A.doesNotMatch(lower,/115學年度下學期/);
 A.match(render(D,new URLSearchParams({g:10,s:'chinese',term:2})),/篩選條件無效/);
 const escaping=structuredClone(D);escaping.atlas.courses.find(c=>c.id==='115-1-7-chinese').sections[1].title='<script>bad</script>';
 A.doesNotMatch(render(escaping,new URLSearchParams({g:7,s:'chinese',term:1})),/<script>bad/);
 const pe=render(D,new URLSearchParams({g:7,s:'health',term:1,course:'115-1-7-pe'}));
 A.match(pe,/全部子科目/);A.match(pe,/aria-current="page"/);
 A.equal((pe.match(/data-course-id=/g)||[]).length,1);
 A.match(pe,new RegExp('0 / '+D.atlas.courses.find(c=>c.id==='115-1-7-pe').sections.length+' 個已定位項目'));
});
