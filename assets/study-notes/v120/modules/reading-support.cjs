/* Source-specific reading additions; lesson bundles carry the complete content. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ReadingSupport=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const text=s=>typeof s==='string'&&s.trim().length>0&&s.length<=10000;
 const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const labels={'original-verified':'公開原作已核對','edition-verified':'課本版本已核對','source-needed':'課文來源待補'};
 function safeURL(s){try{const u=new URL(s);return u.protocol==='https:'&&!u.username&&!u.password?u.href:'';}catch(_){return '';}}
 function validate(row,unit){
  if(!row||!unit||unit.contentMode!=='reading-guide'||row.sectionId!==unit.catalogSectionId||row.title!==unit.title)throw Error('Reading source lesson mismatch');
  if(!Object.hasOwn(labels,row.status)||!/^\d{4}-\d{2}-\d{2}$/.test(row.checked)||!text(row.scopeNote)||(row.author!==null&&!text(row.author)))throw Error('Invalid reading support scope');
  if(!Array.isArray(row.sources)||row.sources.some(s=>!text(s.title)||!safeURL(s.url)))throw Error('Invalid reading source');
  if(!Array.isArray(row.teaching)||row.teaching.some(t=>!text(t.title)||!text(t.body))||!Array.isArray(row.readingChecks)||row.readingChecks.some(q=>!['prompt','answer','basis'].every(k=>text(q[k]))))throw Error('Invalid reading support');
  if(row.status!=='source-needed'&&(!row.sources.length||row.teaching.length<2||row.readingChecks.length<2))throw Error('Verified reading source needs substantive support');
 }
 function enrich(D,rows){
  if(rows===undefined)rows=JSON.parse(require('node:fs').readFileSync(require('node:path').join(__dirname,'reading-support.json'),'utf8'));
  if(!Array.isArray(rows))throw Error('Invalid reading support rows');
  const units=new Map(D.units.filter(u=>u.catalogSectionId).map(u=>[u.catalogSectionId,u])),seen=new Set();
  for(const row of rows){if(seen.has(row.sectionId))throw Error('Duplicate reading support');seen.add(row.sectionId);validate(row,units.get(row.sectionId));}
  for(const row of rows){const u=units.get(row.sectionId);u.readingSupport=JSON.parse(JSON.stringify(row));u.readingSupportStatus=row.status;for(const c of D.atlas?.courses||[])for(const section of c.sections)if(section.id===row.sectionId)section.quality=notice(u);}
  if(D.sourceNotice)D.sourceNotice='逐課目錄按來源年級、科目及學期呈現。原創概念教學、閱讀導引與課文查核分別計數；原作及課本版本的核對狀態請見各課補充。外部連結不算本地教學完成。';
  D.readingSupport={schema:1,checked:'2026-10-03',total:rows.length,originalVerified:rows.filter(r=>r.status==='original-verified').length,editionVerified:rows.filter(r=>r.status==='edition-verified').length,sourceNeeded:rows.filter(r=>r.status==='source-needed').length};
  return D;
 }
 function notice(u){
  const status=u.readingSupportStatus||u.readingSupport?.status;
  if(status==='edition-verified')return '已核對相符版次的課文補充；原有檢測仍為本站原創閱讀練習，不代表出版社原題。';
  if(status==='original-verified')return '已補公開原作解讀；尚未核對課文全文的校方節錄版本。原有練習為本站原創。';
  return '原創閱讀導引，未核對課文全文；請搭配自己的課本。題目使用本站原創材料，不代表同名課文內容。';
 }
 function reviewNote(u){return u.readingSupportStatus?notice(u):u.reviewNote||'';}
 function render(unit){
  const r=unit.readingSupport;if(!r)return '';
  return `<section class="panel reading-support" data-reading-support="${E(r.sectionId)}"><div class="badge-row"><span class="badge ${r.status==='source-needed'?'':'green'}">${E(labels[r.status])}</span><span class="small-text muted">查核 ${E(r.checked)}</span></div><h2>原作查核與課文補充</h2>${r.author?`<p><b>作者／來源：</b>${E(r.author)}</p>`:''}<p class="reading-scope" data-reading-scope>${E(r.scopeNote)}</p>${r.teaching.map(t=>`<h3>${E(t.title)}</h3><p>${E(t.body)}</p>`).join('')}${r.readingChecks.length?'<h3>讀後核對</h3>':''}${r.readingChecks.map(q=>`<details class="experiment" data-reading-check><summary>${E(q.prompt)}</summary><div class="experiment-content"><p><b>回答參考：</b>${E(q.answer)}</p><p class="small-text"><b>依據：</b>${E(q.basis)}</p></div></details>`).join('')}${r.sources.length?`<h3>查閱來源</h3><ul>${r.sources.filter(s=>safeURL(s.url)).map(s=>`<li><a data-reading-source href="${E(safeURL(s.url))}" target="_blank" rel="noopener noreferrer">${E(s.title)} ↗</a></li>`).join('')}</ul>`:''}<p class="small-text muted">以下原創閱讀練習保留原有作答紀錄；來源查核與課本版本限制請以上述說明為準。</p></section>`;
 }
 function summary(D){const x=D.readingSupport;if(!x?.total)return '';return `<p class="small-text muted" data-reading-summary>本輪閱讀補充 ${x.total} 項：${x.originalVerified} 項公開原作已核對、${x.editionVerified} 項課本版本已核對、${x.sourceNeeded} 項仍待課文來源。原作與課本節錄可能不同，請查看各課說明。<a href="#/library?g=all&amp;s=chinese&amp;term=all">國文教材</a> · <a href="#/library?g=all&amp;s=taiwanese&amp;term=all">臺語教材</a></p>`;}
 return {enrich,render,summary,notice,reviewNote};
});
