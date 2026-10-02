/* Read-only learning guidance over the existing curriculum and fixed-answer records. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.LearningPath=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const E=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const subjects=['math','english','science','chinese','social'];
 const termName=t=>t===1?'上學期':'下學期';
 const route=(g,t)=>'#/learn?'+new URLSearchParams({g,term:t});
 const unitURL=(u,tab='notes')=>'#/unit/'+encodeURIComponent(u.id)+'/'+tab;
 const catalog=c=>'#/library?'+new URLSearchParams({g:c.grade,term:c.term,s:c.bucket,course:c.id});
 function scope(D,params,progress={}){
  const g=params.get('g')||'7',t=params.get('term')||'1';
  if(!['7','8','9'].includes(g)||!['1','2'].includes(t))return null;
  const grade=Number(g),term=Number(t),available=(D.atlas?.courses||[]).filter(c=>c.grade===grade&&c.term===term);
  const year=Math.max(0,...available.map(c=>c.year)),courses=available.filter(c=>c.year===year);
  const units=D.units.filter(u=>u.status==='published'&&u.grade===grade&&u.semester===term&&(!u.schoolYear||u.schoolYear===year));
  const byId=new Map(units.map(u=>[u.id,u])),read=new Set(progress.read||[]),answers=progress.answers||{};
  function status(u){
   let answered=0,correct=0;const wrong=[];
   for(const q of u.quiz){const selected=answers[u.id+'/'+q.id];if(!q.options.some(o=>o.id===selected))continue;answered++;if(selected===q.answer)correct++;else wrong.push(q);}
   return {u,answered,correct,wrong,read:read.has(u.id),done:u.quiz.length>0&&correct===u.quiz.length};
  }
  const corrections=units.map(status).filter(x=>x.wrong.length),wrongCount=corrections.reduce((n,x)=>n+x.wrong.length,0);
  return {grade,term,year,courses,units,byId,status,corrections,wrongCount};
 }
 function homeLink(D,progress){
  const x=scope(D,new URLSearchParams('g=7&term=1'),progress);
  return `<section class="learning-home panel" aria-label="國一學習入口"><div><span class="eyebrow">國一上學期</span><h2>接著讀哪一課？</h2><p>查看各科下一課與章節檢測錯題。<strong>${x.wrongCount?x.wrongCount+' 題待訂正':'尚無章節檢測錯題'}</strong></p></div><a class="btn primary" data-learning-entry href="${E(route(7,1))}">開啟國一學習</a></section>`;
 }
 function render(D,params,progress={}){
  const x=scope(D,params,progress);
  if(!x)return '<section class="empty" data-learning-invalid><h1>學習範圍無效</h1><p>請選擇國中年級與學期。</p><a class="btn primary" href="#/learn?g=7&amp;term=1">回國一上學期</a></section>';
  const {grade,term,year,courses,byId,status,corrections,wrongCount}=x;
  function correction(row){
   const {u,wrong}=row,q=wrong[0],concept=u.concepts.find(c=>c.id===q.concept);
   return `<article class="learning-correction"><div><span class="small-text muted">${E(u.domain||D.subjects.find(s=>s.id===u.subject)?.name)} · ${E(u.chapter)}</span><h3>${E(u.title)}</h3><p>${wrong.length} 題待訂正${concept?' · 先回看「'+E(concept.title)+'」':''}</p></div><div class="actions"><a class="btn secondary" href="${E(unitURL(u)+'?concept='+encodeURIComponent(q.concept))}">回看觀念</a><a class="btn primary" data-correction-link href="${E(unitURL(u,'quiz')+'?question='+encodeURIComponent(q.id))}">看錯題與訂正</a></div></article>`;
  }
  function courseCard(c){
   const rows=[...new Set(c.sections.map(s=>s.unitId))].filter(id=>byId.has(id)).map(id=>status(byId.get(id)));
   const next=rows.find(r=>r.wrong.length)||rows.find(r=>!r.done&&(r.answered||r.read))||rows.find(r=>!r.done);
   const checked=rows.filter(r=>r.done).length;
   let body='<p>這份課程目前沒有可用的章節檢測。</p>';
   if(next){const {u}=next,reading=u.contentMode==='reading-guide';
    const reason=next.wrong.length?'先訂正，再往下學':next.read&&!next.answered?'已標記讀完，接著檢測':next.answered?'接著完成這一課':'從這一課開始';
    body=`<div data-next-unit="${E(u.id)}"><p class="learning-next-label">${reason}</p><h3>${E(u.chapter)} · ${E(u.title)}</h3>${reading?'<p class="learning-source-note" data-reading-guide>原創閱讀導引，未核對課文全文；請搭配自己的課本。</p>':''}<p class="small-text">固定檢測：已答 ${next.answered} / ${u.quiz.length} 題 · 答對 ${next.correct} 題</p><div class="actions"><a class="btn secondary" data-learn-read href="${E(unitURL(u))}">讀重點</a><a class="btn primary" href="${E(unitURL(u,'quiz'))}">開始檢測</a></div></div>`;
   }else if(rows.length)body='<p class="learning-next-label">本課程的固定檢測目前都答對了。</p><p>試著遮住筆記說明觀念，再依老師進度複習。</p>';
   return `<article class="panel learning-course" data-learning-course="${E(c.id)}"><div class="learning-course-head"><div><span class="eyebrow">${E(c.publisher||'校方自編')}</span><h2>${E(c.subjectName)}</h2></div><span class="badge">${checked} / ${rows.length} 課檢測全對</span></div>${body}<a class="learning-choose" href="${E(catalog(c))}">依老師進度選其他課次</a></article>`;
  }
  const core=courses.filter(c=>subjects.includes(c.bucket)).sort((a,b)=>subjects.indexOf(a.bucket)-subjects.indexOf(b.bucket));
  const extra=courses.filter(c=>!subjects.includes(c.bucket));
  const correctionHTML=corrections.length?corrections.slice(0,6).map(correction).join('')+(corrections.length>6?'<details><summary>其餘 '+(corrections.length-6)+' 課待訂正</summary>'+corrections.slice(6).map(correction).join('')+'</details>':''):'<p>目前沒有已作答的錯題。尚未作答的題目不列為錯題。</p>';
  return `<div data-view="learn" class="learning-view"><nav class="catalog-breadcrumb" aria-label="學習路徑"><a href="#/home">首頁</a><span>›</span><strong data-learning-grade>${grade}年級${termName(term)}</strong></nav><div class="section-heading"><div class="eyebrow">${year||'已收錄'}學年度課程來源</div><h1>先補一個觀念，再往前一步。</h1><p>今天挑一科、完成一課就好。先讀重點，再做檢測；答錯時回看對應觀念。</p></div><nav class="learning-scope" aria-label="選擇學習範圍">${[7,8,9].map(g=>`<a class="btn ${g===grade?'primary':'secondary'}"${g===grade?' aria-current="page"':''} href="${E(route(g,term))}">${g}年級</a>`).join('')}${[1,2].map(t=>`<a class="btn ${t===term?'primary':'secondary'}"${t===term?' aria-current="page"':''} href="${E(route(grade,t))}">${termName(t)}</a>`).join('')}</nav><p class="small-text muted">建議依此瀏覽器的作答紀錄與課程順序排列；不等同老師目前授課進度。已讀與固定題答對不代表已熟練。${term===2?'下學期保留已公開來源的原學年度，請核對這學期範圍。':''}</p><section class="panel learning-corrections" aria-labelledby="learning-corrections-title"><div class="section-top"><h2 id="learning-corrections-title">章節檢測待訂正</h2><span class="badge"><b data-fixed-wrong-count>${wrongCount}</b> 題</span></div>${correctionHTML}<p class="small-text muted">此處顯示本年級學期的固定檢測；變化題錯題可回首頁重練。</p></section><section aria-labelledby="learning-courses-title"><h2 id="learning-courses-title">各科下一課</h2><div class="learning-course-grid">${core.map(courseCard).join('')}</div></section><section class="panel learning-other"><h2>其他課程</h2><div class="actions">${extra.map(c=>`<a class="btn secondary" href="${E(catalog(c))}">${E(c.subjectName)}</a>`).join('')}<a class="btn secondary" href="#/library?g=${grade}&amp;term=${term}">本學期完整目錄</a></div></section><p class="small-text muted">學習與作答紀錄保存在此瀏覽器；換裝置前可到「使用與備份」匯出。</p></div>`;
 }
 return {render,homeLink};
});
