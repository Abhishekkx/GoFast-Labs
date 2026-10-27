import { gsap, ScrollTrigger, MEDIA, fadeInOnEnter } from '../core/motion';
import { getLenis } from '../core/lenis';

const pad = (n) => String(n).padStart(2, '0');

export function initServices() {
  const section = document.getElementById('services');
  const track = document.getElementById('services-track');
  if (!section || !track) return;

  const cards = [...track.querySelectorAll('.service-card')];
  const counter = document.getElementById('services-counter');
  const progressBar = document.getElementById('services-progress-bar');
  const total = cards.length;

  let activeIndex = -1;
  const setActive = (index) => {
    if (index === activeIndex) return;
    activeIndex = index;
    if (counter) counter.textContent = `${pad(index + 1)} / ${pad(total)}`;
  };
  const setProgress = progressBar ? gsap.quickSetter(progressBar, 'scaleX') : () => {};
  const showProgress = (p) => setProgress(1 / total + p * (1 - 1 / total));

  setActive(0);
  showProgress(0);

  const mm = gsap.matchMedia();
  mm.add({ isDesktop: MEDIA.desktop, motion: MEDIA.motion, reduce: MEDIA.reduce }, ({ conditions: { isDesktop, reduce } }) => {
    if (reduce) {
      fadeInOnEnter(cards, track);
      return;
    }

    if (!isDesktop) {
      cards.forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 30 }, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'expo.out',
          scrollTrigger: { trigger: card, start: 'top 88%' },
        });
        ScrollTrigger.create({
          trigger: card,
          start: 'top 60%',
          end: 'bottom 60%',
          onToggle: (self) => {
            if (!self.isActive) return;
            setActive(i);
            showProgress(i / Math.max(1, total - 1));
          },
        });
      });
      return;
    }

    // Desktop: pin the section and drive the row sideways with vertical scroll.
    const viewport = track.parentElement;
    const distance = () => track.scrollWidth - viewport.offsetWidth + 120;
    const scaleSetters = cards.map((card) => gsap.quickSetter(card, 'scale'));
    const opacitySetters = cards.map((card) => gsap.quickSetter(card, 'opacity'));
    const focal = cards.map(() => false);

    // Card centres relative to the track's left edge, cached on refresh (no layout reads per frame).
    let viewportLeft = 0;
    let centres = [];
    const measure = () => {
      viewportLeft = viewport.getBoundingClientRect().left;
      centres = cards.map((card) => card.offsetLeft + card.offsetWidth / 2);
    };

    const updateFocus = () => {
      const x = gsap.getProperty(track, 'x');
      const mid = window.innerWidth / 2;
      const reach = window.innerWidth * 0.45;
      centres.forEach((centre, i) => {
        const offset = Math.abs(viewportLeft + centre + x - mid);
        const f = Math.max(0, 1 - offset / reach);
        scaleSetters[i](1 + f * 0.03);
        // Off-centre cards dim only to 0.92: any lower and their grey labels drop below WCAG AA.
        opacitySetters[i](0.92 + f * 0.08);
        const isFocal = f > 0.6;
        if (isFocal !== focal[i]) {
          focal[i] = isFocal;
          cards[i].classList.toggle('is-focal', isFocal);
        }
      });
    };

    gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: true,
        // The section's parent is a flex column, where GSAP disables pin spacing by default.
        pinSpacing: true,
        // Fixed pinning registers as a large layout shift in Chrome (CLS); a transform pin does not
        // and stays smooth when Lenis drives the scroll. Touch-only devices scroll natively, so keep fixed there.
        pinType: getLenis() && ScrollTrigger.isTouch !== 1 ? 'transform' : 'fixed',
        scrub: 1,
        // A section taller than the viewport pins by its bottom so the progress strip stays visible.
        start: () => (section.offsetHeight > window.innerHeight ? 'bottom bottom' : 'top top'),
        end: () => `+=${distance()}`,
        invalidateOnRefresh: true,
        onRefresh: () => {
          measure();
          updateFocus();
        },
        onUpdate: (self) => {
          showProgress(self.progress);
          setActive(Math.round(self.progress * (total - 1)));
          updateFocus();
        },
      },
    });

    return () => {
      gsap.set(cards, { clearProps: 'scale,opacity' });
      cards.forEach((card) => card.classList.remove('is-focal'));
      focal.fill(false);
    };
  });
}
