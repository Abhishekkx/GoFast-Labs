import { gsap, MEDIA, fadeInOnEnter } from '../core/motion';

export function initBundles() {
  const section = document.getElementById('bundles');
  if (!section) return;

  const head = section.querySelector('.bundles-head');
  const cards = [...section.querySelectorAll('.bundle-card')];

  const mm = gsap.matchMedia();
  mm.add({ motion: MEDIA.motion, reduce: MEDIA.reduce }, ({ conditions: { reduce } }) => {
    if (reduce) {
      fadeInOnEnter([head, ...cards], section, 'top 80%');
      return;
    }

    gsap.fromTo(head.children, { opacity: 0, y: 24 }, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out',
      scrollTrigger: { trigger: head, start: 'top 85%' },
    });

    const tl = gsap.timeline({ scrollTrigger: { trigger: cards[0], start: 'top 82%' } });
    tl.fromTo(cards, { opacity: 0, y: 48 }, {
      opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'expo.out',
      onComplete: () => gsap.set(cards, { clearProps: 'transform' }),
    });

    // Each combo assembles piece by piece: service, plus, service, plus, service.
    cards.forEach((card, i) => {
      const parts = card.querySelectorAll('.bundle-combo > *');
      tl.fromTo(parts, { opacity: 0, scale: 0.7, rotation: (n, el) => (el.tagName === 'I' ? -90 : 0) }, {
        opacity: 1, scale: 1, rotation: 0, duration: 0.45, stagger: 0.07, ease: 'back.out(2)',
      }, 0.35 + i * 0.12);
    });
  });
}
