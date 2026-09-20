import { describe, expect, it } from 'vitest';
import { renderAppShell, SUITE_LINKS } from '../js/ui/app-shell.js';

describe('unified app shell', () => {
  it('renders the product, exactly four primary nav links, and all suite destinations', () => {
    const page = document.createElement('section');
    page.textContent = 'content';
    const shell = renderAppShell({
      product:'Study Planner',
      page,
      navItems:[
        { href:'#/today', label:'今日' },
        { href:'#/progress', label:'進度' },
        { href:'#/review', label:'錯題' },
        { href:'#/more', label:'更多' }
      ],
      switcherItems:SUITE_LINKS
    });

    expect(shell.querySelector('[data-product-name]')?.textContent).toBe('Study Planner');
    expect(shell.querySelectorAll('[data-primary-nav] a')).toHaveLength(4);
    expect([...shell.querySelectorAll('[data-app-switcher] a')].map(a => a.textContent)).toEqual([
      'Study Planner','All Subjects','English Adventure'
    ]);
    expect([...shell.querySelectorAll('[data-app-switcher] a')].map(a => a.href)).toEqual([
      'https://alger68.github.io/JHSEE-Study-Planner/',
      'https://alger68.github.io/JHSEE-All-Subjects/',
      'https://alger68.github.io/JHSEE-English-Adventure/'
    ]);
  });

  it('does not depend on browser storage', () => {
    expect(renderAppShell.toString()).not.toMatch(/localStorage|sessionStorage|\.storage\b/);
  });
});
