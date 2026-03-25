async function waitForSwiper(maxRetries = 10, delay = 300) {
  for (let i = 0; i < maxRetries; i++) {
    if (window.Swiper) return window.Swiper;
    if (window.loadSwiper) {
      const Swiper = await window.loadSwiper();
      if (Swiper) return Swiper;
    }
    // wait before retry
    await new Promise((res) => setTimeout(res, delay));
  }
  console.warn("Swiper not available after retries");
  return null;
}

export default async function decorate(block) {
  const carousel = block;
  const mobileHTML = [...carousel.children]; // snapshot
  const desktopHTML = [...carousel.children]; // for desktop restore

  const Swiper = await waitForSwiper();
  if (!Swiper) return;

  let swiperInstance = null;

  function initSwiper() {
    const wrapper = document.createElement("div");
    const swiperContainer = document.createElement("div");
    wrapper.classList.add("swiper-wrapper");

    carousel.innerHTML = "";

    mobileHTML.forEach((child) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.classList.add("swiper-slide");

      // clone the nodes so originals remain intact
      const img = child.children[1]?.cloneNode(true);
      const body = child.children[2]?.cloneNode(true);

      if (img) {
        img.classList.add("card-img");
        card.appendChild(img);
      }

      if (body) {
        body.classList.add("card-body");
        card.appendChild(body);
      }

      wrapper.appendChild(card);
    });

    swiperContainer.classList.add("swiper");
    swiperContainer.appendChild(wrapper);
    carousel.appendChild(swiperContainer);

    // const nextBtn = document.createElement("div");
    // nextBtn.classList.add("swiper-button-next");
    // const prevBtn = document.createElement("div");
    // prevBtn.classList.add("swiper-button-prev");
    const pagination = document.createElement("div");
    pagination.classList.add("swiper-pagination");
    carousel.append(pagination);

    swiperInstance = new Swiper(swiperContainer, {
      loop: true,
      slidesPerView: 1.2,
      spaceBetween: 10,
      pagination: { el: ".swiper-pagination", clickable: true },
      autoplay: false,
    });
  }

  function destroySwiper() {
    if (swiperInstance) {
      swiperInstance.destroy(true, true);
      swiperInstance = null;
    }
    carousel.classList.remove("swiper");
    carousel.innerHTML = "";
    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card-container");

    // restore original children with desktop structure
    desktopHTML.forEach((child) => {
      const card = document.createElement("div");
      card.classList.add("card");

      // clone the nodes so originals remain intact
      const img = child.children[0]?.cloneNode(true);
      const body = child.children[2]?.cloneNode(true);

      if (img) img.classList.add("card-img");
      if (body) body.classList.add("card-body");

      if (img) card.appendChild(img);
      if (body) card.appendChild(body);

      cardContainer.appendChild(card);
    });

    carousel.appendChild(cardContainer);
  }

  function toggleSwiper() {
    if (window.innerWidth <= 768) {
      if (!swiperInstance) {
        initSwiper(); // mobile: init swiper
      }
    } else {
      destroySwiper(); // desktop: always restore
    }
  }

  toggleSwiper();
  window.addEventListener("resize", toggleSwiper);
}
