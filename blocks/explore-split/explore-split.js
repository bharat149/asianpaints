export default function decorate(block) {
  // Add wrapper class to parent section for styling the title
  const section = block.closest('.section');
  if (section) {
    section.classList.add('explore-split-wrapper');
  }

  const row = block.querySelector(':scope > div');
  if (!row) return;

  const columns = [...row.children];
  if (columns.length < 2) return;

  // First column is Textures (three-column layout)
  const texturesCol = columns[0];
  texturesCol.classList.add('explore-split-section', 'three-column');

  const texturesHeading = texturesCol.querySelector('h3');
  const texturesImages = [...texturesCol.querySelectorAll('img')];

  if (texturesHeading && texturesImages.length > 0) {
    // Create text section with title and button
    const textSection = document.createElement('div');
    textSection.className = 'explore-split-text-section';

    const title = document.createElement('h3');
    title.textContent = texturesHeading.textContent;

    const viewAllBtn = document.createElement('a');
    viewAllBtn.href = 'https://www.asianpaints.com/products/paints-and-textures/interior-walls/royale-play.html';
    viewAllBtn.className = 'explore-split-view-all';
    viewAllBtn.innerHTML = 'View all <span>→</span>';

    textSection.appendChild(title);
    textSection.appendChild(viewAllBtn);

    // Create grid for images with mixed heights
    const grid = document.createElement('div');
    grid.className = 'explore-split-grid mixed-height';

    texturesImages.forEach((img, index) => {
      const card = document.createElement('div');
      card.className = `explore-split-card item-${index + 1}`;
      card.appendChild(img.cloneNode(true));
      grid.appendChild(card);
    });

    // Clear and rebuild
    texturesCol.innerHTML = '';
    texturesCol.appendChild(textSection);
    texturesCol.appendChild(grid);
  }

  // Second column is Wallpapers (two-column layout)
  const wallpapersCol = columns[1];
  wallpapersCol.classList.add('explore-split-section', 'two-column');

  const wallpapersHeading = wallpapersCol.querySelector('h3');
  const wallpapersImages = [...wallpapersCol.querySelectorAll('img')];

  if (wallpapersHeading && wallpapersImages.length > 0) {
    // Create text section with title and button
    const textSection = document.createElement('div');
    textSection.className = 'explore-split-text-section';

    const title = document.createElement('h3');
    title.textContent = wallpapersHeading.textContent;

    const viewAllBtn = document.createElement('a');
    viewAllBtn.href = 'https://www.asianpaints.com/products/wall-coverings.html';
    viewAllBtn.className = 'explore-split-view-all';
    viewAllBtn.innerHTML = 'View all <span>→</span>';

    textSection.appendChild(title);
    textSection.appendChild(viewAllBtn);

    // Create grid for images
    const grid = document.createElement('div');
    grid.className = 'explore-split-grid mixed-height';

    wallpapersImages.forEach((img, index) => {
      const card = document.createElement('div');
      card.className = `explore-split-card item-${index + 1}`;
      card.appendChild(img.cloneNode(true));
      grid.appendChild(card);
    });

    // Clear and rebuild
    wallpapersCol.innerHTML = '';
    wallpapersCol.appendChild(textSection);
    wallpapersCol.appendChild(grid);
  }

  // Move columns to be direct children of block
  block.append(texturesCol, wallpapersCol);
  row.remove();
}
