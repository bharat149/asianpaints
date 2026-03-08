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
    if (typeof window._satellite !== 'undefined'
      && window._satellite.getVisitorId
      && window._satellite.getVisitorId().getMarketingCloudVisitorID) {
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

function isMobileValid(v) { return /^[0-9]{10}$/.test((v || '').trim()); }
function isPincodeValid(v) { return /^[0-9]{6}$/.test((v || '').trim()); }

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
 * IMPORTANT: Cross-origin to beta causes CORS preflight if we send non-simple headers.
 * Remove X-Requested-With to avoid OPTIONS preflight and reduce 403s.
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
  return `
    <div class="miniform hero-miniform">
      <div class="find-contractor-form-container track_field_focus"
        data-attr-respath="${cfg.node || ''}"
        data-attr-campaignId="${cfg.campaignId || ''}"
        data-attr-emptyFieldError="${cfg.fieldRequiredMsg || 'Field is required'}"
        data-attr-mobileError="${cfg.mobileErrorMsg || 'Phone number is invalid'}"
        data-attr-pincodeError="${cfg.pincodeErrorMsg || 'Enter a valid 6 digit Zip Code'}">

        <div class="title-section">
          <p>${cfg.title || 'Let our experts help you!'}</p>
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

          <div class="disclaimer-section">
            ${cfg.disclaimerHtml || 'By proceeding, you are authorizing Asian Paints and its suggested contractors to get in touch with you through calls, sms, or e-mail'}
          </div>

          <button type="submit" class="get-contractors-button hero-form-submit">
            ${cfg.ctaLabel || 'Get recommended contractor'}
            <span class="rotating js-rotatingLeadForm get-contractor-progress-status d-none">↻</span>
          </button>
        </form>
      </div>

      <div class="mf-thankyou-revamp-container" style="display:none">
        <div class="mf__dismissible-container--head" role="button" tabindex="0" aria-label="Close">
          <span class="mf-close-icon">×</span>
        </div>

        <div class="row no-gutters mf-revamp-thankyou">
          <div class="col-lg-4 col-12 mf-revamp-thankyou-left">
            <div class="mf-thank-you-left-content" style="display:block">
              <h2>${cfg.thankYouLeftSuccessHeading || 'Thank you!'}</h2>
              <p>${cfg.thankYouLeftSuccessDescription || 'We will contact you shortly.'}</p>
            </div>

            <div class="mf-error-left-content" style="display:none">
              <h2>${cfg.thankYouLeftErrorHeading || 'Something went wrong'}</h2>
              <p>${cfg.thankYouLeftErrorDescription || 'Please try again later.'}</p>
            </div>
          </div>

          <div class="col-lg-8 col-12 mf-revamp-thankyou-right"
            style="--bg-image-desktop:url('${cfg.thankYouBgDesktop || ''}');
                   --bg-image-mob:url('${cfg.thankYouBgMobile || ''}');">
            <div class="mf-thank-you-message" style="display:block">
              <p class="mf-thank-you-message-title">${cfg.thankYouRightHeading || ''}</p>
              <p class="mf-thank-you-message-subtitle">${cfg.thankYouRightSub1 || ''}</p>
              <p class="mf-thank-you-message-subtitle">${cfg.thankYouRightSub2 || ''}</p>
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
  const rows = [...block.children];
  let picture = null;

  rows.forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) picture = pic;
    });
  });

  const cfg = {
    node: block.dataset.node || '',
    campaignId: block.dataset.campaignid || '',
    title: block.dataset.title || 'Let our experts help you!',
    ctaLabel: block.dataset.ctalabel || 'Get recommended contractor',
    whatsappConsentText: block.dataset.whatsapptext || 'Update me on WhatsApp',
    disclaimerHtml: block.dataset.disclaimer || '',
    thankYouBgDesktop: block.dataset.thankyoudesktop || '',
    thankYouBgMobile: block.dataset.thankyouwmobile || '',
  };

  block.innerHTML = '';

  // Keep original overlay structure: background first, then panel wrapper
  if (picture) {
    const bgContainer = document.createElement('div');
    bgContainer.className = 'hero-form-background';
    bgContainer.appendChild(picture);
    block.appendChild(bgContainer);
  }

  const formWrapper = document.createElement('div');
  formWrapper.className = 'hero-form-panel-wrapper';
  formWrapper.appendChild(htmlToEl(buildMarkup(cfg)));
  block.appendChild(formWrapper);

  const container = block.querySelector('.find-contractor-form-container');
  const form = block.querySelector('.hero-form-contact');
  const mobileWrap = block.querySelector('.mobile-input-section');
  const pinWrap = block.querySelector('.pincode-input-section');
  const mobileInput = block.querySelector('#mobile-number');
  const pinInput = block.querySelector('#pincode');
  const consentInput = block.querySelector('#whatsapp-consent-input');
  const spinner = block.querySelector('.get-contractor-progress-status');
  const thankyou = block.querySelector('.mf-thankyou-revamp-container');

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
    if (input.value.trim()) setLabelTop(fieldWrap, true);
    else setLabelTop(fieldWrap, false);
  }

  mobileInput?.addEventListener('focus', () => onFocus(mobileWrap));
  mobileInput?.addEventListener('blur', () => onBlur(mobileWrap, mobileInput));
  mobileInput?.addEventListener('input', () => {
    limitDigits(mobileInput, 10);
    onChange(mobileWrap, mobileInput);
    if (mobileInput.value.trim()
      && !isMobileValid(mobileInput.value)) setError(mobileWrap, validMobNoMsg);
    else setError(mobileWrap, '');
  });

  pinInput?.addEventListener('focus', () => onFocus(pinWrap));
  pinInput?.addEventListener('blur', () => onBlur(pinWrap, pinInput));
  pinInput?.addEventListener('input', () => {
    limitDigits(pinInput, 6);
    onChange(pinWrap, pinInput);
    if (pinInput.value.trim()
      && !isPincodeValid(pinInput.value)) setError(pinWrap, validPincodeMsg);
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
    container.style.display = 'none';
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
    container.style.display = '';
  }

  const closeBtn = thankyou?.querySelector('.mf__dismissible-container--head');
  closeBtn?.addEventListener('click', resetFromThankYou);
  closeBtn?.addEventListener('keydown', (e) => { if (e.key === 'Enter') resetFromThankYou(); });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    spinner?.classList.remove('d-none');

    // Require CryptoJS globally for AesUtil to work
    if (!window.CryptoJS) {
      // Fail fast; encryption cannot work without CryptoJS
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
      const dbResp = await postFormUrlEncoded(
        `${AMS_BASE}/apcolourcatalogue/ccforms.saveleadform.json`,
        payload,
      );

      if (dbResp && dbResp.Status === 'SUCCESS' && dbResp.rowID) {
        const sfPayload = { ...payload, rowId: dbResp.rowID };
        const sfResp = await postFormUrlEncoded(
          `${AMS_BASE}/apcolourcatalogue/ccforms/salesforce.leadstosalesforce.json`,
          sfPayload,
        );

        const ok = sfResp && (sfResp.returnCode === 201 || sfResp.returnCode === '201');
        showThankYou(!!ok);
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
