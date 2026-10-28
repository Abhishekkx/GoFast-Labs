import { gsap, prefersReducedMotion } from './motion';
import { getLenis } from './lenis';
import { applyTextRoll } from './textRoll';

const SOLID_CLASSES = ['bg-bg/95', 'backdrop-blur-md', 'border-b', 'border-line', 'shadow-sm'];

const normalisePath = (path) => path.replace(/\.html$/, '').replace(/\/index$/, '').replace(/\/$/, '') || '/';

// Marks nav links that point at the current page (page links only, not /#section links).
function markCurrentPage() {
  const here = normalisePath(window.location.pathname);
  document.querySelectorAll('.site-header nav a, #mobile-menu nav a, .site-footer nav a').forEach((link) => {
    const url = new URL(link.href, window.location.href);
    if (!url.hash && normalisePath(url.pathname) === here) link.setAttribute('aria-current', 'page');
  });
}

export function initNav() {
  const header = document.querySelector('.site-header');
  const progressBar = document.getElementById('scroll-progress');
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const menuLinks = menu ? [...menu.querySelectorAll('.mobile-nav-link')] : [];
  const setProgress = progressBar ? gsap.quickSetter(progressBar, 'scaleX') : () => {};

  let lastY = window.scrollY;
  let solid = false;
  let hidden = false;
  let menuOpen = false;

  const setHidden = (value) => {
    if (!header || hidden === value) return;
    hidden = value;
    header.style.transform = value ? 'translateY(-100%)' : '';
    // Bars docked under the header follow it up and down.
    document.documentElement.classList.toggle('header-hidden', value);
  };

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    setProgress(max > 0 ? Math.min(1, y / max) : 0);

    if (header) {
      const shouldBeSolid = y > 80;
      if (shouldBeSolid !== solid) {
        solid = shouldBeSolid;
        header.classList.toggle('bg-transparent', !solid);
        SOLID_CLASSES.forEach((cls) => header.classList.toggle(cls, solid));
      }
      setHidden(y > 120 && y > lastY && !menuOpen);
    }
    lastY = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Keyboard users tabbing into a hidden header bring it back.
  header?.addEventListener('focusin', () => setHidden(false));

  markCurrentPage();
  applyTextRoll(document.querySelectorAll('.nav-link-roll'), 'text-ink font-semibold');

  if (!toggle || !menu) return;

  const setMenu = (open) => {
    menuOpen = open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    menu.inert = !open;
    menu.classList.toggle('opacity-0', !open);
    menu.classList.toggle('pointer-events-none', !open);
    menu.classList.toggle('opacity-100', open);
    menu.classList.toggle('pointer-events-auto', open);
    document.body.style.overflow = open ? 'hidden' : '';

    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      setHidden(false);
      if (!prefersReducedMotion()) {
        gsap.fromTo(menuLinks, { y: 30, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'expo.out' });
      }
    } else {
      lenis?.start();
    }
  };

  toggle.addEventListener('click', () => setMenu(!menuOpen));
  menuLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuOpen) {
      setMenu(false);
      toggle.focus();
    }
  });

  window.matchMedia('(min-width: 1024px)').addEventListener('change', (event) => {
    if (event.matches && menuOpen) setMenu(false);
  });
}
