export function renderAppShell({ product, page, navItems = [], switcherItems = [] }) {
  const shell = document.createElement('div');
  shell.className = 'jh-app-shell';

  const header = document.createElement('header');
  header.className = 'jh-app-header';

  const brand = document.createElement('div');
  brand.className = 'jh-brand-block';
  brand.innerHTML = '<a class="jh-family-brand" href="#/today">JHSEE</a><span class="jh-context">116 會考準備</span><strong class="jh-product-name"></strong>';
  brand.querySelector('.jh-product-name').textContent = product;

  const switcher = document.createElement('nav');
  switcher.className = 'jh-app-switcher';
  switcher.setAttribute('aria-label', '切換 JHSEE 產品');
  for (const [href, label] of switcherItems) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    if (label === product) link.setAttribute('aria-current', 'page');
    switcher.append(link);
  }

  header.append(brand, switcher);

  const content = document.createElement('div');
  content.className = 'jh-page-content';
  content.append(page);

  const nav = document.createElement('nav');
  nav.className = 'jh-bottom-nav app-nav';
  nav.setAttribute('aria-label', '主要導覽');
  for (const [href, label] of navItems) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    nav.append(link);
  }

  shell.append(header, content, nav);
  return shell;
}
