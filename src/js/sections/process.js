import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initProcess() {
  const section = document.getElementById('process-section');
  if (!section) return;

  const cards = section.querySelectorAll('.process-card');
  const linePathDesktop = document.getElementById('process-line-desktop');
  const linePathMobile = document.getElementById('process-line-mobile');
  const nodes = section.querySelectorAll('.process-circle');

  const mm = gsap.matchMedia();

  // Desktop (>= 1024px)
  mm.add('(min-width: 1024px)', () => {
    if (linePathDesktop) {
      const pathLength = linePathDesktop.getTotalLength ? linePathDesktop.getTotalLength() : 800;
      gsap.set(linePathDesktop, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      gsap.to(linePathDesktop, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'bottom 80%',
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            nodes.forEach((node, idx) => {
              const threshold = idx / (nodes.length - 1);
              if (progress >= threshold - 0.05) {
                node.classList.add('bg-primary-container', 'text-[#0E0E0E]');
                node.classList.remove('bg-surface-container', 'text-on-surface');
              } else {
                node.classList.remove('bg-primary-container', 'text-[#0E0E0E]');
                node.classList.add('bg-surface-container', 'text-on-surface');
              }
            });
          },
        },
      });
    }

    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
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
  });

  // Mobile / Tablet (< 1024px)
  mm.add('(max-width: 1023px)', () => {
    if (linePathMobile) {
      const pathLength = linePathMobile.getTotalLength ? linePathMobile.getTotalLength() : 600;
      gsap.set(linePathMobile, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      gsap.to(linePathMobile, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'bottom 85%',
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            nodes.forEach((node, idx) => {
              const threshold = idx / (nodes.length - 1);
              if (progress >= threshold - 0.05) {
                node.classList.add('bg-primary-container', 'text-[#0E0E0E]');
                node.classList.remove('bg-surface-container', 'text-on-surface');
              } else {
                node.classList.remove('bg-primary-container', 'text-[#0E0E0E]');
                node.classList.add('bg-surface-container', 'text-on-surface');
              }
            });
          },
        },
      });
    }

    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
        }
      );
    });
  });
}
