'use strict';
// Original lessons based on the explicitly adopted 114-2 school syllabus.
const fs=require('node:fs'),path=require('node:path');
function parse(){
 const atlas=require('./source-atlas.cjs').load(),units=[],audits=[];
 for(const grade of [7,8,9]){
  const course=atlas.courses.find(c=>c.id===`114-2-${grade}-math`);
  for(const block of fs.readFileSync(path.join(__dirname,`math-${grade}-lower114.txt`),'utf8').split('@@').filter(s=>s.trim())){
   const lines=block.trim().split(/\r?\n/),[code,title]=lines.shift().split('|');
   const section=course.sections.find(s=>s.label===code&&s.title===title);
   const rows=lines.filter(l=>l&&!l.startsWith('?')).map(l=>l.split('~'));
   const qs=lines.filter(l=>l.startsWith('?')).map(l=>l.slice(1).split('|'));
   if(!section||rows.length!==3||rows.some(r=>r.length!==4)||qs.length!==6||qs.some(q=>q.length!==9))throw Error('Invalid 114 lesson '+grade+'/'+code);
   const id=`hist114-math-${grade}-${code}`,refs=[`plan-114-2-math-${grade}`];
   const concepts=rows.map((r,i)=>({id:'c'+(i+1),title:r[0],lead:r[1],body:[r[2]],example:r[3],sources:refs}));
   const quiz=qs.map((q,i)=>{
    const[c,question,correct,w1,w2,w3,explanation,proof,template]=q;
    if(!['1','2','3'].includes(c)||new Set([correct,w1,w2,w3]).size!==4)throw Error('Invalid question '+id+'/'+i);
    const values=[correct,w1,w2,w3],order=[0,1,2,3].map(j=>(j+i)%4);
    if(proof)audits.push({id:id+'/q'+(i+1),question,choices:values,proof});
    return{id:'q'+(i+1),concept:'c'+c,question,options:order.map((k,j)=>({id:'abcd'[j],text:values[k],explanation:k===0?explanation:'此選項不符合題意。'+explanation})),answer:'abcd'[order.indexOf(0)],explanation,sources:refs,template,difficulty:i<2?'基礎':i<4?'觀念':'應用',ability:'數學理解、運算與推理',chapterLabel:'114-2 '+code+' '+title,origin:'本站自編教學檢測，非校方或出版社原題'};
   });
   units.push({id,grade,semester:2,subject:'math',domain:'數學',publisher:course.publisher,schoolYear:114,book:'第'+((grade-7)*2+2)+'冊',chapter:code,title,chapterPath:['114學年度下學期',code,title],summary:concepts.map(c=>c.lead).join(' '),tagline:'採用114學年度章節，先讀重點再做六題檢測。',tags:concepts.map(c=>c.title),tone:grade===8?'blue':'green',minutes:15,version:'1.8.0',updated:'2026-09-29',status:'published',coverage:'school-section-guide',historicalAdoption:true,atlasCourseId:course.id,sourceId:course.sourceId,reviewNote:`使用者同意採用114學年度資料。正式章名依永和國中114-2課程計畫PDF第${section.page}頁定位；${course.publisher}版。觀念解說、例題與六題檢測為本站自編，並非原課文或歷屆原題。可作教學與複習，不宣稱為115當期課次或段考範圍，亦不代表涵蓋全部課文與題型。`,concepts,quiz,diagrams:[],tables:[{title:'觀念與例題對照',headers:['觀念','關鍵條件','例題／步驟'],rows:concepts.map(c=>[c.title,c.lead,c.example]),note:'來源提供章節與教學範圍；下列文字、例題與測驗為本站自編。',sources:refs}],traps:[1,2,3].map(c=>qs.find(q=>q[0]===String(c))).map(q=>({wrong:q[1]+' 誤選「'+q[3]+'」',right:'正確答案是「'+q[2]+'」。',why:q[6],sources:refs})),experiments:[],quick:concepts.map(c=>c.lead)});
  }
 }
 return{units,audits};
}
module.exports={load:()=>parse().units,audits:()=>parse().audits};
