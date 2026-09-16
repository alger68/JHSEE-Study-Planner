export function renderTodayPage(context) {
  const root = document.createElement('section');
  root.className = 'page-stack';
  root.innerHTML = '<header><p class="eyebrow">今日學習</p><h1>今天的任務</h1></header>';
  const today = context.today();
  let allTasks = context.storage.get('dailyTasks', []);
  let tasks = allTasks.filter(task => task.date === today);

  if (!tasks.length) {
    const older = allTasks.filter(task => task.date < today);
    const carry = context.rescheduleUnfinished(older, today);
    const result = context.generateTodayPlan();
    tasks = result.tasks;

    for (const retry of carry) {
      if (retry.type === 'review-due') {
        const current = tasks.find(task => task.type === 'review-due');
        if (current) current.rescheduledFrom = retry.rescheduledFrom;
      } else if (retry.type === 'weakness-drill') {
        const current = tasks.find(task => task.type === 'weakness-drill' && task.subject === retry.subject);
        if (current) {
          current.rescheduledFrom = retry.rescheduledFrom;
          current.note = `${current.note}（前次未完成，已重新排程）`;
        }
      }
    }

    const carriedIds = new Set(tasks.map(task => task.rescheduledFrom).filter(Boolean));
    allTasks = allTasks.map(task => carriedIds.has(task.id) ? { ...task, status:'rescheduled', rescheduledTo:today } : task);
    allTasks = [...allTasks.filter(task => task.date !== today), ...tasks];
    context.storage.set('dailyTasks', allTasks);
  }

  const list = document.createElement('div');
  list.className = 'task-list';
  if (!tasks.length) list.innerHTML = '<div class="card empty-state">目前沒有可安排的任務。</div>';

  for (const task of tasks) {
    const item = document.createElement('article');
    item.className = `card task-card ${task.status === 'completed' ? 'is-complete' : ''}`;
    const title = document.createElement('h2');
    title.textContent = `${task.subject ?? '綜合'} · ${task.type}`;
    const meta = document.createElement('p');
    meta.textContent = `${task.plannedMinutes} 分鐘${task.topic ? ` · ${task.topic}` : ''}`;
    const note = document.createElement('p');
    note.textContent = task.note || '';
    const actions = document.createElement('div');
    actions.className = 'button-row';

    if (task.status !== 'completed') {
      const minutes = document.createElement('input');
      minutes.type = 'number';
      minutes.min = '0';
      minutes.max = '300';
      minutes.value = String(task.plannedMinutes ?? 0);
      minutes.setAttribute('aria-label', '實際完成分鐘');
      minutes.style.maxWidth = '9rem';

      const complete = document.createElement('button');
      complete.type='button';
      complete.className='button';
      complete.textContent='完成';
      const skip = document.createElement('button');
      skip.type='button';
      skip.className='button button--secondary';
      skip.textContent='略過';

      complete.addEventListener('click', () => {
        const updated = context.completeTask(task, Number(minutes.value), new Date().toISOString());
        allTasks = allTasks.map(row => row.id === task.id ? updated : row);
        context.storage.set('dailyTasks', allTasks);
        context.refresh();
      });
      skip.addEventListener('click', () => {
        allTasks = allTasks.map(row => row.id === task.id ? { ...row, status:'skipped' } : row);
        context.storage.set('dailyTasks', allTasks);
        context.refresh();
      });
      actions.append(minutes, complete, skip);
    } else {
      const done = document.createElement('span');
      done.className = 'badge';
      done.textContent = `已完成 ${task.actualMinutes ?? task.plannedMinutes} 分鐘`;
      actions.append(done);
    }

    item.append(title, meta, note, actions);
    list.append(item);
  }
  root.append(list);
  return root;
}
