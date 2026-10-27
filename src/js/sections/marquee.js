import { gsap } from 'gsap';
import { getLenis } from '../core/lenis';

export function initMarquee() {
  const marqueeInner = document.querySelector('.marquee-track');
  if (!marqueeInner) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const baseDuration = 28;
  const loopTween = gsap.to(marqueeInner, {
    xPercent: -50,
    ease: 'none',
    duration: baseDuration,
    repeat: -1,
  });

  const lenis = getLenis();
  let returnTween = null;

  if (lenis) {
    lenis.on('scroll', (e) => {
      const velocity = e.velocity || 0;
      // Direction: positive scroll moves left (timeScale > 0), negative scroll moves right (timeScale < 0)
      const direction = velocity >= 0 ? 1 : -1;
      const speedBoost = Math.min(Math.abs(velocity) * 0.15, 4.0);
      const targetTimeScale = (1 + speedBoost) * direction;

      if (returnTween) returnTween.kill();

      gsap.to(loopTween, {
        timeScale: targetTimeScale,
        duration: 0.15,
        ease: 'power1.out',
        overwrite: 'auto',
        onComplete: () => {
          returnTween = gsap.to(loopTween, {
            timeScale: 1 * direction,
            duration: 1.2,
            ease: 'power2.out',
          });
        },
      });
    });
  }
}
