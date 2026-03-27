import { loadScript } from './aem.js';
import { getSiteConfig } from './configs.js';

/**
 * Returns the digitalData object or creates an empty one if it doesn't exist.
 * @returns {Object} The digitalData object
 */
export function getDigitalData() {
  window.digitalData = window.digitalData || {};
  return window.digitalData;
}

/**
 * Tracks a custom event. Triggers a _satellite.track call.
 * @param {string} eventName The name of the event
 * @param {Object} [eventData] Optional event data
 */
export function trackEvent(eventName, eventData = {}) {
  window._satellite && window._satellite.track(eventName, eventData);
}

/**
 * Tracks CTA click interaction based on link type.
 * @param {string} ctaLink The CTA URL
 * @param {string} btnTitle The CTA label
 * @param {string} parentTitle The parent card/section title
 */
export function triggerCTAClickWithLinkAndTitle(ctaLink, btnTitle, parentTitle) {
  if (!ctaLink) return;

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

export function bindButtonContainerTracking(element) {
  element.querySelectorAll('.button-container a.button').forEach((cta) => {
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

/**
 * Initializes the data layer and loads the Adobe Launch script.
 */
export async function initAnalytics() {
  // Add page metadata
  getDigitalData().page = {
    title: document.title,
    url: window.location.href,
    path: window.location.pathname,
    // Add any other global meta from <meta> tags here
  };

  // Load the Launch script
  const siteConfig = await getSiteConfig();
  const launchUrl = siteConfig?.data?.find((entry) => entry?.key === 'launchUrl')?.value;
  if (!launchUrl) {
    return;
  }
  await loadScript(launchUrl, { async: true });
}