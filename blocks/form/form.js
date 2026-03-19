import { submitLeadFromForm } from '../../scripts/form-submit-common.js';

/**
 * Create default form field
 */
function createDefaultField(cell, rowIdx, cellIdx, labelText, placeholderText) {
  const field = document.createElement('div');
  field.className = 'form-field';

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
  input.className = 'form-input';
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
  consentArea.className = 'form-consent-area';

  consentArea.innerHTML = `
    <div class="form-consent-options">
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
 * Bind submit handler
 */
function bindSubmitHandler(row, buttonCell) {
  const submitBtn = buttonCell?.querySelector('button.form-submit');
  if (!submitBtn) return;

  submitBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const inputs = row.querySelectorAll('.form-input');
    const isValid = [...inputs].every((input) => input.reportValidity());

    if (!isValid) return;

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
        console.error('Default form submission failed', err);
      })
      .finally(() => {
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

    row.classList.add('form-row');
    row.classList.add('form-attributes');
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
        button.className = 'form-submit';
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
    fieldsArea.className = 'form-fields-area';

    const inputsGrid = document.createElement('div');
    inputsGrid.className = 'form-inputs-grid';

    inputCells.forEach((inputCell) => {
      inputsGrid.appendChild(inputCell);
    });

    fieldsArea.appendChild(inputsGrid);
    fieldsArea.appendChild(createConsentArea());

    if (buttonCell) {
      fieldsArea.appendChild(buttonCell);
      bindSubmitHandler(row, buttonCell);
    }

    row.appendChild(fieldsArea);
  });
}

export default function decorate(block) {
  const section = block.closest('.section');
  if (section) {
    section.classList.remove('dark-blue');
  }

  renderForm(block);
}