import { gsap, MEDIA, fadeInOnEnter } from '../core/motion';

// Keep the About page motion to opacity and transforms; no per-frame layout work.
export function initAbout() {
  const section = document.querySelector('.about-team');
  if (!section) return;

  const cards = [...section.querySelectorAll('[data-about-card]')];
  const steps = [...document.querySelectorAll('[data-about-step]')];
  const toolGroups = [...document.querySelectorAll('[data-about-tools]')];
  const rows = [...document.querySelectorAll('[data-about-row]')];
  const direct = document.querySelector('.about-direct');
  const cta = document.querySelector('.about-cta');
  const flowRail = document.querySelector('.about-flow-rail');

  const measureFlow = () => {
    if (!flowRail) return;
    const distance = Math.max(0, flowRail.clientWidth - 9);
    flowRail.style.setProperty('--flow-distance', `${distance}px`);
  };

  const mm = gsap.matchMedia();
  mm.add({ motion: MEDIA.motion, reduce: MEDIA.reduce }, ({ conditions: { reduce } }) => {
    measureFlow();
    window.addEventListener('resize', measureFlow, { passive: true });
    if (reduce) {
      fadeInOnEnter(cards, section, 'top 82%');
      fadeInOnEnter(rows, rows[0], 'top 88%');
      fadeInOnEnter([direct, cta].filter(Boolean), section, 'top 90%');
      fadeInOnEnter(steps, document.querySelector('.about-flow'), 'top 82%');
      fadeInOnEnter(toolGroups, document.querySelector('.about-toolkit'), 'top 82%');
      return () => window.removeEventListener('resize', measureFlow);
    }

    const intro = document.querySelector('.about-team > .grid');
    if (intro) gsap.fromTo(intro, { y: 18, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.65, ease: 'expo.out',
      scrollTrigger: { trigger: intro, start: 'top 86%', once: true },
    });
    const flow = document.querySelector('.about-flow');
    if (flow) {
      gsap.fromTo(flow.querySelectorAll('.about-flow-step'), { y: 18, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: 'expo.out',
        scrollTrigger: { trigger: flow, start: 'top 78%', once: true },
      });
      gsap.fromTo(flow.querySelector('h2'), { y: 14, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, ease: 'expo.out',
        scrollTrigger: { trigger: flow, start: 'top 84%', once: true },
      });
    }
    gsap.fromTo(cards, { y: 24, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'expo.out',
      scrollTrigger: { trigger: section, start: 'top 76%', once: true },
    });
    rows.forEach((row) => gsap.fromTo(row, { x: 18, opacity: 0 }, {
      x: 0, opacity: 1, duration: 0.55, ease: 'expo.out',
      scrollTrigger: { trigger: row, start: 'top 88%', once: true },
    }));
    if (direct) gsap.fromTo(direct, { y: 24, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, ease: 'expo.out',
      scrollTrigger: { trigger: direct, start: 'top 82%', once: true },
    });
    if (cta) gsap.fromTo(cta, { y: 20, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.7, ease: 'expo.out',
      scrollTrigger: { trigger: cta, start: 'top 88%', once: true },
    });
    toolGroups.forEach((group) => gsap.fromTo(group, { x: 18, opacity: 0 }, {
      x: 0, opacity: 1, duration: 0.55, ease: 'expo.out',
      scrollTrigger: { trigger: group, start: 'top 88%', once: true },
    }));
    return () => window.removeEventListener('resize', measureFlow);
  });
}
