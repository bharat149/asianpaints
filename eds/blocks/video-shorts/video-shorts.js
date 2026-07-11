import { trackEvent } from "../../scripts/analytics_1.js";

const SHORTS_WRAPPER_SEL = '.sa_shorts_video-wrapper';
// Fallback selectors for SaleAssist widget variants used on pages
// other than the home page (e.g. IDS grid/list layout).
const SHORTS_WRAPPER_FALLBACKS = [
  '.sa_shorts_video-wrapper',
  '[class*="sa_shorts"]',
  '[class*="saleassist"]',
  '[class*="vtile"]',
];

function getShortsWrapper(el) {
  for (const sel of SHORTS_WRAPPER_FALLBACKS) {
    const found = el.closest(sel);
    if (found) return found;
  }
  return null;
}
const VIDEO_SHORTS_PREFIX = "video-shorts-";

// Ordered list of known SaleAssist caption selectors across widget
// variants (tile on home page vs grid/list on IDS page).
const CAPTION_SELECTORS = [
  '.sa_shorts_parentVideo-caption p',
  '.sa_shorts_video-caption p',
  '.sa_shorts_caption p',
  '.sa_shorts_title p',
  '[class*="caption"] p',
  '[class*="title"] p',
];

function getVideoTitle(wrapper, videoEl) {
  for (const sel of CAPTION_SELECTORS) {
    const text = wrapper?.querySelector(sel)?.textContent?.trim();
    if (text) return text;
  }
  // Fallback: title / aria-label on the <video> element itself
  if (videoEl) {
    const attr = videoEl.getAttribute('title')
      || videoEl.getAttribute('aria-label')
      || videoEl.getAttribute('data-title')
      || videoEl.getAttribute('data-video-title')
      || '';
    if (attr.trim()) return attr.trim();
  }
  return '';
}

function triggerVideoPlayAnalyticsEvt(wrapper, videoEl) {
  if (videoEl.dataset.playTrackingBound === 'true') return;
  videoEl.dataset.playTrackingBound = 'true';
  const videoTitle = getVideoTitle(wrapper, videoEl);
  trackEvent('short_video_play', {
    videoTitle,
  });
}

function triggerVideoShopAnalyticsEvt(anchorEl) {
  if (anchorEl.dataset.shopTrackingBound === 'true') return;
  anchorEl.dataset.shopTrackingBound = 'true';
  
  const wrapper = getShortsWrapper(anchorEl);
  const videoTitle = wrapper ? getVideoTitle(wrapper) : '';

  trackEvent("short_video_shop", {
    param1: anchorEl.href,
    ...(videoTitle && { videoTitle }),
  });
}

function triggerVideoClickAnalyticsEvt(wrapper) {
  if (wrapper.dataset.clickTrackingBound === 'true') return;
  wrapper.dataset.clickTrackingBound = 'true';
  
  const redirectionUrl = wrapper.querySelector('.cta-link')?.href
    || wrapper.querySelector('a[href]')?.href
    || '';

  trackEvent('short_video_shop', {
    param1: redirectionUrl,
  });
}

export function initSaleAssistTracking() {
  // Guard: only attach once per page even if called from multiple blocks/delayed.js.
  // NOTE: `document` has no `dataset` (only Elements do) — using it throws a
  // TypeError that aborts this function before any listener is bound, so use
  // the documentElement (<html>) dataset instead.
  if (document.documentElement.dataset.videoShortsTrackingBound === 'true') return;
  document.documentElement.dataset.videoShortsTrackingBound = 'true';

  const exploreSel = '.cta-link';

  // Delegate on document so clicks are caught regardless of where SaleAssist
  // injects its DOM (widget tiles or dynamically-created modal). The modal
  // (#sa_shorts_modal-wrapper) is created lazily on first video click, so
  // a direct querySelector at setup time always returns null.
  document.addEventListener('click', (e) => {
    const cta = e.target.closest(exploreSel);
    if (cta) {
      triggerVideoShopAnalyticsEvt(cta);
      // Return so the generic wrapper fallback below does not also fire
      // short_video_shop for the same click (duplicate beacon).
      return;
    }
    
    // Track video play on click
    const video = e.target.closest('video');
    if (video) {
      const wrapper = getShortsWrapper(video);
      if (wrapper) {
        triggerVideoPlayAnalyticsEvt(wrapper, video);
      }
      return;
    }
    
    // Use broadened wrapper detection so Royal Play and IDS SaleAssist
    // variants (different class names) are also caught.
    const wrapper = getShortsWrapper(e.target);
    if (wrapper) {
      triggerVideoClickAnalyticsEvt(wrapper);
    }
  });
}

export default function decorate(block) {
  const row = block.querySelector(":scope > div");
  if (!row) return;

  const columns = [...row.children];
  if (columns.length < 2) return;

  // Column 1 = heading/text
  const textCol = columns[0];
  textCol.classList.add("video-shorts-heading");

  // Column 2 = authored SaleAssist DOM wrapper id
  // Example authored value:
  // video-shorts-12b7c69d-67cb-4a7f-baba-11fbbd1d9c84
  const saleassistIdCol = columns[1];
  saleassistIdCol.classList.add("sale-assist-id");

  const authoredWrapperId = saleassistIdCol.textContent.trim();
  if (!authoredWrapperId) return;

  // SaleAssist mountWidget expects only the UUID part, not the full DOM id.
  // So strip "video-shorts-" if it is present.
  const saleassistWidgetId = authoredWrapperId.startsWith(VIDEO_SHORTS_PREFIX)
    ? authoredWrapperId.replace(VIDEO_SHORTS_PREFIX, "")
    : authoredWrapperId;

  let widgetLoaded = false;

  window.addEventListener("scroll", function loadWidget() {
    if (!widgetLoaded && window.scrollY > 100) {
      widgetLoaded = true;

      const container = document.querySelector(".section.video-shorts-container .video-shorts.block");

      // Create the mount container inside the block using the full authored DOM id.
      if (container && !container.querySelector(`#${authoredWrapperId}`)) {
        const div = document.createElement("div");
        div.id = authoredWrapperId;
        container.appendChild(div);
      }

      const script = document.createElement("script");
      script.src = "https://static.saleassist.ai/vtiles/swidget.min.js";
      script.type = "text/javascript";
      script.async = true;

      script.onload = function () {
        if (typeof saleassistVideoTiles !== "undefined") {
          const isMobile = window.matchMedia("(max-width: 480px)");

          saleassistVideoTiles.mountWidget({
            // Pass only the UUID to the SaleAssist widget API
            id: saleassistWidgetId,
            width: isMobile.matches ? "200px" : "225px",
            height: isMobile.matches ? "360px" : "400px",
            borderRadius: "rounded",
            type: "tile",
            alterMobileDimensions: true,
          });
        } else {
          // eslint-disable-next-line no-console
          console.error("SaleAssist script loaded, but saleassistVideoTiles is undefined.");
        }
      };

      document.head.appendChild(script);
      window.removeEventListener("scroll", loadWidget);
    }
  });

  // This extra body-level container is used by existing tracking logic.
  // Keep it aligned with the authored DOM id and avoid duplicates.
  if (!document.querySelector(`#${authoredWrapperId}`)) {
    const div = document.createElement("div");
    div.id = authoredWrapperId;
    document.body.appendChild(div);
  }
}

// Initialize tracking once when module loads
initSaleAssistTracking();