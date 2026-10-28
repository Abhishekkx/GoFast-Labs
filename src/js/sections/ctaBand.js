import { gsap, SplitText, MEDIA, fadeInOnEnter } from '../core/motion';

// Closing call band: the ink panel grows into place as it scrolls up, then its copy rises.
export function initCtaBand() {
  const band = document.querySelector('.cta-band');
  if (!band) return;

  const title = band.querySelector('.cta-title');
  const reveals = band.querySelectorAll('.cta-reveal');

  const mm = gsap.matchMedia();
  mm.add({ motion: MEDIA.motion, reduce: MEDIA.reduce }, ({ conditions: { reduce } }) => {
    if (reduce) {
      fadeInOnEnter([title, ...reveals], band, 'top 80%');
      return;
    }

    gsap.fromTo(band, { scale: 0.92 }, {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: band, start: 'top bottom', end: 'top 55%', scrub: true },
    });

    const split = SplitText.create(title, { type: 'lines,words', mask: 'lines' });
    gsap.timeline({ scrollTrigger: { trigger: band, start: 'top 70%' } })
      .fromTo(split.words, { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.06, ease: 'expo.out', onComplete: () => split.revert() })
      .fromTo(reveals, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out' }, '-=0.7');

    return () => split.revert();
  });
}
