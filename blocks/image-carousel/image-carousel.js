const VERSION = 'image-carousel@v3 (image-key, comma-list, clickable flag)';

function qsa(el, sel) { return [...el.querySelectorAll(sel)]; }
function qs(el, sel) { return el.querySelector(sel); }

function cellText(cell) {
  return (cell?.textContent || '').replace(/\s+/g, ' ').trim();
}

function cellHrefOrText(cell) {
  // DA often renders URLs as links; prefer href if present
  const a = cell?.querySelector?.('a[href]');
  if (a?.getAttribute('href')) return a.getAttribute('href').trim();
  return cellText(cell);
}

function yesNo(val, def = false) {
  const v = String(val || '').trim().toLowerCase();
  if (v === 'yes' || v === 'true') return true;
  if (v === 'no' || v === 'false') return false;
  return def;
}

function splitUrls(raw) {
  // Accept comma-separated URLs; tolerate newline/extra spaces
  return String(raw || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseConfig(block) {
  const rows = qsa(block, 'tr');
  const cfg = {
    autoplay: true,
    interval: 5000,
    fade: false,
    clickable: false,
    ctaLink: '',
    overlaySubtitle: '',
    overlayTitle: '',
    images: [],
    debug: { parsed: [] },
  };

  // Skip the header row (block name)
  rows.slice(1).forEach((tr) => {
    const tds = qsa(tr, 'th, td');
    if (tds.length < 2) return;

    const key = cellText(tds[0]).toLowerCase();
    const valText = cellText(tds[1]);
    const valHrefOrText = cellHrefOrText(tds[1]);

    cfg.debug.parsed.push({ key, valText, valHrefOrText });

    if (key === 'autoplay') cfg.autoplay = yesNo(valText, true);
    if (key === 'interval') {
      const n = Number(valText);
      if (!Number.isNaN(n) && n >= 1000) cfg.interval = n;
    }
    if (key === 'fade') cfg.fade = yesNo(valText, false);
    if (key === 'clickable') cfg.clickable = yesNo(valText, false);
    if (key === 'ctalink') cfg.ctaLink = valHrefOrText;
    if (key === 'overlaysubtitle') cfg.overlaySubtitle = valText;
    if (key === 'overlaytitle') cfg.overlayTitle = valText;

    // ✅ Your desired format: image | <one-or-more-urls>
    // We append so multiple 'image' rows are allowed.
    if (key === 'image') {
      const urls = splitUrls(valHrefOrText || valText);
      cfg.images.push(...urls);
    }
  });

  // De-dupe while preserving order
  cfg.images = [...new Set(cfg.images)];

  return cfg;
}

function overlayHTML(cfg) {
  if (!cfg.overlaySubtitle && !cfg.overlayTitle) return '';
  return `
    <div class="bannerTextDesc">
      ${cfg.overlaySubtitle ? `<p>${cfg.overlaySubtitle}</p>` : ''}
      ${cfg.overlayTitle ? `<h2>${cfg.overlayTitle}</h2>` : ''}
    </div>
  `;
}

export default function decorate(block) {
  const cfg = parseConfig(block);

  // ✅ DIAGNOSTIC when no images
  if (!cfg.images.length) {
    const parsed = cfg.debug.parsed
      .map((r) => `${r.key}: text="${r.valText}" hrefOrText="${r.valHrefOrText}"`)
      .join('\n');

    block.innerHTML = `
      <pre style="white-space:pre-wrap;background:#fff3cd;padding:12px;border:1px solid #ffeeba;border-radius:8px;">
${VERSION}
No slides configured because I could not read any URLs from the "image" config row.

What I parsed from your table rows:
${parsed}

Expected at least one row like:
image | https://.../banner.png
(or comma-separated: https://...1.png, https://...2.png)
      </pre>
    `;
    return;
  }

  // Build slides from cfg.images
  block.classList.add('image-carousel');
  if (cfg.fade) block.classList.add('carousel--fade');

  const overlay = overlayHTML(cfg);

  const dotsHTML = cfg.images.map((_, i) =>
    `<button class="carousel__dot" type="button" aria-label="Go to slide ${i + 1}" data-i="${i}"></button>`
  ).join('');

  const slidesHTML = cfg.images.map((url, i) => {
    const img = `<img src="${url}" alt="" loading="${i === 0 ? 'eager' : 'lazy'}">`;

    // No CTA on banner unless clickable=yes AND ctaLink provided
    const wrapStart = (cfg.clickable && cfg.ctaLink)
      ? `<a class="full-banner-click" href="${cfg.ctaLink}">`
      : `<div class="full-banner-click">`;

    const wrapEnd = (cfg.clickable && cfg.ctaLink) ? `</a>` : `</div>`;

    return `
      <li class="carousel__slide" data-i="${i}">
        <div class="bannerImgWithLeftTextComp bannerWithGreybackground">
          ${wrapStart}
            <div class="prodBannerImage">${img}</div>
            ${overlay}
          ${wrapEnd}
        </div>
      </li>
    `;
  }).join('');

  block.innerHTML = `
    <div class="carousel__wrap">
      <button class="carousel__nav carousel__prev" type="button" aria-label="Previous">‹</button>
      <div class="carousel__viewport" role="region" aria-roledescription="carousel">
        <ul class="carousel__track">${slidesHTML}</ul>
      </div>
      <button class="carousel__nav carousel__next" type="button" aria-label="Next">›</button>
      <div class="carousel__dots">${dotsHTML}</div>
      <div style="display:none">${VERSION}</div>
    </div>
  `;

  const track = qs(block, '.carousel__track');
  const slideEls = qsa(block, '.carousel__slide');
  const dotEls = qsa(block, '.carousel__dot');
  const prev = qs(block, '.carousel__prev');
  const next = qs(block, '.carousel__next');
  const dotsWrap = qs(block, '.carousel__dots');

  if (slideEls.length <= 1) dotsWrap.style.display = 'none';

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

  function stop() { if (timer) clearInterval(timer); timer = null; }
  function start() {
    if (!cfg.autoplay || slideEls.length <= 1) return;
    stop();
    timer = setInterval(() => setActive(idx + 1), cfg.interval);
  }

  prev.addEventListener('click', () => { stop(); setActive(idx - 1); });
  next.addEventListener('click', () => { stop(); setActive(idx + 1); });
  dotEls.forEach((d) => d.addEventListener('click', () => { stop(); setActive(Number(d.dataset.i)); }));

  setActive(0);
  start();
}