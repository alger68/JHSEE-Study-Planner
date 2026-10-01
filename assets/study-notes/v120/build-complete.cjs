#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=f=>fs.readFileSync(path.join(__dirname,f),'utf8');
function replace(h,a,b){if(!h.includes(a))throw Error('V2 integration anchor missing: '+a.slice(0,90));return h.replace(a,()=>b);}
function build(input,options){
 let h=require('./build-free.cjs').build(input);
 const scripts=[...h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
 const original=scripts.find(s=>s[1].includes('window.STUDY_DATA =')),box={window:{}};
 vm.runInNewContext(original[1],box);
 const D=require('./modules/catalog-completion.cjs').enrich(JSON.parse(JSON.stringify(box.window.STUDY_DATA)),options);
 const core=scripts.find(s=>s[1].includes('Shared pure functions')),validation={module:{exports:{}},URL};
 vm.runInNewContext(core[1],validation);const errors=validation.module.exports.validateData(D);if(errors.length)throw Error(errors.join('\n'));
 h=h.replace(original[0],()=>'<script>\nwindow.STUDY_DATA = '+JSON.stringify(D).replace(/</g,'\\u003c')+';\n</script>');
 h=replace(h,'  function library(params){\n   const {g,s,t,valid}=filters(params);','  function library(params){\n   if(window.CurriculumBrowser)return window.CurriculumBrowser.render(D,params,getLegacy());\n   const {g,s,t,valid}=filters(params);');
 h=replace(h,'<section class="home-meta"><p>目前有','<section class="home-meta">${window.CurriculumBrowser.summary(D)}<p>目前有');
 h=replace(h,'<a href="#/chapters">校方章節與完成度</a>','<a href="#/atlas">課程來源與教材狀態</a>');
 h=replace(h,'下學期與其餘科目尚未在此逐節核對。','本頁保留這6份編號章節表；全科與上下學期請至教材目錄查看。');
 h=replace(h,"const ready=c.sections.filter(s=>s.unitId),questions=ready.reduce", "const ready=c.sections.filter(s=>s.unitId&&s.noteStatus!=='reading-guide'),questions=ready.reduce");
 h=replace(h,'已備精選重點／已轉錄單元','已備概念重點／已定位項目');
 h=replace(h,'對應固定檢測題','概念重點檢測題');
 h=replace(h,'${E(c.scopeNote)}「已備」','另有${c.readingGuideSections||0}節原創閱讀導引，未核對課文全文，不計入上述概念重點數。${E(c.scopeNote)}「已備」');
 h=replace(h,"${u?'精選重點已備':'筆記尚待編寫'}","${s.noteStatus==='reading-guide'?'原創閱讀導引':u?'精選重點已備':'筆記尚待編寫'}");
 h=replace(h,'<td>${c.readySections||0}份</td>','<td>${c.readySections||0}份重點${c.readingGuideSections?\'＋\'+c.readingGuideSections+\'份導引\':\'\'}</td>');
 h=replace(h,'章名來源：PDF第${s.page}頁','章名來源：${s.page?\'PDF第\'+s.page+\'頁\':\'校方教學表；PDF頁碼待核對\'}');
 h=replace(h,'62份共同核心指南＋2份原有生物專題＋54份當期章節重點＋29份114下學期數學＋6份歷史與16份健康教育重點','62份共同核心指南，另有依學期逐課定位的原創重點、閱讀導引與練習；數量依首頁顯示');
 h=replace(h,"${u?'重點可讀 · 固定題可作答 · 完整覆蓋待拓展':'原始來源可查 · 講義／題目待補齊'}","${s.noteStatus==='reading-guide'?'原創導引可讀與練習 · 課文全文未核對':u?'重點可讀 · 固定題可作答 · 完整覆蓋待拓展':'原始來源可查 · 講義／題目待補齊'}");
 // Apply legacy template patches before injecting new templates with shared fragments.
 h=replace(h,'</head>','<style>\n'+read('modules/curriculum-browser.css')+'\n</style>\n<script>\n'+read('modules/curriculum-browser.js').replace(/<\/script/gi,'<\\/script')+'\n</script>\n</head>');
 for(const s of h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(s[1]);
 return h;
}
if(require.main===module){
 const[i,o]=process.argv.slice(2);if(!i||!o)throw Error('Usage: node build-complete.cjs source.html output.html');
 const h=build(fs.readFileSync(i,'utf8'));
 for(const s of h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(s[1]);
 fs.mkdirSync(path.dirname(path.resolve(o)),{recursive:true});fs.writeFileSync(o,h);
 console.log('Built V2.0.0 complete catalog and original learning guides.');
}
module.exports={build};
