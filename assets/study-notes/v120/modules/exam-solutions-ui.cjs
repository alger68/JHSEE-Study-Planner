/* Historical-paper reader: isolated from quiz state and loaded only on request. */
(function(root){
 'use strict';
 const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const cache=new WeakMap(),status={verified:'核對一致',disputed:'原題有疑義',limited:'核對有限'};
 const link=(url,label,cls='btn secondary')=>`<a class="${cls}" href="${E(url)}" target="_blank" rel="noopener noreferrer">${E(label)} ↗</a>`;
 const href=id=>'#/papers?id='+encodeURIComponent(id);
 const context=p=>`${p.year} 下學期 · ${p.grade}年級 · 第${p.round}次段考`;
 const counts=p=>`${p.totalItems}題解析 · ${p.verifiedItems}題核對一致${p.disputedItems?' · '+p.disputedItems+'題有疑義':''}${p.limitedItems?' · '+p.limitedItems+'題核對有限':''}`;
 function homeLink(D){const x=D.examSolutions;return `<section class="panel paper-home"><div><span class="eyebrow">配合原卷 · 看懂每一步</span><h2>歷屆段考詳解</h2><p>已整理${x.paperCount}份七年級歷史題本；題目疑義與核對限制逐題標示。</p></div><a class="btn secondary" data-paper-entry href="#/papers?g=7">看歷屆詳解 →</a></section>`;}
 function invalid(){return '<section class="panel" data-paper-invalid><h1>找不到這個題本或年級</h1><p>請從歷屆題本列表重新選擇。</p><a class="btn primary" href="#/papers">返回題本列表</a></section>';}
 function state(D){if(!cache.has(D))cache.set(D,{loaded:new Map(),pending:new Map()});return cache.get(D);}
 function solutions(p){return p.sections.map(s=>`<section class="paper-section"><h2>${E(s.title)}</h2>${p.items.filter(q=>q.section===s.id).map(q=>`<details class="paper-question" data-solution-id="${E(q.id)}"><summary><span><b>${E(q.label)}</b> ${E(q.topic)}</span><span class="badge ${q.status==='verified'?'green':'paper-caution'}">${E(status[q.status])}</span></summary><div class="paper-answer"><p><b>校方答案：</b>${E(q.officialAnswer)}</p><p><b>核對結果：</b>${E(q.answer)}</p>${q.note?'<p class="paper-issue">'+E(q.note)+'</p>':''}<h3>解題步驟</h3><ol>${q.steps.map(s=>'<li>'+E(s)+'</li>').join('')}</ol><p class="paper-pitfall"><b>容易錯在：</b>${E(q.pitfall)}</p><p class="small-text">題目：PDF第${q.sourcePages.map(E).join('、')}頁；校方解答：PDF第${q.answerPage}頁。</p><a data-source-page href="${E(p.url+'#page='+q.sourcePages[0])}" target="_blank" rel="noopener noreferrer">查看原卷（參照上述頁碼）↗</a></div></details>`).join('')}</section>`).join('');}
 function render(D,params){
  const A=D.atlas,X=D.examSolutions,g=params.get('g')??'7',id=params.get('id');
  if(!['7','8','9','all'].includes(g)||(params.has('id')&&!id))return invalid();
  const crumb='<nav class="catalog-breadcrumb" aria-label="歷屆詳解路徑"><a href="#/home">首頁</a><span>›</span><a href="#/papers">歷屆段考詳解</a></nav>';
  if(!id){const all=A.exams.filter(p=>g==='all'||p.grade===Number(g)),ready=all.filter(p=>X.papers.some(x=>x.sourceId===p.sourceId)),pending=all.filter(p=>!X.papers.some(x=>x.sourceId===p.sourceId));
   const card=p=>{const x=X.papers.find(x=>x.sourceId===p.sourceId);return `<article class="paper-card" data-paper-card="${E(p.sourceId)}"><span class="eyebrow">${E(context(p))}</span><h3>${E(p.subjectName)}</h3><p>${x?E(counts(x)):'逐題詳解尚待編寫；可查閱官方原卷。'}</p><a class="btn ${x?'primary':'secondary'}" href="${E(href(p.sourceId))}">${x?'閱讀逐題詳解':'查看原卷與狀態'} →</a></article>`;};
   return `<div class="paper-view" data-view="papers">${crumb}<header class="section-heading"><span class="eyebrow">HISTORICAL EXAM NOTES</span><h1>先做原卷，再看懂解題步驟。</h1><p>本庫${A.exams.length}份題本皆為114下學期歷史資料；不代表本學期的出題範圍。原卷與本站原創詳解分開閱讀。</p></header><section class="panel"><label for="paper-grade">選擇年級</label><select id="paper-grade">${[['7','七年級'],['8','八年級'],['9','九年級'],['all','全部年級']].map(([v,t])=>`<option value="${v}"${g===v?' selected':''}>${t}</option>`).join('')}</select><p>${ready.length}份已有詳解 · ${pending.length}份待補。開啟詳解不會改變作答紀錄。</p></section>${ready.length?`<h2>已整理的詳解</h2><div class="paper-grid">${ready.map(card).join('')}</div>`:''}${pending.length?`<details class="paper-pending-list"${ready.length?'':' open'}><summary><h2>待補詳解的原始題本（${pending.length}份）</h2></summary><div class="paper-grid">${pending.map(card).join('')}</div></details>`:''}</div>`;
  }
  const p=A.exams.find(p=>p.sourceId===id);if(!p)return invalid();
  const x=X.papers.find(x=>x.sourceId===id),full=x?.items?x:state(D).loaded.get(id);
  const subjects=p.subject==='social'?['geography','history','civics']:[p.subject];
  const courses=subjects.map(s=>A.courses.find(c=>c.grade===p.grade&&c.year===p.year&&c.term===p.term&&c.subject===s)).filter(Boolean);
  return `<div class="paper-view" data-view="papers" data-paper-detail="${E(id)}">${crumb}<header class="section-heading"><span class="eyebrow">${E(context(p))}</span><h1>${E(p.subjectName)} · 逐題詳解</h1><p>${E(p.title)}</p><div class="actions">${link(p.url,'開啟官方原題本')}${courses.map(c=>`<a class="btn ghost" href="#/atlas?g=${c.grade}&s=${E(c.subject)}&period=${c.year}-${c.term}">回${E(c.subjectName)}歷史教材</a>`).join('')}</div></header>${x?`<section class="panel"><p class="paper-count">${E(counts(x))}</p><p>${E(x.coverageNote)}</p><p class="small-text muted">先閱讀原卷的題目與圖表，再展開對應題號。本站解題說明為原創；核對日期 ${E(x.checked)}。開啟詳解不計入測驗成績。</p></section><div data-paper-body>${full?solutions(full):'<section class="panel" role="status">正在載入這份題本的詳解…</section>'}</div>`:'<section class="panel" data-paper-pending><h2>逐題詳解尚待編寫</h2><p>目前可查閱官方原卷，尚未宣稱逐題重新驗算完成。</p></section>'}<a class="btn secondary paper-return" href="#/papers?g=${p.grade}">← 回${p.grade}年級歷屆題本</a></div>`;
 }
 async function ensure(D,p){
  const s=state(D);if(p.items)return p;if(s.loaded.has(p.sourceId))return s.loaded.get(p.sourceId);if(s.pending.has(p.sourceId))return s.pending.get(p.sourceId);
  const task=(async()=>{let timer;const controller=new AbortController();try{
   const work=(async()=>{const r=await root.fetch(p.bundle.file,{signal:controller.signal,cache:'default'});if(!r.ok)throw Error('HTTP '+r.status);const raw=await r.text();if(!root.crypto?.subtle)throw Error('內容驗證目前不可用');const digest=await root.crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw)),sha=Array.from(new Uint8Array(digest),x=>x.toString(16).padStart(2,'0')).join('');if(sha!==p.bundle.sha256)throw Error('詳解版本不符');const full=JSON.parse(raw);root.ExamSolutionData.validatePaper(full,D.atlas.exams.find(x=>x.sourceId===p.sourceId));const count=root.ExamSolutionData.counts(full);if(Object.keys(count).some(k=>count[k]!==p[k]))throw Error('詳解題數不符');return {...full,url:p.url};})();
   const full=await Promise.race([work,new Promise((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(Error('載入逾時'));},20000);})]);s.loaded.set(p.sourceId,full);return full;
  }finally{clearTimeout(timer);s.pending.delete(p.sourceId);}})();s.pending.set(p.sourceId,task);return task;
 }
 async function load(D,params,main){
  const p=D.examSolutions.papers.find(x=>x.sourceId===params.get('id')),target=main.querySelector('[data-paper-body]');if(!p||!target||p.items||state(D).loaded.has(p.sourceId))return;
  const hash=root.location.hash,current=()=>main.contains(target)&&root.location.hash===hash;
  try{const full=await ensure(D,p);if(current())target.innerHTML=solutions(full);}
  catch(_){if(!current())return;target.innerHTML='<section class="panel" role="status"><h2>這份詳解暫時無法載入</h2><p>請確認連線後重試。原卷仍可開啟，你的作答紀錄不受影響。</p><button class="btn primary" data-paper-retry>重新載入詳解</button></section>';target.querySelector('[data-paper-retry]').onclick=()=>{target.innerHTML='<section class="panel" role="status">正在重新載入詳解…</section>';load(D,params,main);};}
 }
 root.document.addEventListener('change',e=>{if(e.target.id==='paper-grade')root.location.hash='#/papers?g='+encodeURIComponent(e.target.value);});
 root.ExamSolutionsUI={homeLink,render,load};
})(window);
