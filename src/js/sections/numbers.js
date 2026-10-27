import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initNumbers() {
  const section = document.getElementById('numbers-section');
  if (!section) return;

  const dividers = section.querySelectorAll('.number-divider');
  const statItems = [
    { id: 'stat-40', target: 40, suffix: '+' },
    { id: 'stat-2wk', target: 2, suffix: '-wk' },
    { id: 'stat-12', target: 12, suffix: '' },
    { id: 'stat-98', target: 98, suffix: '%' },
  ];

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 60%',
      once: true,
    },
  });

  // Dividers draw downward first
  if (dividers.length > 0) {
    tl.fromTo(
      dividers,
      { scaleY: 0, transformOrigin: 'top center' },
      { scaleY: 1, duration: 0.8, ease: 'expo.out', stagger: 0.08 }
    );
  }

  // Numbers count up
  statItems.forEach((stat, idx) => {
    const el = document.getElementById(stat.id);
    if (!el) return;

    const counter = { val: 0 };
    tl.to(
      counter,
      {
        val: stat.target,
        duration: 1.5,
        ease: 'power3.out',
        onUpdate: () => {
          el.textContent = Math.round(counter.val) + stat.suffix;
        },
      },
      idx === 0 ? '-=0.4' : '<+=0.1'
    );
  });
}
