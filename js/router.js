export function createRouter(routes) {
  if (!routes || typeof routes['#/'] !== 'function') {
    throw new Error('home route is required');
  }

  return {
    resolve(hash) {
      return routes[hash] ?? routes['#/'];
    }
  };
}

export function startRouter(router, render) {
  const run = () => render(router.resolve(window.location.hash || '#/')());
  window.addEventListener('hashchange', run);
  run();
  return () => window.removeEventListener('hashchange', run);
}
