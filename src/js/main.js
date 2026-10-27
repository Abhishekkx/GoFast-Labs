import '../styles/base.css';

import { initLenis } from './core/lenis';
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

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize foundational systems
  initLenis();
  initCursor();
  initMagneticButtons();
  initNav();
  initTransitions();

  // Run preloader first (if first visit), then trigger hero
  await runPreloader();
  initHero();

  // Initialize all section interactions
  initMarquee();
  initServices();
  initWork();
  initNumbers();
  initProcess();
  initPricing();
  initFooter();
});
