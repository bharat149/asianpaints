/*
** Authoring format **
Row 1
Col 1 → Discover
Col 2 → Collections
Row 2
Col 1: left text design content
Col 2: right text design content
Row 3
Col 1: left images
Col 2: right images
*/

function getHeading(cell) {
  return cell.querySelector('h1, h2, h3, h4, h5, h6');
}

function getDescription(cell) {
  const paragraphs = [...cell.querySelectorAll('p')];
  return paragraphs.find((p) => p.textContent.trim());
}

function getLinks(cell) {
  return [...cell.querySelectorAll('a')];
}

function getPictures(cell) {
  return [...cell.querySelectorAll('picture')].map((picture, index) => {
    const cloned = picture.cloneNode(true);
    const img = cloned.querySelector('img');

    if (img) {
      img.loading = index < 2 ? 'eager' : 'lazy';
      img.setAttribute('fetchpriority', index < 2 ? 'high' : 'auto');
      img.removeAttribute('width');
      img.removeAttribute('height');
    }

    return cloned;
  });
}

function getCellContent(cell) {
  if (!cell) return '';

  const preferred = cell.querySelector('h1, h2, h3, h4, h5, h6, p, span, div');

  if (preferred && preferred.textContent.trim()) {
    return preferred.textContent.trim();
  }

  return cell.textContent ? cell.textContent.trim() : '';
}

function createArrowIcon() {
  const arrow = document.createElement('span');
  arrow.className = 'discover-collections__cta-arrow';
  arrow.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M9 4L13 8L9 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  return arrow;
}

function createDownloadIcon() {
  const icon = document.createElement('span');
  icon.className = 'discover-collections__download-icon';
  icon.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 2.2V8.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M4.7 6.3L7 8.6L9.3 6.3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2.3 11.2H11.7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
    </svg>
  `;
  return icon;
}

function createBlockHeader(titleCols) {
  const wrapper = document.createElement('div');
  wrapper.className = 'discover-collections__block-header';

  const title = document.createElement('h2');
  title.className = 'discover-collections__block-title';

  const firstPart = getCellContent(titleCols[0]);
  const secondPart = getCellContent(titleCols[1]);

  title.innerHTML = `
    ${firstPart ? `<span class="discover-collections__block-title-main">${firstPart}</span>` : ''}
    ${secondPart ? `<span class="discover-collections__block-title-gradient">${secondPart}</span>` : ''}
  `;

  wrapper.append(title);
  return wrapper;
}

function createTextBlock(contentCell) {
  const textWrap = document.createElement('div');
  textWrap.className = 'discover-collections__text';

  const headingEl = getHeading(contentCell);
  const descriptionEl = getDescription(contentCell);
  const links = getLinks(contentCell);

  const title = document.createElement('h3');
  title.className = 'discover-collections__title';
  title.innerHTML = headingEl ? headingEl.innerHTML : '';

  const subtitle = document.createElement('p');
  subtitle.className = 'discover-collections__subtitle';
  subtitle.innerHTML = descriptionEl ? descriptionEl.innerHTML : '';

  const actions = document.createElement('div');
  actions.className = 'discover-collections__actions';

  if (links[0]) {
    const downloadLink = links[0].cloneNode(true);
    downloadLink.className = 'discover-collections__download';

    if (!downloadLink.getAttribute('target')) {
      downloadLink.setAttribute('target', '_blank');
    }

    downloadLink.setAttribute('rel', 'noopener noreferrer');
    downloadLink.prepend(createDownloadIcon());
    actions.append(downloadLink);
  }

  if (links[1]) {
    const viewLink = links[1].cloneNode(true);
    viewLink.className = 'discover-collections__cta';
    viewLink.append(createArrowIcon());
    actions.append(viewLink);
  }

  textWrap.append(title, subtitle, actions);
  return textWrap;
}

function createImageCard(picture, index) {
  const item = document.createElement('div');
  item.className = `discover-collections__image discover-collections__image--${index + 1}`;
  item.append(picture);
  return item;
}

function createCollectionVariant(contentCell, imageCell, variantClass) {
  const section = document.createElement('section');
  section.className = `discover-collections__variant ${variantClass}`;

  const collage = document.createElement('div');
  collage.className = 'discover-collections__collage';

  collage.append(createTextBlock(contentCell));

  const pictures = getPictures(imageCell).slice(0, 8);
  pictures.forEach((picture, index) => {
    collage.append(createImageCard(picture, index));
  });

  section.append(collage);
  return section;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 3) return;

  const titleRow = rows[0];
  const contentRow = rows[1];
  const imageRow = rows[2];

  const titleCols = [...titleRow.children];
  const contentCols = [...contentRow.children];
  const imageCols = [...imageRow.children];

  if (titleCols.length < 2 || contentCols.length < 2 || imageCols.length < 2) return;

  block.textContent = '';
  block.classList.add('discover-collections');

  const blockHeader = createBlockHeader(titleCols);

  const leftVariant = createCollectionVariant(
    contentCols[0],
    imageCols[0],
    'discover-collections__variant--left',
  );

  const rightVariant = createCollectionVariant(
    contentCols[1],
    imageCols[1],
    'discover-collections__variant--right',
  );

  block.append(blockHeader, leftVariant, rightVariant);
}