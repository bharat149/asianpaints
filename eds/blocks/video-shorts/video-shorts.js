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
  const videoTitle = getVideoTitle(wrapper, videoEl);
  trackEvent('short_video_play', {
    videoTitle,
  });
}

function triggerVideoShopAnalyticsEvt(anchorEl) {
  const wrapper = getShortsWrapper(anchorEl);
  const videoTitle = wrapper ? getVideoTitle(wrapper) : '';

  trackEvent("short_video_shop", {
    param1: anchorEl.href,
    ...(videoTitle && { videoTitle }),
  });
}

function triggerVideoClickAnalyticsEvt(wrapper) {
  const redirectionUrl = wrapper.querySelector('.cta-link')?.href
    || wrapper.querySelector('a[href]')?.href
    || '';

  trackEvent('short_video_shop', {
    param1: redirectionUrl,
  });
}

function trackEvents() {
  initSaleAssistTracking();
}

export function initSaleAssistTracking() {
  // Guard: only attach once per page even if called from multiple blocks/delayed.js.
  if (document.dataset.videoShortsTrackingBound === 'true') return;
  document.dataset.videoShortsTrackingBound = 'true';

  const exploreSel = '.cta-link';

  // Delegate on document so clicks are caught regardless of where SaleAssist
  // injects its DOM (widget tiles or dynamically-created modal). The modal
  // (#sa_shorts_modal-wrapper) is created lazily on first video click, so
  // a direct querySelector at setup time always returns null.
  document.addEventListener('click', (e) => {
    const cta = e.target.closest(exploreSel);
    if (cta) {
      triggerVideoShopAnalyticsEvt(cta);
      return;
    }
    // Use broadened wrapper detection so Royal Play and IDS SaleAssist
    // variants (different class names) are also caught.
    const wrapper = getShortsWrapper(e.target);
    if (wrapper) {
      triggerVideoClickAnalyticsEvt(wrapper);
    }
  });

  // short_video_play (event296): the native 'play' event does not bubble,
  // so use capture phase on document to catch it from any SaleAssist video
  // element (tile or modal). Covers all pages that load SaleAssist —
  // including the IDS page — regardless of which block initialised the widget.
  document.addEventListener('play', (e) => {
    if (!(e.target instanceof HTMLVideoElement)) return;
    // Use broadened wrapper detection to cover IDS and other SaleAssist
    // widget variants that may use different class names.
    const wrapper = getShortsWrapper(e.target);
    if (!wrapper) return;
    triggerVideoPlayAnalyticsEvt(wrapper, e.target);
  }, { capture: true });
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

          // Track events from the rendered widget container
          setTimeout(() => {
            trackEvents();
          }, 2000);
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