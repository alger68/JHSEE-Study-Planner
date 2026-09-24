/* Homepage and catalog presentation. Course data and answer storage are never mutated. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.LibraryNavigation=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const KEY='jh-study-notes.navigation.v1';
 const readingTabs=['notes','diagrams','traps','quick'];
 function catalogURL(u){return '#/library?'+new URLSearchParams({g:u.grade,term:u.semester,s:u.subject});}
 function normalizeRoute(route){
  const r={...route,params:new URLSearchParams(route.params)};
  if(r.view==='subject'){r.params.set('s',r.id);r.view='library';r.id=undefined;r.canonicalHash='#/library?'+r.params;}
  if(r.view==='home'&&['g','term','s'].some(k=>r.params.has(k))){r.view='library';r.canonicalHash='#/library?'+r.params;}
  return r;
 }
 function create({D,C,unitCard,getLegacy,getPractice,storage}){
  const E=C.escapeHTML,units=D.units.filter(u=>u.status==='published'),byId=new Map(units.map(u=>[u.id,u]));
  let recent=[],blocked=false,temporary=false;
  if(storage===undefined){try{storage=globalThis.localStorage;}catch(_){temporary=true;}}
  try{
   const raw=storage?.getItem(KEY);
   if(raw){const x=JSON.parse(raw);if(x.schema!==1||!Array.isArray(x.recent)||x.recent.length>12)throw Error('invalid recent history');
    const seen=new Set();for(const item of x.recent){if(!item||typeof item.unitId!=='string'||!readingTabs.includes(item.tab)||!Number.isFinite(item.at)||seen.has(item.unitId))throw Error('invalid recent item');seen.add(item.unitId);if(byId.has(item.unitId))recent.push({...item});}
   }
  }catch(_){blocked=true;temporary=true;}
  function visitUnit(u,tab){
   if(!u||!byId.has(u.id)||!readingTabs.includes(tab))return;
   recent=[{unitId:u.id,tab,at:Date.now()},...recent.filter(x=>x.unitId!==u.id)].slice(0,12);
   if(blocked)return;
   try{if(!storage)throw Error('storage unavailable');storage.setItem(KEY,JSON.stringify({schema:1,recent}));}catch(_){temporary=true;}
  }
  const subjectName=id=>D.subjects.find(s=>s.id===id)?.name||id;
  const termName=t=>t===1?'上學期':t===2?'下學期':'上下學期';
  const publisher=(g,s)=>D.versions?.mapping?.[s]?.[Number(g)-7]||'原表未列出版社';
  const href=(g,s,t=1)=>'#/library?'+new URLSearchParams({g:g||'all',term:t,s:s||'all'});
  function gradeEntries(s,t=1){return `<div class="home-grade-grid">${[7,8,9].map(g=>`<a class="home-grade-card" data-grade-entry="${g}" href="${E(href(g,s,t))}"><span class="home-grade-number" aria-hidden="true">0${g-6}</span><div><h3>${g} 年級</h3><p>${s?E(subjectName(s))+' · '+E(publisher(g,s)):'選科目，找到這學期的重點'}</p></div><span aria-hidden="true">↗</span></a>`).join('')}</div>`;}
  function subjectEntries(g,t=1){
   const cards=list=>`<div class="home-subject-grid">${list.map(s=>`<a class="home-subject-card" data-subject-entry="${E(s.id)}" href="${E(href(g,s.id,t))}"><span class="home-subject-symbol" aria-hidden="true">${E(s.short)}</span><div><h3>${E(s.name)}</h3><p>${g?E(publisher(g,s.id)):'選年級後查看教材'}</p></div><span aria-hidden="true">›</span></a>`).join('')}</div>`;
   const local=s=>['taiwanese','hakka'].includes(s.id);
   return cards(D.subjects.filter(s=>!local(s)))+`<h3 class="home-local-label">本土語選修</h3>`+cards(D.subjects.filter(local));
  }
  function home(){
   const legacy=getLegacy()||{},practice=getPractice()||{},count=Array.isArray(practice.mistakes)?practice.mistakes.length:0;
   const recentHTML=recent.slice(0,3).map(x=>{const u=byId.get(x.unitId);return `<a class="home-recent-item" data-recent-unit="${E(u.id)}" href="#/unit/${E(u.id)}/${E(x.tab)}"><div><span class="eyebrow">${u.grade}年級${termName(u.semester)} · ${E(subjectName(u.subject))}</span><h3>${E(u.title)}</h3><p>${E(u.chapter)} · ${E(u.publisher)} · 最近開啟</p></div><span aria-hidden="true">→</span></a>`;}).join('');
   return `<div data-view="home"><div class="intro-line"><strong>知識小站 · 國中學習重點庫</strong><span>V${E(D.appVersion)}</span></div><section class="home-welcome"><div class="eyebrow">YOUR NEXT STEP</div><h1>今天，從哪一科開始？</h1><p>先選年級與科目，再進入章節。把重點讀懂，用練習確認。</p><div class="home-route-hint"><span>選年級</span><span aria-hidden="true">›</span><span>選科目與學期</span><span aria-hidden="true">›</span><span>閱讀章節・練習</span></div></section><section class="home-section" aria-labelledby="home-grade-title"><div class="section-top"><h2 id="home-grade-title">從年級開始</h2><a class="small-text" href="#/library">教材目錄 ↗</a></div>${gradeEntries()}</section><div class="home-learning-grid"><section class="panel home-continue" aria-labelledby="home-continue-title"><h2 id="home-continue-title">繼續學習</h2><p class="small-text muted">只顯示你最近開啟的教材，不代表已讀完或已熟練。</p>${recentHTML||'<div class="home-empty"><strong>尚未開啟教材</strong><p>從上方選年級，或從下方選科目。下次回來，就能接著閱讀。</p></div>'}${temporary?'<p class="small-text muted">最近開啟紀錄目前僅暫存；原有作答資料未變更。</p>':''}</section><section class="panel home-review"><h2>複習與練習</h2><p class="small-text muted">回到不熟的地方，不用重新找題。</p><button class="home-review-action" data-ac="home-wrong"${count?'':' disabled'}><span><strong>錯題重練</strong><small>${count?'重作已保存的原題快照':'目前沒有已存錯題'}</small></span><b data-wrong-count>${count}</b></button><a class="home-review-action" href="#/review"><span><strong>收藏的觀念</strong><small>星號標記的重點</small></span><b>${Array.isArray(legacy.starred)?legacy.starred.length:0}</b></a><div class="actions"><a class="btn secondary" href="#/practice">變化題練習</a><a class="btn ghost" href="#/exam">段考組卷</a></div></section></div><section class="home-section" aria-labelledby="home-subject-title"><div class="section-top"><h2 id="home-subject-title">直接找科目</h2><span class="small-text muted">各年級教材分開查看</span></div>${subjectEntries()}</section><section class="home-meta"><p>目前有 ${units.length} 份可閱讀教材與 ${units.reduce((n,u)=>n+u.quiz.length,0)} 道固定題；不是全部課本已完成。</p><div><a href="#/chapters">校方章節與完成度</a><a href="#/versions">官方教材版本</a><a href="#/help">使用與備份</a></div></section></div>`;
  }
  function filters(params){
   const g=params.get('g')||'all',s=params.get('s')||'all',t=params.get('term')||'1';
   const valid=['all','7','8','9'].includes(g)&&['all','1','2'].includes(t)&&(s==='all'||D.subjects.some(x=>x.id===s));
   return {g,s,t,valid};
  }
  function catalogHeader(g,s,t){
   return `<nav class="catalog-breadcrumb" aria-label="教材路徑"><a href="#/home">首頁</a><span>›</span><a href="${E(href(g,'all',t))}">${g==='all'?'選擇年級':g+'年級'}</a><span>›</span><span>${termName(Number(t))}</span>${s==='all'?'':`<span>›</span><strong>${E(subjectName(s))}</strong>`}</nav>`;
  }
  function unitBreadcrumb(u){return catalogHeader(String(u.grade),u.subject,String(u.semester))+`<a class="back-link" href="${E(catalogURL(u))}">← 回到${u.grade}年級${termName(u.semester)}${E(subjectName(u.subject))}教材目錄</a>`;}
  function library(params){
   const {g,s,t,valid}=filters(params);
   if(!valid)return '<div class="empty" data-view="library"><h1>篩選條件無效</h1><p>請重新選擇年級、學期及科目；沒有自動改成其他範圍。</p><a class="btn primary" href="#/library">回教材目錄</a></div>';
   const options=(items,current)=>items.map(([v,n])=>`<option value="${E(v)}"${String(v)===current?' selected':''}>${E(n)}</option>`).join('');
   let h=`<div data-view="library">${catalogHeader(g,s,t)}<div class="section-heading"><div class="eyebrow">COURSE CATALOG</div><h1>${g==='all'?'教材目錄':g+'年級'+termName(Number(t))}${s==='all'?'':' · '+E(subjectName(s))}</h1><p>在科目目錄找章節；已備重點與尚待補齊的部分分開標示。</p></div><section class="panel academy-filter"><div class="filter-grid"><label>年級<select id="library-grade">${options([['all','請選年級'],[7,'7年級'],[8,'8年級'],[9,'9年級']],g)}</select></label><label>學期<select id="library-term">${options([[1,'上學期'],[2,'下學期'],['all','上下學期']],t)}</select></label><label>科目<select id="library-subject">${options([['all','請選科目'],...D.subjects.map(x=>[x.id,x.name])],s)}</select></label></div></section>`;
   if(g==='all')return h+`<section class="home-section"><h2>選擇年級</h2>${gradeEntries(s==='all'?null:s,t)}</section></div>`;
   if(s==='all')return h+`<section class="home-section"><h2>選擇科目</h2>${subjectEntries(Number(g),t)}</section></div>`;
   const found=units.filter(u=>u.grade===Number(g)&&u.subject===s&&(t==='all'||u.semester===Number(t)));
   const compare=(a,b)=>a.semester-b.semester||a.chapter.localeCompare(b.chapter,'zh-Hant',{numeric:true});
   const aligned=found.filter(u=>['school-section-guide','detailed-topic'].includes(u.coverage)).sort(compare);
   const shared=found.filter(u=>!aligned.includes(u)).sort(compare);
   h+=`<div class="section-top"><h2>可閱讀內容</h2><span class="badge" data-catalog-count>目前篩選：${found.length}份教材</span></div><p class="catalog-scope-line">${E(publisher(g,s))} · ${g}年級${termName(Number(t))} · 下列數量只代表目前篩選範圍。</p>`;
   if(!found.length)return h+'<div class="empty"><h2>這個組合尚未列出教材</h2><p>本土語依選修語別使用；九年級官方表未列出版社，不改以別科內容替代。</p></div></div>';
   const cards=(name,list,note)=>list.length?`<section class="catalog-group"><h2>${name}</h2><p class="small-text muted">${note}</p><div class="unit-grid">${list.map(unitCard).join('')}</div></section>`:'';
   h+=cards('章節對應重點',aligned,'依章節編號排列；是精選重點，不等於本節全部課文或全部題型。');
   h+=cards('共同核心指南',shared,'自行編排的整體觀念與學習方法，不是已逐課核對的課本目錄。');
   const book=D.courseMap?.books.find(b=>b.grade===Number(g)&&b.subject===s&&b.semester===Number(t));
   if(book){
    h+=`<section class="panel catalog-status"><h2>校方章節與教材狀態</h2><p class="small-text muted">本範圍已核對${book.sections.length}個編號小節；沒有對應專題的章節不提供空白測驗。</p><div class="catalog-status-list">${book.sections.map(x=>{const u=x.unitId&&byId.get(x.unitId);return `<div class="catalog-status-row"><span>${E(x.code)} ${E(x.title)}</span>${u?`<a href="#/unit/${E(u.id)}/notes">有對應重點 ↗</a>`:'<span class="muted">尚無本節專題</span>'}</div>`;}).join('')}</div><a class="btn secondary" href="#/chapters?g=${g}&s=${E(s)}">來源頁碼與核對說明</a></section>`;
   }else h+='<p class="scope-note">目前未在本站逐節核對這個學期／科目的正式目錄；上方共同核心指南不能視為完整課程進度。</p>';
   return h+'</div>';
  }
  return {home,library,visitUnit,unitBreadcrumb};
 }
 return {KEY,catalogURL,normalizeRoute,create};
});
