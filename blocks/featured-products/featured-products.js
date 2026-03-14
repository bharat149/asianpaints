/*
** Authoring format **
Col 1 contains multiple desktop top images
Col 2 contains multiple mobile top images
Col 3 contains multiple URLs
*/

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

function getHref(linkCol) {
  if (!linkCol) return '#';

  const anchor = linkCol.querySelector('a[href]');
  if (anchor?.href) return anchor.href;

  const text = linkCol.textContent?.trim();
  return text || '#';
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const section = block.closest('.section');
  const sectionTitle = section?.querySelector('h2');
  const titleText = sectionTitle?.textContent?.trim() || 'Featured Products';

  if (sectionTitle) {
    sectionTitle.style.display = 'none';
  }

  const header = document.createElement('div');
  header.className = 'featured-products-header';

  const title = document.createElement('h2');
  title.className = 'featured-products-title';
  title.textContent = titleText;

  const nav = document.createElement('div');
  nav.className = 'featured-products-nav';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'featured-products-prev swiper-button-prev';
  prevBtn.type = 'button';
  prevBtn.setAttribute('aria-label', 'Previous');

  const nextBtn = document.createElement('button');
  nextBtn.className = 'featured-products-next swiper-button-next';
  nextBtn.type = 'button';
  nextBtn.setAttribute('aria-label', 'Next');

  nav.append(prevBtn, nextBtn);
  header.append(title, nav);

  const carousel = document.createElement('div');
  carousel.className = 'featured-products-carousel';

  const swiperEl = document.createElement('div');
  swiperEl.className = 'featured-products-images swiper';

  const wrapper = document.createElement('div');
  wrapper.className = 'swiper-wrapper';

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 3) return;

    const desktopCol = cols[0];
    const mobileCol = cols[1];
    const linkCol = cols[2];

    const desktopPicture = desktopCol?.querySelector('picture');
    const mobilePicture = mobileCol?.querySelector('picture');
    const href = getHref(linkCol);

    if (!desktopPicture && !mobilePicture) return;

    const slide = document.createElement('div');
    slide.className = 'featured-products-slide swiper-slide';

    const anchor = document.createElement('a');
    anchor.className = 'featured-products-card';
    anchor.href = href;
    anchor.setAttribute('aria-label', 'View featured product');

    if (desktopPicture) {
      const desktopWrap = document.createElement('div');
      desktopWrap.className = 'featured-products-image featured-products-image--desktop';
      desktopWrap.appendChild(desktopPicture.cloneNode(true));
      anchor.appendChild(desktopWrap);
    }

    if (mobilePicture) {
      const mobileWrap = document.createElement('div');
      mobileWrap.className = 'featured-products-image featured-products-image--mobile';
      mobileWrap.appendChild(mobilePicture.cloneNode(true));
      anchor.appendChild(mobileWrap);
    }

    slide.appendChild(anchor);
    wrapper.appendChild(slide);
  });

  if (!wrapper.children.length) return;

  swiperEl.appendChild(wrapper);

  let paginationEl;
  if (wrapper.children.length > 1) {
    paginationEl = document.createElement('div');
    paginationEl.className = 'featured-products-pagination swiper-pagination';
    carousel.append(swiperEl, paginationEl);
  } else {
    carousel.appendChild(swiperEl);
    nav.style.display = 'none';
  }

  block.innerHTML = '';
  block.append(header, carousel);

  if (wrapper.children.length <= 1) return;

  try {
    const Swiper = await getSwiperClass();
    if (!Swiper) return;

    const swiper = new Swiper(swiperEl, {
      slidesPerView: 1,
      speed: 600,
      loop: false,
      watchOverflow: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      navigation: {
        prevEl: prevBtn,
        nextEl: nextBtn,
      },
      pagination: {
        el: paginationEl,
        clickable: false,
      },
      on: {
        init(instance) {
          removeInjectedSwiperIcons(prevBtn, nextBtn);
          updateNavState(instance, prevBtn, nextBtn);
        },
        slideChange(instance) {
          updateNavState(instance, prevBtn, nextBtn);
        },
        resize(instance) {
          removeInjectedSwiperIcons(prevBtn, nextBtn);
          updateNavState(instance, prevBtn, nextBtn);
        },
        reachBeginning(instance) {
          updateNavState(instance, prevBtn, nextBtn);
        },
        reachEnd(instance) {
          updateNavState(instance, prevBtn, nextBtn);
        },
        fromEdge(instance) {
          updateNavState(instance, prevBtn, nextBtn);
        },
      },
    });

    removeInjectedSwiperIcons(prevBtn, nextBtn);
    block.featuredProductsSwiper = swiper;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize Swiper', error);
  }
}