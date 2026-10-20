(() => {
  if (typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) return;
  document.querySelectorAll('article.prose img').forEach(image => {
    if (image.closest('a')) return;
    const link = document.createElement('a');
    link.href = image.dataset.full || image.src;
    image.replaceWith(link);
    link.append(image);
  });
  const galleries = [...document.querySelectorAll('.phone-gallery,article.prose')].filter(gallery => gallery.querySelector('a img'));
  if (!galleries.length) return;

  const viewer = document.createElement('dialog');
  viewer.id = 'image-viewer';
  viewer.className = 'image-viewer';
  viewer.setAttribute('aria-label', 'Project screenshot viewer');
  viewer.innerHTML = `
    <button class="viewer-close" type="button" aria-label="Close image viewer" autofocus>×</button>
    <button class="viewer-prev" type="button" aria-label="Previous image">←</button>
    <figure class="viewer-stage"><img alt=""><figcaption aria-live="polite"></figcaption></figure>
    <button class="viewer-next" type="button" aria-label="Next image">→</button>`;
  document.body.append(viewer);

  const image = viewer.querySelector('img');
  const caption = viewer.querySelector('figcaption');
  const stage = viewer.querySelector('figure');
  let links = [];
  let current = 0;
  let opener;
  let swipe;
  let scrollPosition = 0;

  image.addEventListener('load', () => {
    if (!viewer.open || navigator.connection?.saveData || /2g/.test(navigator.connection?.effectiveType || '')) return;
    if (links.length > 1) [-1, 1].forEach(step => {
      const preload = new Image();
      preload.src = links[(current + step + links.length) % links.length].href;
    });
  });

  function show(index) {
    current = (index + links.length) % links.length;
    const thumbnail = links[current].querySelector('img');
    image.src = links[current].href;
    image.alt = thumbnail.alt;
    const description = links[current].closest('figure')?.querySelector('figcaption')?.textContent || thumbnail.alt;
    caption.textContent = `${current + 1} / ${links.length} · ${description}`;
  }

  galleries.forEach(gallery => {
    const items = [...gallery.querySelectorAll('a')].filter(link => link.querySelector('img'));
    items.forEach(link => {
      link.setAttribute('aria-haspopup', 'dialog');
      link.setAttribute('aria-controls', viewer.id);
      link.addEventListener('click', event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        links = items;
        opener = link;
        show(items.indexOf(link));
        viewer.querySelectorAll('.viewer-prev,.viewer-next').forEach(button => button.disabled = items.length < 2);
        scrollPosition = window.scrollY;
        document.documentElement.style.setProperty('--viewer-scroll', `-${scrollPosition}px`);
        document.documentElement.classList.add('viewer-open');
        viewer.showModal();
      });
    });
  });

  viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
  viewer.querySelector('.viewer-prev').addEventListener('click', () => show(current - 1));
  viewer.querySelector('.viewer-next').addEventListener('click', () => show(current + 1));
  viewer.addEventListener('keydown', event => {
    if (event.key === 'Tab') {
      const buttons = [...viewer.querySelectorAll('button:not(:disabled)')];
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
      return;
    }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    show(current + (event.key === 'ArrowRight' ? 1 : -1));
  });
  viewer.addEventListener('close', () => {
    swipe = null;
    document.documentElement.classList.remove('viewer-open');
    document.documentElement.style.removeProperty('--viewer-scroll');
    window.scrollTo({ top: scrollPosition, behavior: 'instant' });
    opener?.focus({ preventScroll: true });
  });

  stage.addEventListener('pointerdown', event => {
    swipe = event.isPrimary && event.pointerType !== 'mouse'
      ? { id: event.pointerId, x: event.clientX, y: event.clientY } : null;
  });
  stage.addEventListener('pointerup', event => {
    if (!swipe || event.pointerId !== swipe.id) return;
    const dx = event.clientX - swipe.x;
    const dy = event.clientY - swipe.y;
    swipe = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) show(current + (dx < 0 ? 1 : -1));
  });
  stage.addEventListener('pointercancel', () => swipe = null);
})();
