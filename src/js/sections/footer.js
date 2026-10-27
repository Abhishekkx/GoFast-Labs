import { gsap, ScrollTrigger, MEDIA } from '../core/motion';
import { applyTextRoll } from '../core/textRoll';

export function initFooter() {
  const footer = document.getElementById('contact-hub');
  const cover = document.querySelector('.page-cover');
  if (!footer) return;

  applyTextRoll(footer.querySelectorAll('.footer-link-roll'), 'text-primary-container font-semibold');

  // The page lifts off a footer parked behind it, but only when the footer fits the
  // viewport; a taller footer (most phones) scrolls normally so its top stays reachable.
  const root = document.documentElement;
  const updateReveal = () => {
    const fits = footer.offsetHeight <= window.innerHeight;
    if (root.classList.contains('footer-reveal') === fits) return;
    root.classList.toggle('footer-reveal', fits);
    ScrollTrigger.refresh();
  };
  updateReveal();
  new ResizeObserver(updateReveal).observe(footer);
  window.addEventListener('resize', updateReveal);

  const letters = footer.querySelectorAll('.climax-char');
  const cta = footer.querySelector('.footer-cta-btn');
  const columns = footer.querySelectorAll('.footer-col');
  const climaxRow = footer.firstElementChild;
  const detailsRow = columns[0]?.parentElement;

  // A sticky footer has no stable scroll position of its own, so every part is triggered by
  // the page cover's bottom edge, timed to when that part actually comes into view: uncovered
  // from behind the page (reveal mode) or scrolled up from below (normal flow).
  const startFor = (row) => () => {
    let top = 0;
    for (let node = row; node && node !== footer; node = node.offsetParent) top += node.offsetTop;
    const line = root.classList.contains('footer-reveal')
      ? window.innerHeight - footer.offsetHeight + top + row.offsetHeight * 0.6
      : window.innerHeight * 0.9 - top - row.offsetHeight * 0.4;
    return `bottom ${Math.round(line)}px`;
  };
  const triggerFor = (row) => (cover
    ? { trigger: cover, start: startFor(row), invalidateOnRefresh: true }
    : { trigger: row, start: 'top 85%' });

  const mm = gsap.matchMedia();
  mm.add({ motion: MEDIA.motion, reduce: MEDIA.reduce }, ({ conditions: { reduce } }) => {
    if (reduce) {
      gsap.from([...letters, cta], { opacity: 0, duration: 0.6, scrollTrigger: { ...triggerFor(climaxRow), once: true } });
      if (detailsRow) gsap.from(columns, { opacity: 0, duration: 0.6, scrollTrigger: { ...triggerFor(detailsRow), once: true } });
      return;
    }

    gsap.timeline({ scrollTrigger: triggerFor(climaxRow) })
      .fromTo(letters, { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.03, ease: 'expo.out' })
      .fromTo(cta, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.7)' }, '-=0.5');

    if (detailsRow) {
      gsap.fromTo(columns, { opacity: 0, y: 20 }, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'expo.out',
        scrollTrigger: triggerFor(detailsRow),
      });
    }
  });
}
