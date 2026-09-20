import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { renderOnboardingPage } from '../js/ui/onboarding-page.js';
import { renderMorePage } from '../js/ui/more-page.js';

describe('final unified UI regressions', () => {
  it('does not prefill a fake diagnostic grade sequence', () => {
    const page = renderOnboardingPage({
      today: () => '2026-09-21',
      finishOnboarding: () => ({ ok:true })
    });
    expect(page.querySelector('input[aria-label="五科模考成績"]')?.value).toBe('');
  });

  it('keeps all three suite destinations reachable from More on mobile', () => {
    const page = renderMorePage();
    const external = [...page.querySelectorAll('a[href^="https://alger68.github.io/JHSEE-"]')];
    expect(external).toHaveLength(3);
  });

  it('keeps app switcher touch targets at least 44px high', () => {
    const css = readFileSync('css/components.css','utf8');
    expect(css).toMatch(/\.jh-app-switcher a\s*\{[^}]*min-height:44px/s);
  });
});
