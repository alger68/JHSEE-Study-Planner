import { SUBJECTS } from '../config/subjects.js';

const LABELS={chinese:'國文',english:'英語',math:'數學',social:'社會',science:'自然'};

function labeledInput(labelText, { name, type='text', value='', min=null, max=null, placeholder='' }) {
  const label=document.createElement('label');
  label.textContent=labelText;
  const input=document.createElement('input');
  input.name=name;
  input.type=type;
  input.value=String(value ?? '');
  if (min != null) input.min=String(min);
  if (max != null) input.max=String(max);
  if (placeholder) input.placeholder=placeholder;
  label.append(input);
  return label;
}

export function renderSettingsPage(context) {
  const settings=context.storage.get('settings',{dailyMinutes:75,currentScopes:{}});
  const root=document.createElement('section');
  root.className='page-stack';
  const header=document.createElement('header');
  const eyebrow=document.createElement('p'); eyebrow.className='eyebrow'; eyebrow.textContent='設定';
  const title=document.createElement('h1'); title.textContent='讀書時間與考試進度';
  header.append(eyebrow,title); root.append(header);

  const form=document.createElement('form');
  form.className='card form-grid';
  form.append(
    labeledInput('每日可用分鐘',{name:'dailyMinutes',type:'number',value:settings.dailyMinutes ?? 75,min:20,max:180}),
    labeledInput('學期',{name:'term',value:settings.term ?? 'grade9-semester1'}),
    labeledInput('下一次考試日期',{name:'nextExamDate',type:'date',value:settings.nextExamDate ?? ''}),
    labeledInput('下一次考試名稱',{name:'nextExamLabel',value:settings.nextExamLabel ?? '',placeholder:'第二次模擬考'})
  );

  for (const subject of SUBJECTS) {
    form.append(labeledInput(`${LABELS[subject]}目前進度`,{
      name:`scope-${subject}`,
      value:settings.currentScopes?.[subject] ?? ''
    }));
  }

  const btn=document.createElement('button');
  btn.className='button'; btn.type='submit'; btn.textContent='儲存設定';
  const msg=document.createElement('p'); msg.className='form-message';
  form.append(btn,msg);
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const data=new FormData(form);
    const dailyMinutes=Number(data.get('dailyMinutes'));
    if (!Number.isFinite(dailyMinutes)||dailyMinutes<20||dailyMinutes>180) {
      msg.textContent='每日分鐘必須介於 20～180。'; msg.dataset.state='error'; return;
    }
    const next={
      ...settings,
      dailyMinutes,
      term:String(data.get('term')||''),
      nextExamDate:String(data.get('nextExamDate')||''),
      nextExamLabel:String(data.get('nextExamLabel')||''),
      currentScopes:Object.fromEntries(SUBJECTS.map(subject=>[subject,String(data.get(`scope-${subject}`)||'')]))
    };
    context.storage.set('settings',next);
    msg.textContent='設定已儲存。'; msg.dataset.state='success';
  });
  root.append(form);
  return root;
}
