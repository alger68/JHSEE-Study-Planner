'use strict';
const fs=require('node:fs'),path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,f),'utf8');
function load(){
 const raw=JSON.parse(read('atlas-sources.json')),extra=JSON.parse(read('atlas-exams.json'));
 const names={chinese:['國文','chinese'],english:['英語','english'],math:['數學','math'],biology:['生物','science'],physical:['理化','science'],science:['自然／地科','science'],geography:['地理','social'],history:['歷史','social'],civics:['公民','social'],health:['健康教育','health'],pe:['體育','health'],visual:['視覺藝術','arts'],music:['音樂','arts'],performance:['表演藝術','arts'],homeeconomics:['家政','integrated'],scouts:['童軍','integrated'],guidance:['輔導','integrated'],it:['資訊科技','technology'],technology:['生活科技','technology'],taiwanese:['閩南語','taiwanese']};
 const x={schema:1,checked:raw.checked,notes:raw.notes,gaps:raw.gaps,periods:[{id:'115-1',label:'115 上學期（當年度）'},{id:'114-2',label:'114 下學期（歷史參考）'}],courses:raw.courses.map(([sourceId,period,grade,subject,publisher,pdfPages,sha256,title,ss])=>{const[year,term]=period.split('-').map(Number);return{id:period+'-'+grade+'-'+subject,sourceId,year,term,grade,subject,subjectName:names[subject][0],bucket:names[subject][1],publisher,pdfPages,sha256,title,url:'https://drive.google.com/file/d/'+sourceId+'/view',sections:ss.map(([label,title,page])=>({label,title,page})),outlineBasis:ss.length?'既有人工轉錄；本輪核對原檔雜湊':'尚未逐項轉錄',publisherBasis:year===115?'115選書表領域版本；實際課程可能另採自編':'校方歷年檔名',scopeNote:'只呈現已定位的課／節／主題，非全部活動與補充教材。',warnings:[]};}),exams:raw.exams.map(([sourceId,grade,round,subject,subjectName,pdfPages,sha256,title])=>({sourceId,year:114,term:2,grade,round,subject,subjectName,pdfPages,sha256,title,url:'https://drive.google.com/file/d/'+sourceId+'/view',ranges:[],warnings:[]}))};
 const courses=new Map(x.courses.map(c=>[c.id,c]));let course;
 for(const raw of read('atlas-outlines.txt').split(/\r?\n/)){
  const line=raw.trim();if(!line||line.startsWith('#'))continue;
  if(line.startsWith('@@')){course=courses.get(line.slice(2));if(!course)throw Error('Unknown outline course: '+line);course.sections=[];course.outlineBasis='依原PDF架構表／教學欄逐項定位，保留來源用詞';continue;}
  const a=line.split('|');if(!course||a.length!==3||!Number.isInteger(Number(a[2])))throw Error('Invalid outline: '+line);
  course.sections.push({label:a[0],title:a[1],page:Number(a[2])});
 }
 const warning=(id,note)=>{const c=courses.get(id);if(c)c.warnings.push(note);};
 warning('114-2-7-geography','第2頁課程架構寫「第一級農業」，第9頁教學欄寫「第一級產業」。本頁保留架構表名稱，不默默改字。');
 warning('114-2-9-science','教學欄出現的授課順序為第1章→第3章→第2章→第4章，並非按章號連續授課；本頁保留其先後順序。');
 warning('115-1-8-homeeconomics','第2頁架構表標主題一「幸福生活計畫」，教學欄則標主題三。單元名稱對應，但主題號碼有差異。');
 warning('115-1-8-scouts','第2頁架構表標主題四「安康露營去」，教學欄標主題二；以主題名稱辨識，不以號碼強行統一。');
 warning('115-1-8-taiwanese','本頁只轉錄已定位的三課，不將未轉錄語文活動或延伸教材當成不存在。');
 const ex=new Map(x.exams.map(p=>[p.sourceId,p]));
 for(const p of x.exams){Object.assign(p,extra[p.sourceId]||{});p.answersVerified=false;}
 for(const c of x.courses){
  c.outlineStatus=c.sections.length?'located':'pending';const seen=new Set();
  c.sections.forEach((s,i)=>{if(seen.has(s.label))throw Error('Duplicate section: '+c.id+'/'+s.label);seen.add(s.label);if(s.page<1||s.page>c.pdfPages)throw Error('Invalid PDF page');s.id=c.id+'/'+s.label;s.order=i;s.evidence=[];s.unitId=null;});
 }
 for(const p of x.exams){
  for(const r of p.ranges){const c=courses.get(r.courseId);if(!c)throw Error('Missing range course '+r.courseId);if(c.year!==p.year||c.term!==p.term||c.grade!==p.grade)throw Error('Cross-period exam link');if(r.status!=='clear')continue;
   for(const label of r.labels){const s=c.sections.find(s=>s.label===label);if(!s)throw Error('Unmatched range label: '+r.courseId+'/'+label);s.evidence.push({kind:'range',examId:p.sourceId,round:p.round,page:r.page,raw:r.raw,note:r.note||''});}
  }
  for(const q of p.questions||[]){const c=courses.get(q.courseId),s=c?.sections.find(s=>s.label===q.label);if(!s||c.year!==p.year||c.term!==p.term||c.grade!==p.grade)throw Error('Invalid question link');s.evidence.push({kind:'question',examId:p.sourceId,round:p.round,page:q.page,questionNumber:q.questionNumber,note:q.basis});}
 }
 x.statistics={sourceCount:x.courses.length+x.exams.length,courseCount:x.courses.length,examCount:x.exams.length,locatedCourses:x.courses.filter(c=>c.sections.length).length,locatedSections:x.courses.reduce((n,c)=>n+c.sections.length,0),questionRecords:x.exams.reduce((n,p)=>n+(p.questions?.length||0),0),rangeRecords:x.exams.reduce((n,p)=>n+p.ranges.length,0)};
 return x;
}
function bind(D){const x=load();
 for(const c of x.courses){
  if(c.year!==115||c.term!==1)continue;
  const book=D.courseMap.books.find(b=>b.grade===c.grade&&b.subject===c.bucket&&b.semester===c.term);
  if(!book)continue;
  for(const s of c.sections){const target=book.sections.find(t=>t.code===s.label);const u=target?.unitId&&D.units.find(u=>u.id===target.unitId);if(u&&u.schoolYear===c.year&&u.grade===c.grade&&u.semester===c.term&&u.publisher===c.publisher)s.unitId=u.id;}
 }
 // Readiness is derived from real notes, never from the mere existence of a PDF.
 for(const c of x.courses){c.sections.forEach(s=>{const u=D.units.find(u=>u.id===s.unitId);s.noteStatus=u?'core-ready':'not-written';s.fixedQuestions=u?.quiz.length||0;s.quality='精選重點／基礎檢測，非全課本完整覆蓋';});c.readySections=c.sections.filter(s=>s.unitId).length;}
 return x;
}
module.exports={load,bind};
