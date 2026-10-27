import { gsap, prefersReducedMotion } from './motion';

export function initCursor() {
  if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return;

  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  document.body.classList.add('has-custom-cursor');
  gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100, opacity: 0 });

  const dotX = gsap.quickTo(dot, 'x', { duration: 0.06, ease: 'power2.out' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.06, ease: 'power2.out' });
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.22, ease: 'power3.out' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.22, ease: 'power3.out' });

  let visible = false;
  const show = (on) => {
    if (visible === on) return;
    visible = on;
    gsap.to([dot, ring], { opacity: on ? 1 : 0, duration: 0.2, overwrite: 'auto' });
  };

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    show(true);
    dotX(event.clientX);
    dotY(event.clientY);
    ringX(event.clientX);
    ringY(event.clientY);
  });

  document.documentElement.addEventListener('mouseleave', () => show(false));

  document.addEventListener('mouseover', (event) => {
    const overWork = event.target.closest('.work-card, [data-cursor="work"]');
    const overInteractive = event.target.closest('a, button, [role="button"], input, select, .btn-magnetic');

    ring.classList.toggle('cursor-work', Boolean(overWork));
    ring.classList.toggle('cursor-hover', !overWork && Boolean(overInteractive));
    gsap.to(dot, { opacity: overWork ? 0 : 1, duration: 0.15, overwrite: 'auto' });
  });
}
