export default function decorate(block) {
  const section = block.closest(".section");
  if (section) section.classList.add("explore-split-wrapper");

  const rows = [...block.children];
  if (rows.length < 2) return;

  const desktopRow = rows[0];
  const mobileRow = rows[1];

  // Remove unused layout depending on screen
  if (window.innerWidth >= 992) {
    mobileRow.remove();
  } else {
    desktopRow.remove();
  }

  /* ---------------- DESKTOP SETUP ---------------- */

  if (window.innerWidth >= 992) {
    const desktopCols = [...desktopRow.children];

    const texturesHeadingCol = desktopCols[0];
    const texturesImagesCol = desktopCols[1];

    desktopRow.classList.add("explore-split-desktop");
    texturesHeadingCol.classList.add("textures-desktop");
    texturesImagesCol.classList.add("wallpapers-desktop");
  }

  /* ---------------- MOBILE SETUP ---------------- */

  if (window.innerWidth < 992) {
    const mobileCols = [...mobileRow.children];

    const texturesCol = mobileCols[0];
    const wallpapersCol = mobileCols[1];

    mobileRow.classList.add("explore-split-mobile");
    texturesCol.classList.add("textures-mobile");
    wallpapersCol.classList.add("wallpapers-mobile");

    const texturesTab = texturesCol.querySelector("h3");
    const wallpapersTab = wallpapersCol.querySelector("h3");

    if (!texturesTab || !wallpapersTab) return;

    /* create tab container */
    const tabsNav = document.createElement("div");
    tabsNav.className = "explore-mobile-tabs";

    tabsNav.appendChild(texturesTab);
    tabsNav.appendChild(wallpapersTab);

    mobileRow.prepend(tabsNav);

    /* default state */
    wallpapersCol.style.display = "none";
    texturesTab.classList.add("active");

    /* tab click behaviour */

    texturesTab.addEventListener("click", () => {
      texturesCol.style.display = "block";
      wallpapersCol.style.display = "none";

      texturesTab.classList.add("active");
      wallpapersTab.classList.remove("active");
    });

    wallpapersTab.addEventListener("click", () => {
      texturesCol.style.display = "none";
      wallpapersCol.style.display = "block";

      wallpapersTab.classList.add("active");
      texturesTab.classList.remove("active");
    });
  }
}