/**
 * How It Works Steps Block
 * Displays numbered process steps in a two-column layout
 */

export default function decorate(block) {
  const rows = [...block.children];

  // Create wrapper structure
  const wrapper = document.createElement('div');
  wrapper.className = 'how-it-works-steps-wrapper';

  // First row contains the left column (heading + image)
  if (rows.length > 0) {
    const leftCol = document.createElement('div');
    leftCol.className = 'how-it-works-steps-left';

    const firstRow = rows[0];
    const cols = [...firstRow.children];

    if (cols.length >= 1) {
      // Get heading
      const heading = cols[0].querySelector('h2, h3, p');
      if (heading) {
        const h2 = document.createElement('h2');
        h2.textContent = heading.textContent;
        leftCol.appendChild(h2);
      }
    }

    if (cols.length >= 2) {
      // Get image
      const picture = cols[1].querySelector('picture');
      if (picture) {
        leftCol.appendChild(picture.cloneNode(true));
      }
    }

    wrapper.appendChild(leftCol);
  }

  // Create right column for steps
  const rightCol = document.createElement('div');
  rightCol.className = 'how-it-works-steps-right';

  // Process remaining rows as steps (starting from row 2)
  let stepNumber = 1;
  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    const cols = [...row.children];

    if (cols.length >= 2) {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'how-it-works-step';

      // Step number
      const numberDiv = document.createElement('div');
      numberDiv.className = 'how-it-works-step-number';
      numberDiv.textContent = String(stepNumber).padStart(2, '0');
      stepDiv.appendChild(numberDiv);

      // Step content
      const contentDiv = document.createElement('div');
      contentDiv.className = 'how-it-works-step-content';

      // Title (first column)
      const title = cols[0].textContent.trim();
      const titleEl = document.createElement('h3');
      titleEl.textContent = title;
      contentDiv.appendChild(titleEl);

      // Description (second column)
      const desc = cols[1].textContent.trim();
      const descEl = document.createElement('p');
      descEl.textContent = desc;
      contentDiv.appendChild(descEl);

      stepDiv.appendChild(contentDiv);
      rightCol.appendChild(stepDiv);

      stepNumber += 1;
    }
  }

  wrapper.appendChild(rightCol);

  // Clear and append new structure
  block.textContent = '';
  block.appendChild(wrapper);
}
