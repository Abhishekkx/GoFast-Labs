import { gsap, prefersReducedMotion } from './motion';

// Splits text into per-character cells so changed characters slide vertically on their own.
// Screen readers get the plain value from a visually hidden copy.
export function createRoller(el) {
  let current = el.textContent.trim();
  const label = document.createElement('span');
  label.className = 'sr-only';
  const visual = document.createElement('span');
  visual.setAttribute('aria-hidden', 'true');

  const cell = (char) => {
    const wrapper = document.createElement('span');
    wrapper.className = 'roll-char';
    const glyph = document.createElement('span');
    glyph.textContent = char;
    wrapper.append(glyph);
    return wrapper;
  };
  const build = (text) => visual.replaceChildren(...[...text].map(cell));

  label.textContent = current;
  build(current);
  el.replaceChildren(label, visual);

  return (next) => {
    if (next === current) return;
    const previous = current;
    current = next;
    label.textContent = next;

    if (prefersReducedMotion() || previous.length !== next.length) {
      build(next);
      return;
    }

    [...next].forEach((char, i) => {
      const wrapper = visual.children[i];
      // Settle any roll still running from a quick double change.
      [...wrapper.children].slice(0, -1).forEach((stale) => stale.remove());
      const outgoing = wrapper.firstElementChild;
      gsap.killTweensOf(outgoing);
      gsap.set(outgoing, { yPercent: 0 });
      if (char === previous[i]) return;

      const incoming = document.createElement('span');
      incoming.textContent = char;
      wrapper.append(incoming);
      gsap.timeline({ onComplete: () => outgoing.remove(), delay: i * 0.035 })
        .to(outgoing, { yPercent: -100, duration: 0.4, ease: 'power3.inOut' }, 0)
        .fromTo(incoming, { yPercent: 100 }, { yPercent: 0, duration: 0.4, ease: 'power3.inOut' }, 0);
    });
  };
}

// Swaps a short label with a quick slide up and out, then in from below.
export function rollWord(el, next) {
  if (!el || el.textContent === next) return;
  if (prefersReducedMotion()) {
    el.textContent = next;
    return;
  }
  gsap.timeline()
    .to(el, { y: -12, opacity: 0, duration: 0.18, ease: 'power2.in', overwrite: true, onComplete: () => { el.textContent = next; } })
    .fromTo(el, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' });
}
