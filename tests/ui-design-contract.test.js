import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('JHSEE design contract', () => {
  const tokens = readFileSync('css/design-tokens.css', 'utf8');
  const html = readFileSync('index.html', 'utf8');

  it('loads canonical tokens before product styles', () => {
    expect(html.indexOf('design-tokens.css')).toBeGreaterThan(-1);
    expect(html.indexOf('design-tokens.css')).toBeLessThan(html.indexOf('base.css'));
  });

  it('defines Study Planner product tokens', () => {
    expect(tokens).toContain('--jh-primary: #4F46E5');
    expect(tokens).toContain('--jh-radius-card: 18px');
    expect(tokens).toContain('--jh-space-4: 16px');
  });
});
