'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {load:sourceAtlas}=require('./source-atlas.cjs');

function load(){
  const atlas=sourceAtlas();
  const units=[];
  for(const grade of [7,8,9]){
    const course=atlas.courses.find(c=>c.id===`115-1-${grade}-english`);
    const filename=path.join(__dirname,`english-${grade}-upper115.txt`);
    const blocks=fs.readFileSync(filename,'utf8').split('@@').filter(x=>x.trim());
    for(const block of blocks){
      const lines=block.trim().split(/\r?\n/);
      const [label,title]=lines.shift().split('|');
      const section=course.sections.find(s=>s.label===label&&s.title===title);
      const rows=lines.filter(x=>x&&!x.startsWith('?')).map(x=>x.split('~'));
      const tests=lines.filter(x=>x.startsWith('?')).map(x=>x.slice(1).split('|'));
      if(!section||rows.length!==3||rows.some(x=>x.length!==4)||tests.length!==6||tests.some(x=>x.length!==7))throw Error(`Invalid 115 English lesson: ${grade}/${label}`);
      const refs=[`plan-115-1-english-${grade}`];
      const concepts=rows.map((r,i)=>({id:`c${i+1}`,title:r[0],lead:r[1],body:[r[2]],example:r[3],sources:refs}));
      const quiz=tests.map(([concept,question,correct,...rest],i)=>{
        const [wrong1,wrong2,wrong3,explanation]=rest;
        const choices=[correct,wrong1,wrong2,wrong3];
        if(!['1','2','3'].includes(concept)||new Set(choices).size!==4||explanation.length<18)throw Error(`Invalid 115 English question: ${grade}/${label}/${i+1}`);
        const order=[0,1,2,3].map(j=>(j+i)%4);
        return {id:`q${i+1}`,concept:`c${concept}`,question,options:order.map((k,j)=>({id:'abcd'[j],text:choices[k],explanation:k===0?explanation:'先核對句型或短文線索。'+explanation})),answer:'abcd'[order.indexOf(0)],explanation,sources:refs,difficulty:i<2?'基礎':i<4?'觀念':'應用',ability:'英語語意與句型判讀',chapterLabel:`115-1 ${label} ${title}`,origin:'本站自編教學檢測，非校方或出版社原題'};
      });
      units.push({id:`school-en-115-${grade}-${label.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}`,grade,semester:1,subject:'english',domain:'英語',publisher:course.publisher,schoolYear:115,book:`第${(grade-7)*2+1}冊`,chapter:label,title,chapterPath:['115學年度上學期',label,title],summary:concepts.map(c=>c.lead).join(' '),tagline:'對照學校單元，閱讀原創重點並完成六題練習。',tags:concepts.map(c=>c.title),tone:'blue',minutes:15,version:'1.9.0',updated:'2026-09-29',status:'published',coverage:'school-section-guide',atlasCourseId:course.id,sourceId:course.sourceId,reviewNote:`單元名稱依永和國中115-1英語課程計畫PDF第${section.page}頁定位，${course.publisher}版。以下句型說明、例句及六道題為本站自編的精選練習；不轉載課文，不等於該課全部單字、聽力、活動及題型均已涵蓋。`,concepts,quiz,diagrams:[],tables:[{title:'句型與情境對照',headers:['觀念','使用時機','本站例句'],rows:concepts.map(c=>[c.title,c.lead,c.example]),note:'原創句型情境，請以正式課本與老師教學進度核對。',sources:refs}],traps:[1,2,3].map(n=>tests.find(q=>q[0]===String(n))).map(q=>({wrong:q[3],right:q[2],why:q[6],sources:refs})),experiments:[],quick:concepts.map(c=>c.lead)});
    }
    if(blocks.length!==course.sections.length)throw Error(`115 English section coverage mismatch: grade ${grade}`);
  }
  if(new Set(units.map(u=>u.id)).size!==units.length)throw Error('Duplicate 115 English lesson id');
  return units;
}
module.exports={load};
