import { gsap, ScrollTrigger, MEDIA, fadeInOnEnter } from '../core/motion';
import { parseStat, resetStat, restoreStat, countUp } from '../core/countUp';

const relativeTop = (el, ancestor) => el.getBoundingClientRect().top - ancestor.getBoundingClientRect().top;

// Each illustration marks its moving parts with data-vg="<effect>". Effects run in DOM order,
// overlapping slightly; data-vg-at overrides the position (any GSAP position string) and
// data-vg-label drops a label others can time against.
const EFFECTS = {
  rise: (el) => gsap.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }),
  pop: (el) => gsap.fromTo(el, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2.2)' }),
  drop: (el) => gsap.fromTo(el, { opacity: 0, yPercent: -140 }, { opacity: 1, yPercent: 0, duration: 0.7, ease: 'back.out(1.6)' }),
  'grow-x': (el) => gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left center', duration: 0.8, ease: 'expo.out' }),
  'grow-y': (el) => gsap.fromTo(el, { scaleY: 0 }, { scaleY: 1, transformOrigin: 'center bottom', duration: 0.8, ease: 'expo.out' }),
  'slide-in': (el) => gsap.fromTo(el, { xPercent: 115 }, { xPercent: 0, duration: 0.9, ease: 'expo.out' }),
  draw: (el) => gsap.fromTo(el, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power2.inOut' }),

  // Status label: the first child slides out as the second (resting) one slides in.
  swap: (el) => {
    const [from, to] = el.children;
    return gsap.timeline()
      .fromTo(from, { opacity: 1, y: 0 }, { opacity: 0, y: -8, duration: 0.3, ease: 'power2.in', delay: 0.4 })
      .fromTo(to, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'back.out(2)' });
  },

  // Scan line passing down its container once.
  sweep: (el) => gsap.timeline()
    .fromTo(el, { opacity: 1, y: 0 }, { y: () => el.parentElement.offsetHeight, duration: 1.5, ease: 'power1.inOut' })
    .to(el, { opacity: 0, duration: 0.25 }),

  // Dot running down a workflow, ticking each step as it arrives.
  travel: (el) => {
    const flow = el.parentElement;
    const dots = [...flow.querySelectorAll('.vg-step-dot')];
    const yFor = (dot) => relativeTop(dot, flow) + (dot.offsetHeight - el.offsetHeight) / 2;
    const tl = gsap.timeline().set(el, { opacity: 1, y: () => yFor(dots[0]) });
    dots.forEach((dot, i) => {
      if (i > 0) tl.to(el, { y: () => yFor(dot), duration: 0.45, ease: 'power2.inOut' });
      tl.fromTo(dot.querySelector('.vg-step-check'), { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2.5)' }, '>-0.05');
    });
    return tl.to(el, { opacity: 0, duration: 0.3 });
  },

  // Search result climbing from the bottom of the list to #1 while the others drop a place.
  rank: (el) => {
    const results = [...el.querySelectorAll('.vg-result')];
    const step = () => relativeTop(results[1], results[0]);
    return gsap.timeline({ delay: 0.2 })
      .fromTo(results[0], { y: () => step() * (results.length - 1) }, { y: 0, duration: 1.2, ease: 'power3.inOut' }, 0)
      .fromTo(results.slice(1), { y: () => -step() }, { y: 0, duration: 1.2, ease: 'power3.inOut' }, 0);
  },
};

function buildIllustration(visual, stats) {
  const tl = gsap.timeline();
  visual.querySelectorAll('[data-vg]').forEach((el, i) => {
    let tween;
    if (el.dataset.vg === 'count') {
      const stat = parseStat(el);
      if (!stat) return;
      stats.push(stat);
      resetStat(stat);
      tween = countUp(stat, { duration: 1.4 });
    } else {
      tween = EFFECTS[el.dataset.vg]?.(el);
    }
    if (!tween) return;
    if (el.dataset.vgLabel) tl.addLabel(el.dataset.vgLabel, i === 0 ? 0 : '-=0.4');
    tl.add(tween, el.dataset.vgAt ?? (el.dataset.vgLabel || (i === 0 ? 0 : '-=0.45')));
  });
  return tl;
}

export function initServiceCards() {
  const cards = [...document.querySelectorAll('.svc-card')];
  if (!cards.length) return;
  const heads = [...document.querySelectorAll('.svc-group-head')];

  const mm = gsap.matchMedia();
  mm.add({ motion: MEDIA.motion, reduce: MEDIA.reduce }, (context) => {
    if (context.conditions.reduce) {
      [...heads, ...cards].forEach((el) => fadeInOnEnter(el, el));
      return;
    }

    heads.forEach((head) => {
      gsap.fromTo(head.querySelectorAll('.svc-group-title, .svc-group-count, .svc-group-copy'), { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'expo.out',
        scrollTrigger: { trigger: head, start: 'top 88%' },
      });
    });

    const stats = [];
    const buildCard = (card) => {
      const visual = card.querySelector('.svc-visual');
      const tl = gsap.timeline({
        scrollTrigger: { trigger: card, start: 'top 82%' },
        // Hand the transform back to CSS so nothing lingers after the entrance.
        onComplete: () => gsap.set([card, visual], { clearProps: 'transform,clipPath' }),
      });

      tl.fromTo(card, { opacity: 0, y: 56 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' })
        .fromTo(card.querySelectorAll('.svc-card-head > *, .svc-title, .svc-tagline'), { opacity: 0, y: 18 }, {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out',
        }, 0.15);

      if (visual) {
        tl.fromTo(visual, { clipPath: 'inset(10% 10% 10% 10% round 16px)' }, {
          clipPath: 'inset(0% 0% 0% 0% round 12px)', duration: 1.1, ease: 'expo.out',
        }, 0.25)
          .add(buildIllustration(visual, stats), 0.45);
      }

      tl.fromTo(card.querySelectorAll('.svc-list li'), { opacity: 0, x: -14 }, {
        opacity: 1, x: 0, duration: 0.6, stagger: 0.06, ease: 'expo.out',
      }, 0.4)
        .fromTo(card.querySelectorAll('.svc-label, .svc-tools li, .svc-cta'), { opacity: 0, y: 10 }, {
          opacity: 1, y: 0, duration: 0.5, stagger: 0.03, ease: 'expo.out',
        }, 0.55);
    };

    // Thirteen illustrated timelines are a lot to set up at load, so each card is only hidden
    // up front and its timeline is built half a screen before it scrolls into view.
    gsap.set(cards, { opacity: 0, y: 56 });
    const builders = cards.map((card) => ScrollTrigger.create({
      trigger: card,
      start: 'top bottom+=50%',
      end: 'max',
      once: true,
      // Built inside the matchMedia context so a media change reverts it like everything else.
      onEnter: () => context.add(() => buildCard(card)),
    }));

    return () => {
      builders.forEach((trigger) => trigger.kill());
      stats.forEach(restoreStat);
    };
  });
}
