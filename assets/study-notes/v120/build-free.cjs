#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=f=>fs.readFileSync(path.join(__dirname,f),'utf8');
function replace(h,a,b){if(!h.includes(a))throw Error('Free-resource integration anchor missing: '+a.slice(0,100));return h.replace(a,()=>b);}
function build(input){
 let h=require('./build-114.cjs').build(input);
 const scripts=[...h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
 const original=scripts.find(s=>s[1].includes('window.STUDY_DATA ='));
 const box={window:{}};vm.runInNewContext(original[1],box);
 const D=require('./modules/free-integration.cjs').enrich(JSON.parse(JSON.stringify(box.window.STUDY_DATA)));
 const core=scripts.find(s=>s[1].includes('Shared pure functions')),validation={module:{exports:{}},URL};
 vm.runInNewContext(core[1],validation);const errors=validation.module.exports.validateData(D);if(errors.length)throw Error(errors.join('\n'));
 h=h.replace(original[0],()=>'<script>\nwindow.STUDY_DATA = '+JSON.stringify(D).replace(/</g,'\\u003c')+';\n</script>');
 h=replace(h,'/* Knowledge Station:',read('modules/free-resources-ui.js').replace(/<\/script/gi,'<\\/script')+'\n/* Knowledge Station:');
 h=replace(h,"else if(route.view==='atlas') main.innerHTML=window.SourceAtlasUI.render(D,C,route.params);","else if(route.view==='atlas') main.innerHTML=window.SourceAtlasUI.render(D,C,route.params);\n    else if(route.view==='resources') main.innerHTML=window.FreeResourcesUI.render(D,C,route.params);");
 h=replace(h,"const labels = {atlas:","const labels = {resources:'免費教學補充',atlas:");
 h=replace(h,'<div class="nav-label">學科目錄</div>','<a class="nav-item${active(\'resources\')}" href="#/resources"><span class="nav-icon">↗</span>免費教學補充</a><div class="nav-label">學科目錄</div>');
 h=replace(h,'<div id="unit-content">','${window.FreeResourcesUI.unit(D,u)}<div id="unit-content">');
 h=replace(h,'}<details class="atlas-evidence">','}${window.FreeResourcesUI.section(D,s)}<details class="atlas-evidence">');
 h=replace(h,"return h+registry(A,grade)+'</div>';","return h+window.FreeResourcesUI.alternatives(D,grade,subject,period)+registry(A,grade)+'</div>';");
 h=replace(h,'<a class="btn primary" href="#/atlas">教學與測驗地圖 →</a></section>','<div class="actions"><a class="btn primary" href="#/atlas">教學與測驗地圖 →</a><a class="btn secondary" href="#/resources">免費教學補充 ↗</a></div></section>');
 h=replace(h,'143份官方來源已建索引。','${A.statistics.sourceCount}份校方課程／題本來源與${D.freeResources.resources.length}筆外部資源分開索引。');
 h=replace(h,'143份來源總覽與實際完成度','${A.statistics.sourceCount}份校方來源總覽與實際完成度');
 h=replace(h,'全部103份課程來源','全部${A.statistics.courseCount}份課程來源');
 h=replace(h,'全部40份歷年題本','全部${A.statistics.examCount}份歷年題本');
 h=replace(h,'本頁採用114學年度下學期資料作教學與測驗依據，保留當年出版社及課次；不改標為115年，也不宣稱是當期段考範圍。','本頁採用舊年度來源，原學年度、上下學期、出版社及課次依各筆標示保留；不改標為115年，也不宣稱是當期段考範圍。');
 h=replace(h,'62份共同核心指南＋2份原有生物專題＋54份當期章節重點＋29份114下學期數學重點','62份共同核心指南＋2份原有生物專題＋54份當期章節重點＋29份114下學期數學＋6份歷史與16份健康教育重點');
 h=replace(h,'</head>','<style>\n'+read('modules/free-resources.css')+'\n</style>\n</head>');
 h=replace(h,'115官方出版社分流，62份核心指南與生物專題，附變化題與錯題練習。','按來源年級與章節學習，整合舊年歷史／健康教材、免費資源與錯題練習；未完成範圍另列。');
 // Do not alter the practice snapshot version or any storage key.
 for(const s of h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(s[1]);
 return h;
}
if(require.main===module){const[i,o]=process.argv.slice(2);if(!i||!o)throw Error('Usage: node build-free.cjs original.html output.html');const h=build(fs.readFileSync(i,'utf8'));fs.mkdirSync(path.dirname(path.resolve(o)),{recursive:true});fs.writeFileSync(o,h);console.log('Built V1.9.0: 169 local units, 988 fixed questions; 146 school-source documents + 29 external links. Prepared build only; no deployment implied.');}
module.exports={build};
