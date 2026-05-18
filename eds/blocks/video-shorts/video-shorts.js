import { trackEvent } from "../../scripts/analytics.js";

const SHORTS_WRAPPER_SEL = ".sa_shorts_video-wrapper";
const VIDEO_SHORTS_PREFIX = "video-shorts-";

function triggerVideoPlayAnalyticsEvt(wrapper, videoCaptionSel) {
  const videoTitle = wrapper.querySelector(videoCaptionSel)?.textContent?.trim();
  const videoUrl = wrapper.querySelector("#video")?.getAttribute("src-data");

  trackEvent("short_video_play", {
    videoTitle: videoTitle || "",
    param1: videoUrl || "",
  });
}

function triggerVideoShopAnalyticsEvt(anchorEl, videoCaptionSel) {
  const videoTitle = anchorEl
    .closest(SHORTS_WRAPPER_SEL)
    ?.querySelector(videoCaptionSel)
    ?.textContent?.trim();

  const productName = anchorEl
    .closest(".sa_shorts_product-details")
    ?.querySelector("p.name")
    ?.textContent?.trim();

  trackEvent("short_video_shop", {
    videoTitle: videoTitle || "",
    productName: productName || "",
    param1: anchorEl.href,
  });
}

function trackEvents(rootEl) {
  if (!rootEl) return;

  const exploreSel = ".cta-link";
  const videoCaptionSel = ".sa_shorts_parentVideo-caption p";

  rootEl.addEventListener("click", (e) => {
    if (e.target.closest(exploreSel)) {
      triggerVideoShopAnalyticsEvt(e.target.closest(exploreSel), videoCaptionSel);
    } else if (e.target.closest(SHORTS_WRAPPER_SEL)) {
      triggerVideoPlayAnalyticsEvt(e.target.closest(SHORTS_WRAPPER_SEL), videoCaptionSel);
    }
  });

  const modalVideoCaptionSel = ".sa_shorts_video-caption p";
  document.querySelector("#sa_shorts_modal-wrapper")?.addEventListener("click", (e) => {
    if (e.target.closest(exploreSel)) {
      triggerVideoShopAnalyticsEvt(e.target.closest(exploreSel), modalVideoCaptionSel);
    } else if (e.target.closest(SHORTS_WRAPPER_SEL)) {
      triggerVideoPlayAnalyticsEvt(e.target.closest(SHORTS_WRAPPER_SEL), modalVideoCaptionSel);
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

          // Track events from the rendered widget container
          setTimeout(() => {
            trackEvents(document.querySelector(`#${authoredWrapperId}`));
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