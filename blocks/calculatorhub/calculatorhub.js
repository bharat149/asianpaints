export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  const calculatorhubContent = rows[0];
  const calculatorhubInput = rows[1];

  const calculatorhubContents = [...calculatorhubContent.children];
  const calculatorhubHeadingCol = calculatorhubContents[0];

  calculatorhubContent.classList.add("tool-description");
  calculatorhubHeadingCol.classList.add("miniform-calctext");

  const heading = calculatorhubHeadingCol.children[0];
  const description = calculatorhubHeadingCol.children[1];

  if (heading) heading.classList.add("calculatorhub-heading");
  if (description) description.classList.add("calculatorhub-subheading");

  calculatorhubInput.classList.add("tool-fields");

  /* -------------------------
     Add form wrapper
  -------------------------- */

  let formMarkup = `<form id="toolsMiniForm" class="pbc-mini-form"
    data-attr-tool-link="/content/ap/en/home/resources/tools/paint-quotation-tool.html?source=PBC_miniform"
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

  $(".tool-fields div").remove();
  $(".tool-fields").append(formMarkup);
}
