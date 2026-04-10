const modalHandler = {};

// INIT FUNCTION
export function initModalHandlers() {
  // Close button click
  document.querySelectorAll("a[data-dismiss='modal']").forEach((el) => {
    el.addEventListener("click", function () {
      const modal = el.closest(".modal");
      modalHandler.closeModal(modal);
    });
  });

  // Add animation class
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.classList.add("fade-scale");
  });

  // Create backdrop if not exists
  if (!document.querySelector(".modal-backdrop")) {
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop fade";
    backdrop.style.display = "none";
    document.body.appendChild(backdrop);
  }

  // Click outside to close
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", function (event) {
      if (
        modal.id !== "splash-popup" &&
        modal.classList.contains("in")
      ) {
        event.stopPropagation();

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


// SHOW MODAL
modalHandler.showModal = function (modal) {
  if (!modal) return;

  modal.style.display = "block";

  const backdrop = document.querySelector(".modal-backdrop");
  if (backdrop) {
    backdrop.style.display = "block";
    backdrop.classList.add("show");
  }

  document.body.classList.add("modal-open");
  modal.classList.add("in");

  // Lazy load (keep as-is)
  if (window.ccGlobal?.customLazyLoad?.cclazyLoad) {
    window.ccGlobal.customLazyLoad.cclazyLoad(500);
  }
};


// CLOSE MODAL
modalHandler.closeModal = function (modal) {
  if (!modal) return;

  // Splash flag
  const splash = document.querySelector(
    ".splash-modal-container #splash-popup"
  );
  if (splash) {
    splash.setAttribute("data_attr_splashStatus", "true");
  }

  modal.classList.remove("in");
  document.body.classList.remove("modal-open");

  const backdrop = document.querySelector(".modal-backdrop");

  // Special condition handling
  const unifiedSearch = document.querySelector(
    "#unified-search-popup.modal.in"
  );

  const otherModals =
    document.querySelector("#exitPopupmodal.modal") ||
    document.querySelector("#GlobalShareWithNumberModal.modal") ||
    document.querySelector("#navpincodemodal.modal");

  if (unifiedSearch && otherModals) {
    if (backdrop) {
      backdrop.style.display = "block";
      backdrop.classList.add("show");
    }
    document.body.classList.add("modal-open");
  } else {
    modal.style.display = "none";

    if (backdrop) {
      backdrop.style.display = "none";
      backdrop.classList.remove("show");
    }
  }

  // Reset fields
  modal
    .querySelectorAll(
      "input[data-form-validation], textarea[data-form-validation], select[data-form-validation]"
    )
    .forEach((field) => {
      if (typeof formResetState === "function") {
        formResetState(field, field.dataset.fieldType);
      }
    });

  // Reset forms
  modal.querySelectorAll("form").forEach((form) => form.reset());

  // OTP reset
  const resendOtp = modal.querySelector(".resend-otp");
  if (resendOtp) {
    resendOtp.classList.add("resend-wait");

    const active = resendOtp.querySelector(".resend-active");
    if (active) active.style.display = "none";
  }
};

export default modalHandler;