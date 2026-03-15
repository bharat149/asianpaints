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
  const logoSvg = document.createElement('div');
  logoSvg.className = 'testimonial-logo-bg';
  logoSvg.innerHTML = `
    <svg width="81" height="70" viewBox="0 0 81 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M35.5 0C25.283 0 17 8.283 17 18.5C17 28.717 25.283 37 35.5 37C37.053 37 38.561 36.822 40 36.492V37C40 51.912 27.912 64 13 64H10V70H13C31.225 70 46 55.225 46 37V18.5C46 8.283 37.717 0 35.5 0Z" fill="#E8E8E8"/>
      <path d="M70.5 0C60.283 0 52 8.283 52 18.5C52 28.717 60.283 37 70.5 37C72.053 37 73.561 36.822 75 36.492V37C75 51.912 62.912 64 48 64H45V70H48C66.225 70 81 55.225 81 37V18.5C81 8.283 72.717 0 70.5 0Z" fill="#E8E8E8"/>
    </svg>
  `;
  return logoSvg;
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

function buildSlide(row) {
  const slide = document.createElement('div');
  slide.className = 'testimonial-slide swiper-slide';

  const columns = [...row.querySelectorAll(':scope > div')];

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'testimonial-image';
  const picture = columns[0]?.querySelector('picture');
  if (picture) imageWrapper.appendChild(picture.cloneNode(true));

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'testimonial-content';
  contentWrapper.appendChild(createQuoteIcon());

  const { quoteText, nameText, locationText } = getTestimonialContent(columns);

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
      ${locationText ? `<span class="testimonial-location">, ${locationText}</span>` : ''}
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

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const Swiper = await getSwiperClass();
  if (!Swiper) return;

  const { headingText, siblingHeading, testimonialRows } = buildHeading(rows, block);
  if (!testimonialRows.length) return;

  const container = document.createElement('div');
  container.className = 'testimonial-carousel-container';

  const headingWrapper = document.createElement('div');
  headingWrapper.className = 'testimonial-heading';

  const h2 = document.createElement('h2');
  const words = headingText.split(' ');
  const midPoint = Math.ceil(words.length / 2);
  h2.innerHTML = `${words.slice(0, midPoint).join(' ')}<br>${words.slice(midPoint).join(' ')}`;
  headingWrapper.appendChild(h2);

  const carouselWrapper = document.createElement('div');
  carouselWrapper.className = 'testimonial-carousel-wrapper';

  const swiperEl = document.createElement('div');
  swiperEl.className = 'testimonial-swiper swiper';

  const swiperWrapper = document.createElement('div');
  swiperWrapper.className = 'swiper-wrapper';

  testimonialRows.forEach((row) => {
    swiperWrapper.appendChild(buildSlide(row));
  });

  swiperEl.appendChild(swiperWrapper);

  const paginationEl = document.createElement('div');
  paginationEl.className = 'testimonial-pagination swiper-pagination';

  const navButtons = document.createElement('div');
  navButtons.className = 'testimonial-nav-buttons';
  navButtons.innerHTML = `
    <button class="testimonial-prev" aria-label="Previous testimonial" type="button">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 18L9 12L15 6" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <button class="testimonial-next" aria-label="Next testimonial" type="button">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 18L15 12L9 6" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  `;

  carouselWrapper.append(swiperEl, paginationEl, navButtons);
  container.append(headingWrapper, carouselWrapper);

  block.textContent = '';
  block.appendChild(container);

  hideSiblingHeading(siblingHeading);

  const prevButton = block.querySelector('.testimonial-prev');
  const nextButton = block.querySelector('.testimonial-next');

  const swiper = new Swiper(swiperEl, {
    slidesPerView: 1.1,
    spaceBetween: 20,
    speed: 500,
    watchOverflow: true,
    navigation: {
      prevEl: prevButton,
      nextEl: nextButton,
    },
    pagination: {
      el: paginationEl,
      clickable: false,
    },
    breakpoints: {
      600: {
        slidesPerView: 1.2,
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
        prevButton.disabled = s.isBeginning;
        nextButton.disabled = s.isEnd;
      },
      slideChange(s) {
        prevButton.disabled = s.isBeginning;
        nextButton.disabled = s.isEnd;
      },
      resize(s) {
        prevButton.disabled = s.isBeginning;
        nextButton.disabled = s.isEnd;
      },
    },
  });

  block._testimonialSwiper = swiper;
}