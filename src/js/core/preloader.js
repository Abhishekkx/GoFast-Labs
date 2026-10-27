import { gsap } from 'gsap';

export function runPreloader() {
  return new Promise((resolve) => {
    const preloader = document.getElementById('preloader');
    const countEl = document.getElementById('preloader-count');
    const streakEl = document.getElementById('preloader-streak');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasSeenPreloader = sessionStorage.getItem('gofast_preloader_seen');

    if (!preloader || prefersReducedMotion || hasSeenPreloader) {
      if (preloader) preloader.style.display = 'none';
      resolve();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('gofast_preloader_seen', 'true');
        if (preloader) preloader.style.display = 'none';
        resolve();
      },
    });

    const counterObj = { val: 0 };

    tl.to(counterObj, {
      val: 100,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (countEl) {
          const formatted = Math.floor(counterObj.val).toString().padStart(3, '0');
          countEl.textContent = formatted;
        }
      },
    });

    if (streakEl) {
      tl.fromTo(
        streakEl,
        { width: '0%', left: '0%' },
        { width: '100%', duration: 1.2, ease: 'expo.inOut' },
        0
      );
    }

    tl.to(preloader, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power4.inOut',
    });
  });
}
