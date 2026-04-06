/**
 * Lead Form Block
 * Supports both JSON-based form definitions and HTML table structure.
 * Special handling for "book-free-site-visit" form with WhatsApp toggle,
 * mobile prefix, and radio pill questions.
 */

const BOOK_FREE_SITE_VISIT_FORM = 'book-free-site-visit';
const DEFAULT_SUCCESS_MESSAGE = 'Thank you! We will contact you soon.';
const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';

function normalizeText(value = '') {
  return `${value}`.replace(/\s+/g, ' ').trim();
}

function slugify(value = 'field') {
  return normalizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'field';
}

function toBoolean(value) {
  if (typeof value === 'boolean') return value;
  const normalized = normalizeText(value).toLowerCase();
  return ['true', 'x', 'yes', 'on'].includes(normalized);
}

function parseList(value) {
  const normalized = normalizeText(value);
  return normalized ? normalized.split(',').map((entry) => normalizeText(entry)) : [];
}

function inferInputType(rawField) {
  const rawType = normalizeText(rawField?.Type).toLowerCase() || 'text';
  if (['email', 'tel', 'hidden', 'checkbox', 'radio', 'submit', 'plaintext'].includes(rawType)) {
    return rawType;
  }
  return rawType;
}

function createField(rawField, index) {
  const name = normalizeText(rawField?.Name) || `field-${index + 1}`;
  const type = inferInputType(rawField);
  const label = normalizeText(rawField?.Label || rawField?.Name || '');
  const placeholder = normalizeText(rawField?.Placeholder);
  const description = normalizeText(rawField?.Description);
  const options = parseList(rawField?.Options);
  const optionNames = parseList(rawField?.OptionNames);
  const value = rawField?.Value ?? '';
  const maxLength = rawField?.Max !== '' && rawField?.Max != null ? Number(rawField.Max) : null;

  return {
    id: `lead-${slugify(name)}-${index + 1}`,
    name,
    type,
    label,
    placeholder,
    description,
    value,
    required: toBoolean(rawField?.Mandatory),
    checked: toBoolean(rawField?.Checked) || (type === 'checkbox' && value !== ''),
    maxLength: Number.isNaN(maxLength) ? null : maxLength,
    options: options.map((opt, i) => ({
      label: optionNames[i] || opt,
      value: opt,
    })),
  };
}

/* ========== Field Renderers ========== */

function createTextField(field, showRequiredMarker = true) {
  const wrapper = document.createElement('div');
  wrapper.className = `field-wrapper field-${field.name}`;
  wrapper.dataset.required = field.required ? 'true' : 'false';

  const label = document.createElement('label');
  label.setAttribute('for', field.id);
  label.textContent = showRequiredMarker && field.required ? `${field.label} *` : field.label;

  const input = document.createElement('input');
  let inputType = 'text';
  if (field.type === 'tel') inputType = 'tel';
  else if (field.type === 'email') inputType = 'email';
  input.type = inputType;
  input.id = field.id;
  input.name = field.name;
  input.placeholder = field.placeholder;
  input.required = field.required;
  input.autocomplete = 'off';

  if (field.maxLength) input.maxLength = field.maxLength;

  wrapper.append(label, input);
  return wrapper;
}

function createMobileField(field) {
  const wrapper = document.createElement('div');
  wrapper.className = `field-wrapper field-${field.name}`;
  wrapper.dataset.required = field.required ? 'true' : 'false';

  const label = document.createElement('label');
  label.setAttribute('for', field.id);
  label.textContent = field.required ? `${field.label} *` : field.label;

  const row = document.createElement('div');
  row.className = 'mobile-field-row';

  const prefix = document.createElement('div');
  prefix.className = 'mobile-prefix';

  const flag = document.createElement('span');
  flag.className = 'mobile-flag';
  flag.setAttribute('aria-hidden', 'true');

  const code = document.createElement('span');
  code.className = 'mobile-code';
  code.textContent = field.description || '+91';

  prefix.append(flag, code);

  const input = document.createElement('input');
  input.type = 'tel';
  input.id = field.id;
  input.name = field.name;
  input.placeholder = field.placeholder;
  input.required = field.required;
  input.autocomplete = 'off';
  input.maxLength = 10;
  input.inputMode = 'numeric';

  row.append(prefix, input);
  wrapper.append(label, row);
  return wrapper;
}

function syncWhatsAppToggle(wrapper) {
  const input = wrapper?.querySelector('input[type="checkbox"]');
  const toggle = wrapper?.querySelector('.whatsapp-toggle');
  const state = toggle?.querySelector('.toggle-state');

  if (!input || !toggle || !state) return;

  toggle.classList.toggle('is-checked', input.checked);
  state.textContent = input.checked ? 'ON' : 'OFF';
}

function createWhatsAppField(field) {
  const wrapper = document.createElement('div');
  wrapper.className = `field-wrapper field-${field.name} whatsapp-field`;

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.id = field.id;
  input.name = field.name;
  input.value = 'true';
  input.checked = true;
  input.defaultChecked = true;

  const label = document.createElement('label');
  label.setAttribute('for', field.id);

  const text = document.createElement('span');
  text.className = 'whatsapp-label-text';
  text.textContent = field.label || 'Update me on WhatsApp';

  const toggle = document.createElement('span');
  toggle.className = 'whatsapp-toggle is-checked';
  toggle.setAttribute('aria-hidden', 'true');

  const state = document.createElement('span');
  state.className = 'toggle-state';
  state.textContent = 'ON';
  toggle.append(state);

  label.append(text, toggle);
  wrapper.append(input, label);

  input.addEventListener('change', () => syncWhatsAppToggle(wrapper));

  return wrapper;
}

function createQuestionField(field) {
  const fieldset = document.createElement('fieldset');
  fieldset.className = 'question-field';
  fieldset.dataset.required = field.required ? 'true' : 'false';

  const legend = document.createElement('legend');
  legend.textContent = field.label;
  fieldset.append(legend);

  const options = document.createElement('div');
  options.className = 'radio-pill-group';

  field.options.forEach((option, index) => {
    const optionId = `${field.id}-${slugify(option.value)}`;
    const optionWrapper = document.createElement('div');
    optionWrapper.className = 'radio-pill';

    const input = document.createElement('input');
    input.type = 'radio';
    input.id = optionId;
    input.name = field.name;
    input.value = option.value;
    input.required = field.required;

    const label = document.createElement('label');
    label.setAttribute('for', optionId);
    label.textContent = option.label || option.value || `Option ${index + 1}`;

    optionWrapper.append(input, label);
    options.append(optionWrapper);
  });

  fieldset.append(options);
  return fieldset;
}

function createPlainTextField(field) {
  const wrapper = document.createElement('div');
  wrapper.className = 'field-wrapper disclaimer-field';

  const p = document.createElement('p');
  p.textContent = field.label;
  wrapper.append(p);
  return wrapper;
}

function createSubmitButton(field) {
  const wrapper = document.createElement('div');
  wrapper.className = 'field-wrapper submit-wrapper';

  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = field.label || 'Submit';
  button.dataset.originalText = field.label || 'Submit';

  wrapper.append(button);
  return wrapper;
}

/* ========== Form Building ========== */

function getRequiredFields(form) {
  return [...form.querySelectorAll('.field-wrapper[data-required="true"] input')]
    .filter((input) => input.type !== 'hidden' && !input.disabled);
}

function updateSubmitState(form) {
  const submitBtn = form.querySelector('.submit-wrapper button');
  if (!submitBtn) return;

  const isValid = getRequiredFields(form).every((input) => {
    if (input.type === 'radio') {
      const radios = form.querySelectorAll(`input[name="${input.name}"]`);
      return [...radios].some((r) => r.checked);
    }
    return input.value.trim() && input.checkValidity();
  });

  submitBtn.disabled = !isValid;
}

function wireValidation(form) {
  getRequiredFields(form).forEach((input) => {
    ['input', 'change', 'blur'].forEach((evt) => {
      input.addEventListener(evt, () => updateSubmitState(form));
    });
  });
  updateSubmitState(form);
}

function renderBookFreeSiteVisitForm(form, fields) {
  const questionFields = fields.filter((f) => ['renovating_home', 'hired_painter'].includes(f.name));
  let questionPanelRendered = false;

  fields.forEach((field) => {
    // Question panel (grouped)
    if (['renovating_home', 'hired_painter'].includes(field.name)) {
      if (!questionPanelRendered) {
        const panel = document.createElement('div');
        panel.className = 'question-panel';
        questionFields.forEach((qf) => panel.append(createQuestionField(qf)));
        form.append(panel);
        questionPanelRendered = true;
      }
      return;
    }

    // Mobile field with prefix
    if (field.name === 'mobile') {
      form.append(createMobileField(field));
      return;
    }

    // WhatsApp toggle
    if (field.name === 'whatsapp_consent') {
      form.append(createWhatsAppField(field));
      return;
    }

    // Disclaimer text
    if (field.type === 'plaintext') {
      form.append(createPlainTextField(field));
      return;
    }

    // Submit button
    if (field.type === 'submit') {
      const submitEl = createSubmitButton(field);
      submitEl.querySelector('button')?.setAttribute('disabled', '');
      form.append(submitEl);
      return;
    }

    // Regular text fields
    form.append(createTextField(field));
  });

  wireValidation(form);
}

/* ========== Form Submission ========== */

function showMessage(form, type, message) {
  form.parentElement?.querySelectorAll('.form-message').forEach((el) => el.remove());

  const messageEl = document.createElement('div');
  messageEl.className = `form-message form-message-${type}`;
  messageEl.textContent = message;
  form.parentElement.insertBefore(messageEl, form);

  if (type === 'success') {
    setTimeout(() => messageEl.remove(), 5000);
  }
}

async function handleSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const submitBtn = form.querySelector('button[type="submit"]');

  if (!form.reportValidity()) return;
  if (form.dataset.submitting === 'true') return;

  form.dataset.submitting = 'true';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  const payload = { __id__: `${Date.now()}-${Math.round(Math.random() * 100000)}` };

  [...form.elements].forEach((el) => {
    if (!el.name || el.disabled || el.type === 'submit') return;

    if (el.type === 'radio' && !el.checked) return;
    if (el.type === 'checkbox') {
      payload[el.name] = el.checked ? el.value : '';
      return;
    }
    payload[el.name] = el.value;
  });

  try {
    const response = await fetch(form.dataset.action || window.location.pathname, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: payload }),
    });

    if (!response.ok) throw new Error(`Failed: ${response.status}`);

    showMessage(form, 'success', DEFAULT_SUCCESS_MESSAGE);
    form.reset();
    form.querySelectorAll('.whatsapp-field').forEach(syncWhatsAppToggle);
    updateSubmitState(form);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Form submission error:', error);
    showMessage(form, 'error', DEFAULT_ERROR_MESSAGE);
  } finally {
    form.dataset.submitting = 'false';
    submitBtn.disabled = false;
    submitBtn.textContent = submitBtn.dataset.originalText;
  }
}

/* ========== Form Definition Loading ========== */

async function fetchFormDefinition(pathname) {
  let path = pathname;
  if (!path.endsWith('.json')) {
    path = `${path.replace(/\.html$/, '')}.json`;
  }

  const response = await fetch(path);
  if (!response.ok) throw new Error(`Unable to fetch form: ${path}`);

  return response.json();
}

function parseHTMLStructure(block) {
  // Parse simple HTML table structure: Col1 = labels, Col2 = placeholders
  const rows = block.children;
  if (rows.length < 2) return null;

  const col1 = rows[0];
  const col2 = rows[1];
  const labelCells = [...col1.children];
  const placeholderCells = [...col2.children];

  const data = [];
  let headerFound = false;

  labelCells.forEach((cell, index) => {
    const text = cell.textContent.trim();
    const placeholder = placeholderCells[index]?.textContent.trim() || '';
    const link = cell.querySelector('a');
    const strong = cell.querySelector('strong');

    // Submit button (link)
    if (link) {
      data.push({ Name: 'submit', Type: 'submit', Label: link.textContent.trim() });
      return;
    }

    // Header (first long text)
    if (!headerFound && text.length > 30) {
      headerFound = true;
      return; // Skip header, handled separately
    }

    // Field label
    if (strong) {
      const label = strong.textContent.trim();
      if (!label) return;

      let type = 'text';
      const lowerLabel = label.toLowerCase();
      if (lowerLabel.includes('email')) type = 'email';
      if (lowerLabel.includes('phone') || lowerLabel.includes('mobile')) type = 'tel';

      data.push({
        Name: slugify(label),
        Type: type,
        Label: label,
        Placeholder: placeholder,
        Mandatory: 'true',
      });
    }
  });

  return data.length > 0 ? { name: 'simple-form', data } : null;
}

/* ========== Main Decorator ========== */

export default async function decorate(block) {
  let formDefinition = null;
  let actionPath = '';

  // Try to find a link to JSON form definition
  const link = block.querySelector('a[href$=".json"], a[href$=".html"]');

  if (link) {
    try {
      const { pathname } = new URL(link.href, window.location.href);
      actionPath = pathname.replace(/\.json$/, '').replace(/\.html$/, '');
      formDefinition = await fetchFormDefinition(pathname);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Lead form: Could not load form definition', error);
    }
  }

  // Fallback to HTML structure parsing
  if (!formDefinition) {
    const htmlData = parseHTMLStructure(block);
    if (htmlData) {
      formDefinition = htmlData;
    }
  }

  if (!formDefinition || !formDefinition.data?.length) {
    // eslint-disable-next-line no-console
    console.warn('Lead form: No valid form definition found');
    return;
  }

  // Build form
  const fields = formDefinition.data.map((raw, i) => createField(raw, i));
  // Derive form name from definition or URL path
  // (AEM sheets don't include custom top-level props)
  const formName = normalizeText(formDefinition.name)
    || actionPath.split('/').pop().replace(/\.json$|\.html$/, '');

  const form = document.createElement('form');
  form.className = 'lead-form-fields';
  form.method = 'post';
  form.noValidate = true;
  form.dataset.action = actionPath;
  form.dataset.formName = formName;

  if (formName === BOOK_FREE_SITE_VISIT_FORM) {
    renderBookFreeSiteVisitForm(form, fields);
  } else {
    // Generic form rendering
    fields.forEach((field) => {
      if (field.type === 'submit') {
        form.append(createSubmitButton(field));
      } else if (field.type === 'plaintext') {
        form.append(createPlainTextField(field));
      } else {
        form.append(createTextField(field));
      }
    });
  }

  form.addEventListener('submit', handleSubmit);

  // Replace block content
  block.textContent = '';
  block.append(form);
}
