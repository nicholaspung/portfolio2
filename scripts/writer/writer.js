(() => {
  const $ = id => document.getElementById(id);
  const body = $('body');
  const dialog = $('insert-dialog');
  let config, current, savedSnapshot, template, selectedRange, insertMode;
  let dirty = false, busy = true, storageWorks = true, updateTimer;
  const key = slug => `portfolio:writer:v1:${slug}`;
  const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  const validLink = href => /^(https?:\/\/|mailto:|\/(?!\/)|#)[^\s<>"`]*$/i.test(href);
  const controls = [...document.querySelectorAll('.writing-pane input, .writing-pane textarea, .writing-pane select, .writing-pane button')];
  function available(yes) {
    controls.forEach(control => { control.disabled = !yes; });
    body.contentEditable = String(yes);
    $('save').disabled = !yes || !dirty;
  }
  function feedback(message, error = false) {
    $('feedback').textContent = message;
    $('feedback').classList.toggle('error', error);
  }
  async function request(path, options) {
    const response = await fetch(path, { cache: 'no-store', ...options });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Unable to contact the local server.');
    return data;
  }
  // Serialize a deliberately small set of semantic HTML. Pasted text never brings styles or scripts.
  function clean(node) {
    if (node.nodeType === Node.TEXT_NODE) return escape(node.data);
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    let tag = node.localName;
    if (['script', 'style', 'iframe', 'object', 'embed'].includes(tag)) return '';
    if (tag === 'b') tag = 'strong';
    if (tag === 'i') tag = 'em';
    const inner = [...node.childNodes].map(clean).join('');
    if (tag === 'div') return node.querySelector('p,h2,h3,ul,ol,blockquote,pre,figure,div') ? inner : `<p>${inner || '<br>'}</p>`;
    if (tag === 'a') {
      const href = node.getAttribute('href') || '';
      return validLink(href) ? `<a href="${escape(href)}">${inner}</a>` : inner;
    }
    if (tag === 'img') {
      const src = node.getAttribute('src');
      if (!config.images.includes(src)) return '';
      return `<img src="${escape(src)}" alt="${escape(node.alt)}" width="${Number(node.getAttribute('width')) || node.naturalWidth}" height="${Number(node.getAttribute('height')) || node.naturalHeight}" loading="lazy">`;
    }
    if (['br', 'hr'].includes(tag)) return `<${tag}>`;
    if (['p', 'h2', 'h3', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'figure', 'figcaption'].includes(tag)) return `<${tag}>${inner}</${tag}>`;
    return inner;
  }
  function values() {
    return { title: $('title').value, summary: $('summary').value, comingSoon: $('coming-soon').checked, body: [...body.childNodes].map(clean).join('').trim() };
  }
  const snapshot = data => JSON.stringify([data.title, data.summary, data.comingSoon, data.body]);
  function localDraft() {
    try { return JSON.parse(localStorage.getItem(key(current.slug))); } catch { storageWorks = false; return null; }
  }
  function forgetDraft() {
    try { localStorage.removeItem(key(current.slug)); } catch { storageWorks = false; }
  }
  function persist() {
    if (!current || busy || !$('recovery').hidden) return;
    try {
      if (dirty) localStorage.setItem(key(current.slug), JSON.stringify({ ...values(), revision: current.revision, savedAt: new Date().toISOString() }));
      else forgetDraft();
    } catch { storageWorks = false; }
  }
  function render() {
    if (!template) return;
    const data = values();
    const page = new DOMParser().parseFromString(template, 'text/html');
    page.querySelector('.local-tools')?.remove();
    page.querySelector('h1').textContent = data.title;
    const article = page.querySelector('article.prose');
    const header = article.querySelector('header');
    const status = header.querySelector('.meta');
    if (status) status.remove();
    if (data.comingSoon) { const p = page.createElement('p'); p.className = 'meta'; p.textContent = 'Case study coming soon'; header.append(p); }
    // Replace only the marked body; retain the real navigation, footer and project links.
    const walker = page.createTreeWalker(article, NodeFilter.SHOW_COMMENT);
    let start, end;
    while (walker.nextNode()) {
      if (walker.currentNode.data.trim() === 'case-study:body') start = walker.currentNode;
      if (walker.currentNode.data.trim() === '/case-study:body') end = walker.currentNode;
    }
    const range = page.createRange();
    range.setStartAfter(start); range.setEndBefore(end); range.deleteContents();
    range.insertNode(range.createContextualFragment(data.body));
    page.querySelectorAll('a').forEach(link => { link.removeAttribute('href'); link.removeAttribute('target'); });
    page.querySelectorAll('script').forEach(script => script.remove());
    const frame = $('preview');
    const existing = frame.contentDocument?.querySelector('article.prose');
    if (existing) existing.replaceWith(frame.contentDocument.importNode(article, true));
    else frame.srcdoc = '<!doctype html>\n' + page.documentElement.outerHTML;
  }
  function changed() {
    if (!current || busy) return;
    dirty = snapshot(values()) !== savedSnapshot;
    $('state').textContent = dirty ? 'Unsaved changes' : 'Saved version';
    $('save').disabled = !dirty;
    clearTimeout(updateTimer);
    // Store immediately so switching projects or closing the tab cannot lose the last keystroke.
    persist();
    if (!storageWorks) feedback('Browser draft storage is unavailable. Keep this tab open and use Save to website.', true);
    updateTimer = setTimeout(render, 200);
  }
  function fill(data) {
    $('title').value = data.title;
    $('summary').value = data.summary;
    $('coming-soon').checked = data.comingSoon;
    body.innerHTML = data.body;
  }
  async function loadProject(slug) {
    busy = true; available(false); $('project').disabled = true; $('state').textContent = 'Loading…';
    $('recovery').hidden = true;
    try {
      const [data, html] = await Promise.all([
        request(`/write/api/${slug}`),
        fetch(`/blog/${slug}/`, { cache: 'no-store' }).then(response => { if (!response.ok) throw new Error('Unable to load the preview page.'); return response.text(); }),
      ]);
      current = data; template = html; selectedRange = null;
      fill(data); savedSnapshot = snapshot(values()); dirty = false;
      $('open-page').href = `/blog/${slug}/`;
      $('file-location').textContent = `Article: site/blog/${slug}/index.html`;
      const draft = localDraft();
      const usableDraft = draft && typeof draft.title === 'string' && typeof draft.summary === 'string' && typeof draft.body === 'string' && typeof draft.comingSoon === 'boolean';
      if (usableDraft && snapshot(draft) !== savedSnapshot) {
        $('recovery-text').textContent = draft.revision === data.revision ? 'You have an unfinished browser draft for this project.' : 'A browser draft is available, but the saved file has changed since it was written. You can restore the draft for review.';
        $('recovery').hidden = false;
        $('state').textContent = 'Draft available';
      } else {
        forgetDraft(); $('state').textContent = 'Saved version'; available(true);
      }
      render();
      feedback('Changes stay in this browser until you choose Save to website. Saving does not publish.');
    } catch (error) { feedback(error.message, true); }
    finally { busy = false; $('project').disabled = false; }
  }
  $('restore').addEventListener('click', () => {
    const draft = localDraft();
    if (!draft) return;
    fill(draft); $('recovery').hidden = true; available(true); changed();
    feedback('Draft restored. Review the preview, then save when you’re ready.');
  });
  $('discard').addEventListener('click', () => {
    forgetDraft(); $('recovery').hidden = true; available(true); changed();
    feedback('Showing the saved file.');
  });
  $('project').addEventListener('change', () => { persist(); loadProject($('project').value); });
  [$('title'), $('summary'), $('coming-soon'), body].forEach(control => control.addEventListener('input', changed));
  document.addEventListener('selectionchange', () => {
    const selection = getSelection();
    if (selection.rangeCount && body.contains(selection.anchorNode) && body.contains(selection.focusNode)) selectedRange = selection.getRangeAt(0).cloneRange();
  });
  function restoreSelection() {
    body.focus();
    const selection = getSelection(); selection.removeAllRanges();
    if (selectedRange && body.contains(selectedRange.commonAncestorContainer)) selection.addRange(selectedRange);
    else { const range = document.createRange(); range.selectNodeContents(body); range.collapse(false); selection.addRange(range); }
  }
  function command(name, value = null) {
    restoreSelection();
    // The browser’s native editing commands preserve normal text undo/redo without a library.
    document.execCommand(name, false, value);
    changed();
  }
  function insertBlocks(html) {
    restoreSelection();
    const selection = getSelection();
    const range = selection.getRangeAt(0);
    let block = range.endContainer;
    while (block !== body && block.parentNode !== body) block = block.parentNode;
    const insertion = document.createRange();
    if (block === body) insertion.setStart(body, range.endOffset);
    else insertion.setStartAfter(block);
    insertion.collapse(true);
    selection.removeAllRanges(); selection.addRange(insertion);
    document.execCommand('insertHTML', false, html);
    changed();
  }
  document.querySelectorAll('.toolbar button').forEach(button => button.addEventListener('mousedown', event => event.preventDefault()));
  document.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click', () => command(button.dataset.command)));
  $('block').addEventListener('change', () => command('formatBlock', $('block').value));
  body.addEventListener('paste', event => {
    event.preventDefault();
    command('insertText', event.clipboardData.getData('text/plain'));
  });
  // Drops from other pages can carry styled or active markup; use the image picker instead.
  body.addEventListener('drop', event => event.preventDefault());
  body.addEventListener('click', event => { if (event.target.closest('a')) event.preventDefault(); });
  $('outline').addEventListener('click', () => insertBlocks( '<h2>The problem</h2><p>What did you want to solve, and for whom?</p><h2>My role</h2><p>What did you own, and what constraints shaped the work?</p><h2>Building the solution</h2><p>Describe your approach, key decisions, and tradeoffs.</p><h2>The result</h2><p>What worked? Share screenshots or evidence.</p><h2>What I learned</h2><p>What would you do differently, and what comes next?</p>'));
  function openInsert(mode) {
    insertMode = mode; $('insert-error').textContent = '';
    $('insert-heading').textContent = mode === 'link' ? 'Insert a link' : 'Insert an image';
    $('link-fields').hidden = mode !== 'link'; $('image-fields').hidden = mode !== 'image';
    $('link-text').value = selectedRange?.toString() || '';
    $('link-url').value = ''; $('image-alt').value = ''; $('image-caption').value = '';
    if (mode === 'image') updateImagePreview();
    dialog.showModal();
    (mode === 'link' ? $('link-text') : $('image-path')).focus();
  }
  $('link').addEventListener('click', () => openInsert('link'));
  $('image').addEventListener('click', () => openInsert('image'));
  $('cancel-insert').addEventListener('click', () => dialog.close());
  function updateImagePreview() {
    const src = $('image-path').value;
    $('image-preview').hidden = !src;
    if (src) $('image-preview').src = src;
  }
  $('image-path').addEventListener('change', updateImagePreview);
  $('insert-form').addEventListener('submit', async event => {
    event.preventDefault();
    let html;
    if (insertMode === 'link') {
      const href = $('link-url').value.trim(), text = $('link-text').value.trim();
      if (!text || !validLink(href)) { $('insert-error').textContent = 'Add link text and a URL starting with https://, http://, mailto:, /, or #.'; return; }
      html = `<a href="${escape(href)}">${escape(text)}</a>`;
    } else {
      const src = $('image-path').value, alt = $('image-alt').value.trim(), caption = $('image-caption').value.trim();
      if (!src || !alt) { $('insert-error').textContent = 'Choose an image and describe what it shows.'; return; }
      const img = new Image(); img.src = src;
      try { await img.decode(); } catch { $('insert-error').textContent = 'This image could not be loaded.'; return; }
      html = `<figure><img src="${escape(src)}" alt="${escape(alt)}" width="${img.naturalWidth}" height="${img.naturalHeight}" loading="lazy">${caption ? `<figcaption>${escape(caption)}</figcaption>` : ''}</figure><p><br></p>`;
    }
    dialog.close();
    if (insertMode === 'image') insertBlocks(html);
    else command('insertHTML', html);
  });
  $('save').addEventListener('click', async () => {
    if (busy || !dirty) return;
    persist(); busy = true; available(false); $('project').disabled = true; $('state').textContent = 'Saving…';
    try {
      const result = await request(`/write/api/${current.slug}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Writer-Token': config.token },
        body: JSON.stringify({ ...values(), revision: current.revision }),
      });
      current = result; fill(result); savedSnapshot = snapshot(values()); dirty = false; forgetDraft();
      render(); $('state').textContent = 'Saved to website';
      feedback(`Saved locally at ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}. The article and Blog listing are updated. Previous files were backed up.`);
    } catch (error) { $('state').textContent = 'Not saved'; feedback(error.message, true); }
    finally { busy = false; available(true); $('project').disabled = false; }
  });
  $('preview-size').addEventListener('click', () => {
    const phone = $('preview').classList.toggle('phone'); $('preview-size').setAttribute('aria-pressed', String(phone));
    $('preview-size').textContent = phone ? 'Full width' : 'Phone width';
  });
  function setView(view) {
    document.querySelector('.workspace').dataset.view = view;
    $('view-write').setAttribute('aria-pressed', String(view === 'write'));
    $('view-preview').setAttribute('aria-pressed', String(view === 'preview'));
  }
  $('view-write').addEventListener('click', () => setView('write'));
  $('view-preview').addEventListener('click', () => setView('preview'));
  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') { event.preventDefault(); $('save').click(); }
  });
  window.addEventListener('beforeunload', event => {
    persist();
    if (dirty && !storageWorks) { event.preventDefault(); event.returnValue = ''; }
  });
  (async () => {
    try {
      config = await request('/write/api');
      config.projects.forEach(project => { const option = new Option(project.name, project.slug); $('project').add(option); });
      config.images.forEach(src => { $('image-path').add(new Option(src.replace('/images/', ''), src)); });
      await loadProject(config.projects[0].slug);
    } catch (error) { feedback(error.message + ' Start the server with npm start, then reload.', true); }
  })();
})();
