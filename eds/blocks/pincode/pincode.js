import { getDigitalData, trackEvent } from '../../scripts/analytics.js';

function handleRedirection(pincode, options = {}) {
  if (!pincode || pincode.length < 5) return;

  const {
    baseUrl = 'https://www.asianpaints.com/contractor-listing-page.html',
    target = '_self',
    type = 'pincode',
  } = options;

  let url = '';
  if (type === 'pincode') {
    url = `${baseUrl}?cpListing=pinCode:${encodeURIComponent(pincode)}`;
  } else if (type === 'mobile') {
    url = `${baseUrl}?cpListing=contactNumber:${encodeURIComponent(pincode)}`;
  } else {
    url = `${baseUrl}?q=${encodeURIComponent(pincode)}`;
  }

  if (target === '_blank') {
    window.open(url, target);
  } else {
    window.location.href = url;
  }
}

function normalizeKey(s) {
  return (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function getCellText(cell) {
  if (!cell) return '';
  const el = cell.querySelector('h1,h2,h3,h4,h5,p,strong,em,span,a');
  return (el ? el.textContent : cell.textContent).trim();
}

function getCellLink(cell) {
  if (!cell) return '';
  const a = cell.querySelector('a');
  return a ? a.href : cell.textContent.trim();
}

function readKeyValueRows(block) {
  const rows = [...block.children];
  const map = {};
  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;
    const [col0, col1] = cols;
    const k = normalizeKey(col0.textContent);
    if (!k) return;
    map[k] = col1;
  });
  return map;
}

function getPicture(cell) {
  if (!cell) return null;
  const picture = cell.querySelector('picture');
  return picture ? picture.cloneNode(true) : null;
}

function trackContractorSearch(searchKeyWord) {
  if (!searchKeyWord) return;

  const digitalData = getDigitalData();
  if (window.ccAnalytics?.digitalData?.()) {
    digitalData.contractor = {
      cityPincode: searchKeyWord,
    };
  } else {
    digitalData.contractor = {
      cityPincode: searchKeyWord,
    };
  }

  if (window.ccAnalytics?.satelliteCheck?.()) {
    window._satellite?.track('contractor_search', {
      cityPincode: searchKeyWord,
    });
    return;
  }

  trackEvent('contractor_search', {
    cityPincode: searchKeyWord,
  });
}

function decorateSearch(block) {
  const rows = [...block.children];
  let heading = '';
  let description = '';
  let cardTitle = 'Find a contractor near you!';
  let placeholder = 'Enter pincode';
  let redirectUrl = '';

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
    if (cols.length >= 1) cardTitle = cols[0].textContent.trim();
    if (cols.length >= 2) placeholder = cols[1].textContent.trim();
  }
  if (rows.length >= 4) {
    redirectUrl = getCellLink(rows[3]);
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
  inputWrapper.className = 'pincode-input-wrapper cpListing-pincode--div';

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
  button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none"><path d="M9.11103 1.1665L14.6666 6.99984M14.6666 6.99984L9.11103 12.8332M14.6666 6.99984L1.33325 6.99984" stroke="#232426" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  button.setAttribute('aria-label', 'Search');
  inputWrapper.appendChild(button);

  card.appendChild(inputWrapper);
  block.appendChild(card);

  const onSearch = () => handleRedirection(input.value.trim(), {
    baseUrl: redirectUrl || undefined,
    type: 'pincode',
  });

  button.addEventListener('click', () => {
    trackContractorSearch(input.value.trim());
    onSearch();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') onSearch();
  });
  input.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  });
}

function decorateCta(block) {
  const cfg = readKeyValueRows(block);
  const picture = getPicture(cfg.image);
  const titleText = getCellText(cfg.title);
  const placeholderText = getCellText(cfg['input placeholder']) || 'Enter pincode';
  const ctaText = getCellText(cfg['cta text']) || 'Search';
  const ctaLink = getCellLink(cfg['cta link']) || getCellLink(cfg['redirect url']);
  const ctaTarget = getCellText(cfg['cta target']) || '_self';

  const wrapper = document.createElement('div');
  wrapper.className = 'swapimagewithcta imageWithRightTextComp';

  const imgWrap = document.createElement('div');
  imgWrap.className = 'img-wrapper img-left';
  if (picture) imgWrap.appendChild(picture);

  const rightWrap = document.createElement('div');
  rightWrap.className = 'righttext-wrapper text-align-right';

  const headingWrap = document.createElement('div');
  headingWrap.className = 'righttext-heading';
  if (titleText) {
    const h2 = document.createElement('h2');
    h2.textContent = titleText;
    headingWrap.appendChild(h2);
  }
  rightWrap.appendChild(headingWrap);

  const findWrap = document.createElement('div');
  findWrap.className = 'findcontractor-wraper';

  const pinWrap = document.createElement('div');
  pinWrap.className = 'pin-code-city-search-wp';

  const inputWithCta = document.createElement('div');
  inputWithCta.className = 'input-with-cta cpListing-pincode--div';

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
  button.innerHTML = `${ctaText} <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none"><path d="M9.11103 1.1665L14.6666 6.99984M14.6666 6.99984L9.11103 12.8332M14.6666 6.99984L1.33325 6.99984" stroke="#232426" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  inputWithCta.appendChild(inputWp);
  inputWithCta.appendChild(button);
  pinWrap.appendChild(inputWithCta);
  findWrap.appendChild(pinWrap);
  rightWrap.appendChild(findWrap);
  wrapper.appendChild(imgWrap);
  wrapper.appendChild(rightWrap);

  const onGo = () => handleRedirection(input.value.trim(), {
    baseUrl: ctaLink || undefined,
    target: ctaTarget,
    type: 'pincode',
  });

  button.addEventListener('click', () => {
    trackContractorSearch(input.value.trim());
    onGo();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') onGo();
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
