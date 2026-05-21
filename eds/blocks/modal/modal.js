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

  let submitButtonObserver;

  if (isBookFreeSiteVisitModal) {
    dialog.classList.add('book-free-site-visit-dialog');

    // Try immediately
    if (!updateExitIntentSubmitText()) {
      // If form/button is added later, observe modal content
      submitButtonObserver = new MutationObserver(() => {
        if (updateExitIntentSubmitText()) {
          submitButtonObserver.disconnect();
        }
      });

      submitButtonObserver.observe(dialogContent, {
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
    window.activeModalElement = null;

    if (submitButtonObserver) {
      submitButtonObserver.disconnect();
    }

    block.remove();
  });

  block.innerHTML = '';
  block.append(dialog);

  return {
    block,
    showModal: () => {
      // Apply again when modal opens, in case button text got reset
      updateExitIntentSubmitText();

      dialog.showModal();
      setTimeout(() => {
        dialogContent.scrollTop = 0;
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
