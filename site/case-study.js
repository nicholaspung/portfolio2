(() => {
  const body = document.querySelector('article.prose .content-section');
  if (!body) return;
  const article = body.closest('article');
  const project = article.dataset.showcase || 'Data Desktop';
  const item = article.dataset.showcaseItem || 'app';
  const result = [...body.querySelectorAll('h2')].find(heading => heading.textContent.trim() === 'The result');
  if (!result) return;
  const content = [];
  for (let node = result.nextElementSibling; node && node.tagName !== 'H2'; node = node.nextElementSibling) content.push(node);
  const firstApp = content.findIndex(node => node.tagName === 'H3');
  if (firstApp < 0) return;

  const showcase = document.createElement('section');
  showcase.className = 'app-showcase' + (item === 'feature' ? ' app-showcase-portrait' : '');
  showcase.setAttribute('data-section-nav-exclude', '');
  showcase.setAttribute('aria-label', `Explore the ${project} ${item}s`);
  const toolbar = document.createElement('div');
  toolbar.className = 'app-toolbar';
  const track = document.createElement('div');
  track.id = 'case-study-showcase';
  track.className = 'app-track';
  track.tabIndex = 0;
  track.setAttribute('role', 'region');
  track.setAttribute('aria-label', `${project} ${item}s`);
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
  const walkthroughs = article.querySelector('[aria-labelledby="onboarding-walkthroughs"]');
  if (walkthroughs) {
    walkthroughs.classList.remove('content-section');
    showcase.after(walkthroughs);
  }
  function enhance(gallery, item) {
    const track = gallery.querySelector('.app-track');
    const cards = [...track.children];
    const toolbar = gallery.querySelector('.app-toolbar');
    const action = item === 'walkthrough' ? 'Select a video to play or pause' : 'Select a screenshot to enlarge';
    toolbar.innerHTML = `<p>Swipe or scroll to explore the ${item}s · ${action}</p><div class="app-navigation"><span aria-live="polite"></span><button type="button" aria-label="Previous ${item}" aria-controls="${track.id}">←</button><button type="button" aria-label="Next ${item}" aria-controls="${track.id}">→</button></div>`;
    const [previous, next] = toolbar.querySelectorAll('button');
    const status = toolbar.querySelector('span');
    let pending = false;
    function update() {
      pending = false;
      const bounds = track.getBoundingClientRect();
      const visible = cards.map(panel => {
        const rect = panel.getBoundingClientRect();
        return Math.max(0, Math.min(bounds.right, rect.right) - Math.max(bounds.left, rect.left));
      });
      const index = visible.indexOf(Math.max(...visible));
      cards.forEach((panel, i) => panel.dataset.active = String(i === index));
      previous.disabled = track.scrollLeft <= 1;
      next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
      const first = visible.findIndex(width => width > 1) + 1;
      const last = visible.findLastIndex(width => width > 1) + 1;
      status.textContent = `${first === last ? first : `${first}–${last}`} / ${cards.length}`;
    }
    function schedule() {
      if (!pending) { pending = true; requestAnimationFrame(update); }
    }
    function move(direction) {
      const step = cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
      track.scrollBy({ left: direction * step, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }
    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    track.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
  }
  enhance(showcase, item);
  if (walkthroughs) enhance(walkthroughs.querySelector('.app-showcase'), 'walkthrough');
})();
