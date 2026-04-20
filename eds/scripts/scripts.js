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
import {
  bindButtonContainerTracking,
  bindReadTermsPdfTracking,
  royalePlayAnimatedImageTracking,
} from './analytics.js';

(function loadCryptoJSGlobally() {
  if (window.CryptoJS) return;

  const script = document.createElement('script');
  script.src = '/eds/scripts/crypto.js';
  script.async = true;
  document.head.appendChild(script);
}());

/**
 * Global jQuery loader
 * - loads jQuery only once
 * - returns a promise so dependent code can await it
 * - useful for legacy modules such as analytics or older blocks
 */
window.loadJQuery = function loadJQuery() {
  if (window.jqueryLoadPromise) return window.jqueryLoadPromise;

  window.jqueryLoadPromise = new Promise((resolve, reject) => {
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

  return window.jqueryLoadPromise;
};

/**
 * Global Bootstrap loader
 * - loads Bootstrap CSS once
 * - optionally loads Bootstrap JS bundle once
 */
window.loadBootstrap = function loadBootstrap({ withJS = false } = {}) {
  if (!window.bootstrapCssLoadPromise) {
    window.bootstrapCssLoadPromise = new Promise((resolve, reject) => {
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

  if (!withJS) return window.bootstrapCssLoadPromise;

  if (!window.bootstrapJsLoadPromise) {
    window.bootstrapJsLoadPromise = new Promise((resolve, reject) => {
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

  return Promise.all([window.bootstrapCssLoadPromise, window.bootstrapJsLoadPromise]);
};

/**
 * Global Swiper loader
 * - can be called by any block when needed
 * - keeps a single promise to avoid duplicate requests
 */
window.loadSwiper = function loadSwiper() {
  if (window.swiperLoadPromise) return window.swiperLoadPromise;

  window.swiperLoadPromise = new Promise((resolve, reject) => {
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

  return window.swiperLoadPromise;
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
  bindReadTermsPdfTracking(main);
  bindButtonContainerTracking(main);
  royalePlayAnimatedImageTracking(main);
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

  const headerLoaded = loadHeader(doc.querySelector('header'));
  await loadSections(main);

  /* Load Bootstrap CSS globally once the page is usable */
  await window.loadBootstrap?.({ withJS: false });

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  await headerLoaded;
  loadFooter(doc.querySelector('footer'));

  // Floating popup button
  // const { default: loadFixedColorPartner } = await import('./fixed-color-partner-loader.js');
  // loadFixedColorPartner(doc);

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);

  // Load splash popup from authored content fragment
  if (!localStorage.getItem('splash-popup-shown')) {
    try {
      const splashPath = '/eds/fragments/splash-popup';
      const resp = await fetch(`${splashPath}.plain.html`);
      if (resp.ok) {
        const temp = document.createElement('div');
        temp.innerHTML = await resp.text();
        const baseUrl = new URL(splashPath, window.location);
        temp.querySelectorAll('img[src^="./media_"]').forEach((img) => {
          img.src = new URL(img.getAttribute('src'), baseUrl).href;
        });
        temp.querySelectorAll('source[srcset^="./media_"]').forEach((s) => {
          s.srcset = new URL(s.getAttribute('srcset'), baseUrl).href;
        });
        const contentDiv = temp.querySelector('div');
        const firstCta = contentDiv?.querySelector(':scope > p > a');
        if (firstCta) {
          const children = [...contentDiv.children];
          const splitAt = children.indexOf(firstCta.closest('p')) + 1;
          const leftCell = document.createElement('div');
          const rightCell = document.createElement('div');
          children.slice(0, splitAt).forEach((el) => leftCell.append(el));
          children.slice(splitAt).forEach((el) => rightCell.append(el));
          const row = document.createElement('div');
          row.append(leftCell, rightCell);
          const splashBlock = document.createElement('div');
          splashBlock.className = 'splash-popup';
          splashBlock.append(row);
          const { default: decorateSplashPopup } = await import('../blocks/splash-popup/splash-popup.js');
          await decorateSplashPopup(splashBlock);
        }
      }
    } catch (e) {
      // Splash popup content not available, skip silently
    }
  }

  window.sprChatSettings = window.sprChatSettings || {};
  window.sprChatSettings = {
    appId: '65d88620e479600565c07099_app_600025303',
    skin: 'MODERN',
  };

  (function loadSprinklrChat() {
    const t = window;
    const e = t.sprChat;
    const a = e && !!e.loaded;
    const n = document;
    const r = function sprinklrChatProxy() { r.m(arguments); };
    r.q = [];
    r.m = (args) => { r.q.push(args); };
    t.sprChat = a ? e : r;

    const e2 = t.sprTeamChat;
    const r2 = function sprinklrTeamChatProxy() { r2.m(arguments); };
    r2.q = [];
    r2.m = (args) => { r2.q.push(args); };
    t.sprTeamChat = e2 ? e2 : r2;

    const o = function insertSprinklrScript() {
      const script = n.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = `https://prod4-live-chat.sprinklr.com/api/livechat/handshake/widget/${t.sprChatSettings.appId}`;
      script.onerror = () => {
        t.sprChat.loaded = false;
      };
      script.onload = () => {
        t.sprChat.loaded = true;
      };
      const firstScript = n.getElementsByTagName('script')[0];
      firstScript.parentNode.insertBefore(script, firstScript);
    };

    if (typeof e === 'function') {
      if (a) e('update', t.sprChatSettings);
      else o();
    } else if (n.readyState !== 'loading') {
      o();
    } else {
      n.addEventListener('DOMContentLoaded', o);
    }
  }());
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
    // eslint-disable-next-line import/no-cycle
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
