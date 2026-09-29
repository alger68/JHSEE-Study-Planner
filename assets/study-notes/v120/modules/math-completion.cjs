'use strict';
// Original mathematics teaching notes. School PDFs establish chapter scope only.
const fs=require('node:fs'),path=require('node:path');
function parse(){
 const units=[],audits=[];
 for(const grade of [7,8,9]){
  const text=fs.readFileSync(path.join(__dirname,`math-${grade}-upper.txt`),'utf8');
  for(const block of text.split('@@').filter(s=>s.trim())){
   const lines=block.trim().split(/\r?\n/),[code,title,pages]=lines.shift().split('|');
   const rows=lines.filter(l=>l&&!l.startsWith('?')).map(l=>l.split('~'));
   const questions=lines.filter(l=>l.startsWith('?')).map(l=>l.slice(1).split('|'));
   if(!/^\d-\d$/.test(code)||!title||!pages||rows.length!==3||rows.some(r=>r.length!==4)||questions.length!==6||questions.some(q=>q.length!==9))throw Error(`Malformed math lesson ${grade}/${code}`);
   const id=`atlas-math-${grade}-${code}`,refs=[`plan-math-${grade}-1`];
   const concepts=rows.map((r,i)=>({id:'c'+(i+1),title:r[0],lead:r[1],body:[r[2]],example:r[3],sources:refs}));
   const quiz=questions.map((q,i)=>{
    const[c,question,correct,w1,w2,w3,explanation,proof,template]=q;
    if(!['1','2','3'].includes(c)||new Set([correct,w1,w2,w3]).size!==4)throw Error(`Invalid math choices/concept ${id}/q${i+1}`);
    const order=[0,1,2,3].map(j=>(j+i)%4),answers=[correct,w1,w2,w3];
    const options=order.map((k,j)=>({id:'abcd'[j],text:answers[k],explanation:k===0?explanation:'此選項不符合題意。'+explanation}));
    if(proof)audits.push({id:id+'/q'+(i+1),question,choices:answers,proof});
    return{id:'q'+(i+1),concept:'c'+c,question,options,answer:'abcd'[order.indexOf(0)],explanation,sources:refs,template,difficulty:i<2?'基礎':i<4?'觀念':'應用',ability:'數學理解、運算與推理',chapterLabel:code+' '+title,origin:'本站自編章節檢測，非校方或出版社原題'};
   });
   const traps=[1,2,3].map(c=>questions.find(q=>q[0]===String(c))).filter(Boolean).map(q=>({wrong:q[1]+' 誤選「'+q[3]+'」',right:'正確答案是「'+q[2]+'」。',why:q[6],sources:refs}));
   units.push({id,grade,semester:1,subject:'math',domain:'數學',publisher:'康軒',schoolYear:115,book:'第'+((grade-7)*2+1)+'冊',chapter:code,title,chapterPath:['115上學期',code,title],summary:concepts.map(c=>c.lead).join(' '),tagline:'先讀觀念與解題步驟，再做六題檢查。',tags:concepts.map(c=>c.title),tone:grade===8?'blue':'green',minutes:15,version:'1.7.0',updated:'2026-09-29',status:'published',coverage:'school-section-guide',reviewNote:`章節與考點依永和國中115-1數學課程計畫PDF第${pages}頁定位。解說、步驟例題與六題檢測為本站自編；不是原課文或歷屆題全文。各節均有精選重點，但不代表涵蓋該節全部課文、作圖及進階題型。`,concepts,quiz,diagrams:[],tables:[{title:'觀念與解題步驟對照',headers:['觀念','使用條件／關鍵','例題步驟'],rows:concepts.map(c=>[c.title,c.lead,c.example]),note:'先檢查條件與單位，再計算並代回驗證。',sources:refs}],traps,experiments:[],quick:concepts.map(c=>c.lead)});
  }
 }
 return{units,audits};
}
function load(){return parse().units;}
function audits(){return parse().audits;}
module.exports={load,audits};
