/* Web-only content delivery. Complete lesson data is validated before in-place hydration. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.StudyDelivery=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function create({D,C,manifest,fetch:fetcher,storage,document:doc,location:loc,crypto:cryptoAPI,timeout=20000}){
  const units=new Map(D.units.map(u=>[u.id,u])),loaded=new Set(),pending=new Map(),byUnit=new Map();
  for(const g of manifest.groups)for(const id of g.ids)byUnit.set(id,g);
  function catalogErrors(){
   if(manifest.schema!==1||byUnit.size!==units.size||D.units.length!==manifest.unitCount)return ['教材目錄版本不符'];
   return D.units.some(u=>!byUnit.has(u.id)||!Array.isArray(u.concepts)||!u.concepts.length||!Array.isArray(u.quiz)||!u.quiz.length)?['教材目錄不完整']:[];
  }
  async function fetchBundle(bundle){
   if(pending.has(bundle.file))return pending.get(bundle.file);
   const work=(async()=>{
    const controller=new AbortController();let timer;
    try{
     const request=(async()=>{
      const response=await fetcher(bundle.file,{signal:controller.signal,cache:'default'});
      if(!response.ok)throw Error('HTTP '+response.status);
      const raw=await response.text();
      if(cryptoAPI?.subtle){const digest=await cryptoAPI.subtle.digest('SHA-256',new TextEncoder().encode(raw));const hash=Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');if(hash!==bundle.sha256)throw Error('教材檔案版本不符');}
      const content=JSON.parse(raw),expected=bundle.ids||D.units.map(u=>u.id);
      if(content.schema!==1||!Array.isArray(content.units)||content.units.length!==expected.length||content.units.some((u,i)=>u.id!==expected[i]))throw Error('教材清單不符');
      const errors=C.validateData({...D,units:content.units});if(errors.length)throw Error('教材內容未通過檢查');
      for(const u of content.units){const old=units.get(u.id);if(!old||['grade','semester','subject','schoolYear','title'].some(k=>old[k]!==u[k])||JSON.stringify(old.quiz.map(q=>q.id))!==JSON.stringify(u.quiz.map(q=>q.id))||JSON.stringify(old.concepts.map(c=>c.id))!==JSON.stringify(u.concepts.map(c=>c.id)))throw Error('教材與目錄不符');}
      return content.units;
     })();
     const full=await Promise.race([request,new Promise((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(Error('連線逾時'));},timeout);})]);
     // Validation is atomic; references captured by the original UI remain valid.
     for(const u of full){Object.assign(units.get(u.id),u);loaded.add(u.id);}
    }finally{clearTimeout(timer);pending.delete(bundle.file);}
   })();
   pending.set(bundle.file,work);return work;
  }
  function ensure(ids){const groups=[...new Set(ids.filter(id=>units.has(id)&&!loaded.has(id)).map(id=>byUnit.get(id)))];return Promise.all(groups.map(fetchBundle));}
  function ensureAll(){return loaded.size===units.size?Promise.resolve():fetchBundle(manifest.all);}
  function backupIds(value){return Array.isArray(value?.mistakes)?value.mistakes.slice(0,201).map(x=>x?.q?.unitId).filter(x=>typeof x==='string'):[];}
  function ensureBackup(value){return ensure(backupIds(value));}
  function savedIds(){
   const ids=[];
   try{const raw=storage?.getItem('jh-study-notes.practice.v2');if(raw&&raw.length<=2500000)ids.push(...backupIds(JSON.parse(raw)));}catch(_){}
   try{const raw=storage?.getItem('jh-study-notes.practice.v2.session');if(raw&&raw.length<=2500000){const v=JSON.parse(raw);if(Array.isArray(v?.deck?.questions))ids.push(...v.deck.questions.slice(0,41).map(q=>q?.unitId));}}catch(_){}
   return ids;
  }
  function routeIds(route,state){
   const p=route.params||new URLSearchParams();
   if(route.view==='unit')return [route.id];
   if(route.view==='review')return [...(state?.starred||[]).map(k=>k.split('/')[0]),...Object.keys(state?.answers||{}).map(k=>k.split('/')[0])];
   if(route.view==='practice'||route.view==='exam'){
    const selected=p.get(route.view==='practice'?'exam':'units');if(selected)return selected.split(',');
    if(p.get('unit'))return [p.get('unit')];
    if(route.view==='exam')return [];
    return D.units.filter(u=>u.grade===Number(p.get('g')||7)&&u.semester===Number(p.get('term')||1)&&u.subject===(p.get('s')||'math')).map(u=>u.id);
   }
   return [];
  }
  function panel(main,message,retry,home=true){
   main.innerHTML='<section class="panel" data-content-status role="status"><h1>'+C.escapeHTML(message)+'</h1><p>教材會依目前範圍下載。你的收藏與作答紀錄仍保留在此瀏覽器。</p><div class="actions">'+(retry?'<button class="btn primary" data-content-retry>重新載入教材</button><button class="btn secondary" data-content-reload>重新整理網頁</button>':'')+(home?'<a class="btn secondary" href="#/home">回首頁</a>':'')+'</div></section>';
   if(retry)main.querySelector('[data-content-retry]').onclick=retry;
   if(retry)main.querySelector('[data-content-reload]').onclick=()=>loc.reload();
  }
  function gate(route,state,main,render){
   const all=route.view==='search',ids=routeIds(route,state);
   if(all?loaded.size===units.size:ids.every(id=>!units.has(id)||loaded.has(id)))return false;
   const hash=loc.hash;panel(main,'正在載入這次需要的教材');
   (all?ensureAll():ensure(ids)).then(()=>{if(loc.hash===hash)render();},()=>{if(loc.hash===hash)panel(main,'教材暫時無法載入，請檢查連線後重試',render);});
   return true;
  }
  function start(run){
   const ids=savedIds();if(!ids.some(id=>units.has(id))){run();return;}
   const main=doc.getElementById('main');
   const attempt=()=>{main.setAttribute('aria-busy','true');let notice=doc.getElementById('delivery-start-status');if(!notice){notice=doc.createElement('p');notice.id='delivery-start-status';notice.setAttribute('role','status');main.prepend(notice);}notice.textContent='正在還原你的練習紀錄…';
    ensure(ids).then(()=>{main.removeAttribute('aria-busy');run();},()=>{main.removeAttribute('aria-busy');panel(main,'連線中斷，尚未開啟練習紀錄',attempt,false);});};
   attempt();
  }
  return {catalogErrors,ensure,ensureAll,ensureBackup,routeIds,gate,start,isLoaded:id=>loaded.has(id)};
 }
 return {create};
});
