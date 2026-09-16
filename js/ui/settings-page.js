import { SUBJECTS } from '../config/subjects.js';
const LABELS={chinese:'國文',english:'英語',math:'數學',social:'社會',science:'自然'};

export function renderSettingsPage(context) {
  const settings=context.storage.get('settings',{dailyMinutes:75,currentScopes:{}});
  const root=document.createElement('section'); root.className='page-stack';
  root.innerHTML='<header><p class="eyebrow">設定</p><h1>讀書時間與考試進度</h1></header>';
  const form=document.createElement('form'); form.className='card form-grid';
  form.innerHTML=`
    <label>每日可用分鐘<input name="dailyMinutes" type="number" min="20" max="180" value="${settings.dailyMinutes ?? 75}" required></label>
    <label>學期<input name="term" value="${settings.term ?? 'grade9-semester1'}"></label>
    <label>下一次考試日期<input name="nextExamDate" type="date" value="${settings.nextExamDate ?? ''}"></label>
    <label>下一次考試名稱<input name="nextExamLabel" value="${settings.nextExamLabel ?? ''}" placeholder="第二次模擬考"></label>
  `;
  for (const subject of SUBJECTS) {
    const label=document.createElement('label'); label.textContent=`${LABELS[subject]}目前進度`;
    const input=document.createElement('input'); input.name=`scope-${subject}`; input.value=settings.currentScopes?.[subject] ?? '';
    label.append(input); form.append(label);
  }
  const btn=document.createElement('button'); btn.className='button'; btn.type='submit'; btn.textContent='儲存設定';
  const msg=document.createElement('p'); msg.className='form-message'; form.append(btn,msg);
  form.addEventListener('submit',event=>{
    event.preventDefault(); const data=new FormData(form); const dailyMinutes=Number(data.get('dailyMinutes'));
    if (!Number.isFinite(dailyMinutes)||dailyMinutes<20||dailyMinutes>180) { msg.textContent='每日分鐘必須介於 20～180。'; msg.dataset.state='error'; return; }
    const next={
      ...settings,dailyMinutes,term:String(data.get('term')||''),nextExamDate:String(data.get('nextExamDate')||''),nextExamLabel:String(data.get('nextExamLabel')||''),
      currentScopes:Object.fromEntries(SUBJECTS.map(subject=>[subject,String(data.get(`scope-${subject}`)||'')]))
    };
    context.storage.set('settings',next); msg.textContent='設定已儲存。'; msg.dataset.state='success';
  });
  root.append(form); return root;
}
