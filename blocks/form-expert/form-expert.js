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

  const form = document.createElement('form');
  form.className = 'form-expert-form';

  const inputsGrid = document.createElement('div');
  inputsGrid.className = 'form-expert-inputs-grid';

  inputsGrid.appendChild(createInputField('text', 'Enter your name', 'name'));
  inputsGrid.appendChild(createMobileField());
  inputsGrid.appendChild(createInputField('text', 'Enter your Pincode', 'pincode'));
  inputsGrid.appendChild(createInputField('email', 'Enter your Email', 'email'));

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
  submitBtn.className = 'form-expert-submit';
  submitBtn.innerHTML = 'Book a free site visit <span class="arrow">\u2192</span>';
  buttonContainer.appendChild(submitBtn);
  form.appendChild(buttonContainer);

  rightSection.appendChild(form);
  container.appendChild(leftSection);
  container.appendChild(rightSection);
  block.appendChild(container);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (isIds) {
      // eslint-disable-next-line no-alert
      alert('Thank you for your interest! We will contact you shortly to schedule your free site visit.');
    } else {
      window.location.href = 'https://www.asianpaints.com/services/asian-paints-safe-painting-service.html';
    }
  });
}

function createInputField(type, placeholder, name) {
  const wrapper = document.createElement('div');
  wrapper.className = 'form-expert-field';
  const input = document.createElement('input');
  input.type = type;
  input.placeholder = placeholder;
  input.name = name;
  input.className = 'form-expert-input';
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
  input.name = 'mobile';
  input.className = 'form-expert-input form-expert-mobile-input';
  input.pattern = '[0-9]{10}';
  input.maxLength = 10;
  input.required = true;
  wrapper.appendChild(prefix);
  wrapper.appendChild(input);
  return wrapper;
}

function createToggle(label, checked) {
  const wrapper = document.createElement('div');
  wrapper.className = 'form-expert-toggle-wrapper';
  const toggle = document.createElement('label');
  toggle.className = 'form-expert-toggle';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = checked;
  checkbox.name = 'whatsapp';
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
