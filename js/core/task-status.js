export function summarizeDay(tasks = []) {
  const completed = tasks.filter(task => task.status === 'completed').length;
  const skipped = tasks.filter(task => task.status === 'skipped').length;
  const remainingMinutes = tasks
    .filter(task => ['pending', 'active'].includes(task.status))
    .reduce((sum, task) => sum + (Number(task.plannedMinutes) || 0), 0);
  const nextTask = tasks.find(task => task.status === 'active')
    ?? tasks.find(task => task.status === 'pending')
    ?? null;
  return {
    total: tasks.length,
    completed,
    skipped,
    remainingMinutes,
    completionRate: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
    nextTask
  };
}

export function startTask(tasks = [], id, now = new Date().toISOString()) {
  return tasks.map(task => {
    if (task.id === id) return { ...task, status:'active', startedAt:now };
    if (task.status === 'active') {
      const { startedAt, ...rest } = task;
      return { ...rest, status:'pending' };
    }
    return task;
  });
}

export function skipTask(tasks = [], id, reason = '') {
  return tasks.map(task => task.id === id
    ? { ...task, status:'skipped', ...(reason ? { skipReason:reason } : {}) }
    : task);
}
