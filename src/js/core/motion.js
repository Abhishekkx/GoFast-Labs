import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

export const prefersReducedMotion = () => reduceQuery.matches;

// Shared gsap.matchMedia() conditions so every section uses the same breakpoints.
// GSAP only runs a matchMedia callback when at least one condition matches, so every
// conditions object includes both `motion` and `reduce` (exactly one is always true).
export const MEDIA = {
  desktop: '(min-width: 1024px)',
  mobile: '(max-width: 767px)',
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
};

// SplitText measures lines, so wait for the display font (capped so a slow font never blocks).
export const fontsReady = () =>
  Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1200))]);

// Hero copy enters with a wipe and a small rise rather than a fade, so text is never shown
// at partial contrast while it animates.
export function wipeIn(targets, { fromY = 20, ...vars } = {}) {
  return gsap.fromTo(targets, { clipPath: 'inset(0% 0% 100% 0%)', y: fromY }, {
    clipPath: 'inset(0% 0% 0% 0%)',
    y: 0,
    duration: 0.8,
    ease: 'expo.out',
    ...vars,
    onComplete: () => gsap.set(targets, { clearProps: 'clipPath' }),
  });
}

// The reduced-motion stand-in for every entrance: a plain opacity fade, no movement.
export function fadeInOnEnter(targets, trigger, start = 'top 85%') {
  return gsap.from(targets, {
    opacity: 0,
    duration: 0.6,
    ease: 'power1.out',
    stagger: 0.05,
    scrollTrigger: { trigger, start, once: true },
  });
}

export { gsap, ScrollTrigger, SplitText };
