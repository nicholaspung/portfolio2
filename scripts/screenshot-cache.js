// Included only in the published build, never in the local authoring server.
(() => {
  if (!('serviceWorker' in navigator)) return;
  const ready = navigator.serviceWorker.ready;
  function remember(image) {
    if (!image.currentSrc?.includes('/assets/screenshots/')) return;
    ready.then(registration => registration.active?.postMessage({ type: 'SAVE_SCREENSHOTS', urls: [image.currentSrc] })).catch(() => {});
  }
  document.addEventListener('load', event => {
    if (event.target instanceof HTMLImageElement) remember(event.target);
  }, true);
  navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then(() => {
    // The first page can finish image requests before its worker takes control.
    // Save those already-viewed images too, using the browser's HTTP cache.
    ready.then(registration => {
      const urls = [...document.images].filter(image => image.complete && image.naturalWidth).map(image => image.currentSrc);
      registration.active?.postMessage({ type: 'SAVE_SCREENSHOTS', urls });
    }).catch(() => {});
  }).catch(() => {});
})();
