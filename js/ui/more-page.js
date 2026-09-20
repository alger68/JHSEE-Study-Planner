export function renderMorePage() {
  const root=document.createElement('section'); root.className='page-stack';
  const header=document.createElement('header'); header.className='jh-page-header'; header.innerHTML='<p class="eyebrow">更多</p><h1>其他工具</h1><p>日常使用以「今日、進度、錯題」為主。</p>'; root.append(header);
  const links=[['#/diagnostics','模考診斷','新增或查看最近一次模考'],['#/settings','設定','每日時間、下一次考試與目前進度'],['#/data','資料匯入／匯出','備份或交換 Study Planner JSON']];
  const list=document.createElement('div'); list.className='more-grid';
  for(const [href,title,detail] of links){ const a=document.createElement('a'); a.href=href; a.className='card jh-card more-link'; const strong=document.createElement('strong'); strong.textContent=title; const p=document.createElement('p'); p.textContent=detail; a.append(strong,p); list.append(a); }
  root.append(list); return root;
}
