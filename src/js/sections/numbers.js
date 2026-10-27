import { gsap, MEDIA, fadeInOnEnter } from '../core/motion';

// The markup holds the real values ("40+", "2-wk", "98%"), so the page reads correctly
// without JS; the count-up parses them instead of duplicating them here.
const parseStat = (el) => {
  const [, prefix, value, suffix] = el.textContent.trim().match(/^(\D*)(\d+)(.*)$/) ?? [];
  return value ? { el, prefix, target: Number(value), suffix, final: el.textContent.trim() } : null;
};

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

    stats.forEach((stat) => {
      stat.el.textContent = `${stat.prefix}0${stat.suffix}`;
    });

    const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: '60% bottom', once: true } });
    tl.fromTo(dividers, { scaleY: 0 }, { scaleY: 1, duration: 0.8, ease: 'expo.out', stagger: 0.08 });

    stats.forEach((stat, i) => {
      const counter = { value: 0 };
      tl.to(
        counter,
        {
          value: stat.target,
          duration: 1.5,
          ease: 'power3.out',
          onUpdate: () => {
            stat.el.textContent = `${stat.prefix}${Math.round(counter.value)}${stat.suffix}`;
          },
        },
        i === 0 ? '-=0.4' : '<+=0.1'
      );
    });

    return () => stats.forEach((stat) => {
      stat.el.textContent = stat.final;
    });
  });
}
