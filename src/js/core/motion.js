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
