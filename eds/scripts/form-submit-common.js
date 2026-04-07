import { AesUtil } from './aesUtil.module.js';

const DEFAULT_ENDPOINTS = {
  saveToDB: 'https://beta.asianpaints.com/apcolourcatalogue/ccforms.saveleadform.json',
  pushToSalesforce: 'https://beta.asianpaints.com/apcolourcatalogue/ccforms/salesforce.leadstosalesforce.json',
};

const DEFAULT_SELECTORS = {
  name: '#enquire-name',
  email: '#enquire-email',
  mobile: '#enquire-mobile',
  pincode: '#enquire-pincode',
  whatsappConsent: '.whatsAppConsentFormFld',
};

export function splitName(fullName) {
  const normalized = (fullName || '').trim().replace(/\s+/g, ' ');
  if (!normalized) {
    return { fName: '', lName: '' };
  }

  const firstSpace = normalized.indexOf(' ');
  if (firstSpace === -1) {
    return { fName: normalized, lName: '' };
  }

  return {
    fName: normalized.substring(0, firstSpace),
    lName: normalized.substring(firstSpace + 1),
  };
}

export function getVisitorId() {
  try {
    if (window._satellite && window._satellite.getVisitorId) {
      return window._satellite.getVisitorId().getMarketingCloudVisitorID() || '';
    }
  } catch (e) {
    return '';
  }
  return '';
}

export function getCampaignIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return (urlParams.get('utm_campaign') || '').trim();
}

export function encryptLeadFields({ fName, lName, email, mobileNo, pinCode }) {
  try {
    if (!window.CryptoJS) {
      return { fName, lName, email, mobileNo, pinCode };
    }

    const aesUtil = new AesUtil(128, 1000);
    return {
      fName: aesUtil.ltyEncrypt(fName),
      lName: aesUtil.ltyEncrypt(lName),
      email: aesUtil.ltyEncrypt(email),
      mobileNo: aesUtil.ltyEncrypt(mobileNo),
      pinCode: aesUtil.ltyEncrypt(pinCode),
    };
  } catch (e) {
    return { fName, lName, email, mobileNo, pinCode };
  }
}

export function postFormUrlEncoded(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Accept: 'application/json, text/plain, */*',
    },
    body: new URLSearchParams(data),
    credentials: 'same-origin',
  }).then(async (res) => {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      return { raw: text, status: res.status };
    }
  });
}

export function buildLeadPayload(form, options = {}) {
  const selectors = { ...DEFAULT_SELECTORS, ...(options.selectors || {}) };
  const fullName = form.querySelector(selectors.name)?.value?.trim() || '';
  const { fName, lName } = splitName(fullName);
  const email = form.querySelector(selectors.email)?.value?.trim() || '';
  const mobileNo = form.querySelector(selectors.mobile)?.value?.trim() || '';
  const pinCode = form.querySelector(selectors.pincode)?.value?.trim() || '';
  const whatsAppConsent = form.querySelector(selectors.whatsappConsent)?.classList.contains('whatsAppCheckbox-checked') ? 'Y' : 'N';

  return {
    pageUrl: options.pageUrl || window.location.href,
    node: options.resourcePath || window.location.pathname || '',
    fName,
    lName,
    email,
    mobileNo,
    pinCode,
    whatsAppConsent,
    encrypted: encryptLeadFields({ fName, lName, email, mobileNo, pinCode }),
    visitorId: getVisitorId(),
    campaignId: options.campaignId ?? getCampaignIdFromUrl(),
  };
}

export function saveToDB(lead, options = {}) {
  const endpoints = { ...DEFAULT_ENDPOINTS, ...(options.endpoints || {}) };

  return postFormUrlEncoded(endpoints.saveToDB, {
    pageUrl: lead.pageUrl,
    node: lead.node,
    lName: lead.encrypted.lName,
    pinCode: lead.encrypted.pinCode,
    email: lead.encrypted.email,
    mobileNo: lead.encrypted.mobileNo,
    fName: lead.encrypted.fName,
    visitorId: lead.visitorId,
    whatsAppConsent: lead.whatsAppConsent,
    campaignId: lead.campaignId,
  });
}

export function pushToSalesforce(lead, rowId, options = {}) {
  const endpoints = { ...DEFAULT_ENDPOINTS, ...(options.endpoints || {}) };

  return postFormUrlEncoded(endpoints.pushToSalesforce, {
    pageUrl: lead.pageUrl,
    node: lead.node,
    lName: lead.encrypted.lName,
    pinCode: lead.encrypted.pinCode,
    email: lead.encrypted.email,
    mobileNo: lead.encrypted.mobileNo,
    fName: lead.encrypted.fName,
    visitorId: lead.visitorId,
    whatsAppConsent: lead.whatsAppConsent,
    campaignId: lead.campaignId,
    campaignName: lead.campaignId,
    rowId,
  });
}

export function submitLeadFromForm(form, options = {}) {
  const lead = buildLeadPayload(form, options);

  return saveToDB(lead, options)
    .then((dbResult) => {
      const rowId = dbResult?.rowID || `direct-${Date.now()}`;
      return pushToSalesforce(lead, rowId, options);
    });
}
