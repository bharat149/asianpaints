import { loadCSS } from './aem.js';

/**
 * Creates and loads the fixed color partner overlay.
 * Extracted from scripts.js to avoid hardcoded HTML in the main script.
 *
 * TODO: Move this content to an authored fragment or delayed.js config
 * so the campaign URL, images, and alt text are content-managed.
 * @param {Document} doc
 */
export default function loadFixedColorPartner(doc) {
  if (doc.querySelector('.fixed-color-partner')) return;

  const overlay = document.createElement('div');
  overlay.className = 'fixed-color-partner';
  overlay.innerHTML = `
    <div>
      <p class="animate-image">
        <a href="https://www.asianpaints.com/bcci-campaign.html" target="_self" data-attr-ctatitle="View Shades">
          <picture>
            <source media="(max-width:575px)" srcset="https://static.asianpaints.com/content/dam/asian_paints/float-cta/bcci-campaign-colour-partner-popup.png">
            <source media="(min-width:576px) and (max-width:767px)" srcset="https://static.asianpaints.com/content/dam/asian_paints/float-cta/bcci-campaign-colour-partner-popup.png">
            <source media="(min-width:768px) and (max-width:991px)" srcset="https://static.asianpaints.com/content/dam/asian_paints/float-cta/bcci-campaign-colour-partner-popup.png">
            <source media="(min-width:992px)" srcset="https://static.asianpaints.com/content/dam/asian_paints/float-cta/bcci-campaign-colour-partner-popup.png">
            <img loading="lazy" fetchpriority="auto" src="https://static.asianpaints.com/content/dam/asian_paints/float-cta/bcci-campaign-colour-partner-popup.png" alt="BCCI Campaign - Official Colour Partner" title="Asian Paints Official Colour Partner" width="367" height="385">
          </picture>
        </a>
      </p>
      <p class="fixed-img" data-attr-autoclosetime="8">
        <picture>
          <source media="(max-width:575px)" srcset="https://static.asianpaints.com/content/dam/asian_paints/float-cta/bcci-campaign-colour-partner.png">
          <source media="(min-width:576px) and (max-width:767px)" srcset="https://static.asianpaints.com/content/dam/asian_paints/float-cta/bcci-campaign-colour-partner.png">
          <source media="(min-width:768px) and (max-width:991px)" srcset="https://static.asianpaints.com/content/dam/asian_paints/float-cta/bcci-campaign-colour-partner.png">
          <source media="(min-width:992px)" srcset="https://static.asianpaints.com/content/dam/asian_paints/float-cta/bcci-campaign-colour-partner.png">
          <img loading="lazy" fetchpriority="auto" src="https://static.asianpaints.com/content/dam/asian_paints/float-cta/bcci-campaign-colour-partner.png" alt="Official Colour Partner Badge" title="Click to expand" width="90" height="34">
        </picture>
      </p>
    </div>
  `;

  const header = doc.querySelector('header');
  if (header && header.nextSibling) {
    header.parentNode.insertBefore(overlay, header.nextSibling);
  } else if (header) {
    header.parentNode.appendChild(overlay);
  } else {
    doc.body.insertBefore(overlay, doc.body.firstChild);
  }

  loadCSS(`${window.hlx.codeBasePath}/blocks/fixed-color-partner/fixed-color-partner.css`);

  import('../blocks/fixed-color-partner/fixed-color-partner.js')
    .then((mod) => {
      if (mod.default) mod.default(overlay);
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Failed to load fixed-color-partner', error);
    });
}
