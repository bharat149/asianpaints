/*
** Authoring format **
Col 2 contains multiple desktop top images

Col 3 contains multiple mobile top images

Col 4 contains multiple desktop bottom images

Col 5 contains multiple mobile bottom images

Col 6 contains multiple URLs
*/

export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const columns = [...row.children];
  if (columns.length < 6) return;

  // Column 1 = text content
  const textCol = columns[0];
  textCol.classList.add('color-gallery-text');

  // Column 2–6
  const desktopTopCol = columns[1];
  const mobileTopCol = columns[2];
  const desktopBottomCol = columns[3];
  const mobileBottomCol = columns[4];
  const urlCol = columns[5];

  const carouselCol = document.createElement('div');
  carouselCol.className = 'color-gallery-carousel';

  const carouselContainer = document.createElement('div');
  carouselContainer.className = 'color-gallery-carousel-container';

  const carouselTrack = document.createElement('div');
  carouselTrack.className = 'color-gallery-carousel-track';

  function getPicturesFromColumn(col) {
    return [...col.querySelectorAll('picture')];
  }

  function getLinksFromColumn(col) {
    const links = [...col.querySelectorAll('a')];
    if (links.length) return links.map((link) => link.href);

    // fallback: each line / paragraph can be treated as url
    const items = [...col.querySelectorAll('p')].map((p) => p.textContent.trim()).filter(Boolean);
    if (items.length) return items;

    const text = col.textContent.trim();
    return text ? [text] : [];
  }

  function createResponsivePicture(desktopPicture, mobilePicture, altText = '') {
    const desktopImg = desktopPicture?.querySelector('img');
    const mobileImg = mobilePicture?.querySelector('img');

    if (!desktopImg && !mobileImg) return null;

    const picture = document.createElement('picture');

    if (mobileImg?.src) {
      const mobileSource = document.createElement('source');
      mobileSource.setAttribute('media', '(max-width: 767px)');
      mobileSource.setAttribute('srcset', mobileImg.src);
      picture.appendChild(mobileSource);
    }

    if (desktopImg?.src) {
      const desktopSource = document.createElement('source');
      desktopSource.setAttribute('media', '(min-width: 768px)');
      desktopSource.setAttribute('srcset', desktopImg.src);
      picture.appendChild(desktopSource);
    }

    const img = document.createElement('img');
    img.src = mobileImg?.src || desktopImg?.src || '';
    img.alt = mobileImg?.alt || desktopImg?.alt || altText;
    img.loading = 'lazy';
    picture.appendChild(img);

    return picture;
  }

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
    urls.length
  );

  for (let i = 0; i < totalCards; i += 1) {
    const topPicture = createResponsivePicture(
      desktopTopPictures[i],
      mobileTopPictures[i],
      `Top image ${i + 1}`
    );

    const bottomPicture = createResponsivePicture(
      desktopBottomPictures[i],
      mobileBottomPictures[i],
      `Bottom image ${i + 1}`
    );

    // skip card if both images missing
    if (!topPicture && !bottomPicture) continue;

    const slide = document.createElement('div');
    slide.className = 'color-gallery-slide';

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
    carouselTrack.appendChild(slide);
  }

  if (!carouselTrack.children.length) return;

  carouselContainer.appendChild(carouselTrack);

  const slides = carouselTrack.querySelectorAll('.color-gallery-slide');
  const totalSlides = slides.length;

  let prevButton;
  let nextButton;

  if (totalSlides > 1) {
    prevButton = document.createElement('button');
    prevButton.className = 'color-gallery-nav color-gallery-prev';
    prevButton.setAttribute('aria-label', 'Previous');

    nextButton = document.createElement('button');
    nextButton.className = 'color-gallery-nav color-gallery-next';
    nextButton.setAttribute('aria-label', 'Next');

    carouselContainer.appendChild(prevButton);
    carouselContainer.appendChild(nextButton);
  }

  carouselCol.appendChild(carouselContainer);

  // Remove original cols 2–6 and append carousel
  columns.slice(1).forEach((col) => col.remove());
  row.appendChild(carouselCol);

  if (totalSlides > 1) {
    let currentIndex = 0;

    function getSlideWidth() {
      const slide = slides[0];
      if (!slide) return 276;
      const width = slide.offsetWidth;
      const gap = window.innerWidth <= 991 ? 12 : 16;
      return width + gap;
    }

    function getVisibleSlides() {
      const containerWidth = carouselCol.offsetWidth;
      const slideWidth = getSlideWidth();
      return Math.max(1, Math.floor(containerWidth / slideWidth));
    }

    function updateCarousel() {
      const slideWidth = getSlideWidth();
      const visibleSlides = getVisibleSlides();
      const maxIndex = Math.max(0, totalSlides - visibleSlides);

      if (currentIndex < 0) currentIndex = 0;
      if (currentIndex > maxIndex) currentIndex = maxIndex;

      const translateX = currentIndex * slideWidth;
      carouselTrack.style.transform = `translateX(-${translateX}px)`;

      if (prevButton && nextButton) {
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex >= maxIndex;

        prevButton.style.opacity = currentIndex === 0 ? '0.4' : '1';
        nextButton.style.opacity = currentIndex >= maxIndex ? '0.4' : '1';
      }
    }

    prevButton?.addEventListener('click', (e) => {
      e.preventDefault();
      currentIndex -= 1;
      updateCarousel();
    });

    nextButton?.addEventListener('click', (e) => {
      e.preventDefault();
      currentIndex += 1;
      updateCarousel();
    });

    setTimeout(updateCarousel, 100);

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateCarousel, 100);
    });
  }

  // Add mobile CTA below carousel
  const mobileCta = document.createElement('div');
  mobileCta.className = 'color-gallery-mobile-cta';
  const ctaLink = textCol.querySelector('a');
  if (ctaLink) {
    const mobileLink = ctaLink.cloneNode(true);
    mobileCta.appendChild(mobileLink);
    block.appendChild(mobileCta);
  }
}