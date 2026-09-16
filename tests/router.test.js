import { describe, expect, it } from 'vitest';
import { createRouter } from '../js/router.js';

describe('router', () => {
  it('resolves known route', () => {
    const r = createRouter({ '#/': () => 'home', '#/today': () => 'today' });
    expect(r.resolve('#/today')()).toBe('today');
  });

  it('falls back to home', () => {
    const r = createRouter({ '#/': () => 'home' });
    expect(r.resolve('#/missing')()).toBe('home');
  });
});
