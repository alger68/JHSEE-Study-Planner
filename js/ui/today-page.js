import { summarizeDay } from '../core/task-status.js';
import { explainTask } from '../core/task-explainer.js';
import { summarizeTopic } from '../core/mastery.js';

const LABELS={chinese:'國文',english:'英語',math:'數學',social:'社會',science:'自然'};

function latestGrades(records=[]){
  const valid=[...records].filter(r=>r?.subjects).sort((a,b)=>(b.date??'').localeCompare(a.date??''));
  return Object.fromEntries(Object.entries(valid[0]?.subjects??{}).map(([k,v])=>[k,v.grade]));
}

function statusForPriority(priority) {
  if (!Number.isFinite(priority)) return '資料不足';
  if (priority >= 0.60) return '優先加強';
  if (priority >= 0.40) return '需要注意';
  return '穩定維持';
}

export function renderTodayPage(context) {
  const root=document.createElement('section');
  root.className='page-stack today-page';

  const today=context.today();
  let allTasks=context.storage.get('dailyTasks', []);
  let tasks=allTasks.filter(task=>task.date===today);

  if(!tasks.length){
    const older=allTasks.filter(task=>task.date<today);
    const carry=context.rescheduleUnfinished(older,today);
    const result=context.generateTodayPlan();
    tasks=result.tasks;
    for(const retry of carry){
      const current=tasks.find(t=>t.type===retry.type && (!retry.subject || t.subject===retry.subject));
      if(current) current.rescheduledFrom=retry.rescheduledFrom;
    }
    const carriedIds=new Set(tasks.map(t=>t.rescheduledFrom).filter(Boolean));
    allTasks=allTasks.map(t=>carriedIds.has(t.id)?{...t,status:'rescheduled',rescheduledTo:today}:t);
    allTasks=[...allTasks.filter(t=>t.date!==today),...tasks];
    context.storage.set('dailyTasks',allTasks);
  }

  const priorities=context.getPriorities();
  const summary=summarizeDay(tasks);

  const hero=document.createElement('header');
  hero.className='card today-hero jh-hero';
  const eyebrow=document.createElement('p');
  eyebrow.className='eyebrow';
  eyebrow.textContent='今日學習計畫';
  const h1=document.createElement('h1');
  h1.textContent=summary.total ? \`今天 \${summary.completed} / \${summary.total} 完成\` : '今天還沒有計畫';
  const remain=document.createElement('p');
  remain.className='today-remaining';
  remain.textContent=\`剩餘 \${summary.remainingMinutes} 分鐘\`;
  const next=document.createElement('p');
  next.className='jh-hero-next';
  next.textContent=summary.nextTask
    ? \`下一個：\${LABELS[summary.nextTask.subject]??'綜合'} · \${summary.nextTask.plannedMinutes} 分鐘\`
    : '今天的任務已處理完成。';
  hero.append(eyebrow,h1,remain,next);

  if(summary.nextTask){
    const primary=document.createElement('button');
    primary.type='button';
    primary.className='button jh-primary-cta';
    primary.textContent=summary.nextTask.status==='active' ? '繼續下一個任務' : '開始下一個任務';
    primary.addEventListener('click',()=>{
      if(summary.nextTask.status==='pending') {
        context.startDailyTask(summary.nextTask.id);
      } else {
        document.getElementById(\`task-\${summary.nextTask.id}\`)?.scrollIntoView({ behavior:'smooth', block:'center' });
      }
    });
    hero.append(primary);
  }

  root.append(hero);

  if(context.needsV11Nudge?.()){
    const nudge=document.createElement('aside');
    nudge.className='card onboarding-nudge';
    nudge.innerHTML='<strong>補齊進階設定</strong><p>既有資料會保留；需要時再補下一次考試與各科進度即可。</p><a class="button button--secondary" href="#/settings">前往設定</a>';
    root.append(nudge);
  }

  const list=document.createElement('div');
  list.className='task-list';

  for(const task of tasks){
    const item=document.createElement('article');
    item.id=\`task-\${task.id}\`;
    item.className=\`card task-card jh-task-card \${task.status==='completed'?'is-complete':''} \${task.status==='active'?'is-active':''}\`;

    const heading=document.createElement('div');
    heading.className='jh-task-heading';
    const title=document.createElement('h2');
    title.textContent=\`\${LABELS[task.subject]??'綜合'} · \${task.type}\`;
    const status=document.createElement('span');
    status.className='badge jh-status-badge';
    status.textContent=statusForPriority(priorities?.[task.subject]);
    heading.append(title,status);

    const meta=document.createElement('p');
    meta.className='jh-task-meta';
    meta.textContent=\`\${task.plannedMinutes} 分鐘\${task.topic?\` · \${task.topic}\`:''}\`;

    const practice=context.storage.get('practiceLogs',[]);
    const mastery={};
    if(task.subject&&task.topic) mastery[task.topic]=summarizeTopic(practice,task.subject,task.topic);
    const due=context.getDueReviews(context.storage.get('reviewSchedule',[]),today);
    const dueCounts=Object.fromEntries(Object.keys(LABELS).map(s=>[s,due.filter(x=>x.subject===s).length]));
    const reasons=explainTask(task,{
      latestGrades:latestGrades(context.storage.get('diagnostics',[])),
      priorities,
      mastery,
      dueCounts,
      currentScopes:context.storage.get('settings',{}).currentScopes??{},
      staleDays:{}
    });

    item.append(heading,meta);
    if(reasons.length){
      const details=document.createElement('details');
      const s=document.createElement('summary');
      s.textContent=\`安排原因：\${reasons[0]}\`;
      const ul=document.createElement('ul');
      reasons.forEach(reason=>{ const li=document.createElement('li'); li.textContent=reason; ul.append(li); });
      details.append(s,ul);
      item.append(details);
    }

    const actions=document.createElement('div');
    actions.className='button-row';

    if(task.status==='completed'){
      const done=document.createElement('span');
      done.className='badge';
      done.textContent=\`已完成 \${task.actualMinutes??task.plannedMinutes} 分鐘\`;
      actions.append(done);
    } else if(task.status==='skipped'){
      const skipped=document.createElement('span');
      skipped.className='badge';
      skipped.textContent='今天已略過';
      actions.append(skipped);
    } else {
      if(task.status!=='active'){
        const start=document.createElement('button');
        start.type='button';
        start.className='button button--secondary';
        start.textContent='開始';
        start.addEventListener('click',()=>context.startDailyTask(task.id));
        actions.append(start);
      }
      const minutes=document.createElement('input');
      minutes.type='number';
      minutes.min='0';
      minutes.max='300';
      minutes.value=String(task.plannedMinutes??0);
      minutes.setAttribute('aria-label','實際完成分鐘');
      minutes.className='minutes-input';

      const complete=document.createElement('button');
      complete.type='button';
      complete.className='button';
      complete.textContent='完成';
      complete.addEventListener('click',()=>{
        const updated=context.completeTask(task,Number(minutes.value),new Date().toISOString());
        allTasks=allTasks.map(row=>row.id===task.id?updated:row);
        context.storage.set('dailyTasks',allTasks);
        context.refresh();
      });

      const skip=document.createElement('button');
      skip.type='button';
      skip.className='button button--secondary';
      skip.textContent='略過';
      skip.addEventListener('click',()=>context.skipDailyTask(task.id,'今天略過'));
      actions.append(minutes,complete,skip);
    }

    item.append(actions);
    list.append(item);
  }

  root.append(list);
  return root;
}
