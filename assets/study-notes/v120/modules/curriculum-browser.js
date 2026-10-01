(function(root){
 'use strict';
 const E=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const href=(g,s,t)=>'#/library?'+new URLSearchParams({g,s,term:t});
 const external=(url,text)=>`<a class="small-text" href="${E(url)}"${url.startsWith('#')?'':' target="_blank" rel="noopener noreferrer"'}>${E(text)} ↗</a>`;
 const termName=t=>String(t)==='1'?'上學期':String(t)==='2'?'下學期':'上下學期';
 function summary(D){const x=D.catalogCompletion;if(!x)return '';return `<div class="curriculum-summary" aria-label="教材建置狀態"><span><b>${x.teachingSections}</b> 節原創重點</span><span><b>${x.readingGuideSections}</b> 節閱讀導引</span><span><b>${x.pendingSections}</b> 節待補教材</span></div><p class="small-text muted">閱讀導引使用原創例子，尚未核對課文全文。${x.untranscribedCourses?x.untranscribedCourses+'份課程來源仍待逐項定位；':''}上述數量不是完整課本覆蓋率。</p>`;}
 function render(D,params){
  const g=params.get('g')||'all',s=params.get('s')||'all',t=params.get('term')||'1';
  const subjects=D.subjects,subject=subjects.find(x=>x.id===s),byId=new Map(D.units.map(u=>[u.id,u]));
  if(!['all','7','8','9'].includes(g)||!['all','1','2'].includes(t)||(s!=='all'&&!subject))return '<section class="panel" data-view="library"><h1>篩選條件無效</h1><p>請重新選擇年級、學期與科目。</p><a class="btn primary" href="#/library">回教材目錄</a></section>';
  const selected=params.get('course'),selectedCourse=D.atlas.courses.find(c=>c.id===selected);
  if(params.has('course')&&(!selectedCourse||selectedCourse.grade!==Number(g)||selectedCourse.bucket!==s||(t!=='all'&&selectedCourse.term!==Number(t))))return `<section class="panel" data-view="library"><h1>課程範圍無效</h1><p>指定課程不存在，或不屬於所選年級、學期與科目。請重新選擇課程。</p><a class="btn primary" href="${E(href(g,s,t))}">重新選擇本範圍課程</a></section>`;
  const opt=(v,label,value)=>`<option value="${E(v)}"${String(v)===value?' selected':''}>${E(label)}</option>`;
  const filter=`<section class="panel academy-filter"><div class="filter-grid"><label>年級<select id="library-grade">${opt('all','請選年級',g)}${[7,8,9].map(n=>opt(n,n+'年級',g)).join('')}</select></label><label>學期<select id="library-term">${opt(1,'上學期',t)}${opt(2,'下學期',t)}${opt('all','上下學期',t)}</select></label><label>科目<select id="library-subject">${opt('all','請選科目',s)}${subjects.map(x=>opt(x.id,x.name,s)).join('')}</select></label></div></section>`;
  let h=`<div data-view="library" class="curriculum-view"><nav class="catalog-breadcrumb" aria-label="教材路徑"><a href="#/home">首頁</a><span>›</span><a href="#/library">教材目錄</a>${g!=='all'?'<span>›</span><strong>'+g+'年級</strong>':''}</nav><div class="section-heading"><div class="eyebrow">一步一步，把觀念讀懂</div><h1>${g==='all'?'三年教材目錄':g+'年級'+termName(t)}${subject?' · '+E(subject.name):''}</h1><p>依課程來源逐課閱讀，再用原創題確認理解。</p></div>${filter}`;
  if(g==='all')return h+`<div class="home-grade-grid">${[7,8,9].map(n=>`<a class="home-grade-card" href="${E(href(n,s,t))}"><span class="home-grade-number">0${n-6}</span><div><h2>${n} 年級</h2><p>${subject?E(subject.name)+' · ':''}${termName(t)}</p></div><span>↗</span></a>`).join('')}</div></div>`;
  if(s==='all')return h+`<div class="home-subject-grid">${subjects.map(x=>{const c=D.atlas.courses.filter(c=>c.grade===Number(g)&&c.bucket===x.id&&(t==='all'||c.term===Number(t)));const count=c.reduce((n,c)=>n+c.sections.length,0);return `<a class="home-subject-card" data-subject-entry="${E(x.id)}" href="${E(href(g,x.id,t))}"><span class="home-subject-symbol">${E(x.short)}</span><div><h2>${E(x.name)}</h2><p>${count?count+'個已定位課／主題':'共同核心與來源狀態'}</p></div><span>›</span></a>`;}).join('')}</div></div>`;
  const courses=D.atlas.courses.filter(c=>c.grade===Number(g)&&c.bucket===s&&(t==='all'||c.term===Number(t))).sort((a,b)=>a.term-b.term||b.year-a.year||a.subjectName.localeCompare(b.subjectName,'zh-Hant'));
  const visibleCourses=selectedCourse?[selectedCourse]:courses;
  const allSections=visibleCourses.flatMap(c=>c.sections),available=allSections.filter(x=>x.unitId).length;
  h+=`<div class="curriculum-scope"><span class="badge" data-catalog-count>${available} / ${allSections.length} 個已定位項目有學習內容</span><p class="small-text muted">上學期以115學年度來源為主；下學期採114學年度已公開資料。請依老師進度核對，不改標為115下學期。</p></div>`;
  if(courses.length)h+=`<nav class="curriculum-jump" aria-label="本頁子科目"><a href="${E(href(g,s,t))}"${!selectedCourse?' aria-current="page"':''}>全部子科目</a>${courses.map(c=>`<a href="${E(href(g,s,t))}&amp;course=${encodeURIComponent(c.id)}"${selectedCourse?.id===c.id?' aria-current="page"':''}>${E(c.subjectName)} · ${c.year}-${c.term}</a>`).join('')}</nav>`;
  for(const c of visibleCourses){
   const reading=c.sections.filter(x=>x.noteStatus==='reading-guide').length,ready=c.sections.filter(x=>x.unitId&&x.noteStatus!=='reading-guide').length;
   h+=`<section class="curriculum-course" data-course-id="${E(c.id)}"><header class="curriculum-course-header"><div><span class="eyebrow">${c.year}學年度${termName(c.term)} · ${E(c.publisher||'校方自編')}</span><h2>${E(c.subjectName)}</h2></div><div class="curriculum-course-status">${ready} 節重點${reading?' · '+reading+' 節導引':''}<br>${external(c.url,'校方課程來源')}</div></header>`;
   if(c.year<115)h+='<p class="curriculum-year-note">舊年度補充：保留原年度、出版社與課次，可作學習參考。</p>';
   if(c.outlineStatus==='themes-located')h+='<p class="curriculum-year-note">依校方教學表整理的主題；序號由本站編排，非課本原課號。PDF頁碼待版面核對。</p>';
   if(!c.sections.length){
    h+=`<div class="panel curriculum-pending"><h3>課程來源已收錄，逐課目錄待核對</h3><p>目前沒有可核實的逐課對應；下方共同核心指南可先用來學習。</p>${external(c.url,'查看原始課程計畫')}</div>`;
   }else h+='<div class="curriculum-lessons">'+c.sections.map(x=>{
    const u=byId.get(x.unitId),isReading=x.noteStatus==='reading-guide';
    const status=isReading?'原創閱讀導引':u?'原創重點與練習':'教材待補';
    return `<article class="curriculum-lesson${isReading?' curriculum-reading':''}" data-curriculum-section="${E(x.id)}"><div class="curriculum-lesson-heading"><span class="curriculum-number">${E(x.label)}</span><div><h3>${E(x.title)}</h3><span class="badge${u&&!isReading?' green':''}">${status}</span></div></div>${u?`<p class="curriculum-description">${E(u.summary)}</p>${isReading?'<p class="curriculum-reading-note">原創文本與閱讀方法練習，尚未核對本課全文。</p>':''}<div class="curriculum-lesson-bottom"><span class="small-text muted">${u.concepts.length} 個觀念 · ${u.quiz.length} 題解析</span><div class="actions"><a class="btn primary" href="#/unit/${E(u.id)}/notes">${isReading?'閱讀導引':'閱讀重點'}</a><a class="btn secondary" href="#/unit/${E(u.id)}/quiz">開始練習</a></div></div>`:`<p>本節原創講義與題目尚未完成。</p>${external(c.url,'查看校方來源')}`}</article>`;
   }).join('')+'</div>';
   h+=`<p class="small-text muted">${E(c.scopeNote)} ${external('#/atlas?g='+g+'&s='+c.subject+'&period='+c.year+'-'+c.term,'章節來源與歷屆紀錄')}</p></section>`;
  }
  if(!courses.length)h+='<section class="panel"><h2>這個範圍尚無逐課公開來源</h2><p>先提供本站共同核心指南；不據此推論學校未開課。</p></section>';
  const linked=new Set(D.atlas.courses.flatMap(c=>c.sections.map(x=>x.unitId)));
  const shared=D.units.filter(u=>u.grade===Number(g)&&u.subject===s&&(t==='all'||u.semester===Number(t))&&!linked.has(u.id));
  if(shared.length)h+=`<details class="panel curriculum-shared"><summary><strong>共同核心與既有專題（${shared.length}份）</strong></summary><p class="small-text muted">整學期觀念整理與補充專題，不當作逐課完成度。</p>${shared.map(u=>`<div class="curriculum-shared-row"><div><span class="small-text muted">${termName(u.semester)} · ${E(u.chapter)}</span><h3>${E(u.title)}</h3></div><a class="btn secondary" href="#/unit/${E(u.id)}/notes">閱讀</a></div>`).join('')}</details>`;
  return h+'</div>';
 }
 root.CurriculumBrowser={render,summary};
})(typeof window!=='undefined'?window:globalThis);
