'use strict';
const maps=require('./course-chapters.cjs');
const lessons=require('./chapter-lessons.cjs');
function replace(s,a,b){if(!s.includes(a))throw Error('Chapter integration anchor missing: '+a.slice(0,60));return s.replace(a,b);}
function data(D){D.courseMap=maps.map();D.units.push(...lessons.load());D.sources.push(...maps.sources());D.appVersion='1.4.0';D.sourceNotice='115官方出版社已核對；另依6份115上學期數學／自然計畫核對105個編號小節。62份共同核心指南、原2份生物專題與新增8份章節精選重點，並非全課本逐課完成。';return D;}
function app(s){
 s=replace(s,"  function home(subject) { return academy.home(subject,route.params); }","  function home(subject) { return window.CourseChaptersUI.banner(D,C)+academy.home(subject,route.params); }");
 s=replace(s,"    else if(route.view==='versions') main.innerHTML=academy.versions();","    else if(route.view==='versions') main.innerHTML=academy.versions();\n    else if(route.view==='chapters') main.innerHTML=window.CourseChaptersUI.render(D,C,route.params);");
 s=replace(s,"const labels = {exam:","const labels = {chapters:'校方章節',exam:");
 s=replace(s,'<div class="nav-label">學科目錄</div>','<a class="nav-item${active(\'chapters\')}" href="#/chapters"><span class="nav-icon">▦</span>校方章節</a><div class="nav-label">學科目錄</div>');
 s=s.replace('62份學期核心／語言學習指南＋2份原有生物專題','62份共同核心指南＋2份原有生物專題＋8份校方章節精選重點');
 return s;
}
function academy(s){return replace(s,'<div><b>2</b><span>原有生物完整專題</span></div>','<div><b>10</b><span>章節對應重點（含原生物專題）</span></div>');}
const css=`.sidebar{overflow-y:auto}.chapter-banner{display:flex;gap:20px;align-items:center;justify-content:space-between;background:#edf3e8}.chapter-banner>div{min-width:0}.chapter-banner .btn{flex-shrink:0}.chapter-section{margin:28px 0}.chapter-section>h2{margin-bottom:15px}.chapter-list{display:grid;gap:12px}.chapter-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:16px;align-items:center;background:white;border:1px solid var(--line);border-radius:15px;padding:20px}.chapter-row h3{margin:8px 0;overflow-wrap:anywhere}.chapter-links{display:flex;gap:8px;flex-wrap:wrap}.chapter-links .badge{white-space:normal}@media(max-width:740px){.chapter-row{grid-template-columns:1fr}.chapter-banner{display:block}.chapter-banner .btn{margin-top:12px}.chapter-links .btn{flex:1}.chapter-row{padding:17px}}`;
module.exports={data,app,academy,css};
