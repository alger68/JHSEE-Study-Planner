import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

it('settings page does not interpolate imported settings through innerHTML',()=>{
  const source=readFileSync(resolve(process.cwd(),'js/ui/settings-page.js'),'utf8');
  expect(source.includes('form.innerHTML')).toBe(false);
});
