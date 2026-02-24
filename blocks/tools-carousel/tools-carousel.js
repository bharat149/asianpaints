export default function decorate(block) {
  // Add wrapper class to parent section
  const section = block.closest('.section');
  if (section) {
    section.classList.add('tools-carousel-wrapper');
  }

  const row = block.querySelector(':scope > div');
  if (!row) return;

  const columns = [...row.children];
  if (columns.length < 2) return;

  // First column is heading
  const headingCol = columns[0];
  headingCol.classList.add('tools-carousel-heading');

  // Second column contains carousel items
  const carouselCol = columns[1];
  if (carouselCol) {
    carouselCol.classList.add('tools-carousel-items');

    // Get all images and headings
    const images = [...carouselCol.querySelectorAll('img')];
    const headings = [...carouselCol.querySelectorAll('h3')];

    if (images.length > 0 || headings.length > 0) {
      // Create carousel structure
      const carouselContainer = document.createElement('div');
      carouselContainer.className = 'tools-carousel-container';

      const carouselTrack = document.createElement('div');
      carouselTrack.className = 'tools-carousel-track';

      // Create slides from images and headings
      const items = Math.max(images.length, headings.length);
      for (let i = 0; i < items; i++) {
        const slide = document.createElement('div');
        slide.className = 'tools-carousel-slide';
        if (i === 0) slide.classList.add('active');

        const heading = headings[i];
        const img = images[i];

        // Add image (will be hidden by CSS)
        if (img) {
          slide.appendChild(img.cloneNode(true));
        }

        // Add title
        if (heading) {
          const title = document.createElement('div');
          title.className = 'tools-carousel-title';
          title.textContent = heading.textContent;
          slide.appendChild(title);
        }

        carouselTrack.appendChild(slide);
      }

      carouselContainer.appendChild(carouselTrack);

      // Create navigation container (top right)
      const navContainer = document.createElement('div');
      navContainer.className = 'tools-carousel-nav-container';

      const prevButton = document.createElement('button');
      prevButton.className = 'tools-carousel-nav tools-carousel-prev';
      prevButton.setAttribute('aria-label', 'Previous');
      prevButton.innerHTML = '←';

      const nextButton = document.createElement('button');
      nextButton.className = 'tools-carousel-nav tools-carousel-next';
      nextButton.setAttribute('aria-label', 'Next');
      nextButton.innerHTML = '→';

      navContainer.appendChild(prevButton);
      navContainer.appendChild(nextButton);

      // Clear carousel column and add container
      carouselCol.innerHTML = '';
      carouselCol.appendChild(carouselContainer);

      // Add nav container to the section wrapper (for absolute positioning at page right)
      if (section) {
        section.appendChild(navContainer);
      } else {
        block.appendChild(navContainer);
      }

      // Carousel logic
      let currentIndex = 0;
      const slides = carouselTrack.querySelectorAll('.tools-carousel-slide');
      const totalSlides = slides.length;
      const slideWidth = 280; // card width
      const gap = 16; // gap between cards

      function getMaxIndex() {
        const containerWidth = carouselContainer.offsetWidth;
        const visibleSlides = Math.floor(containerWidth / (slideWidth + gap));
        return Math.max(0, totalSlides - visibleSlides);
      }

      function showSlide(index) {
        const maxIndex = getMaxIndex();
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        const offset = currentIndex * (slideWidth + gap);
        carouselTrack.style.transform = `translateX(-${offset}px)`;
      }

      prevButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showSlide(currentIndex - 1);
      });

      nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showSlide(currentIndex + 1);
      });

      // Handle resize
      window.addEventListener('resize', () => {
        showSlide(currentIndex);
      });

      // Initialize
      showSlide(0);
    }
  }

  // Move columns to be direct children of block
  block.append(headingCol, carouselCol);
  row.remove();
}
