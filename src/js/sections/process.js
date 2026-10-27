import { gsap, ScrollTrigger, MEDIA, fadeInOnEnter } from '../core/motion';

const SVG_NS = 'http://www.w3.org/2000/svg';
const RAIL_X = 12;   // vertical rail sits in the grid's left gutter below 1024px
const GAP = 8;       // keep the desktop line clear of each circle

// Layout position of an element's centre inside an ancestor (ignores transforms).
function centreWithin(el, ancestor) {
  let x = el.offsetWidth / 2;
  let y = el.offsetHeight / 2;
  for (let node = el; node && node !== ancestor; node = node.offsetParent) {
    x += node.offsetLeft;
    y += node.offsetTop;
  }
  return { x, y, r: el.offsetWidth / 2 };
}

function line(svg, x1, y1, x2, y2, attrs) {
  const el = document.createElementNS(SVG_NS, 'line');
  Object.entries({ x1, y1, x2, y2, ...attrs }).forEach(([k, v]) => el.setAttribute(k, v));
  svg.append(el);
  return el;
}

export function initProcess() {
  const section = document.getElementById('process-section');
  if (!section) return;

  const wrap = section.querySelector('.process-wrap');
  const svg = section.querySelector('.process-track');
  const cards = [...section.querySelectorAll('.process-card')];
  const circles = cards.map((card) => card.querySelector('.process-circle'));
  const fills = circles.map((circle) => circle.querySelector('.process-fill'));
  const texts = cards.map((card) => card.querySelectorAll('.process-text'));

  const mm = gsap.matchMedia();
  mm.add({ isDesktop: MEDIA.desktop, motion: MEDIA.motion, reduce: MEDIA.reduce }, ({ conditions: { isDesktop, reduce } }) => {
    // Reduced motion keeps the finished state (all steps filled) and simply fades cards in.
    if (reduce) {
      fadeInOnEnter(cards, wrap);
      return;
    }

    if (isDesktop) {
      gsap.fromTo(cards, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'expo.out',
        scrollTrigger: { trigger: wrap, start: 'top 80%' },
      });
    } else {
      cards.forEach((card) => gsap.fromTo(card, { opacity: 0, y: 25 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'expo.out',
        scrollTrigger: { trigger: card, start: 'top 85%' },
      }));
    }

    const reached = cards.map(() => null);
    const setReached = (i, on) => {
      if (reached[i] === on) return;
      reached[i] = on;
      gsap.to(fills[i], { scale: on ? 1 : 0, duration: on ? 0.55 : 0.3, ease: on ? 'back.out(1.6)' : 'power2.in', overwrite: true });
      gsap.to(texts[i], { opacity: on ? 1 : 0.3, duration: 0.5, ease: 'power2.out', overwrite: true });
    };
    gsap.set(fills, { scale: 0 });
    gsap.set(texts.flatMap((nodes) => [...nodes]), { opacity: 0.3 });

    let segments = [];
    let thresholds = [];
    let totalLength = 1;

    const build = () => {
      svg.replaceChildren();
      const points = circles.map((circle) => centreWithin(circle, wrap));
      const pairs = isDesktop
        ? points.slice(0, -1).map((p, i) => [p.x + p.r + GAP, p.y, points[i + 1].x - points[i + 1].r - GAP, p.y])
        : [[RAIL_X, points[0].y, RAIL_X, points[points.length - 1].y]];

      segments = pairs.map(([x1, y1, x2, y2]) => {
        line(svg, x1, y1, x2, y2, { stroke: 'var(--line)', 'stroke-width': 2, 'stroke-dasharray': '6 6' });
        const draw = line(svg, x1, y1, x2, y2, { stroke: 'var(--accent)', 'stroke-width': isDesktop ? 4 : 3, 'stroke-linecap': 'round' });
        const length = Math.hypot(x2 - x1, y2 - y1);
        draw.style.strokeDasharray = `${length}`;
        draw.style.strokeDashoffset = `${length}`;
        return { draw, length };
      });
      totalLength = segments.reduce((sum, s) => sum + s.length, 0) || 1;

      // Fraction of the line drawn at the moment it touches each circle.
      if (isDesktop) {
        let run = 0;
        thresholds = points.map((_, i) => {
          if (i > 0) run += segments[i - 1].length;
          return run / totalLength;
        });
      } else {
        const span = points[points.length - 1].y - points[0].y || 1;
        thresholds = points.map((p) => (p.y - points[0].y) / span);
      }
    };

    const render = (progress) => {
      let remaining = progress * totalLength;
      segments.forEach(({ draw, length }) => {
        const drawn = Math.max(0, Math.min(length, remaining));
        draw.style.strokeDashoffset = `${length - drawn}`;
        remaining -= length;
      });
      thresholds.forEach((t, i) => setReached(i, progress > 0.001 && progress >= t - 0.01));
    };

    const state = { progress: 0 };
    gsap.to(state, {
      progress: 1,
      ease: 'none',
      onUpdate: () => render(state.progress),
      scrollTrigger: {
        trigger: wrap,
        start: isDesktop ? 'top 70%' : 'top 75%',
        end: isDesktop ? 'bottom 75%' : 'bottom 70%',
        scrub: 1,
      },
    });

    const onRefresh = () => {
      build();
      render(state.progress);
    };
    build();
    ScrollTrigger.addEventListener('refresh', onRefresh);

    return () => {
      ScrollTrigger.removeEventListener('refresh', onRefresh);
      svg.replaceChildren();
      gsap.set([...fills, ...texts.flatMap((nodes) => [...nodes])], { clearProps: 'all' });
    };
  });
}
