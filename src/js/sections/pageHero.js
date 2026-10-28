import { gsap, ScrollTrigger, SplitText, prefersReducedMotion, fontsReady, wipeIn } from '../core/motion';

// Intro for inner-page heroes ([data-page-hero]): the title rises word by word behind line
// masks, the rest wipes in, then [data-map-row] items rise out of their own masks as they
// come into view (slides, not fades, so text is never shown at partial contrast).
export async function initPageHero() {
  const hero = document.querySelector('[data-page-hero]');
  if (!hero) return;

  const title = hero.querySelector('.page-hero-title');
  const reveals = [...hero.querySelectorAll('[data-hero-reveal]')];
  const rows = [...hero.querySelectorAll('[data-map-row]')];

  if (prefersReducedMotion() || !title) {
    gsap.from(reveals, { opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power1.out' });
    return;
  }

  await fontsReady();

  const split = SplitText.create(title, { type: 'lines,words', mask: 'lines' });
  const map = reveals.find((el) => rows.length && el.contains(rows[0]));
  const rest = reveals.filter((el) => el !== title && el !== map);
  const inner = (row) => row.firstElementChild;
  gsap.set(rows, { overflow: 'hidden' });
  gsap.set(rows.map(inner), { yPercent: 110 });
  if (map) gsap.set(map, { opacity: 0 });

  const revealRows = () => ScrollTrigger.batch(rows, {
    start: 'top 95%',
    once: true,
    onEnter: (batch) => gsap.to(batch.map(inner), {
      yPercent: 0,
      stagger: 0.035,
      duration: 0.8,
      ease: 'expo.out',
      // Unclip afterwards so focus outlines on the links aren't cut off.
      onComplete: () => gsap.set(batch, { clearProps: 'overflow' }),
    }),
  });

  gsap.timeline({ delay: 0.05 })
    .set(title, { opacity: 1 })
    .add(wipeIn(rest[0], { fromY: -10, duration: 0.6 }))
    .fromTo(
      split.words,
      { yPercent: 110 },
      // Masks are only needed for the entrance; reverting restores natural wrapping on resize.
      { yPercent: 0, stagger: 0.06, duration: 1.1, ease: 'expo.out', onComplete: () => split.revert() },
      '-=0.3'
    )
    .add(wipeIn(rest.slice(1), { stagger: 0.08 }), '-=0.7')
    .set(map ?? [], { opacity: 1 }, '-=0.5')
    .call(revealRows, null, '<');
}
