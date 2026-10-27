import { gsap, SplitText, MEDIA, prefersReducedMotion } from '../core/motion';

const PARALLAX = [-35, -65, -45];

// SplitText measures lines, so wait for the display font (capped so a slow font never blocks).
const fontsReady = () =>
  Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1200))]);

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
    .fromTo(q('.hero-top-badges'), { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' })
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
    .fromTo(supporting, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.8, ease: 'expo.out' }, '-=0.55')
    .fromTo(
      collage,
      { opacity: 0, scale: 0.94, rotation: -2.5, y: 30 },
      { opacity: 1, scale: 1, rotation: 0, y: 0, duration: 1.2, ease: 'expo.out' },
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
