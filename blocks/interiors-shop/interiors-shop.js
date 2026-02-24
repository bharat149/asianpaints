export default function decorate(block) {
  // Remove dark-blue class from parent section if present (block has its own background)
  const section = block.closest('.section');
  if (section) {
    section.classList.remove('dark-blue');
  }

  // Get heading and description
  const heading = block.querySelector('h2, h3, h4');
  const description = block.querySelector('p');

  // Get all rows after header
  const rows = [...block.querySelectorAll(':scope > div')];

  // Create main grid (3 columns)
  const wrapper = document.createElement('div');
  wrapper.className = 'interiors-shop-grid';

  // Create left column (text + first card)
  const leftColumn = document.createElement('div');
  leftColumn.className = 'interiors-shop-left-column';

  // Create container for text content
  const textDiv = document.createElement('div');
  textDiv.className = 'interiors-shop-text';

  if (heading) {
    heading.classList.add('interiors-shop-heading');
    textDiv.appendChild(heading.cloneNode(true));
  }

  if (description) {
    description.classList.add('interiors-shop-description');
    textDiv.appendChild(description.cloneNode(true));
  }

  leftColumn.appendChild(textDiv);

  // Collect all cards
  const cards = [];

  // Get all service cards (skip first row which has heading/description)
  rows.slice(1).forEach((row) => {
    const cells = [...row.children];

    cells.forEach((cell) => {
      const img = cell.querySelector('img');
      const title = cell.querySelector('strong');
      const desc = cell.querySelector('em');
      const link = cell.querySelector('a');

      if (img || title) {
        const card = document.createElement('div');
        card.className = 'interiors-shop-card';

        if (img) {
          const imgDiv = document.createElement('div');
          imgDiv.className = 'interiors-shop-card-image';
          imgDiv.appendChild(img.cloneNode(true));
          card.appendChild(imgDiv);
        }

        // Create content wrapper for text and button
        const contentDiv = document.createElement('div');
        contentDiv.className = 'interiors-shop-card-content';

        if (title) {
          const titleEl = document.createElement('h5');
          titleEl.textContent = title.textContent;
          contentDiv.appendChild(titleEl);
        }

        if (desc) {
          const descEl = document.createElement('p');
          descEl.textContent = desc.textContent;
          contentDiv.appendChild(descEl);
        }

        if (link) {
          const btn = document.createElement('a');
          btn.href = link.href;
          btn.className = 'interiors-shop-button';
          btn.textContent = link.textContent || 'Explore now';
          btn.innerHTML = `${btn.textContent} <span class="arrow">→</span>`;
          contentDiv.appendChild(btn);
        }

        card.appendChild(contentDiv);
        cards.push(card);
      }
    });
  });

  // Clear and rebuild block
  block.innerHTML = '';

  // Add first card to left column (under text)
  if (cards.length > 0) {
    leftColumn.appendChild(cards[0]);
  }
  wrapper.appendChild(leftColumn);

  // Add second card as middle column (with stagger offset)
  if (cards.length > 1) {
    cards[1].classList.add('card-middle');
    wrapper.appendChild(cards[1]);
  }

  // Add third card as right column (at top)
  if (cards.length > 2) {
    cards[2].classList.add('card-right');
    wrapper.appendChild(cards[2]);
  }

  block.appendChild(wrapper);
}
