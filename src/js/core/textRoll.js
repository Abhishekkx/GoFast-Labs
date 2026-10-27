// Wraps each link label in a two-line roller: on hover the label slides up and an
// identical copy (hidden from screen readers) slides in from below.
export function applyTextRoll(links, hoverClasses = '') {
  links.forEach((link) => {
    if (link.querySelector('.text-roll')) return;
    const text = link.textContent.trim();

    const roll = document.createElement('span');
    roll.className = 'text-roll';
    const inner = document.createElement('span');
    inner.className = 'text-roll-inner';

    const label = document.createElement('span');
    label.className = 'text-roll-item';
    label.textContent = text;

    const copy = document.createElement('span');
    copy.className = `text-roll-item ${hoverClasses}`.trim();
    copy.textContent = text;
    copy.setAttribute('aria-hidden', 'true');

    inner.append(label, copy);
    roll.append(inner);
    link.replaceChildren(roll);
  });
}
