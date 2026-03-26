import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
import { trackEvent } from '../../scripts/analytics.js';

function triggerCTAClickWithLinkAndTitle(ctaLink, btnTitle, parentTitle) {
  if (!ctaLink) return;

  if (ctaLink.indexOf('javascript:void') > -1) {
    trackEvent('custom_cta_click', {
      cta_: btnTitle,
    });
  } else if (ctaLink.indexOf('tel:') > -1) {
    trackEvent('SPSContactClick');
  } else {
    trackEvent('custom_cta_click', {
      cta_: btnTitle,
      redirectionLink: ctaLink,
      parentTitle,
      param1: ctaLink,
    });
  }
}

export default function decorate(block) {
  const isCta = block.classList.contains('cta');
  const isRecommended = block.classList.contains('recommended');
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

    let cardLink = null;

    [...li.children].forEach((div) => {
      if (!isCta && div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';

        // ✅ Your stats-only hook (non-invasive)
        if (isStats) div.classList.add('content-wrapper');

        // Existing recommended logic
        if (isRecommended) {
          const link = div.querySelector('a');
          if (link) cardLink = link.href;
        }
      }
    });

    // Existing recommended “whole card clickable”
    if (isRecommended && cardLink) {
      li.addEventListener('click', () => { window.location.href = cardLink; });
      li.setAttribute('role', 'link');
      li.setAttribute('tabindex', '0');
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') window.location.href = cardLink;
      });
    }

    // Existing grid mobile image behavior
    if (isGrid && li.children.length === 3 && li.children[1].classList.contains('cards-card-image')) {
      li.children[1].classList.add('mob-view');
    }

    // ✅ Your stats-only container + title/subtitle hooks (non-invasive)
    if (isStats) {
      li.classList.add('data-parent-container');

      li.querySelectorAll('.cards-card-body.content-wrapper').forEach((body) => {
        const ps = body.querySelectorAll('p');
        if (ps[0]) ps[0].classList.add('title');
        if (ps[1]) ps[1].classList.add('sub-title');
      });
    }

    ul.append(li);
  });

  const imgWidth = isRecommended ? '400' : '750';
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: imgWidth }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  /**
   * ✅ Safe version of their "strip paragraph content" logic:
   * Run it ONLY when the paragraph contains an <a>.
   * This preserves text-only paragraphs used by features/stats variants.
   */

    if (!isServicesBlock && !isRoomBlock && !isBenefitsBlock) {
      ul.querySelectorAll('.cards-card-body p').forEach((p) => {
        if (!p.querySelector('a')) return; // <-- key fix to stop nuking stats/features text
    
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
