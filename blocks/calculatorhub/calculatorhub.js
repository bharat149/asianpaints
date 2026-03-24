export default async function decorate(block) {
  // Wait for jQuery because it is no longer loaded eagerly in the page head
  await window.loadJQuery?.();
  const $ = window.jQuery;

  const rows = [...block.children];
  if (rows.length < 2) return;

  const calculatorhubContent = rows[0];
  const calculatorhubInput = rows[1];

  const calculatorhubContents = [...calculatorhubContent.children];
  const calculatorhubHeadingCol = calculatorhubContents[0];

  calculatorhubContent.classList.add('tool-description');
  calculatorhubHeadingCol.classList.add('miniform-calctext');

  const heading = calculatorhubHeadingCol.children[0];
  const description = calculatorhubHeadingCol.children[1];

  if (heading) heading.classList.add('calculatorhub-heading');
  if (description) description.classList.add('calculatorhub-subheading');

  calculatorhubInput.classList.add('tool-fields');

  /* Add form wrapper */
  const formMarkup = `<form id="toolsMiniForm" class="pbc-mini-form"
    data-attr-tool-link="https://www.asianpaints.com/resources/tools/paint-quotation-tool.html?source=PBC_miniform"
    data-gtm-form-interact-id="0">
    <div class="form-group project-field">
        <div tabindex="0" class="focus-visible-auto-imp project-field-heading">1. Select your type of
            project<span>*</span></div>
        <div class="project-field-inputs">
            <label tabindex="0" role="checkbox" aria-checked="false" class="focus-visible-auto-imp" for="freshPainting">
                <input class="d-none" type="radio" id="freshPainting" name="project" value="Fresh Painting"
                    data-gtm-form-interact-field-id="0" style="display: none;">
                <span class="radiobtn">
                    <div class="option-icon">
                        <img alt="Fresh Painting" title="Fresh Painting" loading="lazy" fetchpriority="auto"
                            src="https://www.asianpaints.com/content/dam/apcolourcatalogue/asset/ap-revamp/sps-revamp/mini-pbc-tool/fresh_painting_new_new.webp"
                            width="50" height="50">
                    </div>
                    <h3 class="option-title">Fresh Painting</h3>
                </span>
            </label>
            <label tabindex="0" role="checkbox" aria-checked="false" class="focus-visible-auto-imp" for="Repainting">
                <input class="d-none" type="radio" id="Repainting" name="project" value="Repainting"
                    data-gtm-form-interact-field-id="3" style="display: none;">
                <span class="radiobtn">
                    <div class="option-icon">
                        <img alt="Repainting" title="Repainting" loading="lazy" fetchpriority="auto"
                            src="https://www.asianpaints.com/content/dam/apcolourcatalogue/asset/ap-revamp/sps-revamp/mini-pbc-tool/repainting-new-desk.webp">
                    </div>
                    <h3 class="option-title">Repainting</h3>
                </span>
            </label>
        </div>
    </div>
    <div class="form-group space-field">
        <div tabindex="0" class="focus-visible-auto-imp space-field-heading">2. Select the space<span>*</span></div>
        <div class="space-field-inputs">
            <label tabindex="0" role="checkbox" aria-checked="false" class="focus-visible-auto-imp" for="Interior">
                <input class="d-none" type="radio" id="Interior" name="space" value="Interior"
                    data-gtm-form-interact-field-id="1" style="display: none;">
                <span class="radiobtn">
                    <div class="option-icon">
                        <img alt="Interior" title="Interior" loading="lazy" fetchpriority="auto"
                            src="https://www.asianpaints.com/content/dam/apcolourcatalogue/asset/ap-revamp/sps-revamp/mini-pbc-tool/interior_new.webp">
                    </div>
                    <h3 class="option-title">Interior</h3>
                </span>
            </label>
            <label tabindex="0" role="checkbox" aria-checked="false" class="focus-visible-auto-imp" for="Exterior">
                <input class="d-none" type="radio" id="Exterior" name="space" value="Exterior"
                    data-gtm-form-interact-field-id="4" style="display: none;">
                <span class="radiobtn">
                    <div class="option-icon">
                        <img alt="Exterior" title="Exterior" loading="lazy" fetchpriority="auto"
                            src="https://www.asianpaints.com/content/dam/apcolourcatalogue/asset/ap-revamp/sps-revamp/mini-pbc-tool/exterior.webp">
                    </div>
                    <h3 class="option-title">Exterior</h3>
                </span>
            </label>
        </div>
    </div>
    <div class="form-group area-field">
        <label tabindex="0" class="focus-visible-auto-imp" for="area">3. Enter total area in SQFT<span>*</span></label>
        <input type="number" id="area" placeholder="Area in SQFT" name="area" data-gtm-form-interact-field-id="2">
        <div class="error-msg" style="visibility: hidden;"></div>
    </div>
    <div class="form-actions cta animated-btn-yellow-onhover-black round-corner-radius-button">
        <a href="javascript:void(0);" id="calculate-now" class="animated-arrow-button ctaText">Calculate now<span
                class="arrow"></span><span class="rotating saving-progress-status d-none">↻</span></a>
    </div>
</form>`;

  $('.tool-fields div').remove();
  $('.tool-fields').append(formMarkup);

  // WCAG keyboard support for option selection
  $('.project-field-inputs label, .space-field-inputs label').on('keydown', function onKeydown(event) {
    if (event.key === 'Enter') {
      $(this).find('input[type="radio"]').prop('checked', true).trigger('change');
    }
  });

  setTimeout(() => {
    $('#toolsMiniForm').trigger('reset');
  }, 100);

  $('.project-field input[name="project"]').prop('checked', false);
  $('.space-field input[name="space"]').prop('checked', false);
  $('.area-field input[name="area"]').val('');
  $('#calculate-now').attr('disabled', 'disabled');
  $('#calculate-now').attr('aria-disabled', 'true');

  const miniFormValues = {
    ProjectType: 'Val1',
    SpaceType: 'Val2',
    Area: 'Val3',
  };

  $('#toolsMiniForm .form-actions #calculate-now').click(() => {
    const project = $('.project-field input[name="project"]:checked').val();
    const space = $('.space-field input[name="space"]:checked').val();
    const area = $('.area-field input[name="area"]').val();

    miniFormValues.ProjectType = project;
    miniFormValues.SpaceType = space;
    miniFormValues.Area = area;

    localStorage.setItem('miniFormValues', JSON.stringify(miniFormValues));

    if (
      $('#toolsMiniForm .space-field input[name=space]:checked').length
      && $('#toolsMiniForm .project-field input[name=project]:checked').length
      && parseInt($('#toolsMiniForm .area-field #area').val(), 10) > 99
    ) {
      const toolURL = $('form#toolsMiniForm').attr('data-attr-tool-link');

      const userInputValues = `${miniFormValues.ProjectType}|${miniFormValues.SpaceType}|${miniFormValues.Area}`;

      // ccAnalytics.calculateContinue(userInputValues);
      console.log(userInputValues);

      $('#toolsMiniForm .form-actions .saving-progress-status').removeClass('d-none');
      window.location.href = toolURL;
    }
  });

  if ($('.mini-tools-form').length > 0) {
    let formInteraction = false;

    $('#toolsMiniForm .space-field input, #toolsMiniForm .project-field input, #toolsMiniForm .area-field #area').on('change keyup', () => {
      if (!formInteraction) {
        // calculator start event fire
        // ccAnalytics.calculateStart();
        formInteraction = true;
      }

      if (
        $('#toolsMiniForm .space-field input[name=space]:checked').length
        && $('#toolsMiniForm .project-field input[name=project]:checked').length
        && parseInt($('#toolsMiniForm .area-field #area').val(), 10) > 99
      ) {
        $('#calculate-now').removeAttr('disabled');
        $('#calculate-now').removeAttr('aria-disabled');
      } else {
        $('#calculate-now').attr('disabled', 'disabled');
        $('#calculate-now').attr('aria-disabled', 'true');
      }
    });

    $('#toolsMiniForm .area-field #area').on('blur keyup', function onAreaChange() {
      if (parseInt($(this).val(), 10) < 100) {
        $('#toolsMiniForm .area-field .error-msg').css('visibility', 'visible');
      } else {
        $('#toolsMiniForm .area-field .error-msg').css('visibility', 'hidden');
      }
    });
  }
}