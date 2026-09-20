import { describe, expect, it } from 'vitest';
import { renderAppShell } from '../js/ui/app-shell.js';

describe('unified app shell', () => {
  it('renders Study Planner identity, four nav entries, and three app destinations', () => {
    const page = document.createElement('section');
    page.textContent = 'content';

    const shell = renderAppShell({
      product: 'Study Planner',
      page,
      navItems: [
        ['#/today','今日'],
        ['#/progress','進度'],
        ['#/review','錯題'],
        ['#/more','更多']
      ],
      switcherItems: [
        ['https://alger68.github.io/JHSEE-Study-Planner/','Study Planner'],
        ['https://alger68.github.io/JHSEE-All-Subjects/','All Subjects'],
        ['https://alger68.github.io/JHSEE-English-Adventure/','English Adventure']
      ]
    });

    expect(shell.querySelector('.jh-product-name')?.textContent).toBe('Study Planner');
    expect([...shell.querySelectorAll('.jh-bottom-nav a')].map(a => a.textContent)).toEqual(['今日','進度','錯題','更多']);
    expect(shell.querySelectorAll('.jh-app-switcher a')).toHaveLength(3);
    expect(shell.textContent).toContain('116 會考準備');
  });
});
