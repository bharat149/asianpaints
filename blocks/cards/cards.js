import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { triggerCTAClickWithLinkAndTitle } from '../../scripts/analytics.js';

export default function decorate(block) {
  const isCta = block.classList.contains('cta');
  const isGrid = block.classList.contains('grid');
  const isStats = block.classList.contains('stats');
  const isServicesBlock = block.classList.contains('services');
  const isRoomBlock = block.classList.contains('room');
  const isBenefitsBlock = block.classList.contains('benefits');

  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      if (!isCta && div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';

        if (isStats) div.classList.add('content-wrapper');
      }
    });

    if (isGrid && li.children.length === 3 && li.children[1].classList.contains('cards-card-image')) {
      li.children[1].classList.add('mob-view');
    }

    if (isStats) {
      li.classList.add('data-parent-container');

      li.querySelectorAll('.cards-card-body.content-wrapper').forEach((body) => {
        const ps = body.querySelectorAll('p');
        if (ps[0]) ps[0].classList.add('title');
        if (ps[1]) ps[1].classList.add('sub-title');
      });
    }

    // Room variant only: make image clickable using CTA link
    if (isRoomBlock) {
      const imageWrapper = li.querySelector('.cards-card-image');
      const bodyWrapper = li.querySelector('.cards-card-body');
      const ctaLink = bodyWrapper?.querySelector('a[href]');

      if (imageWrapper && ctaLink && !imageWrapper.querySelector('a')) {
        const imageLink = document.createElement('a');
        imageLink.href = ctaLink.href;

        if (ctaLink.target) imageLink.target = ctaLink.target;
        if (ctaLink.rel) {
          imageLink.rel = ctaLink.rel;
        } else if (ctaLink.target === '_blank') {
          imageLink.rel = 'noopener noreferrer';
        }

        imageLink.className = 'cards-card-image-link';

        while (imageWrapper.firstChild) {
          imageLink.append(imageWrapper.firstChild);
        }

        imageWrapper.append(imageLink);
      }
    }

    ul.append(li);
  });

  const imgWidth = '750';
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: imgWidth }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  if (!isServicesBlock && !isRoomBlock && !isBenefitsBlock) {
    ul.querySelectorAll('.cards-card-body p').forEach((p) => {
      if (!p.querySelector('a')) return;

      [...p.childNodes].forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          node.remove();
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'A') {
          node.remove();
        }
      });
    });
  }

  block.textContent = '';
  block.append(ul);

  ul.querySelectorAll('.cards-card-body a').forEach((cta) => {
    cta.addEventListener('click', () => {
      const ctaLink = cta.getAttribute('href') || '';
      const btnTitle = cta.textContent.trim();
      const body = cta.closest('.cards-card-body');
      const parentTitle = body?.querySelector('h1, h2, h3, h4, h5, h6, p')?.textContent.trim() || '';

      triggerCTAClickWithLinkAndTitle(ctaLink, btnTitle, parentTitle);
    });
  });
}
