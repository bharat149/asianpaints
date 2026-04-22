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
// window.modalHandler = {
//   // Triggers the full logic to fetch fragment and create modal
//   showModal() {
//     window.triggerExitIntentPopupForm();
//   },

//   // Targets the native <dialog> element stored during creation
//   closeModal() {
//     if (window.activeModalElement) {
//       window.activeModalElement.close();
//     } else {
//       console.warn('No active modal found to close.');
//     }
//   }
// };


/* CHECK TARGET*/

window.modalHandler = window.modalHandler || {};
  const modalHandler = window.modalHandler;

  function initModalHandlers() {
    document.addEventListener('click', function (e) {
      const closeBtn = e.target.closest("[data-bs-dismiss='modal'], [data-dismiss='modal']");
      if (closeBtn) {
        const modal = closeBtn.closest('.modal');
        if (modal) {
          modalHandler.closeModal(modal);
        }
      }
    });

    document.querySelectorAll(".modal").forEach((modal) => {
      modal.classList.add("fade-scale");
    });

    if (!document.querySelector(".modal-backdrop")) {
      const backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop fade";
      backdrop.style.display = "none";
      document.body.appendChild(backdrop);
    }

    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", function (event) {
        if (modal.id !== "splash-popup" && modal.classList.contains("in")) {
          const target = event.target;
          if (
            window.getComputedStyle(target).display !== "none" &&
            target.classList.contains("modal")
          ) {
            modalHandler.closeModal(modal);
          }
        }
      });
    });
  }

  modalHandler.showModal = function (modalOrSelector) {
    const modal = typeof modalOrSelector === "string"
      ? document.querySelector(modalOrSelector)
      : modalOrSelector;

    if (!modal) {
      console.error("Modal not found:", modalOrSelector);
      return;
    }

    modal.style.display = "block";

    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) {
      backdrop.style.display = "block";
      backdrop.classList.add("show");
    }

    document.body.classList.add("modal-open");
    modal.classList.add("in");
  };

  modalHandler.closeModal = function (modalOrSelector) {
    const modal = typeof modalOrSelector === "string"
      ? document.querySelector(modalOrSelector)
      : modalOrSelector;

    if (!modal) {
      console.error("Modal not found:", modalOrSelector);
      return;
    }

    modal.classList.remove("in");
    modal.style.display = "none";
    document.body.classList.remove("modal-open");

    const backdrop = document.querySelector(".modal-backdrop");
    if (backdrop) {
      backdrop.style.display = "none";
      backdrop.classList.remove("show");
    }
  };

  initModalHandlers();

