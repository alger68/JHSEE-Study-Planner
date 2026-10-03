'use strict';
const {test}=require('node:test'),A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {JSDOM,VirtualConsole}=require('jsdom');
const sectionId='115-1-7-chinese/第四課';
const fixture=()=>({sectionId,title:'差不多先生傳',status:'original-verified',checked:'2026-10-03',author:'胡適',scopeNote:'已核對公開原作；校方課本節錄與注釋尚待核對。',sources:[{title:'公開原作來源',url:'https://example.org/work'}],teaching:[{title:'敘述者的態度',body:'先檢查敘述者如何以事件呈現行為，再區分字面稱讚與反諷效果。'},{title:'事件中的因果',body:'將每次混淆的條件與造成的結果配對，不能只背最後的評語。'}],readingChecks:[{prompt:'怎樣判斷語氣？',answer:'比對字面用語與事件結果。',basis:'先保留原作的前後文。'},{prompt:'如何核對課本節錄？',answer:'核對起訖句和段落。',basis:'同名作品不保證節錄完全相同。'}]});
function api(){const f=path.join(__dirname,'../modules/reading-support.cjs');A.ok(fs.existsSync(f),'source-grounded reading support module is required');return require(f);}
const data=()=>({units:[{id:'reader',title:'差不多先生傳',catalogSectionId:sectionId,contentMode:'reading-guide',concepts:[{id:'c1',body:['原有教學']}],quiz:[{id:'q1',answer:'a'}]},{id:'other',title:'其他',quiz:[]} ]});
test('reading supplements attach only to the matching source lesson and preserve all prior content',()=>{
 const before=data(),D=structuredClone(before);api().enrich(D,[fixture()]);A.deepEqual(D.units.map(({readingSupport,readingSupportStatus,...u})=>u),before.units);A.equal(D.units[0].readingSupport.author,'胡適');A.equal(D.units[1].readingSupport,undefined);A.deepEqual(D.readingSupport,{schema:1,checked:'2026-10-03',total:1,originalVerified:1,editionVerified:0,sourceNeeded:0});
});
test('mismatched titles, unknown or duplicate sections, unsafe URLs and unsupported status cannot become reading evidence',()=>{
 for(const patch of [{sectionId:'missing'},{title:'另一作品'},{status:'finished'},{scopeNote:''},{sources:[{title:'unsafe',url:'javascript:alert(1)'}]},{sources:[]},{teaching:[]}])A.throws(()=>api().enrich(data(),[{...fixture(),...patch}]),/reading|source|scope|support/i);
 A.throws(()=>api().enrich(data(),[fixture(),fixture()]),/duplicate/i);
});
test('reading renderer distinguishes original from school edition and safely displays text and source-check prompts',()=>{
 const r=fixture();r.teaching[0].body='<img src=x onerror=alert(1)>';const dom=new JSDOM(api().render({readingSupport:r}));try{const d=dom.window.document;A.match(d.body.textContent,/公開原作已核對/);A.match(d.body.textContent,/課本節錄與注釋尚待核對/);A.equal(d.querySelector('img'),null);A.equal(d.querySelector('[data-reading-source]').href,'https://example.org/work');A.equal(d.querySelectorAll('[data-reading-check]').length,2);}finally{dom.window.close();}
 const missing={...fixture(),status:'source-needed',sources:[],author:null,scopeNote:'仍缺本校課文全文與節錄範圍。'};const d=new JSDOM(api().render({readingSupport:missing}));try{A.match(d.window.document.body.textContent,/課文來源待補/);A.doesNotMatch(d.window.document.body.textContent,/公開原作已核對|課本版本已核對/);}finally{d.window.close();}
 A.equal(api().render({}), '');
});
function build(readingRows=[fixture()]){const source=fs.readFileSync(path.join(__dirname,'../../index.html'),'utf8'),full=require('../build-exam-solutions.cjs').build(source,{readingRows});return {full,web:require('../build-web.cjs').build(full)};}
test('reading support is delivered with its lesson only and renders on a direct lesson link with unchanged saved progress',async()=>{
 const {web}=build(),u=web.data.units.find(u=>u.catalogSectionId===sectionId);A.equal(u.readingSupport,undefined,'large reading support must not block home');A.equal(web.data.readingSupport?.originalVerified,1);
 const calls=[],errors=[],writes=[],v=new VirtualConsole();v.on('jsdomError',e=>errors.push(e.message));const key='jh-study-notes.progress.v1',saved=JSON.stringify({app:'jh-study-notes',schemaVersion:1,read:[u.id],starred:[],answers:{[u.id+'/q1']:u.quiz[0].answer},font:0});
 const dom=new JSDOM(web.html,{url:'https://example.test/#/unit/'+u.id+'/notes',runScripts:'dangerously',virtualConsole:v,beforeParse(w){w.scrollTo=()=>{};w.requestAnimationFrame=f=>{f();return 0;};w.TextEncoder=TextEncoder;Object.defineProperty(w.crypto,'subtle',{value:require('node:crypto').webcrypto.subtle});w.fetch=async file=>{calls.push(file);return{ok:true,text:async()=>web.files[file]};};w.localStorage.setItem(key,saved);const original=w.Storage.prototype.setItem;w.Storage.prototype.setItem=function(k,x){writes.push(k);return original.call(this,k,x);};}});
 try{for(let i=0;i<250&&!dom.window.document.querySelector('[data-reading-support]');i++)await new Promise(r=>setTimeout(r,5));A.ok(dom.window.document.querySelector('[data-reading-support]'));A.match(dom.window.document.querySelector('[data-reading-support]').textContent,/敘述者的態度/);A.equal(calls.length,1);A.equal(dom.window.localStorage.getItem(key),saved);A.deepEqual(writes.filter(k=>k!=='jh-study-notes.navigation.v1'),[]);A.deepEqual(errors,[]);}finally{dom.window.close();}
});

test('home reading summary separates public originals, school editions and missing sources',()=>{
 const html=api().summary({readingSupport:{total:3,originalVerified:1,editionVerified:0,sourceNeeded:2}});const d=new JSDOM(html);try{A.match(d.window.document.body.textContent,/3.*1.*0.*2/s);A.match(d.window.document.body.textContent,/原作.*課本.*來源/s);A.equal(d.window.document.querySelectorAll('a').length,2);}finally{d.window.close();}
 A.equal(api().summary({}), '');
});

test('published reading support accounts for every one of the 74 source-located guides without changing original questions',()=>{
 const f=path.join(__dirname,'../modules/reading-support.json');A.ok(fs.existsSync(f),'all reading-source audits must be authored');const rows=JSON.parse(fs.readFileSync(f,'utf8')),expected=require('../modules/catalog-content/chinese.json').filter(r=>r.mode==='reading-guide');
 A.equal(rows.length,74);A.deepEqual(rows.map(r=>r.sectionId).sort(),expected.map(r=>r.sectionId).sort());
 const source=fs.readFileSync(path.join(__dirname,'../../index.html'),'utf8'),html=require('../build-all-subjects.cjs').build(source),box={window:{}};vm.runInNewContext([...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].find(s=>s[1].includes('window.STUDY_DATA ='))[1],box);const before=JSON.parse(JSON.stringify(box.window.STUDY_DATA)),after=api().enrich(structuredClone(before),rows);
 A.deepEqual(after.units.map(({readingSupport,readingSupportStatus,...u})=>u),before.units);A.equal(after.readingSupport.total,74);A.ok(after.readingSupport.originalVerified>0);A.equal(after.readingSupport.originalVerified+after.readingSupport.editionVerified+after.readingSupport.sourceNeeded,74);
 for(const r of rows){A.ok(r.scopeNote.length>20,r.sectionId);if(r.status!=='source-needed')A.ok(r.sources.length&&r.teaching.length>=2&&r.readingChecks.length>=2,r.sectionId);}
});

test('verified textbook status reaches the catalog before download and replaces stale lesson warnings',async()=>{
 const r={...fixture(),status:'edition-verified',scopeNote:'出版社115上對應版次與課次已核對；以下練習仍為本站原創。'},b=build([r]).web,u=b.data.units.find(u=>u.catalogSectionId===sectionId);A.equal(u.readingSupportStatus,'edition-verified');A.equal(u.readingSupport,undefined);
 const calls=[],errors=[],v=new VirtualConsole();v.on('jsdomError',e=>errors.push(e.message));const dom=new JSDOM(b.html,{url:'https://example.test/#/library?g=7&s=chinese&term=1',runScripts:'dangerously',virtualConsole:v,beforeParse(w){w.scrollTo=()=>{};w.requestAnimationFrame=f=>{f();return 0;};w.TextEncoder=TextEncoder;Object.defineProperty(w.crypto,'subtle',{value:require('node:crypto').webcrypto.subtle});w.fetch=async file=>{calls.push(file);return{ok:true,text:async()=>b.files[file]};};}});
 try{const card=dom.window.document.querySelector('[data-curriculum-section="'+sectionId+'"]');A.match(card.textContent,/版次.*已核對|已核對.*版次/);A.doesNotMatch(card.textContent,/尚未核對本課全文/);A.equal(calls.length,0);dom.window.location.hash='#/unit/'+u.id+'/notes';for(let i=0;i<250&&!dom.window.document.querySelector('[data-reading-support]');i++)await new Promise(r=>setTimeout(r,5));A.ok(dom.window.document.querySelector('[data-reading-support]'));A.doesNotMatch(dom.window.document.querySelector('main').textContent,/尚未核對本課全文|未核對課文全文|尚未核對該課全文/);A.match(dom.window.document.querySelector('main').textContent,/本站原創/);A.equal(calls.length,1);dom.window.dispatchEvent(new dom.window.Event('beforeprint'));const printed=dom.window.document.querySelector('#print-root');A.match(printed.textContent,/出版社115上對應版次/);A.doesNotMatch(printed.textContent,/尚未核對本課全文|未核對課文全文|尚未核對該課全文/);A.ok(printed.querySelector('[data-reading-support]'));A.deepEqual(errors,[]);}finally{dom.window.close();}
});
