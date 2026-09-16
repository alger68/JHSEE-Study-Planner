export function renderReviewPage(context) {
  const root = document.createElement('section');
  root.className = 'page-stack';
  root.innerHTML = '<header><p class="eyebrow">錯題複習</p><h1>今天到期的錯題</h1></header>';
  const today = context.today();
  const items = context.getDueReviews(context.storage.get('reviewSchedule', []), today);
  const list = document.createElement('div'); list.className='task-list';
  if (!items.length) list.innerHTML='<div class="card empty-state">今天沒有到期錯題。</div>';
  for (const item of items) {
    const card = document.createElement('article'); card.className='card task-card';
    const title = document.createElement('h2'); title.textContent=`${item.subject} · ${item.topic || '錯題'}`;
    const meta = document.createElement('p'); meta.textContent=`${item.itemId} · 階段 ${item.stage} · 已失誤 ${item.lapseCount ?? 0} 次`;
    const actions=document.createElement('div'); actions.className='button-row';
    for (const [label, correct] of [['答對',true],['答錯',false]]) {
      const btn=document.createElement('button'); btn.type='button'; btn.className=correct?'button':'button button--danger'; btn.textContent=label;
      btn.addEventListener('click',()=>{
        const schedule=context.storage.get('reviewSchedule',[]);
        const updated=schedule.map(row=>row.itemId===item.itemId?context.recordReviewResult(row,correct,today):row);
        context.storage.set('reviewSchedule',updated); context.refresh();
      });
      actions.append(btn);
    }
    card.append(title,meta,actions); list.append(card);
  }
  root.append(list); return root;
}
