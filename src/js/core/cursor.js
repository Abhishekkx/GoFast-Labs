import { gsap } from 'gsap';

export function initCursor() {
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (!isFinePointer) return;

  document.body.classList.add('has-custom-cursor');

  let dot = document.getElementById('cursor-dot');
  let ring = document.getElementById('cursor-ring');

  if (!dot) {
    dot = document.createElement('div');
    dot.id = 'cursor-dot';
    document.body.appendChild(dot);
  }

  if (!ring) {
    ring = document.createElement('div');
    ring.id = 'cursor-ring';
    ring.innerHTML = '<span class="cursor-text">View<br/>case →</span>';
    document.body.appendChild(ring);
  }

  // Set initial position off screen
  gsap.set([dot, ring], { x: -100, y: -100, opacity: 0 });

  // quickTo for high-performance physics-like lag
  const setDotX = gsap.quickTo(dot, 'x', { duration: 0.06, ease: 'power2.out' });
  const setDotY = gsap.quickTo(dot, 'y', { duration: 0.06, ease: 'power2.out' });
  const setRingX = gsap.quickTo(ring, 'x', { duration: 0.22, ease: 'power3.out' });
  const setRingY = gsap.quickTo(ring, 'y', { duration: 0.22, ease: 'power3.out' });

  let isVisible = false;

  window.addEventListener('mousemove', (e) => {
    if (!isVisible) {
      gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
      isVisible = true;
    }
    setDotX(e.clientX);
    setDotY(e.clientY);
    setRingX(e.clientX);
    setRingY(e.clientY);
  });

  document.addEventListener('mouseleave', () => {
    gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    isVisible = false;
  });

  document.addEventListener('mouseenter', () => {
    gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
    isVisible = true;
  });

  // Delegate hover states
  document.addEventListener('mouseover', (e) => {
    const target = e.target;
    const workCard = target.closest('.work-card, [data-cursor="work"]');
    const interactive = target.closest('a, button, [role="button"], input, select, .btn-magnetic');

    if (workCard) {
      ring.classList.add('cursor-work');
      ring.classList.remove('cursor-hover');
      gsap.to(dot, { opacity: 0, duration: 0.15 });
    } else if (interactive) {
      ring.classList.add('cursor-hover');
      ring.classList.remove('cursor-work');
      gsap.to(dot, { opacity: 1, duration: 0.15 });
    } else {
      ring.classList.remove('cursor-hover', 'cursor-work');
      gsap.to(dot, { opacity: 1, duration: 0.15 });
    }
  });
}
