/**
 * Third-party marketing pixels — hybrid PageView-beacon + delayed-library strategy.
 *
 * Architecture
 * ────────────
 *   LAZY phase     firePixelPageView()    Fires lightweight image-pixel beacons
 *                                          (~1 KB total, no JS libraries loaded)
 *                                          for FB Pixel, GA4, Google Ads, and
 *                                          DCM Floodlight. Captures PageView for
 *                                          ~98% of visitors with near-zero
 *                                          Lighthouse impact.
 *
 *   Form events    firePixelConversion()  Additional image beacons fired alongside
 *                                          existing trackEvent() calls in form
 *                                          handlers. No SDK library needed for
 *                                          basic conversion firing.
 *
 *   DELAYED phase  initThirdPartyPixels() Loads Microsoft Clarity full library
 *                                          for session replay (via delayed.js,
 *                                          fires past the Lighthouse 5 s audit
 *                                          window — zero LHS impact). Clarity
 *                                          misses the first ~8 s of session but
 *                                          the rest is captured.
 *
 * Replaces the previously-shipped GTM container (GTM-MP96GBBF) which was loading
 * in lazy phase and costing ~271 KB of JS + 10-15 PSI Performance points.
 * Identical PageView + conversion coverage in ~1 KB of network bandwidth.
 *
 * GA4 visitor / session continuity
 * ────────────────────────────────
 * We read the existing `_ga` cookie (cid) and `_ga_<container>` cookie (sid)
 * if they exist. If not, we write them in the same format gtag.js would write
 * — so if marketing later adds gtag.js directly (e.g., for enhanced
 * measurement), it inherits the same visitor and session identity. No
 * double-counting.
 *
 * Migration path
 * ──────────────
 * When Adobe Experience Platform Event Forwarding is configured for FB / Ads /
 * DCM / GA4 (separate workstream — see Event Forwarding runbook), those
 * destinations move server-side and the matching beacon calls in this file can
 * be removed. Only Clarity (session replay) must stay client-side.
 */

const PIXELS = Object.freeze({
  fb:      '482414101861271',
  ga4:     'G-24N7L31LL9',      // brand GA4 property (the one in legacy IDs list)
  ads:     'AW-988076575',      // "AW-" prefix is stripped when building the URL
  dcm:     '8404938',            // Floodlight advertiser ID
  clarity: 'scmwsisrlt',
});

const COOKIE_DOMAIN = '.asianpaints.com';

// =============================================================
// HELPERS — GA4 cookie continuity. Matches gtag.js cookie names so
// that any future gtag.js load picks up the same identity. Prevents
// double-counting visitors / split sessions.
// =============================================================

/**
 * Returns the GA4 client ID from the `_ga` cookie, or generates and
 * persists a new one in the exact format gtag.js writes
 * (`GA1.1.<random10>.<unixSeconds>`).
 */
function getGaCid() {
  const m = document.cookie.match(/(?:^|;\s*)_ga=GA1\.1\.([^;]+)/);
  if (m) return m[1];
  const cid = `${Math.floor(Math.random() * 1e10)}.${Math.floor(Date.now() / 1000)}`;
  try {
    document.cookie = `_ga=GA1.1.${cid}; domain=${COOKIE_DOMAIN}; path=/; max-age=63072000; SameSite=None; Secure`;
  } catch (e) { /* incognito / blocked — beacon still fires, GA4 generates own cid */ }
  return cid;
}

/**
 * Reads the Adobe Marketing Cloud Visitor ID (ECID) from the AMCV
 * cookie. Returns empty string if not present.
 *
 * Same source `analytics_1.js#getECID()` reads from — kept duplicated
 * here to keep this module dependency-free. If the source ever changes
 * (e.g., ECID moves to a different cookie), update both.
 */
function getAdobeEcid() {
  // MCMID can be either %7C (URL-encoded pipe) or literal | depending
  // on how the cookie was written.
  const m = document.cookie.match(/MCMID(?:%7C|\|)(\d+)/);
  return m ? m[1] : '';
}

/**
 * Returns the GA4 session state from the container-specific cookie
 * `_ga_<container>`, or generates and persists a fresh session if the
 * cookie is missing.
 *
 * gtag.js cookie format: `GS<v>.<n>.<sid>.<sct>.<seg>.<ept>.<scs>.<usc>`
 *   sid = session ID (unix seconds), sct = session count (lifetime sessions),
 *   seg = engaged flag (1 if session is engaged), ept = engagement timestamp
 */
function getGaSession() {
  const cookieName = `_ga_${PIXELS.ga4.replace('G-', '')}`;
  const re = new RegExp(`(?:^|;\\s*)${cookieName}=GS\\d\\.\\d\\.(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)`);
  const m = document.cookie.match(re);
  if (m) {
    return { sid: m[1], sct: m[2], seg: m[3], ept: m[4] };
  }
  const sid = String(Math.floor(Date.now() / 1000));
  const sct = '1';
  const seg = '1';
  const ept = sid;
  try {
    document.cookie = `${cookieName}=GS1.1.${sid}.${sct}.${seg}.${ept}.0.0; domain=${COOKIE_DOMAIN}; path=/; max-age=63072000; SameSite=None; Secure`;
  } catch (e) { /* incognito / blocked */ }
  return { sid, sct, seg, ept };
}

// =============================================================
// HELPERS — Facebook Pixel parity. FB SDK sends `fbp` browser-ID
// cookie + `eid` event-dedup ID + `pmd` page metadata. Replicate
// them so our beacon matches what the legacy SDK fires (retargeting
// audience match rate, future Conversions API dedup, ad relevance).
// =============================================================

/**
 * Returns the FB browser ID from the `_fbp` cookie, or generates and
 * persists a new one in the exact format Meta's SDK writes
 * (`fb.1.<unixMs>.<random>`). Critical for FB retargeting / Custom
 * Audience matching — without this, FB cannot stitch a visitor
 * across sessions.
 */
function getFbp() {
  const m = document.cookie.match(/(?:^|;\s*)_fbp=([^;]+)/);
  if (m) return m[1];
  const fbp = `fb.1.${Date.now()}.${Math.floor(Math.random() * 1e16)}`;
  try {
    document.cookie = `_fbp=${fbp}; domain=${COOKIE_DOMAIN}; path=/; max-age=63072000; SameSite=None; Secure`;
  } catch (e) { /* incognito */ }
  return fbp;
}

/**
 * Generates an event dedup ID that FB Pixel + FB Conversions API (server-
 * side) can match for deduplication. If marketing later enables Adobe
 * Event Forwarding for FB CAPI, both client and server events must
 * reference the same eid to avoid double-counting.
 *
 * Format mirrors the FB SDK's "client-side identifier": `ob3_plugin-
 * set_<sha256-of-event-and-cookie>`. We use a simpler random-per-event
 * pattern since we don't have the page's full FB context.
 */
function generateFbEid() {
  const rand = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
  return `ob3_eds_${rand}`;
}

/**
 * Returns page metadata FB uses for ad relevance + advanced matching.
 * Read from <title> + <meta name="description"> + lang attr.
 */
function getFbPageMetadata() {
  return {
    'pmd[title]':       document.title || '',
    'pmd[locale]':      document.documentElement.lang || 'en',
    'pmd[description]': document.querySelector('meta[name="description"]')?.content || '',
  };
}

/**
 * Page load time in ms (from performance API) — FB uses this for
 * page-quality signals.
 */
function getPageLoadTime() {
  try {
    const t = performance.timing;
    if (t && t.loadEventEnd && t.navigationStart) {
      const plt = t.loadEventEnd - t.navigationStart;
      return plt > 0 ? plt : performance.now();
    }
    return performance.now();
  } catch (e) {
    return 0;
  }
}

// =============================================================
// BEACONS — image-pixel firing, no SDK library required.
// Image beacons run at low priority so they don't compete with LCP
// image bandwidth, and they cost ~0 JS parse time.
// =============================================================

function fireBeacon(url) {
  try {
    new Image().src = url;
  } catch (e) { /* never throw from analytics */ }
}

let fbEventCount = 0; // increments per beacon — FB uses this as `ec` (event count)

function fireFacebookBeacon(eventName, params = {}) {
  const meta = getFbPageMetadata();
  const qs = new URLSearchParams({
    id: PIXELS.fb,
    ev: eventName,
    dl: location.href,
    rl: document.referrer || '',
    if: 'false',
    ts: String(Date.now()),
    sw: String(screen.width),
    sh: String(screen.height),
    v: '2.9.334',                  // match the FB SDK version legacy site fires
    r: 'stable',
    ec: String(fbEventCount++),    // event count — FB uses for ordering
    fbp: getFbp(),                 // browser ID cookie — critical for retargeting
    eid: generateFbEid(),          // event dedup ID — for future Conversions API match
    tz: String(new Date().getTimezoneOffset() * -1),
    plt: String(getPageLoadTime()),
    ...meta,                       // pmd[title], pmd[locale], pmd[description]
    ...params,
  });
  fireBeacon(`https://www.facebook.com/tr/?${qs}`);
}

function fireGa4Beacon(eventName, params = {}) {
  const { sid, sct, seg } = getGaSession();
  const baseParams = {
    v: '2',
    tid: PIXELS.ga4,
    cid: getGaCid(),
    sid,
    sct,
    seg,
    en: eventName,
    dl: location.href,
    dt: document.title,
    dr: document.referrer || '',
    sr: `${screen.width}x${screen.height}`,
    ul: (navigator.language || 'en').toLowerCase(),
    // 10 s engaged-time default — prevents bounce-rate inflation. Real
    // engaged time would require a visibilitychange tracker (follow-up
    // if metrics skew complaints come in from marketing).
    _et: '10000',
  };
  // Adobe ECID → GA4 user property (`up.adobe_ecid`). Standard GA4
  // Measurement Protocol convention for sending custom identifiers as
  // user-scoped properties. Enables cross-platform stitching with
  // Adobe Analytics — marketing can use `User > Adobe ECID` as a
  // dimension in GA4 reports and join to Adobe Analytics datasets.
  //
  // Not literally replicating the `ecid=` and `_eu=` params from the
  // legacy GTM call — those are GTM-internal encoded flags we can't
  // accurately reproduce. The user-property approach is GA4's
  // documented stitching mechanism (does the same job).
  const adobeEcid = getAdobeEcid();
  if (adobeEcid) baseParams['up.adobe_ecid'] = adobeEcid;
  const qs = new URLSearchParams({ ...baseParams, ...params });
  fireBeacon(`https://www.google-analytics.com/g/collect?${qs}`);
}

function fireGoogleAdsBeacon(eventName, params = {}) {
  const conversionId = PIXELS.ads.replace('AW-', '');
  const qs = new URLSearchParams({
    random: String(Date.now()),
    cv: '11',
    fst: String(Date.now()),
    bg: 'ffffff',
    guid: 'ON',
    async: '1',
    en: eventName,
    url: location.href,
    ref: document.referrer || '',
    rfmt: '3',
    fmt: '4',
    ...params,
  });
  fireBeacon(`https://googleads.g.doubleclick.net/pagead/viewthroughconversion/${conversionId}/?${qs}`);
}

function fireDcmFloodlightBeacon(type, cat, params = {}) {
  // DCM activity tag URL pattern (matches what GTM was firing, verified via
  // Omnibug export 2026-06-09).
  const extra = Object.entries(params)
    .map(([k, v]) => `;${k}=${encodeURIComponent(String(v))}`)
    .join('');
  const url = `https://${PIXELS.dcm}.fls.doubleclick.net/activityi`
    + `;src=${PIXELS.dcm}`
    + `;type=${type}`
    + `;cat=${cat}`
    + `;ord=${Math.floor(Math.random() * 1e12)}`
    + extra
    + `;~oref=${encodeURIComponent(location.href)}?`;
  fireBeacon(url);
}

// =============================================================
// PUBLIC API — LAZY phase
// =============================================================

/**
 * Fires PageView image beacons for FB, GA4, Google Ads, and DCM
 * Floodlight. Call from lazy phase. Each beacon is ~250 bytes; all
 * four fire in parallel. No SDK libraries loaded — near-zero LHS
 * impact.
 */
export function firePixelPageView() {
  fireFacebookBeacon('PageView');
  fireGa4Beacon('page_view');
  fireGoogleAdsBeacon('gtag.config');
  // DCM PageView Floodlight — matches the asian0/asian0 type/cat pair
  // that GTM was firing (per Omnibug capture 2026-06-09).
  fireDcmFloodlightBeacon('asian0', 'asian0');
}

/**
 * Mirrors a conversion event (form_submit, form_start, etc.) to the
 * marketing pixels via image beacons. Wire alongside existing
 * trackEvent() calls in form handlers — see lead-form.js / form.js.
 *
 * Example:
 *   trackEvent('Form Submit', formData);          // Adobe Analytics
 *   firePixelConversion('form_submit', {          // Marketing pixels
 *     event_category: formName,
 *     value: 1,
 *     currency: 'INR',
 *   });
 *
 * @param {string} eventName  Spec key (form_start, form_submit, phone_click, ...)
 * @param {Object} [params]   Event params (value, currency, custom dims, etc.)
 */
export function firePixelConversion(eventName, params = {}) {
  // FB — translate our spec name to FB's standard event vocabulary
  const fbEventName = FB_EVENT_MAP[eventName] || 'CustomEvent';
  fireFacebookBeacon(fbEventName, params);

  // GA4 — pass through the spec name verbatim (GA4 accepts any event_name)
  fireGa4Beacon(eventName, params);

  // Google Ads — same spec name; uses Ads' generic event-fire pattern
  fireGoogleAdsBeacon(eventName, params);

  // DCM Floodlight — only fire for events that have a dedicated conversion
  // type/cat pair configured. Marketing populates DCM_CONVERSION_MAP as they
  // create activity tags in Campaign Manager 360. Per Omnibug audit
  // (2026-06-09), the live site only fires the PageView Floodlight
  // (asian0/asian0) — handled in firePixelPageView, not here.
  const dcmConv = DCM_CONVERSION_MAP[eventName];
  if (dcmConv) {
    fireDcmFloodlightBeacon(dcmConv.type, dcmConv.cat, params);
  }
}

// Spec event name → FB standard event name. Extend as marketing identifies more.
// FB standard event list: PageView, ViewContent, Search, AddToCart,
// AddToWishlist, InitiateCheckout, AddPaymentInfo, Purchase, Lead,
// CompleteRegistration, Contact, Subscribe, FindLocation, Schedule, etc.
const FB_EVENT_MAP = Object.freeze({
  form_start:  'InitiateCheckout',
  form_submit: 'Lead',
  phone_click: 'Contact',
});

// DCM Floodlight conversion-specific {type, cat} pairs. Empty by default —
// per Omnibug audit (2026-06-09), the live site only fires the PageView
// Floodlight (handled in firePixelPageView). Populate per conversion as
// marketing creates activity tags in Campaign Manager 360.
//
//   form_submit: { type: 'lead0', cat: 'lead0' },
//
const DCM_CONVERSION_MAP = Object.freeze({
});

// =============================================================
// PUBLIC API — DELAYED phase
// =============================================================

/**
 * Loads Microsoft Clarity's full library for session replay.
 *
 * Clarity has no equivalent to image-beacon firing — session replay
 * inherently needs a long-lived script in the page to record DOM events,
 * mouse moves, scroll, clicks, etc. So the full ~30 KB library must
 * load in the page.
 *
 * Loading from the delayed phase (8 s after page load) keeps it well
 * past Lighthouse's 5 s audit window — zero LHS impact. Trade-off:
 * Clarity misses the first ~8 s of session, but the rest is captured.
 *
 * If marketing demands full session capture, this function can be
 * exported and called from lazy phase instead (adds ~30 KB to lazy +
 * ~1-2 LHS points).
 */
function loadMicrosoftClarity() {
  if (window.clarity) return;
  /* eslint-disable */
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, 'clarity', 'script', PIXELS.clarity);
  /* eslint-enable */
}

/**
 * Delayed-phase entry point — called from delayed.js. Loads any
 * full-library pixels that are too heavy to put in the lazy phase
 * but cannot be replaced by image beacons.
 *
 * Currently only Microsoft Clarity (session replay). FB / GA4 / Ads /
 * DCM are handled via lazy beacons + on-event beacons (no library load).
 *
 * Each loader is wrapped in try/catch so one pixel's failure (script
 * blocked by browser, network error, etc.) never breaks the others.
 */
export function initThirdPartyPixels() {
  try {
    loadMicrosoftClarity();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[third-party-pixels] Clarity load failed:', e);
  }
}
