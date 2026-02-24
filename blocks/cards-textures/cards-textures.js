export default function decorate(block) {
  const cards = [...block.children];

  cards.forEach((card) => {
    const [nameCell, contentCell] = card.children;

    // Get the name/title
    const name = nameCell?.textContent?.trim() || '';

    // Get content from second cell - support two images: background + packshot
    const pictures = contentCell?.querySelectorAll('picture') || [];
    const backgroundPicture = pictures[0]; // First image is background texture
    const packshotPicture = pictures[1]; // Second image is paint bucket packshot
    const paragraphs = contentCell?.querySelectorAll('p') || [];
    let description = '';
    let link = null;

    paragraphs.forEach((p) => {
      const anchor = p.querySelector('a');
      if (anchor) {
        link = anchor;
      } else if (p.textContent.trim() && !p.querySelector('picture')) {
        description = p.textContent.trim();
      }
    });

    // Clear the card
    card.innerHTML = '';
    card.className = 'cards-textures-card';

    // Create background image container (texture image)
    if (backgroundPicture) {
      const bgContainer = document.createElement('div');
      bgContainer.className = 'card-background';
      bgContainer.appendChild(backgroundPicture);
      card.appendChild(bgContainer);
    }

    // Create card name (always visible at bottom)
    const cardName = document.createElement('div');
    cardName.className = 'card-name';
    cardName.textContent = name;
    card.appendChild(cardName);

    // Create hover overlay content
    const hoverContent = document.createElement('div');
    hoverContent.className = 'card-hover-content';

    // Paint bucket/packshot image (shown on hover)
    if (packshotPicture) {
      const bucketContainer = document.createElement('div');
      bucketContainer.className = 'card-bucket';
      bucketContainer.appendChild(packshotPicture);
      hoverContent.appendChild(bucketContainer);
    }

    // Title in hover state
    const hoverTitle = document.createElement('h4');
    hoverTitle.className = 'card-hover-title';
    hoverTitle.textContent = name;
    hoverContent.appendChild(hoverTitle);

    // Description
    if (description) {
      const desc = document.createElement('p');
      desc.className = 'card-description';
      desc.textContent = description;
      hoverContent.appendChild(desc);
    }

    // View Details button
    if (link) {
      const btn = document.createElement('a');
      btn.className = 'card-button';
      btn.href = link.href;
      btn.innerHTML = `${link.textContent} <span class="arrow">→</span>`;
      hoverContent.appendChild(btn);
    }

    card.appendChild(hoverContent);

    // Make entire card clickable
    if (link) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        if (!e.target.closest('a')) {
          window.location.href = link.href;
        }
      });
    }
  });
}
