export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const columns = [...row.children];
  console.log("columns", columns);
  if (columns.length < 3) return;

  // First column is text content
  const textCol = columns[0];
  textCol.classList.add('services-grid-text');

  // Second column contains service images in a grid
  const mobileCol = columns[1];

  // Third column contains service images in a grid
  const desktopCol = columns[2];

  const mobileImages = [...mobileCol.querySelectorAll('img')];
  const desktopImages = [...desktopCol.querySelectorAll('img')];

  const serviceNames = {
    Interior: 'Interior wall paint',
    Exterior: 'Exterior wall paint',
    Waterproofing: 'Waterproofing Services',
    'Wood Finish': 'Wood Solutions',
  };

  const servicesCol = document.createElement('div');
  servicesCol.className = 'services-grid-images';

  const gridContainer = document.createElement('div');
  gridContainer.className = 'services-grid-container';

  const totalCards = Math.max(mobileImages.length, desktopImages.length);

  for (let i = 0; i < totalCards; i += 1) {
    const mobileImg = mobileImages[i];
    const desktopImg = desktopImages[i];

    if (!mobileImg && !desktopImg) continue;

    const referenceImg = desktopImg || mobileImg;
    const altText = referenceImg?.alt || 'Service';
    const serviceName = serviceNames[altText] || altText;

    const card = document.createElement('a');
    card.className = 'services-grid-card';
    card.href = '#';

    // Image wrapper
    const imgContainer = document.createElement('div');
    imgContainer.className = 'services-grid-card-image';

    // Picture element
    const picture = document.createElement('picture');

    if (mobileImg?.src) {
      const mobileSource = document.createElement('source');
      mobileSource.media = '(max-width: 767px)';
      mobileSource.srcset = mobileImg.src;
      picture.appendChild(mobileSource);
    }

    if (desktopImg?.src) {
      const desktopSource = document.createElement('source');
      desktopSource.media = '(min-width: 768px)';
      desktopSource.srcset = desktopImg.src;
      picture.appendChild(desktopSource);
    }

    const img = document.createElement('img');
    img.src = desktopImg?.src || mobileImg?.src || '';
    img.alt = altText;
    img.loading = 'lazy';

    if (desktopImg) {
      img.width = desktopImg.width || '';
      img.height = desktopImg.height || '';
    } else if (mobileImg) {
      img.width = mobileImg.width || '';
      img.height = mobileImg.height || '';
    }

    picture.appendChild(img);
    imgContainer.appendChild(picture);

    // Text
    const textContainer = document.createElement('div');
    textContainer.className = 'services-grid-card-text';
    textContainer.innerHTML = `<span>${serviceName}</span>`;

    // Arrow
    const arrow = document.createElement('div');
    arrow.className = 'services-grid-card-arrow';
    arrow.innerHTML = '↗';

    card.appendChild(imgContainer);
    card.appendChild(textContainer);
    card.appendChild(arrow);

    gridContainer.appendChild(card);
  }

  servicesCol.appendChild(gridContainer);

  // Replace block content
  block.innerHTML = '';
  block.append(textCol, servicesCol);

  row.remove();
}