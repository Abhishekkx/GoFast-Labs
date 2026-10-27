import { gsap } from 'gsap';

export function initTransitions() {
  const panel = document.getElementById('page-transition');
  if (!panel) return;

  // On page load, wipe panel out if active
  gsap.set(panel, { yPercent: 100 });

  // Attach to links that lead to other HTML pages
  document.querySelectorAll('a[data-page-link]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
        e.preventDefault();
        panel.classList.add('is-active');

        gsap.to(panel, {
          yPercent: 0,
          duration: 0.6,
          ease: 'power4.inOut',
          onComplete: () => {
            window.location.href = href;
          },
        });
      }
    });
  });
}
