'use strict';
const {test}=require('node:test'),A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const baseHTML=require('../build-114.cjs').build(fs.readFileSync(path.join(root,'../index.html'),'utf8'));
const baseScript=[...baseHTML.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].find(s=>s[1].includes('window.STUDY_DATA ='));
const baseBox={window:{}};vm.runInNewContext(baseScript[1],baseBox);
const baseline=JSON.parse(JSON.stringify(baseBox.window.STUDY_DATA));
function build(){const M=require('../modules/free-integration.cjs');return M.enrich(structuredClone(baseline));}
test('preserves all 147 old units byte-for-byte',()=>{const D=build();for(const u of baseline.units)A.deepEqual(D.units.find(x=>x.id===u.id),u);});
test('six history and sixteen health lessons with no duplicate identifiers',()=>{const D=build();A.equal(D.units.length,169);A.equal(D.units.reduce((n,u)=>n+u.quiz.length,0),988);A.equal(new Set(D.units.map(u=>u.id)).size,D.units.length);A.equal(D.units.filter(u=>u.integrationBatch==='free-20260930').length,22);});
test('sources and citations resolve; all new questions have four unique options and one answer',()=>{const D=build(),sources=new Set(D.sources.map(s=>s.id));for(const u of D.units.filter(u=>u.integrationBatch)){A.equal(u.quiz.length,6);A.equal(u.concepts.length,3);for(const c of u.concepts){A.ok(c.body.length>0);for(const s of c.sources)A.ok(sources.has(s),s);}for(const q of u.quiz){A.equal(new Set(q.options.map(o=>o.text)).size,4);A.equal(q.options.filter(o=>o.id===q.answer).length,1);A.ok(q.explanation.length>=12);for(const s of q.sources)A.ok(sources.has(s),s);}}});
test('all three adopted courses preserve 114-1 and match lesson ids',()=>{const D=build();for(const [id,n] of [['114-1-8-history',6],['114-1-8-health',7],['114-1-9-health',9]]){const c=D.atlas.courses.find(c=>c.id===id);A.ok(c);A.equal(c.sections.length,n);A.equal(c.readySections,n);for(const s of c.sections){const u=D.units.find(u=>u.id===s.unitId);A.equal(u.schoolYear,114);A.equal(u.semester,1);A.equal(u.title,s.title);}}A.equal(D.atlas.courses.length,106);A.equal(D.atlas.exams.length,40);});
test('29 external links remain separate from local note/question completion',()=>{const D=build();A.equal(D.freeResources.resources.length,29);for(const r of D.freeResources.resources){A.equal(r.localTeachingComplete,false);A.equal(r.localTestComplete,false);A.equal(r.mediaPlaybackTested,false);A.ok(/^https:\/\//.test(r.url));}A.ok(!D.freeResources.resources.some(r=>r.access==='unrestricted-rehosting'));});
test('resource mapping uses explicit sections not fuzzy title matching',()=>{const D=build();const lotus=D.atlas.courses.flatMap(c=>c.sections).find(s=>s.title==='愛蓮說');A.ok(lotus.externalResources.includes('j-lotus-overview'));const glands=D.atlas.courses.flatMap(c=>c.sections).find(s=>s.title==='內分泌系統');A.ok(!glands.externalResources?.includes('m-photo'));const photo=D.units.find(u=>u.id==='bio-3-3');A.ok(photo);const map=D.freeResources.unitMap;A.ok(map[photo.id].includes('m-photo'));});
test('enrichment is idempotent',()=>{const M=require('../modules/free-integration.cjs'),D=build();A.deepEqual(M.enrich(structuredClone(D)),D);});
test('ui implements resource links with rel and escapes text',()=>{const s=fs.readFileSync(path.join(root,'modules/free-resources-ui.js'),'utf8');new vm.Script(s);A.match(s,/noopener noreferrer/);A.match(s,/escape|function E/);});
test('new integrated unit ids satisfy the original core validator contract',()=>{const D=build();for(const u of D.units)A.match(u.id,/^[a-z0-9-]+$/);});
test('complete integrated build passes core schema and all script syntax checks',()=>{const html=require('../build-free.cjs').build(fs.readFileSync(path.join(root,'../index.html'),'utf8'));A.match(html,/route.view==='resources'/);for(const s of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(s[1]);});
test('deployment workflow retains baseline tests then builds and verifies the integrated release',()=>{const y=fs.readFileSync(path.join(root,'../../../.github/workflows/pages.yml'),'utf8');A.ok(y.indexOf('build-free.cjs')>y.indexOf('lower114-browser.py'));A.ok(y.indexOf('free-integration-browser.py')<y.indexOf('Archive tracked study-notes source'));A.match(y,/data\['appVersion'\]=='1\.9\.0'/);A.match(y,/len\(data\['units'\]\)==169/);A.match(y,/len\(data\['freeResources'\]\['resources'\]\)==29/);});
test('new lesson domain labels do not duplicate their parent subject',()=>{const D=build();for(const u of D.units.filter(u=>u.integrationBatch))A.equal(u.domain,u.subject==='health'?'健康教育':'歷史');});

test('imported history quizzes do not reveal every correct answer in the first display position',()=>{
 const D=build();
 for(const u of D.units.filter(u=>u.integrationBatch==='free-20260930' && u.subject==='social')){
  const positions=u.quiz.map(q=>q.options.findIndex(o=>o.id===q.answer));
  A.ok(new Set(positions).size>=3,u.id+' has a predictable answer-position bias');
 }
});
test('history answer-position balancing retains answer text and per-option explanations',()=>{
 const H=require('../modules/history114-supplement.json'),D=build();
 for(const old of H.units){
  const u=D.units.find(u=>u.legacySupplementId===old.id);
  for(const q of old.quiz){
   const fresh=u.quiz.find(x=>x.id===q.id);
   A.equal(fresh.options.find(o=>o.id===fresh.answer).text,q.options.find(o=>o.id===q.answer).text);
   A.deepEqual([...fresh.options].sort((a,b)=>a.id.localeCompare(b.id)),[...q.options].sort((a,b)=>a.id.localeCompare(b.id)));
  }
 }
});

test('resource cards return learners to the matched school chapter instead of a platform-only dead end',()=>{
 const D=build(),b={window:{},document:{addEventListener(){}},URL,URLSearchParams};
 vm.runInNewContext(fs.readFileSync(path.join(root,'modules/free-resources-ui.js'),'utf8'),b);
 const h=b.window.FreeResourcesUI.render(D,{},new URLSearchParams({q:'光合作用'}));
 A.match(h,/data-free-chapter/);
 A.match(h,/#\/atlas\?g=7&amp;s=biology&amp;period=115-1/);
 A.match(h,/3-3 植物如何製造養分/);
});
