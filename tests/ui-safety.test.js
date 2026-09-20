import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('unified UI safety', () => {
  it('settings page does not interpolate imported settings through innerHTML',()=>{
    const source=readFileSync(resolve(process.cwd(),'js/ui/settings-page.js'),'utf8');
    expect(source.includes('form.innerHTML')).toBe(false);
  });

  it('keeps exactly four primary Study Planner nav entries and three suite destinations', () => {
    const source=readFileSync(resolve(process.cwd(),'js/app.js'),'utf8');
    expect(source).toContain("[['#/today','今日'],['#/progress','進度'],['#/review','錯題'],['#/more','更多']]");
    expect(source.match(/https:\/\/alger68\.github\.io\/JHSEE-/g)).toHaveLength(3);
  });

  it('provides reduced motion and long-label overflow safeguards', () => {
    const css=readFileSync(resolve(process.cwd(),'css/components.css'),'utf8');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('overflow-wrap:anywhere');
  });
});
