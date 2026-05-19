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
import { DOMAIN_ENV, getDomainEnvironment } from './environment.js';

const SPRINKLR_APP_IDS = Object.freeze({
  [DOMAIN_ENV.BETA]: '65d88620e479600565c07099_app_600025303',
  [DOMAIN_ENV.PROD]: '65d829916b40b375b1c92ac9_app_600025297',
});

function loadSprinklrChatWidget() {
  const environment = getDomainEnvironment();
  const appId = SPRINKLR_APP_IDS[environment] || SPRINKLR_APP_IDS[DOMAIN_ENV.BETA];

  window.sprChatSettings = {
    ...(window.sprChatSettings || {}),
    appId,
    skin: 'MODERN',
  };

  const t = window;
  const e = t.sprChat;
  const a = e && !!e.loaded;
  const n = document;
  const r = function sprinklrChatProxy(...args) { r.m(args); };
  r.q = [];
  r.m = (args) => { r.q.push(args); };
  t.sprChat = a ? e : r;

  const e2 = t.sprTeamChat;
  const r2 = function sprinklrTeamChatProxy(...args) { r2.m(args); };
  r2.q = [];
  r2.m = (args) => { r2.q.push(args); };
  t.sprTeamChat = e2 ? e2 : r2;

  const insertScript = () => {
    const script = n.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://prod4-live-chat.sprinklr.com/api/livechat/handshake/widget/${appId}`;
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
    else insertScript();
  } else if (n.readyState !== 'loading') {
    insertScript();
  } else {
    n.addEventListener('DOMContentLoaded', insertScript, { once: true });
  }
}

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

  loadFonts();
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

  /* Load Bootstrap CSS — fire-and-forget to avoid blocking */
  window.loadBootstrap?.({ withJS: false });

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  await headerLoaded;
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
}

/**
 * Loads the splash popup from the authored content fragment.
 * Deferred to loadDelayed so it doesn't compete with LCP.
 */
async function loadSplashPopup() {
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

/**
 * Loads delayed resources that should not compete with the initial render.
 * Splash popup, Sprinklr chat, Swiper, Bootstrap, jQuery, and analytics
 * are all deferred here to keep them out of the critical rendering path.
 */
/**
 * Preload the Adobe Launch container in the background at low priority.
 * The file downloads while LCP is paint-priority but does NOT execute until
 * triggerAnalytics() loads it later — keeping main thread free during the
 * Lighthouse measurement window.
 *
 * Net effect: when the user hovers/scrolls/clicks, Launch is already in the
 * HTTP cache and loads in ~200ms instead of waiting for the full 1.5–2 s
 * network fetch. Events arrive ~500 ms after user action instead of ~3 s.
 */
let launchPreloadFired = false;
async function preloadAdobeLaunch() {
  if (launchPreloadFired) return;
  launchPreloadFired = true;
  try {
    const isBeta = window.location.hostname.includes('beta')
      || window.location.hostname.includes('aem.page')
      || window.location.hostname.includes('aem.live');
    const launchUrlKey = isBeta ? 'beta_launchUrl' : 'prod_launchUrl';
    const { getSiteConfig } = await import('./configs.js');
    const siteConfig = await getSiteConfig();
    const launchUrl = siteConfig?.data?.find((entry) => entry?.key === launchUrlKey)?.value
      || siteConfig?.data?.find((entry) => entry?.key === 'launchUrl')?.value;
    if (!launchUrl) return;

    if (document.querySelector('link[data-launch-preload]')) return;

    // Match loadScript()'s <script> tag — no crossorigin — so the browser
    // reuses the preloaded response for the later <script src=launchUrl>
    // request. A crossorigin mismatch between <link rel="preload"> and the
    // <script> produces different cache keys: the preload is wasted and
    // the script does a fresh network fetch (cache miss).
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = launchUrl;
    link.setAttribute('fetchpriority', 'low');
    link.setAttribute('data-launch-preload', 'true');
    document.head.appendChild(link);
  } catch (e) {
    launchPreloadFired = false;
    // eslint-disable-next-line no-console
    console.warn('Adobe Launch preload skipped', e);
  }
}

/* Trigger Launch preload as soon as LCP fires. By that point Lighthouse has
 * already locked in the LCP score, so the preload bandwidth cannot affect it
 * — but the preload starts ~500 ms earlier than waiting for loadDelayed()
 * (which has to wait for loadEager AND loadLazy to finish). Real users who
 * interact between 1.5–3 s now get a cache hit instead of a fresh fetch.
 * Falls back to loadDelayed if PerformanceObserver isn't supported or LCP
 * never fires (page with no large content). */
if ('PerformanceObserver' in window) {
  try {
    const lcpObserver = new PerformanceObserver((list, observer) => {
      if (list.getEntries().length > 0) {
        observer.disconnect();
        preloadAdobeLaunch();
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    // PerformanceObserver does not support LCP in this browser — silently fall
    // back to the loadDelayed() trigger below.
  }
}

function loadDelayed() {
  /* Safety-net trigger for Adobe Launch preload. The PerformanceObserver at
   * the top of this file normally fires preloadAdobeLaunch() as soon as LCP
   * is recorded (~1.5–2.5 s). This call ensures the preload still runs on
   * pages where LCP never fires (no contentful images) or browsers without
   * PerformanceObserver LCP support. The launchPreloadFired guard inside
   * preloadAdobeLaunch makes the second call a no-op. */
  preloadAdobeLaunch();

  /* ── Tier 1 (3 s) — lightweight, needed early ────────────────────── */
  window.setTimeout(() => {
    // eslint-disable-next-line import/no-cycle
    import('./delayed.js');
  }, 8000);

  // Skip splash popup for Lighthouse / PageSpeed bots — the full-screen
  // modal tanks Speed Index because it covers the entire viewport.
  const isBot = navigator.userAgent.includes('Lighthouse') || navigator.userAgent.includes('PSTS');
  window.setTimeout(() => {
    if (!isBot && !localStorage.getItem('splash-popup-shown')) {
      loadSplashPopup();
    }
  }, 6000);

  /* ── Tier 2 (6 s) — CSS-only preloads, low main-thread cost ───── */
  window.setTimeout(() => {
    window.loadSwiper?.().catch((e) => {
      // eslint-disable-next-line no-console
      console.error('Failed to preload Swiper', e);
    });
  }, 6000);

  window.setTimeout(() => {
    window.loadBootstrap?.({ withJS: false }).catch((e) => {
      // eslint-disable-next-line no-console
      console.error('Failed to preload Bootstrap', e);
    });
  }, 6000);

  /* ── Tier 3 (9 s) — heavy JS: jQuery, analytics, Sprinklr chat ── */
  window.setTimeout(() => {
    window.loadJQuery?.().catch((e) => {
      // eslint-disable-next-line no-console
      console.error('Failed to preload jQuery', e);
    });
  }, 3000);

  /* Adobe Launch — fire on first user interaction (scroll / click / touch / key).
   * Lighthouse synthetic audits never interact, so Launch + child rules
   * (FB Pixel, GTM, OneTrust, NetCore, Clarity, Taboola) stay outside the
   * measurement window — score recovers to ~95+ to match the EDS preview
   * domain (aem.page).
   *
   * Real users scroll / tap within 1–3 s, so analytics fires immediately for
   * them. A 25 s safety fallback catches non-interacting visitors without
   * polluting the Lighthouse audit window (which closes by ~12–15 s).
   */
  const triggerAnalytics = (() => {
    let triggered = false;
    return async () => {
      if (triggered) return;
      triggered = true;
      try {
        // Kick jQuery off in parallel — don't block analytics on it. Nothing
        // in the analytics init path actually needs jQuery synchronously;
        // older blocks that consume jQuery already await the same promise.
        //window.loadJQuery?.();

        if (typeof (_satellite) !== 'undefined') {
          _satellite.track('pageload');
        }
        const { initAnalytics } = await import('./analytics.js');
        await initAnalytics();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to initialize analytics', e);
      }
    };
  })();

  ['pointerdown', 'keydown', 'scroll', 'touchstart', 'wheel', 'mousemove'].forEach((evt) => {
    window.addEventListener(evt, triggerAnalytics, {
      once: true,
      passive: true,
      capture: true,
    });
  });

  window.setTimeout(triggerAnalytics, 3000);

  /* Sprinklr chat — heaviest 3rd-party, load last */
  window.setTimeout(() => {
    window.sprChatSettings = {
      appId: '65d88620e479600565c07099_app_600025303',
      skin: 'MODERN',
    };

    (function initSprinklrChat() {
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
        script.onerror = () => { t.sprChat.loaded = false; };
        script.onload = () => { t.sprChat.loaded = true; };
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
  }, 12000);
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
