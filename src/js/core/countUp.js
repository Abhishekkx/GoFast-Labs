import { gsap } from './motion';

// The markup holds the real values ("40+", "2-wk", "98%"), so the page reads correctly
// without JS; count-ups parse them instead of duplicating them in code.
export const parseStat = (el) => {
  const [, prefix, value, suffix] = el.textContent.trim().match(/^(\D*)(\d+)(.*)$/) ?? [];
  return value ? { el, prefix, target: Number(value), suffix, final: el.textContent.trim() } : null;
};

export const resetStat = (stat) => {
  stat.el.textContent = `${stat.prefix}0${stat.suffix}`;
};

export const restoreStat = (stat) => {
  stat.el.textContent = stat.final;
};

export function countUp(stat, vars = {}) {
  const counter = { value: 0 };
  return gsap.to(counter, {
    value: stat.target,
    duration: 1.5,
    ease: 'power3.out',
    ...vars,
    onUpdate: () => {
      stat.el.textContent = `${stat.prefix}${Math.round(counter.value)}${stat.suffix}`;
    },
  });
}
