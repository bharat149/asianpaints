/* /blocks/calculator-hub/quick-links.js */

function parseTableToConfig(block) {
  const config = {};
  const rows = [...block.querySelectorAll(':scope > div')];

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;

    const key = cols[0].textContent.trim();
    const val = cols[1].textContent.trim();

    if (!key) return;
    config[key] = val;
  });

  return config;
}

function csvToArray(str) {
  if (!str) return [];
  return str.split(',').map((s) => s.trim()).filter(Boolean);
}

function uniqueId(prefix = 'ch') {
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

function safeNumber(val, fallback) {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

function setAriaCheckedForGroup(wrapper) {
  const labels = [...wrapper.querySelectorAll('label[role="radio"]')];
  labels.forEach((lab) => {
    const input = lab.querySelector('input[type="radio"]');
    lab.setAttribute('aria-checked', input?.checked ? 'true' : 'false');
  });
}

function renderIconOptions({ name, options, icons = [], idPrefix, wrapperClass, isWbc }) {
  const groupId = uniqueId(idPrefix);
  const wrapper = document.createElement('div');
  wrapper.className = wrapperClass;

  options.forEach((opt, i) => {
    const inputId = `${groupId}-${i}`;

    const label = document.createElement('label');
    label.className = 'focus-visible-auto-imp';
    label.setAttribute('tabindex', '0');
    label.setAttribute('role', 'radio');
    label.setAttribute('aria-checked', 'false');
    label.setAttribute('for', inputId);

    const input = document.createElement('input');
    input.className = 'd-none';
    input.type = 'radio';
    input.id = inputId;
    input.name = name;
    input.value = opt;

    const span = document.createElement('span');
    span.className = 'radiobtn';

    const iconUrl = icons[i];
    if (iconUrl) {
      const iconDiv = document.createElement('div');
      iconDiv.className = 'option-icon';

      const img = document.createElement('img');
      img.loading = 'lazy';
      img.fetchPriority = 'auto';
      img.alt = opt;
      img.title = opt;
      img.src = iconUrl;

      // AMS WBC uses .icon-img for sizing behavior
      if (isWbc) img.classList.add('icon-img');

      iconDiv.appendChild(img);
      span.appendChild(iconDiv);
    }

    const h3 = document.createElement('h3');
    h3.className = 'option-title';
    h3.textContent = opt;
    span.appendChild(h3);

    label.appendChild(input);
    label.appendChild(span);

    // WCAG: Enter selects option
    label.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        input.checked = true;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    input.addEventListener('change', () => setAriaCheckedForGroup(wrapper));
    wrapper.appendChild(label);
  });

  setAriaCheckedForGroup(wrapper);
  return wrapper;
}

function renderRadioOptions({ name, options, idPrefix }) {
  const groupId = uniqueId(idPrefix);
  const wrapper = document.createElement('div');
  wrapper.className = 'radio-wraper';

  options.forEach((opt, i) => {
    const inputId = `${groupId}-${i}`;

    const label = document.createElement('label');
    label.className = 'focus-visible-auto-imp';
    label.setAttribute('tabindex', '0');
    label.setAttribute('role', 'radio');
    label.setAttribute('aria-checked', 'false');
    label.setAttribute('for', inputId);
    label.append(document.createTextNode(opt));

    const input = document.createElement('input');
    input.tabIndex = -1;
    input.id = inputId;
    input.name = name;
    input.type = 'radio';
    input.value = opt;

    label.appendChild(input);
    wrapper.appendChild(label);

    input.addEventListener('change', () => {
      [...wrapper.querySelectorAll('label[role="radio"]')].forEach((lab) => {
        const radio = lab.querySelector('input[type="radio"]');
        lab.setAttribute('aria-checked', radio?.checked ? 'true' : 'false');
      });
    });
  });

  return wrapper;
}

function buildFormUI(config) {
  const variant = (config.variant || 'pbc').toLowerCase();
  const isWbc = variant === 'wbc';

  const screenHeading = config.screenHeading || '';
  const screenSubHeading = config.screenSubHeading || '';
  const toolLink = config.toolLink || '';

  const minArea = safeNumber(config.minArea, 100);
  const areaPlaceholder = config.areaPlaceholder || 'Area in SQFT';
  const errorText = config.errorText || '';
  const ctaLabel = config.ctaLabel || 'Calculate Now';
  const storageKey = config.storageKey || 'miniFormValues';

  const q1Label = config.q1Label || '';
  const q1Options = csvToArray(config.q1Options);
  const q1Icons = csvToArray(config.q1Icons);

  const q2Label = config.q2Label || '';
  const q2Options = csvToArray(config.q2Options);
  const q2Icons = csvToArray(config.q2Icons);
  const q2Style = (config.q2Style || (isWbc ? 'radio' : 'icon')).toLowerCase();

  // ✅ NEW: authorable area label above input (maps to AMS QuestionThree)
  const q3Label = config.q3Label || config.areaLabel || 'Area';

  const root = document.createElement('div');
  root.className = `mini-pbc ${isWbc ? 'wbc-variant' : ''}`;

  // Left
  const desc = document.createElement('div');
  desc.className = 'tool-description';

  if (screenHeading) {
    const h = document.createElement('div');
    h.className = 'heading';
    h.textContent = screenHeading;
    desc.appendChild(h);
  }
  if (screenSubHeading) {
    const sh = document.createElement('div');
    sh.className = 'sub-heading';
    sh.textContent = screenSubHeading;
    desc.appendChild(sh);
  }

  // Right
  const fields = document.createElement('div');
  fields.className = 'tool-fields';

  const miniToolsForm = document.createElement('div');
  miniToolsForm.className = 'mini-tools-form';

  const form = document.createElement('form');
  const formId = uniqueId('toolsMiniForm');
  form.id = formId;
  form.className = isWbc ? 'wbc-mini-form' : 'pbc-mini-form';
  form.setAttribute('data-attr-tool-link', toolLink);

  // Q1 group
  const q1 = document.createElement('div');
  q1.className = 'form-group project-field';

  if (q1Label) {
    const q1h = document.createElement('div');
    q1h.className = 'project-field-heading';
    q1h.setAttribute('tabindex', '0');
    q1h.textContent = q1Label;
    const req = document.createElement('span');
    req.textContent = '*';
    q1h.appendChild(req);
    q1.appendChild(q1h);
  }

  q1.appendChild(
    renderIconOptions({
      name: 'project',
      options: q1Options,
      icons: q1Icons,
      idPrefix: 'project',
      wrapperClass: 'project-field-inputs',
      isWbc,
    })
  );

  // Q2 group
  const q2 = document.createElement('div');
  q2.className = 'form-group space-field';

  if (q2Label) {
    const q2h = document.createElement('div');
    q2h.className = 'space-field-heading';
    q2h.setAttribute('tabindex', '0');
    q2h.textContent = q2Label;
    const req = document.createElement('span');
    req.textContent = '*';
    q2h.appendChild(req);
    q2.appendChild(q2h);
  }

  const q2Inputs = document.createElement('div');
  q2Inputs.className = 'space-field-inputs';

  if (q2Style === 'radio') {
    q2Inputs.appendChild(
      renderRadioOptions({
        name: 'space',
        options: q2Options,
        idPrefix: 'space',
      })
    );
  } else {
    q2Inputs.appendChild(
      renderIconOptions({
        name: 'space',
        options: q2Options,
        icons: q2Icons,
        idPrefix: 'space',
        wrapperClass: 'space-field-inputs',
        isWbc,
      })
    );
  }

  q2.appendChild(q2Inputs);

  // Area group (authorable label)
  const areaGroup = document.createElement('div');
  areaGroup.className = 'form-group area-field';

  const areaLabel = document.createElement('label');
  areaLabel.className = isWbc ? 'area-field-heading focus-visible-auto-imp' : 'focus-visible-auto-imp';
  areaLabel.setAttribute('tabindex', '0');
  areaLabel.setAttribute('for', `${formId}-area`);
  areaLabel.textContent = q3Label;

  const reqArea = document.createElement('span');
  reqArea.textContent = '*';
  areaLabel.appendChild(reqArea);

  const areaInput = document.createElement('input');
  areaInput.type = 'number';
  areaInput.inputMode = 'numeric';
  areaInput.id = `${formId}-area`;
  areaInput.name = 'area';
  areaInput.placeholder = areaPlaceholder;

  const error = document.createElement('div');
  error.className = 'error-msg';
  error.textContent = errorText;

  areaGroup.appendChild(areaLabel);
  areaGroup.appendChild(areaInput);
  areaGroup.appendChild(error);

  // CTA
  const actions = document.createElement('div');
  actions.className = 'form-actions cta animated-btn-yellow-onhover-black round-corner-radius-button';

  const cta = document.createElement('a');
  cta.href = 'javascript:void(0);';
  cta.id = `${formId}-calculate-now`;
  cta.className = 'animated-arrow-button ctaText';
  cta.setAttribute('aria-disabled', 'true');
  cta.setAttribute('disabled', 'disabled');
  cta.textContent = ctaLabel;

  const arrow = document.createElement('span');
  arrow.className = 'arrow';
  cta.appendChild(arrow);

  const spinner = document.createElement('span');
  spinner.className = 'rotating saving-progress-status d-none';
  spinner.textContent = '↻';
  cta.appendChild(spinner);

  actions.appendChild(cta);

  // ✅ STRUCTURE FIX:
  // - WBC: area + CTA INSIDE space-field-inputs (matches AMS HTML)
  // - PBC: area + CTA are separate form grid items (matches AMS HTML)
  form.appendChild(q1);
  form.appendChild(q2);

  if (isWbc) {
    q2Inputs.appendChild(areaGroup);
    q2Inputs.appendChild(actions);
  } else {
    form.appendChild(areaGroup);
    form.appendChild(actions);
  }

  miniToolsForm.appendChild(form);
  fields.appendChild(miniToolsForm);

  root.appendChild(desc);
  root.appendChild(fields);

  // Behavior (same logic as AMS miniForm)
  const state = { started: false };

  function resetForm() {
    form.reset();
    cta.setAttribute('disabled', 'disabled');
    cta.setAttribute('aria-disabled', 'true');
    spinner.classList.add('d-none');
    error.style.visibility = 'hidden';
  }

  function isValid() {
    const project = form.querySelector("input[name='project']:checked");
    const space = form.querySelector("input[name='space']:checked");
    const areaVal = safeNumber(areaInput.value, 0);
    return !!project && !!space && areaVal >= minArea;
  }

  function toggleCTA() {
    if (isValid()) {
      cta.removeAttribute('disabled');
      cta.removeAttribute('aria-disabled');
    } else {
      cta.setAttribute('disabled', 'disabled');
      cta.setAttribute('aria-disabled', 'true');
    }
  }

  function updateError() {
    const areaVal = safeNumber(areaInput.value, 0);
    if (areaVal > 0 && areaVal < minArea) error.style.visibility = 'visible';
    else error.style.visibility = 'hidden';
  }

  function safeCall(fnPath, arg) {
    try {
      const parts = fnPath.split('.');
      let obj = window;
      for (const p of parts) obj = obj?.[p];
      if (typeof obj === 'function') obj(arg);
    } catch (e) { /* ignore */ }
  }

  form.addEventListener('input', () => {
    if (!state.started) {
      safeCall('ccAnalytics.calculateStart');
      state.started = true;
    }
    toggleCTA();
  });

  areaInput.addEventListener('blur', updateError);
  areaInput.addEventListener('keyup', () => {
    updateError();
    toggleCTA();
  });

  cta.addEventListener('click', () => {
    if (!isValid()) return;

    const project = form.querySelector("input[name='project']:checked")?.value || '';
    const space = form.querySelector("input[name='space']:checked")?.value || '';
    const area = areaInput.value || '';

    localStorage.setItem(storageKey, JSON.stringify({
      ProjectType: project,
      SpaceType: space,
      Area: area,
    }));

    safeCall('ccAnalytics.calculateContinue', `${project}|${space}|${area}`);
    spinner.classList.remove('d-none');

    if (toolLink) window.location.href = toolLink;
  });

  setTimeout(resetForm, 100);
  return root;
}

export default async function decorate(block) {
  const config = parseTableToConfig(block);
  block.textContent = '';
  block.appendChild(buildFormUI(config));
}