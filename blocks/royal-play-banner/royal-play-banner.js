function getTextContent(cell) {
  return cell?.textContent?.trim() || '';
}

function getPicture(cell) {
  return cell?.querySelector('picture')?.cloneNode(true) || null;
}

function getLink(cell) {
  return cell?.querySelector('a') || null;
}

function updateImageAttributes(picture, eager = false) {
  if (!picture) return picture;

  const img = picture.querySelector('img');
  if (img) {
    img.loading = eager ? 'eager' : 'lazy';
    img.setAttribute('fetchpriority', eager ? 'high' : 'auto');
    img.removeAttribute('width');
    img.removeAttribute('height');
  }

  return picture;
}

function getTitleLines(cell) {
  const paragraphs = [...cell.querySelectorAll('p')].filter((p) => p.textContent.trim());

  return {
    line1: paragraphs[0]?.textContent.trim() || '',
    line2: paragraphs[1]?.textContent.trim() || '',
  };
}

function createCTA(cell, buttonType) {
  const link = getLink(cell);
  if (!link) return null;

  const cta = link.cloneNode(true);
  cta.className = 'royal-play-banner__cta';

  if ((buttonType || '').toUpperCase() === 'TRANSPARENT BUTTON') {
    cta.classList.add('royal-play-banner__cta--transparent');
  } else {
    cta.classList.add('royal-play-banner__cta--default');
  }

  return cta;
}

/* =========================
   DESKTOP
========================= */
function createDesktopLayout(row) {
  const cols = [...row.children];

  const logo = updateImageAttributes(getPicture(cols[0]), true);
  const desktopImage = updateImageAttributes(getPicture(cols[1]), true);
  const { line1, line2 } = getTitleLines(cols[3]);
  const subtitle = getTextContent(cols[4]);
  const buttonType = getTextContent(cols[6]);
  const cta = createCTA(cols[5], buttonType);

  const banner = document.createElement('div');
  banner.className = 'royal-play-banner__desktop';

  const media = document.createElement('div');
  media.className = 'royal-play-banner__media';

  const imageWrap = document.createElement('div');
  imageWrap.className = 'royal-play-banner__image-wrap';

  if (desktopImage) {
    desktopImage.classList.add('royal-play-banner__image', 'royal-play-banner__image--desktop');
    imageWrap.appendChild(desktopImage);
  }

  const overlay = document.createElement('div');
  overlay.className = 'royal-play-banner__overlay';

  const content = document.createElement('div');
  content.className = 'royal-play-banner__content';

  if (logo) {
    const logoWrap = document.createElement('div');
    logoWrap.className = 'royal-play-banner__logo';
    logoWrap.appendChild(logo);
    content.appendChild(logoWrap);
  }

  if (line1 || line2) {
    const title = document.createElement('div');
    title.className = 'royal-play-banner__title';

    if (line1) {
      const el = document.createElement('div');
      el.className = 'royal-play-banner__title-line';
      el.textContent = line1;
      title.appendChild(el);
    }

    if (line2) {
      const el = document.createElement('div');
      el.className = 'royal-play-banner__title-line';
      el.textContent = line2;
      title.appendChild(el);
    }

    content.appendChild(title);
  }

  if (subtitle) {
    const sub = document.createElement('p');
    sub.className = 'royal-play-banner__subtitle';
    sub.textContent = subtitle;
    content.appendChild(sub);
  }

  if (cta) {
    const actions = document.createElement('div');
    actions.className = 'royal-play-banner__actions';
    actions.appendChild(cta);
    content.appendChild(actions);
  }

  overlay.appendChild(content);
  media.append(imageWrap, overlay);
  banner.appendChild(media);

  return banner;
}

/* =========================
   MOBILE
========================= */
function createMobileLayout(row) {
  const cols = [...row.children];

  const logo = updateImageAttributes(getPicture(cols[0]), true);
  const mobileImage = updateImageAttributes(getPicture(cols[2]), true);
  const buttonType = getTextContent(cols[6]);
  const cta = createCTA(cols[5], buttonType);

  const banner = document.createElement('div');
  banner.className = 'royal-play-banner__mobile';

  const wrap = document.createElement('div');
  wrap.className = 'royal-play-banner__mobile-image-wrap';

  if (mobileImage) {
    mobileImage.classList.add('royal-play-banner__image', 'royal-play-banner__image--mobile');
    wrap.appendChild(mobileImage);
  }

  // logo top-left
  if (logo) {
    const logoWrap = document.createElement('div');
    logoWrap.className = 'royal-play-banner__mobile-logo';
    logoWrap.appendChild(logo);
    wrap.appendChild(logoWrap);
  }

  // centered CTA
  if (cta) {
    const action = document.createElement('div');
    action.className = 'royal-play-banner__mobile-actions';
    action.appendChild(cta);
    wrap.appendChild(action);
  }

  banner.appendChild(wrap);

  return banner;
}

/* =========================
   INIT
========================= */
export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const row = rows[0];
  if (!row || row.children.length < 7) return;

  block.textContent = '';
  block.classList.add('royal-play-banner');

  const desktop = createDesktopLayout(row);
  const mobile = createMobileLayout(row);

  block.append(desktop, mobile);
}