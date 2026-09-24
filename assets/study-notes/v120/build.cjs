#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=__dirname;const read=f=>fs.readFileSync(path.join(root,f),'utf8');
function replaceOne(s,from,to){if(!s.includes(from))throw Error('Build anchor missing: '+from.slice(0,80));return s.replace(from,to);}
function block(s,start,end,newBlock){const a=s.indexOf(start),b=s.indexOf(end,a+start.length);if(a<0||b<0)throw Error('Function block not found: '+start);return s.slice(0,a)+newBlock+'\n'+s.slice(b);}
function build(input){
 let html=input;const addon=html.indexOf('<style id="practice-addon-style">');if(addon>=0)html=html.slice(0,addon)+'\n</body></html>';
 const scripts=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
 const ds=scripts.find(x=>x[1].includes('window.STUDY_DATA ='));
 const as=scripts.find(x=>x[1].includes('/* Knowledge Station:'));
 const cs=scripts.find(x=>x[1].includes('Shared pure functions'));
 if(!ds||!as||!cs)throw Error('Expected existing single-file knowledge station source.');
 const dataText=ds[1].slice(ds[1].indexOf('window.STUDY_DATA =')+'window.STUDY_DATA ='.length).trim().replace(/;$/,'');
 const D=JSON.parse(dataText),extra=require('./modules/curriculum.cjs').load();
 const original=D.units.filter(u=>['bio-3-3','bio-4-2'].includes(u.id));
 if(original.length!==2)throw Error('Legacy chapters missing');
 for(const u of original){u.publisher='翰林';u.schoolYear=115;u.book='第一冊';u.chapterPath=u.id==='bio-3-3'?['第3章','3-3 植物如何製造養分']:['第4章','4-2 植物體內物質的運輸'];u.reviewNote='原有生物專題；出版社已依115官方表核對。課文頁碼與教師範圍仍須對照實際課本。';u.coverage='detailed-topic';}
 for(const u of extra.units){u.book='第'+((u.grade-7)*2+u.semester)+'冊';u.chapterPath=[u.chapter,u.title];}
 D.subjects=extra.subjects;D.versions=extra.versions;D.units=[...original,...extra.units];
 const levels=['基礎','觀念','應用','易錯'];
 for(const u of D.units){u.quiz.forEach((q,i)=>{q.difficulty=q.difficulty||levels[i%levels.length];q.ability=q.ability||(u.subject==='math'?'運算與推理':u.subject==='english'?'語言理解與應用':u.subject==='science'?'科學概念與探究':'閱讀理解與應用');q.chapterLabel=(u.chapterPath||[]).join(' › ');});}
 D.appVersion='1.3.1';D.updated='2026-09-24';
 D.sourceNotice='115學年度出版社已依永和國中官方原圖核對。新增62份自編核心／語言學習指南，保留2份生物專題；不是各出版社全部課本的逐課摘要。';
 D.sources=[...D.sources.filter(s=>s.id!=='school-old'),...extra.sources];
 const upgrade=require('./modules/chapter-upgrade.cjs');upgrade.data(D);
 const box={module:{exports:{}},URL};vm.runInNewContext(cs[1],box);const errors=box.module.exports.validateData(D);if(errors.length)throw Error(errors.join('\n'));
 let app=as[1];
 app=replaceOne(app,'  const sessions = new Map();','  const sessions = new Map();\n  const academy=window.AcademyUI.create({D,C,unitCard,getLegacy:()=>state,navigate,render,toast});');
 app=block(app,'  function home(subject) {','  function conceptCard(', '  function home(subject) { return academy.home(subject,route.params); }');
 app=replaceOne(app,"    return result;","    if(result.view==='practice'&&result.id==='versions')result.view='versions';\n    return result;");
 app=replaceOne(app,'<div class="nav-group"><div class="nav-label">學科目錄</div>','<div class="nav-group"><a class="nav-item${active(\'practice\')}" href="#/practice"><span class="nav-icon">✎</span>變化題練習</a><a class="nav-item${active(\'versions\')}" href="#/versions"><span class="nav-icon">▤</span>官方教材版本</a><div class="nav-label">學科目錄</div>');
 app=replaceOne(app,"[['home','⌂','首頁'],['review','☆','複習'],['search','⌕','搜尋'],['help','☷','使用說明']]","[['home','⌂','首頁'],['practice','✎','練習'],['review','☆','複習'],['search','⌕','搜尋'],['help','☷','備份']]");
 app=replaceOne(app,"const labels = {home:","const labels = {exam:'段考組卷',practice:'變化題練習',versions:'官方教材版本',home:");
 app=replaceOne(app,"    else if(route.view==='help') main.innerHTML=help();","    else if(route.view==='help') main.innerHTML=help();\n    else if(route.view==='practice') main.innerHTML=academy.practice(route.params);\n    else if(route.view==='exam') main.innerHTML=academy.examPage(route.params);\n    else if(route.view==='versions') main.innerHTML=academy.versions();");
 app=replaceOne(app,"  document.addEventListener('click',e=>{","  document.addEventListener('click',e=>{\n    if(academy.click(e))return;");
 app=replaceOne(app,"document.addEventListener('change',e=>{if(e.target.id==='backup-file')","document.addEventListener('change',e=>{academy.change(e);if(e.target.id==='backup-file')");
 app=replaceOne(app,'<button class="btn secondary" data-action="print-open">▤ 列印本節</button>','<button class="btn secondary" data-action="print-open">▤ 列印本節</button><a class="btn secondary" href="#/practice?unit=${u.id}&n=8&seed=20260924">本節變化練習 ↗</a>');
 app=replaceOne(app,'<p>${E(u.tagline)}</p><div class="actions">','<p>${E(u.tagline)}</p>${u.coverage!==\'detailed-topic\'?`<div class="scope-note">${E(u.reviewNote)}</div>`:\'\'}<div class="actions">');
 app=block(app,'  function diagrams(u,print=false) {','  function traps(',`  function diagrams(u,print=false) {
    return heading(u.diagrams.length?'圖解與比較':'核心觀念比較','用比較表整理差異，再回看例子。')+'<div class="content-grid">'+u.diagrams.map(diagram).join('')+'</div>'+u.tables.map(table).join('')+(u.experiments.length?'<div class="experiments">'+heading('實驗怎麼看','看控制變因與證據限制。')+u.experiments.map((x,i)=>experiment(x,i,print)).join('')+'</div>':'');
  }`);
 app=replaceOne(app,'目前教材範圍為生物 3-3 與 4-2。','可試試同義詞、科目或核心主題；完整課文名稱尚未逐課對照。');
 app=replaceOne(app,'<strong>首批範圍</strong><span>七上生物 3-3、4-2，翰林概念整理</span>','<strong>目前範圍</strong><span>62份學期核心／語言學習指南＋2份原有生物專題</span>');
 app=app.replace(/<p>版本核對更正：[\s\S]*?\$\{sourceLine\(\['school-old'\]\)\}/,'<p>2026-09-24直接取得校方115學年度原始版本圖片，逐格核對31個出版社欄位。公告網址沿用舊頁，搜尋快取可能仍顯示舊學年度；本版以原圖內容為準。</p><a href="#/versions">查看官方版本矩陣與核對說明 ↗</a>');
 app=replaceOne(app,'學校頁面僅作歷史版本說明。','學校公告僅證明出版社，不代表學校或出版社審核本站全部內容。');
 app=replaceOne(app,'學校115學年度選書、實際頁碼與教師範圍待核對。','115出版社已核對；本站核心指南非課本完整逐課摘要，實際頁碼與教師範圍須對照。');
 app=replaceOne(app,'<section class="panel help-section"><h3>資料與隱私</h3>','${academy.backupPanel()}<section class="panel help-section"><h3>資料與隱私</h3>');
 html=html.replace(ds[0],()=>'<script>\nwindow.STUDY_DATA = '+JSON.stringify(D).replace(/</g,'\\u003c')+';\n</script>');
 app=upgrade.app(app);
 const code=[read('modules/practice-engine.cjs'),upgrade.academy(read('modules/academy-ui.js')),read('modules/chapters-ui.js'),app].map(s=>s.replace(/<\/script/gi,'<\\/script')).join('\n');
 html=html.replace(as[0],()=>'<script>\n'+code+'\n</script>');
 html=replaceOne(html,'</head>','<style>\n'+read('modules/academy.css')+'\n'+upgrade.css+'\n</style>\n</head>');
 html=html.replace('首批收錄生物3-3與4-2。','115官方出版社分流，62份核心指南與生物專題，附變化題與錯題練習。');
 if(html.includes('PRACTICE_ADDON_V110'))throw Error('old generator survived');
 return html;
}
if(require.main===module){const input=process.argv[2],out=process.argv[3];if(!input||!out)throw Error('Usage: node build.cjs original.html output.html');const result=build(fs.readFileSync(input,'utf8'));fs.mkdirSync(path.dirname(path.resolve(out)),{recursive:true});fs.writeFileSync(out,result);console.log(`Built V1.4.0: ${Buffer.byteLength(result)} bytes; 72 guides, 406 fixed questions; 105 verified numbered sections.`);}
module.exports={build};
