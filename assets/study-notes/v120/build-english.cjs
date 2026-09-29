#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function build(input){
  let html=require('./build-114.cjs').build(input);
  const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
  const original=scripts.find(s=>s[1].includes('window.STUDY_DATA ='));
  const box={window:{}};vm.runInNewContext(original[1],box);
  const data=JSON.parse(JSON.stringify(box.window.STUDY_DATA));
  const added=require('./modules/english115-lessons.cjs').load();
  for(const unit of added){
    if(data.units.some(u=>u.id===unit.id))throw Error('Duplicate English lesson '+unit.id);
    const course=data.atlas.courses.find(c=>c.id===unit.atlasCourseId);
    const section=course?.sections.find(s=>s.label===unit.chapter&&s.title===unit.title);
    if(!section||section.unitId||course.sourceId!==unit.sourceId||course.publisher!==unit.publisher||course.year!==unit.schoolYear||course.grade!==unit.grade)throw Error('English source mismatch '+unit.id);
    section.unitId=unit.id;section.noteStatus='core-ready';section.fixedQuestions=unit.quiz.length;
  }
  data.units.push(...added);
  for(const course of data.atlas.courses)course.readySections=course.sections.filter(s=>s.unitId).length;
  for(const grade of [7,8,9]){
    const course=data.atlas.courses.find(c=>c.id===`115-1-${grade}-english`);
    data.sources.push({id:`plan-115-1-english-${grade}`,title:`永和國中115-1 ${grade}年級英語課程計畫`,url:course.url,checked:'2026-09-29',note:'用以核對學校正式單元與選書。本站教學重點和題目自行編寫，不是校方或出版社原題。'});
  }
  data.appVersion='1.9.0';
  data.updated='2026-09-29';
  data.sourceNotice='115上學期七至九年級英語22單元、數學31節與七上生物22節已有精選教學及自編檢測；114下學期數學29節保留原年度資料。其他正式章節仍待編寫，已備不等於課本全文。';
  const core=scripts.find(s=>s[1].includes('Shared pure functions'));
  const sandbox={module:{exports:{}},URL};vm.runInNewContext(core[1],sandbox);
  const errors=sandbox.module.exports.validateData(data);
  if(errors.length)throw Error(errors.join('\n'));
  html=html.replace(original[0],()=>'<script>\nwindow.STUDY_DATA = '+JSON.stringify(data).replace(/</g,'\\u003c')+';\n</script>');
  return html;
}
if(require.main===module){const [input,output]=process.argv.slice(2);if(!input||!output)throw Error('Usage: node build-english.cjs input.html output.html');const html=build(fs.readFileSync(input,'utf8'));fs.mkdirSync(path.dirname(path.resolve(output)),{recursive:true});fs.writeFileSync(output,html);console.log('Built V1.9.0: 169 notes, 988 fixed questions, 22 current English units.');}
module.exports={build};
