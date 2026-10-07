# Changelog

All notable changes to the Bob Labs landing page.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versions follow [Semantic Versioning](https://semver.org/). The current
release lives in [`VERSION`](./VERSION).

## [0.4.0] — 2026-10-07

### Changed
- Landing reduced to a single minimalist screen: mark, one-line
  description, contact address. Nothing else.
- Copy: "An independent lab building private AI and sovereign
  infrastructure. Self-hosted. European. Discreet by design." (FR served
  automatically from the browser language.)
- Open Graph / Twitter card regenerated to match (`og-image.png?v=4`);
  meta and manifest copy no longer mention individual projects.
- Version stamp shown bottom-right, read at runtime from `VERSION`.

### Removed
- Project cards (poule-app, AI Infra, TensorCash), nav, footer links.
- EN/FR toggle (language now follows the browser).
- Flocking canvas and 3D grid background (`flocking.js`, `main.js`).

## [0.3.0] — 2026-08-13

### Changed
- New design: hero "Build on infrastructure you own", project cards for
  poule-app / AI Infra / TensorCash.
- Favicons and OG image regenerated with the bL mark.
- Inter and JetBrains Mono self-hosted (no Google Fonts request).

## [0.2.0] — 2026-04-20

### Added
- Initial landing page: hub to the Bob Labs platforms, flocking
  simulation, 3D grid, themes, EN/FR, Docker + nginx.
