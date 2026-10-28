import { gsap, ScrollTrigger, prefersReducedMotion } from '../core/motion';
import { createRoller, rollWord } from '../core/roller';

const pad = (n) => String(n).padStart(2, '0');

// Tracks which service card is in view and mirrors it in the sticky desktop index
// and the mobile switcher bar.
export function initServiceNav() {
  const list = document.getElementById('service-list');
  if (!list) return;

  const cards = [...list.querySelectorAll('.svc-card')];
  const links = [...document.querySelectorAll('.svc-nav-link')];
  const chips = [...document.querySelectorAll('.svc-chip')];
  const chipBar = document.querySelector('.svc-chipbar');
  const chipScroller = chipBar?.querySelector('.svc-chips');
  const indicator = document.querySelector('.svc-nav-indicator');
  const numberEl = document.getElementById('svc-now-num');
  const titleEl = document.getElementById('svc-now-title');
  const taglineEl = document.getElementById('svc-now-tagline');
  const setNumber = numberEl ? createRoller(numberEl) : () => {};
  const setBarProgress = chipBar ? gsap.quickSetter(chipBar.querySelector('.svc-chipbar-progress'), 'scaleX') : () => {};

  const moveIndicator = (link, immediate) => {
    if (!indicator || !link) return;
    gsap.to(indicator, { y: link.offsetTop, duration: immediate ? 0 : 0.5, ease: 'expo.out', overwrite: true });
  };

  const centreChip = (chip) => {
    if (!chipScroller || !chip || !chipBar.classList.contains('is-active')) return;
    const left = chip.offsetLeft - (chipScroller.clientWidth - chip.offsetWidth) / 2;
    chipScroller.scrollTo({ left, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  let active = -1;
  const setActive = (index) => {
    if (index === active) return;
    active = index;
    const card = cards[index];

    cards.forEach((c, i) => c.classList.toggle('is-current', i === index));
    [links, chips].forEach((group) => group.forEach((item, i) => {
      item.classList.toggle('is-active', i === index);
      if (i === index) item.setAttribute('aria-current', 'true');
      else item.removeAttribute('aria-current');
    }));

    setNumber(pad(index + 1));
    rollWord(titleEl, card.dataset.title);
    rollWord(taglineEl, card.dataset.tagline);
    moveIndicator(links[index]);
    centreChip(chips[index]);
  };

  setActive(0);
  moveIndicator(links[0], true);

  cards.forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => self.isActive && setActive(i),
      // Back above the first card: the index returns to the start.
      onLeaveBack: () => i === 0 && setActive(0),
    });
  });

  if (chipBar) {
    ScrollTrigger.create({
      trigger: list,
      start: 'top 140px',
      end: 'bottom 140px',
      onToggle: (self) => {
        chipBar.classList.toggle('is-active', self.isActive);
        if (self.isActive) centreChip(chips[active]);
      },
      onUpdate: (self) => setBarProgress(self.progress),
    });
  }

  // Link offsets change with the layout (fonts, resize); keep the indicator on its link.
  ScrollTrigger.addEventListener('refresh', () => moveIndicator(links[active], true));
}
