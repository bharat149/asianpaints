import { submitLeadFromForm } from '../../scripts/form-submit-common.js';

const THANK_YOU_DESKTOP_VIDEO = 'https://static.asianpaints.com/content/dam/asian_paints/forms/thank-you-gif/Thankyou-pop-up-desktop.webm';
const THANK_YOU_MOBILE_VIDEO = 'https://static.asianpaints.com/content/dam/asian_paints/forms/thank-you-gif/Thank-you-pop-up-mobile-without-x.webm';
const THANK_YOU_CTA_LINK = 'https://static.asianpaints.com/content/ap/en/home/services/interior-design-solutions.html';

const ERROR_DESKTOP_IMAGE = 'https://www.asianpaints.com/content/dam/apcolourcatalogue/asset/ap-revamp/ccformsthankyou/SPSFormSuccess.webp';
const ERROR_MOBILE_IMAGE = 'https://www.asianpaints.com/content/dam/apcolourcatalogue/asset/ap-revamp/ccformsthankyou/SPSFormSuccessMweb.webp';
const ERROR_CTA_LINK = 'https://www.asianpaints.com/services.html';
const ERROR_DOWNLOAD_LINK = 'https://static.asianpaints.com/content/dam/asian_paints/restricted/the-colour-book-asian-paints.pdf';

/**
 * Ensure bootstrap utility classes where useful
 */
function applyBootstrapHelpers(block) {
  const section = block.closest('.section.form-container');
  const wrapper = block.closest('.form-wrapper');

  section?.classList.add('bg-transparent');
  wrapper?.classList.add('m-0', 'p-0', 'w-100');
  block.classList.add('position-relative', 'overflow-hidden', 'bg-white', 'w-100');
}

/**
 * Create default form field
 */
function createDefaultField(cell, rowIdx, cellIdx, labelText, placeholderText) {
  const field = document.createElement('div');
  field.className = 'form-field position-relative w-100';

  const inputId = `form-input-${rowIdx}-${cellIdx}`;

  const label = document.createElement('label');
  label.className = 'form-field-label';
  label.setAttribute('for', inputId);
  label.innerHTML = `${labelText || placeholderText}<span class="form-field-required">*</span>`;

  const input = document.createElement('input');
  let inputType = 'text';

  if (labelText) {
    const lowerLabel = labelText.toLowerCase();
    if (lowerLabel.includes('phone')) {
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

/**
 * Create consent / checkbox area
 */
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

      <label class="form-consent-item">
        <input
          type="checkbox"
          class="form-consent-input"
          name="constructionWorkGoingOn"
          value="true"
        />
        <span class="form-consent-box" aria-hidden="true"></span>
        <span class="form-consent-text">Construction work going on at my house</span>
      </label>

      <label class="form-consent-item">
        <input
          type="checkbox"
          class="form-consent-input"
          name="localPainterHired"
          value="true"
        />
        <span class="form-consent-box" aria-hidden="true"></span>
        <span class="form-consent-text">Local painter hired</span>
      </label>
    </div>

    <div class="form-consent-note">
      By proceeding, you are authorizing Asian Paints and its suggested contractors to get in touch with you through calls, sms, or e-mail.
    </div>
  `;

  return consentArea;
}

/**
 * Apply field-specific attributes
 */
function applyFieldConfig(input, headerCell, content) {
  if (!input || !headerCell) return;

  const headerLabel = headerCell.textContent.toLowerCase();

  input.placeholder = content;
  input.required = true;

  if (headerLabel.includes('phone')) {
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

/**
 * Format description cell content
 */
function populateDescriptionCell(cell, headerCell) {
  const descContent = headerCell?.innerHTML;
  if (!descContent) return;

  if (descContent.includes('Painting Service')) {
    const strongMatch = descContent.match(/<strong>(.*?)<\/strong>/);

    if (strongMatch) {
      const titleText = strongMatch[1];

      if (titleText.includes('Painting Service')) {
        const parts = titleText.split('Painting Service');
        const beforeText = parts[0].trim();
        const afterText = headerCell.textContent.replace(titleText, '').trim();

        cell.innerHTML = `
          <div class="form-title-small">${beforeText}</div>
          <div class="form-title-large">Painting<br>Service</div>
          <div class="form-subtitle">${afterText}</div>
        `;
        return;
      }
    }
  }

  cell.innerHTML = descContent;
}

/**
 * Cleanup video
 */
function cleanupVideo(video) {
  if (!video) return;
  video.pause();
  video.removeAttribute('src');
  video.load();
}

/**
 * Close active popup
 */
function closeActivePopup(block, overlay, video = null) {
  cleanupVideo(video);
  overlay?.remove();
  block.classList.remove('thank-you-active', 'error-active', 'popup-active');
  delete block.dataset.thankYouShown;
  delete block.dataset.errorShown;
}

/**
 * Create close button
 */
function createCloseButton(labelText) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'form-popup-close';
  button.setAttribute('aria-label', labelText);
  button.innerHTML = '&times;';
  return button;
}

/**
 * Create thank you overlay
 */
function createThankYouScreen(block) {
  const overlay = document.createElement('div');
  overlay.className = 'form-popup-overlay form-popup-overlay--success';

  const isMobile = window.matchMedia('(max-width: 991px)').matches;
  const videoSrc = isMobile ? THANK_YOU_MOBILE_VIDEO : THANK_YOU_DESKTOP_VIDEO;

  const closeBtn = createCloseButton('Close thank you popup');

  const video = document.createElement('video');
  video.className = 'form-popup-success-video';
  video.setAttribute('playsinline', '');
  video.setAttribute('autoplay', '');
  video.setAttribute('muted', '');
  video.setAttribute('preload', 'auto');
  video.setAttribute('aria-label', 'thank-you');
  video.src = videoSrc;
  video.loop = false;

  const cta = document.createElement('a');
  cta.className = 'form-popup-success-cta';
  cta.href = THANK_YOU_CTA_LINK;
  cta.target = '_blank';
  cta.rel = 'noopener noreferrer';
  cta.setAttribute('aria-label', 'Explore now');

  video.addEventListener('ended', () => {
    video.pause();
  });

  closeBtn.addEventListener('click', () => {
    closeActivePopup(block, overlay, video);
  });

  overlay.append(closeBtn, video, cta);

  return overlay;
}

/**
 * Create error overlay
 */
function createErrorScreen(block) {
  const overlay = document.createElement('div');
  overlay.className = 'form-popup-overlay form-popup-overlay--error';

  const closeBtn = createCloseButton('Close error popup');

  overlay.innerHTML = `
    <div class="form-error-popup">
      <div class="form-error-popup__left">
        <div class="form-error-popup__copy">
          <h2 class="form-error-popup__title">Try again!</h2>
          <p class="form-error-popup__text">
            Oops! Something went wrong. We couldn't process your request. Please try again?
          </p>
        </div>
      </div>

      <div class="form-error-popup__right">
        <div
          class="form-error-popup__media"
          style="
            --form-error-image-desktop: url('${ERROR_DESKTOP_IMAGE}');
            --form-error-image-mobile: url('${ERROR_MOBILE_IMAGE}');
          "
        >
          <div class="form-error-popup__content">
            <p class="form-error-popup__content-title">
              Are you looking for home interiors?
            </p>
            <p class="form-error-popup__content-subtitle">
              Get expert execution for your dream home from Beautiful Homes Interior Design service by asian paints.
            </p>
            <div class="form-error-popup__actions">
              <a
                href="${ERROR_CTA_LINK}"
                target="_self"
                class="form-error-popup__button"
              >
                Get FREE Design Consultation
              </a>
            </div>
            <a
              class="form-error-popup__download"
              href="${ERROR_DOWNLOAD_LINK}"
              download
            >
              Download the asianpaints colour books
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  overlay.prepend(closeBtn);

  closeBtn.addEventListener('click', () => {
    closeActivePopup(block, overlay);
  });

  return overlay;
}

/**
 * Show thank you overlay
 */
function showThankYouScreen(block) {
  if (!block || block.dataset.thankYouShown === 'true') return;

  const existingOverlay = block.querySelector('.form-popup-overlay--success');
  if (existingOverlay) {
    block.dataset.thankYouShown = 'true';
    block.classList.add('thank-you-active', 'popup-active');
    return;
  }

  const overlay = createThankYouScreen(block);
  block.appendChild(overlay);
  block.dataset.thankYouShown = 'true';
  block.classList.add('thank-you-active', 'popup-active');
}

/**
 * Show error overlay
 */
function showErrorScreen(block) {
  if (!block || block.dataset.errorShown === 'true') return;

  const existingOverlay = block.querySelector('.form-popup-overlay--error');
  if (existingOverlay) {
    block.dataset.errorShown = 'true';
    block.classList.add('error-active', 'popup-active');
    return;
  }

  const overlay = createErrorScreen(block);
  block.appendChild(overlay);
  block.dataset.errorShown = 'true';
  block.classList.add('error-active', 'popup-active');
}

/**
 * Bind submit handler
 */
function bindSubmitHandler(block, row, buttonCell) {
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
      .then(() => {
        showThankYouScreen(block);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Default form submission failed', err);
        showErrorScreen(block);
      })
      .finally(() => {
        row.dataset.submitting = 'false';
        submitBtn.disabled = false;
      });
  });
}

/**
 * Render form block
 */
function renderForm(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const headerRow = rows[0];
  if (!headerRow) return;

  const headerCells = [...headerRow.children];

  rows.forEach((row, rowIdx) => {
    if (rowIdx === 0) {
      row.style.display = 'none';
      return;
    }

    row.classList.add('form-row', 'form-attributes');
    row.setAttribute('data-attr-resourcePath', window.location.pathname || '');

    const cells = [...row.children];

    let descriptionCell = null;
    let buttonCell = null;
    const inputCells = [];

    cells.forEach((cell, cellIdx) => {
      const content = cell.textContent.trim();
      const headerCell = headerCells[cellIdx];
      const headerText = headerCell ? headerCell.textContent.trim() : '';

      if (cellIdx === 0) {
        cell.classList.add('form-description-cell');
        descriptionCell = cell;

        if (!content && headerCell) {
          populateDescriptionCell(cell, headerCell);
        }

        return;
      }

      const headerLink = headerCell?.querySelector('a');

      if (headerLink && !content) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'form-submit btn';
        button.textContent = headerLink.textContent.trim();

        cell.textContent = '';
        cell.appendChild(button);
        cell.classList.add('form-button-cell');
        buttonCell = cell;
        return;
      }

      if (content) {
        cell.classList.add('form-input-cell');
        createDefaultField(cell, rowIdx, cellIdx, headerText, content);

        const input = cell.querySelector('.form-input');
        applyFieldConfig(input, headerCell, content);

        inputCells.push(cell);
      } else {
        cell.classList.add('form-empty-cell');
      }
    });

    if (!inputCells.length || !descriptionCell) return;

    const fieldsArea = document.createElement('div');
    fieldsArea.className = 'form-fields-area d-flex flex-column';

    const inputsGrid = document.createElement('div');
    inputsGrid.className = 'form-inputs-grid';

    inputCells.forEach((inputCell) => {
      inputsGrid.appendChild(inputCell);
    });

    fieldsArea.appendChild(inputsGrid);
    fieldsArea.appendChild(createConsentArea());

    if (buttonCell) {
      fieldsArea.appendChild(buttonCell);
      bindSubmitHandler(block, row, buttonCell);
    }

    row.appendChild(fieldsArea);
  });
}

export default function decorate(block) {
  const section = block.closest('.section');
  if (section) {
    section.classList.remove('dark-blue');
  }

  applyBootstrapHelpers(block);
  renderForm(block);
}