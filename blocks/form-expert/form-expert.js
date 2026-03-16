import { submitLeadFromForm } from '../../scripts/form-submit-common.js';

export default function decorate(block) {
  const isIds = block.classList.contains('ids');

  block.textContent = '';

  const container = document.createElement('div');
  container.className = 'form-expert-container';

  const leftSection = document.createElement('div');
  leftSection.className = 'form-expert-left';

  const title = document.createElement('h2');
  title.className = 'form-expert-title';
  title.textContent = isIds
    ? 'Looking For Expert Guidance To Design Your Dream Home?'
    : 'Get An Expert Advice';

  const subtitle = document.createElement('p');
  subtitle.className = 'form-expert-subtitle';
  subtitle.textContent = isIds
    ? 'Fill the form below to get personalized interior design solutions from Asian Paints at one click'
    : 'Bid goodbye to your home painting hassles with our expert supervision';

  leftSection.appendChild(title);
  leftSection.appendChild(subtitle);

  const rightSection = document.createElement('div');
  rightSection.className = 'form-expert-right';

  const formAttributes = document.createElement('div');
  formAttributes.className = 'form-attributes form-expert-form-attributes';
  formAttributes.setAttribute('data-attr-resourcePath', window.location.pathname || '');

  const form = document.createElement('form');
  form.className = 'form-expert-form custom-enquire-form-step-1 form-group-global form-group-global__enquire-form form-revamp form-revamp-vertical';
  form.noValidate = true;

  const inputsGrid = document.createElement('div');
  inputsGrid.className = 'form-expert-inputs-grid';

  inputsGrid.appendChild(createInputField({
    type: 'text',
    placeholder: 'Enter your name',
    name: 'ENQUIRE_NAME',
    id: 'enquire-name',
    pattern: '[A-Za-z ]{2,}',
  }));
  inputsGrid.appendChild(createMobileField());
  inputsGrid.appendChild(createInputField({
    type: 'text',
    placeholder: 'Enter your Pincode',
    name: 'ENQUIRE_PINCODE',
    id: 'enquire-pincode',
    inputMode: 'numeric',
    pattern: '[0-9]{6}',
    maxLength: 6,
  }));
  inputsGrid.appendChild(createInputField({
    type: 'email',
    placeholder: 'Enter your Email',
    name: 'ENQUIRE_EMAIL',
    id: 'enquire-email',
  }));

  form.appendChild(inputsGrid);
  form.appendChild(createToggle('Update me on WhatsApp', true));

  if (!isIds) {
    const checkboxesContainer = document.createElement('div');
    checkboxesContainer.className = 'form-expert-checkboxes';
    checkboxesContainer.appendChild(createCheckbox('There is construction work going on at my house', 'construction'));
    checkboxesContainer.appendChild(createCheckbox('There is a local painter hired', 'painter'));
    form.appendChild(checkboxesContainer);
  }

  const disclaimer = document.createElement('p');
  disclaimer.className = 'form-expert-disclaimer';
  disclaimer.textContent = 'By proceeding, you are authorizing Asian Paints and its suggested contractors to get in touch with you through calls, sms, or e-mail';
  form.appendChild(disclaimer);

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'form-expert-button-container';
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'form-expert-submit ctaText enquireForm--step-1-submit track_form_submit animated-arrow-btn yellow-gradient';
  submitBtn.innerHTML = 'Book a free site visit <span class="arrow">\u2192</span>';
  buttonContainer.appendChild(submitBtn);
  form.appendChild(buttonContainer);

  formAttributes.appendChild(form);
  rightSection.appendChild(formAttributes);
  container.appendChild(leftSection);
  container.appendChild(rightSection);
  block.appendChild(container);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    submitBtn.disabled = true;

    submitLeadFromForm(form, {
      resourcePath: formAttributes.getAttribute('data-attr-resourcePath') || window.location.pathname || '',
    })
      .then(() => {
        form.reset();
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Form submission failed', err);
      })
      .finally(() => {
        submitBtn.disabled = false;
      });
  });
}

function createInputField({
  type,
  placeholder,
  name,
  id,
  pattern = '',
  maxLength = null,
  inputMode = '',
}) {
  const wrapper = document.createElement('div');
  wrapper.className = 'form-expert-field';
  const input = document.createElement('input');
  input.type = type;
  input.placeholder = placeholder;
  input.name = name;
  input.id = id;
  input.className = 'form-expert-input';
  if (pattern) input.pattern = pattern;
  if (maxLength) input.maxLength = maxLength;
  if (inputMode) input.inputMode = inputMode;
  input.required = true;
  wrapper.appendChild(input);
  return wrapper;
}

function createMobileField() {
  const wrapper = document.createElement('div');
  wrapper.className = 'form-expert-field form-expert-mobile-field';
  const prefix = document.createElement('span');
  prefix.className = 'form-expert-mobile-prefix';
  prefix.textContent = '+91';
  const input = document.createElement('input');
  input.type = 'tel';
  input.placeholder = 'Enter mobile number';
  input.name = 'ENQUIRE_MOBILE';
  input.id = 'enquire-mobile';
  input.className = 'form-expert-input form-expert-mobile-input';
  input.pattern = '[1-9][0-9]{9}';
  input.inputMode = 'numeric';
  input.maxLength = 10;
  input.required = true;
  wrapper.appendChild(prefix);
  wrapper.appendChild(input);
  return wrapper;
}

function createToggle(label, checked) {
  const wrapper = document.createElement('div');
  wrapper.className = 'form-expert-toggle-wrapper whatsAppConsentFormFld';
  if (checked) {
    wrapper.classList.add('whatsAppCheckbox-checked');
  }
  const toggle = document.createElement('label');
  toggle.className = 'form-expert-toggle';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = checked;
  checkbox.name = 'whatsapp';
  checkbox.addEventListener('change', () => {
    wrapper.classList.toggle('whatsAppCheckbox-checked', checkbox.checked);
  });
  const slider = document.createElement('span');
  slider.className = 'form-expert-toggle-slider';
  toggle.appendChild(checkbox);
  toggle.appendChild(slider);
  const text = document.createElement('span');
  text.className = 'form-expert-toggle-label';
  text.textContent = label;
  wrapper.appendChild(toggle);
  wrapper.appendChild(text);
  return wrapper;
}

function createCheckbox(label, name) {
  const wrapper = document.createElement('label');
  wrapper.className = 'form-expert-checkbox-wrapper';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.name = name;
  checkbox.className = 'form-expert-checkbox';
  const customCheckbox = document.createElement('span');
  customCheckbox.className = 'form-expert-checkbox-custom';
  const text = document.createElement('span');
  text.className = 'form-expert-checkbox-label';
  text.textContent = label;
  wrapper.appendChild(checkbox);
  wrapper.appendChild(customCheckbox);
  wrapper.appendChild(text);
  return wrapper;
}
