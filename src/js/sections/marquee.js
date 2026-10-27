import { gsap, prefersReducedMotion } from '../core/motion';
import { getLenis } from '../core/lenis';

const BASE_DURATION = 28;

export function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (!track || prefersReducedMotion()) return;

  // The track holds two identical sets, so -50% lands exactly where it started.
  const loop = gsap.to(track, { xPercent: -50, ease: 'none', duration: BASE_DURATION, repeat: -1 });

  const lenis = getLenis();
  if (!lenis) return;

  let settle = null;
  lenis.on('scroll', ({ velocity = 0 }) => {
    const direction = velocity >= 0 ? 1 : -1;
    const boost = Math.min(Math.abs(velocity) * 0.15, 4);

    settle?.kill();
    gsap.to(loop, {
      timeScale: (1 + boost) * direction,
      duration: 0.15,
      ease: 'power1.out',
      overwrite: true,
      onComplete: () => {
        settle = gsap.to(loop, { timeScale: direction, duration: 1.2, ease: 'power2.out' });
      },
    });
  });
}
