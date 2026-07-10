import { trackCarouselNavigation, triggerCTAClickWithLinkAndTitle, trackEvent } from '../../scripts/analytics_1.js';

async function getSwiperClass() {
  if (window.Swiper) return window.Swiper;
  if (window.loadSwiper) return window.loadSwiper();

  return null;
}

function runWhenIdle(callback) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, { timeout: 1200 });
    return;
  }

  window.setTimeout(callback, 0);
}

// Category keywords that follow the room name in an inspiration card's URL
// slug (e.g. living-room-texture-designs). Used to isolate the room name.
const CARD_CATEGORY_WORDS = new Set([
  'colour', 'color', 'colours', 'colors',
  'texture', 'textures', 'wallpaper', 'wallpapers',
  'wood', 'combination', 'combinations',
  'design', 'designs', 'work', 'works', 'idea', 'ideas',
]);

/**
 * Derive the card's room name (eVar67) from its destination URL slug.
 * The room is the leading part of the slug before the first category word,
 * formatted as sentence case. Examples:
 *   /inspiration/living-room-texture-designs.html -> 'Living room'
 *   /inspiration/kids-room-colour-combination.html -> 'Kids room'
 */
function getCardTitleFromHref(href) {
  const slug = (href || '')
    .split('?')[0]
    .split('#')[0]
    .replace(/\.html?$/i, '')
    .split('/')
    .filter(Boolean)
    .pop() || '';
  if (!slug) return '';

  const tokens = slug.split('-');
  const stop = tokens.findIndex((t) => CARD_CATEGORY_WORDS.has(t.toLowerCase()));
  const roomTokens = stop === -1 ? tokens : tokens.slice(0, stop);
  if (!roomTokens.length) return '';

  const phrase = roomTokens.join(' ');
  return phrase.charAt(0).toUpperCase() + phrase.slice(1).toLowerCase();
}

function trackNavClick(button, navigationAction, testTitle) {
  if (!button) return;

  button.addEventListener('click', (event) => {
    event.preventDefault();

    const resolvedNavigationAction = navigationAction
      || button.getAttribute('aria-label')
      || '';

    trackCarouselNavigation(resolvedNavigationAction, testTitle);
  });
}

export default function decorate(block) {
  // This block binds its own carousel Previous/Next tracking (trackNavClick).
  // Flag it so the global carousel-navigation tracker skips it and we don't
  // fire duplicate Navigation events.
  block.dataset.navTrackingBound = 'true';

  const sections = [...block.children];
  let blockInView = false;

  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'tabs';

  const tabNav = document.createElement('div');
  tabNav.className = 'tabs-nav';

  const tabContent = document.createElement('div');
  tabContent.className = 'tabs-content';

  const initializePanelSwiper = async (panel) => {
    if (!panel || panel.swiperInstance || panel.dataset.swiperPending === 'true') return;

    const swiperEl = panel.querySelector('.swiper');
    const paginationEl = panel.querySelector('.swiper-pagination');
    const nextEl = panel.querySelector('.swiper-button-next');
    const prevEl = panel.querySelector('.swiper-button-prev');

    if (!swiperEl || !paginationEl || !nextEl || !prevEl) return;

    panel.dataset.swiperPending = 'true';

    const Swiper = await getSwiperClass();
    if (!Swiper) {
      panel.dataset.swiperPending = 'false';
      return;
    }

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

    panel.dataset.swiperPending = 'false';
  };

  const maybeInitializePanelSwiper = (panel, force = false) => {
    if (!panel) return;
    if (!force && !blockInView) return;

    runWhenIdle(() => {
      initializePanelSwiper(panel);
    });
  };

  sections.forEach((section, index) => {
    const titleEl = section.querySelector(':scope > div:first-child');
    const contentEl = section.querySelector(':scope > div:last-child');

    const title = titleEl.textContent.trim();

    const btn = document.createElement('button');
    btn.className = 'tab-btn';
    btn.textContent = title;

    const panel = document.createElement('div');
    panel.className = 'tab-panel';

    const prevEl = document.createElement('button');
    prevEl.className = 'swiper-button-prev';
    prevEl.type = 'button';
    prevEl.setAttribute('aria-label', 'Previous');

    const nextEl = document.createElement('button');
    nextEl.className = 'swiper-button-next';
    nextEl.type = 'button';
    nextEl.setAttribute('aria-label', 'Next');

    trackNavClick(prevEl, 'Previous', title);
    trackNavClick(nextEl, 'Next', title);

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
      // eVar67 must be the clicked card's own room name (e.g. 'Living room'),
      // not the active tab title. Fall back to the tab title if the URL slug
      // doesn't yield a room name.
      const cardTitle = getCardTitleFromHref(ctaLink) || title;
      triggerCTAClickWithLinkAndTitle(ctaLink, btnTitle, cardTitle);
    });

    const anchors = [...contentEl.querySelectorAll('a')];

    anchors.forEach((a, slideIndex) => {
      const image = a.querySelector('img');
      if (image) {
        image.setAttribute('width', '324');
        image.setAttribute('height', '470');

        // First slide of the first (active) panel is the LCP candidate —
        // load eagerly with high priority so it isn't blocked behind lazy images.
        if (index === 0 && slideIndex === 0) {
          image.setAttribute('loading', 'eager');
          image.setAttribute('fetchpriority', 'high');
          image.removeAttribute('data-loading');
        }
      }

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

      // Registry key for eVar67 is `title` — passing `categories` would
      // fall through to contextData.categories instead of the eVar.
      trackEvent('waterproofing_categories', {
        title: currentTabName,
      });

      tabsContainer.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      tabsContainer.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      panel.classList.add('active');

      maybeInitializePanelSwiper(panel, true);

      requestAnimationFrame(() => {
        if (panel.swiperInstance) {
          panel.swiperInstance.update();
        }
      });
    });

    tabNav.appendChild(btn);
    tabContent.appendChild(panel);

    if (index === 0) {
      maybeInitializePanelSwiper(panel);
    }
  });

  block.innerHTML = '';

  tabsContainer.appendChild(tabNav);
  tabsContainer.appendChild(tabContent);

  block.appendChild(tabsContainer);

  const observer = new IntersectionObserver((entries, obs) => {
    if (!entries[0]?.isIntersecting) return;

    blockInView = true;
    const activePanel = block.querySelector('.tab-panel.active');
    maybeInitializePanelSwiper(activePanel, true);
    obs.disconnect();
  }, {
    rootMargin: '200px 0px',
    threshold: 0,
  });

  observer.observe(block);
}