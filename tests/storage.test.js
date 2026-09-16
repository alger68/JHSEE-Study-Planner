import { expect, it } from 'vitest';
import { createStorage } from '../js/core/storage.js';

function memoryStorage() {
  const map = new Map();
  return {
    map,
    getItem: key => map.get(key) ?? null,
    setItem: (key, value) => map.set(key, value),
    removeItem: key => map.delete(key)
  };
}

it('writes only planner-prefixed keys', () => {
  const fake = memoryStorage();
  const store = createStorage(fake);
  store.set('settings', { dailyMinutes: 75 });
  expect([...fake.map.keys()]).toEqual(['jhseePlanner.v1.settings']);
});

it('rejects raw foreign keys', () => {
  const store = createStorage(memoryStorage());
  expect(() => store.set('jhsee.v1.settings', {})).toThrow('foreign storage key');
});

it('returns fallback for corrupt JSON', () => {
  const fake = memoryStorage();
  fake.map.set('jhseePlanner.v1.settings', '{bad json');
  const store = createStorage(fake);
  expect(store.get('settings', { dailyMinutes: 75 })).toEqual({ dailyMinutes: 75 });
});

it('returns an error object when storage quota fails', () => {
  const error = new Error('quota');
  const fake = { getItem(){ return null; }, setItem(){ throw error; }, removeItem(){} };
  const result = createStorage(fake).set('settings', { dailyMinutes: 75 });
  expect(result.ok).toBe(false);
  expect(result.error).toBe(error);
});

it('append stores a value in an array key', () => {
  const fake = memoryStorage();
  const store = createStorage(fake);
  store.append('miniChecks', { week:'2026-W38' });
  store.append('miniChecks', { week:'2026-W39' });
  expect(store.get('miniChecks', []).map(x => x.week)).toEqual(['2026-W38','2026-W39']);
});
