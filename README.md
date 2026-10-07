# Bob Labs — Landing Page

The front door of <https://boblabs.eu/>. One screen: the mark, one line of
description, a contact address. Deliberately nothing else.

Static, dependency-free, a single `index.html` (inline CSS + JS) plus
self-hosted fonts and icons.

## Details

- Dark, monochrome, one accent (`#5eead4`).
- Inter for the statement, JetBrains Mono for the rest.
- The tagline decodes from glyph noise once on load; a block cursor blinks
  after it. Both are disabled under `prefers-reduced-motion`.
- Language follows the browser (`fr*` → French, otherwise English). No
  switcher. Strings live in the `FR` map in `index.html`.
- The version stamp in the bottom-right corner is fetched from
  [`VERSION`](./VERSION) at runtime, so there is one place to bump.

## Project layout

```
.
├── index.html           Page (markup, styles, script)
├── fonts.css, fonts/    Self-hosted Inter + JetBrains Mono (woff2)
├── favicon.*, icon-*    App icons (bL mark)
├── og-image.png         1200×630 social card
├── manifest.webmanifest
├── brand/               Logo source files (SVG/PNG)
├── VERSION              Current release (semver)
├── CHANGELOG.md
├── Dockerfile           nginx:alpine image
├── nginx.conf           Production server config
└── docker-compose.yml
```

## Run locally

No build step. Serve the folder (the version stamp needs HTTP, not `file://`):

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

## Production (Docker + nginx)

```bash
docker compose up -d --build
# → http://127.0.0.1:8081
```

The image is a static `nginx:alpine` serving `/usr/share/nginx/html`.
Gzip, long-cache for assets, no-cache for HTML and security headers are
configured in [`nginx.conf`](./nginx.conf).

To pin a tag:

```bash
docker build -t boblabs/landing:$(cat VERSION) .
docker run -p 8080:80 boblabs/landing:$(cat VERSION)
```

## Releasing

1. Bump [`VERSION`](./VERSION) (semver).
2. Add an entry to [`CHANGELOG.md`](./CHANGELOG.md).
3. If `og-image.png` or the icons change, bump their `?v=` query in
   `index.html` so caches refetch.
4. Commit, then tag: `git tag v$(cat VERSION)`.

## License

MIT — see project root.
