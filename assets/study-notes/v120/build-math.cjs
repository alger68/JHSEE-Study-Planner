#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function build(input){
 let html=require('./build-atlas.cjs').build(input);
 const scripts=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
 const original=scripts.find(s=>s[1].includes('window.STUDY_DATA ='));
 if(!original)throw Error('Embedded source data missing');
 const marker='window.STUDY_DATA =';
 const D=JSON.parse(original[1].slice(original[1].indexOf(marker)+marker.length).trim().replace(/;$/,''));
 const added=require('./modules/math-completion.cjs').load();
 for(const u of added){
  if(D.units.some(x=>x.id===u.id))throw Error('Duplicate lesson '+u.id);
  const book=D.courseMap.books.find(b=>b.id===`math-${u.grade}-1`),section=book?.sections.find(s=>s.code===u.chapter);
  if(!section||section.title!==u.title||section.unitId)throw Error('Chapter mismatch or overwrite '+u.id);
  section.unitId=u.id;
 }
 D.units.push(...added);D.appVersion='1.7.0';D.updated='2026-09-29';
 D.atlas=require('./modules/source-atlas.cjs').bind(D);
 D.sourceNotice='143份官方來源分學年度管理。七上生物22節與七至九年級上學期數學31節皆有精選重點及固定檢測。其他科目仍有缺口；章節已有重點不等於全課文及全部題型已完成。';
 const core=scripts.find(s=>s[1].includes('Shared pure functions')),box={module:{exports:{}},URL};
 vm.runInNewContext(core[1],box);const errors=box.module.exports.validateData(D);if(errors.length)throw Error(errors.join('\n'));
 html=html.replace(original[0],()=>'<script>\nwindow.STUDY_DATA = '+JSON.stringify(D).replace(/</g,'\\u003c')+';\n</script>');
 html=html.replace('62份共同核心指南＋2份原有生物專題＋25份章節精選重點','62份共同核心指南＋2份原有生物專題＋54份章節精選重點');
 return html;
}
if(require.main===module){const[i,o]=process.argv.slice(2);if(!i||!o)throw Error('Usage: node build-math.cjs input.html output.html');const h=build(fs.readFileSync(i,'utf8'));fs.mkdirSync(path.dirname(path.resolve(o)),{recursive:true});fs.writeFileSync(o,h);console.log('Built V1.7.0: 118 notes, 682 fixed questions; all 31 current mathematics sections have core notes.');}
module.exports={build};
