/**
 * Pincode Block
 * Variants:
 * - search: Interactive pincode search card for finding contractors
 * - cta: Two-column layout with image + pincode input
 */

function decorateSearch(block) {
  const rows = [...block.children];
  let heading = '';
  let description = '';
  let cardTitle = 'Find a contractor near you!';
  let placeholder = 'Enter pincode';

  if (rows.length >= 1) {
    const headingEl = rows[0].querySelector('h2, h3, strong, p');
    heading = headingEl ? headingEl.textContent.trim() : rows[0].textContent.trim();
  }
  if (rows.length >= 2) {
    const descEl = rows[1].querySelector('p');
    description = descEl ? descEl.textContent.trim() : rows[1].textContent.trim();
  }
  if (rows.length >= 3) {
    const cols = [...rows[2].children];
    if (cols.length >= 1) cardTitle = cols[0].textContent.trim() || cardTitle;
    if (cols.length >= 2) placeholder = cols[1].textContent.trim() || placeholder;
  }

  block.textContent = '';

  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading;
    block.appendChild(h2);
  }
  if (description) {
    const p = document.createElement('p');
    p.textContent = description;
    block.appendChild(p);
  }

  const card = document.createElement('div');
  card.className = 'pincode-search-card';

  const titleEl = document.createElement('div');
  titleEl.className = 'pincode-search-card-title';
  titleEl.textContent = cardTitle;
  card.appendChild(titleEl);

  const inputWrapper = document.createElement('div');
  inputWrapper.className = 'pincode-input-wrapper';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'pincode-input';
  input.placeholder = placeholder;
  input.maxLength = 6;
  input.pattern = '[0-9]*';
  input.inputMode = 'numeric';
  inputWrapper.appendChild(input);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'pincode-search-button';
  button.setAttribute('aria-label', 'Search');
  inputWrapper.appendChild(button);

  card.appendChild(inputWrapper);
  block.appendChild(card);

  const handleSearch = () => {
    const pincode = input.value.trim();
    if (pincode && pincode.length >= 5) {
      window.location.href = `https://www.asianpaints.com/contractor-listing-page.html?pincode=${encodeURIComponent(pincode)}`;
    }
  };

  button.addEventListener('click', handleSearch);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
  input.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  });
}

function decorateCta(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const row = rows[0];
  const cols = [...row.children];

  const wrapper = document.createElement('div');
  wrapper.className = 'pincode-cta-wrapper';

  if (cols.length >= 1) {
    const leftCol = document.createElement('div');
    leftCol.className = 'pincode-cta-image';
    const picture = cols[0].querySelector('picture');
    if (picture) leftCol.appendChild(picture.cloneNode(true));
    wrapper.appendChild(leftCol);
  }

  if (cols.length >= 2) {
    const rightCol = document.createElement('div');
    rightCol.className = 'pincode-cta-content';

    const heading = cols[1].querySelector('h2, h3');
    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent;
      rightCol.appendChild(h2);
    }

    const formContainer = document.createElement('div');
    formContainer.className = 'pincode-cta-form';

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'pincode-input-wrapper';
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter pincode';
    input.className = 'pincode-input';
    input.maxLength = 6;
    input.pattern = '[0-9]*';
    input.inputMode = 'numeric';
    inputWrapper.appendChild(input);
    formContainer.appendChild(inputWrapper);

    const button = document.createElement('button');
    button.className = 'pincode-cta-button';
    button.textContent = 'Search';
    button.type = 'button';
    formContainer.appendChild(button);

    rightCol.appendChild(formContainer);
    wrapper.appendChild(rightCol);
  }

  block.textContent = '';
  block.appendChild(wrapper);
}

export default function decorate(block) {
  if (block.classList.contains('cta')) {
    decorateCta(block);
  } else {
    decorateSearch(block);
  }
}
