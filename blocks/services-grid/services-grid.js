export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const columns = [...row.children];
  if (columns.length < 2) return;

  // First column is text content
  const textCol = columns[0];
  textCol.classList.add('services-grid-text');

  // Second column contains service images in a grid
  const servicesCol = columns[1];
  if (servicesCol) {
    servicesCol.classList.add('services-grid-images');

    // Get all images
    const images = [...servicesCol.querySelectorAll('img')];

    // Map alt text to full service names
    const serviceNames = {
      Interior: 'Interior wall paint',
      Exterior: 'Exterior wall paint',
      Waterproofing: 'Waterproofing Services',
      'Wood Finish': 'Wood Solutions',
    };

    if (images.length > 0) {
      // Create grid container
      const gridContainer = document.createElement('div');
      gridContainer.className = 'services-grid-container';

      // Wrap each image in a card with text and arrow
      images.forEach((img) => {
        const card = document.createElement('a');
        card.className = 'services-grid-card';
        card.href = '#'; // Could be linked to actual service pages

        // Image container
        const imgContainer = document.createElement('div');
        imgContainer.className = 'services-grid-card-image';
        imgContainer.appendChild(img.cloneNode(true));

        // Text container
        const textContainer = document.createElement('div');
        textContainer.className = 'services-grid-card-text';
        const altText = img.alt || 'Service';
        const serviceName = serviceNames[altText] || altText;
        textContainer.innerHTML = `<span>${serviceName}</span>`;

        // Arrow
        const arrow = document.createElement('div');
        arrow.className = 'services-grid-card-arrow';
        arrow.innerHTML = '↗';

        card.appendChild(imgContainer);
        card.appendChild(textContainer);
        card.appendChild(arrow);
        gridContainer.appendChild(card);
      });

      // Clear services column and add grid
      servicesCol.innerHTML = '';
      servicesCol.appendChild(gridContainer);
    }
  }

  // Move columns to be direct children of block (unwrap from row)
  block.append(textCol, servicesCol);
  row.remove();
}
