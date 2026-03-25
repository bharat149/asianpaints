export default function decorate(block) {
  const section = block.closest(".section");
  if (section) section.classList.add("explore-split-wrapper");

  const rows = [...block.children];
  if (rows.length < 1) return;

  const desktopRow = rows[0] || null;
  const mobileRow = rows[1] || null;

  const isDesktop = window.matchMedia("(min-width: 992px)").matches;
  const isMobile = window.matchMedia("(max-width: 991px)").matches;

  /* ---------------- DESKTOP SETUP ---------------- */

  if (isDesktop && desktopRow) {
    const desktopCols = [...desktopRow.children];
    if (desktopCols.length < 2) return;

    const texturesHeadingCol = desktopCols[0];
    const texturesImagesCol = desktopCols[1];

    desktopRow.classList.add("explore-split-desktop");
    texturesHeadingCol.classList.add("textures-desktop");
    texturesImagesCol.classList.add("wallpapers-desktop");

    // 🔥 ADD CLASSES TO ALL <p>
    const paragraphs = texturesHeadingCol.querySelectorAll("p");
    paragraphs.forEach((p, index) => {
      p.classList.add(`img-${index + 1}`);
    });

    if (mobileRow) mobileRow.remove();
  }

  /* ---------------- MOBILE SETUP ---------------- */

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

    /* create tab container */
    const tabsNav = document.createElement("div");
    tabsNav.className = "explore-mobile-tabs";

    const texturesTabClone = texturesTab.cloneNode(true);
    const wallpapersTabClone = wallpapersTab.cloneNode(true);

    tabsNav.append(texturesTabClone, wallpapersTabClone);
    mobileRow.insertBefore(tabsNav, mobileRow.firstChild);

    /* default state */
    wallpapersCol.style.display = "none";
    texturesCol.style.display = "block";
    texturesTabClone.classList.add("active");

    /* tab click behaviour */

    texturesTabClone.addEventListener("click", () => {
      texturesCol.style.display = "block";
      wallpapersCol.style.display = "none";

      texturesTabClone.classList.add("active");
      wallpapersTabClone.classList.remove("active");
    });

    wallpapersTabClone.addEventListener("click", () => {
      texturesCol.style.display = "none";
      wallpapersCol.style.display = "grid"; // ✅ keep block/grid as per CSS

      wallpapersTabClone.classList.add("active");
      texturesTabClone.classList.remove("active");
    });

    if (desktopRow) desktopRow.remove();
  }
}