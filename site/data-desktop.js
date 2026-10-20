(() => {
  const body = document.querySelector('article.prose .content-section');
  const result = [...body.querySelectorAll('h2')].find(heading => heading.textContent.trim() === 'The result');
  if (!result) return;
  const content = [];
  for (let node = result.nextElementSibling; node && node.tagName !== 'H2'; node = node.nextElementSibling) content.push(node);
  const firstApp = content.findIndex(node => node.tagName === 'H3');
  if (firstApp < 0) return;

  const showcase = document.createElement('section');
  showcase.className = 'app-showcase';
  showcase.setAttribute('data-section-nav-exclude', '');
  showcase.setAttribute('aria-label', 'Explore the Data Desktop apps');
  const toolbar = document.createElement('div');
  toolbar.className = 'app-toolbar';
  toolbar.innerHTML = '<p>Swipe or scroll to explore the apps · Select a screenshot to enlarge</p><div class="app-navigation"><span aria-live="polite"></span><button type="button" aria-label="Previous app" aria-controls="data-desktop-apps">←</button><button type="button" aria-label="Next app" aria-controls="data-desktop-apps">→</button></div>';
  const track = document.createElement('div');
  track.id = 'data-desktop-apps';
  track.className = 'app-track';
  track.tabIndex = 0;
  track.setAttribute('role', 'region');
  track.setAttribute('aria-label', 'Data Desktop apps');
  showcase.append(toolbar, track);

  function card(heading) {
    const panel = document.createElement('div');
    panel.className = 'app-card';
    panel.append(heading);
    track.append(panel);
    return panel;
  }

  const dashboards = content.slice(0, firstApp).filter(node => node.tagName === 'FIGURE');
  if (dashboards.length) {
    const heading = document.createElement('h3');
    heading.textContent = 'Dashboard';
    card(heading).append(...dashboards);
  }
  content[firstApp].before(showcase);
  let panel;
  content.slice(firstApp).forEach(node => {
    if (node.tagName === 'H3') panel = card(node);
    else panel.append(node);
  });
  const cards = [...track.children];
  cards.forEach(panel => {
    const figures = [...panel.querySelectorAll('figure')];
    if (!figures.length) return;
    const images = document.createElement('div');
    images.className = 'app-images';
    images.append(...figures);
    panel.append(images);
  });
  const [previous, next] = toolbar.querySelectorAll('button');
  const status = toolbar.querySelector('span');
  let current = -1;
  let pending = false;
  function update() {
    pending = false;
    const bounds = track.getBoundingClientRect();
    const visible = cards.map(panel => {
      const rect = panel.getBoundingClientRect();
      return Math.max(0, Math.min(bounds.right, rect.right) - Math.max(bounds.left, rect.left));
    });
    const index = visible.indexOf(Math.max(...visible));
    if (index === current) return;
    current = index;
    cards.forEach((panel, i) => panel.dataset.active = String(i === index));
    previous.disabled = index === 0;
    next.disabled = index === cards.length - 1;
    status.textContent = `${index + 1} / ${cards.length}`;
  }
  function schedule() {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  }
  function move(direction) {
    const index = Math.max(0, Math.min(cards.length - 1, current + direction));
    track.scrollTo({ left: cards[index].offsetLeft, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
})();
