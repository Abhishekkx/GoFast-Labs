import '../styles/base.css';

import { ScrollTrigger } from './core/motion';
import { initLenis, bindAnchorLinks, scrollToTarget, findHashTarget } from './core/lenis';
import { initCursor } from './core/cursor';
import { initMagneticButtons } from './core/magnetic';
import { initNav } from './core/nav';
import { runPreloader } from './core/preloader';
import { initTransitions } from './core/transitions';

import { initHero } from './sections/hero';
import { initPageHero } from './sections/pageHero';
import { initMarquee } from './sections/marquee';
import { initServices } from './sections/services';
import { initWork } from './sections/work';
import { initNumbers } from './sections/numbers';
import { initProcess } from './sections/process';
import { initPricing } from './sections/pricing';
import { initFooter } from './sections/footer';
import { initServiceNav } from './sections/serviceNav';
import { initServiceCards } from './sections/serviceCards';
import { initBundles } from './sections/bundles';
import { initFaq } from './sections/faq';
import { initCtaBand } from './sections/ctaBand';
import { initAbout } from './sections/about';

// Lets the browser handle input and paint between section set-ups instead of one long task.
const yieldToMain = () => new Promise((resolve) => setTimeout(resolve, 0));

async function boot() {
  // Shared across every page
  initLenis();
  bindAnchorLinks();
  initCursor();
  initMagneticButtons();
  initNav();
  initTransitions();

  await runPreloader();
  await initHero();
  await initPageHero();
  document.documentElement.classList.add('motion-ready');

  // Page sections (each returns early when its section is absent)
  const sections = [
    initMarquee, initServices, initWork, initNumbers, initProcess, initPricing,
    initServiceNav, initServiceCards, initBundles, initFaq, initCtaBand, initAbout, initFooter,
  ];
  for (const init of sections) {
    init();
    await yieldToMain();
  }

  // Pin positions depend on final text metrics, so re-measure once fonts settle,
  // then honour a /#section link from another page.
  await document.fonts?.ready;
  ScrollTrigger.refresh();
  const target = findHashTarget(window.location.hash);
  if (target) scrollToTarget(target, { immediate: true });
}

boot();
