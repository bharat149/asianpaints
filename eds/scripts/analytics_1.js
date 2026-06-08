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
 * Returns time from navigation start to beacon-send moment, in seconds.
 *
 * AMS beacons (confirmed via Adobe Debugger captures) send eVar51 as a
 * small integer like 7, 10, 14, 17 — i.e. SECONDS of page-load time.
 * Sending seconds (not ms) preserves the existing report distribution
 * so dashboards keyed on this dimension keep working unchanged.
 *
 * Previously we sent Math.round(performance.now()) (ms) — flipped to
 * seconds after observing the AMS shape on www.asianpaints.com.
 */
function getPageLoadTime() {
  // performance.now() is monotonic and starts at navigation start (ms).
  return Math.round(performance.now() / 1000);
}

// ============================================================
// PAYLOAD CONSTRUCTION
// ============================================================

/**
 * Build Adobe Target mbox parameters for the interact (sendEvent) call.
 * These are evaluated SERVER-SIDE on Edge during decisioning, so they
 * must be on the sendEvent payload — applyPropositions is too late
 * (decisions are already made).
 *
 * Inventory from the legacy AMS Launch container
 * (launch-ENf4c71a0706064fe7b2ffe21cbff613f3.min.js, addGlobalMboxParams
 * extension settings):
 *
 *   ENABLED on legacy (checked: true):
 *     - user.categoryId        <- %categoryID%
 *     - user.colorCategoryId   <- %ColorCategoryID%
 *
 *   DISABLED on legacy (checked: false) but plumbed below for parity
 *   so re-enabling is a meta-tag change, not a code change:
 *     - mbox3rdPartyId         <- %CA_user_email%
 *     - profile.BHSdropoff     <- %tgt_bhs_audience%
 *     - profile.HCGdropoff     <- %tgt_hcg_audience%
 *     - profile.PBCdropoff     <- %tgt_pbc_audience%
 *     - profile.WBCdropoff     <- %tgt_wbc_audience%
 *     - profile.cwapWFdropoff  <- %tgt_cwap_wf%
 *     - profile.cwapHCGdropoff <- %tgt_cwap_hcg%
 *     - profile.cwapPBCdropoff <- %tgt_cwap_pbc%
 *     - profile.cwapWBCdropoff <- %tgt_cwap_wbc%
 *     - profile.TDchannelpref  <- %tgt_td_channelpref%
 *
 * Matches the legacy at.js behaviour from the captured mbox payload —
 * every configured key is sent on every Target call, with the value
 * coming from a <meta name="target-..."> tag on the page when present,
 * falling back to an empty string otherwise. Authors only need to add
 * a meta tag for the values that should drive audience qualification
 * on that specific page.
 *
 * Special case for user.categoryId: if the meta tag is absent, the
 * value is derived from the URL by deriveCategoryIdFromUrl(), which
 * ports the legacy Launch %categoryID% data element verbatim. This
 * restores category-affinity tracking (profile.categoryAffinities)
 * for paint-products and colour-catalogue pages without each one
 * needing an explicit meta tag.
 *
 * Pattern preference for profile.* attributes:
 *   - PAGE-LEVEL constant (meta tag) — useful when the value is a
 *     property of the page itself (e.g., page category, color bucket).
 *   - EVENT-DRIVEN updates — prefer setTargetProfile() for behavioral
 *     attributes like "user dropped off the BHS form". Meta tags fire
 *     on every page load with the same value; setTargetProfile() fires
 *     once at the actual event moment with the relevant value.
 *
 * Note on response-meta-only attributes (profile.IDS_PS,
 * profile.visitedSPS, profile.DEPT_KitchenURL, etc.): these appear in
 * Target response meta but are NOT set by client code on legacy — they
 * are written by SERVER-SIDE Profile Scripts defined in Target admin
 * (Audiences → Profile Scripts). They continue to work on EDS via ECID
 * migration as long as the Profile Scripts' URL trigger conditions
 * match EDS paths. Sending these from the client would race with the
 * Profile Scripts' writes — leave them out.
 */
const TARGET_MBOX_PARAM_META = Object.freeze({
  // Enabled on legacy — actively used by audiences
  'user.categoryId':         'target-category-id',
  'user.colorCategoryId':    'target-color-category-id',
  // Disabled on legacy, sent with empty default for parity
  'mbox3rdPartyId':          'target-3rdparty-id',
  'profile.BHSdropoff':      'target-profile-bhsdropoff',
  'profile.HCGdropoff':      'target-profile-hcgdropoff',
  'profile.PBCdropoff':      'target-profile-pbcdropoff',
  'profile.WBCdropoff':      'target-profile-wbcdropoff',
  'profile.cwapWFdropoff':   'target-profile-cwapwfdropoff',
  'profile.cwapHCGdropoff':  'target-profile-cwaphcgdropoff',
  'profile.cwapPBCdropoff':  'target-profile-cwappbcdropoff',
  'profile.cwapWBCdropoff':  'target-profile-cwapwbcdropoff',
  'profile.TDchannelpref':   'target-profile-tdchannelpref',
});

/**
 * URL → category-id mapping, byte-equivalent to the legacy AMS Launch
 * data element %categoryID% (from launch-ENf4c71a0706064fe7b2ffe21cbff613f3.min.js).
 * Uses String.includes() rather than strict path matching to match
 * legacy semantics exactly — any URL containing the substring matches.
 *
 * Side effect: maintains a `target-cat-<value>` class on document.body
 * (removes any prior `target-cat-*` first). Legacy Target activities
 * and CSS may select on this class — preserving the behaviour avoids
 * silent breakage on category pages.
 */
function deriveCategoryIdFromUrl() {
  const href = window.location.href;
  let id = '';
  if (href.includes('interior-wall-paints'))                                            id = 'interior-walls';
  else if (href.includes('interior-textures') || href.includes('royale-play'))          id = 'interior-textures';
  else if (href.includes('exterior-wall-paints'))                                       id = 'exterior-walls';
  else if (href.includes('exterior-textures'))                                          id = 'exterior-textures';
  else if (href.includes('wall-coverings'))                                             id = 'wall-coverings';
  else if (href.includes('waterproofing-products') || href.includes('waterproofing-solutions')) id = 'waterproofing-solutions';
  else if (href.includes('wood-for-interior') || href.includes('wood-finish') || href.includes('wood-for-exterior')) id = 'woods';
  else if (href.includes('enamel-paints'))                                              id = 'metal-enamels';
  else if (href.includes('colour-catalogue/red-wall-colours'))                          id = 'red';
  else if (href.includes('colour-catalogue/grey-wall-colours'))                         id = 'grey';
  else if (href.includes('colour-catalogue/blue-wall-colours'))                         id = 'blue';
  else if (href.includes('colour-catalogue/brown-wall-colours'))                        id = 'brown';
  else if (href.includes('colour-catalogue/orange-wall-colours'))                       id = 'orange';
  else if (href.includes('colour-catalogue/yellow-wall-colours'))                       id = 'yellow';
  else if (href.includes('colour-catalogue/green-wall-colours'))                        id = 'green';
  else if (href.includes('colour-catalogue/purple-wall-colours'))                       id = 'purple';
  else if (href.includes('colour-catalogue/pink-wall-colours'))                         id = 'pink';
  else if (href.includes('colour-catalogue/white-wall-colours'))                        id = 'white';
  else if (href.includes('colour-catalogue/off-white-wall-colours'))                    id = 'off-white';

  // Mirror legacy's body-class hook for any Target activity / CSS that
  // selects on `body.target-cat-<value>`.
  document.body.classList.forEach((c) => {
    if (c.startsWith('target-cat-')) document.body.classList.remove(c);
  });
  if (id) document.body.classList.add(`target-cat-${id}`);

  return id;
}

function buildTargetMboxParams() {
  const params = {};
  Object.entries(TARGET_MBOX_PARAM_META).forEach(([paramKey, metaName]) => {
    const v = document.querySelector(`meta[name="${metaName}"]`)?.content?.trim();
    params[paramKey] = v || '';
  });
  // user.categoryId: meta tag overrides URL-derived value. Falling back
  // to URL derivation restores legacy's auto-detection behaviour so
  // visitors browsing paint-products + colour-catalogue pages accumulate
  // category affinity (profile.categoryAffinities) without each page
  // needing an explicit meta tag.
  if (!params['user.categoryId']) {
    params['user.categoryId'] = deriveCategoryIdFromUrl();
  }
  return params;
}

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
    datastreamId: getEdgeConfigId(),
    orgId: ORG_ID,
    idMigrationEnabled: true,           // reuse AMCV cookie from AppMeasurement
    targetMigrationEnabled: true,
    thirdPartyCookiesEnabled: false,
    defaultConsent: 'in',               // TODO[P2]: switch to 'pending' if CMP gates
    clickCollectionEnabled: true,
    // Adobe Target / Web SDK personalization. Required so Alloy
    // requests decisions on sendEvent and can render VEC visual edits
    // automatically (via renderDecisions: true below).
    personalizationStorageEnabled: true,
    debugEnabled: location.hostname !== 'www.asianpaints.com',
  });

  try {
    // Two-phase Target apply (renderDecisions: false + applyPropositions):
    //
    // Why not renderDecisions: true? The legacy AMS Target customCode
    // (every existing activity inherited from Adobe Launch) uses
    // jQuery patterns: $(document).ready, $(selector), $.append, etc.
    // jQuery is loaded on-demand in EDS — not present when Alloy
    // first executes propositions in lazy phase. With auto-render,
    // the customCode throws "ReferenceError: $ is not defined" and
    // the Target experience silently fails.
    //
    // Instead: receive propositions, conditionally preload jQuery if
    // any customCode actually uses it (regex on the content string),
    // then hand the propositions back to Alloy via applyPropositions.
    // The Display notification (for impression reporting + A4T) still
    // fires correctly — applyPropositions emits it just like
    // renderDecisions: true would.
    //
    // Pages without Target activity: empty propositions array, no
    // jQuery preload triggered, behaviour identical to today.
    const response = await window.alloy('sendEvent', {
      renderDecisions: false,
      data: {
        __adobe: {
          analytics: buildAnalyticsPayload(),
          target: buildTargetMboxParams(),
        },
      },
    });

    const propositions = response?.propositions || [];
    if (propositions.length) {
      const customCodeNeedsJQuery = propositions.some((p) => p.items?.some(
        (i) => i?.data?.type === 'customCode'
          && /\$\(|jQuery/.test(i.data.content || ''),
      ));
      if (customCodeNeedsJQuery && typeof window.loadJQuery === 'function') {
        await window.loadJQuery().catch(() => { /* fall through, customCode may still fail but rest applies */ });
      }
      await window.alloy('applyPropositions', { propositions });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[analytics] alloy sendEvent failed', err);
  }
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
 * Write Target profile attributes (sticky, server-side, persist across
 * sessions on the ECID's Target profile).
 *
 * Call from form-funnel handlers — NOT on every pageview. Each key
 * shows up in Target audiences as ${profile.<key>}.
 *
 *   import { setTargetProfile } from '/eds/scripts/analytics_1.js';
 *   onBHSFormAbandon(() => setTargetProfile({ BHSdropoff: 1 }));
 *   onBHSFormSubmit(()  => setTargetProfile({ BHSdropoff: 0 }));
 *
 * Fires its own lightweight sendEvent. No decisions are requested
 * (this isn't a pageview), so Edge just writes the attributes and
 * the next pageview's interact call qualifies any audiences that
 * read them.
 */
export function setTargetProfile(attrs) {
  if (!attrs || typeof attrs !== 'object') return;
  const entries = Object.entries(attrs).filter(([, v]) => v !== undefined && v !== null && v !== '');
  if (!entries.length) return;
  const profileParams = Object.fromEntries(entries.map(([k, v]) => [`profile.${k}`, v]));
  window.alloy('sendEvent', {
    data: { __adobe: { target: profileParams } },
  });
}

// ============================================================
// EVENT TRACKING — legacy-compatible API (was in analytics.js)
// All public helpers below previously routed through Adobe Launch
// (`_satellite.track`). They now route through Alloy. Function
// signatures are unchanged so blocks need only swap the import path.
// ============================================================

/**
 * EVENT_REGISTRY — maps EDS-side event names to:
 *   - `events`: the AMS success-event ID (e.g. 'event8')
 *   - `eVars`:  per-field eventData → eVarN map
 *
 * Built from real AMS beacons captured via Adobe Experience Platform
 * Debugger on www.asianpaints.com (3 sessions, May 29 2026). Without
 * Adobe Launch in between, the code populates the AMS payload directly
 * — no server-side Processing Rules needed.
 *
 * Entries with `events: undefined` arrive at the report suite as
 * link-tracking hits with contextData populated, but don't increment
 * a specific success-event counter (gracefully degraded for
 * unconfirmed mappings).
 */
const EVENT_REGISTRY = {
  // Forms
  'Form start': {
    events: 'event8',
    eVars: { campaignId: 'eVar15', formName: 'eVar17' },
  },
  'Form Submit': {
    events: 'event9',
    eVars: { campaignId: 'eVar15', formName: 'eVar17' },
  },

  // Search
  'Header Search Icon Click': { events: 'event330' },
  'Search Start': { events: 'event54' },
  'Search Bar Close': { events: 'event336' },
  ub_imagesearch_start: { events: 'event312' },
  ub_imagesearch_close: { events: 'event313' },
  ub_imagesearch_complete: { events: 'event314', eVars: { totalResults: 'eVar28' } },

  // Auth
  'Login Icon Click': { events: 'event7' },

  // Cart
  mini_cart_click: { events: 'event67' },

  // CTAs / navigation
  custom_cta_click: {
    events: 'event132',
    eVars: {
      cta_: 'eVar45',
      parentTitle: 'eVar67',
      redirectionLink: 'eVar86',
      param1: 'eVar46',
    },
  },
  'Header icons': {
    events: 'event335',
    eVars: { title: 'eVar67', param1: 'eVar86' },
  },
  sitesection_click: {
    events: 'event46',
    eVars: { siteSection: 'eVar22', redirectionLink: 'eVar86' },
  },
  subsection_one_click: {
    events: 'event113',
    eVars: { siteSection: 'eVar22', subSection: 'eVar65' },
  },
  subsection_two_click: {
    events: 'event114',
    eVars: {
      siteSection: 'eVar22',
      subSection: 'eVar65',
      subSectionTwo: 'eVar66',
      redirectionLink: 'eVar86',
    },
  },

  // Contractors / store
  'Contractor Search Click': {
    events: 'event220',
    eVars: { cityPincode: 'eVar32' },
  },
  store_locator: {
    events: 'event17',
    eVars: { cityPincode: 'eVar32', cta_: 'eVar45' },
  },

  // Testimonial / video / downloads
  'Testimonial - Click to expand (Open)': {
    events: 'event298',
    eVars: { ctaText: 'eVar45' },
  },
  short_video_play: { events: 'event296', eVars: { viewsCount: 'eVar35' } },
  download_form_pdf: { events: 'event137', eVars: { pdfName: 'eVar96' } },

  // Exit-intent modal
  'Exit Intent Pop-up Impression': { events: 'event359' },
  'Exit Intent Popup Close': { events: 'event277' },

  // ============================================================
  // BEST-GUESS MAPPINGS (not yet confirmed via debugger capture).
  // Derived from:
  //   - The May 2026 AMS report (test.csv) — confirms event ID and
  //     dimension shape for events listed in that report.
  //   - The `asianpaintsbeta` report-suite event definitions — used to
  //     pick the semantically closest eventN for each linkName.
  // Reviewers: please verify each entry with a debugger capture on
  // www.asianpaints.com before relying on these IDs for reporting.
  // ============================================================

  // Splash popup
  splash_view: { events: 'event6' }, // best-guess (matches test.csv "Splash Impressions [e6]")

  // Header domain switch
  domain_swicth: {
    events: 'event331', // best-guess (matches test.csv "Domain Switch Tab Click [e331]")
    eVars: { destinationUrl: 'eVar86' },
  },

  // Sticky form CTA
  sticky_cta_click: {
    events: 'event278', // best-guess (matches test.csv "Sticky Form CTA Clicks [e278]")
    eVars: { cta_: 'eVar45', param1: 'eVar46' },
  },

  // Carousel banner
  carousel_banner_click: {
    events: 'event96', // best-guess (matches test.csv "Carousel Banner Click [e96]")
    eVars: { bannerTitle: 'eVar81', bannerDestinationUrl: 'eVar86' },
  },

  // Inspiration category filter
  waterproofing_categories: {
    events: 'event324', // best-guess (matches test.csv "Waterproofing Categories [e324]")
    eVars: { title: 'eVar67' },
  },

  // Generic CTA-link tracking
  cta_link_text: {
    events: 'event143', // best-guess (Custom Link Click [e143])
    eVars: { cta_: 'eVar45', param1: 'eVar46' },
  },
  custom_link_text: {
    events: 'event143', // best-guess (same as cta_link_text)
    eVars: { cta_: 'eVar45' },
  },

  // Form thank-you popup (AMS has 4 per-form variants: e38–41 by form).
  // Fires for ALL forms today — defaulting to event38 (All Services TYP)
  // until each form block passes a formType field that we can switch on.
  Form_thank_you_pop_up: {
    events: 'event38', // best-guess — refine to formType-conditional later
    eVars: { formName: 'eVar17' },
  },

  // PDF / download
  download_multiple_pdf: {
    events: 'event134', // best-guess (Download Click [e134])
    eVars: { pdfName: 'eVar96' },
  },

  // Search no-result
  no_result: {
    events: 'event87', // best-guess (Null Searches [e87])
    eVars: { search_term: 'eVar11' },
  },

  // Video
  video_playbotton_click: {
    events: 'event20', // best-guess (Video Played [e20])
    eVars: { videoTitle: 'eVar35' },
  },
  youtube_play: {
    events: 'event20', // best-guess (same as video_playbotton_click)
    eVars: { url: 'eVar35' },
  },
  short_video_shop: { events: 'event132' }, // best-guess (Custom CTA Click)

  // Product / gallery interactions
  product_tile_click: { events: 'event122',
    eVars: { productName: 'eVar8', param1: 'eVar86', Title: 'eVar67' },
  }, 
  
  // best-guess (Product click on plp page)
  filter_click: { events: 'event121' }, // best-guess (Product Filter Click)
  natural_wood_shade_click: { events: 'event158' }, // best-guess (Natural wood shade click)
  squarecross_click: { events: 'event144' }, // best-guess (Square cross Image click)

  // Calculator
  calc_start: {
    events: 'event42', // best-guess (Rolls Calculator Start — confirm if used for non-rolls)
    eVars: { flowType: 'eVar36' },
  },
  calc_continue: {
    events: 'event43', // best-guess (Rolls Calculator Submit)
    eVars: { flowType: 'eVar36', filter: 'eVar34' },
  },

  // Footer
  footer_phone_number_click: { events: 'event105' }, // best-guess (Footer contact us)
  footer_tab: {
    events: 'event107', // best-guess (Footer tab click)
    eVars: { cta_: 'eVar45' },
  },
  footer_country: {
    events: 'event109', // best-guess (Country selection)
    eVars: { cta_: 'eVar45' },
  },
  footer_socialicons: {
    events: 'event108', // best-guess (Social media icon Click)
    eVars: { cta_: 'eVar45' },
  },

  // Contact CTAs
  SPSContactClick: { events: 'event105' }, // best-guess (Footer contact us — tel: links)
  contact_us_click_whatsapp: { events: 'event105' }, // best-guess (same)

  // ============================================================
  // AMS-fired linkNames our EDS code doesn't yet fire (or fires
  // partially). Adding registry entries so that, once the
  // corresponding trackEvent calls are added in block code (or as
  // EDS authors blocks that need them), the AMS event ID flows
  // automatically.
  //
  // Event IDs mapped from the asianpaintsbeta report-suite config
  // by semantic name match. All are best-guess — verify via
  // Adobe Experience Platform Debugger.
  // ============================================================

  // Footer
  footer_email_click: { events: 'event103' }, // best-guess (Footer email Subscribe)
  footer_links: {
    events: 'event143', // best-guess (Custom Link Click — generic footer-link tracking)
    eVars: { cta_: 'eVar45', parentTitle: 'eVar67', redirectionLink: 'eVar86' },
  },

  // App downloads (footer / banner)
  appstore_click: {
    events: 'event58', // best-guess (App Download Click [e58])
    eVars: { location_Id: 'eVar70' }, // eVar70 = App downloads
  },
  googleplay_click: {
    events: 'event58', // best-guess (same as appstore_click)
    eVars: { location_Id: 'eVar70' },
  },

  // Store locator
  'find a store': {
    events: 'event164', // best-guess (Store locator click [e164])
    eVars: { cta_: 'eVar45', pinCode: 'eVar32' },
  },
  share_store_location: {
    events: 'event157', // best-guess (Store Locator share click [e157])
    eVars: { shareMode: 'eVar45', storeName: 'eVar97', pinCode: 'eVar32' },
  },

  // Search
  ub_search_enter: {
    events: 'event56', // best-guess (Search Button Click [e56])
    eVars: {
      searchTerm: 'eVar11',
      parentTitle: 'eVar67',
      totalResults: 'eVar28',
      flowType: 'eVar36',
      successStatus: 'eVar55',
    },
  },

  // Popups
  popup_exit: { events: 'event18' }, // best-guess (Splash Popup Close [e18]) — verify per modal type

  // Guest checkout / login flow (we already have guest_login_continue/successful/error
  // mapped to event49/50/11 — adding guest_login_start as the "start" CTA click).
  guest_login_start: {
    events: 'event48', // best-guess (Login/Register CTA Click [e48])
    eVars: { checkoutType: 'eVar15', loginStatus: 'eVar9' },
  },
  guestuser_address_close: {
    events: 'event102', // best-guess (Login Popup Close [e102])
    eVars: { checkoutType: 'eVar15', loginStatus: 'eVar9' },
  },

  // Form file upload
  File_upload_successful: { events: 'event101' }, // best-guess (Registration complete-style — TBD verify)
};

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
 * Looks up `eventName` in EVENT_REGISTRY:
 *   - sets `events` (eventN) directly on the analytics payload
 *   - maps known `eventData` keys to specific eVarN fields
 *   - any unmapped keys land in `contextData`
 *
 * Fails silently if Alloy hasn't been bootstrapped yet (a click in the
 * first ~few hundred ms before loadLazy fires `initAnalytics`).
 *
 * @param {string} eventName  AMS linkName (preserve exact case + spaces)
 * @param {Object} [eventData]
 */
export function trackEvent(eventName, eventData = {}) {
  const name = typeof eventName === 'string' ? eventName.trim() : '';
  if (!name) return;
  if (typeof window.alloy !== 'function') return;

  // Mutate legacy digitalData.event for any block still reading it.
  getDigitalData().event = name;

  const def = EVENT_REGISTRY[name] || {};
  const analytics = {
    linkName: name,
    linkType: 'o',
    // Page-level context vars required on every link tracking call per spec
    eVar6: location.href,
    prop6: 'D=v6',
    eVar54: getPageName(),
    prop54: 'D=v54',
  };
  if (def.events) analytics.events = def.events;

  // Split eventData keys: known → eVarN; unknown → contextData
  const eVarMap = def.eVars || {};
  const contextData = {};
  Object.entries(eventData).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    const target = eVarMap[k];
    if (target) {
      analytics[target] = String(v);
    } else {
      contextData[k] = String(v);
    }
  });
  if (Object.keys(contextData).length) analytics.contextData = contextData;

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
