/*
** Authoring format **
Col 1 contains text content
Col 2 contains multiple desktop top images
Col 3 contains multiple mobile top images
Col 4 contains multiple desktop bottom images
Col 5 contains multiple mobile bottom images
Col 6 contains multiple URLs
*/

function getPicturesFromColumn(col) {
  if (!col) return [];
  return [...col.querySelectorAll('picture')];
}

function getLinksFromColumn(col) {
  if (!col) return [];

  const links = [...col.querySelectorAll('a')];
  if (links.length) return links.map((link) => link.href);

  const paragraphValues = [...col.querySelectorAll('p')]
    .map((p) => p.textContent.trim())
    .filter(Boolean);

  if (paragraphValues.length) return paragraphValues;

  const text = col.textContent.trim();
  return text ? [text] : [];
}

function cloneSourcesToPicture(targetPicture, sourcePicture, mediaQuery) {
  if (!sourcePicture) return;

  [...sourcePicture.querySelectorAll('source')].forEach((sourceEl) => {
    const source = document.createElement('source');

    if (sourceEl.type) source.type = sourceEl.type;
    if (sourceEl.srcset) source.srcset = sourceEl.srcset;

    if (mediaQuery) {
      source.media = mediaQuery;
    } else if (sourceEl.media) {
      source.media = sourceEl.media;
    }

    targetPicture.appendChild(source);
  });
}

function createResponsivePicture(desktopPicture, mobilePicture, altText = '') {
  const desktopImg = desktopPicture?.querySelector('img');
  const mobileImg = mobilePicture?.querySelector('img');

  if (!desktopImg && !mobileImg) return null;

  const picture = document.createElement('picture');

  cloneSourcesToPicture(picture, mobilePicture, '(max-width: 767px)');
  cloneSourcesToPicture(picture, desktopPicture, '(min-width: 768px)');

  const img = document.createElement('img');
  img.src = mobileImg?.src || desktopImg?.src || '';
  img.alt = mobileImg?.alt || desktopImg?.alt || altText;
  img.loading = 'lazy';
  img.decoding = 'async';

  if (desktopImg?.width) img.width = desktopImg.width;
  if (desktopImg?.height) img.height = desktopImg.height;

  picture.appendChild(img);

  return picture;
}

function updateNavState(swiper, prevButton, nextButton) {
  if (!swiper || !prevButton || !nextButton) return;

  prevButton.disabled = swiper.isBeginning;
  nextButton.disabled = swiper.isEnd;

  prevButton.style.opacity = swiper.isBeginning ? '0.4' : '1';
  nextButton.style.opacity = swiper.isEnd ? '0.4' : '1';
}

async function getSwiperClass() {
  if (window.Swiper) return window.Swiper;
  if (window.loadSwiper) return window.loadSwiper();

  // eslint-disable-next-line no-console
  console.warn('Swiper loader is not available on window.loadSwiper');
  return null;
}

export default async function decorate(block) {
  if (block.dataset.colorGalleryInitialized === 'true') return;

  const row = block.querySelector(':scope > div');
  if (!row) return;

  const columns = [...row.children];
  if (columns.length < 6) return;

  // Column 1 = text content
  const textCol = columns[0];
  textCol.classList.add('color-gallery-text');

  // Columns 2–6
  const desktopTopCol = columns[1];
  const mobileTopCol = columns[2];
  const desktopBottomCol = columns[3];
  const mobileBottomCol = columns[4];
  const urlCol = columns[5];

  const desktopTopPictures = getPicturesFromColumn(desktopTopCol);
  const mobileTopPictures = getPicturesFromColumn(mobileTopCol);
  const desktopBottomPictures = getPicturesFromColumn(desktopBottomCol);
  const mobileBottomPictures = getPicturesFromColumn(mobileBottomCol);
  const urls = getLinksFromColumn(urlCol);

  const totalCards = Math.max(
    desktopTopPictures.length,
    mobileTopPictures.length,
    desktopBottomPictures.length,
    mobileBottomPictures.length,
    urls.length,
  );

  if (!totalCards) return;

  const carouselCol = document.createElement('div');
  carouselCol.className = 'color-gallery-carousel';

  const swiperEl = document.createElement('div');
  swiperEl.className = 'swiper color-gallery-swiper';

  const swiperWrapper = document.createElement('div');
  swiperWrapper.className = 'swiper-wrapper color-gallery-carousel-track';

  for (let i = 0; i < totalCards; i += 1) {
    const topPicture = createResponsivePicture(
      desktopTopPictures[i],
      mobileTopPictures[i],
      `Top image ${i + 1}`,
    );

    const bottomPicture = createResponsivePicture(
      desktopBottomPictures[i],
      mobileBottomPictures[i],
      `Bottom image ${i + 1}`,
    );

    // Skip card if both images are missing
    if (!topPicture && !bottomPicture) continue;

    const slide = document.createElement('div');
    slide.className = 'swiper-slide color-gallery-slide';

    const cardLink = document.createElement('a');
    cardLink.className = 'color-gallery-card';
    cardLink.href = urls[i] || '#';
    cardLink.setAttribute('aria-label', `View gallery card ${i + 1}`);

    const topWrap = document.createElement('div');
    topWrap.className = 'color-gallery-card-top';

    const bottomWrap = document.createElement('div');
    bottomWrap.className = 'color-gallery-card-bottom';

    if (topPicture) topWrap.appendChild(topPicture);
    if (bottomPicture) bottomWrap.appendChild(bottomPicture);

    cardLink.appendChild(topWrap);
    cardLink.appendChild(bottomWrap);
    slide.appendChild(cardLink);
    swiperWrapper.appendChild(slide);
  }

  if (!swiperWrapper.children.length) return;

  swiperEl.appendChild(swiperWrapper);

  const paginationEl = document.createElement('div');
  paginationEl.className = 'color-gallery-pagination swiper-pagination';

  const totalSlides = swiperWrapper.children.length;
  let prevButton;
  let nextButton;

  if (totalSlides > 1) {
    const navContainer = document.createElement('div');
    navContainer.className = 'color-gallery-navigation';

    prevButton = document.createElement('button');
    prevButton.className = 'color-gallery-nav color-gallery-prev swiper-button-prev';
    prevButton.type = 'button';
    prevButton.setAttribute('aria-label', 'Previous');

    nextButton = document.createElement('button');
    nextButton.className = 'color-gallery-nav color-gallery-next swiper-button-next';
    nextButton.type = 'button';
    nextButton.setAttribute('aria-label', 'Next');

    navContainer.appendChild(prevButton);
    navContainer.appendChild(nextButton);
    swiperEl.appendChild(navContainer);
  }

  carouselCol.appendChild(swiperEl);
  carouselCol.appendChild(paginationEl);

  // Remove original columns 2–6 and append carousel
  columns.slice(1).forEach((col) => col.remove());
  row.appendChild(carouselCol);

  // Add mobile CTA below carousel
  const existingMobileCta = block.querySelector('.color-gallery-mobile-cta');
  if (existingMobileCta) existingMobileCta.remove();

  const mobileCta = document.createElement('div');
  mobileCta.className = 'color-gallery-mobile-cta';

  const ctaLink = textCol.querySelector('a');
  if (ctaLink) {
    const mobileLink = ctaLink.cloneNode(true);
    mobileCta.appendChild(mobileLink);
    block.appendChild(mobileCta);
  }

  block.dataset.colorGalleryInitialized = 'true';

  if (totalSlides <= 1) return;

  try {
    const Swiper = await getSwiperClass();
    if (!Swiper) return;

    const swiper = new Swiper(swiperEl, {
      slidesPerView: 1.3,
      spaceBetween: 12,
      speed: 500,
      loop: false,
      watchOverflow: true,
    
      navigation: {
        prevEl: prevButton,
        nextEl: nextButton,
      },
    
      pagination: {
        el: paginationEl,
        clickable: true,
        enabled: false,
      },
    
      breakpoints: {
        768: {
          slidesPerView: 1.3,
          spaceBetween: 10,
        },
        992: {
          slidesPerView: 3,
          spaceBetween: 16,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 16,
        },
      },
    });

    block.colorGallerySwiper = swiper;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize color-gallery Swiper', error);
  }
}