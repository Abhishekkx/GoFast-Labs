import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion } from './motion';

const HEADER_OFFSET = -72;
let lenis = null;

export function initLenis() {
  if (prefersReducedMotion()) return null;

  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export const getLenis = () => lenis;

const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

// Bars fixed under the header (e.g. the services switcher) also cover the landing spot.
const scrollOffset = () => {
  let offset = HEADER_OFFSET;
  document.querySelectorAll('[data-scroll-offset]').forEach((bar) => {
    if (bar.getClientRects().length) offset -= bar.offsetHeight;
  });
  return offset;
};

// Layout position, ignoring transforms: an element still waiting for its entrance animation
// is drawn offset from where it will settle.
const layoutTop = (el) => {
  let top = 0;
  for (let node = el; node; node = node.offsetParent) top += node.offsetTop;
  return top;
};

// Scrolls to an element (or 0 for the top). A revealed footer is sticky, so its live
// position is meaningless; it is always fully visible at the end of the page.
export function scrollToTarget(target, { immediate = false } = {}) {
  let top;
  if (target === 0) {
    top = 0;
  } else if (target.classList.contains('site-footer')) {
    top = maxScroll();
  } else {
    top = Math.min(maxScroll(), Math.max(0, layoutTop(target) + scrollOffset()));
  }

  if (lenis) lenis.scrollTo(top, { duration: 1.2, immediate });
  else window.scrollTo({ top, behavior: 'auto' });
}

export function findHashTarget(hash) {
  if (!hash || hash === '#') return null;
  return document.getElementById(decodeURIComponent(hash.slice(1)));
}

// Hash links that point at this page (#id or /#id) scroll smoothly instead of jumping.
export function bindAnchorLinks() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href*="#"]');
    if (!link || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;

    const target = findHashTarget(url.hash);
    if (!target) return;

    event.preventDefault();
    scrollToTarget(target);
    window.history.replaceState(null, '', url.hash);
  });
}
