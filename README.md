# Nicholas Pung’s portfolio

A plain HTML/CSS portfolio and blog with a small JavaScript enhancement for viewing screenshots. No framework, dependencies, or web fonts. Each page is complete HTML, so content, navigation, and full-size image links work with JavaScript disabled. One shared stylesheet provides a responsive layout and follows the visitor’s light/dark preference.

## Run locally

With Node.js 22 or newer:

```sh
npm start
```

Open http://localhost:8000. No `npm install` is needed. Edit a file in `site/` and refresh the browser. Any static web server can serve `site/` instead; Node is only used for optional development scripts.

Compare homepage layout studies at `/1/` (tight stack with small previews beside the text), `/2/` (featured project cards), and `/3/` (compact list with expandable screenshots). Each has a layout switcher and uses `site/layouts.css`. The chosen project cards layout is the main homepage at `/`, with its styles in `site/home.css`. These are independent static snapshots of the homepage content, marked `noindex` and omitted from the sitemap. The total text-asset budget is 110 kB to include these three pages and the screenshot viewer; the main homepage plus its stylesheets has a 20 kB limit, with a separate 5 kB limit for the viewer script.

## Edit content

- `site/index.html`: introduction, portfolio entries, a screenshot carousel placeholder for Productivity, and the Yummy Recs screenshot gallery.
- `site/about/index.html`: biography, podcasts, and background.
- `site/blog/index.html`: dated blog entries and descriptions.
- `site/blog/<slug>/index.html`: complete article content and previous/next links.
- `site/style.css`: shared styling.
- `site/home.css`: homepage layout and compact featured project cards.
- `site/gallery.js`: fullscreen image viewer with native dialog behavior, arrow navigation, keyboard controls, and touch swiping.
- `site/404.html`: custom not-found page.

To add a post, copy an existing article directory, edit its content, title, description, canonical URL and Open Graph metadata, then add links to the blog index and homepage. Update neighboring previous/next links and `site/sitemap.xml`. The HTML files are the source of truth; there is no generator or Markdown processing step. Shared navigation/footer markup is deliberately repeated across this small set of pages.

Productivity has a three-slide screenshot carousel using native radio controls and CSS. To add screenshots, put optimized PNG, JPEG, WebP, or AVIF files in `site/images/` and replace each `.screenshot-placeholder` with an `<img src="/images/filename.webp" alt="Describe the screen" width="1600" height="900" loading="lazy">`, using the image’s actual dimensions. Keep the surrounding `.screenshot-slide` element.

Yummy Recs uses a horizontal, scroll-snapping portrait gallery. Its seven user-supplied iPhone screenshots are stored as lossless WebP files in `site/images/yummy/`, at their original 923 × 2000 dimensions. Selecting an image opens a fullscreen viewer with close, previous, and next buttons. Left/right arrow keys and horizontal touch swipes move between images, wrapping at the ends; Escape closes the viewer. The native dialog keeps keyboard focus inside the viewer and restores it to the selected thumbnail when closed. Full-size image links remain available without JavaScript and through modified clicks. Add or reorder the image links inside `.phone-gallery` in `site/index.html` to update this gallery. The GitHub repository link appears on the project card and its case study placeholder.

Screenshot checks allow up to 500 kB per image and 3 MB in total, separate from the HTML/CSS size budget. The case study placeholders live at `site/blog/productivity/index.html` and `site/blog/yummy-recs/index.html`.

`archive/` preserves the original Markdown, project data, and unpublished material for reference. It is not deployed or loaded by visitors. The profile picture and unused site icons have been removed. Original portfolio and article URLs are preserved, including `/blog/<slug>/`.

## Check and publish

```sh
npm test
npm run build
```

The check validates local links, page structure, and asset size budgets. The build only copies `site/` to `public/`; it does not compile or bundle anything. Deploy `public/` (or `site/` directly) to a static host with directory index support. Configure the host to use `404.html` for unknown paths.

For GitHub Pages, publish the contents of `public/` using your existing Pages deployment process. `.nojekyll` and the existing `CNAME` for `www.nicholaspung.com` are included. Links assume the site is hosted at the domain root, matching that custom domain. No deploy command pushes changes automatically.
