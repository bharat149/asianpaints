function qsa(el, sel) { return [...el.querySelectorAll(sel)]; }
function qs(el, sel) { return el.querySelector(sel); }

const CONFIG_KEYS = new Set([
  'autoplay',
  'interval',
  'fade',
  'clickable',      // yes/no
  'ctalink',        // fallback link if clickable=yes
  'overlaysubtitle',
  'overlaytitle',
  'overlayhtml'     // optional: full HTML for overlay
]);

function textOf(cell) {
  return (cell?.textContent || '').trim();
}

function htmlOf(cell) {
  return (cell?.innerHTML || '').trim();
}

function normalizeBoolYesNo(v, defaultVal = false) {
  const s = String(v || '').trim().toLowerCase();
  if (s === 'yes' || s === 'true') return true;
  if (s === 'no' || s === 'false') return false;
  return defaultVal;
}

function extractLink(cell) {
  // If author pasted a link element, use its href; else use plain text.
  const a = cell?.querySelector?.('a[href]');
  if (a?.getAttribute('href')) return a.getAttribute('href').trim();
  return textOf(cell);
}

function looksLikeConfigRow(firstCellText) {
  return CONFIG_KEYS.has(firstCellText.toLowerCase());
}

function parseBlock(block) {
  const rows = qsa(block, 'tr');
  const cfg = {
    autoplay: true,
    interval: 5000,
    fade: false,
    clickable: false,
    ctaLink: '',
    overlaySubtitle: '',
    overlayTitle: '',
    overlayHtml: ''
  };

  const slides = [];

  // Skip header row
  rows.slice(1).forEach((tr) => {
    const tds = qsa(tr, 'td');
    if (tds.length < 2) return;

    const k = textOf(tds[0]).toLowerCase();

    // Config rows must be 2 columns
    if (looksLikeConfigRow(k) && tds.length === 2) {
      const vText = textOf(tds[1]);

      if (k === 'autoplay') cfg.autoplay = normalizeBoolYesNo(vText, true);
      if (k === 'interval') {
        const n = Number(vText);
        if (!Number.isNaN(n) && n >= 1000) cfg.interval = n;
      }
      if (k === 'fade') cfg.fade = normalizeBoolYesNo(vText, false);
      if (k === 'clickable') cfg.clickable = normalizeBoolYesNo(vText, false);
      if (k === 'ctalink') cfg.ctaLink = vText;
      if (k === 'overlaysubtitle') cfg.overlaySubtitle = vText;
      if (k === 'overlaytitle') cfg.overlayTitle = vText;
      if (k === 'overlayhtml') cfg.overlayHtml = htmlOf(tds[1]); // allow rich HTML
      return;
    }

    // Slide rows: ALWAYS 2 columns now => image | imageLink
    // Some authors might still have "slide | image | link" older format — support it gracefully:
    if (k === 'slide' && tds.length >= 3) {
      slides.push({
        imageHTML: htmlOf(tds[1]),
        imageLink: extractLink(tds[2]),
      });
      return;
    }

    // Normal new format:
    slides.push({
      imageHTML: htmlOf(tds[0]),
      imageLink: extractLink(tds[1]),
    });
  });

  return { cfg, slides };
}

function buildOverlay(cfg) {
  // Priority: overlayHtml (if provided) else subtitle/title.
  if (cfg.overlayHtml && cfg.overlayHtml.trim()) {
    return `<div class="bannerTextDesc">${cfg.overlayHtml}</div>`;
  }

  if (!cfg.overlaySubtitle && !cfg.overlayTitle) return '';

  return `
    <div class="bannerTextDesc">
      ${cfg.overlaySubtitle ? `<p>${cfg.overlaySubtitle}</p>` : ''}
      ${cfg.overlayTitle ? `<h2>${cfg.overlayTitle}</h2>` : ''}
    </div>
  `;
}

export default function decorate(block) {
  const { cfg, slides } = parseBlock(block);

  if (!slides.length) {
    block.innerHTML = '<p>No slides configured.</p>';
    return;
  }

  block.classList.add('image-carousel');
  if (cfg.fade) block.classList.add('carousel--fade');

  const overlayHTML = buildOverlay(cfg);

  const dotsHTML = slides.map((_, i) =>
    `<button class="carousel__dot" type="button" aria-label="Go to slide ${i + 1}" data-i="${i}"></button>`
  ).join('');

  const slidesHTML = slides.map((s, i) => {
    // Click target only if clickable=yes
    const href = cfg.clickable ? (s.imageLink || cfg.ctaLink || '') : '';
    const wrapperStart = href ? `<a class="full-banner-click" href="${href}">` : `<div class="full-banner-click" role="presentation">`;
    const wrapperEnd = href ? `</a>` : `</div>`;

    return `
      <li class="carousel__slide" data-i="${i}">
        <div class="imagebanner">
          <div class="bannerImgWithLeftTextComp bannerWithGreybackground">
            ${wrapperStart}
              <div class="prodBannerImage">${s.imageHTML}</div>
              ${overlayHTML}
            ${wrapperEnd}
          </div>
        </div>
      </li>
    `;
  }).join('');

  block.innerHTML = `
    <div class="carousel__wrap">
      <button class="carousel__nav carousel__prev" type="button" aria-label="Previous slide">‹</button>
      <div class="carousel__viewport" role="region" aria-roledescription="carousel" aria-label="Carousel">
        <ul class="carousel__track">${slidesHTML}</ul>
      </div>
      <button class="carousel__nav carousel__next" type="button" aria-label="Next slide">›</button>
      <div class="carousel__dots">${dotsHTML}</div>
    </div>
  `;

  const track = qs(block, '.carousel__track');
  const slideEls = qsa(block, '.carousel__slide');
  const dotEls = qsa(block, '.carousel__dot');
  const prev = qs(block, '.carousel__prev');
  const next = qs(block, '.carousel__next');
  const dotsWrap = qs(block, '.carousel__dots');

  if (slideEls.length <= 1) dotsWrap.style.display = 'none';

  // Ensure images focusable for keyboard (if any <img> present)
  slideEls.forEach((s) => {
    const img = qs(s, '.prodBannerImage img');
    if (img) img.setAttribute('tabindex', '0');
  });

  let idx = 0;
  let timer = null;

  function setActive(i) {
    idx = (i + slideEls.length) % slideEls.length;

    if (!cfg.fade) {
      track.style.transform = `translateX(${-idx * 100}%)`;
    } else {
      slideEls.forEach((s, si) => { s.style.display = si === idx ? 'block' : 'none'; });
    }

    dotEls.forEach((d, di) => d.classList.toggle('is-active', di === idx));
  }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  function start() {
    if (!cfg.autoplay || slideEls.length <= 1) return;
    stop();
    timer = window.setInterval(() => setActive(idx + 1), cfg.interval);
  }

  prev.addEventListener('click', () => { stop(); setActive(idx - 1); });
  next.addEventListener('click', () => { stop(); setActive(idx + 1); });
  dotEls.forEach((d) => d.addEventListener('click', () => { stop(); setActive(Number(d.dataset.i)); }));

  // If clickable=no, do NOT intercept clicks. (No CTA on banner.)
  // If clickable=yes, navigation is handled by the <a> wrapper.

  block.addEventListener('pointerdown', stop);
  block.addEventListener('focusin', stop);

  if (cfg.fade) slideEls.forEach((s, si) => { s.style.display = si === 0 ? 'block' : 'none'; });
  setActive(0);
  start();
}