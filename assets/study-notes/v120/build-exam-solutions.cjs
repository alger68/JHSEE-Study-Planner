#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=f=>fs.readFileSync(path.join(__dirname,f),'utf8');
function replace(h,a,b){if(!h.includes(a))throw Error('Exam integration anchor missing: '+a.slice(0,90));return h.replace(a,()=>b);}
function build(input,options={}){
 let h=require('./build-all-subjects.cjs').build(input);
 const script=[...h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].find(s=>s[1].includes('window.STUDY_DATA =')),box={window:{}};vm.runInNewContext(script[1],box);
 const D=require('./modules/exam-solutions.cjs').enrich(JSON.parse(JSON.stringify(box.window.STUDY_DATA)),options.papers);D.appVersion=D.examSolutions.version;
 h=replace(h,script[0],'<script>\nwindow.STUDY_DATA = '+JSON.stringify(D).replace(/</g,'\\u003c')+';\n</script>');
 h=replace(h,'</head>','<style>\n'+read('modules/exam-solutions.css')+'\n</style>\n<script>\n'+read('modules/exam-solutions.cjs')+'\n'+read('modules/exam-solutions-ui.cjs')+'\n</script>\n</head>');
 h=replace(h,'<section class="home-section" aria-labelledby="home-grade-title">','${window.ExamSolutionsUI.homeLink(D)}<section class="home-section" aria-labelledby="home-grade-title">');
 h=replace(h,"    else if(route.view==='learn')", "    else if(route.view==='papers'){main.innerHTML=window.ExamSolutionsUI.render(D,route.params);window.ExamSolutionsUI.load(D,route.params,main);}\n    else if(route.view==='learn')");
 h=replace(h,'const labels = {',"const labels = {papers:'歷屆段考詳解',");
 h=replace(h,'<span class="nav-icon">▦</span>教材目錄</a>','<span class="nav-icon">▦</span>教材目錄</a><a class="nav-item${active(\'papers\')}" href="#/papers"><span class="nav-icon">≡</span>歷屆段考詳解</a>');
 h=replace(h,'<h2>歷屆考卷與範圍校對</h2>','<h2>歷屆考卷與範圍校對</h2><p><a class="btn secondary" href="#/papers?g=${c.grade}">閱讀歷屆原創詳解 →</a></p>');
 for(const s of h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(s[1]);
 return h;
}
if(require.main===module){const[input,output]=process.argv.slice(2);if(!input||!output)throw Error('Usage: node build-exam-solutions.cjs source.html output.html');const h=build(fs.readFileSync(input,'utf8'));fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});fs.writeFileSync(output,h);console.log('Built V2.1.2 historical exam solutions.');}
module.exports={build};
