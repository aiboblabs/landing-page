/* ============================================================
   Bob Labs — flocking simulation (canvas 2D, plain JS)

   force = w_sep · separation(close)
         + w_ali · alignment(medium)
         + w_coh · cohesion(far)
         + w_mouse · mouseInfluence(slow→attract, fast→repel)

   Mouse speed → influence sign:
     - slow (|v| < SLOW)  : agents attracted (curiosity)
     - fast (|v| > FAST)  : agents repelled (startle)
     - in-between         : linear blend
   ============================================================ */

(() => {
  const CONFIG = {
    count:        38,            // resized vs window area
    minCount:     22,
    maxCount:     56,
    rSep:         28,            // close radius (separation)
    rAli:         60,            // medium radius (alignment)
    rCoh:         95,            // far radius (cohesion)
    wSep:         1.55,
    wAli:         0.85,
    wCoh:         0.55,
    wMouse:       0.60,
    maxSpeed:     1.55,
    maxForce:     0.05,
    mouseRadius:  220,
    slowSpeed:    0.6,           // px / ms — below = attract
    fastSpeed:    2.2,           // px / ms — above = full repel
    edgeMargin:   60,
    fontSize:     22,            // glyph size
    glyphAlpha:   0.55,
    trail:        false,         // could fade canvas, off for clarity
  };

  const canvas = document.getElementById('flock');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let W = 0, H = 0;
  let agents = [];
  let glyphs = ['◆'];
  let accent = '#5eead4';
  let accent2 = '#60a5fa';

  // --- Mouse tracking ---
  const mouse = { x: -1e6, y: -1e6, vx: 0, vy: 0, speed: 0, lastT: 0, present: false };

  function onPointer(e) {
    const t = performance.now();
    const x = e.clientX;
    const y = e.clientY;
    if (mouse.present) {
      const dt = Math.max(1, t - mouse.lastT);
      mouse.vx = (x - mouse.x) / dt;
      mouse.vy = (y - mouse.y) / dt;
      mouse.speed = Math.hypot(mouse.vx, mouse.vy);
    }
    mouse.x = x; mouse.y = y; mouse.lastT = t; mouse.present = true;
  }
  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('pointerleave', () => { mouse.present = false; });

  // --- Sizing ---
  function resize() {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    W = canvas.clientWidth = window.innerWidth;
    H = canvas.clientHeight = window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Adapt agent count to viewport
    const target = Math.round(
      Math.min(CONFIG.maxCount,
        Math.max(CONFIG.minCount, (W * H) / 28000))
    );
    if (Math.abs(agents.length - target) > 4) populate(target);
  }
  window.addEventListener('resize', resize);

  function populate(n) {
    agents = [];
    for (let i = 0; i < n; i++) agents.push(makeAgent());
  }
  function makeAgent() {
    const a = Math.random() * Math.PI * 2;
    const s = 0.5 + Math.random() * (CONFIG.maxSpeed - 0.5);
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      g: glyphs[(Math.random() * glyphs.length) | 0],
      rot: 0,
      size: CONFIG.fontSize * (0.85 + Math.random() * 0.45),
    };
  }

  // --- Public hook for theme switching ---
  window.setFlockTheme = function (themeGlyphs, c1, c2) {
    glyphs = (themeGlyphs && themeGlyphs.length) ? themeGlyphs : ['◆'];
    accent = c1 || accent;
    accent2 = c2 || accent2;
    // Reassign existing agents’ glyph
    for (const a of agents) a.g = glyphs[(Math.random() * glyphs.length) | 0];
  };

  // --- Math helpers ---
  function limit(vx, vy, max) {
    const m = Math.hypot(vx, vy);
    if (m > max && m > 0) { const k = max / m; return [vx * k, vy * k]; }
    return [vx, vy];
  }

  // --- Step ---
  function step() {
    // Mouse decay (so released mouse stops counting as fast)
    mouse.speed *= 0.92;

    // Clear (no trail by default — keeps perf snappy and grid visible)
    ctx.clearRect(0, 0, W, H);

    const rSep2 = CONFIG.rSep * CONFIG.rSep;
    const rAli2 = CONFIG.rAli * CONFIG.rAli;
    const rCoh2 = CONFIG.rCoh * CONFIG.rCoh;

    // Mouse influence factor: -1 (attract) → +1 (repel)
    let mInf = 0;
    if (mouse.present) {
      const s = mouse.speed;
      if (s <= CONFIG.slowSpeed) mInf = -1;
      else if (s >= CONFIG.fastSpeed) mInf = 1;
      else mInf = ((s - CONFIG.slowSpeed) / (CONFIG.fastSpeed - CONFIG.slowSpeed)) * 2 - 1;
    }

    for (let i = 0; i < agents.length; i++) {
      const a = agents[i];

      // Accumulators
      let sepX = 0, sepY = 0, sepN = 0;
      let aliX = 0, aliY = 0, aliN = 0;
      let cohX = 0, cohY = 0, cohN = 0;

      for (let j = 0; j < agents.length; j++) {
        if (i === j) continue;
        const b = agents[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 === 0) continue;

        if (d2 < rCoh2) {
          if (d2 < rSep2) {
            // Push away inversely proportional to distance
            const inv = 1 / Math.sqrt(d2);
            sepX += dx * inv; sepY += dy * inv; sepN++;
          } else if (d2 < rAli2) {
            aliX += b.vx; aliY += b.vy; aliN++;
          } else {
            cohX += b.x; cohY += b.y; cohN++;
          }
        }
      }

      let fx = 0, fy = 0;

      if (sepN) {
        sepX /= sepN; sepY /= sepN;
        const m = Math.hypot(sepX, sepY) || 1;
        sepX = (sepX / m) * CONFIG.maxSpeed - a.vx;
        sepY = (sepY / m) * CONFIG.maxSpeed - a.vy;
        [sepX, sepY] = limit(sepX, sepY, CONFIG.maxForce);
        fx += sepX * CONFIG.wSep; fy += sepY * CONFIG.wSep;
      }
      if (aliN) {
        aliX /= aliN; aliY /= aliN;
        const m = Math.hypot(aliX, aliY) || 1;
        aliX = (aliX / m) * CONFIG.maxSpeed - a.vx;
        aliY = (aliY / m) * CONFIG.maxSpeed - a.vy;
        [aliX, aliY] = limit(aliX, aliY, CONFIG.maxForce);
        fx += aliX * CONFIG.wAli; fy += aliY * CONFIG.wAli;
      }
      if (cohN) {
        cohX = cohX / cohN - a.x;
        cohY = cohY / cohN - a.y;
        const m = Math.hypot(cohX, cohY) || 1;
        cohX = (cohX / m) * CONFIG.maxSpeed - a.vx;
        cohY = (cohY / m) * CONFIG.maxSpeed - a.vy;
        [cohX, cohY] = limit(cohX, cohY, CONFIG.maxForce);
        fx += cohX * CONFIG.wCoh; fy += cohY * CONFIG.wCoh;
      }

      // Mouse force
      if (mouse.present) {
        const mdx = a.x - mouse.x;
        const mdy = a.y - mouse.y;
        const md2 = mdx * mdx + mdy * mdy;
        const r2 = CONFIG.mouseRadius * CONFIG.mouseRadius;
        if (md2 < r2 && md2 > 0) {
          const md = Math.sqrt(md2);
          const fall = 1 - md / CONFIG.mouseRadius;     // 0..1
          // mInf > 0 → push away (current direction)
          // mInf < 0 → pull in  (negate)
          const dirX = (mdx / md);
          const dirY = (mdy / md);
          fx += dirX * mInf * fall * CONFIG.wMouse;
          fy += dirY * mInf * fall * CONFIG.wMouse;
        }
      }

      // Apply
      a.vx += fx; a.vy += fy;
      [a.vx, a.vy] = limit(a.vx, a.vy, CONFIG.maxSpeed);
      a.x += a.vx; a.y += a.vy;

      // Soft wrap with margin
      const m = CONFIG.edgeMargin;
      if (a.x < -m) a.x = W + m;
      else if (a.x > W + m) a.x = -m;
      if (a.y < -m) a.y = H + m;
      else if (a.y > H + m) a.y = -m;

      // Visual rotation = velocity heading
      a.rot = Math.atan2(a.vy, a.vx);
    }

    // Draw
    ctx.font = `500 ${CONFIG.fontSize}px "JetBrains Mono", ui-monospace, monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (const a of agents) {
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.rot);
      ctx.font = `500 ${a.size}px "JetBrains Mono", ui-monospace, monospace`;
      // Glow
      ctx.shadowColor = accent;
      ctx.shadowBlur = 12;
      ctx.fillStyle = `rgba(255,255,255,${CONFIG.glyphAlpha})`;
      ctx.fillText(a.g, 0, 0);
      // Inner accent
      ctx.shadowBlur = 0;
      ctx.fillStyle = accent2;
      ctx.globalAlpha = 0.35;
      ctx.fillText(a.g, 0, 0);
      ctx.restore();
    }

    requestAnimationFrame(step);
  }

  // --- Init ---
  resize();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(step);
  } else {
    // One static draw
    populate(CONFIG.minCount);
    step();
  }
})();
