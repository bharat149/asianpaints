/**
 * Adobe Web SDK (alloy) integration for asianpaints.com EDS pilot
 *
 * Purpose
 * -------
 * Sends analytics events from EDS pages to Adobe Edge Network → datastream →
 * existing report suite (apaintasrpprod prod / asianpaintsbeta staging).
 * Uses idMigrationEnabled so visitor identity (ECID, AAM blob) carries
 * across from AMS pages running AppMeasurement.js — reports remain
 * cumulative, no visitor inflation.
 *
 * How to wire it up
 * -----------------
 *   // scripts/scripts.js, inside loadLazy()
 *   import('./analytics.js').then(({ initAnalytics }) => initAnalytics());
 *
 * Loaded from `lazy.js` (post-LCP), NOT `delayed.js`. The 3-second
 * delayed-phase wait would miss bouncers and skew bounce/visitor metrics
 * vs. AMS pages.
 *
 * Self-host setup
 * ---------------
 *   curl -o scripts/vendor/alloy.min.js \
 *     https://cdn1.adoberesources.net/alloy/2.33.1/alloy.min.js
 *
 * PENDING ITEMS — see MIGRATION_PENDING.md
 * ----------------------------------------
 *   P0 (blocks beta):  Datastream UUIDs, AAM service decision
 *   P1 (blocks prod):  eVar51 logic, login state, meta-tag convention,
 *                      initialPercentViewed calculation
 *   P2 (defer):        Consent/CMP, prop12 intent, AppMeasurement bump
 */

// ============================================================
// CONFIGURATION
// ============================================================

const ORG_ID = '5FFF4CAB563CB2507F000101@AdobeOrg';

// TODO[P0]: replace placeholders after creating datastreams in
// experience.adobe.com → Data Collection → Datastreams.
//   - asianpaints-web-prod    → Analytics service → RSID apaintasrpprod
//   - asianpaints-web-staging → Analytics service → RSID asianpaintsbeta
const DATASTREAM_UUIDS = {
  //'www.asianpaints.com':  'PROD_DATASTREAM_UUID_TO_BE_CREATED',
  'beta.asianpaints.com': 'eab18d73-1507-436b-9655-52c600b63d9e',
};

// Preview hosts (*.aem.page, *.aem.live, localhost) → staging datastream
//const FALLBACK_UUID = 'STAGING_DATASTREAM_UUID_TO_BE_CREATED';

const ALLOY_SRC = '/eds/scripts/vendor/alloy.min.js';

// ============================================================
// HELPERS — page identity
// ============================================================

function getCountry() {
  return (document.querySelector('meta[name="country"]')?.content || 'in').toLowerCase();
}

function getSection() {
  // TODO[P1]: confirm EDS authoring convention. Falls back to first path segment.
  const meta = document.querySelector('meta[name="section"]')?.content;
  if (meta) return meta.toLowerCase();
  const segments = location.pathname.split('/').filter(Boolean);
  return (segments[0] || '').toLowerCase();
}

function getPage() {
  const meta = document.querySelector('meta[name="pagename"]')?.content;
  if (meta) return meta.toLowerCase();
  const segments = location.pathname.split('/').filter(Boolean);
  return (segments[1] || '').toLowerCase();
}

/**
 * Builds pageName matching AMS hierarchy: country::section::page
 *   /            → 'in::'              (homepage — country only, trailing ::)
 *   /inspiration → 'in::inspiration'
 *   /colors/x    → 'in::colors::x'
 */
function getPageName() {
  const parts = [getCountry(), getSection(), getPage()];
  // Trim trailing empties
  while (parts.length > 1 && !parts[parts.length - 1]) parts.pop();
  return parts.join('::') + (parts.length === 1 ? '::' : '');
}

// ============================================================
// HELPERS — visitor state
// ============================================================

function getECID() {
  // Read MCMID from AMCV cookie (handles both URL-encoded and decoded forms)
  const m = document.cookie.match(/MCMID(?:%7C|\|)(\d+)/);
  return m ? m[1] : '';
}

/**
 * 'Repeat' if AMCV cookie existed before alloy ran, else 'New'.
 * Must be evaluated ONCE before alloy touches the cookie.
 */
let cachedVisitorType = null;
function getVisitorType() {
  if (cachedVisitorType !== null) return cachedVisitorType;
  const hadAMCV = /AMCV_[^=]+=/.test(document.cookie);
  cachedVisitorType = hadAMCV ? 'Repeat' : 'New';
  return cachedVisitorType;
}

/**
 * Returns 'logged in' / 'not logged in' for eVar9.
 *
 * Reads Keycloak-persisted state synchronously — does NOT wait for
 * keycloak-js to finish its silent SSO check (that would defeat the
 * lazy-phase beacon timing). Reflects the last known auth state from
 * the previous page load, which is accurate for ~all real navigations.
 *
 * Sources, in priority order:
 *   1. localStorage (`keycloak-token` + `userProfile`) — set by
 *      persistKeycloakTokens() in header.js after successful auth.
 *   2. `keycloak_authToken` cookie — fallback when localStorage is
 *      blocked (incognito / privacy mode).
 */
function getLoginStatus() {
  try {
    const hasToken = !!localStorage.getItem('keycloak-token');
    const hasProfile = !!localStorage.getItem('userProfile');
    if (hasToken && hasProfile) return 'logged in';
  } catch { /* localStorage blocked — fall through to cookie check */ }
  if (/(^|;\s*)keycloak_authToken=[^;]+/.test(document.cookie)) return 'logged in';
  return 'not logged in';
}

// ============================================================
// HELPERS — date formatting (matches AMS exactly)
// ============================================================

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function getDateString() {
  // Format: 'year=2026 | month=May | date=27 | day=Wednesday | time=8:19 PM'
  const d = new Date();
  const h12 = d.getHours() % 12 || 12;
  const ampm = d.getHours() >= 12 ? 'PM' : 'AM';
  const min = String(d.getMinutes()).padStart(2, '0');
  return `year=${d.getFullYear()} | month=${MONTHS[d.getMonth()]} | date=${d.getDate()} | day=${DAYS[d.getDay()]} | time=${h12}:${min} ${ampm}`;
}

// ============================================================
// HELPERS — previous page name (prop12 in AMS)
// ============================================================

const PREV_PAGE_KEY = 'ap_prev_pagename';

function getPreviousPageName() {
  try {
    return sessionStorage.getItem(PREV_PAGE_KEY) || '';
  } catch {
    return '';
  }
}

function setPreviousPageName(name) {
  try {
    sessionStorage.setItem(PREV_PAGE_KEY, name);
  } catch { /* incognito or storage disabled — fail silent */ }
}

// ============================================================
// HELPERS — scroll depth (prop13 in AMS)
// ============================================================

const scrollState = { initial: 0, highest: 0 };

function calcCurrentPercent() {
  const docHeight = document.documentElement.scrollHeight || 1;
  const scrolledBottom = window.scrollY + window.innerHeight;
  return Math.min(100, Math.round((scrolledBottom / docHeight) * 100));
}

function initScrollTracking() {
  // TODO[P1]: confirm AMS calculation for initialPercentViewed.
  // Current: viewport-height / document-height at first measurement.
  scrollState.initial = calcCurrentPercent();
  scrollState.highest = scrollState.initial;

  window.addEventListener('scroll', () => {
    const pct = calcCurrentPercent();
    if (pct > scrollState.highest) scrollState.highest = pct;
  }, { passive: true });
}

function getScrollDepthString() {
  return `highestPercentViewed = ${scrollState.highest} | initialPercentViewed=${scrollState.initial}`;
}

// ============================================================
// HELPERS — page load time (eVar51 in AMS)
// ============================================================

/**
 * Returns time from navigation start to beacon-send moment, in
 * milliseconds. Since analytics fires in loadLazy (post-LCP), this
 * value represents the user-perceived "page is interactive" time —
 * the meaningful page-load metric for an EDS site (no traditional
 * load event milestone like AMS pages had).
 *
 * AMS historically sent banded 0–99 values here via a Launch rule;
 * we send real ms so the reports finally make sense.
 */
function getPageLoadTime() {
  // performance.now() is monotonic and starts at navigation start.
  return Math.round(performance.now());
}

// ============================================================
// PAYLOAD CONSTRUCTION
// ============================================================

function buildAnalyticsPayload() {
  const pageName = getPageName();
  const section = getSection();
  const previousPageName = getPreviousPageName();

  const payload = {
    pageName,
    server: location.hostname,
    currencyCode: 'INR',

    // Confirmed from AMS beacons (Hit 1 & Hit 2 incognito + regular):
    eVar2:  getVisitorType(),                 // 'New' | 'Repeat'
    prop5:  getDateString(),                  // formatted date string
    eVar5:  'D=c5',                           // literal — server-side dynamic copy
    eVar6:  location.href,
    prop6:  'D=v6',                           // literal
    eVar9:  getLoginStatus(),
    eVar12: getECID(),                        // ECID as a reportable dimension
    prop12: previousPageName,                 // PREVIOUS page name (AMS pattern)
    prop13: getScrollDepthString(),
    eVar51: getPageLoadTime(),                // page load time in ms (since navigation start)
    eVar54: pageName,                         // mirrors pageName
    prop54: 'D=v54',                          // literal
  };

  // prop1 = section, only when not homepage (matches AMS)
  if (section) payload.prop1 = section;

  // Update session state AFTER reading previous — for next pageview
  setPreviousPageName(pageName);

  return payload;
}

// ============================================================
// ALLOY BOOTSTRAP
// ============================================================

function bootstrapAlloy() {
  // Standard queue stub — buffers calls until alloy.min.js loads
  !function (n, o) {
    o.forEach(function (o) {
      n[o] || ((n.__alloyNS = n.__alloyNS || []).push(o),
      n[o] = function () {
        var u = arguments;
        return new Promise(function (i, l) { n[o].q.push([i, l, u]); });
      }, n[o].q = []);
    });
  }(window, ['alloy']);

  const script = document.createElement('script');
  script.src = ALLOY_SRC;
  script.async = true;
  // Bump priority so the 151 KB alloy bundle isn't deprioritized behind
  // header/footer/lazy CSS — needed to keep beacon firing within ~1–2 s
  // of LCP instead of 10–15 s.
  script.setAttribute('fetchpriority', 'high');
  document.head.appendChild(script);
}

function getEdgeConfigId() {
  return DATASTREAM_UUIDS[location.hostname] || FALLBACK_UUID;
}

// ============================================================
// PUBLIC API
// ============================================================

export async function initAnalytics() {
  // Lock in visitor type BEFORE alloy modifies the cookie
  getVisitorType();

  bootstrapAlloy();
  initScrollTracking();

  window.alloy('configure', {
    edgeConfigId: getEdgeConfigId(),
    orgId: ORG_ID,
    idMigrationEnabled: true,           // reuse AMCV cookie from AppMeasurement
    thirdPartyCookiesEnabled: false,
    defaultConsent: 'in',               // TODO[P2]: switch to 'pending' if CMP gates
    clickCollectionEnabled: true,
    debugEnabled: location.hostname !== 'www.asianpaints.com',
  });

  window.alloy('sendEvent', {
    data: { __adobe: { analytics: buildAnalyticsPayload() } },
  });
}

/**
 * For SPA-style virtual pageviews if/when EDS pages do client-side routing.
 * Not used by initial pageview path.
 */
export function trackVirtualPageview() {
  window.alloy('sendEvent', {
    data: { __adobe: { analytics: buildAnalyticsPayload() } },
  });
}

// ============================================================
// EVENT TRACKING — legacy-compatible API (was in analytics.js)
// All public helpers below previously routed through Adobe Launch
// (`_satellite.track`). They now route through Alloy. Function
// signatures are unchanged so blocks need only swap the import path.
// ============================================================

/**
 * Returns the digitalData object or creates an empty one if it doesn't
 * exist. Kept as a no-op stub for backwards compatibility — many legacy
 * blocks still read from / mutate `window.digitalData.user.*` etc.
 * Alloy itself does NOT read this object; the page-load payload is built
 * from getLoginStatus / getECID / etc. above.
 *
 * @returns {Object} The digitalData object
 */
export function getDigitalData() {
  window.digitalData = window.digitalData || {};
  return window.digitalData;
}

/**
 * Tracks a custom event by sending an Alloy beacon.
 *
 * Replaces the legacy `_satellite.track(eventName, eventData)` pattern.
 * Builds an equivalent Alloy `sendEvent` payload:
 *   linkName    = eventName       (reports group/filter on this)
 *   linkType    = 'o' (other)     (matches AMS s.tl(true,'o',name))
 *   contextData = stringified data (Processing Rules in the datastream
 *                                   config map keys → eVars/props)
 *
 * Fails silently if Alloy hasn't been bootstrapped yet (a click in the
 * first ~few hundred ms before loadLazy fires `initAnalytics`).
 *
 * @param {string} eventName
 * @param {Object} [eventData]
 */
export function trackEvent(eventName, eventData = {}) {
  const name = typeof eventName === 'string' ? eventName.trim() : '';
  if (!name) return;
  if (typeof window.alloy !== 'function') return;

  // Mutate legacy digitalData.event for any block still reading it.
  getDigitalData().event = name;

  const analytics = {
    linkName: name,
    linkType: 'o',
  };

  const entries = Object.entries(eventData).filter(
    ([, v]) => v !== undefined && v !== null && v !== '',
  );
  if (entries.length) {
    analytics.contextData = {};
    entries.forEach(([k, v]) => {
      analytics.contextData[k] = String(v);
    });
  }

  try {
    window.alloy('sendEvent', { data: { __adobe: { analytics } } });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[analytics] trackEvent failed', err);
  }
}

/**
 * Tracks CTA link text interaction.
 * @param {string} btnTitle The CTA label
 * @param {string} ctaLink The CTA URL
 */
export function triggerCtaLinkText(btnTitle, ctaLink) {
  trackEvent('cta_link_text', {
    cta_: btnTitle,
    param1: ctaLink,
  });
}

/**
 * Tracks no result event for search journeys.
 * @param {string} searchTerm The search term (use 'Image' for image search)
 */
export function trackNoResultFound(searchTerm) {
  trackEvent('no_result', {
    search_term: searchTerm,
  });
}

/**
 * Tracks image search dialog open/start.
 */
export function trackImageSearchStart() {
  trackEvent('ub_imagesearch_start');
}

/**
 * Tracks image search dialog close.
 */
export function trackImageSearchClose() {
  trackEvent('ub_imagesearch_close');
}

/**
 * Tracks image search completion with total result count.
 * @param {number} totalResults Total results returned by image search
 */
export function trackImageSearchComplete(totalResults) {
  trackEvent('ub_imagesearch_complete', {
    totalResults,
  });
}

// ============================================================
// LEGACY digitalData context — preserved for blocks that still read it
// ============================================================

function toUrl(urlLike) {
  try {
    return new URL(urlLike, window.location.origin);
  } catch (e) {
    return new URL(window.location.href);
  }
}

function buildPageData(urlObj) {
  const parts = urlObj.pathname.split('/').filter(Boolean);
  return {
    destinationURL: urlObj.href,
    pageName: `in::${parts.join(':')}`,
    section1: parts[0] || '',
    section2: parts[1] || '',
    section3: parts[2] || '',
    section4: parts[3] || '',
  };
}

function getParam(urlObj, key) {
  return urlObj.searchParams.get(key) || '';
}

// Read MCMID directly from the AMCV cookie (was: _satellite.getVisitorId()…
// which is no longer available after the Launch removal).
function getMcidFromCookie() {
  const m = document.cookie.match(/MCMID(?:%7C|\|)(\d+)/);
  return m ? m[1] : '';
}

function setDigitalDataContext(destinationUrl = window.location.href) {
  const currentUrl = toUrl(window.location.href);
  const targetUrl = toUrl(destinationUrl);
  const digitalData = getDigitalData();

  const source = getParam(currentUrl, 'utm_source') || getParam(currentUrl, 'source')
    || getParam(targetUrl, 'utm_source') || getParam(targetUrl, 'source');
  const medium = getParam(currentUrl, 'utm_medium') || getParam(currentUrl, 'medium')
    || getParam(targetUrl, 'utm_medium') || getParam(targetUrl, 'medium');
  const campaign = getParam(currentUrl, 'utm_campaign') || getParam(currentUrl, 'campaign')
    || getParam(targetUrl, 'utm_campaign') || getParam(targetUrl, 'campaign');
  const cid = getParam(currentUrl, 'cid') || getParam(targetUrl, 'cid') || 'null';

  digitalData.page = buildPageData(targetUrl);
  digitalData.utmValues = { source, medium, campaign, cid };
  digitalData.product = {
    productName: '',
    productCode: '',
    productPrice: '',
    productQuantity: 1,
    relatedProduct: '',
  };
  digitalData.skuCodeList = { skuCodes: '' };
  digitalData.device = { deviceType: navigator.userAgent };
  digitalData.user = {
    loginStatus: digitalData.user?.loginStatus || getLoginStatus(),
    mcid: digitalData.user?.mcid || getMcidFromCookie(),
    ipAddress: digitalData.user?.ipAddress || '',
    emailId: digitalData.user?.emailId || '',
    mobileNumber: digitalData.user?.mobileNumber || '',
    loginFunction: digitalData.user?.loginFunction || '',
  };
  digitalData.event = digitalData.event || '';
}

/**
 * Tracks CTA click interaction based on link type.
 * @param {string} ctaLink The CTA URL
 * @param {string} btnTitle The CTA label
 * @param {string} parentTitle The parent card/section title
 */
export function triggerCTAClickWithLinkAndTitle(ctaLink, btnTitle, parentTitle) {
  if (!ctaLink) return;
  setDigitalDataContext(ctaLink);

  if (ctaLink.indexOf('javascript:void') > -1) {
    trackEvent('custom_cta_click', { cta_: btnTitle });
  } else if (ctaLink.indexOf('tel:') > -1) {
    trackEvent('SPSContactClick');
  } else {
    trackEvent('custom_cta_click', {
      cta_: btnTitle,
      redirectionLink: ctaLink,
      parentTitle,
      param1: ctaLink,
    });
  }
}

function getTrackingLinkValue(link) {
  const href = link.getAttribute('href') || '';
  const redirectionLink = link.getAttribute('data-redirection-link') || '';
  if (href.indexOf('javascript:void') > -1 && redirectionLink) {
    return redirectionLink;
  }
  return href || redirectionLink;
}

function getButtonContainerParentTitle(link) {
  const section = link.closest('.section');
  const block = link.closest('.block');
  const scopedContainer = block || section || link.closest('main') || document;

  const titleInBlock = block?.querySelector('h1, h2, h3, h4, h5, h6');
  if (titleInBlock?.textContent?.trim()) return titleInBlock.textContent.trim();

  const sectionHeading = section?.querySelector(':scope > .section-metadata + div h1, :scope > .section-metadata + div h2, :scope > .section-metadata + div h3, :scope > .section-metadata + div h4, :scope > .section-metadata + div h5, :scope > .section-metadata + div h6, h1, h2, h3, h4, h5, h6');
  if (sectionHeading?.textContent?.trim()) return sectionHeading.textContent.trim();

  const nearestText = scopedContainer.querySelector('h1, h2, h3, h4, h5, h6, p');
  return nearestText?.textContent?.trim() || '';
}

export function trackPdfDownload(target) {
  const pdfName = (target?.textContent || '').trim();
  trackEvent('download_form_pdf', { pdfName });
}

export function bindReadTermsPdfTracking(element) {
  element.querySelectorAll('.button-container a.button').forEach((cta) => {
    if (cta.dataset.readTermsPdfAnalyticsBound === 'true') return;

    const ctaLink = (cta.getAttribute('href') || '').toLowerCase();
    const btnTitle = (cta.textContent || '').trim().toLowerCase();
    if (btnTitle !== 'read t&c' || ctaLink.indexOf('.pdf') === -1) return;

    cta.dataset.readTermsPdfAnalyticsBound = 'true';
    cta.dataset.analyticsBound = 'true';
    cta.addEventListener('click', () => {
      trackPdfDownload(cta);
    });
  });
}

export function bindButtonContainerTracking(element) {
  element.querySelectorAll('.button-container a.button').forEach((cta) => {
    if (cta.closest('.explore-split')) return;
    if (cta.dataset.analyticsBound === 'true') return;

    cta.dataset.analyticsBound = 'true';
    cta.addEventListener('click', () => {
      const ctaLink = cta.getAttribute('href') || '';
      const btnTitle = cta.textContent.trim();
      const parentTitle = getButtonContainerParentTitle(cta);
      triggerCTAClickWithLinkAndTitle(ctaLink, btnTitle, parentTitle);
    });
  });
}

export function bindTrackCTALinkTextTracking(element) {
  if (!element || element.dataset.trackCtaLinkTextBound === 'true') return;

  element.dataset.trackCtaLinkTextBound = 'true';
  element.addEventListener('click', (event) => {
    const cta = event.target.closest('a.trackCTA');
    if (!cta || !element.contains(cta)) return;

    const btnTitle = cta.textContent.trim();
    const ctaLink = getTrackingLinkValue(cta);
    triggerCtaLinkText(btnTitle, ctaLink);
  });
}

export function royalePlayAnimatedImageTracking(element) {
  if (!element || element.dataset.royalePlayAnimatedTrackingBound === 'true') return;

  element.dataset.royalePlayAnimatedTrackingBound = 'true';
  element.addEventListener('click', (event) => {
    const cta = event.target.closest('.default-content-wrapper a[href]');
    if (!cta || !element.contains(cta)) return;

    const href = cta.getAttribute('href') || '';
    if (href.indexOf('interior-textures.html') === -1 || href.toLowerCase().indexOf('play') === -1) return;

    const btnTitle = cta.querySelector('img')?.alt?.trim() || 'Royale Play Playlist';
    triggerCTAClickWithLinkAndTitle(href, btnTitle, 'default-content-wrapper');
  });
}
