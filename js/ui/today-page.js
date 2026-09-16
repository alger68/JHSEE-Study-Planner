export function renderTodayPage(context) {
  const root = document.createElement('section');
  root.className = 'page-stack';
  root.innerHTML = '<header><p class="eyebrow">今日學習</p><h1>今天的任務</h1></header>';
  const today = context.today();
  let allTasks = context.storage.get('dailyTasks', []);
  let tasks = allTasks.filter(task => task.date === today);
  if (!tasks.length) {
    const result = context.generateTodayPlan();
    tasks = result.tasks;
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
    const note = document.createElement('p'); note.textContent = task.note || '';
    const actions = document.createElement('div'); actions.className = 'button-row';
    const complete = document.createElement('button'); complete.type='button'; complete.className='button'; complete.textContent='完成';
    const skip = document.createElement('button'); skip.type='button'; skip.className='button button--secondary'; skip.textContent='略過';
    complete.addEventListener('click', () => {
      task.status = 'completed'; task.completedAt = new Date().toISOString(); task.actualMinutes = task.plannedMinutes;
      context.storage.set('dailyTasks', allTasks); context.refresh();
    });
    skip.addEventListener('click', () => {
      task.status = 'skipped'; context.storage.set('dailyTasks', allTasks); context.refresh();
    });
    actions.append(complete, skip); item.append(title, meta, note, actions); list.append(item);
  }
  root.append(list);
  return root;
}
