import { gsap } from './motion';
import { getLenis } from './lenis';

const SEEN_KEY = 'gofast_preloader_seen';

// Runs once per session (the head boot script adds .preloader-done on repeat visits and
// for reduced motion). Resolves as the layer starts lifting so the hero enters underneath it.
export function runPreloader() {
  return new Promise((resolve) => {
    const root = document.documentElement;
    const preloader = document.getElementById('preloader');
    const countEl = document.getElementById('preloader-count');
    const streak = document.getElementById('preloader-streak');

    if (!preloader || root.classList.contains('preloader-done')) {
      resolve();
      return;
    }

    const lenis = getLenis();
    lenis?.stop();

    const counter = { value: 0 };
    gsap
      .timeline({
        onComplete: () => {
          try {
            window.sessionStorage.setItem(SEEN_KEY, 'true');
          } catch {
            // Storage blocked: the preloader simply runs again next visit.
          }
          root.classList.add('preloader-done');
          lenis?.start();
        },
      })
      .to(counter, {
        value: 100,
        duration: 1.2,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (countEl) countEl.textContent = String(Math.floor(counter.value)).padStart(3, '0');
        },
      })
      .fromTo(streak, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'expo.inOut' }, 0)
      .to(preloader, { yPercent: -100, duration: 0.8, ease: 'power4.inOut' })
      .call(resolve, null, '-=0.55');
  });
}
