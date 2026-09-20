import { parseQuickGrades } from '../core/onboarding.js';

const SUBJECTS = [['chinese','國文'],['english','英語'],['math','數學'],['social','社會'],['science','自然']];
const QUICK_MINUTES = [30,45,60,75,90];

function button(text, onClick, className = 'button') {
  const el=document.createElement('button'); el.type='button'; el.className=className; el.textContent=text; el.addEventListener('click',onClick); return el;
}

export function renderOnboardingPage(context) {
  const state={ quickGrades:'A B A A A', dailyMinutes:75 };
  const root=document.createElement('section'); root.className='page-stack onboarding';
  const header=document.createElement('header');
  header.innerHTML='<p class="eyebrow">30 秒快速開始</p><h1>先給我兩個資訊，其他之後再補</h1><p>依序輸入國文、英語、數學、社會、自然。例：A B A A A</p>';
  root.append(header);

  const card=document.createElement('section'); card.className='card onboarding-card quick-start-card';
  const gradeLabel=document.createElement('label'); gradeLabel.className='quick-grade-input';
  gradeLabel.innerHTML='<strong>最近一次模考成績</strong><span>國文 → 英語 → 數學 → 社會 → 自然</span>';
  const gradeInput=document.createElement('input'); gradeInput.type='text'; gradeInput.autocomplete='off'; gradeInput.value=state.quickGrades; gradeInput.placeholder='A B A A A'; gradeInput.setAttribute('aria-label','五科模考成績');
  gradeInput.addEventListener('input',()=>{ state.quickGrades=gradeInput.value; refreshPreview(); });
  gradeLabel.append(gradeInput); card.append(gradeLabel);

  const preview=document.createElement('div'); preview.className='quick-grade-preview';
  function refreshPreview(){
    const parsed=parseQuickGrades(state.quickGrades); preview.replaceChildren();
    if(!parsed.ok){ preview.textContent='輸入五科後，我會自動判斷優先順序。'; return; }
    for(const [key,label] of SUBJECTS){ const item=document.createElement('span'); item.textContent=label+' '+parsed.grades[key]; preview.append(item); }
  }
  refreshPreview(); card.append(preview);

  const minutesTitle=document.createElement('strong'); minutesTitle.textContent='平常每天大概能讀多久？'; card.append(minutesTitle);
  const choices=document.createElement('div'); choices.className='minute-choices';
  function renderChoices(){
    choices.replaceChildren();
    for(const minutes of QUICK_MINUTES){ choices.append(button(minutes+' 分',()=>{ state.dailyMinutes=minutes; renderChoices(); },state.dailyMinutes===minutes?'button':'button button--secondary')); }
  }
  renderChoices(); card.append(choices);

  const custom=document.createElement('label'); custom.className='quick-custom-minutes'; custom.textContent='自訂 20～180 分鐘';
  const customInput=document.createElement('input'); customInput.type='number'; customInput.min='20'; customInput.max='180'; customInput.placeholder='75';
  customInput.addEventListener('change',()=>{ const value=Number(customInput.value); if(Number.isFinite(value)&&value>=20&&value<=180){ state.dailyMinutes=value; renderChoices(); } });
  custom.append(customInput); card.append(custom);

  const message=document.createElement('p'); message.className='form-message';
  const start=button('開始今天的學習',()=>{
    const parsed=parseQuickGrades(state.quickGrades);
    if(!parsed.ok){ message.textContent=parsed.error; message.dataset.state='error'; gradeInput.focus(); return; }
    const subjects=Object.fromEntries(SUBJECTS.map(([key])=>[key,{grade:parsed.grades[key]}]));
    const result=context.finishOnboarding({ diagnostic:{ id:'diag-'+context.today(), date:context.today(), label:'最近一次模擬考', subjects, writingLevel:null }, settingsPatch:{ dailyMinutes:state.dailyMinutes, currentScopes:{} } });
    if(!result?.ok){ message.textContent=result?.errors?.join('、')||'設定失敗'; message.dataset.state='error'; }
  },'button quick-start-cta');
  const help=document.createElement('p'); help.className='quick-start-help'; help.innerHTML='作文、下一次模考日期、各科進度都可以之後到 <a href="#/settings">設定</a> 補充。';
  card.append(message,start,help); root.append(card); return root;
}
