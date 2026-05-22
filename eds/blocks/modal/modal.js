import { loadFragment } from '../fragment/fragment.js';
import {
  buildBlock, decorateBlock, loadBlock, loadCSS,
} from '../../scripts/aem.js';

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

  const configSection = document.querySelector(
    'main [data-exit-intent-form-button-text]'
  );
  const exitIntentButtonText = configSection?.dataset.exitIntentFormButtonText?.trim();
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

    const titleText = phoneMatch
      ? existingText.replace(phoneMatch[0], '').trim()
      : 'Call us for Painting Services';

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

  let modalContentObserver;

  if (isBookFreeSiteVisitModal) {
    dialog.classList.add('book-free-site-visit-dialog');

    const applyBookFreeSiteVisitUpdates = () => {
      const buttonUpdated = !exitIntentButtonText || updateExitIntentSubmitText();
      const callUsUpdated = updateExitIntentCallUsContent();

      return buttonUpdated && callUsUpdated;
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
    showModal: () => {
      // Apply again when modal opens, in case button text got reset
      if (isBookFreeSiteVisitModal) {
        updateExitIntentSubmitText();
        updateExitIntentCallUsContent();
      }

      dialog.show();
      block.classList.add('modal-open');
      setTimeout(() => {
        block.scrollTop = 0;
      }, 0);
      document.body.classList.add('eds-modal-open');
    },
  };
}

export async function openModal(fragmentUrl) {
  const path = fragmentUrl.startsWith('http')
    ? new URL(fragmentUrl, window.location).pathname
    : fragmentUrl;

  const fragment = await loadFragment(path);
  const { showModal } = await createModal(fragment.childNodes);
  showModal();
}
