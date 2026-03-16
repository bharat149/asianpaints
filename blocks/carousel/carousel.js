function loadScript(src) {
  return new Promise((resolve) => {
    const exists = [...document.scripts].some((s) => s.src && s.src.includes(src));
    if (exists) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.onload = resolve;
    script.onerror = resolve;
    document.head.appendChild(script);
  });
}

function text(el) {
  return (el?.textContent || '').trim();
}

function cells(row) {
  return [...row.querySelectorAll(':scope > div')];
}

function rowHasImage(row) {
  return !!row.querySelector('img');
}

function rowHasLink(row) {
  return !!row.querySelector('a[href]');
}

function extractFirstHref(row) {
  const a = row.querySelector('a[href]');
  if (a) return a.getAttribute('href') || '';
  const raw = text(row);
  const m = raw.match(/https?:\/\/\S+|\/\S+/);
  return m ? m[0] : '';
}

function extractTitleFromRow(row) {
  const c = cells(row);
  if (c.length > 1) {
    const t = text(c[1]);
    if (t) return t;
  }
  const clone = row.cloneNode(true);
  clone.querySelectorAll('img,picture,source,a').forEach((n) => n.remove());
  return text(clone);
}

function normalizeTarget(row) {
  const a = row.querySelector('a[target]');
  return (a?.getAttribute('target') || '_self').trim() || '_self';
}

function buildVariant2(block) {
  if (block.querySelector('.apCityCarousel')) return;

  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  let title = '';
  const first = rows[0];
  const firstCells = cells(first);

  if (firstCells.length === 1 && !rowHasImage(first) && !rowHasLink(first)) {
    title = text(firstCells[0]);
    rows.shift();
  }

  const items = rows
    .map((row) => {
      const img = row.querySelector('img');
      const src = img?.getAttribute('src') || '';
      const alt = img?.getAttribute('alt') || '';
      const cityTitle = extractTitleFromRow(row);
      const href = extractFirstHref(row);
      const target = normalizeTarget(row);
      return { src, alt, cityTitle, href, target };
    })
    .filter((i) => i.src && i.cityTitle);

  const root = document.createElement('div');
  root.className = 'apCityCarousel';

  const section = document.createElement('div');
  section.className = 'contractors-in-your-city';

  if (title) {
    const h2 = document.createElement('h2');
    h2.className = 'contractors-in-your-city-title';
    h2.textContent = title;
    section.appendChild(h2);
  }

  const cards = document.createElement('div');
  cards.className = 'contractors-in-your-city-cards';

  items.forEach((it) => {
    const card = document.createElement('div');
    card.className = 'contractors-in-your-city-card focus-visible-auto-imp';
    card.setAttribute('tabindex', '0');

    const a = document.createElement('a');
    a.className = 'contractors-citycard-link';
    a.setAttribute('role', 'link');
    a.setAttribute('href', it.href || '#');
    a.setAttribute('target', it.target);
    a.setAttribute('tabindex', '-1');

    const picture = document.createElement('picture');
    picture.className = 'contractors-in-your-city-card-img';

    const img = document.createElement('img');
    img.loading = 'eager';
    img.setAttribute('fetchpriority', 'high');
    img.src = it.src;
    img.width = '229';
    img.height = '210';
    img.title = 'image';
    img.className = 'blur-image';
    img.alt = it.alt;

    const h4 = document.createElement('h4');
    h4.className = 'contractors-in-your-city-card-title';
    h4.textContent = it.cityTitle;

    picture.appendChild(img);
    a.append(picture, h4);
    card.appendChild(a);
    cards.appendChild(card);
  });

  section.appendChild(cards);
  root.appendChild(section);

  block.innerHTML = '';
  block.appendChild(root);
}

function initVariant2(block) {
  const $root = window.jQuery(block);
  const $carousel = $root.find('.contractors-in-your-city-cards');

  const start = () => {
    if (!$carousel.length) return;
    if (!$carousel.children().length) return;

    if ($carousel.hasClass('slick-initialized')) {
      try {
        $carousel.slick('unslick');
      } catch (e) {}
    }

    $carousel.slick({
      infinite: false,
      arrows: true,
      slidesToShow: 5,
      slidesToScroll: 1,
      dots: false,
      autoplay: false,
      adaptiveHeight: true,
      variableWidth: true,
      accessibility: false,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            dots: true,
            arrows: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            variableWidth: true,
            adaptiveHeight: false,
          },
        },
      ],
    });

    $root.find('.contractors-in-your-city-cards .slick-arrow').addClass('focus-visible-auto-imp');

    $root.find('.contractors-in-your-city-card').off('click keydown').on('click keydown', function (e) {
      if (e.type !== 'click' && !(e.type === 'keydown' && e.key === 'Enter')) return;
      const href = window.jQuery(this).find('a').attr('href');
      if (!href || href === '#') return;
      window.location.href = href;
    });

    const updateArrowTabindex = () => {
      $root
        .find('.contractors-in-your-city-cards .slick-prev, .contractors-in-your-city-cards .slick-next')
        .each(function () {
          window.jQuery(this).attr('tabindex', window.jQuery(this).hasClass('slick-disabled') ? '-1' : '0');
        });
    };

    const updateSlideTabindex = () => {
      block.querySelectorAll('.contractors-in-your-city-cards .slick-slide').forEach((slide) => {
        slide.setAttribute('tabindex', slide.getAttribute('aria-hidden') === 'true' ? '-1' : '0');
      });
    };

    updateArrowTabindex();
    updateSlideTabindex();

    $carousel.off('beforeChange afterChange').on('beforeChange afterChange', function () {
      updateArrowTabindex();
    });

    $carousel.off('init afterChange').on('init afterChange', function () {
      updateSlideTabindex();
    });

    window.jQuery(window).off('keyup.contractorsVariant2').on('keyup.contractorsVariant2', function (e) {
      if (!window.jQuery(e.target).hasClass('contractors-in-your-city-card')) return;
      const code = e.keyCode ? e.keyCode : e.which;
      if (code !== 9) return;
      const currentSlide = $carousel.slick('slickCurrentSlide');
      const focusedIndex = window.jQuery(e.target).attr('data-slick-index');
      if (currentSlide != focusedIndex) $carousel.slick('slickGoTo', focusedIndex);
    });
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      start();
    });
  });
}

export default async function decorate(block) {
  buildVariant2(block);

  const jqueryJs = new URL('./resources/libraries/jquery.min.js', import.meta.url).href;
  const slickJs = new URL('./resources/libraries/slick.min.js', import.meta.url).href;

  await loadScript(jqueryJs);
  await loadScript(slickJs);

  window.jQuery = window.jQuery || window.$;
  window.$ = window.$ || window.jQuery;

  initVariant2(block);
}
