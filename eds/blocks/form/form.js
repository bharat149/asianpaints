/*
** Authoring format **
Form block
Row 1, col 1–3 → used for form-description-cell
Row 2, col 1–4 → used as form-field-label
Row 2, col 5 → used as submit button label
Row 3, col 1–4 → used as input placeholder/content

Row 4, col 1 → form-consent-text for whatsapp
Row 4, col 2 → display / hide

Row 5, col 1 → form-consent-text for construction
Row 5, col 2 → display / hide

Row 6, col 1 → form-consent-text for local painter
Row 6, col 2 → display / hide

Row 7, col 1 → desktop error image
Row 7, col 2 → mobile error image

Form Config block
Row 1, col 1-2 → campaign ID (to pass as form parameter and for tracking)
Row 2, col 1-2 → node (to pass as form parameter node path)

Two variant: White form, Blue form
*/

import { submitLeadFromForm } from '../../scripts/form-submit-common.js';
import { getDigitalData, trackEvent } from '../../scripts/analytics.js';

const THANK_YOU_DESKTOP_VIDEO = 'https://static.asianpaints.com/content/dam/asian_paints/forms/thank-you-gif/Thankyou-pop-up-desktop.webm';
const THANK_YOU_MOBILE_VIDEO = 'https://static.asianpaints.com/content/dam/asian_paints/forms/thank-you-gif/Thank-you-pop-up-mobile-without-x.webm';
const THANK_YOU_CTA_LINK = 'https://static.asianpaints.com/content/ap/en/home/services/interior-design-solutions.html';

let ERROR_DESKTOP_IMAGE = '';
let ERROR_MOBILE_IMAGE = '';
const ERROR_CTA_LINK = 'https://www.asianpaints.com/services.html';
const ERROR_DOWNLOAD_LINK = 'https://static.asianpaints.com/content/dam/asian_paints/restricted/the-colour-book-asian-paints.pdf';
const THANK_YOU_TWO_DESKTOP = 'https://www.asianpaints.com/content/dam/asian_paints/forms/thank-you-gif/Thankyou-success-image-desktop.webp';
const THANK_YOU_TWO_MOB = 'https://www.asianpaints.com/content/dam/asian_paints/forms/thank-you-gif/Thankyou-success-image-mobile.webp';

let formName = "";
let campaignId = "";
let formNodePath = '';
let formStarted = false;

function getRowValue(row) {
  if (!row) return '';

  const cells = [...row.children];
  const preferred = cells[1]?.textContent?.trim();
  if (preferred) return preferred;

  return cells.map((cell) => cell.textContent?.trim()).filter(Boolean).join(' ').trim();
}

function getCellText(cell) {
  return cell?.textContent?.trim() || '';
}

function extractFormConfig(block) {
  const section = block.closest('.section');
  const formConfigBlock = section?.querySelector('.form-config, .form-configs');

  let configuredCampaignId = '';
  let configuredNodePath = '';

  if (formConfigBlock) {
    const configRows = [...formConfigBlock.children];
    configuredCampaignId = getRowValue(configRows[0]);
    configuredNodePath = getRowValue(configRows[1]);

    const formConfigWrapper = formConfigBlock.closest('.form-config-wrapper, .form-configs-wrapper');
    const formConfigSection = formConfigBlock.closest('.section');

    formConfigBlock.style.display = 'none';
    if (formConfigWrapper) {
      formConfigWrapper.style.display = 'none';
    }
    if (formConfigSection && formConfigSection !== section) {
      formConfigSection.style.display = 'none';
    }
  }

  configuredCampaignId = configuredCampaignId
    || block.getAttribute('data-campaign-id')?.trim()
    || '';

  configuredNodePath = configuredNodePath
    || block.getAttribute('data-node')?.trim()
    || window.location.pathname
    || '';

  campaignId = configuredCampaignId;
  formNodePath = configuredNodePath;
}

/**
 * Ensure bootstrap utility classes where useful
 */
function applyBootstrapHelpers(block) {
  const section = block.closest('.section.form-container');
  const wrapper = block.closest('.form-wrapper');

  // section?.classList.add('bg-transparent');
  wrapper?.classList.add('m-0', 'p-0', 'w-100');
  block.classList.add('position-relative', 'overflow-hidden', 'w-100');
}

/**
 * Create inline error message element
 */
function createErrorMessageElement() {
  const error = document.createElement('div');
  error.className = 'form-field-error';
  error.setAttribute('aria-live', 'polite');
  return error;
}

/**
 * Show field error
 */
function showFieldError(field, input, message) {
  if (!field || !input) return;

  let errorEl = field.querySelector('.form-field-error');
  if (!errorEl) {
    errorEl = createErrorMessageElement();
    field.appendChild(errorEl);
  }

  errorEl.textContent = message;
  field.classList.add('has-error');
  input.classList.add('is-invalid');
  input.setAttribute('aria-invalid', 'true');
}

/**
 * Clear field error
 */
function clearFieldError(field, input) {
  if (!field || !input) return;

  const errorEl = field.querySelector('.form-field-error');
  if (errorEl) {
    errorEl.textContent = '';
  }

  field.classList.remove('has-error');
  input.classList.remove('is-invalid');
  input.removeAttribute('aria-invalid');
  input.setCustomValidity('');
}

/**
 * Restrict numeric-only inputs
 */
function bindNumericInputFilter(input) {
  if (!input) return;

  input.addEventListener('input', () => {
    const numericValue = input.value.replace(/\D/g, '');

    if (input.value !== numericValue) {
      input.value = numericValue;
    }
  });
}

/**
 * Get custom validation message for input
 */
function getValidationMessage(input) {
  if (!input) return '';

  const value = input.value.trim();
  const fieldName = `${input.name || ''} ${input.id || ''}`.toLowerCase();

  const isEmail = fieldName.includes('email');
  const isPincode = fieldName.includes('pincode') || fieldName.includes('pin');
  const isMobile = fieldName.includes('mobile') || fieldName.includes('phone');

  if (!value) {
    return 'Field is required';
  }

  if (isEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Email is invalid';
    }
  }

  if (isPincode) {
    if (!/^\d{6}$/.test(value)) {
      return 'Enter a valid 6 digit Zip Code';
    }
  }

  if (isMobile) {
    if (!/^\d{10}$/.test(value)) {
      return 'Phone number is invalid';
    }
  }

  return '';
}

/**
 * Validate single input
 */
function validateInputField(input, showError = true) {
  if (!input) return true;

  const field = input.closest('.form-field');
  const message = getValidationMessage(input);

  if (message) {
    input.setCustomValidity(message);

    if (showError) {
      showFieldError(field, input, message);
    }

    return false;
  }

  clearFieldError(field, input);
  return true;
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
  input.noValidate = true;

  const errorEl = createErrorMessageElement();

  const updateFieldState = () => {
    const isFocused = document.activeElement === input;
    const hasValue = !!input.value.trim();

    field.classList.toggle('is-focused', isFocused);
    field.classList.toggle('has-value', hasValue);
    field.classList.toggle('show-label', isFocused || hasValue);
  };

  input.addEventListener('focus', updateFieldState);

  input.addEventListener('blur', () => {
    updateFieldState();
    validateInputField(input, true);
  });

  input.addEventListener('input', () => {
    updateFieldState();

    if (field.classList.contains('has-error')) {
      validateInputField(input, true);
    }
  });

  field.append(label, input, errorEl);

  cell.textContent = '';
  cell.appendChild(field);
}

/**
 * Build consent config from authoring rows
 */
function getConsentConfig(consentRows = []) {
  const [whatsappRow, constructionRow, localPainterRow] = consentRows;

  const getConsentItem = (row, fallbackText) => {
    const cells = [...(row?.children || [])];
    const text = getCellText(cells[0]) || fallbackText;
    const visibility = (getCellText(cells[1]) || 'display').toLowerCase();
    const isHidden = visibility === 'hide';

    return {
      text,
      isHidden,
    };
  };

  return {
    whatsapp: getConsentItem(whatsappRow, 'Update me on WhatsApp'),
    construction: getConsentItem(constructionRow, 'Construction work going on at my house'),
    localPainter: getConsentItem(localPainterRow, 'Local painter hired'),
  };
}

/**
 * Create consent / checkbox area
 */
/**
 * Create consent / checkbox area
 */
function createConsentArea(consentConfig) {
  const consentArea = document.createElement('div');
  consentArea.className = 'form-consent-area d-flex flex-column';

  consentArea.innerHTML = `
    <div class="form-consent-options d-flex flex-wrap align-items-center">
      <label class="form-consent-item form-consent-item--toggle" data-consent="whatsapp">
        <input
          type="checkbox"
          class="form-consent-input"
          name="updateMeOnWhatsapp"
          value="true"
        />
        <span class="form-consent-toggle" aria-hidden="true"></span>
        <span class="form-consent-text form-consent-text-whatsapp">${consentConfig?.whatsapp?.text || 'Update me on WhatsApp'}</span>
      </label>

      <div class="form-consent-options-right">
        <label class="form-consent-item" data-consent="construction">
          <input
            type="checkbox"
            class="form-consent-input"
            name="constructionWorkGoingOn"
            value="true"
          />
          <span class="form-consent-box" aria-hidden="true"></span>
          <span class="form-consent-text">${consentConfig?.construction?.text || 'Construction work going on at my house'}</span>
        </label>

        <label class="form-consent-item" data-consent="localPainter">
          <input
            type="checkbox"
            class="form-consent-input"
            name="localPainterHired"
            value="true"
          />
          <span class="form-consent-box" aria-hidden="true"></span>
          <span class="form-consent-text">${consentConfig?.localPainter?.text || 'Local painter hired'}</span>
        </label>
      </div>
    </div>

    <div class="form-consent-note">
      By proceeding, you are authorizing Asian Paints and its suggested contractors to get in touch with you through calls, sms, or e-mail.
    </div>
  `;

  const whatsappItem = consentArea.querySelector('[data-consent="whatsapp"]');
  const constructionItem = consentArea.querySelector('[data-consent="construction"]');
  const localPainterItem = consentArea.querySelector('[data-consent="localPainter"]');
  const rightWrapper = consentArea.querySelector('.form-consent-options-right');

  if (consentConfig?.whatsapp?.isHidden && whatsappItem) {
    whatsappItem.classList.add('d-none');
    whatsappItem.hidden = true;
  }

  if (consentConfig?.construction?.isHidden && constructionItem) {
    constructionItem.classList.add('d-none');
    constructionItem.hidden = true;
  }

  if (consentConfig?.localPainter?.isHidden && localPainterItem) {
    localPainterItem.classList.add('d-none');
    localPainterItem.hidden = true;
  }

  // Hide the right-side wrapper completely when both right consent items are hidden
  const isConstructionHidden = !!consentConfig?.construction?.isHidden;
  const isLocalPainterHidden = !!consentConfig?.localPainter?.isHidden;

  if (isConstructionHidden && isLocalPainterHidden && rightWrapper) {
    rightWrapper.classList.add('d-none');
    rightWrapper.hidden = true;
  }

  return consentArea;
}

/**
 * Add a fixed +91 prefix inside the phone input without changing
 * the actual input value submitted to the backend.
 *
 * DOM after enhancement:
 * .form-field
 *   label
 *   .form-input-prefix-wrap
 *      span.form-input-prefix
 *      input.form-input
 *   .form-field-error
 *
 * This keeps the prefix visible both with placeholder and while typing.
 */
function applyPhonePrefix(field, input) {
  if (!field || !input || field.querySelector('.form-input-prefix-wrap')) return;

  const inputWrap = document.createElement('div');
  inputWrap.className = 'form-input-prefix-wrap';

  const prefix = document.createElement('span');
  prefix.className = 'form-input-prefix';
  prefix.setAttribute('aria-hidden', 'true');
  prefix.textContent = '+91';

  field.insertBefore(inputWrap, input);
  inputWrap.appendChild(prefix);
  inputWrap.appendChild(input);
}

/**
 * Apply field-specific attributes
 *
 * Note:
 * - Keep only one applyFieldConfig function in this file.
 * - The phone field gets a visual +91 prefix, but input value remains
 *   only the 10-digit number expected by validation/submission logic.
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
    input.pattern = '[0-9]{10}';
    input.maxLength = 10;
    bindNumericInputFilter(input);

    const field = input.closest('.form-field');
    applyPhonePrefix(field, input);
    input.classList.add('form-input--with-prefix');
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
    bindNumericInputFilter(input);
  } else if (headerLabel.includes('name')) {
    input.type = 'text';
    input.id = 'enquire-name';
    input.name = 'ENQUIRE_NAME';
    input.pattern = '[A-Za-z ]{2,}';
  }
}

/**
 * Create one description item inside description cell
 */
function createDescriptionItem(cell, className) {
  const item = document.createElement('div');
  item.className = className;
  item.innerHTML = cell?.innerHTML || '';
  return item;
}

/**
 * Populate description cell using row 1 col 1, 2, 3
 */
function populateDescriptionCell(cell, descriptionCells) {
  cell.textContent = '';

  const smallTitle = createDescriptionItem(descriptionCells[0], 'form-title-small');
  const largeTitle = createDescriptionItem(descriptionCells[1], 'form-title-large');
  const subtitle = createDescriptionItem(descriptionCells[2], 'form-subtitle');

  if (descriptionCells[0]?.innerHTML?.trim()) {
    formName = smallTitle.textContent?.trim();
    cell.appendChild(smallTitle);
  }

  if (descriptionCells[1]?.innerHTML?.trim()) {
    cell.appendChild(largeTitle);
  }

  if (descriptionCells[2]?.innerHTML?.trim()) {
    cell.appendChild(subtitle);
  }
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

function trackInterestCTA(currentCampaignId, currentFormName) {
  trackEvent('Form_thank_you_pop_up', {
    cid: currentCampaignId,
    formName: currentFormName,
  });
}

function trackExploreNowCTA(ctaLink) {
  if (!ctaLink) return;

  trackEvent('cta_link_text', {
    cta_: 'Explore now',
    parentTitle: 'Form Thank you pop-up',
    param1: ctaLink,
    redirectionLink: ctaLink,
  });
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
  cta.addEventListener('click', () => {
    trackExploreNowCTA(THANK_YOU_CTA_LINK);
  });

  const ins = document.createElement('a');
  ins.className = 'intereseted-cta';
  ins.href = 'javascript:void(0)';
  ins.setAttribute('aria-label', 'Yes I am Interseted');
  ins.addEventListener('click', () => {
    trackInterestCTA(campaignId, formName);

    const parent = ins.closest('.form-popup-overlay');
    if (!parent) return;

    const videoEl = parent.querySelector('video');
    const ctaEl = parent.querySelector('.form-popup-success-cta');
    const insEl = parent.querySelector('.intereseted-cta');

    if (videoEl) videoEl.style.display = 'none';
    if (ctaEl) ctaEl.style.display = 'none';
    if (insEl) insEl.style.display = 'none';

    const wrapper = document.createElement('div');
    wrapper.className = 'thank-you-pop-two';

    wrapper.innerHTML = `
      <img class="thank-img-desk" src="${THANK_YOU_TWO_DESKTOP}" alt="thank you" />
      <img class="thank-img-mob" src="${THANK_YOU_TWO_MOB}" alt="thank you" />
      <a class="explore-now-rewamp" href="${THANK_YOU_CTA_LINK}" target="_blank">
        Explore Now
      </a>
    `;

    const rewampCta = wrapper.querySelector('.explore-now-rewamp');
    rewampCta?.addEventListener('click', () => {
      trackExploreNowCTA(THANK_YOU_CTA_LINK);
    });

    parent.appendChild(wrapper);
  });

  video.addEventListener('ended', () => {
    video.pause();
  });

  closeBtn.addEventListener('click', () => {
    closeActivePopup(block, overlay, video);
  });

  overlay.append(closeBtn, video, cta, ins);

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
                class="form-error-popup__button trackCTA"
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

function trackFormSubmission(form) {
  const formData = {
    "formName": formName,
    "campaignId": campaignId,
    "pincode": form.querySelector("#enquire-pincode")?.value?.trim() || '',
    "whatsappOptIn": form.querySelector('[name="updateMeOnWhatsapp"]')?.checked ? 'Y' : 'N',
    "contruction": form.querySelector('[name="constructionWorkGoingOn"]')?.checked ? 'Yes' : 'No',
    "localpainter": form.querySelector('[name="localPainterHired"]')?.checked ? 'Yes' : 'No'
  };
  getDigitalData().form = formData;
  trackEvent("form_submit", formData);
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

  const loaderEl = submitBtn.querySelector('.rotating');
  submitBtn.dataset.submitBound = 'true';

  submitBtn.addEventListener('click', (event) => {
    event.preventDefault();

    if (row.dataset.submitting === 'true') return;

    const inputs = row.querySelectorAll('.form-input');
    let isValid = true;

    inputs.forEach((input) => {
      const validField = validateInputField(input, true);
      if (!validField) {
        isValid = false;
      }
    });

    if (!isValid) return;

    row.dataset.submitting = 'true';
    submitBtn.disabled = true;
    loaderEl?.classList.remove('d-none');

    submitLeadFromForm(row, {
      resourcePath: row.getAttribute('data-attr-resourcePath') || formNodePath || window.location.pathname || '',
      campaignId,
      selectors: {
        name: '#enquire-name',
        email: '#enquire-email',
        mobile: '#enquire-mobile',
        pincode: '#enquire-pincode',
      },
    })
      .then(() => {
        showThankYouScreen(block);
        trackFormSubmission(row);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Default form submission failed', err);
        showErrorScreen(block);
      })
      .finally(() => {
        row.dataset.submitting = 'false';
        submitBtn.disabled = false;
        loaderEl?.classList.add('d-none');
      });
  });
}

/**
 * Render form block
 */
function renderForm(block) {
  extractFormConfig(block);

  const rows = [...block.children];
  if (rows.length < 3) return;

  const descriptionRow = rows[0];
  const labelsRow = rows[1];
  const inputsRow = rows[2];

  if (!descriptionRow || !labelsRow || !inputsRow) return;

  const descriptionCells = [...descriptionRow.children];
  const labelCells = [...labelsRow.children];
  const inputCellsSource = [...inputsRow.children];

  // Consent rows now come from authoring
  const consentRows = rows.slice(3, 6);
  const consentConfig = getConsentConfig(consentRows);

  // Extract error images from row 7
  if (rows.length >= 7) {
    const errorImagesRow = rows[6];
    const errorImagesCells = [...errorImagesRow.children];

    const desktopImgEl = errorImagesCells[0]?.querySelector('img');
    const desktopLinkEl = errorImagesCells[0]?.querySelector('a');
    const desktopErrorImage = desktopImgEl?.src || desktopLinkEl?.href || errorImagesCells[0]?.textContent?.trim();

    if (desktopErrorImage) {
      ERROR_DESKTOP_IMAGE = desktopErrorImage;
    }

    const mobileImgEl = errorImagesCells[1]?.querySelector('img');
    const mobileLinkEl = errorImagesCells[1]?.querySelector('a');
    const mobileErrorImage = mobileImgEl?.src || mobileLinkEl?.href || errorImagesCells[1]?.textContent?.trim();

    if (mobileErrorImage) {
      ERROR_MOBILE_IMAGE = mobileErrorImage;
    }

    errorImagesRow.style.display = 'none';
  }

  descriptionRow.style.display = 'none';
  labelsRow.style.display = 'none';
  inputsRow.style.display = 'none';

  consentRows.forEach((row) => {
    if (row) row.style.display = 'none';
  });

  const formRow = document.createElement('div');
  formRow.className = 'form-row form-attributes';
  formRow.setAttribute('data-attr-resourcePath', formNodePath || window.location.pathname || '');

  const descriptionCell = document.createElement('div');
  descriptionCell.className = 'form-description-cell';
  populateDescriptionCell(descriptionCell, descriptionCells);

  const fieldsArea = document.createElement('div');
  fieldsArea.className = 'form-fields-area d-flex flex-column';

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
    button.innerHTML = `
      <span class="form-submit__label">${buttonLabel}</span>
      <span class="form-submit__arrow" aria-hidden="true"></span>
      <span class="rotating d-none" aria-hidden="true">↻</span>
    `;
    buttonCell.appendChild(button);
  }

  if (!inputsGrid.children.length) return;

  fieldsArea.appendChild(inputsGrid);

  const consentArea = createConsentArea(consentConfig);
  fieldsArea.appendChild(consentArea);

  // Check WhatsApp by default only if the field is visible
  const whatsappCheckbox = consentArea.querySelector('[name="updateMeOnWhatsapp"]');
  const whatsappWrapper = whatsappCheckbox?.closest('.form-consent-item');
  if (whatsappCheckbox && whatsappWrapper && !whatsappWrapper.classList.contains('d-none')) {
    whatsappCheckbox.checked = true;
  }

  if (buttonCell.children.length) {
    fieldsArea.appendChild(buttonCell);
  }

  formRow.appendChild(descriptionCell);
  formRow.appendChild(fieldsArea);

  formRow.addEventListener('focusin', function (e) {
    if (!formStarted && e.target.tagName === 'INPUT') {
      formStarted = true;
      trackEvent("form_start", {
        "formName": formName,
        "campaignId": campaignId
      });
    }
  });

  block.appendChild(formRow);

  if (buttonCell.children.length) {
    bindSubmitHandler(block, formRow, buttonCell);
  }
}

export default function decorate(block) {
  applyBootstrapHelpers(block);
  renderForm(block);
}