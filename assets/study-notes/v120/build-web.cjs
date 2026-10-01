#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const {JSDOM,VirtualConsole}=require('jsdom');
function replace(s,a,b){if(!s.includes(a))throw Error('Web integration anchor missing: '+a.slice(0,90));return s.replace(a,()=>b);}
const scriptJSON=x=>JSON.stringify(x).replace(/</g,'\\u003c');
function build(full){
 const scripts=[...full.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)],dataScript=scripts.find(s=>s[1].includes('window.STUDY_DATA =')),box={window:{}};
 vm.runInNewContext(dataScript[1],box);const D=JSON.parse(JSON.stringify(box.window.STUDY_DATA));
 const core={module:{exports:{}},URL};vm.runInNewContext(scripts.find(s=>s[1].includes('Shared pure functions'))[1],core);
 const errors=core.module.exports.validateData(D);if(errors.length)throw Error(errors.join('\n'));
 const files={},groups=new Map();
 function bundle(name,units){const raw=JSON.stringify({schema:1,units}),sha256=crypto.createHash('sha256').update(raw).digest('hex'),file='content/'+name+'.'+sha256.slice(0,16)+'.json';files[file]=raw;return{file,sha256,ids:units.map(u=>u.id)};}
 for(const u of D.units){const key=[u.grade,u.subject,u.semester].join('-');if(!groups.has(key))groups.set(key,[]);groups.get(key).push(u);}
 const all=bundle('all',D.units);delete all.ids;
 const manifest={schema:1,unitCount:D.units.length,groups:[...groups].map(([name,units])=>bundle(name,units)),all};
 const data=JSON.parse(JSON.stringify(D));data.appVersion='2.0.2';
 for(const u of data.units){
  u.concepts=u.concepts.map(c=>({id:c.id,title:c.title}));
  u.quiz=u.quiz.map(q=>({id:q.id,concept:q.concept,answer:q.answer,options:q.options.map(o=>({id:o.id}))}));
  for(const k of ['diagrams','tables','traps','experiments','quick','reviewNote'])delete u[k];
 }
 // Render the established homepage at build time, before any curriculum script downloads.
 const v=new VirtualConsole(),runtimeErrors=[];v.on('jsdomError',e=>runtimeErrors.push(e.message));
 const dom=new JSDOM(full,{url:'https://example.test/assets/study-notes/#/home',runScripts:'dangerously',virtualConsole:v,beforeParse(w){w.scrollTo=()=>{};w.requestAnimationFrame=f=>{f();return 0;};}});
 if(runtimeErrors.length)throw Error(runtimeErrors.join('\n'));
 let html=full;for(const id of ['sidebar','main','mobile-nav']){const tag=id==='sidebar'?'aside':id==='main'?'main':'nav',pattern=new RegExp('<'+tag+'[^>]*id="'+id+'"[^>]*>[\\s\\S]*?<\\/'+tag+'>');html=html.replace(pattern,()=>dom.window.document.getElementById(id).outerHTML);}
 dom.window.close();html=html.replace('V2.0.0</span>','V2.0.2</span>');
 html=replace(html,dataScript[0],'<script>\nwindow.STUDY_DATA = '+scriptJSON(data)+';\n</script>');
 const runtime=scripts.at(-1);let js=runtime[1];
 js=replace(js,'  const errors = C.validateData(D);','  const errors = window.StudyContent.catalogErrors();');
 js=replace(js,'    navigation();','    navigation();\n    if(window.StudyContent.gate(route,state,main,render))return;');
 js=replace(js,'const next=P.validateState(JSON.parse(await f.text()),D);','const incoming=JSON.parse(await f.text());await window.StudyContent.ensureBackup(incoming).catch(()=>{throw Error("content-unavailable");});const next=P.validateState(incoming,D);');
 js=replace(js,"toast('備份無效，原進度未變更。');","toast(err.message==='content-unavailable'?'教材暫時無法載入，原進度未變更；請連線後重試匯入。':'備份無效，原進度未變更。');");
 const appMarker='/* Knowledge Station: data-driven, dependency-free, local-only study UI. */';
 js=replace(js,appMarker,'function startStudyApp(){\n'+appMarker);
 const loader=fs.readFileSync(path.join(__dirname,'modules/content-loader.cjs'),'utf8');
 js+='\n}\n'+loader+'\nwindow.StudyContent=window.StudyDelivery.create({D:window.STUDY_DATA,C:window.StudyCore,manifest:'+scriptJSON(manifest)+',fetch:window.fetch.bind(window),storage:(()=>{try{return window.localStorage;}catch(_){return null;}})(),document,location,crypto:window.crypto});\nwindow.StudyContent.start(startStudyApp);\n';
 new vm.Script(js);html=replace(html,runtime[0],'<script>\n'+js.replace(/<\/script/gi,'<\\/script')+'\n</script>');
 return {html,files,data,manifest};
}
if(require.main===module){const [input,output]=process.argv.slice(2);if(!input||!output)throw Error('Usage: node build-web.cjs full.html output/index.html');const b=build(fs.readFileSync(input,'utf8')),dir=path.dirname(path.resolve(output));fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(output,b.html);for(const [file,raw]of Object.entries(b.files)){fs.mkdirSync(path.dirname(path.join(dir,file)),{recursive:true});fs.writeFileSync(path.join(dir,file),raw);}fs.writeFileSync(path.join(dir,'delivery-manifest.json'),JSON.stringify({version:b.data.appVersion,...b.manifest},null,2));console.log(JSON.stringify({version:b.data.appVersion,htmlBytes:Buffer.byteLength(b.html),gzipBytes:require('node:zlib').gzipSync(b.html).length,contentGroups:b.manifest.groups.length,units:b.data.units.length}));}
module.exports={build};
