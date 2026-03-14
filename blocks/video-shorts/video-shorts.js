export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  

  const columns = [...row.children];
  console.log(columns);
  if (columns.length < 2) return;

  // Column 1 = text
  const textCol = columns[0];
  textCol.classList.add('video-shorts-heading');

  // Column 1 = video
  const saleassistId = columns[1];
  saleassistId.classList.add('sale-assist-id');
  const saleassistVideoId = saleassistId.textContent.trim();

let widgetLoaded = false;

window.addEventListener("scroll", function loadWidget() {
  if (!widgetLoaded && window.scrollY > 100) {
    widgetLoaded = true;

    const container = document.querySelector(".section.video-shorts-container .video-shorts.block");

    if (container) {
      const div = document.createElement("div");
      div.id = "video-shorts-12b7c69d-67cb-4a7f-baba-11fbbd1d9c84";
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
          id: "12b7c69d-67cb-4a7f-baba-11fbbd1d9c84",
          width: isMobile.matches ? "200px" : "240px",
          height: isMobile.matches ? "360px" : "400px",
          borderRadius: "rounded",
          type: "tile",
          alterMobileDimensions: true,
        });
      } else {
        console.error(
          "SaleAssist script loaded, but saleassistVideoTiles is undefined."
        );
      }
    };

    document.head.appendChild(script);
    window.removeEventListener("scroll", loadWidget);
  }
});

const div = document.createElement('div');
div.id = saleassistVideoId;
document.body.appendChild(div);
}