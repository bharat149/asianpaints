function qsa(el, sel) { return [...el.querySelectorAll(sel)]; }
function qs(el, sel) { return el.querySelector(sel); }

function textOf(cell) {
  return (cell?.textContent || '').trim();
}

function htmlEscape(s) {
  return String(s || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function yesNo(val, def = false) {
  const v = String(val || '').trim().toLowerCase();
  if (v === 'yes' || v === 'true') return true;
  if (v === 'no' || v === 'false') return false;
  return def;
}

function parseConfig(block) {
  const rows = qsa(block, 'tr').slice(1); // skip header
  const cfg = {
    autoplay: true,
    interval: 5000,
    fade: false,
    clickable: false,
    ctaLink: '',
    overlaySubtitle: '',
    overlayTitle: '',
    imageList: [],
  };

  rows.forEach((tr) => {
    const tds = qsa(tr, 'td');
    if (tds.length < 2) return;

    const key = textOf(tds[0]).toLowerCase();
    const value = textOf(tds[1]);

    if (key === 'autoplay') cfg.autoplay = yesNo(value, true);
    if (key === 'interval') {
      const n = Number(value);
      if (!Number.isNaN(n) && n >= 1000) cfg.interval = n;
    }
    if (key === 'fade') cfg.fade = yesNo(value, false);
    if (key === 'clickable') cfg.clickable = yesNo(value, false);
    if (key === 'ctalink') cfg.ctaLink = value;
    if (key === 'overlaysubtitle') cfg.overlaySubtitle = value;
    if (key === 'overlaytitle') cfg.overlayTitle = value;

    // ✅ image config supports comma-separated list
    if (key === 'image') {
      cfg.imageList = value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  });

  return cfg;
}

function overlayHTML(cfg) {
  if (!cfg.overlaySubtitle && !cfg.overlayTitle) return '';
  return `
    <div class="bannerTextDesc">
      ${cfg.overlaySubtitle ? `<p>${htmlEscape(cfg.overlaySubtitle)}</p>` : ''}
      ${cfg.overlayTitle ? `<h2>${htmlEscape(cfg.overlayTitle)}</h2>` : ''}
    </div>
  `;
}

export default function decorate(block) {
  const cfg = parseConfig(block);

  if (!cfg.imageList.length) {
    block.innerHTML = '<p>No slides configured.</p>';
    return;
  }

  block.classList.add('image-carousel');
  if (cfg.fade) block.classList.add('carousel--fade');

  const dotsHTML = cfg.imageList.map((_, i) =>
    `<button class="carousel__dot" type="button" aria-label="Go to slide ${i + 1}" data-i="${i}"></button>`
  ).join('');

  const overlay = overlayHTML(cfg);

  const slidesHTML = cfg.imageList.map((url, i) => {
    const img = `<picture class="prodBannerImage"><img src="${htmlEscape(url)}" alt="" loading="eager"></picture>`;

    const wrapStart = (cfg.clickable && cfg.ctaLink)
      ? `<a class="full-banner-click" href="${htmlEscape(cfg.ctaLink)}">`
      : `<div class="full-banner-click" role="presentation">`;

    const wrapEnd = (cfg.clickable && cfg.ctaLink) ? `</a>` : `</div>`;

    return `
      <li class="carousel__slide" data-i="${i}">
        <div class="imagebanner">
          <div class="bannerImgWithLeftTextComp bannerWithGreybackground">
            ${wrapStart}
              ${img}
              ${overlay}
            ${wrapEnd}
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

  block.addEventListener('pointerdown', stop);
  block.addEventListener('focusin', stop);

  if (cfg.fade) slideEls.forEach((s, si) => { s.style.display = si === 0 ? 'block' : 'none'; });
  setActive(0);
  start();
}