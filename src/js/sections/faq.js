import { gsap, ScrollTrigger, MEDIA, fadeInOnEnter } from '../core/motion';

export function initFaq() {
  const section = document.getElementById('faq');
  const list = section?.querySelector('.faq-list');
  if (!list) return;

  const items = [...list.querySelectorAll('.faq-item')];

  const setOpen = (item, open) => {
    item.classList.toggle('is-open', open);
    item.querySelector('.faq-trigger').setAttribute('aria-expanded', String(open));
    item.querySelector('.faq-panel').inert = !open;
  };

  items.forEach((item) => {
    setOpen(item, item.classList.contains('is-open'));
    item.querySelector('.faq-trigger').addEventListener('click', () => {
      setOpen(item, !item.classList.contains('is-open'));
    });
    // Panels animate their grid row; once the height settles, everything below has moved.
    item.querySelector('.faq-panel').addEventListener('transitionend', (event) => {
      if (event.propertyName === 'grid-template-rows') ScrollTrigger.refresh();
    });
  });

  const intro = section.querySelector('.faq-intro');
  const mm = gsap.matchMedia();
  mm.add({ motion: MEDIA.motion, reduce: MEDIA.reduce }, ({ conditions: { reduce } }) => {
    if (reduce) {
      fadeInOnEnter([intro, ...items], section, 'top 80%');
      return;
    }

    gsap.fromTo(intro.children, { opacity: 0, y: 24 }, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'expo.out',
      scrollTrigger: { trigger: section, start: 'top 80%' },
    });
    gsap.fromTo(items, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.07, ease: 'expo.out',
      scrollTrigger: { trigger: list, start: 'top 85%' },
    });
  });
}
