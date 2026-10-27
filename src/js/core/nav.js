import { gsap } from 'gsap';

export function initNav() {
  const header = document.querySelector('header');
  const progressBar = document.getElementById('scroll-progress');
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  let lastScrollY = window.scrollY;
  let isMenuOpen = false;

  // Handle scroll progress and nav visibility
  function onScroll() {
    const currentScrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (currentScrollY / maxScroll) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (header) {
      // Background styling threshold
      if (currentScrollY > 80) {
        header.classList.add('bg-bg/95', 'backdrop-blur-md', 'border-b', 'border-line', 'shadow-sm');
        header.classList.remove('bg-transparent');
      } else {
        header.classList.remove('bg-bg/95', 'backdrop-blur-md', 'border-b', 'border-line', 'shadow-sm');
        header.classList.add('bg-transparent');
      }

      // Hide on scroll down, show on scroll up
      if (currentScrollY > 120 && currentScrollY > lastScrollY && !isMenuOpen) {
        header.style.transform = 'translateY(-100%)';
      } else {
        header.style.transform = 'translateY(0%)';
      }
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu interactions
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      menuToggle.setAttribute('aria-expanded', String(isMenuOpen));

      if (isMenuOpen) {
        mobileMenu.classList.remove('pointer-events-none', 'opacity-0');
        mobileMenu.classList.add('pointer-events-auto', 'opacity-100');
        document.body.style.overflow = 'hidden';

        // Animate links in
        gsap.fromTo(
          mobileNavLinks,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: 'expo.out' }
        );
      } else {
        mobileMenu.classList.add('pointer-events-none', 'opacity-0');
        mobileMenu.classList.remove('pointer-events-auto', 'opacity-100');
        document.body.style.overflow = '';
      }
    });

    // Close mobile menu on clicking any link
    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        isMenuOpen = false;
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.add('pointer-events-none', 'opacity-0');
        mobileMenu.classList.remove('pointer-events-auto', 'opacity-100');
        document.body.style.overflow = '';
      });
    });
  }

  // Format desktop text roll links
  document.querySelectorAll('.nav-link-roll').forEach((link) => {
    const text = link.textContent.trim();
    if (!link.querySelector('.text-roll')) {
      link.innerHTML = `
        <span class="text-roll">
          <span class="text-roll-inner">
            <span class="text-roll-item">${text}</span>
            <span class="text-roll-item text-ink font-semibold">${text}</span>
          </span>
        </span>
      `;
    }
  });
}
