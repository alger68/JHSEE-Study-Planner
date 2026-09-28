#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=f=>fs.readFileSync(path.join(__dirname,f),'utf8');
function replace(h,a,b){if(!h.includes(a))throw Error('Atlas build anchor missing: '+a.slice(0,100));return h.replace(a,()=>b);}
function build(input){let h=require('./build.cjs').build(input);
 const match=[...h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].find(s=>s[1].includes('window.STUDY_DATA ='));
 const D=JSON.parse(match[1].slice(match[1].indexOf('window.STUDY_DATA =')+19).trim().replace(/;$/,''));
 const lessons=require('./modules/atlas-lessons.cjs');D.units.push(...lessons.load());D.sources.push(...lessons.sources());D.appVersion='1.6.0';D.updated='2026-09-29';
 const b=D.courseMap.books.find(b=>b.id==='science-7-1');for(const s of b.sections){const u=D.units.find(u=>u.id==='atlas-bio-'+s.code);if(u)s.unitId=u.id;}
 D.atlas=require('./modules/source-atlas.cjs').bind(D);D.sourceNotice='143份官方來源分學年度索引。七上生物22個編號小節均有精選重點及固定檢測；其他章節的講義、題號紀錄與來源缺口分開標示，不代表三年全科教材已全部完成。';
 const core=[...h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].find(s=>s[1].includes('Shared pure functions'));const box={module:{exports:{}},URL};vm.runInNewContext(core[1],box);const errors=box.module.exports.validateData(D);if(errors.length)throw Error(errors.join('\n'));
 h=h.replace(match[0],()=>'<script>\nwindow.STUDY_DATA = '+JSON.stringify(D).replace(/</g,'\\u003c')+';\n</script>');
 h=replace(h,'/* Knowledge Station:',read('modules/atlas-ui.js').replace(/<\/script/gi,'<\\/script')+'\n/* Knowledge Station:');
 h=replace(h,"    else if(route.view==='chapters') main.innerHTML=window.CourseChaptersUI.render(D,C,route.params);","    else if(route.view==='chapters') main.innerHTML=window.CourseChaptersUI.render(D,C,route.params);\n    else if(route.view==='atlas') main.innerHTML=window.SourceAtlasUI.render(D,C,route.params);");
 h=replace(h,"const labels = {library:","const labels = {atlas:'教學與測驗地圖',library:");
 h=replace(h,'<div class="nav-label">學科目錄</div>','<a class="nav-item${active(\'atlas\')}" href="#/atlas"><span class="nav-icon">▤</span>教學與測驗地圖</a><div class="nav-label">學科目錄</div>');
 h=replace(h,'<section class="home-section" aria-labelledby="home-grade-title">','${window.SourceAtlasUI.banner()}<section class="home-section" aria-labelledby="home-grade-title">');
 h=replace(h,'${academy.unitBreadcrumb(u)}<header','${academy.unitBreadcrumb(u)}${window.SourceAtlasUI.unitTrail(D,u)}<header');
 h=replace(h,'</head>','<style>\n'+read('modules/atlas.css')+'\n</style>\n</head>');
 // Replace obsolete static help counters, not question IDs or storage schema versions.
 h=h.replace('62份共同核心指南＋2份原有生物專題＋8份校方章節精選重點','62份共同核心指南＋2份原有生物專題＋25份章節精選重點');
 return h;
}
if(require.main===module){const[i,o]=process.argv.slice(2);if(!i||!o)throw Error('Usage: node build-atlas.cjs input.html output.html');const h=build(fs.readFileSync(i,'utf8'));fs.mkdirSync(path.dirname(path.resolve(o)),{recursive:true});fs.writeFileSync(o,h);console.log('Built V1.6.0: 143 sources, 89 notes, 508 fixed questions.');}
module.exports={build};
