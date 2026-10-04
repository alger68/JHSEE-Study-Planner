/* Shared source and solution validation. Node-only file reads are confined to enrich(). */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ExamSolutionData=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const text=x=>typeof x==='string'&&x.trim().length>0&&x.length<=10000;
 const statuses=['verified','disputed','limited'];
 function validatePaper(p,source){
  if(!source||p.schema!==1||p.sourceId!==source.sourceId||p.sourceSha256!==source.sha256||p.title!==source.title)throw Error('Solution source mismatch');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(p.checked)||!text(p.coverageNote)||!Array.isArray(p.items)||!p.items.length)throw Error('Invalid solution coverage');
  if(!Array.isArray(p.sections)||!p.sections.length)throw Error('Invalid solution sections');
  const sections=new Set();for(const s of p.sections){if(!text(s.id)||!text(s.title)||sections.has(s.id))throw Error('Invalid or duplicate section');sections.add(s.id);}
  const ids=new Set(),labels=new Set(),used=new Set(),page=n=>Number.isInteger(n)&&n>=1&&n<=source.pdfPages;
  for(const q of p.items){
   if(!text(q.id)||!text(q.label)||ids.has(q.id)||labels.has(q.label))throw Error('Duplicate or invalid solution ID/label');ids.add(q.id);labels.add(q.label);
   if(!sections.has(q.section))throw Error('Unknown solution section');used.add(q.section);
   if(!Array.isArray(q.sourcePages)||!q.sourcePages.length||!q.sourcePages.every(page)||!page(q.answerPage))throw Error('Invalid solution page');
   if(!['topic','answer','officialAnswer','pitfall'].every(k=>text(q[k]))||!Array.isArray(q.steps)||q.steps.length<2||!q.steps.every(text))throw Error('Invalid solution explanation');
   if(!statuses.includes(q.status))throw Error('Invalid solution status');
   if((q.status!=='verified'&&!text(q.note))||(q.note!==undefined&&!text(q.note)))throw Error('Solution issue needs a note');
  }
  if(used.size!==sections.size)throw Error('Empty solution section');
  return p;
 }
 function counts(p){return{totalItems:p.items.length,verifiedItems:p.items.filter(q=>q.status==='verified').length,disputedItems:p.items.filter(q=>q.status==='disputed').length,limitedItems:p.items.filter(q=>q.status==='limited').length};}
 function enrich(input,papers){
  if(!papers){const fs=require('node:fs'),path=require('node:path'),dir=path.join(__dirname,'exam-solutions');papers=fs.readdirSync(dir).filter(f=>f.endsWith('.json')).sort().map(f=>JSON.parse(fs.readFileSync(path.join(dir,f),'utf8')));}
  if(!Array.isArray(papers)||!papers.length)throw Error('No solution papers');
  const D=JSON.parse(JSON.stringify(input)),seen=new Set();
  const all=papers.map(p=>{if(seen.has(p.sourceId))throw Error('Duplicate solution paper');seen.add(p.sourceId);const s=D.atlas.exams.find(s=>s.sourceId===p.sourceId);validatePaper(p,s);return{...JSON.parse(JSON.stringify(p)),grade:s.grade,year:s.year,term:s.term,round:s.round,subject:s.subject,subjectName:s.subjectName,pdfPages:s.pdfPages,url:s.url,...counts(p)};});
  const total={totalItems:0,verifiedItems:0,disputedItems:0,limitedItems:0};for(const p of all)for(const k of Object.keys(total))total[k]+=p[k];
  D.examSolutions={schema:1,version:'2.1.5',paperCount:all.length,...total,papers:all};
  const gap=D.atlas.gaps?.find(g=>g.scope==='題解驗證');if(gap)gap.status=`已整理${all.length}／${D.atlas.exams.length}份原創逐題詳解；${total.verifiedItems}題核對一致、${total.disputedItems}題有疑義、${total.limitedItems}題核對有限。題本覆蓋與答案核對狀態分別計算，請查看各題說明。`;
  return D;
 }
 return{validatePaper,counts,enrich};
});
