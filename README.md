# Nicholas Pung’s portfolio

A plain HTML/CSS portfolio and blog with a small JavaScript enhancement for viewing screenshots. No framework, dependencies, or web fonts. Each page is complete HTML, so content, navigation, and full-size image links work with JavaScript disabled. One shared stylesheet provides a responsive layout and follows the visitor’s light/dark preference. Related sage-green background shades distinguish navigation, introductions, content sections, cards, and footers across all public page types, without horizontal divider lines.

## Run locally

With Node.js 22 or newer:

```sh
npm start
```

Open http://localhost:8000. No `npm install` is needed. Edit a file in `site/` and refresh the browser. Any static web server can serve `site/` instead; Node is only used for optional development scripts and the local writing editor.

Compare homepage layout studies at `/1/` (tight stack with small previews beside the text), `/2/` (featured project cards), and `/3/` (compact list with expandable screenshots). Each has a layout switcher and uses `site/layouts.css`. The chosen project cards layout is the main homepage at `/`, with its styles in `site/home.css`. These are independent static snapshots of the homepage content, marked `noindex` and omitted from the sitemap. Fixed text assets have a 110 kB budget including these three pages and the screenshot viewer; each of the three editable case studies has a separate 70 kB budget (60 kB for its article body); the main homepage plus its stylesheets has a 21 kB limit, with a separate 5 kB limit for the viewer script.

## Blur screenshots locally

With `npm start` running, click **Blur screenshots** in the local toolbar on any portfolio page, or open **http://localhost:8000/image-editor/**. Restart the development server if it was running before this feature was added.

1. Choose a screenshot from `site/images/` (PNG, JPEG, or WebP).
2. Drag over the screenshot to add blur boxes. You can also expand **Add a box with coordinates** and enter original-image pixel coordinates. **Undo**, **Remove**, and **Clear all boxes** let you revise your selections.
3. Adjust **Blur strength**. Toggle off **Show box outlines** and use **Actual size** to review the result. Outlines are never exported. For details you want to hide, use generous boxes and inspect the result at full size.
4. Click **Save to website** or press **⌘S / Ctrl+S**. The editor saves real blurred pixels into the same image file, at its original dimensions, so every thumbnail, full-size link, and case study using that image gets the updated version. Refresh the portfolio to see it. Saving is local; publish through the normal Git/hosting workflow.

The editor preserves the original and saved box coordinates in `.local/images/states/`, outside the deployed site. Reopening an image lets you edit its saved boxes without repeatedly blurring or recompressing the previous export. Clear all boxes and save to restore the exact original bytes. Every save also backs up the previous image and editing state under `.local/images/backups/`; `metadata.json` identifies its website path. These local files are ignored by Git; keep them if you want to revise or restore saved edits. Unsaved changes stay only in the current tab, with a warning before leaving or switching images. External file changes block stale saves and start a fresh original on reload.

Each exported image must fit the existing 500 kB limit, and all site images must stay under 3 MB. Lower **Export quality** for JPEG/WebP if needed; PNG is lossless. AVIF images can be previewed but need conversion to PNG/JPEG/WebP before editing because browser canvas export does not consistently support AVIF. The editor uses Canvas blur, with pixelation as a fallback in browsers without Canvas filter support.

All editing routes, the local toolbar, originals, and backups are excluded from `npm run build`. Only the saved image pixels are published. The editor lives in `scripts/image-editor/` and `scripts/image-editor-server.js`; it requires no added dependencies.

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

The editor’s files live in `scripts/writer/`; `scripts/writer-server.js` handles its local routes. Only the Node development server exposes `/write/`. `npm run build` copies only `site/`, so the editor, browser draft storage, and saving endpoints are absent from the published site. Other static servers can preview the portfolio but cannot run this editor.

## Edit content

- `site/index.html`: introduction, portfolio entries, a screenshot carousel placeholder for Productivity, and the Yummy Recs screenshot gallery.
- `site/about/index.html`: biography, podcasts, and background.
- `site/blog/index.html`: dated blog entries and descriptions.
- `site/blog/<slug>/index.html`: complete article content and previous/next links.
- `site/style.css`: shared styling and light/dark sage surface colors. Group article content in `.content-section` elements to shade each section; keep the local editor’s body markers inside their existing wrapper.
- `site/home.css`: homepage layout and shared project cards, with two columns on desktop and one on mobile.
- `site/gallery.js`: fullscreen image viewer with native dialog behavior, arrow navigation, keyboard controls, and touch swiping.
- `site/404.html`: custom not-found page.

To add a post, copy an existing article directory, edit its content, title, description, canonical URL and Open Graph metadata, then add links to the blog index and homepage. Update neighboring previous/next links and `site/sitemap.xml`. The HTML files are the source of truth; there is no generator or Markdown processing step. Shared navigation/footer markup is deliberately repeated across this small set of pages.

Productivity and Data Desktop each have a three-slide screenshot carousel using native radio controls and CSS in their featured homepage cards. To add screenshots, put optimized PNG, JPEG, WebP, or AVIF files in `site/images/` (use `site/images/data-desktop/` for Data Desktop) and replace each project’s `.screenshot-placeholder` with an `<img src="/images/filename.webp" alt="Describe the screen" width="1600" height="900" loading="lazy">`, using the image’s actual dimensions. Keep the surrounding `.screenshot-slide` element. Each carousel has its own radio group, so browsing one does not change the other. Keep each image under 500 kB and all site images under 3 MB.

Yummy Recs uses a horizontal, scroll-snapping portrait gallery. Its seven user-supplied iPhone screenshots are stored as lossless WebP files in `site/images/yummy/`, at their original 923 × 2000 dimensions. Selecting an image opens a fullscreen viewer with close, previous, and next buttons. Left/right arrow keys and horizontal touch swipes move between images, wrapping at the ends; Escape closes the viewer. The native dialog keeps keyboard focus inside the viewer and restores it to the selected thumbnail when closed. Full-size image links remain available without JavaScript and through modified clicks. Add or reorder the image links inside `.phone-gallery` in `site/index.html` to update this gallery. The GitHub repository link appears on the project card and its case study placeholder.

Screenshot checks allow up to 500 kB per image and 3 MB in total, separate from the HTML/CSS size budget. The editable case studies live at `site/blog/productivity/index.html`, `site/blog/yummy-recs/index.html`, and `site/blog/data-desktop/index.html`. Keep their `case-study:body` and `case-study:status` comment markers when editing HTML directly; the local editor uses them to preserve the surrounding page.

`archive/` preserves the original Markdown, project data, and unpublished material for reference. It is not deployed or loaded by visitors. The profile picture and unused site icons have been removed. Original portfolio and article URLs are preserved, including `/blog/<slug>/`.

## Check and publish

```sh
npm test
npm run build
```

The checks validate local links, page structure, asset size budgets, and the local editor’s file-saving behavior (using temporary copies, never your real articles). The build only copies `site/` to `public/`; it does not compile or bundle anything. Deploy `public/` (or `site/` directly) to a static host with directory index support. Configure the host to use `404.html` for unknown paths.

For GitHub Pages, publish the contents of `public/` using your existing Pages deployment process. `.nojekyll` and the existing `CNAME` for `www.nicholaspung.com` are included. Links assume the site is hosted at the domain root, matching that custom domain. No deploy command pushes changes automatically.
