import { parseQuickGrades } from '../core/onboarding.js';

const SUBJECTS = [
  ['chinese','國文'], ['english','英語'], ['math','數學'], ['social','社會'], ['science','自然']
];
const QUICK_MINUTES = [30,45,60,75,90];

function button(text, onClick, className = 'button') {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = className;
  el.textContent = text;
  el.addEventListener('click', onClick);
  return el;
}

export function renderOnboardingPage(context) {
  const state = { quickInput:'A B A A A', dailyMinutes:75 };
  const root=document.createElement('section');
  root.className='page-stack onboarding quick-start';

  const head=document.createElement('header');
  head.className='quick-start__header';
  head.innerHTML='<p class="eyebrow">30 秒快速開始</p><h1>只填必要資訊，今天就開始</h1><p>先告訴我最近一次五科成績與每天大概能讀多久，其餘資料之後再補。</p>';
  root.append(head);

  const card=document.createElement('section');
  card.className='card onboarding-card quick-start__card';

  const gradeBlock=document.createElement('div');
  gradeBlock.className='quick-start__block';

  const gradeLabel=document.createElement('label');
  gradeLabel.className='quick-start__label';
  gradeLabel.innerHTML='<strong>最近一次五科成績</strong><span>依序：國文・英語・數學・社會・自然</span>';

  const input=document.createElement('input');
  input.type='text';
  input.autocomplete='off';
  input.value=state.quickInput;
  input.placeholder='例如：A B A A A';
  input.setAttribute('aria-describedby','quick-grade-help');

  const help=document.createElement('p');
  help.id='quick-grade-help';
  help.className='form-message quick-start__help';

  const preview=document.createElement('div');
  preview.className='quick-grade-preview';

  function syncGradePreview() {
    state.quickInput=input.value;
    const parsed=parseQuickGrades(state.quickInput);
    preview.replaceChildren();
    if (!parsed.ok) {
      help.textContent=parsed.error;
      help.dataset.state='error';
      return parsed;
    }
    help.textContent='可以直接開始，不需要再填作文、模考日期或各科進度。';
    help.dataset.state='success';
    for (const [key,label] of SUBJECTS) {
      const chip=document.createElement('span');
      chip.className='quick-grade-chip';
      const small=document.createElement('small');
      small.textContent=label;
      const strong=document.createElement('strong');
      strong.textContent=parsed.grades[key];
      chip.append(small,strong);
      preview.append(chip);
    }
    return parsed;
  }

  input.addEventListener('input', syncGradePreview);
  gradeLabel.append(input);
  gradeBlock.append(gradeLabel, help, preview);

  const presets=document.createElement('div');
  presets.className='button-row quick-start__presets';
  presets.append(
    button('4A1B・英文 B',()=>{ input.value='A B A A A'; syncGradePreview(); },'button button--secondary'),
    button('5A',()=>{ input.value='A A A A A'; syncGradePreview(); },'button button--secondary')
  );
  gradeBlock.append(presets);
  card.append(gradeBlock);

  const timeBlock=document.createElement('div');
  timeBlock.className='quick-start__block';
  const timeTitle=document.createElement('div');
  timeTitle.className='quick-start__label';
  timeTitle.innerHTML='<strong>平常一天可以讀多久？</strong><span>之後每天仍可臨時調整。</span>';

  const choices=document.createElement('div');
  choices.className='minute-choices';

  function renderMinutes() {
    choices.replaceChildren();
    for (const minutes of QUICK_MINUTES) {
      choices.append(button(
        minutes + ' 分',
        ()=>{ state.dailyMinutes=minutes; customInput.value=String(minutes); renderMinutes(); },
        state.dailyMinutes===minutes ? 'button' : 'button button--secondary'
      ));
    }
  }

  const custom=document.createElement('label');
  custom.className='quick-start__custom';
  custom.textContent='自訂分鐘';
  const customInput=document.createElement('input');
  customInput.type='number';
  customInput.min='20';
  customInput.max='180';
  customInput.value=String(state.dailyMinutes);
  customInput.addEventListener('change',()=>{
    state.dailyMinutes=Math.max(20,Math.min(180,Number(customInput.value)||75));
    customInput.value=String(state.dailyMinutes);
    renderMinutes();
  });
  custom.append(customInput);
  renderMinutes();

  timeBlock.append(timeTitle,choices,custom);
  card.append(timeBlock);

  const message=document.createElement('p');
  message.className='form-message';

  const start=button('開始今天的學習',()=>{
    const parsed=syncGradePreview();
    if(!parsed.ok) return;

    const subjects=Object.fromEntries(
      SUBJECTS.map(([key])=>[key,{ grade:parsed.grades[key] }])
    );
    const result=context.finishOnboarding({
      diagnostic:{
        id:'diag-' + context.today(),
        date:context.today(),
        label:'最近一次模擬考',
        subjects,
        writingLevel:null
      },
      settingsPatch:{ dailyMinutes:state.dailyMinutes }
    });
    if(!result?.ok) {
      message.textContent=result?.errors?.join('、') || '設定失敗，請再試一次。';
      message.dataset.state='error';
    }
  });
  start.className='button quick-start__cta';

  const foot=document.createElement('p');
  foot.className='quick-start__footnote';
  foot.textContent='下一次模考日期、作文級分、學校進度等都可之後在「更多 → 設定」補充。';

  card.append(message,start,foot);
  root.append(card);
  syncGradePreview();
  return root;
}
