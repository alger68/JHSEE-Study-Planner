import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

it('settings page does not interpolate imported settings through innerHTML',()=>{
  const source=readFileSync(new URL('../js/ui/settings-page.js',import.meta.url),'utf8');
  expect(source.includes('form.innerHTML')).toBe(false);
});
