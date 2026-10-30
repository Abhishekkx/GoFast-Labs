import { gsap, MEDIA, fadeInOnEnter } from '../core/motion';

export function initPricing() {
  const engagement = document.getElementById('engagement-model');
  if (engagement) {
    const cards = [...engagement.querySelectorAll('[data-engagement-card]')];
    const mm = gsap.matchMedia();
    mm.add({ motion: MEDIA.motion, reduce: MEDIA.reduce }, ({ conditions: { reduce } }) => {
      if (reduce) {
        fadeInOnEnter(cards, engagement, 'top 82%');
        return;
      }
      gsap.fromTo(cards, { y: 24, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'expo.out',
        scrollTrigger: { trigger: engagement, start: 'top 78%', once: true },
      });
    });
  }

  const section = document.getElementById('pricing');
  if (!section) return;

  const cards = [...section.querySelectorAll('.pricing-card')];
  const settle = () => {
    gsap.set(cards, { clearProps: 'transform,opacity' });
    cards.forEach((card) => card.classList.add('is-settled'));
  };

  const mm = gsap.matchMedia();
  mm.add({ isDesktop: MEDIA.desktop, motion: MEDIA.motion, reduce: MEDIA.reduce }, ({ conditions: { isDesktop, reduce } }) => {
    if (reduce) {
      fadeInOnEnter(cards, section, 'top 75%').eventCallback('onComplete', settle);
      return;
    }
    const restY = (card) => (isDesktop && card.classList.contains('is-featured') ? -8 : 0);
    gsap.fromTo(cards, { opacity: 0, y: (i, card) => restY(card) + 40 }, {
      opacity: 1,
      y: (i, card) => restY(card),
      duration: 0.8,
      stagger: 0.12,
      ease: 'expo.out',
      scrollTrigger: { trigger: section, start: 'top 75%', once: true },
      onComplete: settle,
    });
  });
}
