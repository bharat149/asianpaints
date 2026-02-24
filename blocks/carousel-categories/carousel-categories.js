/**
 * Carousel Categories Block - Two-column tab layout
 * Left: Vertical category tabs with heading
 * Right: Large image display for selected category
 */

export default function decorate(block) {
  // Extract categories from block rows
  const categories = [];
  [...block.children].forEach((row) => {
    const cols = [...row.children];
    if (cols.length >= 2) {
      const imgCol = cols[0];
      const textCol = cols[1];

      const img = imgCol.querySelector('img');
      const name = textCol.textContent.trim();

      if (img && name) {
        categories.push({
          name,
          imgSrc: img.src,
          imgAlt: img.alt || name,
        });
      }
    }
  });

  // Clear block and rebuild
  block.textContent = '';

  // Create main container
  const container = document.createElement('div');
  container.className = 'carousel-categories-container';

  // Left column - Tabs
  const leftCol = document.createElement('div');
  leftCol.className = 'carousel-categories-left';

  const heading = document.createElement('h2');
  heading.className = 'carousel-categories-heading';
  heading.textContent = 'Categories We Offer';
  leftCol.appendChild(heading);

  const tabList = document.createElement('div');
  tabList.className = 'carousel-categories-tabs';
  tabList.setAttribute('role', 'tablist');

  categories.forEach((category, index) => {
    const tab = document.createElement('button');
    tab.className = 'carousel-categories-tab';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    tab.setAttribute('data-index', index);
    tab.textContent = category.name;

    if (index === 0) {
      tab.classList.add('active');
    }

    tab.addEventListener('click', () => {
      // Update active tab
      tabList.querySelectorAll('.carousel-categories-tab').forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update displayed image
      updateImage(index);
    });

    tabList.appendChild(tab);
  });

  leftCol.appendChild(tabList);

  // Right column - Image display
  const rightCol = document.createElement('div');
  rightCol.className = 'carousel-categories-right';

  const imageContainer = document.createElement('div');
  imageContainer.className = 'carousel-categories-image-container';

  const mainImage = document.createElement('img');
  mainImage.className = 'carousel-categories-image';
  if (categories.length > 0) {
    mainImage.src = categories[0].imgSrc;
    mainImage.alt = categories[0].imgAlt;
  }
  mainImage.loading = 'lazy';

  imageContainer.appendChild(mainImage);

  // Dot indicators
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-categories-dots';

  categories.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = 'carousel-categories-dot';
    if (index === 0) {
      dot.classList.add('active');
    }
    dot.setAttribute('data-index', index);
    dot.addEventListener('click', () => {
      // Update active tab
      tabList.querySelectorAll('.carousel-categories-tab').forEach((t, i) => {
        t.classList.toggle('active', i === index);
        t.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
      // Update displayed image
      updateImage(index);
    });
    dotsContainer.appendChild(dot);
  });

  imageContainer.appendChild(dotsContainer);
  rightCol.appendChild(imageContainer);

  // Update image function
  function updateImage(index) {
    if (categories[index]) {
      mainImage.src = categories[index].imgSrc;
      mainImage.alt = categories[index].imgAlt;

      // Update dots
      dotsContainer.querySelectorAll('.carousel-categories-dot').forEach((d, i) => {
        d.classList.toggle('active', i === index);
      });
    }
  }

  // Assemble
  container.appendChild(leftCol);
  container.appendChild(rightCol);
  block.appendChild(container);
}
