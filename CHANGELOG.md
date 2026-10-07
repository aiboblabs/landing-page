# Changelog

All notable changes to the Bob Labs landing page.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/);
versions follow [Semantic Versioning](https://semver.org/). The current
release lives in [`VERSION`](./VERSION).

## [0.5.0] — 2026-10-07

### Added
- "swarm" switch (bottom-left): an optional animated background, off by
  default, remembered per browser (`localStorage` key `boblabs.swarm`).
  The old flocking simulation returns, toned down: four symbols
  (`₿ $ λ ◇`), slate glyphs with a few teal ones, upright and slower,
  over a faint static grid. When off, the page is exactly v0.4.0.

### Fixed
- Version stamp is now written in the HTML instead of fetched from
  `VERSION`, so it also shows when the page is opened from disk. The
  Docker build fails if the stamp and `VERSION` disagree. Stamp contrast
  raised to match the swarm switch.

### Changed (vs. the v0.3.0 flocking)
- Each symbol is rasterised once into a sprite; frames only blit images
  (no per-glyph `shadowBlur`, double `fillText`, `save/restore`).
- Steering math no longer allocates arrays per call (no GC churn).
- Frame-rate independent: same speed on 60 Hz and 120 Hz screens.
- Loop fully stopped when the switch is off; nothing runs by default.
- Device pixel ratio capped at 2; agent count scales with the viewport.
- `prefers-reduced-motion`: switching on shows a single still frame.

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
