async function getSwiperClass() {
  if (window.Swiper) return window.Swiper;
  if (window.loadSwiper) return window.loadSwiper();

  // eslint-disable-next-line no-console
  console.warn('Swiper loader is not available on window.loadSwiper');
  return null;
}

function buildHeading(rows, block) {
  let headingText = '';
  let siblingHeading = null;

  const blockWrapper = block.closest('.testimonial-carousel-wrapper');
  if (blockWrapper) {
    const prevWrapper = blockWrapper.previousElementSibling;
    if (prevWrapper?.classList.contains('default-content-wrapper')) {
      siblingHeading = prevWrapper.querySelector('h2');
      if (siblingHeading) headingText = siblingHeading.textContent.trim();
    }
  }

  if (!siblingHeading && block.previousElementSibling?.tagName === 'H2') {
    siblingHeading = block.previousElementSibling;
    headingText = siblingHeading.textContent.trim();
  }

  const testimonialRows = [];

  rows.forEach((row) => {
    const cols = [...row.querySelectorAll(':scope > div')];
    const isHeadingRow = cols.length === 1 && !cols[0].querySelector('picture');

    if (isHeadingRow && !headingText) {
      headingText = cols[0].textContent.trim();
    } else if (!isHeadingRow) {
      testimonialRows.push(row);
    }
  });

  if (!headingText) headingText = 'What our customers say!';

  return { headingText, siblingHeading, testimonialRows };
}

function createVideoModal(block) {
  const modal = document.createElement('div');
  modal.className = 'modal fade testimonial-video-modal';
  modal.id = 'videoModal';
  modal.setAttribute('data-bs-backdrop', 'static');
  modal.setAttribute('data-bs-keyboard', 'false');
  modal.setAttribute('tabindex', '-1');
  modal.setAttribute('aria-hidden', 'true');

  modal.innerHTML = `
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="btn-close testimonial-video-close" data-bs-dismiss="modal" aria-label="Close">
                    <img src="https://asset.fwcdn3.com/js/8334d7de98d44c40d6af0a847f6bbf1d.svg" loading="lazy" fetchpriority="auto"/>
                </button>
            </div>
            <div class="modal-body">
                <div class="ratio ratio-16x9 testimonial-video-wrapper">
                </div>
            </div>
        </div>
    </div>
  `;

  block.appendChild(modal);
  return modal;
}

/* eslint-disable no-unused-vars */
function openVideoModal(block, videoUrl) {
  const modal = block.querySelector('.testimonial-video-modal');
  const videoWrapper = modal?.querySelector('.testimonial-video-wrapper');
  if (!modal || !videoWrapper || !videoUrl) return;

  const separator = videoUrl.includes('?') ? '&' : '?';
  const iframeSrc = `${videoUrl}${separator}autoplay=1&rel=0`;

  videoWrapper.innerHTML = `
    <iframe
      src="${iframeSrc}"
      id="video"
      title="video"
      allow="autoplay;"
      allowfullscreen
    ></iframe>
  `;

  modal.classList.add('active');
  document.body.classList.add('testimonial-video-open');
}
/* eslint-enable no-unused-vars */

function closeVideoModal(block) {
  const modal = block.querySelector('.testimonial-video-modal');
  const videoWrapper = modal?.querySelector('.testimonial-video-wrapper');
  if (!modal || !videoWrapper) return;

  modal.classList.remove('active');
  videoWrapper.innerHTML = '';
  document.body.classList.remove('testimonial-video-open');
}

/* eslint-disable no-unused-vars */
function buildSlide(row, block) {
  const slide = document.createElement('div');
  slide.className = 'testimonial-image-section focus-visible-auto-imp swiper-slide';
  slide.setAttribute('tabindex', '0');

  const columns = [...row.querySelectorAll(':scope > div')];

  const imageCol = columns[0];
  const contentCol = columns[1];

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'carousel-image bg-lazy-img';

  const picture = imageCol?.querySelector('picture');
  let imgSrc = '';
  if (picture) {
    const img = picture.querySelector('img');
    if (img) imgSrc = img.src;
    imageWrapper.style.setProperty('--slick-image-url', `url('${imgSrc}')`);
    imageWrapper.style.setProperty('--slick-image-mobile-url', `url('${imgSrc}')`);

    // We recreate picture for the play icon specifically
    const playPicture = document.createElement('picture');
    playPicture.style.pointerEvents = 'none';

    imageWrapper.appendChild(playPicture);
  }

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'image-text-section';

  const logoPic = document.createElement('picture');
  logoPic.innerHTML = '<img loading="lazy" fetchpriority="auto" height="70" width="81" src="https://static.asianpaints.com/content/dam/apcolourcatalogue/asset/ap-revamp/waterproofing/landing-page/wht-our-clients-say/wht-our-client-say-bg-logo.webp" alt="wht-our-client-say-bg-logo" title="wht-our-client-say-bg-logo"/>';
  contentWrapper.appendChild(logoPic);

  if (contentCol) {
    const elements = [...contentCol.children];
    if (elements.length > 0) {
      const quoteDiv = document.createElement('div');
      quoteDiv.setAttribute('role', 'article');
      quoteDiv.className = 'image-description';
      quoteDiv.innerHTML = elements[0].innerHTML;
      contentWrapper.appendChild(quoteDiv);

      if (elements.length > 1) {
        const attribution = document.createElement('div');
        attribution.className = 'image-text';
        attribution.innerHTML = elements[1].innerHTML;
        contentWrapper.appendChild(attribution);
      }
    }
  }

  slide.append(imageWrapper, contentWrapper);

  return slide;
}

function hideSiblingHeading(siblingHeading) {
  if (!siblingHeading) return;

  const wrapper = siblingHeading.closest('.default-content-wrapper');
  if (wrapper) {
    wrapper.style.display = 'none';
  } else {
    siblingHeading.style.display = 'none';
  }
}

function bindModalEvents(block) {
  const modal = block.querySelector('.testimonial-video-modal');
  const closeButton = block.querySelector('.testimonial-video-close');

  closeButton?.addEventListener('click', () => {
    closeVideoModal(block);
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeVideoModal(block);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeVideoModal(block);
    }
  });
}

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const Swiper = await getSwiperClass();
  if (!Swiper) return;

  const { headingText, siblingHeading, testimonialRows } = buildHeading(rows, block);
  if (!testimonialRows.length) return;

  const container = document.createElement('div');
  container.className = 'multi-video-column-container';
  container.setAttribute('data-attr-variant-type', 'variantTwo');

  const headingWrapper = document.createElement('div');
  headingWrapper.className = 'water-proofing-heading';

  const headingInner = document.createElement('div');
  headingInner.setAttribute('role', 'heading');
  headingInner.setAttribute('aria-level', '1');
  headingInner.className = 'first-sub-heading-section';

  const spanOne = document.createElement('span');
  spanOne.className = 'sub-heading-one';
  spanOne.textContent = headingText;
  headingInner.appendChild(spanOne);

  headingWrapper.appendChild(headingInner);

  const carouselSection = document.createElement('div');
  carouselSection.id = 'waterproofing';
  carouselSection.className = 'carousel-section waterproofing-section swiper';

  const swiperWrapper = document.createElement('div');
  swiperWrapper.className = 'swiper-wrapper';

  testimonialRows.forEach((row) => {
    swiperWrapper.appendChild(buildSlide(row, block));
  });

  carouselSection.appendChild(swiperWrapper);

  const paginationEl = document.createElement('div');
  paginationEl.className = 'testimonial-pagination swiper-pagination';

  container.append(headingWrapper, carouselSection);
  carouselSection.append(paginationEl);

  block.textContent = '';
  block.appendChild(container);
  createVideoModal(block);

  hideSiblingHeading(siblingHeading);
  bindModalEvents(block);

  const swiper = new Swiper(carouselSection, {
    slidesPerView: 'auto',
    spaceBetween: 20,
    speed: 500,
    watchOverflow: true,
    slidesOffsetBefore: 15,
    slidesOffsetAfter: 15,
    pagination: {
      el: paginationEl,
      clickable: true,
    },
    breakpoints: {
      900: {
        slidesPerView: 2,
        spaceBetween: 20,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
      },
      1200: {
        slidesPerView: 2.2,
        spaceBetween: 20,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
      },
      1400: {
        slidesPerView: 2.5,
        spaceBetween: 20,
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
      },
    },
  });

  // eslint-disable-next-line no-underscore-dangle
  block._testimonialSwiper = swiper;
}
