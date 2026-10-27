import '../styles/base.css';

import { ScrollTrigger } from './core/motion';
import { initLenis, bindAnchorLinks, scrollToTarget, findHashTarget } from './core/lenis';
import { initCursor } from './core/cursor';
import { initMagneticButtons } from './core/magnetic';
import { initNav } from './core/nav';
import { runPreloader } from './core/preloader';
import { initTransitions } from './core/transitions';

import { initHero } from './sections/hero';
import { initMarquee } from './sections/marquee';
import { initServices } from './sections/services';
import { initWork } from './sections/work';
import { initNumbers } from './sections/numbers';
import { initProcess } from './sections/process';
import { initPricing } from './sections/pricing';
import { initFooter } from './sections/footer';

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
  document.documentElement.classList.add('motion-ready');

  // Homepage sections (each returns early when its section is absent)
  initMarquee();
  initServices();
  initWork();
  initNumbers();
  initProcess();
  initPricing();
  initFooter();

  // Pin positions depend on final text metrics, so re-measure once fonts settle,
  // then honour a /#section link from another page.
  await document.fonts?.ready;
  ScrollTrigger.refresh();
  const target = findHashTarget(window.location.hash);
  if (target) scrollToTarget(target, { immediate: true });
}

boot();
