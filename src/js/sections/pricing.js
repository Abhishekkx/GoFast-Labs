import { gsap, MEDIA, fadeInOnEnter, prefersReducedMotion } from '../core/motion';

const PLANS = {
  project: { launch: ['$2,499', '/ fixed'], scale: ['$3,999', '/ month'] },
  monthly: { launch: ['$4,999', '/ month'], scale: ['$3,999', '/ month'] },
};

// Splits a price into per-character cells so changed digits slide vertically on their own.
// Screen readers get the plain value from a visually hidden copy.
function createRoller(el) {
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
      // Settle any roll still running from a quick double toggle.
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

function rollWord(el, next) {
  if (!el || el.textContent === next) return;
  if (prefersReducedMotion()) {
    el.textContent = next;
    return;
  }
  gsap.timeline()
    .to(el, { y: -12, opacity: 0, duration: 0.18, ease: 'power2.in', onComplete: () => { el.textContent = next; } })
    .fromTo(el, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25, ease: 'power2.out' });
}

export function initPricing() {
  const section = document.getElementById('pricing');
  if (!section) return;

  const cards = [...section.querySelectorAll('.pricing-card')];
  const settle = () => {
    gsap.set(cards, { clearProps: 'transform,opacity' });
    cards.forEach((card) => card.classList.add('is-settled'));
  };

  const mm = gsap.matchMedia();
  mm.add({ isDesktop: MEDIA.desktop, motion: MEDIA.motion, reduce: MEDIA.reduce }, ({ conditions: { isDesktop, reduce } }) => {
    if (reduce) {
      fadeInOnEnter(cards, section, 'top 75%').eventCallback('onComplete', settle);
      return;
    }
    // The featured card rests 8px higher on desktop (CSS); animate to that same spot so clearing is seamless.
    const restY = (card) => (isDesktop && card.classList.contains('is-featured') ? -8 : 0);
    gsap.fromTo(cards, { opacity: 0, y: (i, card) => restY(card) + 40 }, {
      opacity: 1,
      y: (i, card) => restY(card),
      duration: 0.8,
      stagger: 0.15,
      ease: 'expo.out',
      scrollTrigger: { trigger: section, start: 'top 75%' },
      onComplete: settle,
    });
  });

  const toggle = document.getElementById('pricing-toggle');
  const pill = document.getElementById('pricing-toggle-pill');
  const buttons = toggle ? [...toggle.querySelectorAll('button[data-plan]')] : [];
  if (buttons.length < 2) return;

  const setLaunchPrice = createRoller(document.getElementById('launch-price'));
  const setScalePrice = createRoller(document.getElementById('scale-price'));
  const launchCadence = document.getElementById('launch-cadence');
  const scaleCadence = document.getElementById('scale-cadence');

  // At rest the pill sits exactly behind the active button. To move it, it briefly spans the
  // whole track and a clip-path slides between the two slots (no animated layout properties);
  // keeping it small at rest means nothing dark sits behind the inactive label.
  const PAD = 4;
  const restOn = (button) => {
    gsap.set(pill, { left: button.offsetLeft, width: button.offsetWidth, clipPath: 'none' });
  };
  const clipFor = (button, trackWidth) => {
    const left = button.offsetLeft - PAD;
    const right = trackWidth - left - button.offsetWidth;
    return `inset(0px ${right}px 0px ${left}px round 9999px)`;
  };
  const slide = (from, to) => {
    const trackWidth = toggle.clientWidth - PAD * 2;
    gsap.set(pill, { left: PAD, width: trackWidth, clipPath: clipFor(from, trackWidth) });
    gsap.to(pill, {
      clipPath: clipFor(to, trackWidth),
      duration: 0.35,
      ease: 'power2.out',
      overwrite: true,
      onComplete: () => restOn(to),
    });
  };
  const activeButton = () => buttons.find((b) => b.getAttribute('aria-pressed') === 'true') ?? buttons[0];
  restOn(activeButton());
  new ResizeObserver(() => restOn(activeButton())).observe(toggle);

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      if (button.getAttribute('aria-pressed') === 'true') return;
      const previous = activeButton();

      buttons.forEach((b) => {
        const active = b === button;
        b.setAttribute('aria-pressed', String(active));
        b.classList.toggle('is-active', active);
        b.classList.toggle('text-surface', active);
        b.classList.toggle('font-semibold', active);
        b.classList.toggle('text-secondary', !active);
        b.classList.toggle('hover:text-ink', !active);
        b.classList.toggle('font-medium', !active);
      });

      if (prefersReducedMotion()) restOn(button);
      else slide(previous, button);

      const plan = PLANS[button.dataset.plan] ?? PLANS.project;
      setLaunchPrice(plan.launch[0]);
      rollWord(launchCadence, plan.launch[1]);
      setScalePrice(plan.scale[0]);
      rollWord(scaleCadence, plan.scale[1]);
    });
  });
}
