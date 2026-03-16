import { loadScript } from './aem.js';
import { isProd } from './utils.js';

// FIXME: Replace with actual URLs
const LAUNCH_URL = isProd ? "prod-url" : "stage-url";

/**
 * Tracks a custom event. Triggers a _satellite.track call.
 * @param {string} eventName The name of the event
 * @param {Object} [eventData] Optional event data
 */
export function trackEvent(eventName, eventData = {}) {
  window._satellite && window._satellite.track(eventName, eventData);
}

/**
 * Initializes the data layer and loads the Adobe Launch script.
 */
export async function initAnalytics() {
  window.digitalData = window.digitalData || {};

  // Add page metadata
  window.digitalData.page = {
    title: document.title,
    url: window.location.href,
    path: window.location.pathname,
    // Add any other global meta from <meta> tags here
  };

  // Load the Launch script
  // FIXME: Uncomment the following line once we have the actual LAUNCH_URL
  //return loadScript(LAUNCH_URL, { async: true });
}