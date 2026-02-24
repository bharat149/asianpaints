export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const columns = [...row.children];
  if (columns.length < 2) return;

  // First column is text content
  const textCol = columns[0];
  textCol.classList.add('color-gallery-text');

  // Second column contains carousel images
  const imagesCol = columns[1];

  // Create carousel structure
  const carouselCol = document.createElement('div');
  carouselCol.className = 'color-gallery-carousel';

  const carouselContainer = document.createElement('div');
  carouselContainer.className = 'color-gallery-carousel-container';

  const carouselTrack = document.createElement('div');
  carouselTrack.className = 'color-gallery-carousel-track';

  // Get all images from the images column
  const pictures = [...imagesCol.querySelectorAll('picture')];

  if (pictures.length > 0) {
    pictures.forEach((picture) => {
      const slide = document.createElement('div');
      slide.className = 'color-gallery-slide';

      // Clone the picture element
      const clonedPicture = picture.cloneNode(true);
      const img = clonedPicture.querySelector('img');
      if (img) {
        img.loading = 'lazy';
      }

      slide.appendChild(clonedPicture);
      carouselTrack.appendChild(slide);
    });

    carouselContainer.appendChild(carouselTrack);

    // Add navigation buttons
    const prevButton = document.createElement('button');
    prevButton.className = 'color-gallery-nav color-gallery-prev';
    prevButton.setAttribute('aria-label', 'Previous');

    const nextButton = document.createElement('button');
    nextButton.className = 'color-gallery-nav color-gallery-next';
    nextButton.setAttribute('aria-label', 'Next');

    carouselContainer.appendChild(prevButton);
    carouselContainer.appendChild(nextButton);
    carouselCol.appendChild(carouselContainer);

    // Replace the images column with carousel
    imagesCol.replaceWith(carouselCol);

    // Carousel logic
    const slides = carouselTrack.querySelectorAll('.color-gallery-slide');
    const totalSlides = slides.length;

    if (totalSlides > 0) {
      let currentIndex = 0;

      function getSlideWidth() {
        const slide = slides[0];
        if (!slide) return 276; // 260px + 16px gap
        const width = slide.offsetWidth;
        const gap = 16; // gap from CSS
        return width + gap;
      }

      function getVisibleSlides() {
        const containerWidth = carouselCol.offsetWidth;
        const slideWidth = getSlideWidth();
        return Math.max(1, Math.floor(containerWidth / slideWidth));
      }

      function updateCarousel() {
        const slideWidth = getSlideWidth();
        const visibleSlides = getVisibleSlides();
        const maxIndex = Math.max(0, totalSlides - visibleSlides);

        // Clamp currentIndex
        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex > maxIndex) currentIndex = maxIndex;

        const translateX = currentIndex * slideWidth;
        carouselTrack.style.transform = `translateX(-${translateX}px)`;

        // Update button states
        prevButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex >= maxIndex;

        // Visual feedback for disabled state
        prevButton.style.opacity = currentIndex === 0 ? '0.4' : '1';
        nextButton.style.opacity = currentIndex >= maxIndex ? '0.4' : '1';
      }

      prevButton.addEventListener('click', () => {
        currentIndex -= 1;
        updateCarousel();
      });

      nextButton.addEventListener('click', () => {
        currentIndex += 1;
        updateCarousel();
      });

      // Initialize after a short delay to ensure styles are applied
      setTimeout(updateCarousel, 100);

      // Handle resize
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateCarousel, 100);
      });
    }
  }

  // Add mobile CTA below carousel
  const mobileCta = document.createElement('div');
  mobileCta.className = 'color-gallery-mobile-cta';
  const ctaLink = textCol.querySelector('a');
  if (ctaLink) {
    const mobileLink = ctaLink.cloneNode(true);
    mobileCta.appendChild(mobileLink);
    block.appendChild(mobileCta);
  }
}
