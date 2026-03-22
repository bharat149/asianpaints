import { submitLeadFromForm } from '../../scripts/form-submit-common.js';

function getPicturesFromCell(cell) {
  if (!cell) return [];
  return [...cell.querySelectorAll('picture')];
}

function cloneSourcesToPicture(targetPicture, sourcePicture, mediaQuery) {
  if (!sourcePicture) return;

  [...sourcePicture.querySelectorAll('source')].forEach((sourceEl) => {
    const source = document.createElement('source');

    if (sourceEl.type) source.type = sourceEl.type;
    if (sourceEl.srcset) source.srcset = sourceEl.srcset;

    if (mediaQuery) {
      source.media = mediaQuery;
    } else if (sourceEl.media) {
      source.media = sourceEl.media;
    }

    targetPicture.appendChild(source);
  });
}

function createResponsivePicture(desktopPicture, mobilePicture, altText = '') {
  const desktopImg = desktopPicture?.querySelector('img');
  const mobileImg = mobilePicture?.querySelector('img');

  if (!desktopImg && !mobileImg) return null;

  const picture = document.createElement('picture');
  picture.className = 'form-banner__picture';

  cloneSourcesToPicture(picture, mobilePicture, '(max-width: 767px)');
  cloneSourcesToPicture(picture, desktopPicture, '(min-width: 768px)');

  const img = document.createElement('img');
  img.src = mobileImg?.src || desktopImg?.src || '';
  img.alt = mobileImg?.alt || desktopImg?.alt || altText;
  img.loading = 'eager';
  img.decoding = 'async';

  if (desktopImg?.width) img.width = desktopImg.width;
  if (desktopImg?.height) img.height = desktopImg.height;

  picture.appendChild(img);
  return picture;
}

function createDefaultField(cell, rowIdx, cellIdx, labelText, placeholderText) {
  const field = document.createElement('div');
  field.className = 'form-field position-relative w-100';

  const inputId = `form-banner-input-${rowIdx}-${cellIdx}`;

  const label = document.createElement('label');
  label.className = 'form-field-label';
  label.setAttribute('for', inputId);
  label.innerHTML = `${labelText || placeholderText}<span class="form-field-required">*</span>`;

  const input = document.createElement('input');
  let inputType = 'text';

  if (labelText) {
    const lowerLabel = labelText.toLowerCase();
    if (lowerLabel.includes('phone') || lowerLabel.includes('mobile')) {
      inputType = 'tel';
    } else if (lowerLabel.includes('email')) {
      inputType = 'email';
    }
  }

  input.type = inputType;
  input.id = inputId;
  input.name = labelText || placeholderText;
  input.placeholder = placeholderText;
  input.className = 'form-input form-control';
  input.required = true;

  const updateFieldState = () => {
    const isFocused = document.activeElement === input;
    const hasValue = !!input.value.trim();

    field.classList.toggle('is-focused', isFocused);
    field.classList.toggle('has-value', hasValue);
    field.classList.toggle('show-label', isFocused || hasValue);
  };

  input.addEventListener('focus', updateFieldState);
  input.addEventListener('blur', updateFieldState);
  input.addEventListener('input', updateFieldState);

  field.append(label, input);

  cell.textContent = '';
  cell.appendChild(field);
}

function createConsentArea() {
  const consentArea = document.createElement('div');
  consentArea.className = 'form-consent-area d-flex flex-column';

  consentArea.innerHTML = `
    <div class="form-consent-options d-flex flex-wrap align-items-center">
      <label class="form-consent-item form-consent-item--toggle">
        <input
          type="checkbox"
          class="form-consent-input"
          name="updateMeOnWhatsapp"
          value="true"
        />
        <span class="form-consent-toggle" aria-hidden="true"></span>
        <span class="form-consent-text">Update me on WhatsApp</span>
      </label>
    </div>

    <div class="form-consent-note">
      By proceeding, you are authorizing Asian Paints and its suggested contractors to get in touch with you through calls, sms, or e-mail.
    </div>
  `;

  return consentArea;
}

function applyFieldConfig(input, headerCell, content) {
  if (!input || !headerCell) return;

  const headerLabel = headerCell.textContent.toLowerCase();

  input.placeholder = content;
  input.required = true;

  if (headerLabel.includes('phone') || headerLabel.includes('mobile')) {
    input.type = 'tel';
    input.id = 'enquire-mobile';
    input.name = 'ENQUIRE_MOBILE';
    input.inputMode = 'numeric';
    input.pattern = '[1-9][0-9]{9}';
    input.maxLength = 10;
  } else if (headerLabel.includes('email')) {
    input.type = 'email';
    input.id = 'enquire-email';
    input.name = 'ENQUIRE_EMAIL';
  } else if (headerLabel.includes('pin')) {
    input.type = 'text';
    input.id = 'enquire-pincode';
    input.name = 'ENQUIRE_PINCODE';
    input.inputMode = 'numeric';
    input.pattern = '[0-9]{6}';
    input.maxLength = 6;
  } else if (headerLabel.includes('name')) {
    input.type = 'text';
    input.id = 'enquire-name';
    input.name = 'ENQUIRE_NAME';
    input.pattern = '[A-Za-z ]{2,}';
  }
}

function bindSubmitHandler(row, buttonCell) {
  const submitBtn = buttonCell?.querySelector('button.form-submit');
  if (!submitBtn || submitBtn.dataset.submitBound === 'true') return;

  submitBtn.dataset.submitBound = 'true';

  submitBtn.addEventListener('click', (event) => {
    event.preventDefault();

    if (row.dataset.submitting === 'true') return;

    const inputs = row.querySelectorAll('.form-input');
    const isValid = [...inputs].every((input) => input.reportValidity());

    if (!isValid) return;

    row.dataset.submitting = 'true';
    submitBtn.disabled = true;

    submitLeadFromForm(row, {
      resourcePath: row.getAttribute('data-attr-resourcePath') || window.location.pathname || '',
      selectors: {
        name: '#enquire-name',
        email: '#enquire-email',
        mobile: '#enquire-mobile',
        pincode: '#enquire-pincode',
      },
    })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Form banner submission failed', err);
      })
      .finally(() => {
        row.dataset.submitting = 'false';
        submitBtn.disabled = false;
      });
  });
}

function buildFormCard(labelsRow, inputsRow) {
  const labelCells = [...labelsRow.children];
  const inputCellsSource = [...inputsRow.children];

  const formCard = document.createElement('div');
  formCard.className = 'form-banner__card';

  const title = document.createElement('h3');
  title.className = 'form-banner__card-title';
  title.textContent = 'Let our experts help you!';

  const formRow = document.createElement('div');
  formRow.className = 'form-banner__form form-attributes';
  formRow.setAttribute('data-attr-resourcePath', window.location.pathname || '');

  const inputsGrid = document.createElement('div');
  inputsGrid.className = 'form-inputs-grid';

  for (let i = 0; i < 4; i += 1) {
    const labelCell = labelCells[i];
    const inputSourceCell = inputCellsSource[i];
    const content = inputSourceCell?.textContent.trim();

    if (!content) continue;

    const inputCell = document.createElement('div');
    inputCell.className = 'form-input-cell';

    const headerText = labelCell ? labelCell.textContent.trim() : '';
    createDefaultField(inputCell, 2, i, headerText, content);

    const input = inputCell.querySelector('.form-input');
    applyFieldConfig(input, labelCell, content);

    inputsGrid.appendChild(inputCell);
  }

  const buttonCell = document.createElement('div');
  buttonCell.className = 'form-button-cell';

  const buttonLabelCell = labelCells[4];
  const buttonLabel = buttonLabelCell?.textContent.trim();

  if (buttonLabel) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'form-submit btn';
    button.textContent = buttonLabel;
    buttonCell.appendChild(button);
  }

  formRow.appendChild(inputsGrid);
  formRow.appendChild(createConsentArea());

  if (buttonCell.children.length) {
    formRow.appendChild(buttonCell);
  }

  formCard.appendChild(title);
  formCard.appendChild(formRow);

  if (buttonCell.children.length) {
    bindSubmitHandler(formRow, buttonCell);
  }

  return formCard;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 3) return;

  const imageRow = rows[0];
  const labelsRow = rows[1];
  const inputsRow = rows[2];

  const imageCell = imageRow.children[0];
  if (!imageCell) return;

  const pictures = getPicturesFromCell(imageCell);

  const desktopPicture = pictures[0] || null;
  const mobilePicture = pictures[1] || pictures[0] || null;

  const responsivePicture = createResponsivePicture(
    desktopPicture,
    mobilePicture,
    'Form banner background',
  );

  if (!responsivePicture) return;

  block.innerHTML = '';
  block.classList.add('form-banner');

  const wrapper = document.createElement('div');
  wrapper.className = 'form-banner__wrapper';

  const media = document.createElement('div');
  media.className = 'form-banner__media';
  media.appendChild(responsivePicture);

  const overlay = document.createElement('div');
  overlay.className = 'form-banner__overlay';

  const formCard = buildFormCard(labelsRow, inputsRow);

  overlay.appendChild(formCard);
  wrapper.append(media, overlay);
  block.appendChild(wrapper);
}