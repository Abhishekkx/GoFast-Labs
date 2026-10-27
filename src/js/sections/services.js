import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initServices() {
  const section = document.getElementById('services');
  const track = document.getElementById('services-track');
  const counterEl = document.getElementById('services-counter');
  const progressBar = document.getElementById('services-progress-bar');
  const cards = document.querySelectorAll('.service-card');

  if (!section || !track) return;

  const mm = gsap.matchMedia();

  // Desktop (1024px and up): Pin horizontal scroll
  mm.add('(min-width: 1024px)', () => {
    function getScrollDistance() {
      return track.scrollWidth - track.parentElement.offsetWidth + 120;
    }

    const horizontalTween = gsap.to(track, {
      x: () => -getScrollDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => `+=${getScrollDistance()}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress;
          // Update progress bar
          if (progressBar) {
            progressBar.style.width = `${Math.min(100, Math.max(8, progress * 100))}%`;
          }

          // Update counter 01 / 08
          if (counterEl) {
            const totalCards = 8;
            const currentIdx = Math.min(totalCards, Math.max(1, Math.round(progress * (totalCards - 1)) + 1));
            counterEl.textContent = `0${currentIdx} / 08`;
          }

          // Subtle focal scaling for cards as they pass through the center viewport
          const viewportCenter = window.innerWidth / 2;
          cards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.left + rect.width / 2;
            const distFromCenter = Math.abs(viewportCenter - cardCenter);
            const maxDist = window.innerWidth * 0.45;

            if (distFromCenter < maxDist) {
              const factor = 1 - distFromCenter / maxDist;
              const scale = 1 + factor * 0.03;
              card.style.transform = `scale(${scale})`;
              card.style.borderColor = factor > 0.6 ? '#0E0E0E' : '#E4E1DB';
            } else {
              card.style.transform = 'scale(1)';
              card.style.borderColor = '#E4E1DB';
            }
          });
        },
      },
    });

    return () => {
      horizontalTween.kill();
      cards.forEach((c) => {
        c.style.transform = '';
        c.style.borderColor = '';
      });
    };
  });

  // Mobile / Tablet (< 1024px): Vertical stack with entry animations
  mm.add('(max-width: 1023px)', () => {
    cards.forEach((card, idx) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
          },
        }
      );
    });
  });
}
