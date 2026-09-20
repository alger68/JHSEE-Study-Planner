import { SUBJECTS } from '../config/subjects.js';

const LABELS={chinese:'國文',english:'英語',math:'數學',social:'社會',science:'自然'};

export function renderReviewPage(context) {
  const root = document.createElement('section');
  root.className = 'page-stack';
  root.innerHTML = '<header class="jh-page-header"><p class="eyebrow">錯題複習</p><h1>今天到期的錯題</h1></header>';
  const today = context.today();
  const items = context.getDueReviews(context.storage.get('reviewSchedule', []), today);
  const list = document.createElement('div');
  list.className='task-list';
  if (!items.length) list.innerHTML='<div class="card jh-card empty-state">今天沒有到期錯題。</div>';

  for (const item of items) {
    const card = document.createElement('article');
    card.className='card jh-card task-card';
    const title = document.createElement('h2');
    title.textContent=`${LABELS[item.subject] ?? item.subject} · ${item.topic || '錯題'}`;
    const meta = document.createElement('p');
    meta.textContent=`${item.itemId} · 階段 ${item.stage} · 已失誤 ${item.lapseCount ?? 0} 次`;
    const actions=document.createElement('div');
    actions.className='button-row';
    for (const [label, correct] of [['答對',true],['答錯',false]]) {
      const btn=document.createElement('button');
      btn.type='button';
      btn.className=correct?'button':'button button--danger';
      btn.textContent=label;
      btn.addEventListener('click',()=>{
        const schedule=context.storage.get('reviewSchedule',[]);
        const updated=schedule.map(row=>row.itemId===item.itemId?context.recordReviewResult(row,correct,today):row);
        context.storage.set('reviewSchedule',updated);
        context.storage.append('practiceLogs',context.reviewResultToPracticeLog(item,correct,today));
        context.refresh();
      });
      actions.append(btn);
    }
    card.append(title,meta,actions);
    list.append(card);
  }
  root.append(list);

  const form=document.createElement('form');
  form.className='card jh-card form-grid';
  const heading=document.createElement('h2');
  heading.textContent='手動加入錯題';
  const idLabel=document.createElement('label');
  idLabel.textContent='題目／錯題 ID';
  const idInput=document.createElement('input');
  idInput.name='itemId'; idInput.required=true; idInput.placeholder='例如 eng-grammar-001';
  idLabel.append(idInput);
  const subjectLabel=document.createElement('label');
  subjectLabel.textContent='科目';
  const subject=document.createElement('select');
  subject.name='subject';
  for (const code of SUBJECTS) { const option=document.createElement('option'); option.value=code; option.textContent=LABELS[code]; subject.append(option); }
  subjectLabel.append(subject);
  const topicLabel=document.createElement('label');
  topicLabel.textContent='單元／Topic';
  const topic=document.createElement('input');
  topic.name='topic'; topic.required=true; topic.placeholder='例如 grammar';
  topicLabel.append(topic);
  const button=document.createElement('button');
  button.type='submit'; button.className='button'; button.textContent='加入錯題排程';
  const msg=document.createElement('p'); msg.className='form-message';
  form.append(heading,idLabel,subjectLabel,topicLabel,button,msg);
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const data=new FormData(form);
    const itemId=String(data.get('itemId')||'').trim();
    const schedule=context.storage.get('reviewSchedule',[]);
    if (schedule.some(item=>item.itemId===itemId && !item.deleted)) { msg.textContent='這個錯題 ID 已在排程中。'; msg.dataset.state='error'; return; }
    const created=context.createReviewItem({itemId,subject:String(data.get('subject')),topic:String(data.get('topic')||'').trim()},today);
    context.storage.append('reviewSchedule',created);
    context.storage.append('practiceLogs',{...context.reviewResultToPracticeLog(created,false,today),source:'manual-wrong'});
    msg.textContent='已加入，第一次重做安排在明天。'; msg.dataset.state='success';
    form.reset();
  });
  root.append(form);
  return root;
}
