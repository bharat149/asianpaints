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

/**
 * For custom link / event tracking. Example:
 *   trackEvent({ linkName: 'buy-now', linkType: 'o', events: 'event10' });
 */
export function trackEvent(extraAnalytics = {}) {
  window.alloy('sendEvent', {
    data: {
      __adobe: {
        analytics: { ...buildAnalyticsPayload(), ...extraAnalytics },
      },
    },
  });
}
