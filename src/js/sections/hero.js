import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitTextIntoWords } from '../core/splitText';

gsap.registerPlugin(ScrollTrigger);

export function initHero() {
  const headlineEl = document.querySelector('.hero-headline');
  const limeBadge = document.querySelector('.hero-lime-badge');
  const leadCopy = document.querySelector('.hero-lead-copy');
  const ctaButtons = document.querySelectorAll('.hero-cta-btn');
  const trustSignals = document.querySelector('.hero-trust-signals');
  const topBadges = document.querySelector('.hero-top-badges');
  const collage = document.querySelector('.hero-collage');
  const screen1 = document.querySelector('.hero-screen-1');
  const screen2 = document.querySelector('.hero-screen-2');
  const screen3 = document.querySelector('.hero-screen-3');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Split headline text into accessible words
  const words = headlineEl ? splitTextIntoWords(headlineEl) : [];

  if (limeBadge) {
    gsap.set(limeBadge, { scaleX: 0, transformOrigin: 'left center' });
  }

  const enterTl = gsap.timeline({ delay: 0.1 });

  if (topBadges) {
    enterTl.fromTo(topBadges, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' });
  }

  if (words.length > 0 && !prefersReducedMotion) {
    enterTl.fromTo(
      words,
      { yPercent: 110 },
      {
        yPercent: 0,
        stagger: 0.05,
        duration: 1.1,
        ease: 'expo.out',
      },
      '-=0.3'
    );
  }

  if (limeBadge && !prefersReducedMotion) {
    enterTl.to(
      limeBadge,
      {
        scaleX: 1,
        duration: 0.7,
        ease: 'expo.out',
      },
      '-=0.4'
    );
  }

  if (leadCopy) {
    enterTl.fromTo(leadCopy, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, '-=0.5');
  }

  if (ctaButtons.length > 0) {
    enterTl.fromTo(
      ctaButtons,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: 'expo.out' },
      '-=0.6'
    );
  }

  if (trustSignals) {
    enterTl.fromTo(trustSignals, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, '-=0.5');
  }

  if (collage && !prefersReducedMotion) {
    enterTl.fromTo(
      collage,
      { opacity: 0, scale: 0.95, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 1.0, ease: 'expo.out' },
      '-=0.8'
    );
  }

  // Parallax on scroll for the 3 collage screens
  if (!prefersReducedMotion && collage) {
    const heroSection = document.querySelector('#hero-section');
    if (heroSection) {
      if (screen1) {
        gsap.to(screen1, {
          y: -35,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      if (screen2) {
        gsap.to(screen2, {
          y: -65,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      if (screen3) {
        gsap.to(screen3, {
          y: -45,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // Headline subtle drift and fade as user scrolls away
      if (headlineEl) {
        gsap.to(headlineEl.closest('.hero-headline-container') || headlineEl, {
          y: -60,
          opacity: 0.2,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: '70% top',
            scrub: true,
          },
        });
      }
    }
  }
}
