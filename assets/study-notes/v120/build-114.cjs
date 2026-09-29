#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function replace(h,a,b){if(!h.includes(a))throw Error('114 integration anchor missing: '+a.slice(0,70));return h.replace(a,b);}
function build(input){
 let h=require('./build-math.cjs').build(input);
 const scripts=[...h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)],original=scripts.find(s=>s[1].includes('window.STUDY_DATA ='));
 const marker='window.STUDY_DATA =',D=JSON.parse(original[1].slice(original[1].indexOf(marker)+marker.length).trim().replace(/;$/,''));
 const added=require('./modules/lower114-completion.cjs').load();
 for(const u of added){
  if(D.units.some(x=>x.id===u.id))throw Error('Duplicate unit '+u.id);
  const c=D.atlas.courses.find(c=>c.id===u.atlasCourseId),s=c?.sections.find(s=>s.label===u.chapter);
  if(!s||s.unitId||s.title!==u.title||c.sourceId!==u.sourceId||c.year!==u.schoolYear||c.term!==u.semester||c.grade!==u.grade||c.publisher!==u.publisher)throw Error('Historical course mismatch '+u.id);
  s.unitId=u.id;s.noteStatus='core-ready';s.fixedQuestions=u.quiz.length;
 }
 D.units.push(...added);D.appVersion='1.8.0';D.updated='2026-09-29';
 for(const c of D.atlas.courses)c.readySections=c.sections.filter(s=>s.unitId).length;
 for(const g of[7,8,9]){const c=D.atlas.courses.find(c=>c.id===`114-2-${g}-math`);D.sources.push({id:`plan-114-2-math-${g}`,title:`永和國中114-2 ${g}年級數學課程計畫（採用為教學依據）`,url:c.url,checked:'2026-09-29',note:'原學年度、出版社與章名保留。教學重點與測驗為本站自編，不代表115當期範圍或原題全文。'});}
 D.atlas.periods.find(p=>p.id==='114-2').label='114 下學期（可教學／原年度）';
 D.atlas.adoptionPolicy={approved:true,sourceYear:114,usage:['教學重點','自編測驗','歷屆範圍對照'],preserveOriginalMetadata:true,currentYearReplacement:false};
 D.sourceNotice='已採用114年度資料補教材；原年度與出版社不改標。七至九年級上學期數學31節、114下學期數學29節及七上生物22節有精選重點與檢測；其他科目仍有缺口。';
 const core=scripts.find(s=>s[1].includes('Shared pure functions')),box={module:{exports:{}},URL};vm.runInNewContext(core[1],box);const errors=box.module.exports.validateData(D);if(errors.length)throw Error(errors.join('\n'));
 h=h.replace(original[0],()=>'<script>\nwindow.STUDY_DATA = '+JSON.stringify(D).replace(/</g,'\\u003c')+';\n</script>');
 h=replace(h,"function gradeLabel(u) { return (","function gradeLabel(u) { return (u.historicalAdoption?'114學年度教材 · ':'')+(");
 h=replace(h,'目前查看114下學期歷史來源。出版社與課次屬於當年，不自動套用到115下學期或其他屆學生。','本頁採用114學年度下學期資料作教學與測驗依據，保留當年出版社及課次；不改標為115年，也不宣稱是當期段考範圍。');
 h=replace(h,'${E(publisher(g,s))} · ${g}年級${termName(Number(t))} · 下列數量只代表目前篩選範圍。','${found.some(u=>u.historicalAdoption)?E([...new Set(found.filter(u=>u.historicalAdoption).map(u=>u.schoolYear+\'學年度教材 · \'+u.publisher))].join(\'、\')):E(publisher(g,s))} · ${g}年級${termName(Number(t))} · 版本以每張教材卡片標記為準；共同核心概覽不代表當期課本。');
 h=replace(h,'${E(c.scopeNote)}「已備」','${c.year===114?\'已依使用者選擇採用114資料教學；原年度與版本保留。\':\'\'}${E(c.scopeNote)}「已備」');
 h=replace(h,'62份共同核心指南＋2份原有生物專題＋54份章節精選重點','62份共同核心指南＋2份原有生物專題＋54份當期章節重點＋29份114下學期數學重點');
 // Surface adopted units in existing semester catalogs; keep original route/storage contracts.
 h=replace(h,"const publisher=(g,s)=>D.versions?.mapping?.[s]?.[Number(g)-7]||'原表未列出版社';","const publisher=(g,s)=>D.versions?.mapping?.[s]?.[Number(g)-7]||'原表未列出版社';\n  const adoptedPublisher=(g,s,t)=>{const u=units.find(u=>u.grade===Number(g)&&u.subject===s&&u.semester===Number(t)&&u.historicalAdoption);return u?'114學年度 · '+u.publisher:publisher(g,s);};");
 h=replace(h,"E(publisher(g,s.id)):'選年級後查看教材'","E(adoptedPublisher(g,s.id,t)):'選年級後查看教材'");
 h=replace(h,'知識小站 · ${E(u.publisher)} · V','知識小站 · ${u.schoolYear}學年度 · ${E(u.publisher)} · V');
 h=replace(h,"<p>115出版社已核對；本站核心指南非課本完整逐課摘要，實際頁碼與教師範圍須對照。</p>","<p>${u.historicalAdoption?'114學年度來源，已採用為教學依據；不改標115當期範圍。':'出版社與年級依教材標記；實際教師範圍須另對照。'}</p>");
 return h;
}
if(require.main===module){const[i,o]=process.argv.slice(2);if(!i||!o)throw Error('Usage: node build-114.cjs input.html output.html');const h=build(fs.readFileSync(i,'utf8'));fs.mkdirSync(path.dirname(path.resolve(o)),{recursive:true});fs.writeFileSync(o,h);console.log('Built V1.8.0: 147 notes, 856 fixed questions; 29 adopted 114-2 mathematics chapters.');}
module.exports={build};
