import { trackEvent, bindCarouselNavigationTracking } from "../../scripts/analytics_1.js";
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

function createQuoteIcon() {
  const logo = document.createElement('div');
  logo.className = 'testimonial-logo-bg';

  const img = document.createElement('img');
  img.src = 'https://static.asianpaints.com/content/dam/apcolourcatalogue/asset/ap-revamp/waterproofing/landing-page/wht-our-clients-say/wht-our-client-say-bg-logo.webp';
  img.alt = 'Quote background';
  img.loading = 'lazy';

  logo.appendChild(img);

  return logo;
}

function getTestimonialContent(columns) {
  let quoteText = '';
  let nameText = '';
  let locationText = '';

  if (columns.length >= 4) {
    quoteText = columns[1]?.textContent?.trim() || '';
    nameText = columns[2]?.textContent?.trim() || '';
    locationText = columns[3]?.textContent?.trim() || '';
  } else if (columns.length >= 2) {
    const paragraphs = columns[1]?.querySelectorAll('p') || [];
    if (paragraphs[0]) quoteText = paragraphs[0].textContent.trim();

    if (paragraphs[1]) {
      const strong = paragraphs[1].querySelector('strong');
      const fullText = paragraphs[1].textContent.trim();

      if (strong) {
        nameText = strong.textContent.trim();
        locationText = fullText.replace(nameText, '').replace(/^[,\s]+/, '').trim();
      } else {
        const parts = fullText.split(',');
        nameText = parts[0]?.trim() || '';
        locationText = parts.slice(1).join(',').trim();
      }
    }
  }

  return { quoteText, nameText, locationText };
}

function createVideoModal(block) {
  const modal = document.createElement('div');
  modal.className = 'testimonial-video-modal';
  modal.innerHTML = `
    <div class="testimonial-video-modal-content">
      <button class="testimonial-video-close" type="button" aria-label="Close video popup">
        <span></span>
        <span></span>
      </button>
      <div class="testimonial-video-wrapper"></div>
    </div>
  `;

  block.appendChild(modal);
  return modal;
}

function openVideoModal(block, videoUrl) {
  const modal = block.querySelector('.testimonial-video-modal');
  const videoWrapper = modal?.querySelector('.testimonial-video-wrapper');
  if (!modal || !videoWrapper || !videoUrl) return;

  const separator = videoUrl.includes('?') ? '&' : '?';
  const iframeSrc = `${videoUrl}${separator}autoplay=1&rel=0`;

  videoWrapper.innerHTML = `
    <iframe
      src="${iframeSrc}"
      title="Customer testimonial video"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowfullscreen
    ></iframe>
  `;

  modal.classList.add('active');
  document.body.classList.add('testimonial-video-open');
}

function closeVideoModal(block) {
  const modal = block.querySelector('.testimonial-video-modal');
  const videoWrapper = modal?.querySelector('.testimonial-video-wrapper');
  if (!modal || !videoWrapper) return;

  modal.classList.remove('active');
  videoWrapper.innerHTML = '';
  document.body.classList.remove('testimonial-video-open');
}

function buildSlide(row, block) {
  const slide = document.createElement('div');
  slide.className = 'testimonial-slide swiper-slide';

  const columns = [...row.querySelectorAll(':scope > div')];

  // HTML structure: columns[0] = <a href="youtube"><picture></picture></a>
  //                 columns[1] = quote text
  //                 columns[2] = name
  //                 columns[3] = location
const imageCol = columns[0];
const videoCol = columns[1];
const descriptionCol = columns[2];
const nameCol = columns[3];
const placeCol = columns[4];

  // Video link lives in the <a> wrapping the thumbnail image
  // const videoLink = imageCol?.querySelector('a')?.href || '';
  const videoLink = columns[1]?.textContent.trim() || '';

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'testimonial-image';

  const picture = imageCol?.querySelector('picture');
  if (picture) imageWrapper.appendChild(picture.cloneNode(true));

  const playButton = document.createElement('button');
  playButton.className = 'testimonial-play-button';
  playButton.type = 'button';
  playButton.setAttribute('aria-label', 'Play testimonial video');

  playButton.innerHTML = `
    <img
      src="https://static.asianpaints.com/content/dam/apcolourcatalogue/asset/ap-revamp/waterproofing/landing-page/wht-our-clients-say/play-icon.webp"
      alt="Play video"
      loading="lazy"
    />
  `;

  if (!videoLink) {
    playButton.style.display = 'none';
  } else {
    playButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openVideoModal(block, videoLink);
      trackEvent('test_open');
    });
  }

  imageWrapper.appendChild(playButton);

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'testimonial-content';
  contentWrapper.appendChild(createQuoteIcon());

  const quoteText = descriptionCol?.textContent?.trim() || '';
const nameText = nameCol?.textContent?.trim() || '';
const placeText = placeCol?.textContent?.trim() || '';

  if (quoteText) {
    const quoteDiv = document.createElement('div');
    quoteDiv.className = 'testimonial-quote';
    quoteDiv.textContent = quoteText;
    contentWrapper.appendChild(quoteDiv);
  }

  if (nameText) {
    const attribution = document.createElement('div');
    attribution.className = 'testimonial-attribution';
    attribution.innerHTML = `
      <span class="testimonial-name">${nameText}</span>
      ${placeText ? `<span class="testimonial-location">, ${placeText}</span>` : ''}
    `;
    contentWrapper.appendChild(attribution);
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

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const { headingText, siblingHeading, testimonialRows } = buildHeading(rows, block);
  if (!testimonialRows.length) return;

  const container = document.createElement('div');
  container.className = 'testimonial-carousel-container';

  const headingWrapper = document.createElement('div');
  headingWrapper.className = 'testimonial-heading';

  const h2 = document.createElement('h2');
  const words = headingText.split(' ');
  const midPoint = Math.ceil(words.length / 3);
  h2.innerHTML = `${words.slice(0, midPoint).join(' ')}<br>${words.slice(midPoint).join(' ')}`;
  headingWrapper.appendChild(h2);

  const carouselWrapper = document.createElement('div');
  carouselWrapper.className = 'testimonial-carousel-inner-wrapper';

  const swiperEl = document.createElement('div');
  swiperEl.className = 'testimonial-swiper swiper';

  const swiperWrapper = document.createElement('div');
  swiperWrapper.className = 'swiper-wrapper';

  testimonialRows.forEach((row) => {
    swiperWrapper.appendChild(buildSlide(row, block));
  });

  swiperEl.appendChild(swiperWrapper);

  const paginationEl = document.createElement('div');
  paginationEl.className = 'testimonial-pagination swiper-pagination';

  const navButtons = document.createElement('div');
  navButtons.className = 'testimonial-nav-buttons';
  navButtons.innerHTML = `
    <button class="testimonial-prev" aria-label="Previous testimonial" type="button">

    </button>
    <button class="testimonial-next" aria-label="Next testimonial" type="button">

    </button>
  `;

  carouselWrapper.append(swiperEl, paginationEl, navButtons);
  container.append(headingWrapper, carouselWrapper);

  block.textContent = '';
  block.appendChild(container);
  createVideoModal(block);

  hideSiblingHeading(siblingHeading);
  bindModalEvents(block);

  const prevButton = block.querySelector('.testimonial-prev');
  const nextButton = block.querySelector('.testimonial-next');
  function handleNav(swiper) {
    const totalSlides = swiper.slides.length;



    let slidesPerView = swiper.params.slidesPerView;

    // ✅ correct way to get current slidesPerView
    if (typeof slidesPerView !== 'number') {
      slidesPerView = swiper.slidesPerViewDynamic();
    }

    // Hide arrows if not enough slides
    if (totalSlides <= slidesPerView) {
      prevButton.style.display = 'none';
      nextButton.style.display = 'none';
      return;
    }

    // Otherwise show and control disable
    prevButton.style.display = '';
    nextButton.style.display = '';

    prevButton.disabled = swiper.isBeginning;
    nextButton.disabled = swiper.isEnd;
  }
  /* Defer Swiper init until the carousel is about to enter the viewport.
   * Until then, the static slides render as a vertical stack (CSS shows just
   * the first one — see .testimonial-carousel:not(.swiper-ready) rules).
   * This keeps the ~150 ms of Swiper parse/init out of the LCP critical path
   * for users who land on the page; users who scroll get Swiper ready by the
   * time they reach this block (300 px rootMargin).
   */
  const initSwiper = async () => {
    if (block.dataset.swiperInitialized === 'true') return;
    block.dataset.swiperInitialized = 'true';

    const Swiper = await getSwiperClass();
    if (!Swiper) return;

    const swiper = new Swiper(swiperEl, {
      slidesPerView: 1,
      spaceBetween: 20,
      speed: 500,
      slidesPerGroup: 1,
      centeredSlides: false,
      slideToClickedSlide: false,
      touchRatio: 1,
      resistanceRatio: 0.85,
      threshold: 5,
      watchOverflow: false,
      navigation: {
        prevEl: prevButton,
        nextEl: nextButton,
      },
      pagination: {
        el: paginationEl,
        clickable: true,
      },
      breakpoints: {
        600: {
          slidesPerView: 1.1,
          spaceBetween: 20,
        },
        900: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
      },
      on: {
        init(s) {
          block.classList.add('swiper-ready');
          handleNav(s);
        },
        slideChange(s) {
          handleNav(s);
        },
        resize(s) {
          handleNav(s);
        },
      },
    });

    block._testimonialSwiper = swiper;
    bindCarouselNavigationTracking(block, headingText);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      initSwiper();
    }, { rootMargin: '300px 0px' });
    observer.observe(block);
  } else {
    /* No IntersectionObserver — init immediately to keep functionality. */
    initSwiper();
  }
}