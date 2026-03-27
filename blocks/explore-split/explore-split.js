export default function decorate(block) {
  const section = block.closest(".section");
  if (section) section.classList.add("explore-split-wrapper");

  const rows = [...block.children];
  if (rows.length < 1) return;

  const desktopRow = rows[0] || null;
  const mobileRow = rows[1] || null;

  const isDesktop = window.matchMedia("(min-width: 992px)").matches;
  const isMobile = window.matchMedia("(max-width: 991px)").matches;

  /* ---------------- DESKTOP ---------------- */

  if (isDesktop && desktopRow) {
    const desktopCols = [...desktopRow.children];
    if (desktopCols.length < 2) return;

    const texturesHeadingCol = desktopCols[0];
    const texturesImagesCol = desktopCols[1];

    desktopRow.classList.add("explore-split-desktop");
    texturesHeadingCol.classList.add("textures-desktop");
    texturesImagesCol.classList.add("wallpapers-desktop");

    const paragraphs = texturesHeadingCol.querySelectorAll("p");
    paragraphs.forEach((p, index) => {
      p.classList.add(`img-${index + 1}`);
    });

    if (mobileRow) mobileRow.remove();
  }

  /* ---------------- MOBILE ---------------- */

  if (isMobile && mobileRow) {
    const mobileCols = [...mobileRow.children];
    if (mobileCols.length < 2) return;

    const texturesCol = mobileCols[0];
    const wallpapersCol = mobileCols[1];

    mobileRow.classList.add("explore-split-mobile");
    texturesCol.classList.add("textures-mobile");
    wallpapersCol.classList.add("wallpapers-mobile");

    const paragraphs = texturesCol.querySelectorAll("p");
    paragraphs.forEach((p, index) => {
      p.classList.add(`img-${index + 1}`);
    });

    const texturesTab = texturesCol.querySelector("h3");
    const wallpapersTab = wallpapersCol.querySelector("h3");
    if (!texturesTab || !wallpapersTab) return;

    /* Tabs */
    const tabsNav = document.createElement("div");
    tabsNav.className = "explore-mobile-tabs";

    const texturesTabClone = texturesTab.cloneNode(true);
    const wallpapersTabClone = wallpapersTab.cloneNode(true);

    tabsNav.append(texturesTabClone, wallpapersTabClone);
    mobileRow.insertBefore(tabsNav, mobileRow.firstChild);

    wallpapersCol.style.display = "none";
    texturesCol.style.display = "block";
    texturesTabClone.classList.add("active");

    texturesTabClone.addEventListener("click", () => {
      texturesCol.style.display = "block";
      wallpapersCol.style.display = "none";

      texturesTabClone.classList.add("active");
      wallpapersTabClone.classList.remove("active");

      runLayout(texturesCol); // 🔥 recalc
    });

    wallpapersTabClone.addEventListener("click", () => {
      texturesCol.style.display = "none";
      wallpapersCol.style.display = "grid";

      wallpapersTabClone.classList.add("active");
      texturesTabClone.classList.remove("active");
    });

    if (desktopRow) desktopRow.remove();

    /* 🔥 INIT */
    runLayout(texturesCol);

    window.addEventListener("resize", () => {
      runLayout(texturesCol);
    });
  }
}

/* ---------------- MASTER RUNNER ---------------- */

function runLayout(container) {
  waitForImages(container, () => {
    // 🔥 WAIT FOR PAINT (critical fix)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        adjustTextureLayout(container);
      });
    });
  });
}

/* ---------------- IMAGE LOAD HELPER ---------------- */

function waitForImages(container, callback) {
  const images = container.querySelectorAll("img");
  let loaded = 0;

  if (images.length === 0) {
    callback();
    return;
  }

  images.forEach((img) => {
    if (img.complete && img.naturalHeight !== 0) {
      loaded++;
      if (loaded === images.length) callback();
    } else {
      img.addEventListener("load", () => {
        loaded++;
        if (loaded === images.length) callback();
      });
    }
  });
}

/* ---------------- LAYOUT ---------------- */

function adjustTextureLayout(container) {
  if (!container || container.offsetParent === null) return;

  const items = container.querySelectorAll("p:not(.button-container)");
  if (items.length < 4) return;

  const img1 = items[0];
  const img2 = items[1];
  const img3 = items[2];
  const img4 = items[3];

  const gap = 12;

  // reset
  img1.style.top = "0px";
  img2.style.top = "0px";

  // 🔥 robust height (never 0)
  const h1 = getHeight(img1);
  const h2 = getHeight(img2);

  img3.style.top = `${h1 + gap}px`;
  img4.style.top = `${h2 + gap}px`;

  const totalHeight = Math.max(
    h1 + getHeight(img3),
    h2 + getHeight(img4)
  );

  // container.style.height = `${totalHeight}px`;
}

/* ---------------- HEIGHT HELPER ---------------- */

function getHeight(el) {
  const rect = el.getBoundingClientRect().height;
  if (rect > 0) return rect;

  const img = el.querySelector("img");
  if (img) {
    return img.clientHeight || img.naturalHeight || 0;
  }

  return 0;
}