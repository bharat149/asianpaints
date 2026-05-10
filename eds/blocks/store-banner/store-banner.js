/*
** Authoring format **
Store Banner Block

Row 1 (Banner Content)
Col 1 → Desktop banner image (picture)
Col 2 → Mobile banner image (picture)
Col 3 → CTA link (anchor)

----------------------------------------

Field Details:

Desktop Image:
- Used for screens > 768px
- Should be wide format (e.g., 2880 × 1200)
- Prefer optimized formats (WebP / AVIF)

Mobile Image:
- Used for screens ≤ 768px
- Should be mobile-friendly ratio (e.g., taller or square)
- Avoid using same desktop image to prevent cropping issues

CTA Link:
- Entire banner becomes clickable
- Use anchor (<a>) with proper URL
- Link text is not displayed (image acts as CTA)
- Accessible via aria-label (taken from image alt)

----------------------------------------

Behavior:

- Banner renders as a responsive <picture>
- Mobile image loads via media query
- Desktop image is default fallback
- Entire banner is wrapped in a clickable link

----------------------------------------

Important:

- Always provide alt text for accessibility
- Do NOT include text inside the block (image-only block)
- Ensure correct aspect ratios for both images
- Avoid very large file sizes (>300KB recommended)

----------------------------------------

Variants:

- Default → standard banner
- bg-cream → background wrapper applied via section

*/

import { triggerCTAClickWithLinkAndTitle } from '../../scripts/analytics.js';

export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const columns = [...row.children];
  if (columns.length < 3) return;

  const desktopPicture = columns[0].querySelector('picture');
  const mobilePicture = columns[1].querySelector('picture');
  const linkEl = columns[2].querySelector('a');

  if (!desktopPicture || !mobilePicture || !linkEl) return;

  const desktopImg = desktopPicture.querySelector('img');
  const mobileImg = mobilePicture.querySelector('img');
  const desktopSource = desktopPicture.querySelector('source');
  const mobileSource = mobilePicture.querySelector('source');

  if (!desktopImg || !mobileImg) return;

  const picture = document.createElement('picture');

  // Mobile source
  const mobileSrc = document.createElement('source');
  mobileSrc.media = '(max-width: 768px)';
  mobileSrc.srcset = mobileSource?.srcset || mobileImg.currentSrc || mobileImg.src;

  // Desktop source
  const desktopSrc = document.createElement('source');
  desktopSrc.media = '(min-width: 769px)';
  desktopSrc.srcset = desktopSource?.srcset || desktopImg.currentSrc || desktopImg.src;

  const img = document.createElement('img');
  img.src = desktopImg.currentSrc || desktopImg.src;
  img.alt = desktopImg.alt || mobileImg.alt || 'Banner';

  // LCP-critical settings
  img.loading = 'lazy';
  img.decoding = 'async';
  img.setAttribute('fetchpriority', 'auto');
  img.setAttribute('sizes', '100vw');

  // Add intrinsic dimensions to reserve layout space
  if (desktopImg.getAttribute('width')) {
    img.setAttribute('width', desktopImg.getAttribute('width'));
  } else if (desktopImg.width) {
    img.width = desktopImg.width;
  }

  if (desktopImg.getAttribute('height')) {
    img.setAttribute('height', desktopImg.getAttribute('height'));
  } else if (desktopImg.height) {
    img.height = desktopImg.height;
  }

  picture.append(mobileSrc, desktopSrc, img);

  const bannerLink = document.createElement('a');
  bannerLink.href = linkEl.href;
  bannerLink.className = 'store-banner-link';
  bannerLink.setAttribute('aria-label', img.alt);
  bannerLink.appendChild(picture);

  bannerLink.addEventListener('click', () => {
    const ctaLink = bannerLink.getAttribute('href') || '';
    const btnTitle = img.alt || 'Store Banner';
    const parentTitle = block.closest('.section')
      ?.querySelector('h1, h2, h3, h4, h5, h6')
      ?.textContent.trim() || btnTitle;

    triggerCTAClickWithLinkAndTitle(ctaLink, btnTitle, parentTitle);
  });

  block.textContent = '';
  block.appendChild(bannerLink);
}