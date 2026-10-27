import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initWork() {
  const cards = document.querySelectorAll('.work-card');

  cards.forEach((card) => {
    const imageWrap = card.querySelector('.work-image-wrap');
    const image = card.querySelector('.work-image');
    const title = card.querySelector('.work-title');
    const desc = card.querySelector('.work-desc');
    const tags = card.querySelectorAll('.work-tag');
    const meta = card.querySelector('.work-meta');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top 82%',
      },
    });

    if (imageWrap && image) {
      tl.fromTo(
        imageWrap,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.out' },
        0
      );

      tl.fromTo(
        image,
        { scale: 1.15 },
        { scale: 1.0, duration: 1.2, ease: 'expo.out' },
        0
      );
    }

    if (title || meta) {
      tl.fromTo(
        [title, meta],
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'expo.out' },
        '-=0.7'
      );
    }

    if (desc) {
      tl.fromTo(
        desc,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' },
        '-=0.5'
      );
    }

    if (tags.length > 0) {
      tl.fromTo(
        tags,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'expo.out' },
        '-=0.4'
      );
    }
  });
}
