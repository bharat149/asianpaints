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

  if (!desktopImg || !mobileImg) return;

  const picture = document.createElement('picture');

  const source = document.createElement('source');
  source.media = '(max-width: 768px)';
  source.srcset = mobileImg.src;

  const img = document.createElement('img');
  img.src = desktopImg.src;
  img.alt = desktopImg.alt || mobileImg.alt || 'Banner';
  img.loading = 'eager';

  picture.append(source, img);

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
      ?.textContent.trim() || '';

    triggerCTAClickWithLinkAndTitle(ctaLink, btnTitle, parentTitle);
  });

  block.textContent = '';
  block.appendChild(bannerLink);
}