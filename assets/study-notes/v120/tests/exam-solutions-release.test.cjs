'use strict';
const {test}=require('node:test'),A=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),zlib=require('node:zlib');
const {JSDOM,VirtualConsole}=require('jsdom'),rows=require('../modules/atlas-sources.json').exams;
const source=fs.readFileSync(path.join(__dirname,'../../index.html'),'utf8');
const papers=rows.filter(r=>r[1]===7&&r[2]===1&&['math','english'].includes(r[3])).map(r=>({schema:1,sourceId:r[0],sourceSha256:r[6],title:r[7],checked:'2026-10-02',coverageNote:'測試用原創解題資料',sections:[{id:'choice',title:'選擇題'}],items:[{id:'choice-1',section:'choice',label:'選擇第1題',sourcePages:[1],answerPage:r[5]-1,topic:'依題目條件推理',answer:'B',officialAnswer:'B',status:'verified',steps:['確認題目所給的條件。','逐一檢驗並得到答案。'],pitfall:'不要忽略題目中的限制。'},{id:'choice-2',section:'choice',label:'選擇第2題',sourcePages:[1],answerPage:r[5]-1,topic:'原卷的条件疑義',answer:'條件不足',officialAnswer:'A',status:'disputed',steps:['先確認原答案採用的假設。','找到符合題面但結果不同的反例。'],pitfall:'不能暗中增加題目未列的限制。',note:'原卷未提供唯一結論所需條件。'}]}));
const math=papers.find(p=>p.title.includes('數學')),english=papers.find(p=>p.title.includes('英文'));
let built,fullHTML;
function web(){if(!built){const file=path.join(__dirname,'../build-exam-solutions.cjs');A.ok(fs.existsSync(file),'historical solution release builder is required');fullHTML=require(file).build(source,{papers});built=require('../build-web.cjs').build(fullHTML);}return built;}
function browser({hash='#/home',fetcher,saved={}}={}){const calls=[],errors=[],writes=[],v=new VirtualConsole();v.on('jsdomError',e=>errors.push(e.message));const dom=new JSDOM(web().html,{url:'https://example.test/assets/study-notes/'+hash,runScripts:'dangerously',virtualConsole:v,beforeParse(w){w.scrollTo=()=>{};w.requestAnimationFrame=f=>{f();return 0;};w.HTMLElement.prototype.scrollIntoView=()=>{};w.TextEncoder=TextEncoder;Object.defineProperty(w.crypto,'subtle',{value:require('node:crypto').webcrypto.subtle});w.fetch=async(file,options)=>{calls.push(file);return fetcher?fetcher(file,options):{ok:true,text:async()=>web().files[file]};};for(const[k,x]of Object.entries(saved))w.localStorage.setItem(k,JSON.stringify(x));const set=w.Storage.prototype.setItem;w.Storage.prototype.setItem=function(k,v){writes.push(k);return set.call(this,k,v);};}});return{w:dom.window,calls,errors,writes};}
async function until(fn){for(let i=0;i<250;i++){if(fn())return;await new Promise(r=>setTimeout(r,5));}A.ok(fn(),'expected reader state did not appear');}
test('home and historical paper list stay within budget and load no paper bodies',async()=>{
 const b=web();A.ok(Buffer.byteLength(b.html)<2000000);A.ok(zlib.gzipSync(b.html).length<350000);A.equal(b.data.appVersion,'2.1.1');A.ok(b.data.examSolutions.papers.every(p=>!p.items&&!p.sections));
 const app=browser();try{A.ok(app.w.document.querySelector('[data-paper-entry]'));A.equal(app.calls.length,0);app.w.document.querySelector('[data-paper-entry]').click();await until(()=>app.w.document.querySelector('[data-view="papers"]'));A.equal(app.calls.length,0);A.equal(app.w.document.querySelectorAll('[data-paper-card]').length,15);A.match(app.w.document.querySelector('#main').textContent,/114.*下學期/);A.deepEqual(app.errors,[]);}finally{app.w.close();}
});
test('direct paper link loads one verified bundle, exposes reasoning and original-source pages',async()=>{
 const app=browser({hash:'#/papers?id='+math.sourceId});try{await until(()=>app.w.document.querySelector('[data-solution-id]'));A.equal(app.calls.length,1);A.equal(app.w.document.querySelectorAll('[data-solution-id]').length,2);const q=app.w.document.querySelector('[data-solution-id="choice-2"]');q.querySelector('summary').click();A.equal(q.open,true);A.match(q.textContent,/校方答案.*A/s);A.match(q.textContent,/條件不足/);A.match(q.textContent,/原卷未提供/);A.equal(q.querySelector('[data-source-page]').href,'https://drive.google.com/file/d/'+math.sourceId+'/view#page=1');A.ok(app.w.document.querySelector('a[href="#/atlas?g=7&s=math&period=114-2"]'));A.deepEqual(app.errors,[]);}finally{app.w.close();}
});
test('invalid grade, unknown paper and source-only paper never substitute another guide',async()=>{
 for(const hash of ['#/papers?g=10','#/papers?g=','#/papers?id=missing']){const app=browser({hash});try{A.ok(app.w.document.querySelector('[data-paper-invalid]'));A.equal(app.calls.length,0);A.equal(app.w.document.querySelectorAll('[data-solution-id]').length,0);}finally{app.w.close();}}
 const pending=rows.find(r=>r[1]===8);const app=browser({hash:'#/papers?id='+pending[0]});try{A.ok(app.w.document.querySelector('[data-paper-pending]'));A.equal(app.calls.length,0);A.match(app.w.document.querySelector('#main').textContent,/逐題詳解尚待編寫/);}finally{app.w.close();}
});
test('offline paper download offers retry and does not write existing quiz progress',async()=>{
 let fail=true;const key='jh-study-notes.progress.v1',progress={app:'jh-study-notes',schemaVersion:1,read:[],starred:[],answers:{},font:0};
 const app=browser({hash:'#/papers?id='+math.sourceId,saved:{[key]:progress},fetcher:async file=>{if(fail)throw Error('offline');return{ok:true,text:async()=>web().files[file]};}});
 try{await until(()=>app.w.document.querySelector('[data-paper-retry]'));A.equal(app.w.localStorage.getItem(key),JSON.stringify(progress));fail=false;app.w.document.querySelector('[data-paper-retry]').click();await until(()=>app.w.document.querySelector('[data-solution-id]'));A.equal(app.w.localStorage.getItem(key),JSON.stringify(progress));A.deepEqual(app.errors,[]);}finally{app.w.close();}
});
test('late paper response cannot replace the newly opened paper or homepage',async()=>{
 let release;const app=browser({hash:'#/papers?id='+math.sourceId,fetcher:async file=>{if(file.includes(math.sourceId))await new Promise(r=>release=r);return{ok:true,text:async()=>web().files[file]};}});
 try{await until(()=>release);app.w.location.hash='#/papers?id='+english.sourceId;await until(()=>app.w.document.querySelector('[data-paper-detail]')?.dataset.paperDetail===english.sourceId&&app.w.document.querySelector('[data-solution-id]'));release();await new Promise(r=>setTimeout(r,30));A.equal(app.w.document.querySelector('[data-paper-detail]').dataset.paperDetail,english.sourceId);app.w.location.hash='#/home';await until(()=>app.w.document.querySelector('.home-welcome'));A.deepEqual(app.errors,[]);}finally{app.w.close();}
});
test('tampered paper bytes and a validly hashed but wrong-source payload cannot be displayed',async()=>{
 const b=web(),p=b.data.examSolutions.papers.find(p=>p.sourceId===math.sourceId),original=b.files[p.bundle.file];
 for(const mode of ['bytes','source']){
  const app=browser({hash:'#/home',fetcher:async()=>({ok:true,text:async()=>mode==='bytes'?original+' ':JSON.stringify({...JSON.parse(original),sourceId:'wrong-source'})})});
  try{if(mode==='source'){const raw=JSON.stringify({...JSON.parse(original),sourceId:'wrong-source'});app.w.STUDY_DATA.examSolutions.papers.find(p=>p.sourceId===math.sourceId).bundle.sha256=require('node:crypto').createHash('sha256').update(raw).digest('hex');}app.w.location.hash='#/papers?id='+math.sourceId;await until(()=>app.w.document.querySelector('[data-paper-retry]'));A.equal(app.w.document.querySelectorAll('[data-solution-id]').length,0);A.deepEqual(app.errors,[]);}finally{app.w.close();}
 }
});
test('standalone reader retains complete explanations and all existing fixed questions unchanged',()=>{
 web();const extract=h=>{const w={window:{}};vm.runInNewContext([...h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].find(s=>s[1].includes('window.STUDY_DATA ='))[1],w);return JSON.parse(JSON.stringify(w.window.STUDY_DATA));};const before=extract(require('../build-all-subjects.cjs').build(source)),after=extract(fullHTML);A.deepEqual(after.units,before.units);A.equal(after.examSolutions.papers.length,2);A.ok(after.examSolutions.papers.every(p=>p.items.length===2));
});
test('actual published guide pack splits all 265 explanations and stays within the existing homepage budget',()=>{
 const full=require('../build-exam-solutions.cjs').build(source),b=require('../build-web.cjs').build(full);
 A.equal(b.data.examSolutions.paperCount,5);A.equal(b.data.examSolutions.totalItems,265);A.equal(b.manifest.papers.length,5);
 A.ok(Buffer.byteLength(b.html)<2000000);A.ok(zlib.gzipSync(b.html).length<350000);
 for(const p of b.data.examSolutions.papers){A.equal(p.items,undefined);A.equal(JSON.parse(b.files[p.bundle.file]).items.length,p.totalItems);}
});
test('populated fixed answers, mistake snapshots and unfinished practice remain byte-identical with zero storage writes',async()=>{
 web();const box={window:{}};vm.runInNewContext([...fullHTML.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].find(s=>s[1].includes('window.STUDY_DATA ='))[1],box);
 const D=JSON.parse(JSON.stringify(box.window.STUDY_DATA)),P=require('../modules/practice-engine.cjs'),u=D.units.find(u=>u.id==='bio-3-3'),cfg={unitId:u.id,count:8,seed:'paper-preserve'},deck=P.generate(D,cfg),q=deck.questions[0],wrong=q.options.find(o=>o.id!==q.answer).id;
 const saved={'jh-study-notes.progress.v1':{app:'jh-study-notes',schemaVersion:1,read:[u.id],starred:[],answers:{[u.id+'/'+u.quiz[0].id]:u.quiz[0].answer},font:0},'jh-study-notes.practice.v2':P.record(P.newState(),q,wrong),'jh-study-notes.practice.v2.session':{app:'jh-study-practice-session',schema:1,version:P.VERSION,signature:JSON.stringify(cfg),deck,selections:{[q.id]:wrong},submitted:false,retry:false}};
 const app=browser({hash:'#/papers?id='+math.sourceId,saved});try{
  await until(()=>app.w.document.querySelector('[data-solution-id]'));
  app.w.document.querySelector('[data-solution-id] summary').click();
  for(const[key,value]of Object.entries(saved))A.equal(app.w.localStorage.getItem(key),JSON.stringify(value),key);
  A.deepEqual(app.writes,[]);A.deepEqual(app.errors,[]);
 }finally{app.w.close();}
});
