import { gsap, prefersReducedMotion } from './motion';
import { scrollToTarget } from './lenis';

const FLAG = 'gofast_transition';

const setFlag = (on) => {
  try {
    if (on) window.sessionStorage.setItem(FLAG, '1');
    else window.sessionStorage.removeItem(FLAG);
  } catch {
    // Storage blocked: the next page just loads without the wipe-out.
  }
};

// Ink panel that wipes up over the page on internal link clicks (data-page-link) and
// continues up off the next page once it loads. Pages share this via the chrome partial.
export function initTransitions() {
  const panel = document.getElementById('page-transition');
  if (!panel) return;
  const root = document.documentElement;

  // GSAP would read the CSS translateY(100%) as a pixel `y` and stack yPercent on top of it;
  // zero it so yPercent alone drives the panel.
  gsap.set(panel, { y: 0 });

  if (root.classList.contains('is-arriving')) {
    setFlag(false);
    gsap.fromTo(
      panel,
      { yPercent: 0 },
      {
        yPercent: -100,
        duration: 0.8,
        delay: 0.1,
        ease: 'power4.inOut',
        onComplete: () => {
          root.classList.remove('is-arriving');
          gsap.set(panel, { yPercent: 100 });
        },
      }
    );
  } else {
    gsap.set(panel, { yPercent: 100 });
  }

  // Back/forward cache restores the page mid-wipe; reset it.
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    setFlag(false);
    root.classList.remove('is-arriving');
    panel.classList.remove('is-active');
    gsap.set(panel, { yPercent: 100 });
  });

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-page-link]');
    if (!link || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank') return;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;

    if (url.pathname === window.location.pathname && !url.hash) {
      event.preventDefault();
      scrollToTarget(0);
      return;
    }

    if (prefersReducedMotion()) return;

    event.preventDefault();
    setFlag(true);
    panel.classList.add('is-active');
    gsap.fromTo(
      panel,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: 0.6,
        ease: 'power4.inOut',
        onComplete: () => {
          window.location.href = url.href;
        },
      }
    );
  });
}
