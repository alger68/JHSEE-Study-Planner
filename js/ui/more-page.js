export function renderMorePage() {
  const root=document.createElement('section');
  root.className='page-stack';

  const header=document.createElement('header');
  header.className='jh-page-header';
  header.innerHTML='<p class="eyebrow">更多</p><h1>其他工具</h1><p>日常使用以「今日、進度、錯題」為主。</p>';
  root.append(header);

  const links=[
    ['#/diagnostics','模考診斷','新增或查看最近一次模考'],
    ['#/settings','設定','每日時間、下一次考試與目前進度'],
    ['#/data','資料匯入／匯出','備份或交換 Study Planner JSON']
  ];
  const list=document.createElement('div');
  list.className='more-grid';
  for(const [href,title,detail] of links){
    const a=document.createElement('a');
    a.href=href;
    a.className='card jh-card more-link';
    const strong=document.createElement('strong');
    strong.textContent=title;
    const p=document.createElement('p');
    p.textContent=detail;
    a.append(strong,p);
    list.append(a);
  }
  root.append(list);

  const suite=document.createElement('section');
  suite.className='card jh-card';
  const title=document.createElement('h2');
  title.textContent='JHSEE Learning Suite';
  const note=document.createElement('p');
  note.textContent='切換工具不會讀取或修改其他網站的資料。';
  const nav=document.createElement('nav');
  nav.className='jh-suite-links';
  nav.setAttribute('aria-label','切換 JHSEE 產品');

  const apps=[
    ['https://alger68.github.io/JHSEE-Study-Planner/','Study Planner'],
    ['https://alger68.github.io/JHSEE-All-Subjects/','All Subjects'],
    ['https://alger68.github.io/JHSEE-English-Adventure/','English Adventure']
  ];
  for(const [href,label] of apps){
    const a=document.createElement('a');
    a.href=href;
    a.className='button button--secondary';
    a.textContent=label;
    nav.append(a);
  }
  suite.append(title,note,nav);
  root.append(suite);

  return root;
}
