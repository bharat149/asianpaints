function getSwiperClass() {
  if (window.Swiper) return Promise.resolve(window.Swiper);
  if (window.loadSwiper) return window.loadSwiper();

  console.warn("Swiper loader is not available");
  return Promise.resolve(null);
}

function getImage(col) {
  return col?.querySelector("picture")?.cloneNode(true) || null;
}

function getVideo(url) {
  if (!url) return null;

  const video = document.createElement("video");
  video.src = url;
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;

  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");

  return video;
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  block.classList.add("swiper");

  const wrapper = document.createElement("div");
  wrapper.className = "swiper-wrapper";

  rows.forEach((row, index) => {
    const cols = [...row.children];

    const desktopImg = getImage(cols[0]);
    const mobileImg = getImage(cols[1]);

    const desktopVideo = cols[2]?.querySelector("a")?.href;
    const mobileVideo = cols[3]?.querySelector("a")?.href;

    const ctaText = cols[4]?.textContent?.trim();
    const ctaLink = cols[5]?.querySelector("a")?.href;

    const delay = parseInt(cols[6]?.textContent?.trim(), 10) || 5000;

    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.setAttribute("data-swiper-autoplay", delay);
    slide.setAttribute("data-slide", index);

    const mediaWrap = document.createElement("div");
    mediaWrap.className = "hero-media";

    // VIDEO priority
    if (desktopVideo || mobileVideo) {
      const video = getVideo(
        window.innerWidth < 768 ? mobileVideo : desktopVideo,
      );
      if (video) {
        mediaWrap.appendChild(video);
        // ✅ Add sibling div
        const overlay = document.createElement("div");
        overlay.className = "video-overlay"; // your class

        mediaWrap.appendChild(overlay);
      }
    } else {
      const picture =
        window.innerWidth < 768 && mobileImg ? mobileImg : desktopImg;

      if (picture) mediaWrap.appendChild(picture);
    }

    // CTA
    if (ctaText && ctaLink) {
      const cta = document.createElement("a");
      cta.className = "hero-cta";
      cta.href = ctaLink;
      cta.textContent = ctaText;
      mediaWrap.appendChild(cta);
    }

    slide.appendChild(mediaWrap);
    wrapper.appendChild(slide);
  });

  block.innerHTML = "";
  block.appendChild(wrapper);

  // Pagination container
  const paginationEl = document.createElement("div");
  paginationEl.className = "swiper-pagination";
  block.appendChild(paginationEl);

  try {
    const Swiper = await getSwiperClass();
    if (!Swiper) return;

    const swiper = new Swiper(block, {
      slidesPerView: 1,
      speed: 800,
      loop: false,

      effect: "fade",
      fadeEffect: { crossFade: true },

      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        stopOnLastSlide: false,
      },

      pagination: {
        el: paginationEl,
        clickable: true,

        renderBullet: function (index, className) {
          const total = this.snapGrid.length;

          if (index === 0) {
            return `
              <span class="swiper-button-prev custom-arrow"></span>
              <span class="${className}" data-index="${index}"></span>
            `;
          }

          if (index === total - 1) {
            return `
              <span class="${className}" data-index="${index}"></span>
              <span class="swiper-button-next custom-arrow"></span>
            `;
          }

          return `<span class="${className}" data-index="${index}"></span>`;
        },
      },

      on: {
        init(swiper) {
          handleVideo(swiper);
          bindArrowEvents(swiper);
        },

        slideChange(swiper) {
          toggleArrows(swiper);
        },

        slideChangeTransitionStart(swiper) {
          handleVideo(swiper);
        },

        slideChangeTransitionEnd(swiper) {
          toggleArrows(swiper);
        },
      },
    });

    function bindArrowEvents(swiper) {
      paginationEl.addEventListener("click", (e) => {
        const prev = e.target.closest(".swiper-button-prev");
        const next = e.target.closest(".swiper-button-next");
        const bullet = e.target.closest(".swiper-pagination-bullet");

        if (prev) {
          e.preventDefault();
          swiper.slidePrev();
        }

        if (next) {
          e.preventDefault();
          swiper.slideNext();
        }

        if (bullet) {
          const index = parseInt(bullet.dataset.index, 10);
          if (!Number.isNaN(index)) {
            e.preventDefault();
            swiper.slideTo(index, 0);
          }
        }
      });
    }

    function toggleArrows(swiper) {
      const prevEl = paginationEl.querySelector(".swiper-button-prev");
      const nextEl = paginationEl.querySelector(".swiper-button-next");

      if (!prevEl || !nextEl) return;

      const current = swiper.activeIndex;
      const last = swiper.slides.length - 1;

      if (current === 0) {
        prevEl.classList.add("swiper-button-disabled");
      } else {
        prevEl.classList.remove("swiper-button-disabled");
      }

      if (current === last) {
        nextEl.classList.add("swiper-button-disabled");
      } else {
        nextEl.classList.remove("swiper-button-disabled");
      }
    }

    function handleVideo(swiper) {
      block.querySelectorAll("video").forEach((v) => v.pause());

      const activeVideo = block.querySelector(".swiper-slide-active video");
      if (activeVideo) activeVideo.play();
    }

    block.heroSwiper = swiper;
  } catch (e) {
    console.error("Swiper init failed", e);
  }
}
