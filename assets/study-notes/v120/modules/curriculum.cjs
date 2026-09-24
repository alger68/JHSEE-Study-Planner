'use strict';
const fs=require('node:fs'), path=require('node:path');
const versions=require('./versions.json');
const names={chinese:'國文',english:'英語',math:'數學',science:'自然',social:'社會',health:'健康與體育',arts:'藝術',integrated:'綜合活動',technology:'科技',taiwanese:'本土語・閩語',hakka:'本土語・客語'};
const shorts=['文','Aa','π','理','世','健','藝','綜','科','台','客'];
const references={
 math:['自編數學例題與原理解說；延伸：OpenStax Prealgebra 2e','https://openstax.org/books/prealgebra-2e/pages/1-introduction'],
 english:['自編文法題；參考：Cambridge English Grammar Today','https://dictionary.cambridge.org/grammar/british-grammar/'],
 science:['自編自然核心整理；參考：自然科學領域課程綱要公告','https://gazette2.nat.gov.tw/EG_FileManager/eguploadpub/eg024209/ch05/type2/gov40/num12/Eg.htm'],
 chinese:['自編閱讀例句與練習；延伸：國家教育研究院國語文教學研究','https://www.naer.edu.tw/PageMain6/projectDetail/RP000000000830'],
 social:['自編地理、史料與公民素養練習；延伸：教育大市集','https://market.cloud.edu.tw/'],
 health:['自編健體學習練習；延伸：衛福部兒少健康生活資料','https://www.mohw.gov.tw/cp-6651-78901-1.html'],
 arts:['自編藝術觀察與創作練習；延伸：教育大市集藝術資源','https://market.cloud.edu.tw/'],
 integrated:['自編生活與生涯學習活動；延伸：教育大市集','https://market.cloud.edu.tw/'],
 technology:['自編科技練習；參考：科技領域課程綱要公告','https://gazette.nat.gov.tw/EG_FileManager/eguploadpub/eg024180/ch05/type2/gov40/num9/Eg.htm'],
 taiwanese:['教育部臺灣台語常用詞辭典：音讀與工具使用參考','https://sutian.moe.edu.tw/zh-hant/'],
 hakka:['教育部臺灣客語辭典：腔調、音讀與工具使用參考','https://hakkadict.moe.edu.tw/']
};
function load(){
 const subjects=Object.entries(names).map(([id,name],i)=>({id,name,short:shorts[i],status:'published'}));
 const sources=[{id:'school-115-live',title:'永和國中115學年度教科書版本（原始公告現況）',url:versions.source,note:'2026-09-24直接取得原圖逐格核對；網站可能沿用同一公告網址。只證明出版社，不證明本站已覆蓋全部課文。',checked:versions.checked},...Object.entries(references).map(([id,[title,url]])=>({id:'core-'+id,title,url,note:'學習主題與延伸查核資源；本站文字與題目自行編寫，不是教材原文，也不是每一題的出版社出處。',checked:'2026-09-24'}))];
 const units=[];
 for(const subject of Object.keys(names)){
  let u=null;
  for(const line of fs.readFileSync(path.join(__dirname,'content',subject+'.txt'),'utf8').split(/\r?\n/)){
   if(!line.trim())continue;
   if(line.startsWith('@')){
    const [scope,title]=line.slice(1).split('|'),[grade,semester]=scope.split('/').map(Number),pub=versions.mapping[subject][grade-7];
    if(!pub)throw Error('本學年沒有已列版本，不能建立 '+subject+scope);
    const local=['taiwanese','hakka'].includes(subject);
    u={id:`${subject}-${grade}-${semester}`,subject,domain:names[subject],grade,semester,publisher:pub,schoolYear:115,chapter:`第${(grade-7)*2+semester}冊核心`,title,summary:'六個核心主題，搭配例子、易錯觀念與自我檢測。',tagline:'先讀懂，再用題目確認。',tags:[],tone:grade===8?'blue':'green',minutes:18,version:'1.2.0',updated:'2026-09-24',status:'published',coverage:local?'language-learning-guide':'semester-core-guide',reviewNote:(local?'本土語核心學習方法與文化素養，非課本逐課音讀；請依實際選修語別與腔調使用。':'自編學期核心整理，不等於該出版社全部課文或完整章節目錄。')+'出版社已依115官方表核對；主題編排不是校方進度，課次與段考範圍仍需對照實際課本。',concepts:[],quiz:[],diagrams:[],tables:[],traps:[],experiments:[],quick:[]};units.push(u);continue;
   }
   if(!u)throw Error('missing header');
   const a=line.split('|');if(a.length!==12)throw Error(`bad row ${subject}: ${a.length}`);
   const [title,lead,detail,example,wrong,question,correct,w1,w2,w3,explanation,template]=a;
   const n=u.concepts.length+1,refs=['core-'+subject];
   u.concepts.push({id:'c'+n,title,lead,body:[detail],example,sources:refs,template});
   u.quiz.push({id:'q'+n,concept:'c'+n,question,options:[correct,w1,w2,w3].map((text,i)=>({id:'abcd'[i],text,explanation:i===0?explanation:`此選項不符合本題條件。${explanation}`})),answer:'a',explanation,sources:refs,origin:'本站原創核心練習，非出版社原題',template});
   u.traps.push({wrong,right:lead,why:detail,sources:refs});u.quick.push(lead);
  }
 }
 for(const u of units){
  if(u.concepts.length!==6)throw Error('core count '+u.id);
  u.tags=u.concepts.slice(0,3).map(c=>c.title);
  u.summary=u.concepts.map(c=>c.title).join('、')+'。';
  u.tables=[{title:'六個核心觀念對照',headers:['主題','要點','例子'],rows:u.concepts.map(c=>[c.title,c.lead,c.example]),note:'本站自行整理的核心概念，不是課本目錄。',sources:['core-'+u.subject]}];
 }
 return {versions,subjects,sources,units};
}
module.exports={load};
