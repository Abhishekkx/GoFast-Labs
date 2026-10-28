import { gsap, MEDIA, fadeInOnEnter } from '../core/motion';
import { parseStat, resetStat, restoreStat, countUp } from '../core/countUp';

export function initNumbers() {
  const section = document.getElementById('numbers-section');
  if (!section) return;

  const row = section.querySelector('.grid');
  const dividers = section.querySelectorAll('.number-divider');
  const stats = [...section.querySelectorAll('[id^="stat-"]')].map(parseStat).filter(Boolean);

  const mm = gsap.matchMedia();
  mm.add({ motion: MEDIA.motion, reduce: MEDIA.reduce }, ({ conditions: { reduce } }) => {
    if (reduce) {
      fadeInOnEnter(row.children, row);
      return;
    }

    stats.forEach(resetStat);

    const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: '60% bottom', once: true } });
    tl.fromTo(dividers, { scaleY: 0 }, { scaleY: 1, duration: 0.8, ease: 'expo.out', stagger: 0.08 });
    stats.forEach((stat, i) => tl.add(countUp(stat), i === 0 ? '-=0.4' : '<+=0.1'));

    return () => stats.forEach(restoreStat);
  });
}
