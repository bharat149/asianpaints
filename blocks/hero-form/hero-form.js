import { AesUtil } from '../../scripts/aesUtil.module.js';

const AMS_BASE = 'https://beta.asianpaints.com';

function htmlToEl(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function getUtmParams() {
  const p = new URLSearchParams(window.location.search);
  return {
    source: p.get('utm_source') || '',
    medium: p.get('utm_medium') || '',
    utmContent: p.get('utm_content') || '',
    utmId: p.get('utm_id') || '',
    campaignId: p.get('utm_campaign') || '',
    utmAdgroupName: p.get('UTM_Adgroup_Name') || '',
    utmKeyword: p.get('UTM_Keyword') || '',
    utmKeywordMatchType: p.get('UTM_Keyword_match_type') || '',
    utmCampaignSource: p.get('UTM_Campaign_Source') || '',
  };
}

function getVisitorId() {
  try {
    if (
      typeof window._satellite !== 'undefined'
      && window._satellite.getVisitorId
      && window._satellite.getVisitorId().getMarketingCloudVisitorID
    ) {
      return window._satellite.getVisitorId().getMarketingCloudVisitorID() || '';
    }
  } catch (e) {
    // ignore
  }
  return '';
}

function limitDigits(input, maxLen) {
  const digits = (input.value || '').replace(/[^\d]/g, '');
  input.value = digits.slice(0, maxLen);
}

function isMobileValid(v) {
  return /^[0-9]{10}$/.test((v || '').trim());
}

function isPincodeValid(v) {
  return /^[0-9]{6}$/.test((v || '').trim());
}

function setError(fieldWrap, msg) {
  const err = fieldWrap.querySelector('.error-msg');
  if (err) {
    err.textContent = msg || '';
    err.classList.toggle('d-none', !msg);
  }
  fieldWrap.classList.toggle('has-error', !!msg);
}

function setLabelTop(fieldWrap, top) {
  const label = fieldWrap.querySelector('.input-label');
  if (!label) return;
  label.classList.toggle('top', top);
  label.classList.toggle('d-none', !top);
}

/**
 * Keep headers minimal to reduce preflight issues cross-origin.
 */
async function postFormUrlEncoded(url, data) {
  const body = new URLSearchParams();
  Object.entries(data).forEach(([k, v]) => body.append(k, v ?? ''));

  const res = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept': '*/*',
    },
    body,
  });

  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

function buildMarkup(cfg) {
  const thankyouCta =
    (cfg.exploreCtaLink && cfg.exploreCtaLabel)
      ? `
        <div class="cta animated-btn-yellow-onhover-black round-corner-radius-button">
          <a href="${cfg.exploreCtaLink}" class="animated-arrow-button explore-painting-btn" target="_self"
             aria-label="${cfg.exploreCtaLabel}">
            ${cfg.exploreCtaLabel}<span class="arrow"></span>
          </a>
        </div>`
      : '';

  return `
    <div class="miniform hero-miniform">

      <div class="find-contractor-form-container ${cfg.alignment || ''} track_field_focus"
        data-attr-respath="${cfg.node || ''}"
        data-attr-campaignId="${cfg.campaignId || ''}"
        data-attr-emptyFieldError="${cfg.emptyFieldErrorMessage || 'Field is required'}"
        data-attr-mobileError="${cfg.mobileNumberErrorMessage || 'Phone number is invalid'}"
        data-attr-pincodeError="${cfg.pincodeErrorMessage || 'Enter a valid 6 digit Zip Code'}"
        data-attr-redirection="${cfg.redirectionUrl || ''}"
      >
        <div class="title-section">
          ${cfg.formTitle || '<p>Let our experts help you!</p>'}
        </div>

        <form class="hero-form-contact" novalidate>
          <div class="mobile-input-section">
            <label class="input-label d-none" for="mobile-number">Mobile Number*</label>
            <input type="tel" inputmode="numeric" autocomplete="tel"
              name="mobile-number" id="mobile-number" placeholder="Enter mobile number" />
            <div class="error-msg d-none"></div>
          </div>

          <div class="pincode-input-section">
            <label class="input-label d-none" for="pincode">Pincode*</label>
            <input type="tel" inputmode="numeric" autocomplete="postal-code"
              name="pincode" id="pincode" placeholder="Enter pincode" />
            <div class="error-msg d-none"></div>
          </div>

          <div class="whatsapp-update-consent-section">
            <input type="checkbox" id="whatsapp-consent-input" name="whatsapp-consent-input" checked />
            <label class="whatsapp-consent-label" for="whatsapp-consent-input">
              ${cfg.whatsappConsentText || 'Update me on WhatsApp'}
            </label>
            <span class="whatsapp-consent-checkmark" tabindex="0" role="checkbox"
              aria-label="${cfg.whatsappConsentText || 'Update me on WhatsApp'}"></span>
          </div>

          <!-- Disclaimer stays exactly here (below WhatsApp) -->
          <div class="disclaimer-section">
            ${cfg.disclaimerHtml || ''}
          </div>

          <button type="submit" class="get-contractors-button hero-form-submit">
            ${cfg.ctaLabel || 'Get recommended contractor'}
            <span class="rotating js-rotatingLeadForm get-contractor-progress-status d-none">↻</span>
          </button>
        </form>
      </div>

      <!-- THANK YOU (structure mirrors AMS miniform-thankyou.html) -->
      <div class="mf-thankyou-revamp-container" style="display:none">
        <div class="mf__dismissible-container--head" role="button" tabindex="0" aria-label="Close">
          <span class="mf-close-icon">×</span>
        </div>

        <div class="row no-gutters mf-revamp-thankyou">
          <div class="col-lg-4 col-12 mf-revamp-thankyou-left">
            <div class="mf-thank-you-left-content" style="display:block">
              <h2>${cfg.thankYouLeftSuccessHeading || ''}</h2>
              <p>${cfg.thankYouLeftSuccessDescription || ''}</p>
            </div>
            <div class="mf-error-left-content" style="display:none">
              <h2>${cfg.thankYouLeftErrorHeading || ''}</h2>
              <p>${cfg.thankYouLeftErrorDescription || ''}</p>
            </div>
          </div>

          <div class="col-lg-8 col-12 mf-revamp-thankyou-right"
            style="--bg-image-desktop: url('${cfg.thankYouBgDesktop || ''}');
                   --bg-image-mob: url('${cfg.thankYouBgMobile || ''}');">
            <div class="mf-thank-you-message" style="display:block">
              <p class="mf-thank-you-message-title">${cfg.thankYouRightHeading || ''}</p>
              <p class="mf-thank-you-message-subtitle">${cfg.thankYouRightSubHeadingOne || ''}</p>
              <p class="mf-thank-you-message-subtitle">${cfg.thankYouRightSubHeadingTwo || ''}</p>
              ${thankyouCta}
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
}

function buildBasePayload() {
  return {
    pageUrl: window.location.href,
    node: '',
    landMark: '',
    thirdAddress: '',
    buildingName: '',
    houseNo: '',
    organizationName: '',
    segment: '',
    street: '',
    designation: '',
    secondAddress: '',
    state: '',
    remarks: '',
    projectType: '',
    lName: '',
    city: '',
    phoneNo: '',
    pinCode: '',
    email: '',
    firstAddress: '',
    floorNo: '',
    salutations: '',
    mobileNo: '',
    fName: '',
    skuChosen: '',
    measurementNeeded: '',
    dealerName: '',
    dealerCode: '',
    answer: '',
    sampleFinish: '',
    datePicker: '',
    customField: '',
    visitorId: '',
    description: '',
    whatsAppConsent: '',
    source: '',
    medium: '',
    utmContent: '',
    utmId: '',
    campaignId: '',
    imageUrl: '',
    referrerId: '',
    marketingChannel: '',
    rowId: '',
    utmAdgroupName: '',
    utmKeyword: '',
    utmKeywordMatchType: '',
    utmCampaignSource: '',
  };
}

export default function decorate(block) {
  // --- 1) Pull authored values from block.dataset (maps 1:1 to _hero-form.json field names) ---
  const ds = block.dataset;

  const cfg = {
    classes: ds.classes || '',
    alignment: ds.alignment || '',
    node: ds.node || '',
    campaignId: ds.campaignid || ds.campaignId || '',
    redirectionUrl: ds.redirectionurl || ds.redirectionUrl || '',

    heroBgDesktop: ds.herobgdesktop || ds.heroBgDesktop || '',
    heroBgMobile: ds.herobgmobile || ds.heroBgMobile || '',
    heroBgAlt: ds.herobgalt || ds.heroBgAlt || '',

    formTitle: ds.formtitle || ds.formTitle || '',
    ctaLabel: ds.ctalabel || ds.ctaLabel || '',
    whatsappConsentText: ds.whatsappconsenttext || ds.whatsappConsentText || '',
    disclaimerHtml: ds.disclaimerhtml || ds.disclaimerHtml || '',

    emptyFieldErrorMessage: ds.emptyfielderrormessage || ds.emptyFieldErrorMessage || '',
    mobileNumberErrorMessage: ds.mobilenumbererrormessage || ds.mobileNumberErrorMessage || '',
    pincodeErrorMessage: ds.pincodeerrormessage || ds.pincodeErrorMessage || '',

    thankYouLeftSuccessHeading: ds.thankyuleftsuccessheading || ds.thankYouLeftSuccessHeading || '',
    thankYouLeftSuccessDescription: ds.thankyuleftsuccessdescription || ds.thankYouLeftSuccessDescription || '',
    thankYouLeftErrorHeading: ds.thankyulefterrorheading || ds.thankYouLeftErrorHeading || '',
    thankYouLeftErrorDescription: ds.thankyulefterrordescription || ds.thankYouLeftErrorDescription || '',

    thankYouRightHeading: ds.thankyourightheading || ds.thankYouRightHeading || '',
    thankYouRightSubHeadingOne: ds.thankyourightsubheadingone || ds.thankYouRightSubHeadingOne || '',
    thankYouRightSubHeadingTwo: ds.thankyourightsubheadingtwo || ds.thankYouRightSubHeadingTwo || '',

    thankYouBgDesktop: ds.thankyoubgdesktop || ds.thankYouBgDesktop || '',
    thankYouBgMobile: ds.thankyoubgmobile || ds.thankYouBgMobile || '',

    exploreCtaLabel: ds.explorectalabel || ds.exploreCtaLabel || '',
    exploreCtaLink: ds.explorectalink || ds.exploreCtaLink || '',
  };

  // --- 2) Preserve existing authored picture if present, else build from heroBgDesktop/Mobile ---
  const picture = block.querySelector('picture');

  block.innerHTML = '';

  // Background container
  const bgContainer = document.createElement('div');
  bgContainer.className = 'hero-form-background';

  if (picture) {
    bgContainer.appendChild(picture);
  } else if (cfg.heroBgDesktop || cfg.heroBgMobile) {
    // Build picture similar to AMS miniform background markup style [3](https://asianpaints-my.sharepoint.com/personal/p00126660_asianpaints_com/Documents/Microsoft%20Copilot%20Chat%20Files/miniform.html)
    const pic = document.createElement('picture');

    if (cfg.heroBgDesktop) {
      const s = document.createElement('source');
      s.media = '(min-width:992px)';
      s.srcset = cfg.heroBgDesktop;
      pic.appendChild(s);
    }
    if (cfg.heroBgMobile) {
      const s = document.createElement('source');
      s.media = '(min-width:320px)';
      s.srcset = cfg.heroBgMobile;
      pic.appendChild(s);
    }
    const img = document.createElement('img');
    img.src = cfg.heroBgDesktop || cfg.heroBgMobile;
    img.alt = cfg.heroBgAlt || '';
    img.loading = 'lazy';
    pic.appendChild(img);

    bgContainer.appendChild(pic);
  }

  block.appendChild(bgContainer);

  // Panel wrapper (overlay)
  const formWrapper = document.createElement('div');
  formWrapper.className = 'hero-form-panel-wrapper';
  formWrapper.appendChild(htmlToEl(buildMarkup(cfg)));
  block.appendChild(formWrapper);

  // --- 3) Wiring: validation + submit + thankyou toggle (AMS-equivalent) ---
  const container = block.querySelector('.find-contractor-form-container');
  const form = block.querySelector('.hero-form-contact');

  const mobileWrap = block.querySelector('.mobile-input-section');
  const pinWrap = block.querySelector('.pincode-input-section');
  const mobileInput = block.querySelector('#mobile-number');
  const pinInput = block.querySelector('#pincode');

  const consentInput = block.querySelector('#whatsapp-consent-input');
  const spinner = block.querySelector('.get-contractor-progress-status');

  const thankyou = block.querySelector('.mf-thankyou-revamp-container');
  const closeBtn = thankyou?.querySelector('.mf__dismissible-container--head');

  const fieldIsReqMsg = container?.getAttribute('data-attr-emptyFieldError') || 'Field is required';
  const validMobNoMsg = container?.getAttribute('data-attr-mobileError') || 'Phone number is invalid';
  const validPincodeMsg = container?.getAttribute('data-attr-pincodeError') || 'Enter a valid 6 digit Zip Code';

  function onFocus(fieldWrap) {
    setError(fieldWrap, '');
    setLabelTop(fieldWrap, true);
  }

  function onBlur(fieldWrap, input) {
    if (!input.value.trim()) {
      setError(fieldWrap, fieldIsReqMsg);
      setLabelTop(fieldWrap, false);
    }
  }

  function onChange(fieldWrap, input) {
    setLabelTop(fieldWrap, !!input.value.trim());
  }

  mobileInput?.addEventListener('focus', () => onFocus(mobileWrap));
  mobileInput?.addEventListener('blur', () => onBlur(mobileWrap, mobileInput));
  mobileInput?.addEventListener('input', () => {
    limitDigits(mobileInput, 10);
    onChange(mobileWrap, mobileInput);
    // eslint-disable-next-line max-len
    if (mobileInput.value.trim() && !isMobileValid(mobileInput.value)) setError(mobileWrap, validMobNoMsg);
    else setError(mobileWrap, '');
  });

  pinInput?.addEventListener('focus', () => onFocus(pinWrap));
  pinInput?.addEventListener('blur', () => onBlur(pinWrap, pinInput));
  pinInput?.addEventListener('input', () => {
    limitDigits(pinInput, 6);
    onChange(pinWrap, pinInput);
    // eslint-disable-next-line max-len
    if (pinInput.value.trim() && !isPincodeValid(pinInput.value)) setError(pinWrap, validPincodeMsg);
    else setError(pinWrap, '');
  });

  const checkmark = block.querySelector('.whatsapp-consent-checkmark');
  checkmark?.addEventListener('click', () => consentInput?.click());
  checkmark?.addEventListener('keydown', (e) => { if (e.key === 'Enter') consentInput?.click(); });

  function isFormValid() {
    const m = mobileInput.value.trim();
    const p = pinInput.value.trim();
    let ok = true;

    if (!m) { setError(mobileWrap, fieldIsReqMsg); ok = false; }
    else if (!isMobileValid(m)) { setError(mobileWrap, validMobNoMsg); ok = false; }

    if (!p) { setError(pinWrap, fieldIsReqMsg); ok = false; }
    else if (!isPincodeValid(p)) { setError(pinWrap, validPincodeMsg); ok = false; }

    return ok;
  }

  function showThankYou(success) {
    if (!thankyou || !container) return;

    // Like AMS: hide form & hero background, show thankyou [1](https://asianpaints-my.sharepoint.com/personal/p00126660_asianpaints_com/Documents/Microsoft%20Copilot%20Chat%20Files/miniform.js)
    container.style.display = 'none';
    bgContainer.style.display = 'none';
    thankyou.style.display = 'block';

    const okLeft = thankyou.querySelector('.mf-thank-you-left-content');
    const errLeft = thankyou.querySelector('.mf-error-left-content');
    if (okLeft && errLeft) {
      okLeft.style.display = success ? 'block' : 'none';
      errLeft.style.display = success ? 'none' : 'block';
    }
  }

  function resetFromThankYou() {
    if (!thankyou || !container) return;
    thankyou.style.display = 'none';
    bgContainer.style.display = '';
    container.style.display = '';
  }

  closeBtn?.addEventListener('click', resetFromThankYou);
  closeBtn?.addEventListener('keydown', (e) => { if (e.key === 'Enter') resetFromThankYou(); });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    spinner?.classList.remove('d-none');

    // AesUtil requires CryptoJS globally (your earlier AMS flow uses AesUtil too) [1](https://asianpaints-my.sharepoint.com/personal/p00126660_asianpaints_com/Documents/Microsoft%20Copilot%20Chat%20Files/miniform.js)[6](https://asianpaints-my.sharepoint.com/personal/p00126660_asianpaints_com/Documents/Microsoft%20Copilot%20Chat%20Files/hero-form.js)
    if (!window.CryptoJS) {
      showThankYou(false);
      spinner?.classList.add('d-none');
      return;
    }

    const utm = getUtmParams();
    const visitorId = getVisitorId();
    const whatsAppConsent = consentInput?.checked ? 'Y' : 'N';

    const aesUtil = new AesUtil(128, 1000);
    const fNameEnc = aesUtil.ltyEncrypt('NA');
    const lNameEnc = aesUtil.ltyEncrypt('NA');
    const mobileEnc = aesUtil.ltyEncrypt(mobileInput.value.trim());
    const pinEnc = aesUtil.ltyEncrypt(pinInput.value.trim());

    const email = `${mobileInput.value.trim()}na@asianpaints.com`;

    const payload = buildBasePayload();
    payload.pageUrl = window.location.href;
    payload.node = cfg.node || container.getAttribute('data-attr-respath') || '';
    payload.campaignId = utm.campaignId || cfg.campaignId || container.getAttribute('data-attr-campaignId') || '';
    payload.marketingChannel = 'Direct';
    payload.visitorId = visitorId;
    payload.whatsAppConsent = whatsAppConsent;

    payload.fName = fNameEnc;
    payload.lName = lNameEnc;
    payload.mobileNo = mobileEnc;
    payload.pinCode = pinEnc;
    payload.email = email;

    payload.source = utm.source;
    payload.medium = utm.medium;
    payload.utmContent = utm.utmContent;
    payload.utmId = utm.utmId;
    payload.utmAdgroupName = utm.utmAdgroupName;
    payload.utmKeyword = utm.utmKeyword;
    payload.utmKeywordMatchType = utm.utmKeywordMatchType;
    payload.utmCampaignSource = utm.utmCampaignSource;

    try {
      // DB call first, like AMS [1](https://asianpaints-my.sharepoint.com/personal/p00126660_asianpaints_com/Documents/Microsoft%20Copilot%20Chat%20Files/miniform.js)
      const dbResp = await postFormUrlEncoded(
        `${AMS_BASE}/apcolourcatalogue/ccforms.saveleadform.json`,
        payload,
      );

      if (dbResp && dbResp.Status === 'SUCCESS' && dbResp.rowID) {
        // SF call after DB success, like AMS [1](https://asianpaints-my.sharepoint.com/personal/p00126660_asianpaints_com/Documents/Microsoft%20Copilot%20Chat%20Files/miniform.js)
        const sfPayload = { ...payload, rowId: dbResp.rowID };
        const sfResp = await postFormUrlEncoded(
          `${AMS_BASE}/apcolourcatalogue/ccforms/salesforce.leadstosalesforce.json`,
          sfPayload,
        );

        const ok = sfResp && (sfResp.returnCode === 201 || sfResp.returnCode === '201');

        // If redirect configured, behave like AMS “formRedirect” concept [1](https://asianpaints-my.sharepoint.com/personal/p00126660_asianpaints_com/Documents/Microsoft%20Copilot%20Chat%20Files/miniform.js)
        const redirect = container.getAttribute('data-attr-redirection');
        if (ok && redirect) {
          window.location.href = redirect;
        } else {
          showThankYou(!!ok);
        }
      } else {
        showThankYou(false);
      }
    } catch (err) {
      showThankYou(false);
    } finally {
      spinner?.classList.add('d-none');
    }
  });
}