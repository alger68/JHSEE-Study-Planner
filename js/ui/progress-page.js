import { SUBJECTS } from '../config/subjects.js';
import { subjectTrend } from '../core/analytics.js';
import { summarizeTopic } from '../core/mastery.js';

const LABELS={chinese:'國文',english:'英語',math:'數學',social:'社會',science:'自然'};

export function renderProgressPage(context) {
  const root=document.createElement('section'); root.className='page-stack';
  root.innerHTML='<header><p class="eyebrow">進度</p><h1>每週 Mini Check</h1><p>至少兩週資料才顯示趨勢。</p></header>';
  const checks=context.storage.get('miniChecks',[]);
  const trendCard=document.createElement('section'); trendCard.className='card subject-grid';
  for (const subject of SUBJECTS) {
    const t=subjectTrend(checks,subject); const div=document.createElement('div'); div.className='subject-chip';
    div.textContent=t.status==='ready'?`${LABELS[subject]} ${t.latest}% (${t.delta>0?'+':''}${t.delta})`:`${LABELS[subject]} 資料不足`;
    trendCard.append(div);
  }
  root.append(trendCard);

  const logs=context.storage.get('practiceLogs',[]);
  const topicKeys=[...new Set(logs.filter(log=>log.subject&&log.topic).map(log=>`${log.subject}:${log.topic}`))];
  const topicCard=document.createElement('section'); topicCard.className='card'; topicCard.innerHTML='<h2>Topic 熟練度</h2>';
  const topicList=document.createElement('ul');
  if (!topicKeys.length) { const li=document.createElement('li'); li.textContent='資料不足'; topicList.append(li); }
  for (const key of topicKeys) { const [subject,topic]=key.split(':'); const summary=summarizeTopic(logs,subject,topic); const li=document.createElement('li'); li.textContent=`${LABELS[subject]??subject} · ${topic}：${summary.state==='insufficient'?'資料不足':`${Math.round(summary.accuracy)}% · ${summary.state}`}`; topicList.append(li); }
  topicCard.append(topicList); root.append(topicCard);

  const form=document.createElement('form'); form.className='card form-grid';
  form.innerHTML='<h2>新增本週結果</h2><label>週次<input name="week" placeholder="2026-W38" required></label>';
  for (const subject of SUBJECTS) {
    const label=document.createElement('label'); label.textContent=`${LABELS[subject]} 正確率`;
    const input=document.createElement('input'); input.name=subject; input.type='number'; input.min='0'; input.max='100'; input.required=true;
    label.append(input); form.append(label);
  }
  const btn=document.createElement('button'); btn.className='button'; btn.type='submit'; btn.textContent='儲存 Mini Check';
  const msg=document.createElement('p'); msg.className='form-message'; form.append(btn,msg);
  form.addEventListener('submit',event=>{
    event.preventDefault(); const data=new FormData(form);
    const subjects=Object.fromEntries(SUBJECTS.map(subject=>[subject,{accuracy:Number(data.get(subject))}]));
    if (Object.values(subjects).some(row=>!Number.isFinite(row.accuracy)||row.accuracy<0||row.accuracy>100)) {
      msg.textContent='正確率必須介於 0～100。'; msg.dataset.state='error'; return;
    }
    context.storage.set('miniChecks',[...checks,{week:String(data.get('week')),subjects}]);
    context.refresh();
  });
  root.append(form); return root;
}
