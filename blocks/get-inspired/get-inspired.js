async function getSwiperClass() {
  if (window.Swiper) return window.Swiper;
  if (window.loadSwiper) return window.loadSwiper();

  return null;
}

export default function decorate(block) {
  const sections = [...block.children];

  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'tabs';

  const tabNav = document.createElement('div');
  tabNav.className = 'tabs-nav';

  const tabContent = document.createElement('div');
  tabContent.className = 'tabs-content';

  sections.forEach((section, index) => {
    const titleEl = section.querySelector(':scope > div:first-child');
    const contentEl = section.querySelector(':scope > div:last-child');

    const title = titleEl.textContent.trim();

    const btn = document.createElement('button');
    btn.className = 'tab-btn';
    btn.textContent = title;

    const panel = document.createElement('div');
    panel.className = 'tab-panel';

    const prevEl = document.createElement('div');
    prevEl.className = 'swiper-button-prev';

    const nextEl = document.createElement('div');
    nextEl.className = 'swiper-button-next';

    const swiperContainerWrapper = document.createElement('div');
    swiperContainerWrapper.className = 'swiper-container-wrapper';

    const swiperNavWrapper = document.createElement('div');
    swiperNavWrapper.className = 'swiper-nav-wrapper';

    const swiperPaginationWrapper = document.createElement('div');
    swiperPaginationWrapper.className = 'swiper-pagination-wrapper';

    swiperContainerWrapper.appendChild(swiperNavWrapper);
    swiperContainerWrapper.appendChild(swiperPaginationWrapper);

    swiperNavWrapper.appendChild(prevEl);
    swiperNavWrapper.appendChild(nextEl);

    const swiperEl = document.createElement('div');
    swiperEl.className = 'swiper';

    const swiperWrapper = document.createElement('div');
    swiperWrapper.className = 'swiper-wrapper';

    const paragraphs = [...contentEl.querySelectorAll('p')];

    paragraphs.forEach((p) => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';

      // Find anchor inside paragraph
      const anchor = p.querySelector('a');

      if (anchor) {
        const titleAnchor = anchor.getAttribute('title');

        // Create div to append inside anchor
        const infoDiv = document.createElement('div');
        infoDiv.className = 'link-fwd';

        infoDiv.innerHTML = `<span class="link-title">${titleAnchor}</span> <img src="/icons/arrow-icon-new.svg" alt="arrow icon" class="link-icon">`;

        anchor.appendChild(infoDiv);
      }

      slide.appendChild(p);
      swiperWrapper.appendChild(slide);
    });

    swiperEl.appendChild(swiperWrapper);

    const paginationEl = document.createElement('div');
    paginationEl.className = 'swiper-pagination';

    swiperContainerWrapper.appendChild(swiperEl);

    swiperPaginationWrapper.appendChild(paginationEl);
    panel.appendChild(swiperContainerWrapper);

    if (index === 0) {
      btn.classList.add('active');
      panel.classList.add('active');
    }

    // ✅ Function to fix widths BEFORE swiper update
    function fixSwiperLayout() {
      const containerWidth = tabsContainer.getBoundingClientRect().width
        - tabNav.getBoundingClientRect().width;

      if (!containerWidth) return;

      // Set container width
      swiperContainerWrapper.style.width = `${containerWidth}px`;

      const slides = swiperWrapper.querySelectorAll('.swiper-slide');
      const slidesPerView = 5;
      const spaceBetween = 18;

      const slideWidth = (containerWidth - (slidesPerView - 1) * spaceBetween) / slidesPerView;

      let totalWidth = 0;

      slides.forEach((slide, i) => {
        slide.style.width = `${slideWidth}px`;
        totalWidth += slideWidth;

        if (i !== slides.length - 1) {
          totalWidth += spaceBetween;
        }
      });

      swiperWrapper.style.width = `${totalWidth}px`;
    }

    btn.addEventListener('click', () => {
      tabsContainer.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      tabsContainer.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      panel.classList.add('active');

      requestAnimationFrame(() => {
        fixSwiperLayout();

        if (panel.swiperInstance) {
          panel.swiperInstance.update();
        }
      });
    });

    tabNav.appendChild(btn);
    tabContent.appendChild(panel);

    setTimeout(async () => {
      const Swiper = await getSwiperClass();
      if (!Swiper) return;

      // Initial fix (only works if visible)
      if (index === 0) {
        requestAnimationFrame(fixSwiperLayout);
      }

      panel.swiperInstance = new Swiper(swiperEl, {
        slidesPerView: 5,
        spaceBetween: 18,
        loop: false,
        watchOverflow: true,
        observer: true,
        observeParents: true,
        pagination: {
          el: paginationEl,
          clickable: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 3.5,
          },
          1024: {
            slidesPerView: 5,
          },
        },
        navigation: {
          nextEl,
          prevEl,
        },
      });
    }, 0);
  });

  block.innerHTML = '';

  tabsContainer.appendChild(tabNav);
  tabsContainer.appendChild(tabContent);

  block.appendChild(tabsContainer);
}
