# Nicholas Pung’s portfolio

A plain HTML/CSS portfolio and blog with small JavaScript enhancements for appearance preferences and viewing screenshots. No framework, browser dependencies, or web fonts. The production build uses Sharp to optimize screenshots losslessly; the published site is still entirely static. Each page is complete HTML, so content, navigation, and full-size image links work with JavaScript disabled. One shared stylesheet provides a responsive layout. Related background shades distinguish navigation, introductions, content sections, cards, and footers across all public page types, without horizontal divider lines.

Every page’s footer has compact sun, moon, and monitor buttons for **Light**, **Dark**, and **System** appearance, plus color swatches for **Sage**, **Ocean**, **Lavender**, **Rose**, and **Sand**. Buttons have accessible labels and hover tooltips. System (the default) follows device appearance changes automatically; Sage preserves the original colors. Choices are saved in `localStorage` under `portfolio-appearance`, shared across pages and tabs for the same site and browser profile, and restored before styles load. They remain local to that browser; clearing site data resets them. If storage is unavailable, controls still work for the current page. Without JavaScript, the site follows the device appearance with the Sage palette.

Portfolio, About, and blog articles have a floating section navigator. On wide screens, hover or focus the bars along the left edge to reveal section names, then select one to jump there. The current section is highlighted as you scroll. On narrower screens, a **Sections** button opens the same links for touch and keyboard navigation. Escape closes it. Navigation respects reduced motion, follows the selected theme, and uses native fragment links that remain usable without JavaScript. Portfolio and About links live in each page’s `.section-nav`; blog links are generated from the article’s H2 and H3 headings when the page loads, with smaller bars for subsections. Editing headings in the writing editor updates navigation automatically on the saved page, and articles without headings hide the navigator. Behavior and styles live in `site/section-nav.js` and `site/section-nav.css`. Blog section navigation requires JavaScript.

## Run locally

With Node.js 22 or newer:

```sh
npm start
```

Open http://localhost:8000. No `npm install` is needed for local authoring. Edit a file in `site/` and refresh the browser. Any static web server can serve `site/` instead; Node is only used for development scripts and the production build.

Compare homepage layout studies at `/1/` (tight stack with small previews beside the text), `/2/` (featured project cards), and `/3/` (compact list with expandable screenshots). Each has a layout switcher and uses `site/layouts.css`. The chosen project cards layout is the main homepage at `/`, with its styles in `site/home.css`. These are independent static snapshots of the homepage content, marked `noindex` and omitted from the sitemap. Fixed text assets have a 127 kB budget including these three pages and the screenshot viewer; each of the three editable case studies has a separate 70 kB budget (60 kB for its article body); the main homepage plus its stylesheets has a 34 kB limit, with separate limits of 5 kB for the viewer script and 4 kB for the appearance script.

## Blur screenshots locally

With `npm start` running, click **Blur screenshots** in the local toolbar on any portfolio page, or open **http://localhost:8000/image-editor/**. Restart the development server if it was running before this feature was added.

1. Choose a screenshot from `site/images/` (PNG, JPEG, or WebP).
2. Drag over the screenshot to add blur boxes. You can also expand **Add a box with coordinates** and enter original-image pixel coordinates. **Undo**, **Remove**, and **Clear all boxes** let you revise your selections.
3. Adjust **Blur strength**. Toggle off **Show box outlines** and use **Actual size** to review the result. Outlines are never exported. For details you want to hide, use generous boxes and inspect the result at full size.
4. Click **Save to website** or press **⌘S / Ctrl+S**. The editor saves real blurred pixels into the same image file, at its original dimensions, so every thumbnail, full-size link, and case study using that image gets the updated version. Refresh the portfolio to see it. Saving is local; publish through the normal Git/hosting workflow.

The editor preserves the original and saved box coordinates in `.local/images/states/`, outside the deployed site. Reopening an image lets you edit its saved boxes without repeatedly blurring or recompressing the previous export. Clear all boxes and save to restore the exact original bytes. Every save also backs up the previous image and editing state under `.local/images/backups/`; `metadata.json` identifies its website path. These local files are ignored by Git; keep them if you want to revise or restore saved edits. Unsaved changes stay only in the current tab, with a warning before leaving or switching images. External file changes block stale saves and start a fresh original on reload.

Each exported image must fit the existing 500 kB limit, and all site images must stay under 3 MB. Lower **Export quality** for JPEG/WebP if needed; PNG is lossless. AVIF images can be previewed but need conversion to PNG/JPEG/WebP before editing because browser canvas export does not consistently support AVIF. The editor uses Canvas blur, with pixelation as a fallback in browsers without Canvas filter support.

All editing routes, the local toolbar, private originals, and backups are excluded from `npm run build`. Only the saved image pixels are published, including all generated previews and full-size copies. Rebuild after saving a screenshot: changed output pixels receive new URLs automatically, so returning visitors get the edited image. The editor lives in `scripts/image-editor/` and `scripts/image-editor-server.js`; it requires no added dependencies.

## Write case studies locally

With `npm start` running, open **http://localhost:8000/write/**. No installation, account, libraries, or framework is required.

1. Choose **Productivity**, **Yummy Recs**, or **Data Desktop**.
2. Edit the title, summary, and article. Use the toolbar for headings, bold, italic, lists, quotes, code blocks, and links. **Add an outline** inserts writing prompts after the current paragraph without replacing your text.
3. Use **Image** to choose an existing file from `site/images/`, add descriptive alt text, and optionally add a caption. To add new images, copy optimized PNG, JPEG, WebP, or AVIF files into that folder and reload the editor; keep each under 500 kB and all site images under 3 MB. Images are inserted after the current paragraph.
4. Check the live preview, including **Phone width**. On narrow screens, switch between **Write** and **Preview**.
5. Uncheck **Show “Case study coming soon”** when the article is ready. Click **Save to website**, or press **⌘S / Ctrl+S**.

Saving writes the selected article’s HTML, title, description, and Open Graph metadata, and updates its title, summary, and coming-soon status in `site/blog/index.html`. It preserves the page’s navigation, footer, and fixed project links. The homepage project card is edited separately. Saving is local; publish with the normal Git/hosting workflow when ready.

Unfinished drafts are stored in this browser’s local storage per project, including when you switch projects. On return, choose **Restore draft** or **Discard draft**. Drafts are specific to this browser profile and localhost origin; clearing browser data removes them. Saved HTML files remain the source of truth.

Every save backs up the previous article and Blog index to `.local/writer/backups/<project>-<timestamp>.json` (ignored by Git). The JSON’s `article` and `blog` fields contain their complete previous HTML. If a file changes on disk after it was loaded, saving stops rather than overwriting it: keep your browser draft, reload, and restore it for review against the newer file.

The editor’s files live in `scripts/writer/`; `scripts/writer-server.js` handles its local routes. Only the Node development server exposes `/write/`. `npm run build` uses only `site/` as its content source, so the editor, browser draft storage, and saving endpoints are absent from the published site. Other static servers can preview the portfolio but cannot run this editor.

## Edit content

- `site/index.html`: introduction, portfolio entries, a screenshot carousel placeholder for Productivity, the Data Desktop screenshot carousel, and the Yummy Recs screenshot gallery.
- `site/about/index.html`: biography, podcasts, and background.
- `site/blog/index.html`: dated blog entries and descriptions.
- `site/blog/<slug>/index.html`: complete article content and previous/next links.
- `site/style.css`: shared styling and light/dark sage surface colors. Group article content in `.content-section` elements to shade each section; keep the local editor’s body markers inside their existing wrapper.
- `site/theme.js`: footer appearance controls and browser-local preferences; loaded before the shared stylesheet on every page to avoid flashing the wrong theme.
- `site/home.css`: homepage layout and shared project cards, with two columns on desktop and one on mobile.
- `site/gallery.js` and `site/gallery.css`: shared fullscreen image viewer for portfolio galleries and blog screenshots, with native dialog behavior, arrow navigation, keyboard controls, and touch swiping. Article images are grouped per post; images inserted through the writing editor are automatically made clickable.
- `site/404.html`: custom not-found page.

To add a post, copy an existing article directory, edit its content, title, description, canonical URL and Open Graph metadata, then add links to the blog index and homepage. Update neighboring previous/next links and `site/sitemap.xml`. The HTML files are the source of truth; there is no generator or Markdown processing step. Shared navigation/footer markup is deliberately repeated across this small set of pages.

Productivity has a three-slide placeholder carousel using native radio controls and CSS. Data Desktop uses the same horizontal, scroll-snapping gallery and fullscreen viewer as Yummy Recs, with landscape previews that fit the project card. Its twenty user-supplied screenshots (original PNGs and lossless WebP files) live in `site/images/data-desktop/`, ordered by filename, starting with the light and dark dashboards. Add or reorder image links inside its `.desktop-gallery` in `site/index.html` to update the gallery, using descriptive alt text, actual dimensions, and `loading="lazy"`. Keep each image under 500 kB and all site images under 3 MB.

Yummy Recs uses a horizontal, scroll-snapping portrait gallery. Its seven user-supplied iPhone screenshots are stored as lossless WebP files in `site/images/yummy/`, at their original 923 × 2000 dimensions. Selecting an image opens a fullscreen viewer with close, previous, and next buttons. Left/right arrow keys and horizontal touch swipes move between images, wrapping at the ends; Escape closes the viewer. The native dialog keeps keyboard focus inside the viewer and restores it to the selected thumbnail when closed. Full-size image links remain available without JavaScript and through modified clicks. Add or reorder the image links inside `.phone-gallery` in `site/index.html` to update this gallery. The GitHub repository link appears on the project card and its completed case study.

The Yummy Recs case study includes all seven screenshots under **The result**, in a portrait version of Data Desktop’s feature showcase. Its **Onboarding walkthroughs** section includes all ten tutorials from `food-tracker-app/apps/mobile/assets/onboarding/`. The original GIFs remain in that repository; this site uses H.264 MP4 copies at the original 480 × 1044 resolution, with playback controls, no autoplay, and `preload="none"`. Videos live in `site/media/yummy/onboarding/`, and WebP posters derived from the existing tutorial posters live in `site/images/yummy/onboarding/`. Video checks allow 3 MB per tutorial and 10 MB combined, separate from the screenshot and text budgets. The walkthrough section follows the screenshot carousel, before **What I learned**. Its source markup sits outside the editable body markers, and the shared showcase script moves it into place so saving the article in the local writer preserves it.

Screenshot checks allow up to 500 kB per image and 3 MB in total, separate from the HTML/CSS size budget. The editable case studies live at `site/blog/productivity/index.html`, `site/blog/yummy-recs/index.html`, and `site/blog/data-desktop/index.html`. Keep their `case-study:body` and `case-study:status` comment markers when editing HTML directly; the local editor uses them to preserve the surrounding page.

`archive/` preserves the original Markdown, project data, and unpublished material for reference. It is not deployed or loaded by visitors. The profile picture and unused site icons have been removed. Original portfolio and article URLs are preserved, including `/blog/<slug>/`.

The Data Desktop case study enhances the app headings and screenshots under **The result** into a full-width horizontal showcase, including previous/next controls, keyboard scrolling, and touch swiping. Each app keeps its description and images together, and screenshots use the shared fullscreen viewer. The showcase’s app headings are excluded from the section navigator, which lists the article headings outside it. The source article stays in the editor’s standard HTML format; without JavaScript it remains a vertical article. Behavior and styles shared with Yummy Recs live in `site/case-study.js` and `site/case-study.css`; Yummy Recs selects its portrait layout and feature labels through the article’s `data-showcase` and `data-showcase-item` attributes.

## Check and publish

```sh
npm ci
npm test
npm run build
```

The checks validate local links, page structure, asset size budgets, image generation, browser-cache behavior, and the local editors’ file-saving behavior (using temporary copies, never your real articles). The build copies `site/` to `public/`, generates optimized images, and enhances the output HTML. Deploy **`public/`** to a static host with directory index support. Serving `site/` directly remains useful for authoring but skips production image optimization and caching. Configure the host to use `404.html` for unknown paths.

Use `npm run preview` after building to inspect the production output at http://localhost:8001, including image caching. It serves `public/` without local editing tools. The different default port keeps the production service worker separate from local authoring. Set `PORT` to override it.

## Screenshot performance and caching

`scripts/build.js` preserves original screenshot resolution and pixels in both the page previews and fullscreen viewer, using lossless WebP when smaller than the source. There are no downsampled or lossy preview variants, so UI text and fine detail retain the source image quality. Lazy loading and explicit image dimensions are preserved; image decoding is asynchronous. Previews and the fullscreen viewer share the same image URL, avoiding another download when opening an already-loaded screenshot. The fullscreen viewer also prepares the adjacent images after the selected image loads, except when the browser reports Data Saver or a 2G connection. JavaScript-disabled browsers still receive full-resolution images and normal full-size links.

Generated images live under `public/assets/screenshots/`, with filenames derived from their actual bytes. A saved blur edit or a replaced screenshot produces new URLs on the next build; unchanged screenshots retain their URLs across deployments. Source files in `site/images/` and private editing originals are never rewritten by the build. Original source URLs are also preserved in the output for existing direct links.

The build adds `cache.js` and `sw.js` from `scripts/screenshot-cache.js` and `scripts/screenshot-worker.js`. On HTTPS (or localhost), the service worker caches viewed generated screenshots, including those loaded before it takes control on the first visit. Subsequent views use the saved response without a network request. It does not download the entire gallery in advance. The cache holds at most 120 image variants and evicts the oldest entries; storage failures fall back to normal image loading. Browser storage is local to that browser/profile and can be evicted or cleared by the browser.

The service worker only handles the generated image URLs. Pages, styles, scripts, and editing endpoints keep normal browser loading behavior. No worker is registered by the authoring site. `_headers` supplies a one-year immutable HTTP cache policy for generated images on hosts supporting that file; the screenshot service worker also works on GitHub Pages, where `_headers` is ignored. Caching is an enhancement, so unsupported browsers still load images normally.

For GitHub Pages, publish the contents of `public/` using your existing Pages deployment process. `.nojekyll` and the existing `CNAME` for `www.nicholaspung.com` are included. Links assume the site is hosted at the domain root, matching that custom domain. No deploy command pushes changes automatically.
