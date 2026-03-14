import {
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateLinkedPictures,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';

(function loadCryptoJSGlobally() {
  if (window.CryptoJS) return;

  const script = document.createElement('script');
  script.src = '/scripts/crypto.js';
  script.async = false; // critical: preserve execution order
  document.head.appendChild(script);
}());

/**
 * Global Swiper loader
 * - can be called by any block when needed
 * - keeps a single promise to avoid duplicate requests
 */
window.loadSwiper = function loadSwiper() {
  if (window.__swiperPromise) return window.__swiperPromise;

  window.__swiperPromise = new Promise((resolve, reject) => {
    if (window.Swiper) {
      resolve(window.Swiper);
      return;
    }

    if (!document.querySelector('link[data-swiper-css]')) {
      const swiperCss = document.createElement('link');
      swiperCss.rel = 'stylesheet';
      swiperCss.href = 'https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.css';
      swiperCss.setAttribute('data-swiper-css', 'true');
      document.head.appendChild(swiperCss);
    }

    const existingScript = document.querySelector('script[data-swiper-js]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.Swiper), { once: true });
      existingScript.addEventListener('error', reject, { once: true });
      return;
    }

    const swiperScript = document.createElement('script');
    swiperScript.src = 'https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.js';
    swiperScript.setAttribute('data-swiper-js', 'true');
    swiperScript.async = true;
    swiperScript.onload = () => resolve(window.Swiper);
    swiperScript.onerror = reject;
    document.head.appendChild(swiperScript);
  });

  return window.__swiperPromise;
};

/**
 * Moves all the attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 * @param {string[]} [attrs] optional list of attribute names to move
 */
export function moveAttributes(
  from,
  to,
  attrs = [...from.attributes].map(({ nodeName }) => nodeName),
) {
  attrs.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) {
      sessionStorage.setItem('fonts-loaded', 'true');
    }
  } catch (e) {
    // sessionStorage may be unavailable (e.g. Safari private browsing)
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
// eslint-disable-next-line no-unused-vars
function buildAutoBlocks(main) {
  try {
    // TODO: add auto block, if needed
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateButtons(main);
  decorateIcons(main);
  decorateLinkedPictures(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();

  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // sessionStorage may be unavailable; fonts load lazily instead
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  const { default: loadFixedColorPartner } = await import('./fixed-color-partner-loader.js');
  loadFixedColorPartner(doc);

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  window.setTimeout(() => {
    import('./delayed.js');
  }, 3000);

  // Preload Swiper later so it doesn't affect LCP,
  // but keep window.loadSwiper available for on-demand block usage.
  window.setTimeout(() => {
    window.loadSwiper?.().catch((e) => {
      // eslint-disable-next-line no-console
      console.error('Failed to preload Swiper', e);
    });
  }, 3000);
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();

const { searchParams, origin } = new URL(window.location.href);
const branch = searchParams.get('nx') || 'main';

export const NX_ORIGIN = branch === 'local' || origin.includes('localhost')
  ? 'http://localhost:6456/nx'
  : 'https://da.live/nx';

(async function loadDa() {
  /* eslint-disable import/no-unresolved */
  if (searchParams.get('dapreview')) {
    await import('https://da.live/scripts/dapreview.js').then(async ({ default: daPreview }) => {
      await daPreview(loadPage);

      // add class to body to be used for restricting vh metric
      document.body.classList.add('da-live-preview');

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList') {
            const currentBody = document.body;
            if (currentBody && !currentBody.classList.contains('da-live-preview')) {
              currentBody.classList.add('da-live-preview');
            }
          }
        });
      });

      observer.observe(document.documentElement, { childList: true, subtree: false });
    });
  }

  if (searchParams.get('daexperiment')) {
    import(`${NX_ORIGIN}/public/plugins/exp/exp.js`);
  }
}());