const DATA_KEYS = ['diagnostics', 'dailyTasks', 'practiceLogs', 'miniChecks'];
const SUBJECT_ORDER = ['chinese','english','math','social','science'];
const VALID_GRADES = new Set(['A++','A+','A','B++','B+','B','C']);

export function parseQuickGrades(input = '') {
  const tokens = String(input).trim().toUpperCase().split(/[\s,，]+/).filter(Boolean);
  if (tokens.length !== 5) return { ok:false, error:'請依序輸入五科成績：國文、英語、數學、社會、自然。' };
  if (tokens.some(token => !VALID_GRADES.has(token))) return { ok:false, error:'成績只接受 A++、A+、A、B++、B+、B、C。' };
  return { ok:true, grades:Object.fromEntries(SUBJECT_ORDER.map((subject, index) => [subject, tokens[index]])) };
}

export function isBrandNewUser(snapshot = {}) {
  const settings = snapshot.settings ?? {};
  return settings.onboardingCompleted !== true
    && settings.dailyMinutes == null
    && DATA_KEYS.every(key => !Array.isArray(snapshot[key]) || snapshot[key].length === 0);
}

export function needsV11Nudge(snapshot = {}) {
  return !isBrandNewUser(snapshot) && snapshot.settings?.onboardingCompleted !== true;
}

export function completeOnboarding(settings = {}, patch = {}) {
  return { ...settings, ...patch, onboardingCompleted:true, onboardingVersion:'1.1' };
}
