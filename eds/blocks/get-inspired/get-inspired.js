import { trackEvent, triggerCTAClickWithLinkAndTitle } from '../../scripts/analytics.js';

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

    swiperWrapper.addEventListener('click', (event) => {
      const anchor = event.target.closest('a');
      if (!anchor || !swiperWrapper.contains(anchor)) return;

      const ctaLink = anchor.getAttribute('href') || '';
      const btnTitle = anchor.getAttribute('title') || anchor.textContent.trim();
      triggerCTAClickWithLinkAndTitle(ctaLink, btnTitle, title);
    });

    const anchors = [...contentEl.querySelectorAll('a')];

    anchors.forEach((a) => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';

      const titleAnchor = a.getAttribute('title');

      const infoDiv = document.createElement('div');
      infoDiv.className = 'link-fwd';

      infoDiv.innerHTML = `
        <span class="link-title">${titleAnchor}</span>
        <img src="/eds/icons/arrow-icon-new.svg" alt="arrow icon" class="link-icon">
      `;

      a.appendChild(infoDiv);

      slide.appendChild(a);
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

    btn.addEventListener('click', () => {
      const currentTabName = btn.textContent.trim();

      trackEvent('waterproofing_categories', {
        categories: currentTabName,
      });

      tabsContainer.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      tabsContainer.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      panel.classList.add('active');

      requestAnimationFrame(() => {
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

      panel.swiperInstance = new Swiper(swiperEl, {
        slidesPerView: 1.5,
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
            slidesPerView: 1.5,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 'auto',
            spaceBetween: 18,
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