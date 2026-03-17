function normalizeKey(s) {
  return (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function getCellText(cell) {
  if (!cell) return '';
  const el = cell.querySelector('h1,h2,h3,h4,h5,p,strong,em,span,a');
  return (el ? el.textContent : cell.textContent).trim();
}

function readKeyValueRows(block) {
  const rows = [...block.children];
  const map = {};
  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;
    const k = normalizeKey(cols[0].textContent);
    if (!k) return;
    map[k] = cols[1];
  });
  return map;
}

function getPicture(cell) {
  if (!cell) return null;
  const picture = cell.querySelector('picture');
  return picture ? picture.cloneNode(true) : null;
}

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
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
  input.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  });
}

function decorateCta(block) {
  const cfg = readKeyValueRows(block);

  const picture = getPicture(cfg['image']);
  const titleText = getCellText(cfg['title']);
  const placeholderText = getCellText(cfg['input placeholder']) || 'Enter pincode';
  const ctaText = getCellText(cfg['cta text']) || 'Search';

  const wrapper = document.createElement('div');
  wrapper.className = 'pincode-cta-wrapper swap-img-wraper';

  const imgWrap = document.createElement('div');
  imgWrap.className = 'pincode-cta-image img-wrapper img-left';
  if (picture) imgWrap.appendChild(picture);

  const rightWrap = document.createElement('div');
  rightWrap.className = 'pincode-cta-content righttext-wrapper text-align-right';

  const headingWrap = document.createElement('div');
  headingWrap.className = 'righttext-heading';
  if (titleText) {
    const h1 = document.createElement('h1');
    h1.textContent = titleText;
    headingWrap.appendChild(h1);
  }
  rightWrap.appendChild(headingWrap);

  const findWrap = document.createElement('div');
  findWrap.className = 'findcontractor-wraper';

  const pinWrap = document.createElement('div');
  pinWrap.className = 'pin-code-city-search-wp';

  const inputWithCta = document.createElement('div');
  inputWithCta.className = 'input-with-cta';

  const inputWp = document.createElement('div');
  inputWp.className = 'pincode-input-wp';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'pincode-input ctaPincode';
  input.placeholder = placeholderText;
  input.maxLength = 6;
  input.pattern = '[0-9]*';
  input.inputMode = 'numeric';
  inputWp.appendChild(input);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'pincode-cta-button js-pincode-cta';
  button.textContent = ctaText;

  inputWithCta.appendChild(inputWp);
  inputWithCta.appendChild(button);
  pinWrap.appendChild(inputWithCta);
  findWrap.appendChild(pinWrap);
  rightWrap.appendChild(findWrap);

  wrapper.appendChild(imgWrap);
  wrapper.appendChild(rightWrap);

  const handleGo = () => {
    const pincode = input.value.trim();
    if (pincode && pincode.length >= 5) {
      window.location.href = `https://www.asianpaints.com/contractor-listing-page.html?pincode=${encodeURIComponent(pincode)}`;
    }
  };

  button.addEventListener('click', handleGo);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleGo();
  });
  input.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  });

  block.textContent = '';
  block.appendChild(wrapper);
}

export default function decorate(block) {
  if (block.classList.contains('cta')) {
    decorateCta(block);
    return;
  }
  decorateSearch(block);
}