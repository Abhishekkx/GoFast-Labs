import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initPricing() {
  const section = document.getElementById('pricing');
  if (!section) return;

  const cards = section.querySelectorAll('.pricing-card');
  const toggleContainer = document.getElementById('pricing-toggle');
  const togglePill = document.getElementById('pricing-toggle-pill');
  const buttons = toggleContainer ? toggleContainer.querySelectorAll('button') : [];

  const launchPrice = document.getElementById('launch-price');
  const launchCadence = document.getElementById('launch-cadence');
  const scalePrice = document.getElementById('scale-price');
  const scaleCadence = document.getElementById('scale-cadence');

  // Entrance animation for cards
  gsap.fromTo(
    cards,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
      },
    }
  );

  if (!toggleContainer || buttons.length < 2) return;

  function updatePillPosition(activeBtn) {
    if (!togglePill) return;
    const rect = activeBtn.getBoundingClientRect();
    const parentRect = toggleContainer.getBoundingClientRect();
    const leftOffset = rect.left - parentRect.left;

    gsap.to(togglePill, {
      x: leftOffset,
      width: rect.width,
      duration: 0.35,
      ease: 'power2.out',
    });
  }

  // Initialize pill on default active button
  const initialActive = toggleContainer.querySelector('button.is-active') || buttons[0];
  if (initialActive) {
    updatePillPosition(initialActive);
  }

  function rollNumber(element, newText) {
    if (!element || element.textContent === newText) return;
    gsap.timeline()
      .to(element, {
        y: -12,
        opacity: 0,
        duration: 0.18,
        ease: 'power2.in',
        onComplete: () => {
          element.textContent = newText;
          gsap.set(element, { y: 12, opacity: 0 });
        },
      })
      .to(element, {
        y: 0,
        opacity: 1,
        duration: 0.25,
        ease: 'power2.out',
      });
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('is-active')) return;

      buttons.forEach((b) => {
        b.classList.remove('is-active', 'text-surface-container-lowest', 'font-semibold');
        b.classList.add('text-secondary', 'font-medium');
      });

      btn.classList.add('is-active', 'text-surface-container-lowest', 'font-semibold');
      btn.classList.remove('text-secondary', 'font-medium');

      updatePillPosition(btn);

      const mode = btn.getAttribute('data-plan');
      if (mode === 'monthly') {
        rollNumber(launchPrice, '$4,999');
        rollNumber(launchCadence, '/ month');
        rollNumber(scalePrice, '$3,999');
        rollNumber(scaleCadence, '/ month');
      } else {
        rollNumber(launchPrice, '$2,499');
        rollNumber(launchCadence, '/ fixed');
        rollNumber(scalePrice, '$3,999');
        rollNumber(scaleCadence, '/ month');
      }
    });
  });

  window.addEventListener('resize', () => {
    const currentActive = toggleContainer.querySelector('button.is-active');
    if (currentActive) updatePillPosition(currentActive);
  });
}
