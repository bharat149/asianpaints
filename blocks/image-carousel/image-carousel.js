function parseDAConfigAndSlides(block) {
  const rows = [...block.querySelectorAll('tr')];
  const config = { autoplay: false, interval: 5000 };
  const slides = [];

  // Determine variant from block class: "carousel (variant)" becomes class "variant"
  // DA/EDS usually adds the option as a CSS class on the block root already,
  // but we also support reading it from the first row text.
  const headerText = rows[0]?.textContent?.trim() || '';
  const variantMatch = headerText.match(/\(([^)]+)\)/);
  if (variantMatch?.[1]) config.variant = variantMatch[1].trim();

  rows.slice(1).forEach((row) => {
    const cells = [...row.querySelectorAll('td')].map((c) => c.innerHTML.trim());
    if (cells.length < 2) return;

    const key = cells[0].replace(/<[^>]*>/g, '').trim().toLowerCase();

    // config rows: | autoplay | true |
    if (key === 'autoplay') config.autoplay = cells[1].replace(/<[^>]*>/g, '').trim() === 'true';
    else if (key === 'interval') {
      const n = Number(cells[1].replace(/<[^>]*>/g, '').trim());
      if (!Number.isNaN(n) && n >= 1000) config.interval = n;
    }
    // slide rows: | slide | <img..> | <h2>..</h2>... |
    else if (key === 'slide') {
      const media = cells[1] || '';
      const content = cells[2] || '';
      slides.push({ media, content });
    }
  });

  return { config, slides };
}

function safeSatelliteTrack(eventName, payload) {
  try {
    if (window._satellite && typeof window._satellite.track === 'function') {
      window._satellite.track(eventName, payload);
      return true;
    }
  } catch (e) {
    // ignore
  }
  return false;
}

function getText(el) {
  return (el?.textContent || '').trim();
}

function initAnalytics(root) {
  // Replaces your jQuery: $(".trackOverviewVariant").on("click", ...)
  root.addEventListener('click', (e) => {
    const overview = e.target.closest('.trackOverviewVariant');
    if (overview) {
      const code = getText(overview.querySelector('.track-since-you-like p'));
      const title = getText(overview.querySelector('.track-since-you-like h3'));
      if (window.ccAnalytics) {
        window.ccAnalytics.code = code;
        window.ccAnalytics.title = title;
      }
      // Track if satellite present
      safeSatelliteTrack('overview_swatch', { code, title });
    }

    // Replaces: $(".trackBannerCta .bannercta a.trackCTA").on("click", ...)
    const cta = e.target.closest('a.trackCTA');
    if (cta) {
      const bannerTextDesc = cta.closest('.bannerTextDesc');
      const leftAlign = bannerTextDesc?.querySelector('.leftAlign');
      const centerAlign = bannerTextDesc?.querySelector('.centerAlign');
      const rightAlign = bannerTextDesc?.querySelector('.rightAlign');
      const fallbackTitle = getText(bannerTextDesc?.querySelector('h1,h2,h3,h4,h5'));
      const title = getText(leftAlign) || getText(centerAlign) || getText(rightAlign) || fallbackTitle;
      const ctaName = getText(cta);

      safeSatelliteTrack('image_banner_click', {
        ctaName,
        title,
        sectionName: title,
      });
    }
  });
}

function attachFullBannerClickBehavior(root) {
  // Replaces your legacy: click on .bannerTextDesc navigates to .full-banner-click href
  root.addEventListener('click', (e) => {
    const textArea = e.target.closest('.bannerTextDesc');
    if (!textArea) return;

    const slide = textArea.closest('.carousel__slide');
    const fullBanner = slide?.querySelector('a.full-banner-click');
    if (fullBanner && fullBanner.href) {
      window.location.href = fullBanner.href;
    }
  });

  // Replaces: Enter on image goes to full banner href
  root.addEventListener('keydown', (e) => {
    const img = e.target.closest('.prodBannerImage img');
    if (!img) return;
    if (e.key === 'Enter') {
      const slide = img.closest('.carousel__slide');
      const fullBanner = slide?.querySelector('a.full-banner-click');
      if (fullBanner && fullBanner.href) {
        window.location.href = fullBanner.href;
      }
    }
  });
}

function renderCarousel(block, { config, slides }) {
  const id = `carousel-${Math.random().toString(16).slice(2)}`;
  block.classList.add('carousel');
  if (config.variant) block.classList.add(config.variant);

  const dots = slides.map((_, i) => `<button class="carousel__dot" type="button" aria-label="Go to slide ${i + 1}" data-index="${i}"></button>`).join('');

  const slideMarkup = slides.map((s, i) => `
    <li class="carousel__slide" data-index="${i}">
      <div class="imagebanner ${config.variant === 'video-banner' ? 'video-banner' : ''}">
        <div class="bannerImgWithLeftTextComp bannerWithGreybackground">
          <a class="full-banner-click" href="#" aria-hidden="true" tabindex="-1"></a>
          <div class="prodBannerImage">${s.media}</div>
          <div class="bannerTextDesc image-banner trackBannerCta">${s.content}</div>
        </div>
      </div>
    </li>
  `).join('');

  block.innerHTML = `
    <div class="carousel__wrap" id="${id}">
      <button class="carousel__nav carousel__prev" type="button" aria-label="Previous slide">‹</button>
      <div class="carousel__viewport" role="region" aria-roledescription="carousel" aria-label="Carousel">
        <ul class="carousel__track">
          ${slideMarkup}
        </ul>
      </div>
      <button class="carousel__nav carousel__next" type="button" aria-label="Next slide">›</button>

      <div class="carousel__dots" role="tablist" aria-label="Carousel pagination">
        ${dots}
      </div>
    </div>
  `;

  // If a slide contains an <a href="..."> as primary action, use it as full-banner-click target
  [...block.querySelectorAll('.carousel__slide')].forEach((slideEl) => {
    const firstLink = slideEl.querySelector('.bannerTextDesc a[href]');
    const full = slideEl.querySelector('a.full-banner-click');
    if (firstLink && full) full.href = firstLink.href;
    const img = slideEl.querySelector('.prodBannerImage img');
    if (img) img.setAttribute('tabindex', '0');
  });

  const track = block.querySelector('.carousel__track');
  const slideEls = [...block.querySelectorAll('.carousel__slide')];
  const dotEls = [...block.querySelectorAll('.carousel__dot')];
  const prevBtn = block.querySelector('.carousel__prev');
  const nextBtn = block.querySelector('.carousel__next');

  let index = 0;
  let timer = null;

  function update() {
    const offset = -index * 100;
    track.style.transform = `translateX(${offset}%)`;
    dotEls.forEach((d, i) => d.classList.toggle('is-active', i === index));
    slideEls.forEach((s, i) => s.classList.toggle('is-active', i === index));
  }

  function goTo(i) {
    index = (i + slideEls.length) % slideEls.length;
    update();
  }

  prevBtn.addEventListener('click', () => goTo(index - 1));
  nextBtn.addEventListener('click', () => goTo(index + 1));

  dotEls.forEach((d) => {
    d.addEventListener('click', () => goTo(Number(d.dataset.index)));
  });

  function startAutoplay() {
    if (!config.autoplay || slideEls.length < 2) return;
    stopAutoplay();
    timer = window.setInterval(() => goTo(index + 1), config.interval);
  }

  function stopAutoplay() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  // Pause autoplay on interaction
  block.addEventListener('pointerdown', stopAutoplay);
  block.addEventListener('focusin', stopAutoplay);

  update();
  startAutoplay();

  // Attach your legacy behaviors
  attachFullBannerClickBehavior(block);
  initAnalytics(block);
}

export default function decorate(block) {
  const { config, slides } = parseDAConfigAndSlides(block);
  if (!slides.length) {
    block.innerHTML = '<p>No slides configured.</p>';
    return;
  }
  renderCarousel(block, { config, slides });
}