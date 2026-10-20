(() => {
  const nav = document.querySelector('.section-nav');
  if (!nav) return;
  const article = nav.hasAttribute('data-article');
  if (article) {
    const links = nav.querySelector('.section-nav-links');
    document.querySelectorAll('main article.prose h2,main article.prose h3').forEach(heading => {
      if (!heading.textContent.trim()) return;
      if (!heading.id) {
        const base = 'section-' + (heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'heading');
        let id = base;
        let suffix = 2;
        while (document.getElementById(id)) id = `${base}-${suffix++}`;
        heading.id = id;
      }
      heading.tabIndex = -1;
      if (heading.closest('[data-section-nav-exclude]')) return;
      const link = document.createElement('a');
      link.setAttribute('href', '#' + encodeURIComponent(heading.id));
      link.title = heading.textContent.trim();
      if (heading.tagName === 'H3') link.className = 'section-nav-subsection';
      const label = document.createElement('span');
      label.textContent = heading.textContent.trim();
      link.append(label);
      links.append(link);
    });
  }
  const toggle = nav.querySelector('button');
  const entries = [...nav.querySelectorAll('a')].map(link => ({ link, target: document.getElementById(decodeURIComponent(link.hash.slice(1))) })).filter(entry => entry.target);
  if (!entries.length) {
    nav.hidden = true;
    return;
  }
  nav.hidden = false;
  let current = entries.find(entry => entry.link.hash === location.hash) || entries[0];
  let preferred = current;
  let pending = false;

  function expand(open) {
    nav.dataset.expanded = String(open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  function select(entry) {
    current = entry;
    entries.forEach(item => {
      if (item === entry) item.link.setAttribute('aria-current', 'location');
      else item.link.removeAttribute('aria-current');
    });
  }

  function update() {
    pending = false;
    const passed = entries.filter(entry => entry.target.getBoundingClientRect().top <= innerHeight * .3);
    const last = passed.at(-1) || entries[0];
    // Two project cards can share a row. Keep the selected card while that row is current.
    const sameRow = Math.abs(preferred.target.getBoundingClientRect().top - last.target.getBoundingClientRect().top) < 2;
    select(sameRow ? preferred : last);
  }

  nav.dataset.enhanced = '';
  toggle.hidden = false;
  select(current);
  update();
  toggle.addEventListener('click', () => expand(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      expand(false);
      if (toggle.getClientRects().length) toggle.focus();
      else current.target.focus({ preventScroll: true });
    }
  });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target)) expand(false);
  });
  nav.addEventListener('focusout', event => {
    if (!nav.contains(event.relatedTarget)) expand(false);
  });
  entries.forEach(entry => entry.link.addEventListener('click', event => {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    preferred = entry;
    select(entry);
    expand(false);
    entry.target.focus({ preventScroll: true });
  }));
  function schedule() {
    if (!pending) {
      pending = true;
      requestAnimationFrame(update);
    }
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
})();
