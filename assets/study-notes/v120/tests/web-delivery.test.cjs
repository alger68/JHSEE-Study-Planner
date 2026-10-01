'use strict';
const {test}=require('node:test'),A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),zlib=require('node:zlib');
const source=fs.readFileSync(path.join(__dirname,'../../index.html'),'utf8');
const standalone=require('../build-complete.cjs').build(source);
function extract(html){const box={window:{}};vm.runInNewContext([...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].find(x=>x[1].includes('window.STUDY_DATA ='))[1],box);return JSON.parse(JSON.stringify(box.window.STUDY_DATA));}
let built;
function web(){const file=path.join(__dirname,'../build-web.cjs');A.ok(fs.existsSync(file),'web delivery builder is required');return built||(built=require(file).build(standalone));}
test('web homepage has useful initial HTML and less than 30% of the previous gzip payload',()=>{
 const b=web();A.ok(zlib.gzipSync(b.html).length<zlib.gzipSync(standalone).length*.30);
 const before=b.html.slice(0,b.html.indexOf('window.STUDY_DATA ='));A.match(before,/<main[^>]*>[\s\S]*今天，從哪一科開始/);
 A.equal(b.data.units.length,759);A.equal(b.data.units.reduce((n,u)=>n+u.quiz.length,0),2824);
 A.ok(b.data.units.every(u=>!u.concepts[0].body&&!u.quiz[0].question));
 A.equal(Object.values(b.files).filter(x=>typeof x==='string').length,b.manifest.groups.length+1);
});
test('all content-addressed bundles reconstruct exactly the validated curriculum',()=>{
 const b=web(),D=extract(standalone),actual=[];
 for(const g of b.manifest.groups){const parsed=JSON.parse(b.files[g.file]);A.deepEqual(parsed.units.map(u=>u.id),g.ids);actual.push(...parsed.units);}
 A.deepEqual(actual.sort((a,b)=>a.id.localeCompare(b.id)),D.units.sort((a,b)=>a.id.localeCompare(b.id)));
 A.equal(new Set(actual.map(u=>u.id)).size,759);
});
const {JSDOM,VirtualConsole}=require('jsdom'),P=require('../modules/practice-engine.cjs');
const fullData=extract(standalone);
function browser({hash='#/home',saved={},fetcher}={}){
 const calls=[],errors=[],v=new VirtualConsole();v.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(web().html,{url:'https://example.test/assets/study-notes/'+hash,runScripts:'dangerously',virtualConsole:v,beforeParse(w){w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.requestAnimationFrame=f=>{f();return 0;};w.confirm=()=>true;w.fetch=async(file,options)=>{calls.push(file);return fetcher?fetcher(file,options):{ok:true,text:async()=>web().files[file]};};for(const[k,value]of Object.entries(saved))w.localStorage.setItem(k,JSON.stringify(value));}});
 return{dom,w:dom.window,calls,errors};
}
async function until(fn){for(let i=0;i<200;i++){if(fn())return;await new Promise(r=>setTimeout(r,5));}A.ok(fn(),'expected UI did not become ready');}
test('fresh home and catalog request no lessons; one lesson hydrates in place and is reused',async()=>{
 const b=browser();try{A.equal(b.calls.length,0);A.ok(b.w.document.querySelector('.home-welcome'));
 const id='bio-3-3',u=b.w.STUDY_DATA.units.find(x=>x.id===id);
 b.w.location.hash='#/library?g=7&s=science&term=1';await until(()=>b.w.document.querySelector('[data-view="library"]'));A.equal(b.calls.length,0);
 b.w.location.hash='#/unit/'+id+'/notes';await until(()=>b.w.document.querySelector('#unit-content'));
 A.equal(b.calls.length,1);A.strictEqual(u,b.w.STUDY_DATA.units.find(x=>x.id===id));A.ok(u.concepts[0].body);
 b.w.location.hash='#/unit/'+id+'/quiz';await until(()=>b.w.document.querySelector('[data-option]'));A.equal(b.calls.length,1);A.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});
test('failed download offers retry; late download never replaces a newer route',async()=>{
 let fail=true,release;const b=browser({fetcher:async file=>{if(fail)throw Error('offline');await new Promise(r=>release=r);return{ok:true,text:async()=>web().files[file]};}});
 try{b.w.location.hash='#/unit/bio-3-3/notes';await until(()=>b.w.document.querySelector('[data-content-retry]'));
 fail=false;b.w.document.querySelector('[data-content-retry]').click();await until(()=>release);b.w.location.hash='#/home';await until(()=>b.w.document.querySelector('.home-welcome'));release();await until(()=>b.w.StudyContent.isLoaded('bio-3-3'));A.ok(b.w.document.querySelector('.home-welcome'));A.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});
test('saved real biology mistakes and unfinished selections load before validation without rewriting storage',async()=>{
 const u=fullData.units.find(x=>x.id==='bio-3-3'),config={unitId:u.id,count:8,seed:'lazy-resume'},deck=P.generate(fullData,config),q=deck.questions.find(q=>q.concept==='leaf-structure'),wrong=q.options.find(o=>o.id!==q.answer).id;
 const state=P.record(P.newState(),q,wrong),session={app:'jh-study-practice-session',schema:1,version:P.VERSION,signature:JSON.stringify(config),deck,selections:{[q.id]:wrong},submitted:false,retry:false};
 const b=browser({hash:'#/practice?unit='+u.id+'&n=8&seed=lazy-resume',saved:{'jh-study-notes.practice.v2':state,'jh-study-notes.practice.v2.session':session}});
 try{await until(()=>b.w.document.querySelector('[data-view="practice"]'));A.equal(b.calls.length,1);A.equal(b.w.document.querySelectorAll('.practice-option.selected').length,1);A.match(b.w.document.querySelector('#main').textContent,/重練已存錯題（1）/);A.equal(b.w.localStorage.getItem('jh-study-notes.practice.v2'),JSON.stringify(state));A.doesNotMatch(b.w.document.querySelector('#main').textContent,/快照無法驗證|原有異常資料/);A.deepEqual(b.errors,[]);}finally{b.dom.window.close();}
});
test('search loads complete text once and legacy starred review loads just its referenced scope',async()=>{
 const state={app:'jh-study-notes',schemaVersion:1,read:[],starred:['bio-3-3/leaf-structure'],answers:{},font:0},b=browser({saved:{'jh-study-notes.progress.v1':state}});
 try{b.w.location.hash='#/review';await until(()=>b.w.document.querySelector('[data-view="review"]'));A.equal(b.calls.length,1);A.ok(b.w.document.querySelector('.concept-card'));
 b.w.location.hash='#/search?q='+encodeURIComponent('木質部');await until(()=>b.w.document.querySelector('.search-result'));A.ok(b.calls.at(-1).includes('/all.'));A.equal(b.w.STUDY_DATA.units.filter(u=>u.concepts[0].body).length,759);A.deepEqual(b.errors,[]);}finally{b.dom.window.close();}
});
test('malformed bundles hydrate nothing; timeout retries and concurrent fetches are deduplicated',async()=>{
 const b=web(),D=structuredClone(b.data),C={validateData:()=>[]},api=require('../modules/content-loader.cjs');let calls=0,mode='bad';
 const loader=api.create({D,C,manifest:b.manifest,timeout:15,fetch:async file=>{calls++;if(mode==='hang')return new Promise(()=>{});return{ok:true,text:async()=>mode==='bad'?JSON.stringify({schema:1,units:[]}):b.files[file]};}});
 await A.rejects(loader.ensure(['bio-3-3']),/清單/);A.equal(loader.isLoaded('bio-3-3'),false);
 mode='hang';await A.rejects(loader.ensure(['bio-3-3']),/逾時/);
 mode='good';await Promise.all([loader.ensure(['bio-3-3']),loader.ensure(['bio-3-3'])]);A.equal(calls,3);A.equal(loader.isLoaded('bio-3-3'),true);
});
test('backup import loads new content and a download failure never overwrites existing progress',async()=>{
 const u=fullData.units.find(u=>u.id==='bio-3-3'),q=P.generate(fullData,{unitId:u.id,count:8,seed:'import-delivery'}).questions[0],state=P.record(P.newState(),q,q.options.find(o=>o.id!==q.answer).id);
 let fail=false;const b=browser({hash:'#/practice',fetcher:async file=>{if(fail)throw Error('offline');return{ok:true,text:async()=>web().files[file]};}});
 async function importFile(){const input=b.w.document.getElementById('practice-import');Object.defineProperty(input,'files',{value:[{size:JSON.stringify(state).length,text:async()=>JSON.stringify(state)}],configurable:true});input.dispatchEvent(new b.w.Event('change',{bubbles:true}));}
 try{await until(()=>b.w.document.querySelector('[data-view="practice"]'));fail=true;await importFile();await until(()=>b.w.document.querySelector('#notice').textContent.includes('請連線後重試匯入'));A.equal(b.w.localStorage.getItem('jh-study-notes.practice.v2'),null);
 fail=false;await importFile();await until(()=>b.w.localStorage.getItem('jh-study-notes.practice.v2'));A.deepEqual(JSON.parse(b.w.localStorage.getItem('jh-study-notes.practice.v2')),state);A.deepEqual(b.errors,[]);
 }finally{b.dom.window.close();}
});
test('startup download failure preserves raw saved progress and retry restores it',async()=>{
 const u=fullData.units.find(u=>u.id==='bio-3-3'),q=P.generate(fullData,{unitId:u.id,count:8,seed:'boot-retry'}).questions[0],state=P.record(P.newState(),q,q.options.find(o=>o.id!==q.answer).id);let fail=true;
 const b=browser({saved:{'jh-study-notes.practice.v2':state},fetcher:async file=>{if(fail)throw Error('offline');return{ok:true,text:async()=>web().files[file]};}});
 try{await until(()=>b.w.document.querySelector('[data-content-retry]'));A.equal(b.w.localStorage.getItem('jh-study-notes.practice.v2'),JSON.stringify(state));A.ok(b.w.document.querySelector('[data-content-reload]'));
 fail=false;b.w.document.querySelector('[data-content-retry]').click();await until(()=>b.w.document.querySelector('[data-wrong-count]')?.textContent==='1');A.equal(b.w.localStorage.getItem('jh-study-notes.practice.v2'),JSON.stringify(state));A.deepEqual(b.errors,[]);}finally{b.dom.window.close();}
});
test('tampered bytes are rejected by content hash before hydration',async()=>{
 const b=web(),D=structuredClone(b.data),api=require('../modules/content-loader.cjs');
 const loader=api.create({D,C:{validateData:()=>[]},manifest:b.manifest,crypto:require('node:crypto').webcrypto,fetch:async file=>({ok:true,text:async()=>b.files[file]+' '})});
 await A.rejects(loader.ensure(['bio-3-3']),/版本不符/);A.equal(loader.isLoaded('bio-3-3'),false);
});
test('tracked weaknesses name unhydrated concepts and link to the precise lesson',async()=>{
 const state=P.newState();state.conceptStats['bio-3-3#leaf-structure']={right:1,wrong:2,last:'right'};
 const b=browser({hash:'#/practice?g=7&s=math&term=1',saved:{'jh-study-notes.practice.v2':state}});
 try{
  await until(()=>b.w.document.querySelector('[data-view="practice"]'));
  A.equal(b.w.StudyContent.isLoaded('bio-3-3'),false);A.equal(b.calls.length,1);
  const panel=b.w.document.querySelector('[data-weakness-panel]');A.ok(panel,'weakness tracking should expose a readable review action');
  A.match(panel.textContent,/葉肉製造，表皮保護，葉脈運送/);A.match(panel.textContent,/7年級上學期/);A.match(panel.textContent,/自然/);A.match(panel.textContent,/植物如何製造養分/);A.match(panel.textContent,/全科/);
  A.doesNotMatch(panel.textContent,/bio-3-3|leaf-structure/);A.deepEqual([...panel.querySelectorAll('tbody td')].slice(1).map(x=>x.textContent),['2','1','5']);
  panel.querySelector('a').click();await until(()=>b.w.document.querySelector('#concept-leaf-structure'));
  A.equal(b.w.location.hash,'#/unit/bio-3-3/notes?concept=leaf-structure');A.ok(b.w.document.querySelector('#concept-leaf-structure').textContent.includes('葉肉製造'));
  A.equal(b.w.localStorage.getItem('jh-study-notes.practice.v2'),JSON.stringify(state));A.deepEqual(b.errors,[]);
 }finally{b.w.close();}
});
test('catalog reflects existing reading and valid fixed answers without downloading lessons',async()=>{
 const state={app:'jh-study-notes',schemaVersion:1,read:['atlas-math-7-1-1','math-7-1','bio-3-3'],starred:[],answers:{'atlas-math-7-1-1/q1':'a','atlas-math-7-1-1/q2':'a','math-7-1/q1':'a','bio-3-3/q1':'food'},font:0};
 const b=browser({hash:'#/library?g=7&s=math&term=1&course=115-1-7-math',saved:{'jh-study-notes.progress.v1':state}});
 try{
  await until(()=>b.w.document.querySelector('[data-curriculum-section]'));
  const cards=[...b.w.document.querySelectorAll('[data-curriculum-section]')],first=cards.find(x=>x.querySelector('a')?.getAttribute('href')==='#/unit/atlas-math-7-1-1/notes');
  A.match(first.textContent,/已標記讀完/);A.match(first.textContent,/已答 2 \/ 6 題/);A.match(first.textContent,/答對 1 題/);
  A.match(cards.find(x=>x!==first).textContent,/尚未標記讀完/);
  const progress=b.w.document.querySelector('[data-catalog-progress]');A.ok(progress);A.match(progress.textContent,/已標記讀完 1 \//);A.match(progress.textContent,/本機/);
  const shared=b.w.document.querySelector('.curriculum-shared');A.match(shared.textContent,/已標記讀完/);A.match(shared.textContent,/已答 1 \/ 6 題/);
  A.equal(b.calls.length,0);A.equal(b.w.localStorage.getItem('jh-study-notes.progress.v1'),JSON.stringify(state));A.deepEqual(b.errors,[]);
 }finally{b.w.close();}
});
test('review ignores unrelated answered units and renders only the bookmarked concepts',async()=>{
 const state={app:'jh-study-notes',schemaVersion:1,read:[],starred:['bio-3-3/leaf-structure'],answers:{'math-7-1/q1':'a'},font:0};
 const b=browser({hash:'#/review',saved:{'jh-study-notes.progress.v1':state}});
 try{await until(()=>b.w.document.querySelector('[data-view="review"]'));A.equal(b.calls.length,1,'only the bookmarked science scope should download');A.equal(b.w.document.querySelectorAll('.concept-card').length,1);A.match(b.w.document.querySelector('.concept-card').textContent,/葉肉製造/);A.equal(b.w.StudyContent.isLoaded('math-7-1'),false);A.deepEqual(b.errors,[]);}finally{b.w.close();}
});
test('review with answers but no bookmarks needs no lesson download',async()=>{
 const state={app:'jh-study-notes',schemaVersion:1,read:[],starred:[],answers:{'math-7-1/q1':'a'},font:0};
 const b=browser({hash:'#/review',saved:{'jh-study-notes.progress.v1':state}});
 try{await until(()=>b.w.document.querySelector('[data-view="review"]'));A.equal(b.calls.length,0);A.equal(b.w.document.querySelectorAll('.concept-card').length,0);A.deepEqual(b.errors,[]);}finally{b.w.close();}
});
