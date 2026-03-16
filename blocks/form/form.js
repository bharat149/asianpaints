import { submitLeadFromForm } from '../../scripts/form-submit-common.js';

// SVG icons for calculator options
const ICONS = {
  freshPainting: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.41 4.59L17 3.17 10.24 9.93c-.55-.16-1.14-.13-1.69.09-1.13.46-1.77 1.64-1.55 2.87.22 1.23 1.24 2.16 2.49 2.25.17.01.34 0 .51-.02.54-.08 1.05-.32 1.45-.72.44-.44.69-1.02.69-1.64 0-.32-.07-.62-.21-.9l6.73-6.73 1.06 1.06 1.42-1.42-2.73-2.45zM5 20v-2h2v2H5zm6-5v5H9v-5h2zm4 5v-8h2v8h-2zm4-10v10h2V10h-2z"/></svg>`,
  repainting: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
  interior: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`,
  exterior: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/></svg>`,
};

/**
 * Check if block is calculator variant
 */
function isCalculatorVariant(block) {
  return block.classList.contains('calculator');
}

/**
 * Render calculator variant - Cream card with horizontal layout
 * Layout: Title on left | Form on right (options row + input row)
 */
function renderCalculator(block) {
  const row = block.children[0];
  if (!row) return;

  const contentCell = row.children[0];
  if (!contentCell) return;

  const link = contentCell.querySelector('a');

  // Create the two-column layout
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

  // Create form body
  const body = document.createElement('div');
  body.className = 'form-calc-body';

  // ===== OPTIONS ROW: Project Type + Space side by side =====
  const optionsRow = document.createElement('div');
  optionsRow.className = 'form-calc-options-row';

  // Project Type field
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

  // Space field
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

  // ===== INPUT ROW: Area label + input + button =====
  const inputRow = document.createElement('div');
  inputRow.className = 'form-calc-input-row';

  // Area input wrapper
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

  // Submit button
  const submitBtn = document.createElement('button');
  submitBtn.className = 'form-calc-submit';
  submitBtn.type = 'button';
  submitBtn.textContent = 'Calculate now';
  inputRow.appendChild(submitBtn);

  body.appendChild(inputRow);

  // Add click handlers for options
  addOptionClickHandlers(body);

  // Add submit handler
  if (link) {
    submitBtn.addEventListener('click', () => {
      window.location.href = link.href;
    });
  }

  // Clear and rebuild block
  block.textContent = '';
  block.appendChild(header);
  block.appendChild(body);
}

/**
 * Create an option button with icon
 */
function createOption(label, iconSvg, value) {
  const option = document.createElement('button');
  option.type = 'button';
  option.className = 'form-calc-option';
  option.setAttribute('data-value', value);

  const iconWrapper = document.createElement('span');
  iconWrapper.className = 'form-calc-option-icon';
  iconWrapper.innerHTML = iconSvg;

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
        // Remove selected from siblings
        options.forEach((opt) => opt.classList.remove('selected'));
        // Add selected to clicked
        option.classList.add('selected');
      });
    });
  });
}

/**
 * Render default form variant
 */
function renderDefaultForm(block) {
  const rows = [...block.children];
  if (!rows || rows.length === 0) return;

  // Get header row for content reference
  const headerRow = rows[0];
  if (!headerRow) return;

  const headerCells = [...headerRow.children];

  // Process all rows
  rows.forEach((row, rowIdx) => {
    if (rowIdx === 0) {
      // Hide header row
      row.style.display = 'none';
      return;
    }

    row.classList.add('form-row');
    const cells = [...row.children];

    // Create containers for layout
    let descriptionCell = null;
    const inputCells = [];
    let buttonCell = null;

    cells.forEach((cell, cellIdx) => {
      const content = cell.textContent.trim();
      const headerCell = headerCells[cellIdx];

      // First cell is the description text
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

      // Check if header cell has a button link
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
      } else if (content && content.length > 0) {
        cell.classList.add('form-input-cell');
        const input = document.createElement('input');

        let inputType = 'text';
        let inputId = '';
        let inputName = '';
        if (headerCell) {
          const headerLabel = headerCell.textContent.toLowerCase();
          if (headerLabel.includes('phone')) {
            inputType = 'tel';
            inputId = 'enquire-mobile';
            inputName = 'ENQUIRE_MOBILE';
            input.inputMode = 'numeric';
            input.pattern = '[1-9][0-9]{9}';
            input.maxLength = 10;
          } else if (headerLabel.includes('email')) {
            inputType = 'email';
            inputId = 'enquire-email';
            inputName = 'ENQUIRE_EMAIL';
          } else if (headerLabel.includes('pin')) {
            inputType = 'text';
            inputId = 'enquire-pincode';
            inputName = 'ENQUIRE_PINCODE';
            input.inputMode = 'numeric';
            input.pattern = '[0-9]{6}';
            input.maxLength = 6;
          } else if (headerLabel.includes('name')) {
            inputType = 'text';
            inputId = 'enquire-name';
            inputName = 'ENQUIRE_NAME';
            input.pattern = '[A-Za-z ]{2,}';
          }
        }

        input.type = inputType;
        input.placeholder = content;
        input.className = 'form-input';
        if (inputId) input.id = inputId;
        if (inputName) input.name = inputName;
        input.required = true;
        cell.textContent = '';
        cell.appendChild(input);
        inputCells.push(cell);
      } else {
        cell.classList.add('form-empty-cell');
      }
    });

    // Restructure: wrap inputs in a grid container
    if (inputCells.length > 0) {
      const fieldsArea = document.createElement('div');
      fieldsArea.className = 'form-fields-area';
      row.classList.add('form-attributes');
      row.setAttribute('data-attr-resourcePath', window.location.pathname || '');

      const inputsGrid = document.createElement('div');
      inputsGrid.className = 'form-inputs-grid';

      inputCells.forEach((inputCell) => {
        inputsGrid.appendChild(inputCell);
      });

      fieldsArea.appendChild(inputsGrid);

      if (buttonCell) {
        fieldsArea.appendChild(buttonCell);
        const submitBtn = buttonCell.querySelector('button.form-submit');
        if (submitBtn) {
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
      }

      // Append to row after description
      if (descriptionCell) {
        row.appendChild(fieldsArea);
      }
    }
  });
}

export default function decorate(block) {
  // Remove dark-blue class from parent section to prevent inherited background
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
