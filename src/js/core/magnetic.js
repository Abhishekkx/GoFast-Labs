import { gsap, prefersReducedMotion } from './motion';

export function initMagneticButtons() {
  if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return;

  document.querySelectorAll('.btn-magnetic, [data-magnetic]').forEach((button) => {
    const strength = parseFloat(button.dataset.magneticStrength) || 0.3;
    const moveX = gsap.quickTo(button, 'x', { duration: 0.3, ease: 'power2.out' });
    const moveY = gsap.quickTo(button, 'y', { duration: 0.3, ease: 'power2.out' });

    button.addEventListener('mousemove', (event) => {
      const rect = button.getBoundingClientRect();
      moveX((event.clientX - (rect.left + rect.width / 2)) * strength);
      moveY((event.clientY - (rect.top + rect.height / 2)) * strength);
    });

    button.addEventListener('mouseleave', () => {
      gsap.to(button, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
    });
  });
}
