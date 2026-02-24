export default function decorate(block) {
  const rows = [...block.children];

  // Create cards container
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'cards-action-container';

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const card = document.createElement('div');
    card.className = 'cards-action-card';

    // First column - image
    const imageCol = cols[0];
    const picture = imageCol.querySelector('picture');
    if (picture) {
      const imageWrapper = document.createElement('div');
      imageWrapper.className = 'cards-action-image';
      imageWrapper.appendChild(picture.cloneNode(true));
      card.appendChild(imageWrapper);
    }

    // Second column - content (title, description, CTA)
    const contentCol = cols[1];
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'cards-action-content';

    // Get title from strong tag
    const strong = contentCol.querySelector('strong');
    if (strong) {
      const title = document.createElement('h3');
      title.className = 'cards-action-title';
      title.textContent = strong.textContent;
      contentWrapper.appendChild(title);
    }

    // Get description - look for text nodes inside the content
    // The content may be wrapped in a <p> tag by AEM
    const paragraph = contentCol.querySelector('p');
    const searchNode = paragraph || contentCol;
    let descText = '';

    // Iterate through child nodes looking for text nodes
    [...searchNode.childNodes].forEach((node) => {
      // Check for text nodes (nodeType 3)
      if (node.nodeType === 3) {
        const text = node.textContent.trim();
        if (text) {
          descText += text + ' ';
        }
      }
    });

    descText = descText.trim();
    if (descText) {
      const desc = document.createElement('p');
      desc.className = 'cards-action-description';
      desc.textContent = descText;
      contentWrapper.appendChild(desc);
    }

    // Get CTA link
    const link = contentCol.querySelector('a');
    if (link) {
      const cta = document.createElement('a');
      cta.className = 'cards-action-cta';
      cta.href = link.href;
      cta.textContent = link.textContent;
      contentWrapper.appendChild(cta);
    }

    card.appendChild(contentWrapper);
    cardsContainer.appendChild(card);
  });

  // Clear block and add new structure
  block.textContent = '';
  block.appendChild(cardsContainer);
}
