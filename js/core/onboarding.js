const DATA_KEYS = ['diagnostics', 'dailyTasks', 'practiceLogs', 'miniChecks'];

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
  return {
    ...settings,
    ...patch,
    onboardingCompleted: true,
    onboardingVersion: '1.1'
  };
}
