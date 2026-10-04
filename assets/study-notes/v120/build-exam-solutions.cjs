#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=f=>fs.readFileSync(path.join(__dirname,f),'utf8');
function replace(h,a,b){if(!h.includes(a))throw Error('Exam integration anchor missing: '+a.slice(0,90));return h.replace(a,()=>b);}
function build(input,options={}){
 let h=require('./build-all-subjects.cjs').build(input);
 const script=[...h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].find(s=>s[1].includes('window.STUDY_DATA =')),box={window:{}};vm.runInNewContext(script[1],box);
 const D=require('./modules/exam-solutions.cjs').enrich(JSON.parse(JSON.stringify(box.window.STUDY_DATA)),options.papers);require('./modules/reading-support.cjs').enrich(D,options.readingRows);D.appVersion=D.examSolutions.version;D.updated='2026-10-03';
 h=replace(h,script[0],'<script>\nwindow.STUDY_DATA = '+JSON.stringify(D).replace(/</g,'\\u003c')+';\n</script>');
 h=replace(h,'</head>','<style>\n'+read('modules/exam-solutions.css')+'\n</style>\n<script>\n'+read('modules/exam-solutions.cjs')+'\n'+read('modules/exam-solutions-ui.cjs')+'\n'+read('modules/reading-support.cjs')+'\n</script>\n</head>');
 h=replace(h,"    return `${heading('先讀懂這 '","    return `${window.ReadingSupport.render(u)}${heading('先讀懂這 '");
 h=replace(h,'<section class="home-section" aria-labelledby="home-grade-title">','${window.ExamSolutionsUI.homeLink(D)}<section class="home-section" aria-labelledby="home-grade-title">');
 h=replace(h,"    else if(route.view==='learn')", "    else if(route.view==='papers'){main.innerHTML=window.ExamSolutionsUI.render(D,route.params);window.ExamSolutionsUI.load(D,route.params,main);}\n    else if(route.view==='learn')");
 h=replace(h,'閱讀導引使用原創例子，尚未核對課文全文。','閱讀導引使用原創例子；原作與課本版本核對狀態見各課補充。');
 h=replace(h,"'<p class=\"curriculum-reading-note\">原創文本與閱讀方法練習，尚未核對本課全文。</p>'","'<p class=\"curriculum-reading-note\">'+E(window.ReadingSupport.notice(u))+'</p>'");
 h=replace(h,"'<p class=\"learning-source-note\" data-reading-guide>原創閱讀導引，未核對課文全文；請搭配自己的課本。</p>'","'<p class=\"learning-source-note\" data-reading-guide>'+E(window.ReadingSupport.notice(u))+'</p>'");
 h=replace(h,"'<br><strong>原創閱讀導引；未核對本課全文，題目使用原創材料，不代表同名課文內容。</strong>'","'<br><strong>'+E(window.ReadingSupport.notice(u))+'</strong>'");
 h=replace(h,"'<p><strong>原創閱讀導引：使用原創文本與閱讀方法練習，尚未核對本課全文。</strong></p>'","'<p><strong>'+E(window.ReadingSupport.notice(u))+'</strong></p>'");
 h=replace(h,"'原創導引可讀與練習 · 課文全文未核對'","window.ReadingSupport.notice(u)");
 h=replace(h,'節原創閱讀導引，未核對課文全文，不計入上述概念重點數。','節原創閱讀導引，課文核對狀態見各課補充，不計入上述概念重點數。');
 h=h.replaceAll('E(u.reviewNote)','E(window.ReadingSupport.reviewNote(u))');
 h=replace(h,'${window.CurriculumBrowser.summary(D)}','${window.CurriculumBrowser.summary(D)}${window.ReadingSupport.summary(D)}');
 h=replace(h,'const labels = {',"const labels = {papers:'歷屆段考詳解',");
 h=replace(h,'<span class="nav-icon">▦</span>教材目錄</a>','<span class="nav-icon">▦</span>教材目錄</a><a class="nav-item${active(\'papers\')}" href="#/papers"><span class="nav-icon">≡</span>歷屆段考詳解</a>');
 h=replace(h,'<h2>歷屆考卷與範圍校對</h2>','<h2>歷屆考卷與範圍校對</h2><p><a class="btn secondary" href="#/papers?g=${c.grade}">閱讀歷屆原創詳解 →</a></p>');
 for(const s of h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(s[1]);
 return h;
}
if(require.main===module){const[input,output]=process.argv.slice(2);if(!input||!output)throw Error('Usage: node build-exam-solutions.cjs source.html output.html');const h=build(fs.readFileSync(input,'utf8'));fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});fs.writeFileSync(output,h);console.log('Built V2.1.6 historical exam solutions.');}
module.exports={build};
