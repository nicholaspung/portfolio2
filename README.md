# Nicholas Pung’s portfolio

A plain HTML/CSS portfolio and blog. No framework, dependencies, web fonts, image downloads, or browser JavaScript. Each page is complete HTML, so content and navigation work with JavaScript disabled. One shared stylesheet provides a responsive layout and follows the visitor’s light/dark preference.

## Run locally

With Node.js 22 or newer:

```sh
npm start
```

Open http://localhost:8000. No `npm install` is needed. Edit a file in `site/` and refresh the browser. Any static web server can serve `site/` instead; Node is only used for optional development scripts.

## Edit content

- `site/index.html`: introduction, all five projects, and links to the four posts.
- `site/about/index.html`: biography, podcasts, project ideas, and background.
- `site/blog/index.html`: dated blog entries and descriptions.
- `site/blog/<slug>/index.html`: complete article content and previous/next links.
- `site/style.css`: all styling.
- `site/404.html`: custom not-found page.

To add a post, copy an existing article directory, edit its content, title, description, canonical URL and Open Graph metadata, then add links to the blog index and homepage. Update neighboring previous/next links and `site/sitemap.xml`. The HTML files are the source of truth; there is no generator or Markdown processing step. Shared navigation/footer markup is deliberately repeated across this small set of pages.

`archive/` preserves the original Markdown, project data, and unpublished material for reference. It is not deployed or loaded by visitors. The profile picture and unused site icons have been removed. Original portfolio and article URLs are preserved, including `/blog/<slug>/`.

## Check and publish

```sh
npm test
npm run build
```

The check validates local links, page structure, and asset size budgets. The build only copies `site/` to `public/`; it does not compile or bundle anything. Deploy `public/` (or `site/` directly) to a static host with directory index support. Configure the host to use `404.html` for unknown paths.

For GitHub Pages, publish the contents of `public/` using your existing Pages deployment process. `.nojekyll` and the existing `CNAME` for `www.nicholaspung.com` are included. Links assume the site is hosted at the domain root, matching that custom domain. No deploy command pushes changes automatically.
