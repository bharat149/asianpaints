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
import { bindButtonContainerTracking } from './analytics.js';

(function loadCryptoJSGlobally() {
  if (window.CryptoJS) return;

  const script = document.createElement('script');
  script.src = '/eds/scripts/crypto.js';
  script.async = false;
  document.head.appendChild(script);
}());

/**
 * Global jQuery loader
 * - loads jQuery only once
 * - returns a promise so dependent code can await it
 * - useful for legacy modules such as analytics or older blocks
 */
window.loadJQuery = function loadJQuery() {
  if (window.__jqueryPromise) return window.__jqueryPromise;

  window.__jqueryPromise = new Promise((resolve, reject) => {
    if (window.jQuery) {
      resolve(window.jQuery);
      return;
    }

    const existingScript = document.querySelector('script[data-jquery-js]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.jQuery), { once: true });
      existingScript.addEventListener('error', reject, { once: true });
      return;
    }

    const jqueryScript = document.createElement('script');
    jqueryScript.src = '/eds/scripts/jquery.min.js';
    jqueryScript.async = true;
    jqueryScript.setAttribute('data-jquery-js', 'true');
    jqueryScript.onload = () => resolve(window.jQuery);
    jqueryScript.onerror = reject;
    document.head.appendChild(jqueryScript);
  });

  return window.__jqueryPromise;
};

/**
 * Global Bootstrap loader
 * - loads Bootstrap CSS once
 * - optionally loads Bootstrap JS bundle once
 */
window.loadBootstrap = function loadBootstrap({ withJS = false } = {}) {
  if (!window.__bootstrapCssPromise) {
    window.__bootstrapCssPromise = new Promise((resolve, reject) => {
      if (document.querySelector('link[data-bootstrap-css]')) {
        resolve();
        return;
      }

      const bootstrapCss = document.createElement('link');
      bootstrapCss.rel = 'stylesheet';
      bootstrapCss.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
      bootstrapCss.setAttribute('data-bootstrap-css', 'true');
      bootstrapCss.onload = () => resolve();
      bootstrapCss.onerror = reject;
      document.head.appendChild(bootstrapCss);
    });
  }

  if (!withJS) return window.__bootstrapCssPromise;

  if (!window.__bootstrapJsPromise) {
    window.__bootstrapJsPromise = new Promise((resolve, reject) => {
      if (window.bootstrap) {
        resolve(window.bootstrap);
        return;
      }

      const existingScript = document.querySelector('script[data-bootstrap-js]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(window.bootstrap), { once: true });
        existingScript.addEventListener('error', reject, { once: true });
        return;
      }

      const bootstrapScript = document.createElement('script');
      bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
      bootstrapScript.async = true;
      bootstrapScript.setAttribute('data-bootstrap-js', 'true');
      bootstrapScript.onload = () => resolve(window.bootstrap);
      bootstrapScript.onerror = reject;
      document.head.appendChild(bootstrapScript);
    });
  }

  return Promise.all([window.__bootstrapCssPromise, window.__bootstrapJsPromise]);
};

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
      swiperCss.href = '/eds/styles/swiper.css';
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
    swiperScript.src = '/eds/scripts/swiper.js';
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
 * Loads fonts.css and sets a session storage flag.
 * Fonts are intentionally not forced into the critical path.
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) {
      sessionStorage.setItem('fonts-loaded', 'true');
    }
  } catch (e) {
    // sessionStorage may be unavailable
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
  bindButtonContainerTracking(main);
  decorateIcons(main);
  decorateLinkedPictures(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads only the assets and logic required for the initial render / LCP.
 * Analytics is intentionally excluded from this phase to avoid blocking
 * rendering and to keep jQuery out of the critical path.
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
 * Loads everything that is needed soon after the first paint,
 * but is still non-critical compared to the eager phase.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);

  /* Load Bootstrap CSS globally once the page is usable */
  await window.loadBootstrap?.({ withJS: false });

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  // Floating popup button
  // const { default: loadFixedColorPartner } = await import('./fixed-color-partner-loader.js');
  // loadFixedColorPartner(doc);

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
}

/**
 * Loads delayed resources that should not compete with the initial render.
 * This includes:
 * - delayed.js
 * - Swiper preload
 * - Bootstrap preload
 * - jQuery preload for legacy code
 * - analytics initialization
 *
 * Analytics is loaded here on purpose because it depends on jQuery,
 * and neither should block LCP / initial page rendering.
 */
function loadDelayed() {
  window.setTimeout(() => {
    import('./delayed.js');
  }, 3000);

  /**
   * Preload Swiper later so it does not affect LCP,
   * while still keeping window.loadSwiper available for on-demand block usage.
   */
  window.setTimeout(() => {
    window.loadSwiper?.().catch((e) => {
      // eslint-disable-next-line no-console
      console.error('Failed to preload Swiper', e);
    });
  }, 3000);

  /**
   * Preload Bootstrap CSS later so frequently used components
   * can benefit without moving Bootstrap into the eager phase.
   */
  window.setTimeout(() => {
    window.loadBootstrap?.({ withJS: false }).catch((e) => {
      // eslint-disable-next-line no-console
      console.error('Failed to preload Bootstrap', e);
    });
  }, 3000);

  /**
   * Load jQuery only in the delayed phase.
   * This keeps jQuery out of the critical rendering path,
   * but still makes it available for legacy modules such as analytics.
   */
  window.setTimeout(() => {
    window.loadJQuery?.().catch((e) => {
      // eslint-disable-next-line no-console
      console.error('Failed to preload jQuery', e);
    });
  }, 3000);

  /**
   * Lazy load analytics after jQuery is available.
   * This prevents analytics from failing due to missing window.jQuery
   * and avoids eager-loading analytics during initial page render.
   */
  window.setTimeout(async () => {
    try {
      await window.loadJQuery?.();
      const { initAnalytics } = await import('./analytics.js');
      initAnalytics();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to initialize analytics', e);
    }
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

      /* add class to body to be used for restricting vh metric */
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