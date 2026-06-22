/* ============================================================
   Bob Labs — landing page interactions
   - Scroll-driven 3D tilt of the background grid
   - Card hover light follow
   - Theme switcher (tech / app / agri) — persists in localStorage
   - Language switcher (EN / FR) — persists in localStorage
   ============================================================ */

(() => {

  // ----------------------------------------------------------------
  // 1) Scroll-driven 3D tilt
  // ----------------------------------------------------------------
  const scene = document.querySelector('.grid-scene');
  const MAX_TILT = 65;
  const SCROLL_RANGE = 1200;
  const MAX_SHIFT = 80;
  let ticking = false;

  function updateTilt() {
    const y = window.scrollY || 0;
    const t = Math.min(1, y / SCROLL_RANGE);
    const eased = 1 - Math.pow(1 - t, 3);
    if (scene) {
      scene.style.setProperty('--tilt', (eased * MAX_TILT).toFixed(2) + 'deg');
      scene.style.setProperty('--shift', (eased * MAX_SHIFT).toFixed(1) + 'px');
    }
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateTilt); ticking = true; }
  }, { passive: true });
  updateTilt();

  // ----------------------------------------------------------------
  // 2) Card hover glow follow
  // ----------------------------------------------------------------
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    });
  });

  // ----------------------------------------------------------------
  // 3) Themes
  // ----------------------------------------------------------------
  const THEMES = {
    tech: {
      glyphs: ['◆', '◈', '⌘', '⌬', '▣', '◉', '⎔', '⌖'],
      accent:  '#5eead4',
      accent2: '#60a5fa',
    },
    app: {
      glyphs: ['⬮', '⬯', '◯', '●', '○', '◐', '◑', '◉'],
      accent:  '#fbbf24',
      accent2: '#f97316',
    },
    agri: {
      glyphs: ['❀', '✿', '☘', '✾', '❁', '⚘', '✽', '❄'],
      accent:  '#34d399',
      accent2: '#84cc16',
    },
  };

  const STORE_THEME = 'boblabs.theme';
  const STORE_LANG  = 'boblabs.lang';

  function applyTheme(name) {
    if (!THEMES[name]) name = 'tech';
    document.documentElement.setAttribute('data-theme', name);
    document.querySelectorAll('[data-theme-btn]').forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.themeBtn === name));
    });
    const t = THEMES[name];
    if (typeof window.setFlockTheme === 'function') {
      window.setFlockTheme(t.glyphs, t.accent, t.accent2);
    }
    try { localStorage.setItem(STORE_THEME, name); } catch (_) {}
  }

  document.querySelectorAll('[data-theme-btn]').forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.themeBtn));
  });

  // ----------------------------------------------------------------
  // 4) i18n (EN / FR)
  // ----------------------------------------------------------------
  function applyLang(lang) {
    const dict = (window.I18N && window.I18N[lang]) || (window.I18N && window.I18N.en) || {};
    if (!dict) return;
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-lang-btn]').forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.langBtn === lang));
    });
    try { localStorage.setItem(STORE_LANG, lang); } catch (_) {}
  }

  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.langBtn));
  });

  // ----------------------------------------------------------------
  // 5) Reveal-on-scroll — uses IntersectionObserver, respects reduced-motion.
  //    Adds .is-in to elements with [data-reveal]; siblings get a staggered --i.
  // ----------------------------------------------------------------
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll('[data-reveal]');
  revealTargets.forEach(el => el.classList.add('reveal'));

  // Set --i per group so stagger reads naturally (cards 0..2, manifesto 0..3).
  document.querySelectorAll('[data-reveal-group]').forEach(group => {
    group.querySelectorAll('[data-reveal]').forEach((el, i) => {
      el.style.setProperty('--i', i);
    });
  });

  if (prefersReduced) {
    revealTargets.forEach(el => el.classList.add('is-in'));
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-in'));
  }

  // ----------------------------------------------------------------
  // 6) Init from storage / browser
  // ----------------------------------------------------------------
  let savedTheme = 'tech';
  let savedLang  = (navigator.language || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  try {
    savedTheme = localStorage.getItem(STORE_THEME) || savedTheme;
    savedLang  = localStorage.getItem(STORE_LANG)  || savedLang;
  } catch (_) {}

  // Defer one tick so flocking.js has registered window.setFlockTheme
  requestAnimationFrame(() => {
    applyTheme(savedTheme);
    applyLang(savedLang);
  });

})();
