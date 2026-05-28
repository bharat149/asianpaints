/*
** Authoring format **
Col 1 contains multiple images
Col 2 contains multiple title
Col 3 contains multiple subtitle
Col 4 contains multiple cta label
Col 5 contains multiple cta redirection link
*/

import { triggerCTAClickWithLinkAndTitle } from '../../scripts/analytics_1.js';

function getPicturesFromColumn(column) {
  if (!column) return [];

  return [...column.querySelectorAll('picture')].map((picture) =>
    picture.cloneNode(true),
  );
}

function getTextItemsFromColumn(column) {
  if (!column) return [];

  const items = [];

  [...column.children].forEach((child) => {
    const text = child.textContent.trim();
    if (text) items.push(text);
  });

  if (items.length) return items;

  return column.innerHTML
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function getLinkItemsFromColumn(column) {
  if (!column) return [];

  const links = [];

  [...column.children].forEach((child) => {
    const anchor = child.querySelector('a') || (child.tagName === 'A' ? child : null);

    if (anchor?.href) {
      links.push(anchor.href);
      return;
    }

    const text = child.textContent.trim();
    if (text) links.push(text);
  });

  return links;
}

export default function decorate(block) {
  const rows = [...block.children];
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'cards-action-container';

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 5) return;

    const imageItems = getPicturesFromColumn(cols[0]);
    const titleItems = getTextItemsFromColumn(cols[1]);
    const subtitleItems = getTextItemsFromColumn(cols[2]);
    const ctaLabelItems = getTextItemsFromColumn(cols[3]);
    const ctaLinkItems = getLinkItemsFromColumn(cols[4]);

    const totalCards = Math.max(
      imageItems.length,
      titleItems.length,
      subtitleItems.length,
      ctaLabelItems.length,
      ctaLinkItems.length,
    );

    for (let i = 0; i < totalCards; i += 1) {
      const card = document.createElement('div');
      card.className = 'cards-action-card';

      const image = imageItems[i];
      const title = titleItems[i];
      const subtitle = subtitleItems[i];
      const ctaLabel = ctaLabelItems[i];
      const ctaLink = ctaLinkItems[i];

      if (image) {
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'cards-action-image';
        imageWrapper.appendChild(image);
        card.appendChild(imageWrapper);
      }

      const contentWrapper = document.createElement('div');
      contentWrapper.className = 'cards-action-content';

      if (title) {
        const titleEl = document.createElement('h3');
        titleEl.className = 'cards-action-title';
        titleEl.textContent = title;
        contentWrapper.appendChild(titleEl);
      }

      if (subtitle) {
        const subtitleEl = document.createElement('p');
        subtitleEl.className = 'cards-action-description';
        subtitleEl.textContent = subtitle;
        contentWrapper.appendChild(subtitleEl);
      }

      if (ctaLabel && ctaLink) {
        const ctaEl = document.createElement('a');
        ctaEl.className = 'cards-action-cta';
        ctaEl.href = ctaLink;
        ctaEl.textContent = ctaLabel;
        ctaEl.addEventListener('click', () => {
          const btnTitle = ctaEl.textContent.trim();
          const parentTitle = title || '';
          triggerCTAClickWithLinkAndTitle(ctaLink, btnTitle, parentTitle);
        });
        contentWrapper.appendChild(ctaEl);
      }

      card.appendChild(contentWrapper);
      cardsContainer.appendChild(card);
    }
  });

  block.innerHTML = '';
  block.appendChild(cardsContainer);
}