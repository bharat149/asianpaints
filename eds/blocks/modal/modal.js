import { loadFragment } from '../fragment/fragment.js';
import {
  buildBlock, decorateBlock, loadBlock, loadCSS,
} from '../../scripts/aem.js';
import { getCookieValues } from '../../scripts/form-submit-common.js';
import { trackEvent } from '../../scripts/analytics_1.js';
/*
  This is not a traditional block, so there is no decorate function.
  Instead, links to a /modals/ path are automatically transformed into a modal.
  Other blocks can also use the createModal() and openModal() functions.
*/

export async function createModal(contentNodes) {
  await loadCSS(`${window.hlx.codeBasePath}/blocks/modal/modal.css`);
  const dialog = document.createElement('dialog');
  const dialogContent = document.createElement('div');
  dialogContent.classList.add('modal-content');
  dialogContent.append(...contentNodes);

  const isBookFreeSiteVisitModal = dialogContent.querySelector( 
    '.book-free-site-visit-modal, .book-free-site-visit-form'
  );

  const exitIntentButtonText = document
    .querySelector('main [data-exit-intent-form-button-text]')
    ?.dataset
    .exitIntentFormButtonText
    ?.trim();

  const exitIntentCallUsTitle = document
    .querySelector('main [data-exit-intent-form-callus-title]')
    ?.dataset
    .exitIntentFormCallusTitle
    ?.trim();

  const updateExitIntentSubmitText = () => {
    if (!isBookFreeSiteVisitModal || !exitIntentButtonText) return false;
    const submitButton = dialogContent.querySelector(
      '.book-free-site-visit-modal button[type="submit"], .book-free-site-visit-form button[type="submit"], .lead-form-fields.submit-wrapper button[type="submit"]'
    );
    if (!submitButton) return false;
    submitButton.textContent = exitIntentButtonText;
    submitButton.setAttribute('data-original-text', exitIntentButtonText);
    return true;
  };

  // exitintent title change
  const updateExitIntentCallUsContent = () => {
    if (!isBookFreeSiteVisitModal) return false;

    const callUsText = dialogContent.querySelector(
      '.lead-form-container .default-content-wrapper p'
    );

    if (!callUsText) return false;

    // Avoid updating same paragraph again
    if (callUsText.dataset.exitPopupCallUsUpdated === 'true') return true;

    const existingText = callUsText.textContent.trim();

    const phoneMatch = existingText.match(/\b\d{4}[-\s]?\d{3}[-\s]?\d{4}\b/);
    const displayPhone = phoneMatch?.[0] || '1800-209-5678';
    const telPhone = displayPhone.replace(/[^\d+]/g, '');

    const defaultCallUsTitle = phoneMatch
    ? existingText.replace(phoneMatch[0], '').trim()
    : 'Call us for Painting Services';

    const titleText = exitIntentCallUsTitle || defaultCallUsTitle;
    const titleSpan = document.createElement('span');
    titleSpan.classList.add('title');
    titleSpan.textContent = titleText;

    const iconWrapper = document.createElement('span');
    iconWrapper.classList.add('exit-popup-call-us--title--icon');

    const phoneLink = document.createElement('a');
    phoneLink.setAttribute('tabindex', '0');
    phoneLink.href = `tel:${telPhone}`;

    const phoneIcon = document.createElement('img');
    phoneIcon.classList.add('call-img');
    phoneIcon.loading = 'lazy';
    phoneIcon.src = '//static.asianpaints.com/content/dam/whatsapp/whatsapp-animated-icon.gif';
    phoneIcon.width = 38;
    phoneIcon.height = 38;
    phoneIcon.alt = 'To paint your home, please give us a call at';
    phoneIcon.title = 'phone-call-desktop';

    const phoneNumber = document.createElement('span');
    phoneNumber.classList.add('mob-num');
    phoneNumber.textContent = displayPhone;

    phoneLink.append(phoneIcon, phoneNumber);
    iconWrapper.append(phoneLink);

    callUsText.replaceChildren(titleSpan, iconWrapper);
    callUsText.dataset.exitPopupCallUsUpdated = 'true';

    return true;
  };

  const isValidCookieValue = (value) => (
  value
  && value !== ''
  && value !== 'undefined'
  && value !== 'null'
);

const setLeadFieldValue = (container, selector, value) => {
  if (!isValidCookieValue(value)) return false;

  const field = container.querySelector(selector);

  if (!field) return false;

  field.value = value;

  field.parentElement?.classList.add('focussed');

  field.closest(
    '.field-wrapper, .input-wrapper, .form-field, .lead-form-fields'
  )?.classList.add('focussed');

  field.dispatchEvent(new Event('input', { bubbles: true }));
  field.dispatchEvent(new Event('change', { bubbles: true }));
  field.dispatchEvent(new Event('blur', { bubbles: true }));

  return true;
};

  const prefillBookFreeSiteVisitCookies = () => {
    if (!isBookFreeSiteVisitModal) return true;

    const cachedFieldVal = getCookieValues('CCFormFields');

    if (!cachedFieldVal) return true;

    const cachedValues = cachedFieldVal.split('|');

    const leadForm = dialogContent.querySelector(
      '.book-free-site-visit-form, .book-free-site-visit-modal, .lead-form-container'
    );

    if (!leadForm) return false;

    if (leadForm.dataset.cookiePrefilled === 'true') return true;

    const hasLeadFields = leadForm.querySelector(
      '#lead-name-1, #lead-email-2, #lead-mobile-3, #lead-pincode-4'
    );

    if (!hasLeadFields) return false;

    setLeadFieldValue(leadForm, '#lead-name-1', cachedValues[0]);
    setLeadFieldValue(leadForm, '#lead-email-2', cachedValues[1]);
    setLeadFieldValue(leadForm, '#lead-mobile-3', cachedValues[2]);
    setLeadFieldValue(leadForm, '#lead-pincode-4', cachedValues[3]);

    leadForm.dataset.cookiePrefilled = 'true';

    return true;
  };

  const prefillLeadFormFromCookies = () => {
  if (!isBookFreeSiteVisitModal) return true;

  const cachedFieldVal = getCookieValues('CCFormFields');

  // No cookie available, so no need to wait for fields
  if (!cachedFieldVal) return true;

  const leadFormContainer = dialogContent.querySelector(
    '.lead-form-container, .book-free-site-visit-form, .book-free-site-visit-modal'
  );

  if (!leadFormContainer) return false;

  const hasCookieFields = leadFormContainer.querySelector(
    '#enquire-name, #enquire-email, #enquire-mobile, #enquire-pincode'
  );

  if (!hasCookieFields) return false;

  // Avoid running again and again
  if (leadFormContainer.dataset.cookiePrefilled === 'true') return true;

  checkCookieValues(leadFormContainer);

  // Trigger validations / floating label logic / CTA enable-disable logic
  leadFormContainer
    .querySelectorAll('#enquire-name, #enquire-email, #enquire-mobile, #enquire-pincode')
    .forEach((field) => {
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
      field.dispatchEvent(new Event('blur', { bubbles: true }));
    });

  leadFormContainer.dataset.cookiePrefilled = 'true';

  return true;
};

  let modalContentObserver;

  if (isBookFreeSiteVisitModal) {
    dialog.classList.add('book-free-site-visit-dialog');

    const applyBookFreeSiteVisitUpdates = () => {
      const buttonUpdated = !exitIntentButtonText || updateExitIntentSubmitText();
      const callUsUpdated = updateExitIntentCallUsContent();
      const cookiesPrefilled = prefillBookFreeSiteVisitCookies();

      return buttonUpdated && callUsUpdated && cookiesPrefilled;
    };

    // Try immediately
    if (!applyBookFreeSiteVisitUpdates()) {
      // If form/content loads later, observe modal content
      modalContentObserver = new MutationObserver(() => {
        if (applyBookFreeSiteVisitUpdates()) {
          modalContentObserver.disconnect();
        }
      });

      modalContentObserver.observe(dialogContent, {
        childList: true,
        subtree: true,
      });
    }
  }

  dialog.append(dialogContent);
  window.activeModalElement = dialog;

  const closeButton = document.createElement('button');
  closeButton.classList.add('close-button');
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.type = 'button';
  closeButton.innerHTML = '<span class="icon icon-close"></span>';
  closeButton.addEventListener('click', () => dialog.close());
  dialogContent.prepend(closeButton);

  const block = buildBlock('modal', '');
  document.querySelector('main').append(block);
  decorateBlock(block);
  await loadBlock(block);

  dialog.addEventListener('click', (e) => {
    const {
      left, right, top, bottom,
    } = dialog.getBoundingClientRect();
    const { clientX, clientY } = e;
    if (clientX < left || clientX > right || clientY < top || clientY > bottom) {
      dialog.close();
    }
  });

  dialog.addEventListener('close', () => {
    // e277 - Exit Intent Popup Close (only when this is the exit-intent modal)
    if (isBookFreeSiteVisitModal) {
      trackEvent('Exit Intent Popup Close');
    }

    document.body.classList.remove('eds-modal-open');
    block.classList.remove('modal-open');
    window.activeModalElement = null;

    if (modalContentObserver) {
      modalContentObserver.disconnect();
    }

    block.remove();
  });

  block.innerHTML = '';
  block.append(dialog);
  block.addEventListener('click', (e) => {
  if (e.target === block) {
    dialog.close();
  }
});

  return {
    block,
    showModal: (options = {}) => {
      // Apply again when modal opens, in case button text got reset
      if (isBookFreeSiteVisitModal) {
        updateExitIntentSubmitText();
        updateExitIntentCallUsContent();
        prefillLeadFormFromCookies();
        // e359 - Exit Intent pop-up impression. Only fire when the modal
        // is opened by a GENUINE exit-intent trigger. When the same modal
        // is opened via a CTA (e.g. the sticky "Book Free Site Visit"
        // button, which already fires sticky_cta_click / event278), this
        // impression must NOT fire — otherwise the click produces two
        // events. The caller signals intent via trackExitIntentImpression.
        if (options.trackExitIntentImpression) {
          trackEvent('Exit Intent Pop-up Impression');
        }
      }

      dialog.show();
      block.classList.add('modal-open');
      setTimeout(() => {
        block.scrollTop = 0;
         if (isBookFreeSiteVisitModal) {
            prefillLeadFormFromCookies();
         }
      }, 0);
      document.body.classList.add('eds-modal-open');
    },
  };
}

export async function openModal(fragmentUrl, options = {}) {
  const path = fragmentUrl.startsWith('http')
    ? new URL(fragmentUrl, window.location).pathname
    : fragmentUrl;

  const fragment = await loadFragment(path);
  const { showModal } = await createModal(fragment.childNodes);
  showModal(options);
}
