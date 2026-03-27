// Get Swiper instance
async function getSwiper() {
  if (window.Swiper) return window.Swiper;
  if (window.loadSwiper) return window.loadSwiper();

  console.warn('Swiper not available');
  return null;
}

// Desktop: animate each card when that card enters viewport
function createCardObserver($) {
  return new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const $overlay = $(entry.target);
      if ($overlay.data('animated')) return;

      $overlay.data('animated', true);

      const index = $overlay.closest('.card').index();

      setTimeout(() => {
        $overlay.addClass('grow-image-bottom-to-top');
      }, 150 * index);

      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.2,
  });
}

// Mobile: animate all overlays once when whole swiper enters viewport
function createMobileObserver($, $container) {
  return new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      $container.find('.card-overlay').each(function (index) {
        const $overlay = $(this);
        if ($overlay.data('animated')) return;

        $overlay.data('animated', true);

        setTimeout(() => {
          $overlay.addClass('grow-image-bottom-to-top');
        }, 150 * index);
      });

      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.2,
  });
}

export default async function decorate(block) {
  // Wait for jQuery because it is lazy-loaded in EDS
  await window.loadJQuery?.();
  const $ = window.jQuery;

  const $block = $(block);
  const items = $block.children().toArray();

  const Swiper = await getSwiper();
  if (!Swiper) return;

  let swiper = null;
  let cardObserver = null;
  let mobileObserver = null;
  let mode = '';

  const bp = 768;
  const ns = `.carousel-${Date.now()}`;

  function resetObservers() {
    if (cardObserver) {
      cardObserver.disconnect();
      cardObserver = null;
    }

    if (mobileObserver) {
      mobileObserver.disconnect();
      mobileObserver = null;
    }
  }

  function destroySwiper() {
    if (swiper) {
      swiper.destroy(true, true);
      swiper = null;
    }
  }

  function makeCard(child, imgIndex, slide = false) {
    const $child = $(child);

    const $linkWrap = $child.children().eq(3).clone();
    const $a = $linkWrap.find('a').first();
    if (!$a.length) return null;

    const $img = $child.children().eq(imgIndex).clone().addClass('card-img');
    const $body = $child.children().eq(2).clone().addClass('card-body');
    const $overlay = $('<div class="card-overlay"></div>');
    const $card = $(`<div class="card${slide ? ' swiper-slide' : ''}"></div>`);

    $a.empty().append($img, $body);
    $card.append($a, $overlay);

    return $card;
  }

  function renderDesktop() {
    resetObservers();
    $block.empty();

    const $container = $('<div class="card-container"></div>');
    cardObserver = createCardObserver($);

    items.forEach((item) => {
      const $card = makeCard(item, 0, false);
      if ($card) {
        $container.append($card);
        const $overlay = $card.find('.card-overlay');
        if ($overlay.length) cardObserver.observe($overlay[0]);
      }
    });

    $block.append($container);
  }

  function renderMobile() {
    resetObservers();
    $block.empty();

    const $swiper = $('<div class="swiper"></div>');
    const $wrapper = $('<div class="swiper-wrapper"></div>');
    const $pagination = $('<div class="swiper-pagination"></div>');

    let slideCount = 0;

    items.forEach((item) => {
      const $card = makeCard(item, 1, true);
      if ($card) {
        $wrapper.append($card);
        slideCount += 1;
      }
    });

    $swiper.append($wrapper);
    $block.append($swiper, $pagination);

    // Init swiper after DOM is appended
    setTimeout(() => {
      swiper = new Swiper($swiper[0], {
        loop: slideCount > 1,
        slidesPerView: 1.2,
        spaceBetween: 10,
        pagination: {
          el: $pagination[0],
          clickable: true,
        },
        autoplay: false,
      });

      swiper.update();

      // Animate all mobile cards once when whole swiper enters viewport
      mobileObserver = createMobileObserver($, $swiper);
      mobileObserver.observe($swiper[0]);
    }, 0);
  }

  function update() {
    const nextMode = window.innerWidth <= bp ? 'mobile' : 'desktop';
    if (nextMode === mode) return;

    destroySwiper();

    if (nextMode === 'mobile') {
      renderMobile();
    } else {
      renderDesktop();
    }

    mode = nextMode;
  }

  update();

  $(window)
    .off(`resize${ns}`)
    .on(`resize${ns}`, update);
}