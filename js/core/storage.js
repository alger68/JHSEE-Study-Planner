const PREFIX = 'jhseePlanner.v1.';
const ALLOWED_KEYS = [
  'profile', 'diagnostics', 'settings', 'dailyTasks', 'practiceLogs',
  'reviewSchedule', 'miniChecks', 'mastery', 'ui'
];

export function createStorage(storage = window.localStorage) {
  const fullKey = key => {
    if (typeof key !== 'string' || !key) throw new Error('storage key is required');
    if (key.includes('.') && !key.startsWith(PREFIX)) throw new Error('foreign storage key');
    return key.startsWith(PREFIX) ? key : `${PREFIX}${key}`;
  };

  const api = {
    get(key, fallback = null) {
      try {
        const raw = storage.getItem(fullKey(key));
        return raw == null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      const target = fullKey(key);
      try {
        storage.setItem(target, JSON.stringify(value));
        return { ok: true };
      } catch (error) {
        return { ok: false, error };
      }
    },
    append(key, value) {
      const current = api.get(key, []);
      if (!Array.isArray(current)) return { ok: false, error: new Error('storage value is not an array') };
      return api.set(key, [...current, value]);
    },
    remove(key) {
      storage.removeItem(fullKey(key));
    },
    keys() {
      return ALLOWED_KEYS.map(fullKey);
    }
  };
  return api;
}
