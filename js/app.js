import { createRouter, startRouter } from './router.js';

const app = document.querySelector('#app');

function page(title, description) {
  return `
    <section class="page-shell" aria-labelledby="page-title">
      <p class="eyebrow">JHSEE Study Planner</p>
      <h1 id="page-title">${title}</h1>
      <p>${description}</p>
    </section>
  `;
}

const router = createRouter({
  '#/': () => page('會考讀書規劃', '建立每天可執行的讀書計畫，逐步追蹤弱點與進步。'),
  '#/today': () => page('今日學習', '今日任務功能將在後續 Task 完成。')
});

startRouter(router, html => {
  app.innerHTML = html;
});
