'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,16);
const nonempty=s=>typeof s==='string'&&s.trim().length>0;
function readRows(){
 const dir=path.join(__dirname,'catalog-content');
 return fs.existsSync(dir)?fs.readdirSync(dir).filter(f=>f.endsWith('.json')).sort().flatMap(f=>JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'))):[];
}
function validateRow(r){
 if(!r||!nonempty(r.sectionId)||!nonempty(r.title)||!nonempty(r.summary)||!['reading-guide','topic-guide'].includes(r.mode))throw Error('Invalid lesson row');
 if(!Array.isArray(r.concepts)||r.concepts.length!==3||r.concepts.some(c=>!['title','lead','body','example','misconception','correction'].every(k=>nonempty(c[k]))||c.body.length<40))throw Error('Invalid concepts: '+r.sectionId);
 if(!Array.isArray(r.questions)||r.questions.length<3)throw Error('Missing questions: '+r.sectionId);
 if(new Set(r.questions.map(q=>q.stem?.trim())).size!==r.questions.length)throw Error('Duplicate question: '+r.sectionId);
 const used=new Set();
 for(const q of r.questions){
  const options=[q.correct,...(q.distractors||[])];
  if(![0,1,2].includes(q.concept)||!nonempty(q.stem)||!nonempty(q.explanation)||q.explanation.length<25||options.length!==4||options.some(x=>!nonempty(x))||new Set(options.map(x=>x.trim())).size!==4)throw Error('Invalid question/options: '+r.sectionId);
  used.add(q.concept);
 }
 if(used.size!==3)throw Error('Questions must cover three concepts: '+r.sectionId);
 if(!Array.isArray(r.sources)||r.sources.some(s=>!nonempty(s.title)||!/^https:\/\//.test(s.url)))throw Error('Invalid lesson sources: '+r.sectionId);
}
function enrich(D,{rows=readRows()}={}){
 if(D.catalogCompletion?.version==='2.0.0')return D;
 const units=new Map(D.units.map(u=>[u.id,u])),courses=new Map(D.atlas.courses.map(c=>[c.id,c]));
 for(const patch of require('./course-outline-updates.json')){
  const c=courses.get(patch.courseId);
  if(!c||c.sections.length)throw Error('Outline patch requires an existing empty course: '+patch.courseId);
  if(!/^[a-f0-9]{64}$/.test(patch.sourceTextSha256)||!patch.sections.length)throw Error('Missing PDF text evidence: '+patch.courseId);
  c.sections=patch.sections.map((s,i)=>{
   if(s.kind!=='teaching-theme'||s.page!==null||s.sourceTextMatch!==s.title)throw Error('Unsupported outline evidence: '+patch.courseId);
   return {...s,id:c.id+'/'+s.label,order:i,evidence:[],unitId:null,noteStatus:'not-written',fixedQuestions:0,quality:'校方教學主題；非課本全部小節'};
  });
  c.outlineStatus='themes-located';c.outlineBasis=patch.outlineBasis;c.sourceTextSha256=patch.sourceTextSha256;c.outlineChecked=patch.checked;
  c.scopeNote='本列依校方PDF教學欄定位主題，主題序號由本站編排，非課本原課號；未涵蓋所有活動或小節。PDF頁碼待版面核對。';
 }
 D.atlas.statistics.locatedCourses=D.atlas.courses.filter(c=>c.sections.length).length;
 D.atlas.statistics.locatedSections=D.atlas.courses.reduce((n,c)=>n+c.sections.length,0);
 D.atlas.notes[0]=`${D.atlas.statistics.courseCount}份課程計畫與${D.atlas.statistics.examCount}份歷年題本是來源數，不是${D.atlas.statistics.sourceCount}份完成講義。`;
 D.atlas.notes.push('V2補入22份來源中的115個教學主題；其主題編號由本站整理，PDF頁碼待核對。原創閱讀導引與概念重點分別計數，不據此宣稱課本全文已覆蓋。');
 const sections=new Map(D.atlas.courses.flatMap(c=>c.sections.map(s=>[s.id,{c,s}])));
 const sources=new Map(D.sources.map(s=>[s.id,s]));
 function addSource(id,title,url,note){if(!sources.has(id)){const s={id,title,url,note,checked:'2026-10-01'};sources.set(id,s);D.sources.push(s);}return id;}
 function attach(c,s,u,status){
  if(s.unitId||units.has(u.id))throw Error('Duplicate lesson binding: '+s.id);
  D.units.push(u);units.set(u.id,u);s.unitId=u.id;s.noteStatus=status;s.fixedQuestions=u.quiz.length;
  s.quality=status==='reading-guide'?'原創閱讀導引；未核對課文全文':'原創精選觀念與基礎檢測；完整課文與所有題型未覆蓋';
  if(s.externalResources?.length)D.freeResources.unitMap[u.id]=[...s.externalResources];
 }
 for(const u of require('./english115-lessons.cjs').load()){
  const c=courses.get(u.atlasCourseId),s=c?.sections.find(s=>s.label===u.chapter&&s.title===u.title);
  if(!s||c.sourceId!==u.sourceId||c.publisher!==u.publisher||c.year!==u.schoolYear||c.grade!==u.grade)throw Error('English source anchor mismatch: '+u.id);
  addSource(`plan-115-1-english-${u.grade}`,c.title,c.url,'校方來源只核對單元名稱與學期；解說、例句及題目由本站編寫。');
  attach(c,s,u,'core-ready');
 }
 const seen=new Set();
 for(const r of rows){
  validateRow(r);if(seen.has(r.sectionId))throw Error('Duplicate catalog row: '+r.sectionId);seen.add(r.sectionId);
  const target=sections.get(r.sectionId);if(!target||target.s.title!==r.title)throw Error('Catalog title/source anchor mismatch: '+r.sectionId);
  const {c,s}=target,id='catalog-'+hash(r.sectionId);
  const refs=[addSource('catalog-plan-'+c.id,c.title,c.url,'本來源僅用於課名、年級、學期與課程定位，不表示校方審核本站原創內容。')];
  for(const source of r.sources)refs.push(addSource('catalog-ref-'+hash(source.url),source.title,source.url,'編寫本節時查閱的公開補充資料；題目為本站原創。'));
  const concepts=r.concepts.map((x,i)=>({id:'c'+(i+1),title:x.title,lead:x.lead,body:[x.body],example:x.example,sources:refs}));
  const offset=parseInt(hash(r.sectionId).slice(0,2),16)%4;
  const quiz=r.questions.map((q,i)=>{
   const values=[q.correct,...q.distractors],rotation=(i+offset)%4;
   const order=[0,1,2,3].map(j=>(j+rotation)%4);
   return {id:'q'+(i+1),concept:'c'+(q.concept+1),question:q.stem,options:order.map((k,j)=>({id:'abcd'[j],text:values[k],explanation:k===0?q.explanation:'請對照題目條件。'+q.explanation})),answer:'abcd'[order.indexOf(0)],explanation:q.explanation,sources:refs,difficulty:i===0?'基礎':i===1?'觀念':'應用',ability:c.subjectName+'概念理解與情境判讀',chapterLabel:c.year+'-'+c.term+' '+s.label+' '+s.title,origin:'本站原創練習，非出版社或校方原題'};
  });
  const reading=r.mode==='reading-guide';
  const u={id,grade:c.grade,semester:c.term,schoolYear:c.year,subject:c.bucket,domain:c.subjectName,publisher:c.publisher||'校方自編／未標版本',book:'第'+((c.grade-7)*2+c.term)+'冊',chapter:s.label,title:s.title,chapterPath:[c.year+'學年度'+(c.term===1?'上':'下')+'學期',c.subjectName,s.label,s.title],summary:r.summary,tagline:reading?'用原創文本練閱讀方法，配合課本核對。':'讀懂三個觀念，再用原創練習檢查。',tags:concepts.map(x=>x.title),tone:'green',minutes:12,version:'2.0.0',updated:'2026-10-01',status:'published',coverage:'school-section-guide',contentMode:r.mode,catalogSectionId:s.id,atlasCourseId:c.id,sourceId:c.sourceId,historicalAdoption:c.year<115,reviewNote:(reading?'原創閱讀導引；尚未核對該課全文，不等於課文講解完成。':'以下為本站原創精選重點與練習，不等於課本全文、完整活動或全部題型。')+' '+(r.note||'')+' 課名與學期依校方課程來源定位。',concepts,quiz,diagrams:[],tables:[{title:reading?'閱讀方法與原創例子':'觀念與例子',headers:['觀念','判斷重點','原創例子'],rows:concepts.map(x=>[x.title,x.lead,x.example]),note:'請連同題目條件判讀，並以課本與老師授課範圍核對。',sources:refs}],traps:r.concepts.map(x=>({wrong:x.misconception,right:x.correction,why:x.body,sources:refs})),experiments:[],quick:concepts.map(x=>x.lead)};
  attach(c,s,u,reading?'reading-guide':'core-ready');
 }
 for(const c of D.atlas.courses){
  c.readingGuideSections=c.sections.filter(s=>s.noteStatus==='reading-guide').length;
  c.readySections=c.sections.filter(s=>s.unitId&&s.noteStatus!=='reading-guide').length;
  c.availableSections=c.readySections+c.readingGuideSections;
 }
 for(const book of D.courseMap.books){
  const c=D.atlas.courses.find(c=>c.url===book.url&&c.grade===book.grade&&c.year===book.year&&c.term===book.semester);
  if(!c)throw Error('Legacy chapter source missing: '+book.id);
  for(const s of book.sections){
   const target=c.sections.find(x=>x.label===s.code&&x.title===s.title);
   if(!target)throw Error('Legacy chapter anchor mismatch: '+book.id+'/'+s.code);
   s.unitId=target.unitId;
  }
 }
 const list=D.atlas.courses.flatMap(c=>c.sections);
 D.freeResources.statistics.linkedLocalUnitCount=Object.values(D.freeResources.unitMap).filter(ids=>ids.length).length;
 D.catalogCompletion={version:'2.0.0',checked:'2026-10-01',newEnglishUnits:22,newCatalogUnits:rows.length,locatedSections:list.length,teachingSections:list.filter(s=>s.unitId&&s.noteStatus!=='reading-guide').length,readingGuideSections:list.filter(s=>s.noteStatus==='reading-guide').length,pendingSections:list.filter(s=>!s.unitId).length,untranscribedCourses:D.atlas.courses.filter(c=>!c.sections.length).length};
 D.appVersion='2.0.0';D.updated='2026-10-01';
 D.sourceNotice='逐課目錄按來源年級、科目及學期呈現。原創概念教學、原創閱讀導引與未完成項目分別計數；導引未核對課文全文，外部連結不算本地教學完成。';
 D.releaseMeta={version:'2.0.0',baseVersion:'1.9.0',addedLocalUnits:22+rows.length,addedFixedQuestions:D.units.reduce((n,u)=>n+u.quiz.length,0)-988,contentReview:'原創精選教材；未經學校或任課教師逐項審核'};
 return D;
}
module.exports={enrich,readRows,validateRow};
