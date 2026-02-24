export default function decorate(block) {
  const rows = [...block.children];
  if (!rows || rows.length === 0) return;

  // Get section title from previous sibling h2
  const section = block.closest('.section');
  const sectionTitle = section?.querySelector('h2');
  const titleText = sectionTitle?.textContent || 'Featured Products';

  // Hide original h2
  if (sectionTitle) {
    sectionTitle.style.display = 'none';
  }

  // Create header with title and navigation
  const header = document.createElement('div');
  header.className = 'featured-products-header';

  const title = document.createElement('h2');
  title.className = 'featured-products-title';
  title.textContent = titleText;

  const nav = document.createElement('div');
  nav.className = 'featured-products-nav';

  const prevBtn = document.createElement('button');
  prevBtn.innerHTML = '←';
  prevBtn.setAttribute('aria-label', 'Previous');

  const nextBtn = document.createElement('button');
  nextBtn.innerHTML = '→';
  nextBtn.setAttribute('aria-label', 'Next');

  nav.appendChild(prevBtn);
  nav.appendChild(nextBtn);

  header.appendChild(title);
  header.appendChild(nav);

  // Create carousel
  const carousel = document.createElement('div');
  carousel.className = 'featured-products-carousel';

  const track = document.createElement('div');
  track.className = 'featured-products-track';

  // Process each row as a slide
  rows.forEach((row) => {
    const slide = document.createElement('div');
    slide.className = 'featured-products-slide';

    const cols = [...row.children];

    // First column has the image
    const imageCol = cols[0];
    const picture = imageCol?.querySelector('picture');

    // Second column has the content (title, description, link)
    const contentCol = cols[1];
    const link = contentCol?.querySelector('a');

    if (picture) {
      if (link) {
        // Wrap image in link
        const anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.title = link.textContent || 'View Product';
        anchor.appendChild(picture.cloneNode(true));
        slide.appendChild(anchor);
      } else {
        slide.appendChild(picture.cloneNode(true));
      }
    }

    // Add content overlay (hidden by CSS but available if needed)
    if (contentCol) {
      const content = document.createElement('div');
      content.className = 'featured-products-content';
      content.innerHTML = contentCol.innerHTML;
      slide.appendChild(content);
    }

    track.appendChild(slide);
  });

  carousel.appendChild(track);

  // Clear block and add new structure
  block.innerHTML = '';
  block.appendChild(header);
  block.appendChild(carousel);

  // Carousel logic
  let currentSlide = 0;
  const slides = track.querySelectorAll('.featured-products-slide');
  const totalSlides = slides.length;

  function updateButtons() {
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide >= totalSlides - 1;
  }

  function showSlide(index) {
    currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateButtons();
  }

  prevBtn.addEventListener('click', () => {
    showSlide(currentSlide - 1);
  });

  nextBtn.addEventListener('click', () => {
    showSlide(currentSlide + 1);
  });

  // Auto-play
  let autoPlayInterval;
  const startAutoPlay = () => {
    autoPlayInterval = setInterval(() => {
      if (currentSlide >= totalSlides - 1) {
        showSlide(0);
      } else {
        showSlide(currentSlide + 1);
      }
    }, 4000);
  };

  const stopAutoPlay = () => {
    clearInterval(autoPlayInterval);
  };

  // Start auto-play
  startAutoPlay();

  // Pause on hover
  carousel.addEventListener('mouseenter', stopAutoPlay);
  carousel.addEventListener('mouseleave', startAutoPlay);

  // Initial state
  updateButtons();
}

