/**
 * Hero Form Block - Split layout hero with contact form
 * Displays background image with text overlay and lead capture form
 */

function createFormHTML() {
  return `
    <div class="hero-form-panel">
      <h2 class="hero-form-panel-heading">Let our experts help you!</h2>
      <form class="hero-form-contact">
        <div class="hero-form-field hero-form-field-full">
          <input type="text" name="name" placeholder="Enter full name" required>
        </div>
        <div class="hero-form-field hero-form-field-full">
          <input type="email" name="email" placeholder="Enter email id" required>
        </div>
        <div class="hero-form-row">
          <div class="hero-form-field hero-form-field-phone">
            <span class="hero-form-country-code">+91</span>
            <input type="tel" name="mobile" placeholder="Enter mobile no" required>
          </div>
          <div class="hero-form-field">
            <input type="text" name="pincode" placeholder="Enter pin code" required>
          </div>
        </div>
        <div class="hero-form-options">
          <label class="hero-form-whatsapp">
            <input type="checkbox" name="whatsapp" checked>
            <span class="hero-form-toggle"></span>
            <span class="hero-form-whatsapp-text">Update me on WhatsApp</span>
          </label>
          <p class="hero-form-disclaimer">By proceeding, you are authorizing Asian Paints and its suggested contractors to get in touch with you through calls, sms, or e-mail</p>
        </div>
        <button type="submit" class="hero-form-submit">
          Get free design consultation
          <span class="hero-form-arrow">→</span>
        </button>
      </form>
    </div>
  `;
}

export default function decorate(block) {
  const rows = [...block.children];

  // Extract content from rows
  let picture = null;
  let heading = '';
  let subheading = '';
  let ctaText = '';
  let ctaLink = '#';

  rows.forEach((row) => {
    const cols = [...row.children];
    cols.forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        picture = pic;
      }

      const h1 = col.querySelector('h1, h2, h3');
      if (h1 && !heading) {
        heading = h1.textContent;
      }

      const p = col.querySelector('p:not(:has(a))');
      if (p && !subheading) {
        subheading = p.textContent;
      }

      const link = col.querySelector('a');
      if (link) {
        ctaText = link.textContent;
        ctaLink = link.href;
      }
    });
  });

  // Build the hero structure
  block.innerHTML = '';

  // Background image container (image already contains text overlay)
  if (picture) {
    const bgContainer = document.createElement('div');
    bgContainer.className = 'hero-form-background';
    bgContainer.appendChild(picture);
    block.appendChild(bgContainer);
  }

  // Form panel (right side)
  const formWrapper = document.createElement('div');
  formWrapper.className = 'hero-form-panel-wrapper';
  formWrapper.innerHTML = createFormHTML();
  block.appendChild(formWrapper);

  // Handle form submission
  const form = block.querySelector('.hero-form-contact');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Handle form submission - can be customized
      // eslint-disable-next-line no-alert
      alert('Thank you for your interest! We will contact you shortly.');
    });
  }
}
