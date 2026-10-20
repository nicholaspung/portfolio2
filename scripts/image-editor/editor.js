(() => {
  const $ = id => document.getElementById(id);
  const canvas = $('canvas'), ctx = canvas.getContext('2d');
  const output = document.createElement('canvas'), rendered = output.getContext('2d');
  const blurred = document.createElement('canvas'), blurContext = blurred.getContext('2d');
  let config, current, source, sourceURL, savedSnapshot, drag, cachedStrength;
  let boxes = [], history = [], busy = true, dirty = false;
  const snapshot = () => JSON.stringify([boxes, Number($('strength').value), Number($('quality').value)]);
  function feedback(message, error = false) {
    $('feedback').textContent = message;
    $('feedback').classList.toggle('error', error);
  }
  async function request(path, options = {}) {
    const response = await fetch('/image-editor/api' + path, { cache: 'no-store', ...options });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Unable to contact the local server.');
    return data;
  }
  function controls() {
    const enabled = !!source && !busy && current.editable;
    document.querySelectorAll('aside input, aside button').forEach(control => { control.disabled = !enabled; });
    $('quality').disabled = !enabled || current.type === 'image/png';
    $('image-path').disabled = busy;
    $('zoom').disabled = !source || busy;
    $('undo').disabled = !enabled || !history.length;
    $('clear').disabled = !enabled || !boxes.length;
    $('save').disabled = !enabled || !dirty || !!drag;
    $('state').textContent = busy ? 'Working…' : dirty ? 'Unsaved changes' : 'Saved version';
  }
  function render() {
    if (!source) return;
    const strength = Number($('strength').value);
    if (cachedStrength !== strength) {
      blurContext.filter = 'none';
      blurContext.fillStyle = '#fff';
      blurContext.fillRect(0, 0, blurred.width, blurred.height);
      // Blur the whole source first, so box edges have the same blur as their centers.
      if ('filter' in blurContext) {
        blurContext.filter = `blur(${strength}px)`;
        blurContext.drawImage(source, 0, 0);
        blurContext.filter = 'none';
      } else {
        // Pixelation fallback for browsers without Canvas filter support.
        const small = document.createElement('canvas');
        small.width = Math.max(1, Math.ceil(source.naturalWidth / strength));
        small.height = Math.max(1, Math.ceil(source.naturalHeight / strength));
        small.getContext('2d').drawImage(source, 0, 0, small.width, small.height);
        blurContext.imageSmoothingEnabled = false;
        blurContext.drawImage(small, 0, 0, blurred.width, blurred.height);
      }
      cachedStrength = strength;
    }
    rendered.clearRect(0, 0, output.width, output.height);
    rendered.drawImage(source, 0, 0);
    const all = drag ? [...boxes, rectangle(drag.start, drag.end)] : boxes;
    const pixels = box => {
      const x = Math.floor(box.x * canvas.width), y = Math.floor(box.y * canvas.height);
      return [x, y, Math.min(canvas.width, Math.ceil((box.x + box.width) * canvas.width)) - x, Math.min(canvas.height, Math.ceil((box.y + box.height) * canvas.height)) - y];
    };
    all.forEach(box => {
      const [x, y, w, h] = pixels(box);
      if (w && h) rendered.drawImage(blurred, x, y, w, h, x, y, w, h);
    });
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(output, 0, 0);
    if ($('outlines').checked || drag) {
      const scale = canvas.width / (canvas.getBoundingClientRect().width || canvas.width);
      ctx.lineWidth = 2 * scale; ctx.strokeStyle = '#1581ea'; ctx.fillStyle = '#1581ea'; ctx.font = `bold ${12 * scale}px system-ui`;
      all.forEach((box, index) => {
        const [x, y, w, h] = pixels(box);
        ctx.strokeRect(x, y, w, h);
        ctx.fillRect(x, y, 24 * scale, 20 * scale);
        ctx.fillStyle = '#fff'; ctx.fillText(String(index + 1), x + 6 * scale, y + 14 * scale); ctx.fillStyle = '#1581ea';
      });
    }
  }
  function update() {
    dirty = snapshot() !== savedSnapshot;
    $('strength-value').value = $('strength').value + ' px';
    $('quality-value').value = $('quality').value + '%';
    $('count').textContent = String(boxes.length);
    $('boxes').replaceChildren();
    boxes.forEach((box, index) => {
      const li = document.createElement('li');
      li.append(`${Math.round(box.width * canvas.width)} × ${Math.round(box.height * canvas.height)} px`);
      const remove = document.createElement('button'); remove.textContent = 'Remove'; remove.setAttribute('aria-label', `Remove box ${index + 1}`);
      remove.addEventListener('click', () => { remember(); boxes.splice(index, 1); update(); });
      li.append(remove); $('boxes').append(li);
    });
    controls(); render();
  }
  function remember() { history.push({ boxes: structuredClone(boxes), strength: $('strength').value }); if (history.length > 100) history.shift(); }
  async function load(path) {
    busy = true; drag = null; controls();
    try {
      const data = await request('/image?path=' + encodeURIComponent(path));
      const response = await fetch('/image-editor/api/source?path=' + encodeURIComponent(path), { cache: 'no-store', headers: { 'X-Image-Token': config.token } });
      if (!response.ok) throw new Error('Unable to load the original. Reload the editor if the server restarted.');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const image = new Image(); image.src = url;
      try { await image.decode(); } catch { URL.revokeObjectURL(url); throw new Error('This browser cannot decode the image.'); }
      if (sourceURL) URL.revokeObjectURL(sourceURL);
      sourceURL = url; source = image; current = data; boxes = data.boxes; history = []; cachedStrength = null;
      [canvas, output, blurred].forEach(surface => { surface.width = image.naturalWidth; surface.height = image.naturalHeight; });
      $('strength').value = data.strength;
      $('quality').value = 92;
      savedSnapshot = snapshot(); dirty = false;
      $('dimensions').textContent = `${image.naturalWidth} × ${image.naturalHeight} px · ${Math.round(data.bytes / 1024)} kB saved`;
      $('saved-image').href = path + '?v=' + data.revision; $('saved-image').hidden = false;
      $('canvas').hidden = false; $('empty').hidden = true;
      $('box-x').max = image.naturalWidth - 4; $('box-y').max = image.naturalHeight - 4;
      $('box-width').max = image.naturalWidth; $('box-height').max = image.naturalHeight;
      feedback(data.editable ? 'Drag to add blur boxes. Save changes local files; publish through your normal workflow.' : 'AVIF preview only. Convert it to PNG, JPEG, or WebP before editing.', !data.editable);
    } catch (error) {
      $('image-path').value = current?.path || '';
      feedback(error.message, true);
    } finally { busy = false; update(); }
  }
  const point = event => {
    const rect = canvas.getBoundingClientRect();
    return { x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)) };
  };
  const rectangle = (a, b) => ({ x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), width: Math.abs(a.x - b.x), height: Math.abs(a.y - b.y) });
  canvas.addEventListener('pointerdown', event => {
    if (busy || !current?.editable || !event.isPrimary || event.button !== 0) return;
    if (boxes.length >= 100) { feedback('Use up to 100 boxes per image.', true); return; }
    canvas.setPointerCapture(event.pointerId);
    drag = { id: event.pointerId, start: point(event), end: point(event) }; controls(); render();
  });
  canvas.addEventListener('pointermove', event => { if (drag?.id === event.pointerId) { drag.end = point(event); render(); } });
  canvas.addEventListener('pointerup', event => {
    if (drag?.id !== event.pointerId) return;
    const box = rectangle(drag.start, point(event));
    if (box.width * canvas.width >= 4 && box.height * canvas.height >= 4) { remember(); boxes.push(box); }
    drag = null; update();
  });
  canvas.addEventListener('pointercancel', () => { drag = null; update(); });
  canvas.addEventListener('lostpointercapture', () => { if (drag) { drag = null; update(); } });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && drag) { drag = null; update(); } });
  $('box-form').addEventListener('submit', event => {
    event.preventDefault();
    if (busy || !current?.editable) return;
    const x = Number($('box-x').value), y = Number($('box-y').value), width = Number($('box-width').value), height = Number($('box-height').value);
    if (boxes.length >= 100 || x + width > canvas.width || y + height > canvas.height) { feedback('Keep the box inside the image and use up to 100 boxes.', true); return; }
    remember(); boxes.push({ x: x / canvas.width, y: y / canvas.height, width: width / canvas.width, height: height / canvas.height }); update();
  });
  $('undo').addEventListener('click', () => { const previous = history.pop(); if (previous) { boxes = previous.boxes; $('strength').value = previous.strength; update(); } });
  $('clear').addEventListener('click', () => { remember(); boxes = []; update(); feedback('All boxes cleared. Save to restore the original image on the website.'); });
  $('strength').addEventListener('pointerdown', remember);
  $('strength').addEventListener('keydown', event => { if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) remember(); });
  $('strength').addEventListener('input', update);
  $('quality').addEventListener('input', update);
  $('outlines').addEventListener('change', render);
  $('zoom').addEventListener('click', () => { const actual = $('stage').classList.toggle('actual'); $('zoom').setAttribute('aria-pressed', actual); $('zoom').textContent = actual ? 'Fit image' : 'Actual size'; render(); });
  new ResizeObserver(render).observe(canvas);
  $('image-path').addEventListener('change', () => {
    if (dirty && !confirm('Discard unsaved blur changes and switch images?')) { $('image-path').value = current.path; return; }
    load($('image-path').value);
  });
  async function save() {
    if (busy || !dirty || drag || !current?.editable) return;
    busy = true; controls(); feedback('Encoding and saving the blurred image…');
    try {
      let image;
      if (boxes.length) {
        const blob = await new Promise(resolve => output.toBlob(resolve, current.type, Number($('quality').value) / 100));
        if (!blob || blob.type !== current.type) throw new Error('This browser cannot export the original image format. Try a browser with PNG, JPEG, and WebP canvas export.');
        if (blob.size > 512000) throw new Error(`The edited image is ${Math.ceil(blob.size / 1024)} kB. Lower export quality to keep it under 500 kB.`);
        image = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(blob); });
      }
      const saved = await request('/image', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Image-Token': config.token }, body: JSON.stringify({ path: current.path, revision: current.revision, boxes, strength: Number($('strength').value), image }) });
      current = saved; savedSnapshot = snapshot(); dirty = false;
      $('saved-image').href = current.path + '?v=' + current.revision;
      $('dimensions').textContent = `${canvas.width} × ${canvas.height} px · ${Math.round(current.bytes / 1024)} kB saved`;
      feedback(`Saved to site${current.path}. Refresh the portfolio to see it. Previous image backed up in ${saved.backup}.`);
    } catch (error) { feedback(error.message || 'Unable to export the image. Your boxes remain in this tab.', true); }
    finally { busy = false; controls(); }
  }
  $('save').addEventListener('click', save);
  document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') { event.preventDefault(); save(); } });
  window.addEventListener('beforeunload', event => { if (dirty || busy && current) { event.preventDefault(); event.returnValue = ''; } });
  (async () => {
    try {
      config = await request('');
      config.images.forEach(path => { const option = document.createElement('option'); option.value = path; option.textContent = path.slice('/images/'.length); $('image-path').append(option); });
      if (!config.images.length) { busy = false; controls(); feedback('Add PNG, JPEG, or WebP files to site/images/ and reload the editor.'); return; }
      const selected = new URLSearchParams(location.search).get('image');
      $('image-path').value = config.images.includes(selected) ? selected : config.images[0];
      await load($('image-path').value);
    } catch (error) { busy = false; controls(); feedback(error.message, true); }
  })();
})();
