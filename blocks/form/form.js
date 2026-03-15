const ICONS = {
  freshPainting: 'https://static.asianpaints.com/content/dam/apcolourcatalogue/asset/ap-revamp/sps-revamp/mini-pbc-tool/fresh_painting_new_new.webp',
  repainting: 'https://static.asianpaints.com/content/dam/apcolourcatalogue/asset/ap-revamp/sps-revamp/mini-pbc-tool/repainting-new-desk.webp',
  interior: 'https://static.asianpaints.com/content/dam/apcolourcatalogue/asset/ap-revamp/sps-revamp/mini-pbc-tool/interior_new.webp',
  exterior: 'https://static.asianpaints.com/content/dam/apcolourcatalogue/asset/ap-revamp/sps-revamp/mini-pbc-tool/exterior.webp',
};

/**
 * Check if block is calculator variant
 */
function isCalculatorVariant(block) {
  return block.classList.contains('calculator');
}

/**
 * Create an option button with icon
 */
function createOption(label, iconUrl, value) {
  const option = document.createElement('button');
  option.type = 'button';
  option.className = 'form-calc-option';
  option.setAttribute('data-value', value);

  const iconWrapper = document.createElement('span');
  iconWrapper.className = 'form-calc-option-icon';

  const img = document.createElement('img');
  img.src = iconUrl;
  img.alt = label;
  img.loading = 'lazy';

  iconWrapper.appendChild(img);

  const labelSpan = document.createElement('span');
  labelSpan.textContent = label;

  option.appendChild(iconWrapper);
  option.appendChild(labelSpan);

  return option;
}

/**
 * Add click handlers for option buttons
 */
function addOptionClickHandlers(container) {
  const optionGroups = container.querySelectorAll('.form-calc-options');

  optionGroups.forEach((group) => {
    const options = group.querySelectorAll('.form-calc-option');

    options.forEach((option) => {
      option.addEventListener('click', () => {
        options.forEach((opt) => opt.classList.remove('selected'));
        option.classList.add('selected');
      });
    });
  });
}

/**
 * Render calculator variant
 */
function renderCalculator(block) {
  const row = block.children[0];
  if (!row) return;

  const contentCell = row.children[0];
  if (!contentCell) return;

  const link = contentCell.querySelector('a');

  const header = document.createElement('div');
  header.className = 'form-calc-header';

  const titleSmall = document.createElement('div');
  titleSmall.className = 'form-calc-title-small';
  titleSmall.textContent = 'Painting Quotation Calculator';

  const titleLarge = document.createElement('h2');
  titleLarge.className = 'form-calc-title-large';
  titleLarge.textContent = 'Get instant budget estimates';

  header.appendChild(titleSmall);
  header.appendChild(titleLarge);

  const body = document.createElement('div');
  body.className = 'form-calc-body';

  const optionsRow = document.createElement('div');
  optionsRow.className = 'form-calc-options-row';

  const projectField = document.createElement('div');
  projectField.className = 'form-calc-field';

  const projectLabel = document.createElement('label');
  projectLabel.className = 'form-calc-label';
  projectLabel.innerHTML = '1. Select your type of project<span class="required">*</span>';
  projectField.appendChild(projectLabel);

  const projectOptions = document.createElement('div');
  projectOptions.className = 'form-calc-options';
  projectOptions.setAttribute('data-field', 'project-type');

  projectOptions.appendChild(createOption('Fresh Painting', ICONS.freshPainting, 'fresh'));
  projectOptions.appendChild(createOption('Repainting', ICONS.repainting, 'repaint'));
  projectField.appendChild(projectOptions);
  optionsRow.appendChild(projectField);

  const spaceField = document.createElement('div');
  spaceField.className = 'form-calc-field';

  const spaceLabel = document.createElement('label');
  spaceLabel.className = 'form-calc-label';
  spaceLabel.innerHTML = '2. Select the space<span class="required">*</span>';
  spaceField.appendChild(spaceLabel);

  const spaceOptions = document.createElement('div');
  spaceOptions.className = 'form-calc-options';
  spaceOptions.setAttribute('data-field', 'space');

  spaceOptions.appendChild(createOption('Interior', ICONS.interior, 'interior'));
  spaceOptions.appendChild(createOption('Exterior', ICONS.exterior, 'exterior'));
  spaceField.appendChild(spaceOptions);
  optionsRow.appendChild(spaceField);

  body.appendChild(optionsRow);

  const inputRow = document.createElement('div');
  inputRow.className = 'form-calc-input-row';

  const inputField = document.createElement('div');
  inputField.className = 'form-calc-input-field';

  const areaLabel = document.createElement('label');
  areaLabel.className = 'form-calc-label';
  areaLabel.innerHTML = '3. Enter total area in SQFT<span class="required">*</span>';
  inputField.appendChild(areaLabel);

  const areaInput = document.createElement('input');
  areaInput.type = 'number';
  areaInput.className = 'form-calc-input';
  areaInput.placeholder = 'Area in SQFT';
  areaInput.min = '1';
  inputField.appendChild(areaInput);
  inputRow.appendChild(inputField);

  const submitBtn = document.createElement('button');
  submitBtn.className = 'form-calc-submit';
  submitBtn.type = 'button';
  submitBtn.textContent = 'Calculate now';
  inputRow.appendChild(submitBtn);

  body.appendChild(inputRow);

  addOptionClickHandlers(body);

  if (link) {
    submitBtn.addEventListener('click', () => {
      window.location.href = link.href;
    });
  }

  block.textContent = '';
  block.appendChild(header);
  block.appendChild(body);
}

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

  field.appendChild(label);
  field.appendChild(input);

  cell.textContent = '';
  cell.appendChild(field);
}

/**
 * Create consent / checkbox area for default form
 */
function createDefaultConsentArea() {
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
 * Render default form variant
 */
function renderDefaultForm(block) {
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
    const cells = [...row.children];

    let descriptionCell = null;
    const inputCells = [];
    let buttonCell = null;

    cells.forEach((cell, cellIdx) => {
      const content = cell.textContent.trim();
      const headerCell = headerCells[cellIdx];
      const headerText = headerCell ? headerCell.textContent.trim() : '';

      if (cellIdx === 0) {
        cell.classList.add('form-description-cell');
        descriptionCell = cell;

        if (!content && headerCell) {
          const descContent = headerCell.innerHTML;

          if (descContent && descContent.includes('Painting Service')) {
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
              } else {
                cell.innerHTML = descContent;
              }
            } else {
              cell.innerHTML = descContent;
            }
          } else if (descContent) {
            cell.innerHTML = descContent;
          }
        }

        return;
      }

      const headerLink = headerCell ? headerCell.querySelector('a') : null;

      if (headerLink && !content) {
        const button = document.createElement('button');
        button.textContent = headerLink.textContent.trim();
        button.className = 'form-submit';
        button.type = 'button';

        cell.textContent = '';
        cell.appendChild(button);
        cell.classList.add('form-button-cell');
        buttonCell = cell;
        return;
      }

      if (content) {
        cell.classList.add('form-input-cell');
        createDefaultField(cell, rowIdx, cellIdx, headerText, content);
        inputCells.push(cell);
      } else {
        cell.classList.add('form-empty-cell');
      }
    });

    if (inputCells.length > 0) {
      const fieldsArea = document.createElement('div');
      fieldsArea.className = 'form-fields-area';

      const inputsGrid = document.createElement('div');
      inputsGrid.className = 'form-inputs-grid';

      inputCells.forEach((inputCell) => {
        inputsGrid.appendChild(inputCell);
      });

      fieldsArea.appendChild(inputsGrid);
      fieldsArea.appendChild(createDefaultConsentArea());

      if (buttonCell) {
        fieldsArea.appendChild(buttonCell);
      }

      if (descriptionCell) {
        row.appendChild(fieldsArea);
      }
    }
  });
}

export default function decorate(block) {
  const section = block.closest('.section');
  if (section) {
    section.classList.remove('dark-blue');
  }

  if (isCalculatorVariant(block)) {
    renderCalculator(block);
  } else {
    renderDefaultForm(block);
  }
}