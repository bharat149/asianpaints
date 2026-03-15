async function getSwiperClass() {
  if (window.Swiper) return window.Swiper;
  if (window.loadSwiper) return window.loadSwiper();

  // eslint-disable-next-line no-console
  console.warn('Swiper loader is not available on window.loadSwiper');
  return null;
}

function updateNavState(swiper, prevButton, nextButton) {
  if (!swiper || !prevButton || !nextButton) return;

  prevButton.disabled = swiper.isBeginning;
  nextButton.disabled = swiper.isEnd;

  prevButton.style.opacity = swiper.isBeginning ? '0.4' : '1';
  nextButton.style.opacity = swiper.isEnd ? '0.4' : '1';
}

function removeInjectedSwiperIcons(prevButton, nextButton) {
  prevButton?.querySelectorAll('.swiper-navigation-icon').forEach((icon) => icon.remove());
  nextButton?.querySelectorAll('.swiper-navigation-icon').forEach((icon) => icon.remove());
}

function getColumnItems(column) {
  if (!column) return [];

  const directChildren = [...column.children].filter((child) => {
    const hasText = child.textContent?.trim();
    const hasPicture = child.querySelector('picture, img') || child.matches('picture, img');
    const hasLink = child.querySelector('a[href]') || child.matches('a[href]');
    return hasText || hasPicture || hasLink;
  });

  if (directChildren.length) return directChildren;

  return column.textContent?.trim() ? [column] : [];
}

function getPictureItem(item) {
  if (!item) return null;

  if (item.matches?.('picture')) return item.cloneNode(true);

  const picture = item.querySelector?.('picture');
  if (picture) return picture.cloneNode(true);

  const img = item.matches?.('img') ? item : item.querySelector?.('img');
  if (img) return img.cloneNode(true);

  return null;
}

function getTextItem(item) {
  if (!item) return '';

  const cloned = item.cloneNode(true);
  cloned.querySelectorAll('picture, img, a').forEach((el) => el.remove());

  return cloned.textContent?.trim() || item.textContent?.trim() || '';
}

function getHrefItem(item) {
  if (!item) return '';

  if (item.matches?.('a[href]')) return item.href.trim();

  const anchor = item.querySelector?.('a[href]');
  if (anchor?.href) return anchor.href.trim();

  return item.textContent?.trim() || '';
}

function createVideoElement(src, title) {
  if (!src) return null;

  const video = document.createElement('video');
  video.className = 'designer-collections-video';
  video.src = src;
  video.muted = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.setAttribute('aria-label', title || 'Collection preview');

  video.addEventListener('ended', () => {
    video.pause();
    video.currentTime = 0;
  });

  return video;
}

function bindHoverPlayback(target, mediaEl) {
  if (!mediaEl || mediaEl.tagName.toLowerCase() !== 'video') return;

  target.addEventListener('mouseenter', async () => {
    try {
      mediaEl.pause();
      mediaEl.currentTime = 0;
      await mediaEl.play();
    } catch (e) {
      // no-op
    }
  });

  target.addEventListener('mouseleave', () => {
    mediaEl.pause();
    mediaEl.currentTime = 0;
  });
}

export default async function decorate(block) {
  const section = block.closest('.section');

  let heading = block.querySelector('h2');
  if (!heading && section) {
    heading = section.querySelector('.default-content-wrapper h2');
  }

  const row = block.querySelector(':scope > div');
  if (!row) return;

  const columns = [...row.children];
  if (columns.length < 7) return;

  const desktopLogoCol = columns[0];
  const mobileLogoCol = columns[1];
  const mediaUrlCol = columns[2];
  const titleCol = columns[3];
  const subtitleCol = columns[4];
  const ctaLabelCol = columns[5];
  const pdfLinkCol = columns[6];

  const desktopLogoItems = getColumnItems(desktopLogoCol);
  const mobileLogoItems = getColumnItems(mobileLogoCol);
  const mediaUrlItems = getColumnItems(mediaUrlCol);
  const titleItems = getColumnItems(titleCol);
  const subtitleItems = getColumnItems(subtitleCol);
  const ctaLabelItems = getColumnItems(ctaLabelCol);
  const pdfLinkItems = getColumnItems(pdfLinkCol);

  const totalCards = Math.max(
    desktopLogoItems.length,
    mobileLogoItems.length,
    mediaUrlItems.length,
    titleItems.length,
    subtitleItems.length,
    ctaLabelItems.length,
    pdfLinkItems.length,
  );

  if (!totalCards) return;

  const header = document.createElement('div');
  header.className = 'designer-collections-header';

  if (heading) {
    const titleEl = document.createElement('h2');
    titleEl.className = 'designer-collections-title';
    titleEl.textContent = heading.textContent.trim();
    header.appendChild(titleEl);

    if (!block.contains(heading)) {
      heading.style.display = 'none';
    }
  }

  const navWrapper = document.createElement('div');
  navWrapper.className = 'designer-collections-nav-wrapper';

  const prevButton = document.createElement('button');
  prevButton.className = 'designer-collections-nav designer-collections-prev swiper-button-prev';
  prevButton.type = 'button';
  prevButton.setAttribute('aria-label', 'Previous');

  const nextButton = document.createElement('button');
  nextButton.className = 'designer-collections-nav designer-collections-next swiper-button-next';
  nextButton.type = 'button';
  nextButton.setAttribute('aria-label', 'Next');

  navWrapper.appendChild(prevButton);
  navWrapper.appendChild(nextButton);
  header.appendChild(navWrapper);

  const carousel = document.createElement('div');
  carousel.className = 'designer-collections-carousel swiper';

  const track = document.createElement('div');
  track.className = 'designer-collections-track swiper-wrapper';

  for (let i = 0; i < totalCards; i += 1) {
    const desktopLogo = getPictureItem(desktopLogoItems[i]);
    const mobileLogo = getPictureItem(mobileLogoItems[i]);
    const mediaSrc = getHrefItem(mediaUrlItems[i]);
    const title = getTextItem(titleItems[i]);
    const subtitle = getTextItem(subtitleItems[i]);
    const ctaLabel = getTextItem(ctaLabelItems[i]) || 'Download PDF';
    const pdfHref = getHrefItem(pdfLinkItems[i]) || '#';

    if (!title && !desktopLogo && !mobileLogo && !mediaSrc) continue;

    const slide = document.createElement('div');
    slide.className = 'designer-collections-card swiper-slide';

    const cardInner = document.createElement('div');
    cardInner.className = 'designer-collections-card-inner';

    const logoWrap = document.createElement('div');
    logoWrap.className = 'designer-collections-logo';

    if (desktopLogo) {
      const desktopWrap = document.createElement('div');
      desktopWrap.className = 'designer-collections-logo-image designer-collections-logo-image--desktop';
      desktopWrap.appendChild(desktopLogo);
      logoWrap.appendChild(desktopWrap);
    }

    if (mobileLogo) {
      const mobileWrap = document.createElement('div');
      mobileWrap.className = 'designer-collections-logo-image designer-collections-logo-image--mobile';
      mobileWrap.appendChild(mobileLogo);
      logoWrap.appendChild(mobileWrap);
    }

    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'designer-collections-image';

    const mediaEl = createVideoElement(mediaSrc, title);
    if (mediaEl) {
      mediaWrap.appendChild(mediaEl);
      bindHoverPlayback(cardInner, mediaEl);
    }

    const content = document.createElement('div');
    content.className = 'designer-collections-content';

    if (title) {
      const titleEl = document.createElement('h3');
      titleEl.textContent = title;
      content.appendChild(titleEl);
    }

    if (subtitle) {
      const subtitleEl = document.createElement('p');
      subtitleEl.textContent = subtitle;
      content.appendChild(subtitleEl);
    }

    const ctaWrap = document.createElement('div');
    ctaWrap.className = 'designer-collections-cta-wrap';

    const cta = document.createElement('a');
    cta.className = 'designer-collections-cta';
    cta.href = pdfHref;
    cta.target = '_blank';
    cta.rel = 'noopener noreferrer';

    const ctaText = document.createElement('span');
    ctaText.className = 'designer-collections-cta-text';
    ctaText.textContent = ctaLabel;

    const ctaIcon = document.createElement('img');
    ctaIcon.className = 'designer-collections-cta-icon';
    ctaIcon.src = 'https://www.asianpaints.com/etc.clientlibs/apcolourcatalogue/clientlibs/clientlib-global/resources/images/download-icon-shade-tool.svg';
    ctaIcon.alt = '';
    ctaIcon.setAttribute('aria-hidden', 'true');

    cta.appendChild(ctaText);
    cta.appendChild(ctaIcon);
    ctaWrap.appendChild(cta);

    cardInner.appendChild(logoWrap);
    cardInner.appendChild(mediaWrap);
    cardInner.appendChild(content);
    cardInner.appendChild(ctaWrap);

    slide.appendChild(cardInner);
    track.appendChild(slide);
  }

  if (!track.children.length) return;

  carousel.appendChild(track);

  const pagination = document.createElement('div');
  pagination.className = 'designer-collections-pagination swiper-pagination';
  carousel.appendChild(pagination);

  block.innerHTML = '';
  block.appendChild(header);
  block.appendChild(carousel);

  if (track.children.length <= 1) {
    navWrapper.style.display = 'none';
    pagination.style.display = 'none';
    return;
  }

  try {
    const Swiper = await getSwiperClass();
    if (!Swiper) return;

    const swiper = new Swiper(carousel, {
      slidesPerView: 1.15,
      spaceBetween: 18,
      speed: 500,
      loop: false,
      watchOverflow: true,
      navigation: {
        prevEl: prevButton,
        nextEl: nextButton,
      },
      pagination: {
        el: pagination,
        clickable: true,
      },
      breakpoints: {
        0: {
          slidesPerView: 1.15,
          spaceBetween: 18,
        },
        600: {
          slidesPerView: 1.3,
          spaceBetween: 10,
        },
        900: {
          slidesPerView: 4,
          spaceBetween: 42,
        },
      },
      on: {
        init(instance) {
          removeInjectedSwiperIcons(prevButton, nextButton);
          updateNavState(instance, prevButton, nextButton);
        },
        slideChange(instance) {
          updateNavState(instance, prevButton, nextButton);
        },
        resize(instance) {
          removeInjectedSwiperIcons(prevButton, nextButton);
          updateNavState(instance, prevButton, nextButton);
        },
        reachBeginning(instance) {
          updateNavState(instance, prevButton, nextButton);
        },
        reachEnd(instance) {
          updateNavState(instance, prevButton, nextButton);
        },
        fromEdge(instance) {
          updateNavState(instance, prevButton, nextButton);
        },
      },
    });

    removeInjectedSwiperIcons(prevButton, nextButton);
    block.designerCollectionsSwiper = swiper;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize designer-collections Swiper', error);
  }
}