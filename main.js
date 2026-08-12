/* Bob Labs landing — i18n, flocking theme, scroll tilt. */
(() => {
  'use strict';

  const I18N = {
    en: {
      'nav.projects': 'Projects', 'nav.contact': 'Contact', 'nav.cta': 'Get in touch',
      'hero.badge': 'Independent lab · Self-hosted · EU',
      'hero.t1': 'Build on ', 'hero.tg': 'infrastructure you own',
      'hero.lede': 'Bob Labs builds and operates focused platforms — AI, farm software and blockchain tooling — each solving one problem precisely. Your data stays yours: self-managed hosting, GDPR by default.',
      'hero.cta.primary': 'Explore the projects →', 'hero.cta.talk': 'Talk to us', 'hero.scroll': 'scroll',
      'projects.title': 'Three platforms. One philosophy.',
      'projects.sub': 'Each project starts from a real need and runs in production — built simple to solve hard problems.',
      'card.poule.tag': 'Voice · Farm app', 'card.poule.status': 'private beta',
      'card.poule.desc': 'A breeding logbook that fills itself as you speak. Dictate your observations and the app structures egg counts, feed and traceability into a compliant farm registry.',
      'card.poule.f1': 'Voice entry, one-tap validation', 'card.poule.f2': 'Live egg, feed & lighting tracking', 'card.poule.f3': 'Compliant registry · PDF export',
      'card.ai.tag': 'Private AI', 'card.ai.status': 'v2 · live',
      'card.ai.desc': 'Open-source platform for multi-agent orchestration, private RAG, sandboxed tool execution, and GPU pipeline management — entirely on your infrastructure.',
      'card.ai.f1': 'Multi-agent orchestration', 'card.ai.f2': 'Private RAG & sandboxed tools', 'card.ai.f3': 'Ollama · vLLM · OpenAI routing',
      'card.tc.tag': 'Blockchain · Pool · Chat', 'card.tc.status': 'live',
      'card.tc.desc': 'Products around the TensorCash ecosystem — the blockchain whose proof-of-work is real LLM inference. Mine with your GPU, chat with the network, more to come.',
      'card.tc.f1': 'Proof-of-inference mining pool', 'card.tc.f2': 'Chat on network inference', 'card.tc.f3': 'More ecosystem tools coming',
      'contact.title': 'Talk to the lab.', 'contact.p': 'Looking for a private deployment or a custom integration? Drop us a line.',
      'foot.sub': 'Private infrastructure · Independent lab', 'foot.copy': '© 2026 Bob Labs — Independent technology lab.', 'foot.tag': 'Made with discipline, not magic.'
    },
    fr: {
      'nav.projects': 'Projets', 'nav.contact': 'Contact', 'nav.cta': 'Nous écrire',
      'hero.badge': 'Labo indépendant · Auto-hébergé · UE',
      'hero.t1': 'Bâtissez sur ', 'hero.tg': 'une infrastructure à vous',
      'hero.lede': 'Bob Labs conçoit et opère des plateformes ciblées — IA, logiciel agricole et outils blockchain — chacune résout un problème précis. Vos données restent les vôtres : hébergement maîtrisé, RGPD par défaut.',
      'hero.cta.primary': 'Découvrir les projets →', 'hero.cta.talk': 'Écrivez-nous', 'hero.scroll': 'défiler',
      'projects.title': 'Trois plateformes. Une philosophie.',
      'projects.sub': "Chaque projet naît d'un besoin réel et tourne en production — simple par conception, pour résoudre des problèmes difficiles.",
      'card.poule.tag': 'App vocale · Élevage', 'card.poule.status': 'bêta privée',
      'card.poule.desc': "Un carnet d'élevage qui se remplit en parlant. Dictez vos observations et l'app structure pontes, aliments et traçabilité dans un registre d'élevage conforme.",
      'card.poule.f1': 'Saisie vocale, validation en un geste', 'card.poule.f2': 'Suivi ponte, aliment & éclairage en direct', 'card.poule.f3': 'Registre conforme · export PDF',
      'card.ai.tag': 'IA privée', 'card.ai.status': 'v2 · en ligne',
      'card.ai.desc': "Plateforme open-source d'orchestration multi-agents, RAG privé, exécution d'outils en bac-à-sable et gestion de pipelines GPU — entièrement sur votre infrastructure.",
      'card.ai.f1': 'Orchestration multi-agents', 'card.ai.f2': 'RAG privé & outils sandboxés', 'card.ai.f3': 'Routage Ollama · vLLM · OpenAI',
      'card.tc.tag': 'Blockchain · Pool · Chat', 'card.tc.status': 'en ligne',
      'card.tc.desc': "Des produits autour de l'écosystème TensorCash — la blockchain dont la preuve de travail est de l'inférence LLM réelle. Minez avec votre GPU, discutez avec le réseau, et plus à venir.",
      'card.tc.f1': 'Pool de minage proof-of-inference', 'card.tc.f2': "Chat sur l'inférence du réseau", 'card.tc.f3': "D'autres outils d'écosystème à venir",
      'contact.title': 'Parlez au lab.', 'contact.p': 'Un déploiement privé ou une intégration sur mesure ? Écrivez-nous.',
      'foot.sub': 'Infrastructure privée · Labo indépendant', 'foot.copy': '© 2026 Bob Labs — Laboratoire technologique indépendant.', 'foot.tag': 'Fait avec discipline, pour durer.'
    }
  };

  function applyLang(lang) {
    const dict = I18N[lang] || I18N.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      if (dict[k] != null) el.textContent = dict[k];
    });
    document.querySelectorAll('[data-lang-btn]').forEach(b => {
      const on = b.getAttribute('data-lang-btn') === lang;
      b.style.background = on ? 'linear-gradient(135deg, #5eead4, #60a5fa)' : 'transparent';
      b.style.color = on ? '#06121a' : '#93a0b3';
      b.setAttribute('aria-pressed', String(on));
    });
    document.documentElement.setAttribute('lang', lang);
    try { localStorage.setItem('boblabs.lang', lang); } catch (e) {}
  }

  // Initial language: stored choice, else browser locale.
  let lang = (navigator.language || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  try { lang = localStorage.getItem('boblabs.lang') || lang; } catch (e) {}
  applyLang(lang);

  document.querySelectorAll('[data-lang-btn]').forEach(b => {
    b.addEventListener('click', () => applyLang(b.getAttribute('data-lang-btn')));
  });

  // Flocking canvas theme (flocking.js loaded just before this script).
  if (typeof window.setFlockTheme === 'function') {
    window.setFlockTheme(['◆','◈','⌘','⌬','▣','◉','⎔','⌖'], '#5eead4', '#60a5fa');
    window.dispatchEvent(new Event('resize'));
  }

  // 3D grid tilt on scroll.
  const scene = document.getElementById('grid-scene');
  if (scene) {
    let ticking = false;
    const update = () => {
      const y = window.scrollY || 0;
      const t = Math.min(1, y / 1200);
      const e = 1 - Math.pow(1 - t, 3);
      scene.style.transform = 'translateY(' + (e * 80).toFixed(1) + 'px) rotateX(' + (e * 65).toFixed(2) + 'deg)';
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }
})();
