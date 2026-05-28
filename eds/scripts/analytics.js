/**
 * Legacy analytics module — Adobe Launch → Alloy shim.
 *
 * Originally fired beacons through Adobe Launch (`_satellite.track`). Since
 * PR #301 migrated the page-load beacon to Adobe Web SDK (Alloy) in
 * analytics_1.js and removed the Launch loader, every `_satellite.track`
 * call in this file (and in the 6 blocks that call it directly) was a
 * silent no-op — dropping ~48 distinct events across ~42 blocks.
 *
 * This module preserves the legacy export surface (every function 40+ blocks
 * import) and now routes the underlying tracking through Alloy:
 *
 *   trackEvent('foo', { bar: 1 })                              ← from blocks
 *     ↓
 *   alloyTrack('foo', { bar: 1 })                              ← shim
 *     ↓
 *   window.alloy('sendEvent', { data: { __adobe: { analytics: {
 *     linkName: 'foo', linkType: 'o', contextData: { bar: '1' },
 *   } } } })                                                    ← Edge Network
 *
 * Also installs `window._satellite = { track: alloyTrack }` on import so the
 * 6 blocks that bypass this module and call `window._satellite.track(...)`
 * directly (header, embed, pincode, royal-play-banner, calculator-hub,
 * calculatorhub) start working again with zero block changes.
 *
 * Once individual blocks are migrated to call Alloy directly (analytics_1.js
 * `trackEvent`), the corresponding helpers here can be removed. Until then,
 * this shim is the single chokepoint that keeps RUM analytics alive.
 */

// ============================================================
// ALLOY SHIM CORE
// ============================================================

/**
 * Routes a legacy `_satellite.track`-style call to the Alloy beacon.
 *
 * Mapping:
 *   - linkName     = eventName              (so reports can group by event)
 *   - linkType     = 'o' (other) for clicks (matches s.tl(true,'o',name))
 *   - contextData  = stringified eventData  (each key arrives at the report
 *                    suite as a `c.<key>` field; Processing Rules in the
 *                    Adobe datastream config can map any key → eVar/prop)
 *
 * Fails silently if Alloy hasn't been bootstrapped yet (e.g. a click that
 * happens in the first ~few hundred ms before loadLazy fires) — same
 * effective behavior as the pre-shim broken state.
 *
 * @param {string} eventName
 * @param {Object} [eventData]
 */
function alloyTrack(eventName, eventData = {}) {
  if (typeof window.alloy !== 'function') return;

  const analytics = {
    linkName: eventName,
    linkType: 'o',
  };

  // Stringify all eventData keys into contextData. Processing Rules on the
  // datastream side map these to eVars/props (eg c.cta_ → eVar27).
  const contextEntries = Object.entries(eventData).filter(
    ([, v]) => v !== undefined && v !== null && v !== '',
  );
  if (contextEntries.length) {
    analytics.contextData = {};
    contextEntries.forEach(([k, v]) => {
      analytics.contextData[k] = String(v);
    });
  }

  try {
    window.alloy('sendEvent', {
      data: { __adobe: { analytics } },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[analytics shim] alloy sendEvent failed', err);
  }
}

/**
 * Install a `window._satellite.track` shim so blocks that bypass this module
 * and call `_satellite.track(...)` directly (header, embed, pincode,
 * royal-play-banner, calculator-hub, calculatorhub) route through Alloy.
 *
 * Idempotent: only installs if `_satellite.track` doesn't already exist,
 * so a real Launch container (if ever re-introduced) wins.
 */
(function installSatelliteShim() {
  if (typeof window === 'undefined') return;
  if (!window._satellite) window._satellite = {};
  if (typeof window._satellite.track !== 'function') {
    window._satellite.track = alloyTrack;
  }
}());

// ============================================================
// digitalData — legacy data layer, kept for blocks that read from it
// ============================================================

/**
 * Returns the digitalData object or creates an empty one if it doesn't exist.
 * Many legacy blocks still read from `window.digitalData.user.*` etc., so we
 * preserve the mutation surface even though Alloy doesn't read it.
 * @returns {Object} The digitalData object
 */
export function getDigitalData() {
  window.digitalData = window.digitalData || {};
  return window.digitalData;
}

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

/**
 * Reads MCMID from the AMCV cookie. Previously called
 * `_satellite.getVisitorId().getMarketingCloudVisitorID()`, which is no longer
 * available after the Launch migration. Reads the cookie directly instead,
 * preserving the same return value (MCID string or '').
 */
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
  digitalData.utmValues = {
    source,
    medium,
    campaign,
    cid,
  };
  digitalData.product = {
    productName: '',
    productCode: '',
    productPrice: '',
    productQuantity: 1,
    relatedProduct: '',
  };
  digitalData.skuCodeList = {
    skuCodes: '',
  };
  digitalData.device = {
    deviceType: navigator.userAgent,
  };
  digitalData.user = {
    loginStatus: digitalData.user?.loginStatus || 'not logged in',
    mcid: digitalData.user?.mcid || getMcidFromCookie(),
    ipAddress: digitalData.user?.ipAddress || '',
    emailId: digitalData.user?.emailId || '',
    mobileNumber: digitalData.user?.mobileNumber || '',
    loginFunction: digitalData.user?.loginFunction || '',
  };
  digitalData.event = digitalData.event || '';
}

// ============================================================
// PUBLIC API — legacy export surface, now Alloy-backed
// ============================================================

/**
 * Tracks a custom event. Originally fired `_satellite.track`; now routes to
 * Alloy via the shim. Also mutates `digitalData.event` for any block code
 * that still reads from the legacy data layer.
 * @param {string} eventName The name of the event
 * @param {Object} [eventData] Optional event data
 */
export function trackEvent(eventName, eventData = {}) {
  const normalizedEventName = typeof eventName === 'string' ? eventName.trim() : '';
  if (!normalizedEventName) return;

  getDigitalData().event = normalizedEventName;
  alloyTrack(normalizedEventName, eventData);
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
    trackEvent('custom_cta_click', {
      cta_: btnTitle,
    });
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
  if (titleInBlock?.textContent?.trim()) {
    return titleInBlock.textContent.trim();
  }

  const sectionHeading = section?.querySelector(':scope > .section-metadata + div h1, :scope > .section-metadata + div h2, :scope > .section-metadata + div h3, :scope > .section-metadata + div h4, :scope > .section-metadata + div h5, :scope > .section-metadata + div h6, h1, h2, h3, h4, h5, h6');
  if (sectionHeading?.textContent?.trim()) {
    return sectionHeading.textContent.trim();
  }

  const nearestText = scopedContainer.querySelector('h1, h2, h3, h4, h5, h6, p');
  return nearestText?.textContent?.trim() || '';
}

export function trackPdfDownload(target) {
  const pdfName = (target?.textContent || '').trim();
  trackEvent('download_form_pdf', {
    pdfName,
  });
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

/**
 * No-op kept for backwards compatibility.
 *
 * Was: loaded the Adobe Launch container. The page-view beacon is now fired
 * by analytics_1.js (Alloy) in loadLazy, so this function does nothing —
 * but the export is preserved so any external caller (e.g. legacy
 * `import('./analytics.js').then(({ initAnalytics }) => initAnalytics())`)
 * doesn't break.
 */
// eslint-disable-next-line require-await
export async function initAnalytics() {
  // Intentionally empty. See module-level docstring + analytics_1.js.
  setDigitalDataContext(window.location.href);
}
