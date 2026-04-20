# Bob Labs — Landing Page

Hub page that redirects visitors to the three Bob Labs platforms:

- **Bob Labs** — private AI platform · <https://lab.boblabs.eu/>
- **Trustless OTC** — P2P crypto trading · <https://otc.boblabs.eu/>
- **Etic'Monts** — MAEC environmental database · <https://emb.boblabs.eu/>

Static, dependency-free, ~25 KB total. Plain HTML / CSS / JS.

---

## Features

- Animated **3D perspective grid** background that tilts as you scroll.
- Live **flocking simulation** (separation / alignment / cohesion) on a canvas.
  Agents are attracted by a slow-moving mouse and repelled by a fast one.
- **Three themes** with their own palette and agent icons:
  - `tech` → cyan / blue · chip & circuit glyphs
  - `finance` → amber / orange · `$ € ₿` glyphs
  - `agriculture` → green · leaf, bee & berry glyphs
- **EN / FR** language toggle (in-memory, no reload).
- Fully responsive, respects `prefers-reduced-motion`.
- Versioned via the [`VERSION`](./VERSION) file (semver).

## Project layout

```
.
├── index.html       Markup + i18n attributes
├── styles.css       Theme tokens, layout, components
├── main.js          Scroll-tilt, theme & language switchers
├── flocking.js      Canvas-based boids simulation
├── i18n.js          EN / FR string table
├── VERSION          Current release (semver)
├── Dockerfile       Multi-stage build → nginx:alpine
├── nginx.conf       Production server config
├── docker-compose.yml
└── .dockerignore
```

## Run locally

No build step. Open `index.html` in a browser, or:

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

## Production (Docker + nginx)

```bash
docker compose up -d --build
# → http://localhost:8080
```

The image is a static `nginx:alpine` serving `/usr/share/nginx/html`.
Gzip, long-cache for assets, no-cache for HTML, security headers and
SPA-style fallback are configured in [`nginx.conf`](./nginx.conf).

To pin a tag:

```bash
docker build -t boblabs/landing:$(cat VERSION) .
docker run -p 8080:80 boblabs/landing:$(cat VERSION)
```

## Theming

Themes are CSS custom properties scoped to `[data-theme]` on `<html>`.
The active theme is persisted in `localStorage` under `boblabs.theme`.
Add a new theme by:

1. Adding a `[data-theme="my-theme"]` block in `styles.css`.
2. Adding an entry to the `THEMES` map in `main.js` (icons + accents).
3. Adding a button to the theme switcher in `index.html`.

## Flocking

The simulation lives in `flocking.js`. It is implemented in plain JS
(canvas 2D) for portability — a Zig/WASM port is feasible but adds a
toolchain for ~no perceived gain at this agent count (≤ 60 boids).

Force model:

```
force = w_sep · separation(close)
      + w_ali · alignment(medium)
      + w_coh · cohesion(far)
      + w_mouse · mouseInfluence(slow → attract, fast → repel)
velocity += force
position += velocity
```

Tunables live at the top of `flocking.js` (`CONFIG`).

## License

MIT — see project root.
