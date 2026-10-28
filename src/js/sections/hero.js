import { gsap, SplitText, MEDIA, prefersReducedMotion, fontsReady, wipeIn } from '../core/motion';

const PARALLAX = [-35, -65, -45];

export async function initHero() {
  const hero = document.getElementById('hero-section');
  if (!hero) return;

  const q = (selector) => hero.querySelector(selector);
  const headline = q('.hero-headline');
  const limeBadge = q('.hero-lime-badge');
  const collage = q('.hero-collage');
  const screens = [q('.hero-screen-1'), q('.hero-screen-2'), q('.hero-screen-3')].filter(Boolean);
  const supporting = [q('.hero-lead-copy'), ...hero.querySelectorAll('.hero-cta-btn'), q('.hero-trust-signals'), q('.hero-bottom-bar')].filter(Boolean);

  if (prefersReducedMotion()) {
    document.documentElement.classList.add('motion-ready');
    gsap.from(hero.querySelectorAll('[data-hero-reveal]'), { opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power1.out' });
    return;
  }

  await fontsReady();

  // Split the whole headline, "Fast." included, so the masked lines wrap exactly like the
  // live text and reverting afterwards causes no layout shift. The h1 keeps its aria-label.
  const split = SplitText.create(headline, { type: 'lines,words', mask: 'lines', aria: 'none' });

  const intro = gsap.timeline({ delay: 0.05 });
  intro
    .set(headline, { opacity: 1 })
    .add(wipeIn(q('.hero-top-badges'), { fromY: -10, duration: 0.6 }))
    .fromTo(
      split.words,
      { yPercent: 110 },
      {
        yPercent: 0,
        stagger: 0.06,
        duration: 1.1,
        ease: 'expo.out',
        // Masks are only needed for the entrance; reverting restores natural wrapping on resize.
        onComplete: () => split.revert(),
      },
      '-=0.3'
    )
    .fromTo(limeBadge, { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.7, ease: 'expo.out' }, '-=0.45')
    .add(wipeIn(supporting, { stagger: 0.08 }), '-=0.55')
    // A wipe rather than a fade too: its small labels never sit at partial contrast.
    .fromTo(
      collage,
      { clipPath: 'inset(100% 0% 0% 0% round 20px)', scale: 0.94, rotation: -2.5, y: 30 },
      {
        clipPath: 'inset(0% 0% 0% 0% round 20px)',
        scale: 1,
        rotation: 0,
        y: 0,
        duration: 1.2,
        ease: 'expo.out',
        onComplete: () => gsap.set(collage, { clearProps: 'clipPath' }),
      },
      '-=1.1'
    );

  // Start states are applied; the CSS pre-hide can step aside without a flash.
  document.documentElement.classList.add('motion-ready');

  const mm = gsap.matchMedia();
  mm.add({ isDesktop: MEDIA.desktop, isMobile: MEDIA.mobile, motion: MEDIA.motion }, ({ conditions }) => {
    const strength = conditions.isDesktop ? 1 : conditions.isMobile ? 0.35 : 0.6;
    const scrub = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };

    screens.forEach((screen, i) => {
      gsap.to(screen, { y: PARALLAX[i] * strength, ease: 'none', scrollTrigger: { ...scrub } });
    });

    gsap.to(q('.hero-headline-container'), {
      y: -60 * strength,
      opacity: 0.35,
      ease: 'none',
      scrollTrigger: { ...scrub, end: '70% top' },
    });
  });
}
