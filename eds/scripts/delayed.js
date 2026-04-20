// add delayed functionality here

/**
 * Global function to trigger the exit-intent modal from any CTA with class 'trigger-exit-intent-popup-form'
 * Can be called from JavaScript, Target, or data attributes
 */

const EXIT_INTENT_PATH = '/eds/forms/book-free-site-visit';

window.triggerExitIntentModal = async function triggerExitIntentModal(modalPath = EXIT_INTENT_PATH) {
  try {
    // eslint-disable-next-line import/no-cycle
    const { openModal } = await import('../blocks/modal/modal.js');
    await openModal(modalPath);
  } catch (e) {
    console.error('Failed to trigger exit-intent modal:', e);
  }
};

// Expose this globally too, so it can be called from DevTools if needed
window.triggerExitIntentPopupForm = function triggerExitIntentPopupForm() {
  window.triggerExitIntentModal();
};

// Global click listener for all trigger buttons
function setupGlobalClickListener() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.trigger-exit-intent-popup-form');
    if (!trigger) return;

    e.preventDefault();
    window.triggerExitIntentPopupForm();
  });
}

setupGlobalClickListener();

// Below is the function with same name in aem code to allow Target to call it directly.
window.modalHandler = {
  // Triggers the full logic to fetch fragment and create modal
  showModal() {
    window.triggerExitIntentPopupForm();
  },

  // Targets the native <dialog> element stored during creation
  closeModal() {
    if (window.activeModalElement) {
      window.activeModalElement.close();
    } else {
      console.warn('No active modal found to close.');
    }
  }
};
