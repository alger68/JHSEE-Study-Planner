const DATA_KEYS = ['diagnostics', 'dailyTasks', 'practiceLogs', 'miniChecks'];
const SUBJECTS = ['chinese','english','math','social','science'];
const VALID_GRADES = new Set(['A++','A+','A','B++','B+','B','C']);

export function isBrandNewUser(snapshot = {}) {
  const settings = snapshot.settings ?? {};
  return settings.onboardingCompleted !== true
    && settings.dailyMinutes == null
    && DATA_KEYS.every(key => !Array.isArray(snapshot[key]) || snapshot[key].length === 0);
}

export function needsV11Nudge(snapshot = {}) {
  return !isBrandNewUser(snapshot) && snapshot.settings?.onboardingCompleted !== true;
}

export function parseQuickGrades(input = '') {
  const tokens = String(input)
    .trim()
    .toUpperCase()
    .split(/[\s,，]+/)
    .filter(Boolean);

  if (tokens.length !== SUBJECTS.length) {
    return { ok:false, error:'請依序輸入國文、英語、數學、社會、自然，共 5 個成績。' };
  }
  if (tokens.some(grade => !VALID_GRADES.has(grade))) {
    return { ok:false, error:'成績只能使用 A++、A+、A、B++、B+、B、C。' };
  }

  return {
    ok:true,
    grades:Object.fromEntries(SUBJECTS.map((subject, index) => [subject, tokens[index]]))
  };
}

export function completeOnboarding(settings = {}, patch = {}) {
  return {
    ...settings,
    ...patch,
    onboardingCompleted: true,
    onboardingVersion: '1.1'
  };
}
