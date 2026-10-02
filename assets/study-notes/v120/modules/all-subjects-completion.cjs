'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const VERSION='2.1.0',MIN_QUESTIONS=6;
const text=x=>typeof x==='string'&&x.trim().length>0;
const norm=x=>x.normalize('NFKC').replace(/\s+/g,' ').trim();
const hash=x=>crypto.createHash('sha256').update(x).digest('hex').slice(0,16);
function readRows(){return fs.readdirSync(path.join(__dirname,'all-subjects-content')).filter(f=>f.endsWith('.json')).sort().flatMap(f=>JSON.parse(fs.readFileSync(path.join(__dirname,'all-subjects-content',f),'utf8')));}
function validateQuestions(questions,u,count){
 if(!Array.isArray(questions)||questions.length!==count)throw Error('Question count mismatch: '+u.id);
 const used=new Set((u.quiz||[]).map(q=>norm(q.question)));
 for(const q of questions){
  const choices=[q.correct,...(q.distractors||[])];
  if(!u.concepts.some(c=>c.id===q.conceptId)||!text(q.stem)||!text(q.explanation)||q.explanation.trim().length<35||choices.length!==4||!choices.every(text)||new Set(choices.map(norm)).size!==4||!['應用','觀念'].includes(q.difficulty))throw Error('Invalid question: '+u.id);
  const stem=norm(q.stem);if(used.has(stem))throw Error('Duplicate question: '+u.id);used.add(stem);
 }
}
function makeQuestions(questions,u,refs){
 const start=u.quiz.length,offset=parseInt(hash(u.id).slice(0,2),16)%4;
 return questions.map((q,i)=>{
  const values=[q.correct,...q.distractors],order=[0,1,2,3].map(n=>(n+i+offset)%4);
  return {id:'q'+(start+i+1),concept:q.conceptId,question:q.stem,options:order.map((n,j)=>({id:'abcd'[j],text:values[n],explanation:n===0?q.explanation:'請回到題目條件逐一判斷。'+q.explanation})),answer:'abcd'[order.indexOf(0)],explanation:q.explanation,sources:refs,difficulty:q.difficulty,ability:'概念應用、證據判讀與推理',chapterLabel:u.chapter+' '+u.title,origin:'本站原創補強題，非出版社或校方原題'};
 });
}
function enrich(input,options={}){
 if(input.subjectCompletion?.version===VERSION)return input;
 const rows=options.rows||readRows(),supplements=options.supplements||require('./language9-supplements.json'),requireComplete=options.requireComplete!==false;
 // Work on a private copy so an incomplete or malformed content pack changes nothing.
 const D=JSON.parse(JSON.stringify(input)),byId=new Map(D.units.map(u=>[u.id,u])),seen=new Set(),sources=new Map(D.sources.map(s=>[s.id,s]));
 const addedSources=entries=>(entries||[]).map(s=>{
  if(!text(s.title)||!text(s.url)||!/^https:\/\//.test(s.url))throw Error('Invalid supplemental source');
  const id='v210-ref-'+hash(s.url);if(!sources.has(id)){const item={id,title:s.title,url:s.url,note:'補強教材的公開查核資料；情境、例題與解析由本站編寫。',checked:'2026-10-02'};D.sources.push(item);sources.set(id,item);}return id;
 });
 for(const r of rows){
  const u=byId.get(r.unitId);if(!u)throw Error('Unknown unit: '+r.unitId);if(seen.has(u.id))throw Error('Duplicate unit: '+u.id);seen.add(u.id);
  if(u.quiz.length>=MIN_QUESTIONS)throw Error('Unexpected complete unit: '+u.id);
  const t=r.teaching;if(!t||!u.concepts.some(c=>c.id===t.conceptId)||!text(t.scenario)||!text(t.takeaway)||!Array.isArray(t.steps)||t.steps.length<2||t.steps.length>4||!t.steps.every(text))throw Error('Invalid worked example: '+u.id);
  validateQuestions(r.questions,u,MIN_QUESTIONS-u.quiz.length);
  const refs=[...new Set([...u.concepts.flatMap(c=>c.sources),...addedSources(r.sources)])];
  const c=u.concepts.find(c=>c.id===t.conceptId);c.example=(c.example?c.example+'\n\n':'')+'原創延伸例題：'+t.scenario+'\n'+t.steps.map((step,i)=>(i+1)+'. '+step).join('\n')+'\n結論：'+t.takeaway;
  c.sources=[...new Set([...c.sources,...refs])];
  u.quiz.push(...makeQuestions(r.questions,u,refs));u.version=VERSION;u.updated='2026-10-02';
 }
 for(const r of supplements){
  if(!['taiwanese','hakka'].includes(r.subject)||![1,2].includes(r.semester)||r.id!==r.subject+'-9-'+r.semester+'-supplement'||byId.has(r.id)||!text(r.title)||!text(r.summary)||!Array.isArray(r.concepts)||r.concepts.length!==3||r.concepts.some(c=>!text(c.id)||!text(c.title)||!text(c.lead)||!Array.isArray(c.body)||!c.body.length||!c.body.every(text)||!text(c.example)))throw Error('Invalid language supplement');
  const refs=addedSources(r.sources),u={id:r.id,grade:9,semester:r.semester,subject:r.subject,domain:r.subject==='hakka'?'客語':'臺灣台語',publisher:'通用補充・未核對校方版本',book:'九年級通用補充',chapter:r.semester===1?'上學期自主延伸':'下學期自主延伸',title:r.title,summary:r.summary,tagline:'原創學習指南；請依實際選修語別與老師進度使用。',chapterPath:['九年級通用補充',r.title],tags:r.concepts.map(c=>c.title),tone:'green',minutes:18,version:VERSION,updated:'2026-10-02',status:'published',coverage:'language-learning-guide',contentMode:'topic-guide',reviewNote:'九年級本土語通用補充指南，並非已核對的永和國中課次、出版社版本或段考範圍。以華語說明學習方法與原創情境；實際音讀、腔調與口語表現請配合正式辭典和老師核對。本站不提供自動語音評分。',concepts:r.concepts.map(c=>({...c,sources:refs})),quiz:[],diagrams:[],tables:[],traps:[],experiments:[],quick:r.concepts.map(c=>c.lead)};
  validateQuestions(r.questions,u,MIN_QUESTIONS);u.quiz=makeQuestions(r.questions,u,refs);D.units.push(u);byId.set(u.id,u);
 }
 if(requireComplete){
  const incomplete=D.units.filter(u=>u.quiz.length<MIN_QUESTIONS);if(incomplete.length)throw Error('Incomplete coverage; missing units: '+incomplete.map(u=>u.id).join(','));
  for(const s of D.subjects)for(const grade of [7,8,9])for(const semester of [1,2])if(!D.units.some(u=>u.subject===s.id&&u.grade===grade&&u.semester===semester))throw Error('Missing subject scope: '+[s.id,grade,semester].join('/'));
 }
 for(const c of D.atlas.courses)for(const s of c.sections)if(byId.has(s.unitId))s.fixedQuestions=byId.get(s.unitId).quiz.length;
 D.subjectCompletion={version:VERSION,checked:'2026-10-02',minimumQuestionsPerUnit:MIN_QUESTIONS,expandedUnits:rows.length,newSupplementUnits:supplements.length,workedExamples:rows.length,addedQuestions:D.units.reduce((n,u)=>n+u.quiz.length,0)-input.units.reduce((n,u)=>n+u.quiz.length,0),scopes:D.subjects.flatMap(s=>[7,8,9].flatMap(grade=>[1,2].map(semester=>{const us=D.units.filter(u=>u.subject===s.id&&u.grade===grade&&u.semester===semester);return {subject:s.id,grade,semester,units:us.length,questions:us.reduce((n,u)=>n+u.quiz.length,0),schoolSourceAvailable:D.atlas.courses.some(c=>c.bucket===s.id&&c.grade===grade&&c.term===semester)};})))};
 D.appVersion=VERSION;D.updated='2026-10-02';return D;
}
module.exports={VERSION,MIN_QUESTIONS,enrich,readRows};
