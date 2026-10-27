/**
 * Accessible splitText helper that splits text into word masks while
 * preserving screen-reader accessibility via aria-label and aria-hidden.
 */
export function splitTextIntoWords(element) {
  if (!element) return [];

  const rawText = element.textContent.trim();
  if (!element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', rawText);
  }

  // Clear children and construct accessible markup
  const fragment = document.createDocumentFragment();
  const wrapper = document.createElement('span');
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.className = 'split-line-mask';

  const words = rawText.split(/\s+/);
  const wordSpans = [];

  words.forEach((word, idx) => {
    const maskSpan = document.createElement('span');
    maskSpan.className = 'split-word-mask';

    const wordSpan = document.createElement('span');
    wordSpan.className = 'split-word';
    wordSpan.textContent = word;

    maskSpan.appendChild(wordSpan);
    wrapper.appendChild(maskSpan);
    wordSpans.push(wordSpan);

    if (idx < words.length - 1) {
      wrapper.appendChild(document.createTextNode(' '));
    }
  });

  element.innerHTML = '';
  element.appendChild(wrapper);

  return wordSpans;
}
