(() => {
  const root = document.documentElement;
  const key = 'portfolio-appearance';
  const modes = ['light', 'dark', 'system'];
  const palettes = ['sage', 'ocean', 'lavender', 'rose', 'sand'];
  let controls;

  function read() {
    let saved;
    try { saved = localStorage.getItem(key); }
    catch { return {}; }
    try { return JSON.parse(saved) || {}; }
    catch { return {}; }
  }

  function apply(value) {
    root.dataset.mode = modes.includes(value.mode) ? value.mode : 'system';
    root.dataset.palette = palettes.includes(value.palette) ? value.palette : 'sage';
    controls?.querySelectorAll('button').forEach(button => {
      button.setAttribute('aria-pressed', String(button.value === root.dataset[button.name]));
    });
  }

  // Run before the stylesheet so returning visitors see their saved colors immediately.
  apply(read());

  document.addEventListener('DOMContentLoaded', () => {
    const footer = document.querySelector('.site-footer');
    if (!footer) return;
    controls = document.createElement('div');
    controls.className = 'theme-settings';
    const icons = {
      light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
      dark: '<path d="M20.5 13A9 9 0 0 1 11 3.5 9 9 0 1 0 20.5 13Z"/>',
      system: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M12 17v4m-4 0h8"/>'
    };
    const group = (name, title, values) => `<div class="theme-options" role="group" aria-label="${title}">${values.map(value => {
      const label = value[0].toUpperCase() + value.slice(1) + (name === 'mode' ? ' mode' : ' theme');
      const icon = name === 'mode' ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[value]}</svg>` : `<span class="theme-swatch" data-palette="${value}" aria-hidden="true"></span>`;
      return `<button type="button" name="${name}" value="${value}" aria-label="${label}" title="${label}">${icon}</button>`;
    }).join('')}</div>`;
    controls.innerHTML = group('mode', 'Appearance', modes) + group('palette', 'Color', palettes) + '<span class="theme-status" role="status"></span>';
    const status = controls.querySelector('.theme-status');
    footer.append(controls);
    apply(root.dataset);
    controls.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button || !controls.contains(button)) return;
      apply({ ...root.dataset, [button.name]: button.value });
      try {
        localStorage.setItem(key, JSON.stringify({ mode: root.dataset.mode, palette: root.dataset.palette }));
        status.textContent = '';
      } catch {
        status.textContent = 'Applied for this page. Browser storage is unavailable.';
      }
    });
  });

  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) apply(read());
  });
})();
