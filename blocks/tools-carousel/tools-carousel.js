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

export default async function decorate(block) {
  const section = block.closest('.section');
  if (section) {
    section.classList.add('tools-carousel-wrapper');
  }

  const row = block.querySelector(':scope > div');
  if (!row) return;

  const columns = [...row.children];
  if (columns.length < 2) return;

  const headingCol = columns[0];
  headingCol.classList.add('tools-carousel-heading');

  const carouselCol = columns[1];
  carouselCol.classList.add('tools-carousel-items');

  const images = [...carouselCol.querySelectorAll('img')];
  const headings = [...carouselCol.querySelectorAll('h3')];

  if (!images.length && !headings.length) {
    block.append(headingCol, carouselCol);
    row.remove();
    return;
  }

  const swiperEl = document.createElement('div');
  swiperEl.className = 'tools-carousel-track swiper';

  const swiperWrapper = document.createElement('div');
  swiperWrapper.className = 'swiper-wrapper';

  const items = Math.max(images.length, headings.length);

  for (let i = 0; i < items; i += 1) {
    const slide = document.createElement('div');
    slide.className = 'tools-carousel-slide swiper-slide';

    const heading = headings[i];
    const img = images[i];

    if (img) {
      slide.appendChild(img.cloneNode(true));
    }

    if (heading) {
      const title = document.createElement('div');
      title.className = 'tools-carousel-title';
      title.textContent = heading.textContent;
      slide.appendChild(title);
    }

    swiperWrapper.appendChild(slide);
  }

  swiperEl.appendChild(swiperWrapper);

  const totalSlides = swiperWrapper.children.length;
  let prevButton;
  let nextButton;
  let paginationEl;

  carouselCol.innerHTML = '';

  if (totalSlides > 1) {
    const navContainer = document.createElement('div');
    navContainer.className = 'tools-carousel-nav-container';

    prevButton = document.createElement('button');
    prevButton.className = 'tools-carousel-nav tools-carousel-prev swiper-button-prev';
    prevButton.type = 'button';
    prevButton.setAttribute('aria-label', 'Previous');

    nextButton = document.createElement('button');
    nextButton.className = 'tools-carousel-nav tools-carousel-next swiper-button-next';
    nextButton.type = 'button';
    nextButton.setAttribute('aria-label', 'Next');

    navContainer.appendChild(prevButton);
    navContainer.appendChild(nextButton);

    paginationEl = document.createElement('div');
    paginationEl.className = 'tools-carousel-pagination swiper-pagination';

    carouselCol.appendChild(navContainer);
    carouselCol.appendChild(swiperEl);
    carouselCol.appendChild(paginationEl);
  } else {
    carouselCol.appendChild(swiperEl);
  }

  block.append(headingCol, carouselCol);
  row.remove();

  if (totalSlides <= 1) return;

  try {
    const Swiper = await getSwiperClass();
    if (!Swiper) return;

    const swiper = new Swiper(swiperEl, {
      slidesPerView: 'auto',
      spaceBetween: 16,
      speed: 500,
      loop: false,
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
        0: {
          slidesPerView: 'auto',
          spaceBetween: 12,
        },
        1000: {
          slidesPerView: 'auto',
          spaceBetween: 16,
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
    block.toolsCarouselSwiper = swiper;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize tools-carousel Swiper', error);
  }
}