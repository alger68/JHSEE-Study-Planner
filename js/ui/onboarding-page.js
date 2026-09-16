const SUBJECTS = [
  ['chinese','國文'], ['english','英語'], ['math','數學'], ['social','社會'], ['science','自然']
];
const GRADES = ['A++','A+','A','B++','B+','B','C'];
const QUICK_MINUTES = [30,45,60,75,90];

function button(text, onClick, className = 'button') {
  const el = document.createElement('button');
  el.type = 'button'; el.className = className; el.textContent = text; el.addEventListener('click', onClick);
  return el;
}

export function renderOnboardingPage(context) {
  let step = 1;
  const state = {
    grades:Object.fromEntries(SUBJECTS.map(([key]) => [key, key === 'english' ? 'B' : 'A'])),
    dailyMinutes:75,
    writingLevel:null,
    nextExamLabel:'', nextExamDate:'', currentScopes:{}
  };
  const root = document.createElement('section'); root.className = 'page-stack onboarding';

  function render() {
    root.replaceChildren();
    const head = document.createElement('header');
    head.innerHTML = `<p class="eyebrow">首次設定 · ${step}/3</p><h1>${step === 1 ? '最近一次模考' : step === 2 ? '每天可以讀多久？' : '下一次考試與目前進度'}</h1>`;
    root.append(head);
    const card = document.createElement('section'); card.className = 'card onboarding-card'; root.append(card);

    if (step === 1) {
      for (const [key,label] of SUBJECTS) {
        const row = document.createElement('label'); row.className='grade-row';
        const name=document.createElement('strong'); name.textContent=label;
        const select=document.createElement('select'); select.dataset.subject=key;
        for (const grade of GRADES) { const option=document.createElement('option'); option.value=grade; option.textContent=grade; option.selected=state.grades[key]===grade; select.append(option); }
        select.addEventListener('change', () => { state.grades[key]=select.value; });
        row.append(name,select); card.append(row);
      }
      const writing=document.createElement('label'); writing.textContent='作文級分（可略過）';
      const w=document.createElement('select'); w.innerHTML='<option value="">未填</option>';
      for(let i=1;i<=6;i++){ const o=document.createElement('option'); o.value=String(i); o.textContent=`${i} 級`; w.append(o); }
      w.addEventListener('change',()=>{ state.writingLevel=w.value ? Number(w.value) : null; }); writing.append(w); card.append(writing);
      card.append(button('下一步',()=>{ step=2; render(); }));
    } else if (step === 2) {
      const choices=document.createElement('div'); choices.className='minute-choices';
      for(const minutes of QUICK_MINUTES) choices.append(button(`${minutes} 分`,()=>{ state.dailyMinutes=minutes; render(); }, state.dailyMinutes===minutes?'button':'button button--secondary'));
      card.append(choices);
      const custom=document.createElement('label'); custom.textContent='自訂 20～180 分鐘';
      const input=document.createElement('input'); input.type='number'; input.min='20'; input.max='180'; input.value=String(state.dailyMinutes); input.addEventListener('change',()=>{ state.dailyMinutes=Math.max(20,Math.min(180,Number(input.value)||75)); }); custom.append(input); card.append(custom);
      const actions=document.createElement('div'); actions.className='button-row'; actions.append(button('上一步',()=>{step=1;render();},'button button--secondary'),button('下一步',()=>{step=3;render();})); card.append(actions);
    } else {
      const fields=[['nextExamLabel','下一次考試名稱','text'],['nextExamDate','下一次考試日期','date']];
      for(const [key,label,type] of fields){ const wrap=document.createElement('label'); wrap.textContent=label; const input=document.createElement('input'); input.type=type; input.value=state[key]; input.addEventListener('input',()=>{state[key]=input.value;}); wrap.append(input); card.append(wrap); }
      for(const [key,label] of SUBJECTS){ const wrap=document.createElement('label'); wrap.textContent=`${label}目前進度（可略過）`; const input=document.createElement('input'); input.value=state.currentScopes[key]??''; input.addEventListener('input',()=>{state.currentScopes[key]=input.value;}); wrap.append(input); card.append(wrap); }
      const message=document.createElement('p'); message.className='form-message'; card.append(message);
      const actions=document.createElement('div'); actions.className='button-row';
      actions.append(button('上一步',()=>{step=2;render();},'button button--secondary'),button('完成設定',()=>{
        const subjects=Object.fromEntries(SUBJECTS.map(([key])=>[key,{grade:state.grades[key]}]));
        const result=context.finishOnboarding({ diagnostic:{ id:`diag-${context.today()}`, date:context.today(), label:'最近一次模擬考', subjects, writingLevel:state.writingLevel }, settingsPatch:{ dailyMinutes:state.dailyMinutes, nextExamLabel:state.nextExamLabel, nextExamDate:state.nextExamDate, currentScopes:state.currentScopes } });
        if (!result?.ok) { message.textContent=result?.errors?.join('、') || '設定失敗'; message.dataset.state='error'; }
      })); card.append(actions);
    }
  }
  render(); return root;
}
