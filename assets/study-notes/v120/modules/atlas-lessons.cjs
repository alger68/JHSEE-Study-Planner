'use strict';
const fs=require('node:fs'),path=require('node:path');
function sources(){return[
 {id:'atlas-enzymes-hanlin',title:'翰林生物：酵素',url:'https://www.ehanlin.com.tw/app/keyword/國中/生物/酵素.html',checked:'2026-09-29',note:'補充核對酵素的催化、專一性與體外作用；不是校方課文。'},
 {id:'atlas-enzymes-review',title:'OpenStax Biology 2e：Enzymes',url:'https://openstax.org/books/biology-2e/pages/6-5-enzymes',checked:'2026-09-29',note:'外部基礎生物學參考；不同酵素有不同適合條件，不以單一溫度當通則。'},
 {id:'atlas-cells-review',title:'OpenStax Biology 2e：Eukaryotic Cells',url:'https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells',checked:'2026-09-29',note:'補充細胞與胞器分工。'},
 {id:'atlas-breathing-moe',title:'教育大市集／因材網：生物呼吸作用',url:'https://market.cloud.edu.tw/resources/video/1846153',checked:'2026-09-29',note:'補充呼吸作用與養分能量的觀念。'}
];}
const CONCEPTS={"1-1":[1,1,2,3,3,3],"1-2":[2,2,2,3,1,3],"1-3":[1,2,3,3,1,2],"2-1":[1,1,3,2,2,3],"2-2":[1,2,3,3,2,1],"2-4":[1,2,2,1,3,1],"3-1":[1,1,2,2,3,3],"3-2":[1,2,3,3,3,3],"4-1":[1,1,2,3,3,2],"4-4":[1,1,2,3,3,1],"5-1":[1,2,2,2,3,1],"5-2":[1,1,2,3,3,3],"5-3":[1,2,1,3,1,1],"5-4":[1,2,3,3,3,1],"6-1":[1,1,2,3,3,3],"6-2":[1,2,2,2,3,3],"6-3":[1,2,2,3,3,1]};
function load(){const text=fs.readFileSync(path.join(__dirname,'atlas-biology.txt'),'utf8');const units=[];
 for(const block of text.split('@@').filter(Boolean)){
  const lines=block.trim().split(/\r?\n/);const[code,title,pages]=lines.shift().split('|');const rows=lines.filter(l=>!l.startsWith('?')).map(l=>l.split('~')),qs=lines.filter(l=>l.startsWith('?')).map(l=>l.slice(1).split('|'));
  if(rows.length!==3||rows.some(r=>r.length!==4)||qs.length!==6||qs.some(q=>q.length!==6))throw Error('Malformed authored lesson '+code);
  const refs=['plan-science-7-1'];if(code==='3-2')refs.push('atlas-enzymes-hanlin','atlas-enzymes-review');if(['2-1','2-2'].includes(code))refs.push('atlas-cells-review');if(code==='6-1')refs.push('atlas-breathing-moe');
  const concepts=rows.map((r,i)=>({id:'c'+(i+1),title:r[0],lead:r[1],body:[r[2]],example:r[3],sources:refs}));
  const quiz=qs.map((q,i)=>{const order=[0,1,2,3].map(j=>(j+i)%4),options=order.map((k,j)=>({id:'abcd'[j],text:q[k+1],explanation:k===0?q[5]:'此敘述不符題意。'+q[5]}));return{id:'q'+(i+1),concept:'c'+CONCEPTS[code][i],question:q[0],options,answer:'abcd'[order.indexOf(0)],explanation:q[5],sources:refs,difficulty:i<2?'基礎':i<4?'觀念':'應用',ability:'科學概念與探究',chapterLabel:code+' '+title,origin:'本站自編基礎檢測，非永和歷屆原題、非出版社原題'};});
  units.push({id:'atlas-bio-'+code,grade:7,semester:1,subject:'science',domain:'自然・生物',publisher:'翰林',schoolYear:115,book:'第一冊',chapter:code,title,chapterPath:['115上學期',code,title],summary:concepts.map(c=>c.lead).join(' '),tagline:'先讀懂三個核心觀念，再用六題檢查。',tags:concepts.map(c=>c.title),tone:'green',minutes:12,version:'1.6.0',updated:'2026-09-29',status:'published',coverage:'school-section-guide',reviewNote:'章節依永和國中115-1課程計畫（PDF第'+pages+'頁）定位；解說、例子與六道題為本站自編，不是課文或歷屆題原文。精選重點已備，但不等於本節所有細節、活動與題型均已完成。',concepts,quiz,diagrams:[],tables:[{title:'觀念與例子對照',headers:['觀念','關鍵判斷','例子'],rows:concepts.map(c=>[c.title,c.lead,c.example]),note:'例子是本站自編教學情境，不代表校方考題。',sources:refs}],traps:qs.filter((q,i)=>i%2===0).map(q=>({wrong:q[2],right:q[1],why:q[5],sources:refs})),experiments:[],quick:concepts.map(c=>c.lead)});
 }
 return units;
}
module.exports={load,sources};
