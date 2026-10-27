import { gsap, MEDIA, fadeInOnEnter } from '../core/motion';

export function initWork() {
  const cards = [...document.querySelectorAll('.work-card')];
  if (!cards.length) return;

  const mm = gsap.matchMedia();
  mm.add({ motion: MEDIA.motion, reduce: MEDIA.reduce }, ({ conditions: { reduce } }) => {
    if (reduce) {
      cards.forEach((card) => fadeInOnEnter(card, card));
      return;
    }

    const cleanups = cards.map((card) => {
      const wrap = card.querySelector('.work-image-wrap');
      const image = card.querySelector('.work-image');

      const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 82%' } });
      if (wrap && image) {
        tl.fromTo(wrap, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.out' }, 0)
          .fromTo(image, { scale: 1.15 }, { scale: 1, duration: 1.2, ease: 'expo.out' }, 0);
      }
      tl.fromTo(card.querySelectorAll('.work-title, .work-meta'), { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'expo.out' }, '-=0.7')
        .fromTo(card.querySelector('.work-desc'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, '-=0.5')
        .fromTo(card.querySelectorAll('.work-tag'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'expo.out' }, '-=0.4');

      if (!image) return () => {};
      // Hover zoom runs through GSAP: the reveal owns the image transform, so a CSS hover can't.
      const zoomIn = () => gsap.to(image, { scale: 1.05, duration: 0.7, ease: 'expo.out', overwrite: 'auto' });
      const zoomOut = () => gsap.to(image, { scale: 1, duration: 0.7, ease: 'expo.out', overwrite: 'auto' });
      card.addEventListener('mouseenter', zoomIn);
      card.addEventListener('mouseleave', zoomOut);
      return () => {
        card.removeEventListener('mouseenter', zoomIn);
        card.removeEventListener('mouseleave', zoomOut);
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  });
}
