export const SUITE_LINKS = [
  { label:'Study Planner', href:'https://alger68.github.io/JHSEE-Study-Planner/' },
  { label:'All Subjects', href:'https://alger68.github.io/JHSEE-All-Subjects/' },
  { label:'English Adventure', href:'https://alger68.github.io/JHSEE-English-Adventure/' }
];

export const STUDY_PLANNER_NAV = [
  { href:'#/today', label:'今日' },
  { href:'#/progress', label:'進度' },
  { href:'#/review', label:'錯題' },
  { href:'#/more', label:'更多' }
];

function makeLink({ href, label }, className='') {
  const link=document.createElement('a');
  link.href=href;
  link.textContent=label;
  if(className) link.className=className;
  return link;
}

export function renderAppShell({
  product='Study Planner',
  page,
  navItems=STUDY_PLANNER_NAV,
  switcherItems=SUITE_LINKS
} = {}) {
  const shell=document.createElement('div');
  shell.className='jh-app-shell';

  const header=document.createElement('header');
  header.className='jh-app-header';

  const brand=document.createElement('a');
  brand.href='#/today';
  brand.className='jh-brand';
  brand.innerHTML='<span class="jh-brand-mark" aria-hidden="true">J</span><span><strong>JHSEE</strong><small>116 會考準備</small></span>';

  const productName=document.createElement('div');
  productName.className='jh-product-name';
  productName.dataset.productName='';
  productName.textContent=product;

  const switcher=document.createElement('nav');
  switcher.className='jh-app-switcher';
  switcher.dataset.appSwitcher='';
  switcher.setAttribute('aria-label','切換 JHSEE 學習工具');
  for(const item of switcherItems) {
    const link=makeLink(item);
    if(item.label===product) link.setAttribute('aria-current','page');
    switcher.append(link);
  }

  header.append(brand, productName, switcher);

  const body=document.createElement('div');
  body.className='jh-shell-body';
  if(page) body.append(page);

  const nav=document.createElement('nav');
  nav.className='app-nav jh-bottom-nav';
  nav.dataset.primaryNav='';
  nav.setAttribute('aria-label','主要導覽');
  navItems.forEach(item => nav.append(makeLink(item)));

  shell.append(header, body, nav);
  return shell;
}
