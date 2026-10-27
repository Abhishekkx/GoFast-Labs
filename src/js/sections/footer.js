import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initFooter() {
  const footerSection = document.getElementById('contact-hub');
  if (!footerSection) return;

  const climaxLetters = footerSection.querySelectorAll('.climax-char');
  const ctaBtn = footerSection.querySelector('.footer-cta-btn');
  const footerCols = footerSection.querySelectorAll('.footer-col');

  // Trigger when footer scrolls into view
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: footerSection,
      start: 'top 80%',
    },
  });

  if (climaxLetters.length > 0) {
    tl.fromTo(
      climaxLetters,
      { yPercent: 110 },
      {
        yPercent: 0,
        duration: 0.9,
        stagger: 0.03,
        ease: 'expo.out',
      }
    );
  }

  if (ctaBtn) {
    tl.fromTo(
      ctaBtn,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.7,
        ease: 'back.out(1.7)',
      },
      '-=0.5'
    );
  }

  if (footerCols.length > 0) {
    tl.fromTo(
      footerCols,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'expo.out',
      },
      '-=0.4'
    );
  }

  // Format footer text roll links
  footerSection.querySelectorAll('.footer-link-roll').forEach((link) => {
    const text = link.textContent.trim();
    if (!link.querySelector('.text-roll')) {
      link.innerHTML = `
        <span class="text-roll">
          <span class="text-roll-inner">
            <span class="text-roll-item">${text}</span>
            <span class="text-roll-item text-primary-container font-semibold">${text}</span>
          </span>
        </span>
      `;
    }
  });
}
