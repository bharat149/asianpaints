export default function decorate(block) {
  const section = block.closest('.section');

  // Look for heading inside block first, then in preceding sibling
  let heading = block.querySelector('h2');
  if (!heading && section) {
    // Check for heading in default content before the block
    const defaultContent = section.querySelector('.default-content-wrapper h2');
    if (defaultContent) {
      heading = defaultContent;
    }
  }

  // Get all rows
  const rows = [...block.querySelectorAll(':scope > div')];
  if (rows.length === 0) return;

  // Create header with title and nav
  const header = document.createElement('div');
  header.className = 'designer-collections-header';

  if (heading) {
    const titleEl = document.createElement('h2');
    titleEl.className = 'designer-collections-title';
    titleEl.textContent = heading.textContent;
    header.appendChild(titleEl);
    // Hide original heading if it's outside the block
    if (!block.contains(heading)) {
      heading.style.display = 'none';
    }
  }

  // Create navigation wrapper
  const navWrapper = document.createElement('div');
  navWrapper.className = 'designer-collections-nav-wrapper';

  const prevButton = document.createElement('button');
  prevButton.className = 'designer-collections-nav designer-collections-prev';
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.innerHTML = '←';

  const nextButton = document.createElement('button');
  nextButton.className = 'designer-collections-nav designer-collections-next';
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.innerHTML = '→';

  navWrapper.appendChild(prevButton);
  navWrapper.appendChild(nextButton);
  header.appendChild(navWrapper);

  // Create carousel structure
  const carouselContainer = document.createElement('div');
  carouselContainer.className = 'designer-collections-carousel';

  const carouselTrack = document.createElement('div');
  carouselTrack.className = 'designer-collections-track';

  // Get the first (and only) row which contains all the cells
  const dataRow = rows[0];
  if (!dataRow) return;

  // Get all cells (columns) from the data row - each is a collection
  const cells = [...dataRow.children];

  cells.forEach((cell, cellIndex) => {
    const card = document.createElement('div');
    card.className = 'designer-collections-card';
    if (cellIndex === 0) card.classList.add('active');

    // Extract logo, video link, title, and description from cell content
    const logo = cell.querySelector('img');
    // Look for video links - mp4 or webm
    let videoSrc = '';
    let videoLink = cell.querySelector('a[href$=".mp4"]');
    if (!videoLink) {
      videoLink = cell.querySelector('a[href$=".webm"]');
    }
    // Also check for any anchor that contains .mp4 in href or text
    if (!videoLink) {
      const allLinks = cell.querySelectorAll('a');
      allLinks.forEach((link) => {
        if (link.href.includes('.mp4') || link.href.includes('.webm')) {
          videoLink = link;
        }
      });
    }
    // Get video source from link or try plain text
    if (videoLink) {
      videoSrc = videoLink.href;
    } else {
      // Check for plain text URL in paragraphs
      const paragraphs = cell.querySelectorAll('p');
      paragraphs.forEach((p) => {
        const text = p.textContent.trim();
        if (text.includes('.mp4') || text.includes('.webm')) {
          videoSrc = text;
        }
      });
    }
    const title = cell.querySelector('strong');
    const description = cell.querySelector('em');

    // Add logo
    if (logo) {
      const logoDiv = document.createElement('div');
      logoDiv.className = 'designer-collections-logo';
      logoDiv.appendChild(logo.cloneNode(true));
      card.appendChild(logoDiv);
    }

    // Add video/image
    const mediaDiv = document.createElement('div');
    mediaDiv.className = 'designer-collections-image';

    if (videoSrc) {
      const video = document.createElement('video');
      video.setAttribute('playsinline', '');
      video.setAttribute('muted', '');
      video.setAttribute('loop', '');
      video.setAttribute('autoplay', '');
      video.src = videoSrc;
      video.className = 'designer-collections-video';
      mediaDiv.appendChild(video);
    }
    card.appendChild(mediaDiv);

    // Add content
    const content = document.createElement('div');
    content.className = 'designer-collections-content';

    if (title) {
      const titleEl = document.createElement('h3');
      titleEl.textContent = title.textContent;
      content.appendChild(titleEl);
    }

    if (description) {
      const descEl = document.createElement('p');
      descEl.textContent = description.textContent;
      content.appendChild(descEl);
    }

    card.appendChild(content);
    carouselTrack.appendChild(card);
  });

  carouselContainer.appendChild(carouselTrack);

  // Clear block content and add header + carousel
  block.innerHTML = '';
  block.appendChild(header);
  block.appendChild(carouselContainer);

  // Carousel logic
  let currentSlide = 0;
  const cards = carouselTrack.querySelectorAll('.designer-collections-card');
  const totalSlides = cards.length;

  function getCardsPerView() {
    if (window.innerWidth >= 1200) return 4;
    if (window.innerWidth >= 900) return 3;
    if (window.innerWidth >= 600) return 2;
    return 1;
  }

  function showSlide(index) {
    const cardsPerView = getCardsPerView();
    cards.forEach((card) => card.classList.remove('active'));

    const offset = Math.min(index, Math.max(0, totalSlides - cardsPerView));
    const cardWidth = cards[0].offsetWidth;
    const gap = 24;
    carouselTrack.style.transform = `translateX(-${offset * (cardWidth + gap)}px)`;

    for (let i = 0; i < cardsPerView && (offset + i) < totalSlides; i += 1) {
      cards[offset + i].classList.add('active');
    }

    // Update button states
    prevButton.disabled = offset === 0;
    nextButton.disabled = offset >= totalSlides - cardsPerView;
  }

  prevButton.addEventListener('click', () => {
    const cardsPerView = getCardsPerView();
    currentSlide = Math.max(0, currentSlide - 1);
    showSlide(currentSlide);
  });

  nextButton.addEventListener('click', () => {
    const cardsPerView = getCardsPerView();
    currentSlide = Math.min(totalSlides - cardsPerView, currentSlide + 1);
    showSlide(currentSlide);
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    showSlide(currentSlide);
  });

  // Initial show
  showSlide(0);
}
