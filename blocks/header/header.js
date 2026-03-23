/**
 * Header Block
 * Fetches nav.plain.html and renders a 3-tier header:
 * Row 0: Brand bar (dark blue)
 * Row 1: Main header (logo, search, action icons, CTA, hamburger)
 * Row 2: Navigation bar (home icon, main nav with megamenu, secondary nav)
 *
 * Integrations (matching original asianpaints.com):
 * - Search with location detection API + autocomplete dropdown
 * - Keycloak SSO authentication (login/profile state)
 * - MiniCart API for live cart badge count
 * - Visual search with file upload, drag-and-drop, and validation
 */

import { getMetadata, decorateIcons } from '../../scripts/aem.js';

const DESKTOP_BREAKPOINT = 992;
const CURRENT_ORIGIN = window.location.origin;
// Use relative URL for same-origin fetch (avoids CORS when on branch previews)
const CONFIG_URL = '/config.json';
const DEFAULT_API_BASE = 'https://beta.asianpaints.com';
const DEFAULT_KEYCLOAK_AUTH = 'https://betaauth.asianpaints.com';

const headerConfig = {
  apiBaseUrl: DEFAULT_API_BASE,
  keycloakAuthUrl: DEFAULT_KEYCLOAK_AUTH,
};

const HEADER_ICON_PATHS = {
  PROFILE_LOGGED_OUT: '/icons/profile-icon-gray-brown.png',
  PROFILE_LOGGED_IN: '/icons/profile-icon-logged-in.png',
};

// Redirect URI (whitelisted on betaauth) — use current origin so user lands back on this site
const AUTH_REDIRECT_URI = `${window.location.origin}/`;
const SIGNED_OUT_KEY = 'ap_signed_out';
const AUTH_REDIRECTED_KEY = 'ap_auth_redirected';

async function fetchHeaderConfig() {
  try {
    const resp = await fetch(CONFIG_URL);
    if (!resp.ok) return;
    const json = await resp.json();
    const data = json?.data || [];
    data.forEach(({ key, value }) => {
      if (key && value) {
        if (key === 'api-base-url') headerConfig.apiBaseUrl = value.replace(/\/$/, '');
        if (key === 'keycloak-auth-url') headerConfig.keycloakAuthUrl = value.replace(/\/$/, '');
      }
    });
  } catch (e) {
    // use defaults
  }
}

function getApiBaseUrl() {
  return headerConfig.apiBaseUrl || DEFAULT_API_BASE;
}

const FORM_MODAL_PATH_SEGMENT = '/forms/';
const BOOK_SITE_VISIT_HASH = '#book-site-visit';
const BOOK_SITE_VISIT_PAGE_PATH = '/forms/book-free-site-visit.html';
const BOOK_SITE_VISIT_FRAGMENT_PATH = '/forms/book-free-site-visit';

function isOnAsianPaintsDomain() {
  const host = window.location.hostname.toLowerCase();
  return host === 'asianpaints.com' || host.endsWith('.asianpaints.com');
}

function getApOrigin() {
  return isOnAsianPaintsDomain() ? CURRENT_ORIGIN : getApiBaseUrl();
}

/**
 * Resolve AP paths relative on first-party domains and absolute elsewhere.
 */
function apUrl(path) {
  if (!path) return getApOrigin();
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return isOnAsianPaintsDomain() ? normalizedPath : `${getApiBaseUrl()}${normalizedPath}`;
}

function normalizeInternalPath(href) {
  if (!href) return '';
  try {
    const url = new URL(href, window.location.href);
    return url.pathname.replace(/(\.plain)?\.html$/, '');
  } catch {
    return '';
  }
}

function getModalPathFromHref(href) {
  if (href === BOOK_SITE_VISIT_HASH) return BOOK_SITE_VISIT_FRAGMENT_PATH;
  if (href?.startsWith('#')) return '';
  const path = normalizeInternalPath(href);
  return path.includes(FORM_MODAL_PATH_SEGMENT) ? path : '';
}

function resolveCtaHref(href) {
  return href === BOOK_SITE_VISIT_HASH ? BOOK_SITE_VISIT_PAGE_PATH : href;
}

/* eslint-disable max-len */
const AP_PATHS = {
  DETECT_LOCATION: '/apcolourcatalogue/detect-location',
  CONTRACTOR_PROFILE: '/apcolourcatalogue/contractorprofile.json',
  MINI_CART: '/apcolourcatalogue/commerce/miniCart.json',
  VISUAL_SEARCH_UPLOAD: '/apcolourcatalogue/visualSearch',
  DEALER_LOCATOR: '/content/ap/en/home/store-locator/jcr:content/root/responsivegrid_320175147/responsivegrid_242725073/storelocatorlepton_c.json',
};
/* eslint-enable max-len */

function getApApi() {
  return {
    DETECT_LOCATION: apUrl(AP_PATHS.DETECT_LOCATION),
    CONTRACTOR_PROFILE: apUrl(AP_PATHS.CONTRACTOR_PROFILE),
    MINI_CART: apUrl(AP_PATHS.MINI_CART),
    SEARCH_RESULTS: apUrl('/content/ap/en/home/searchresult.html'),
    DEALER_PAGE: apUrl('/content/ap/en/home/store-locator.html'),
    CONTRACTOR_PAGE: apUrl('/content/ap/en/home/contractor-listing-page.html'),
    KEYCLOAK_URL: headerConfig.keycloakAuthUrl || DEFAULT_KEYCLOAK_AUTH,
    KEYCLOAK_REALM: 'asianpaintsRealm',
    KEYCLOAK_CLIENT: 'asianpaints',
    KEYCLOAK_JS: 'https://cdn.jsdelivr.net/npm/keycloak-js@22.0.3/dist/keycloak.min.js',
    KEYCLOAK_PAGE_URL: `${getApOrigin()}/content/ap/en/home/key-cloak.html`,
    PROFILE_PAGE: apUrl('/content/ap/en/home/my-profile.html'),
    WISHLIST_PAGE: apUrl('/content/ap/en/home/my-wishlist.html'),
    SHOP_URL: apUrl('/paint-products.html'),
    VISUAL_SEARCH_UPLOAD: apUrl(AP_PATHS.VISUAL_SEARCH_UPLOAD),
    UNBXD_API_KEY: 'decd8e031bd76ff9fa152afeadcb1773',
    UNBXD_SITE_KEY: 'ss-unbxd-prod-asianpaints46541696944854',
    UNBXD_BASE: 'https://search.unbxd.io',
  };
}

const AP_GEO_PLACE = {
  API_URL: 'https://places.googleapis.com/v1/places:searchText',
  API_KEY: 'AIzaSyAbju50ovh011X-_bJKuGK7NtrnSxS5h7I',
  FIELD_MASK: 'places.location',
};

/* eslint-disable max-len */
const DEALER_LOCATOR_TYPE_FILTER = 'Beautiful Homes,Colour Ideas,EzyCR Prime,EZY CR,CR NXT Prime,CR NXT,Colour World,Non-colour world';
/* eslint-enable max-len */

function resolveApLink(urlOrPath, fallback = getApApi().SHOP_URL) {
  if (!urlOrPath) return fallback;
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
  return apUrl(urlOrPath.startsWith('/') ? urlOrPath : `/${urlOrPath}`);
}

async function fetchFromAp(pathOrUrl, options = {}) {
  let url = pathOrUrl;
  if (!/^https?:\/\//i.test(pathOrUrl)) {
    url = apUrl(pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`);
  }
  try {
    const response = await fetch(url, options);
    return response.ok ? response : null;
  } catch {
    return null;
  }
}

/* eslint-disable max-len */
const SEARCH_SUGGESTIONS_LINKS = [
  { text: 'Colour Inspiration', href: apUrl('/inspiration/ideas/colour-inspiration.html') },
  { text: 'Interior Textures', href: apUrl('/catalogue/interior-textures.html') },
  { text: 'Exterior Textures', href: apUrl('/catalogue/exterior-textures.html') },
  { text: 'Wallpaper', href: apUrl('/products/wall-coverings.html') },
  { text: 'Blogs', href: apUrl('/blogs.html') },
  { text: 'Shade Card', href: apUrl('/catalogue/colour-catalogue.html') },
];

/* EDS icons: use icon names matching /icons/<name>.svg (decorateIcons pattern) */
const SEARCH_QUICK_LINKS = [
  { text: 'Beautiful Homes Painting Service', href: apUrl('/services/asian-paints-safe-painting-service.html'), icon: 'ql-bh-painting' },
  { text: 'Interior Design Solution', href: apUrl('/services/beautiful-homes-service.html'), icon: 'ql-interior-design' },
  { text: 'Budget Calculators', href: apUrl('/resources/tools/paint-budget-calculator.html'), icon: 'ql-budget-calculator' },
  { text: 'Home Colour Guide', href: apUrl('/home-colour-guide.html'), icon: 'ql-home-colour-guide' },
];

const TRENDING_ARROW_SVG = '<svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.55556 1.22217H11M11 1.22217V5.66661M11 1.22217L6.55556 5.66661L4.33333 3.44439L1 6.77772" stroke="#111827" stroke-width="1.13" stroke-linecap="round" stroke-linejoin="round"/></svg>';
/* eslint-enable max-len */

const FALLBACK_TRENDING_QUERIES = ['Beige', 'Grey', 'White', 'Cream', 'Green', 'Ivory', 'Blue', 'Exterior'];
const suggestionPreviewCache = new Map();
let suggestionPreviewToken = 0;

const SUGGESTION_CATEGORY_LABELS = {
  shade: 'Colours',
  gallery: 'Inspirations & Design Ideas',
  texture: 'Textures',
  wallpaper: 'Wallpapers',
};

const SUGGESTION_CATEGORY_ORDER = ['Colours', 'Inspirations & Design Ideas', 'Textures', 'Wallpapers'];

const VS_ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/tiff'];
const VS_MAX_SIZE_MB = 5;
const SEARCH_DEBOUNCE_MS = 80;
const SEARCH_RESULTS_DEBOUNCE_MS = 400;
const LOCATION_DETECTION_DEBOUNCE_MS = 1500;

const DEALER_KEYWORDS = [
  'dealers', 'dealer', 'store', 'stores', 'shop', 'paint shop', 'brand',
];

const CONTRACTOR_KEYWORDS = [
  'contractors', 'contractor', 'painters', 'painter', 'worker', 'service', 'expert',
];

let keycloakInstance = null;

function getUnbxdUid() {
  let uid = localStorage.getItem('unbxd-uid');
  if (!uid) {
    uid = `uid-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    localStorage.setItem('unbxd-uid', uid);
  }
  return uid;
}

// ──────────────────────────────────────────────
//  API: Unbxd Autosuggest + Search
// ──────────────────────────────────────────────

async function fetchUnbxdAutosuggest(query, options = {}) {
  const uid = getUnbxdUid();
  const api = getApApi();
  const base = `${api.UNBXD_BASE}/${api.UNBXD_API_KEY}/${api.UNBXD_SITE_KEY}`;
  const fields = options.fields
    || 'title,price,imageUrl,sku,cfType,entityCode,computed_discount,productUrl,sellingPrice,priceAfterReduction,uniqueId,id,autosuggest,doctype';
  const params = new URLSearchParams({
    q: query || '*',
    version: 'V2',
    uid,
    'inFields.count': String(options.inFieldsCount ?? 0),
    'topQueries.count': String(options.topQueriesCount ?? 8),
    'keywordSuggestions.count': '0',
    'promotedSuggestion.count': '0',
    'popularProducts.count': String(options.popularProductsCount ?? 6),
    'popularProducts.fields': fields,
    indent: 'off',
    fallback: 'true',
  });
  if (options.includeSourceFields) {
    params.set('sourceFields', 'Texture,Shade,Wallpaper,gallery');
    params.set('sourceField.Texture.count', '4');
    params.set('sourceField.Shade.count', '5');
    params.set('sourceField.Wallpaper.count', '4');
    params.set('sourceField.gallery.count', '4');
  }
  try {
    const resp = await fetch(`${base}/autosuggest?${params}`);
    if (!resp.ok) return null;
    return resp.json();
  } catch {
    return null;
  }
}

async function fetchUnbxdSearch(query) {
  const api = getApApi();
  const base = `${api.UNBXD_BASE}/${api.UNBXD_API_KEY}/${api.UNBXD_SITE_KEY}`;
  const fields = 'title,price,imageUrl,sku,cfType,entityCode,computed_discount,productUrl,sellingPrice,priceAfterReduction,uniqueId,id,autosuggest,doctype';
  const params = new URLSearchParams({
    q: query,
    fields,
    rows: '6',
    indent: 'off',
    facet: 'off',
    analytics: 'false',
    redirect: 'false',
    version: 'V2',
  });
  try {
    const resp = await fetch(`${base}/search?${params}`);
    if (!resp.ok) return null;
    return resp.json();
  } catch {
    return null;
  }
}

function containsIndianPincode(text) {
  return /\b[1-9][0-9]{5}\b/.test(text || '');
}

function findNlpEntity(query) {
  const text = (query || '').toLowerCase();
  if (!text) return '';
  if (CONTRACTOR_KEYWORDS.some((kw) => text.includes(kw))) return 'contractor';
  if (DEALER_KEYWORDS.some((kw) => text.includes(kw))) return 'dealer';
  return '';
}

function extractLocationFromQuery(query) {
  const match = (query || '').match(/\b(?:in|near|at)\s+([^,]+)$/i);
  if (!match) return '';
  return match[1].trim();
}

async function fetchDetectedLocations(query) {
  if (!query || query.length < 3) return [];
  try {
    const params = new URLSearchParams({ text: query });
    const resp = await fetchFromAp(`${AP_PATHS.DETECT_LOCATION}?${params}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    });
    if (!resp) return [];
    const data = await resp.json();
    if (!Array.isArray(data?.locations)) return [];
    return data.locations
      .map((loc) => (typeof loc === 'string' ? loc : loc?.location))
      .filter(Boolean);
  } catch {
    return [];
  }
}

async function fetchContractorsByLocation(location) {
  if (!location) return [];
  try {
    const key = containsIndianPincode(location) ? 'pinCode' : 'area';
    const params = new URLSearchParams({ [key]: location, _: String(Date.now()) });
    const resp = await fetchFromAp(`${AP_PATHS.CONTRACTOR_PROFILE}?${params}`, { credentials: 'include' });
    if (!resp) return null;
    const data = await resp.json();
    return Array.isArray(data?.data) ? data.data : [];
  } catch {
    return null;
  }
}

const placeCoordinatesCache = new Map();

async function fetchLocationCoordinates(location) {
  const key = (location || '').trim().toLowerCase();
  if (!key) return null;
  if (placeCoordinatesCache.has(key)) return placeCoordinatesCache.get(key);

  try {
    const resp = await fetch(AP_GEO_PLACE.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': AP_GEO_PLACE.API_KEY,
        'X-Goog-FieldMask': AP_GEO_PLACE.FIELD_MASK,
      },
      body: JSON.stringify({ textQuery: location, maxResultCount: 1 }),
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const coords = data?.places?.[0]?.location;
    if (coords?.latitude == null || coords?.longitude == null) return null;
    placeCoordinatesCache.set(key, coords);
    return coords;
  } catch {
    return null;
  }
}

async function fetchDealersByLocation(location) {
  if (!location) return [];
  const coords = await fetchLocationCoordinates(location);
  if (!coords) return null;

  try {
    const params = new URLSearchParams({
      latitude: String(coords.latitude),
      longitude: String(coords.longitude),
      radius: '5000',
      limit: '4',
      typeofretailer: DEALER_LOCATOR_TYPE_FILTER,
    });
    const resp = await fetchFromAp(`${AP_PATHS.DEALER_LOCATOR}?_=${Date.now()}`, {
      method: 'POST',
      body: params,
      credentials: 'include',
    });
    if (!resp) return null;
    const data = await resp.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return null;
  }
}

// ──────────────────────────────────────────────
//  API: MiniCart
// ──────────────────────────────────────────────

async function fetchMiniCartCount() {
  try {
    const resp = await fetchFromAp(`${getApApi().MINI_CART}?_=${Date.now()}`, { credentials: 'include' });
    if (!resp) return 0;
    const data = await resp.json();
    if (data.status === 'failure') return 0;
    return data.totalItems || data.count || 0;
  } catch {
    return 0;
  }
}

function updateCartBadge(block, count) {
  const badge = block.querySelector('.cart-badge');
  if (!badge) return;
  badge.textContent = String(count);
  badge.style.display = 'flex';
  badge.setAttribute('aria-hidden', 'false');
}

async function primeLocationContext() {
  try {
    await fetchFromAp(`${AP_PATHS.DETECT_LOCATION}?_=${Date.now()}`, { credentials: 'include' });
  } catch {
    // no-op; location enrichment is best-effort
  }
}

// ──────────────────────────────────────────────
//  API: Keycloak Authentication
// ──────────────────────────────────────────────

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function persistKeycloakTokens() {
  if (!keycloakInstance?.authenticated) return;
  try {
    localStorage.setItem('keycloak-token', keycloakInstance.token);
    localStorage.setItem('keycloak-refresh-token', keycloakInstance.refreshToken ?? '');
    if (keycloakInstance.idTokenParsed) {
      localStorage.setItem('userProfile', JSON.stringify(keycloakInstance.idTokenParsed));
    }
    document.cookie = `keycloak_authToken=${keycloakInstance.token}; path=/`;
  } catch (e) { /* ignore */ }
}

function clearKeycloakTokens() {
  try {
    localStorage.removeItem('keycloak-token');
    localStorage.removeItem('keycloak-refresh-token');
    localStorage.removeItem('userProfile');
    document.cookie = 'keycloak_authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  } catch (e) { /* ignore */ }
}

function showWelcomeUserPopup(block, username) {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  if (hashParams && hashParams.get('iss') != null) {
    const greeting = block?.querySelector('.profile-greeting');
    if (greeting && username) {
      greeting.textContent = `Hello ${String(username).toUpperCase()}`;
      greeting.classList.add('visible');
      setTimeout(() => {
        greeting.classList.remove('visible');
      }, 2000);
    }
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

function updateProfileUI(block, authenticated) {
  const profileBtn = block.querySelector('.action-btn.profile-btn');
  if (!profileBtn) return;

  const greeting = block.querySelector('.profile-greeting');
  const profileImg = profileBtn.querySelector('img');
  const setProfileIcon = (loggedIn) => {
    if (!profileImg) return;
    const nextSrc = loggedIn ? profileImg.dataset.loggedInSrc : profileImg.dataset.loggedOutSrc;
    if (nextSrc) profileImg.src = nextSrc;
  };

  if (authenticated && keycloakInstance?.tokenParsed) {
    const name = keycloakInstance.tokenParsed.given_name
      || keycloakInstance.tokenParsed.name
      || '';
    profileBtn.classList.add('logged-in');
    // Swap to AEM icon (has green dot)
    const profileImg = profileBtn.querySelector('img');
    if (profileImg?.dataset.loggedInSrc) profileImg.src = profileImg.dataset.loggedInSrc;
    block.querySelector('.profile-dropdown-wrapper')?.classList.add('is-logged-in');
    setProfileIcon(true);
    // Shared code: showWelcomeUserPopup only when returning from auth (hash has iss)
    showWelcomeUserPopup(block, name || keycloakInstance.tokenParsed.preferred_username || '');
    try {
      const idToken = keycloakInstance.idToken ?? keycloakInstance.token;
      // eslint-disable-next-line no-use-before-define
      setUser({
        name: name || keycloakInstance.tokenParsed.preferred_username || '',
        email: keycloakInstance.tokenParsed.email || '',
        id_token: idToken,
        refresh_token: keycloakInstance.refreshToken,
      });
      persistKeycloakTokens();
    } catch (err) { /* ignore */ }
  } else {
    profileBtn.classList.remove('logged-in');
    // Swap to clean local icon (no green dot)
    const profileImg = profileBtn.querySelector('img');
    if (profileImg) profileImg.src = '/icons/profile-icon.svg';
    block.querySelector('.profile-dropdown-wrapper')?.classList.remove('is-logged-in');
    setProfileIcon(false);
    if (greeting) greeting.classList.remove('visible');
    clearKeycloakTokens();
    window.dispatchEvent(new CustomEvent('keycloakLoginNotReady', {
      detail: { token: keycloakInstance?.token, userId: keycloakInstance?.subject },
    }));
  }
}

/**
 * Whether to attempt the full Keycloak auth flow.
 * True on asianpaints.com (production) by default. On other domains, add
 * ?keycloak=force to the URL to opt-in for testing (you must also register
 * your dev/preview domain in the Keycloak client's Valid Redirect URIs).
 */
function shouldInitKeycloak() {
  if (isOnAsianPaintsDomain()) return true;
  const params = new URLSearchParams(window.location.search);
  return params.get('keycloak') === 'force';
}

function canUsePersistedAuth() {
  if (isOnAsianPaintsDomain()) return true;
  try {
    return sessionStorage.getItem(AUTH_REDIRECTED_KEY) === '1';
  } catch {
    return false;
  }
}

function refreshToken(block) {
  if (!keycloakInstance?.authenticated) return;
  keycloakInstance.updateToken(30)
    .then((refreshed) => {
      if (refreshed) {
        console.log('Token refreshed:', keycloakInstance.token);
        localStorage.setItem('keycloak-token', keycloakInstance.token);
        localStorage.setItem('keycloak-refresh-token', keycloakInstance.refreshToken ?? '');
        document.cookie = `keycloak_authToken=${keycloakInstance.token}; path=/`;
      } else {
        console.log('Token still valid, no need to refresh.');
      }
    })
    .catch((error) => {
      console.error('Failed to refresh token:', error);
      updateProfileUI(block, false);
    });
}

async function initKeycloak(block) {
  if (!shouldInitKeycloak()) {
    const storedUser = (() => {
      if (keycloakInstance?.authenticated && keycloakInstance?.tokenParsed) return true;
      if (!canUsePersistedAuth()) return false;
      try {
        return !!(localStorage.getItem('userProfile') && localStorage.getItem('keycloak-token'));
      } catch {
        return false;
      }
    })();
    const profileBtn = block.querySelector('.action-btn.profile-btn');
    const profileImg = profileBtn?.querySelector('img');
    const setProfileIcon = (loggedIn) => {
      if (!profileImg) return;
      const nextSrc = loggedIn ? profileImg.dataset.loggedInSrc : profileImg.dataset.loggedOutSrc;
      if (nextSrc) profileImg.src = nextSrc;
    };
    profileBtn?.classList.toggle('logged-in', !!storedUser);
    block.querySelector('.profile-dropdown-wrapper')?.classList.toggle('is-logged-in', !!storedUser);
    setProfileIcon(!!storedUser);
    return;
  }

  try {
    await loadScript(getApApi().KEYCLOAK_JS);
    /* global Keycloak */
    if (typeof Keycloak === 'undefined') {
      updateProfileUI(block, false);
      return;
    }
    const storedToken = localStorage.getItem('keycloak-token');
    const storedRefreshToken = localStorage.getItem('keycloak-refresh-token');

    keycloakInstance = new Keycloak({
      url: getApApi().KEYCLOAK_URL,
      realm: getApApi().KEYCLOAK_REALM,
      clientId: getApApi().KEYCLOAK_CLIENT,
      enablePersistent: true,
    });

    const ssoRedirect = isOnAsianPaintsDomain()
      ? getApApi().KEYCLOAK_PAGE_URL
      : `${window.location.origin}/content/ap/en/home/key-cloak.html`;

    const authenticated = await keycloakInstance.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
      silentCheckSsoRedirectUri: ssoRedirect,
      checkLoginIframe: false,
      enableLogging: true,
      timeSkew: 5,
      Storage: localStorage,
      token: storedToken || undefined,
      refreshToken: storedRefreshToken || undefined,
    });

    updateProfileUI(block, authenticated);

    if (typeof authenticated !== 'undefined' && authenticated) {
      window.dispatchEvent(new CustomEvent('keycloakLoginReady', {
        detail: { token: keycloakInstance.token, userId: keycloakInstance.subject },
      }));
      document.dispatchEvent(new CustomEvent('user-loggedIn'));
      const count = await fetchMiniCartCount();
      updateCartBadge(block, count);
      setTimeout(() => {
        if (localStorage.getItem('redirectPostLoginFlag') === 'true') {
          const redirectPath = localStorage.getItem('redirectPostLoginPath');
          localStorage.removeItem('redirectPostLoginFlag');
          localStorage.removeItem('redirectPostLoginPath');
          if (redirectPath) window.location.href = redirectPath;
        }
      }, 1000);
    }

    keycloakInstance.onTokenExpired = () => {
      refreshToken(block);
    };

    // Periodic token refresh every 30 seconds (matches original site)
    setInterval(() => refreshToken(block), 30000);
  } catch (e) {
    console.log(e);
    console.error('Failed to initialize Keycloak', e);
    updateProfileUI(block, false);
    window.dispatchEvent(new CustomEvent('keycloakLoginNotReady', {
      detail: { token: null, userId: null },
    }));
  }
}

async function handleProfileClick(e) {
  if (keycloakInstance?.authenticated) {
    window.location.href = getApApi().PROFILE_PAGE;
    return;
  }

  e.preventDefault();

  // Production: redirect to OIDC auth URL (auth.asianpaints.com)
  // eslint-disable-next-line no-use-before-define
  const url = await buildProfileAuthUrl(AUTH_REDIRECT_URI);
  window.location.href = url;
}

// ──────────────────────────────────────────────
//  Visual Search: File Validation + Upload
// ──────────────────────────────────────────────

function validateVisualSearchFile(file) {
  if (!file) return { valid: false, error: 'No file selected' };
  if (!VS_ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only JPG, JPEG and PNG file formats are allowed' };
  }
  if (file.size > VS_MAX_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: `Max file size limit is ${VS_MAX_SIZE_MB}MB` };
  }
  return { valid: true, error: null };
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getCookieValue(name) {
  const escaped = String(name || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

async function uploadVisualSearchImage(file, modal) {
  const statusEl = modal.querySelector('.vs-status');
  const errorEl = modal.querySelector('.vs-error');
  if (errorEl) errorEl.textContent = '';

  const validation = validateVisualSearchFile(file);
  if (!validation.valid) {
    if (errorEl) {
      errorEl.textContent = validation.error;
      errorEl.style.display = 'block';
    }
    return;
  }

  if (statusEl) {
    statusEl.textContent = 'Uploading...';
    statusEl.style.display = 'block';
  }

  try {
    const imageDetails = await readFileAsDataUrl(file);
    if (!imageDetails) throw new Error('Unable to read image');
    const fileName = file.name || 'uploaded-image';

    const formBody = new URLSearchParams({
      imageDetails: encodeURIComponent(imageDetails),
      referer: document.referrer || '',
      pageUrl: window.location.href,
      uid: getCookieValue('unbxd.userId'),
      visit: getCookieValue('unbxd.visit'),
      visitId: getCookieValue('unbxd.visitId'),
    });

    const resp = await fetchFromAp(AP_PATHS.VISUAL_SEARCH_UPLOAD, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: formBody.toString(),
      credentials: 'include',
    });
    if (resp?.ok) {
      const responseText = await resp.text();
      let data = null;
      try {
        data = responseText ? JSON.parse(responseText) : null;
      } catch {
        data = responseText;
      }

      const redirectUrl = data?.redirectUrl || data?.redirectURL || data?.url;
      if (redirectUrl && /^https?:\/\//i.test(String(redirectUrl))) {
        window.location.href = redirectUrl;
        return;
      }

      if (typeof data?.totalCount !== 'undefined') {
        localStorage.setItem('uploaded-image-search-name', fileName.replace(/\.[^.]+$/, ''));
        window.location.href = `${getApApi().SEARCH_RESULTS}?variantType=visualsearch&ts=${Date.now()}`;
        return;
      }

      if (statusEl) statusEl.textContent = 'Image processed successfully';
    } else if (errorEl) {
      errorEl.textContent = 'Oops file upload failed, please try again!';
      errorEl.style.display = 'block';
    }
  } catch {
    if (errorEl) {
      errorEl.textContent = 'Oops file upload failed, please try again!';
      errorEl.style.display = 'block';
    }
  } finally {
    if (statusEl) statusEl.style.display = 'none';
  }
}

// ──────────────────────────────────────────────
//  Search: Suggestions Dropdown + Redirect
// ──────────────────────────────────────────────

function navigateToSearchResults(query) {
  if (!query || !query.trim()) return;
  window.location.href = `${getApApi().SEARCH_RESULTS}?q=${encodeURIComponent(query.trim())}`;
}

function getSearchResultUrl(query) {
  return `${getApApi().SEARCH_RESULTS}?q=${encodeURIComponent((query || '').trim())}`;
}

function getEntityExploreUrl(entity, query, location) {
  if (!location) return getSearchResultUrl(query);
  if (entity === 'contractor') {
    const mode = containsIndianPincode(query) ? 'pinCode' : 'area';
    return `${getApApi().CONTRACTOR_PAGE}?cpListing=${mode}:${encodeURIComponent(location)}`;
  }
  if (entity === 'dealer') {
    return `${getApApi().DEALER_PAGE}?q=${encodeURIComponent(location)}`;
  }
  return getSearchResultUrl(query);
}

function setLocationResultState(dialog, state) {
  const panel = dialog.querySelector('.sd-location-results');
  const title = dialog.querySelector('.sd-location-title');
  const list = dialog.querySelector('.sd-location-list');
  const empty = dialog.querySelector('.sd-location-empty');
  const explore = dialog.querySelector('.sd-location-explore');
  if (!panel || !title || !list || !empty || !explore) return;

  panel.classList.remove('active');
  list.innerHTML = '';
  empty.style.display = 'none';
  explore.style.display = 'none';
  explore.removeAttribute('href');

  if (!state || !state.visible) return;

  panel.classList.add('active');
  title.textContent = state.title || '';
  if (state.emptyText) {
    empty.textContent = state.emptyText;
    empty.style.display = 'block';
  }
  if (state.exploreHref) {
    explore.href = state.exploreHref;
    explore.style.display = '';
  }
}

function renderContractorLocationResults(dialog, query, location, contractors) {
  const list = dialog.querySelector('.sd-location-list');
  if (!list) return;

  const exploreHref = getEntityExploreUrl('contractor', query, location);
  const locationLabel = location || 'selected location';

  if (!Array.isArray(contractors) || contractors.length === 0) {
    setLocationResultState(dialog, {
      visible: true,
      title: `Contractors near ${locationLabel}`,
      emptyText: 'Contractors not found for this location',
      exploreHref,
    });
    return;
  }

  setLocationResultState(dialog, {
    visible: true,
    title: `Contractors near ${locationLabel}`,
    exploreHref,
  });

  contractors.slice(0, 4).forEach((contractor) => {
    const card = document.createElement('a');
    card.className = 'sd-location-card';
    card.href = contractor.contractorId
      ? apUrl(`/content/ap/en/home/contractor-locator.${contractor.contractorId}.html`)
      : exploreHref;

    const name = document.createElement('div');
    name.className = 'sd-location-name';
    name.textContent = `${contractor.firstName || ''} ${contractor.lastName || ''}`.trim() || 'Contractor';

    const area = document.createElement('div');
    area.className = 'sd-location-meta';
    area.textContent = contractor.areasServiced?.[0] || locationLabel;

    const rating = document.createElement('div');
    rating.className = 'sd-location-rating';
    const avg = contractor.avgRating || '0';
    const reviews = contractor.totalRatingsCount || 0;
    rating.textContent = `★ ${avg} (${reviews} reviews)`;

    card.append(name, area, rating);
    list.appendChild(card);
  });
}

function renderDealerLocationResults(dialog, query, location, dealers = []) {
  const list = dialog.querySelector('.sd-location-list');
  if (!list) return;

  const locationLabel = location || 'selected location';
  const exploreHref = getEntityExploreUrl('dealer', query, location);

  if (!Array.isArray(dealers) || dealers.length === 0) {
    setLocationResultState(dialog, {
      visible: true,
      title: `Dealers near ${locationLabel}`,
      emptyText: 'Use Explore dealers to view nearby stores',
      exploreHref,
    });
    return;
  }

  setLocationResultState(dialog, {
    visible: true,
    title: `Dealers near ${locationLabel}`,
    exploreHref,
  });

  dealers.slice(0, 4).forEach((dealer) => {
    const card = document.createElement('a');
    card.className = 'sd-location-card';
    if (dealer.latitude && dealer.longitude) {
      card.href = `https://www.google.com/maps/dir/,/${dealer.latitude},${dealer.longitude}`;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
    } else {
      card.href = exploreHref;
    }

    const name = document.createElement('div');
    name.className = 'sd-location-name';
    name.textContent = dealer.contactname || 'Nearby Store';

    const address = document.createElement('div');
    address.className = 'sd-location-meta';
    address.textContent = dealer.address || locationLabel;

    const meta = document.createElement('div');
    meta.className = 'sd-location-rating';
    if (dealer.typeofretailer && dealer.mobileno) {
      meta.textContent = `${dealer.typeofretailer} | +91 ${dealer.mobileno}`;
    } else if (dealer.typeofretailer) {
      meta.textContent = dealer.typeofretailer;
    } else if (dealer.mobileno) {
      meta.textContent = `+91 ${dealer.mobileno}`;
    } else {
      meta.textContent = 'Store details available';
    }

    card.append(name, address, meta);
    list.appendChild(card);
  });
}

/* eslint-disable-next-line max-len */
async function handleLocationAwareSearch(dialog, query, requestToken = 0, getActiveToken = () => requestToken) {
  const isStale = () => requestToken !== getActiveToken();
  if (isStale()) return;

  const entity = findNlpEntity(query);
  if (!entity) {
    if (isStale()) return;
    setLocationResultState(dialog, { visible: false });
    return;
  }

  const locations = await fetchDetectedLocations(query);
  if (isStale()) return;
  let [location] = locations;
  if (!location && !isOnAsianPaintsDomain()) {
    location = extractLocationFromQuery(query);
  }
  if (location && location.trim().length < 3) {
    setLocationResultState(dialog, { visible: false });
    return;
  }
  if (!location) {
    if (isStale()) return;
    setLocationResultState(dialog, { visible: false });
    return;
  }

  if (entity === 'contractor') {
    const contractors = await fetchContractorsByLocation(location);
    if (isStale()) return;
    if (contractors === null) {
      const unavailableText = isOnAsianPaintsDomain()
        ? 'Contractors not found for this location'
        : 'Live contractor preview is unavailable in local mode. Use Explore contractors.';
      setLocationResultState(dialog, {
        visible: true,
        title: `Contractors near ${location}`,
        emptyText: unavailableText,
        exploreHref: getEntityExploreUrl('contractor', query, location),
      });
      return;
    }
    if (!isOnAsianPaintsDomain() && Array.isArray(contractors) && contractors.length === 0) {
      setLocationResultState(dialog, {
        visible: true,
        title: `Contractors near ${location}`,
        emptyText: 'Live contractor preview is unavailable in local mode. Use Explore contractors.',
        exploreHref: getEntityExploreUrl('contractor', query, location),
      });
      return;
    }
    renderContractorLocationResults(dialog, query, location, contractors);
    return;
  }

  const dealers = await fetchDealersByLocation(location);
  if (isStale()) return;
  if (dealers === null) {
    const unavailableText = isOnAsianPaintsDomain()
      ? 'Use Explore dealers to view nearby stores'
      : 'Live dealer preview is unavailable in local mode. Use Explore dealers.';
    setLocationResultState(dialog, {
      visible: true,
      title: `Dealers near ${location}`,
      emptyText: unavailableText,
      exploreHref: getEntityExploreUrl('dealer', query, location),
    });
    return;
  }
  if (!isOnAsianPaintsDomain() && Array.isArray(dealers) && dealers.length === 0) {
    setLocationResultState(dialog, {
      visible: true,
      title: `Dealers near ${location}`,
      emptyText: 'Live dealer preview is unavailable in local mode. Use Explore dealers.',
      exploreHref: getEntityExploreUrl('dealer', query, location),
    });
    return;
  }
  renderDealerLocationResults(dialog, query, location, dealers);
}

// ──────────────────────────────────────────────
//  Search Dialog: Full-screen overlay
// ──────────────────────────────────────────────

function normalizeImageUrl(imageUrl) {
  const value = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
  if (!value || typeof value !== 'string') return '';
  if (value.startsWith('//')) return `https:${value}`;
  if (value.startsWith('/')) return apUrl(value);
  return value;
}

function isRenderableImageUrl(url) {
  if (!url) return false;
  const hasImageShape = /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(url) || url.includes('/content/dam/');
  if (!hasImageShape) return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
    const host = parsed.hostname.toLowerCase();
    if (host.includes('.transform')) return false;
    if (host === 'localhost' || host === '127.0.0.1') return true;
    return host.endsWith('asianpaints.com')
      || host.endsWith('static.asianpaints.com')
      || host.endsWith('search.unbxd.io');
  } catch {
    return false;
  }
}

function getSwatchFallbackUrl(product) {
  const rawCode = product?.uniqueId || product?.entityCode || product?.sku || '';
  if (typeof rawCode !== 'string') return '';
  const normalized = rawCode.startsWith('en-') ? rawCode.slice(3) : rawCode;
  if (!/^[A-Za-z0-9]+$/.test(normalized)) return '';
  return `${getApOrigin()}/content/dam/asian_paints/colours/swatches/${normalized}.png.transform/cc-width-221-height-260/image.png`;
}

function isLikelyShadeCode(value) {
  if (!value || typeof value !== 'string') return false;
  const trimmed = value.trim();
  return /^[A-Za-z]?\d{3,4}$/.test(trimmed);
}

function renderSearchProducts(container, products, isSwatch) {
  container.innerHTML = '';
  products.slice(0, 6).forEach((p) => {
    const card = document.createElement('a');
    card.className = 'sd-product-card';
    const productUrl = Array.isArray(p.productUrl) ? p.productUrl[0] : p.productUrl;
    card.href = productUrl
      ? resolveApLink(productUrl, getSearchResultUrl(p.title))
      : getSearchResultUrl(p.title);

    /* eslint-disable max-len */
    const directImage = normalizeImageUrl(p.imageUrl);
    const fallbackSwatch = isSwatch ? getSwatchFallbackUrl(p) : '';
    const imgUrl = isRenderableImageUrl(directImage) ? directImage : fallbackSwatch;
    /* eslint-enable max-len */
    if (imgUrl) {
      const img = document.createElement('img');
      img.src = imgUrl;
      img.alt = p.title || '';
      img.loading = 'lazy';
      card.appendChild(img);
    }

    const name = document.createElement('div');
    name.className = 'sd-product-name';
    name.textContent = p.title || '';

    const code = document.createElement('div');
    code.className = 'sd-product-code';
    const candidateCode = p.entityCode || p.sku || p.uniqueId?.replace('en-', '') || '';
    const safeCode = candidateCode.includes('/') ? '' : candidateCode;
    code.textContent = isLikelyShadeCode(safeCode) ? safeCode : '';
    if (!code.textContent) code.style.display = 'none';

    card.append(name, code);
    container.appendChild(card);
  });
}

function getLegacyTopQueries(data) {
  const topQueries = data?.response?.topQueries;
  if (Array.isArray(topQueries?.TopQuery)) return topQueries.TopQuery;
  if (Array.isArray(topQueries?.topQuery)) return topQueries.topQuery;
  if (Array.isArray(topQueries)) return topQueries;
  return [];
}

function extractAutosuggestSections(data, preferInField = false) {
  const raw = data?.response?.products;
  let products = [];
  if (Array.isArray(raw?.product)) {
    products = raw.product;
  } else if (Array.isArray(raw)) {
    products = raw;
  }

  const popularProducts = products.filter((item) => item?.doctype === 'POPULAR_PRODUCTS');
  const inFieldProducts = products.filter((item) => item?.doctype === 'IN_FIELD');
  const topSearchQueries = products
    .filter((item) => item?.doctype === 'TOP_SEARCH_QUERIES' || item?.doctype === 'TRENDING_QUERIES')
    .map((item) => item?.autosuggest)
    .filter(Boolean);

  const legacyTopQueries = getLegacyTopQueries(data)
    .map((item) => item?.autosuggest || item?.title || '')
    .filter(Boolean);

  const seen = new Set();
  const dedupedTopQueries = [...topSearchQueries, ...legacyTopQueries]
    .filter((q) => {
      const lower = q.toLowerCase();
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });

  const seenSuggestionKeys = new Set();
  const suggestions = [];
  inFieldProducts.forEach((item) => {
    const text = item?.autosuggest || item?.title || '';
    const category = getSuggestionCategory(item); // eslint-disable-line no-use-before-define
    if (!text) return;
    if (!category) return;
    const key = text.toLowerCase();
    if (seenSuggestionKeys.has(key)) return;
    seenSuggestionKeys.add(key);
    suggestions.push({
      text,
      category,
    });
  });

  let bestResults;
  if (preferInField) {
    bestResults = inFieldProducts.length ? inFieldProducts : popularProducts;
  } else {
    bestResults = popularProducts.length ? popularProducts : inFieldProducts;
  }

  return {
    bestResults: bestResults.length ? bestResults : products,
    topQueries: dedupedTopQueries,
    suggestions: suggestions.slice(0, 8),
  };
}

function getSuggestionCategory(item) {
  const fromCfTypeIn = Array.isArray(item?.cfType_in) ? item.cfType_in[0] : item?.cfType_in;
  const fromCfType = Array.isArray(item?.cfType) ? item.cfType[0] : item?.cfType;
  const rawType = String(fromCfTypeIn || fromCfType || '').toLowerCase().trim();
  if (!rawType) return '';
  const normalized = rawType.replaceAll(/\s+/g, '');
  return SUGGESTION_CATEGORY_LABELS[normalized] || '';
}

function renderTrendingQueries(dialog, queries = []) {
  const trendingContainer = dialog.querySelector('.sd-trending-list');
  if (!trendingContainer) return;

  trendingContainer.innerHTML = '';
  queries.forEach((suggestedQuery) => {
    const tag = document.createElement('button');
    tag.className = 'sd-trending-tag';
    tag.type = 'button';
    const icon = document.createElement('span');
    icon.className = 'sd-trending-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = TRENDING_ARROW_SVG;
    const label = document.createElement('span');
    label.textContent = suggestedQuery;
    tag.append(icon, label);
    tag.addEventListener('click', () => {
      const input = dialog.querySelector('.sd-search-input');
      if (input) {
        input.value = suggestedQuery;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    trendingContainer.appendChild(tag);
  });
}

function renderSearchDialogResults(dialog, data, options = {}) {
  const productsContainer = dialog.querySelector('.sd-best-results-grid');
  if (!productsContainer) return;

  const parsed = extractAutosuggestSections(data, Boolean(options.preferInField));
  renderSearchProducts(productsContainer, parsed.bestResults, true);
  const trendingQ = parsed.topQueries.length
    ? parsed.topQueries : FALLBACK_TRENDING_QUERIES;
  renderTrendingQueries(dialog, trendingQ);
  // eslint-disable-next-line no-use-before-define
  renderSuggestions(dialog, parsed.suggestions, Boolean(options.queryMode), options.queryText || '');
  // eslint-disable-next-line no-use-before-define
  toggleSearchDialogQueryMode(dialog, Boolean(options.queryMode));
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function highlightSuggestionMatch(text, query) {
  const source = String(text || '');
  const q = String(query || '').trim();
  if (!q) return escapeHtml(source);

  const sourceLower = source.toLowerCase();
  const qLower = q.toLowerCase();
  let cursor = 0;
  let html = '';

  while (cursor < source.length) {
    const matchIndex = sourceLower.indexOf(qLower, cursor);
    if (matchIndex === -1) {
      html += escapeHtml(source.slice(cursor));
      break;
    }
    html += escapeHtml(source.slice(cursor, matchIndex));
    html += `<strong>${escapeHtml(source.slice(matchIndex, matchIndex + q.length))}</strong>`;
    cursor = matchIndex + q.length;
  }

  return html;
}

function extractSearchProducts(data) {
  if (Array.isArray(data?.response?.products?.product)) {
    return data.response.products.product;
  }
  if (Array.isArray(data?.response?.products)) {
    return data.response.products;
  }
  return [];
}

async function previewSuggestionResults(dialog, query) {
  const trimmed = (query || '').trim();
  const productsContainer = dialog.querySelector('.sd-best-results-grid');
  if (!productsContainer || trimmed.length < 3) return;

  suggestionPreviewToken += 1;
  const token = suggestionPreviewToken;
  const cacheKey = trimmed.toLowerCase();

  let products = suggestionPreviewCache.get(cacheKey);
  if (!products) {
    const searchData = await fetchUnbxdSearch(trimmed);
    if (!searchData) return;
    products = extractSearchProducts(searchData);
    suggestionPreviewCache.set(cacheKey, products);
  }

  if (token !== suggestionPreviewToken) return;
  renderSearchProducts(productsContainer, products, false);
  const seeAll = dialog.querySelector('.sd-see-all');
  if (seeAll) seeAll.href = getSearchResultUrl(trimmed);
}

function restoreInputResults(dialog) {
  const input = dialog.querySelector('.sd-search-input');
  const seeAll = dialog.querySelector('.sd-see-all');
  const query = (input?.value || '').trim();
  if (seeAll) {
    seeAll.href = query ? getSearchResultUrl(query) : getApApi().SEARCH_RESULTS;
  }
  if (query.length >= 3) {
    handleSearchDialogSearchResults(dialog, query); // eslint-disable-line no-use-before-define
  }
}

function renderSuggestions(dialog, suggestions = [], queryMode = false, activeQuery = '') {
  const list = dialog.querySelector('.sd-suggestions-list');
  if (!list) return;

  list.innerHTML = '';
  list.onmouseleave = null;
  list.onfocusout = null;

  if (!queryMode) {
    SEARCH_SUGGESTIONS_LINKS.forEach((link) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.text;
      li.appendChild(a);
      list.appendChild(li);
    });
    return;
  }

  if (!suggestions.length) return;

  list.onmouseleave = () => {
    suggestionPreviewToken += 1;
    restoreInputResults(dialog);
  };
  list.onfocusout = (event) => {
    if (!list.contains(event.relatedTarget)) {
      suggestionPreviewToken += 1;
      restoreInputResults(dialog);
    }
  };

  const grouped = new Map(SUGGESTION_CATEGORY_ORDER.map((category) => [category, []]));
  suggestions.forEach((entry) => {
    if (!entry?.category) return;
    if (!grouped.has(entry.category)) return;
    grouped.get(entry.category).push(entry);
  });

  const categoriesWithEntries = [...grouped.entries()].filter(([, entries]) => entries.length > 0);
  categoriesWithEntries.forEach(([category, entries], index) => {
    const isLastCategory = index === categoriesWithEntries.length - 1;
    const headerLi = document.createElement('li');
    headerLi.className = `sd-suggestion-category${isLastCategory ? ' sd-suggestion-category-last' : ''}`;
    headerLi.textContent = category;
    list.appendChild(headerLi);

    entries.forEach((entry) => {
      const suggestedQuery = entry.text;
      const li = document.createElement('li');
      li.className = 'sd-suggestion-item';
      const a = document.createElement('a');
      a.href = getSearchResultUrl(suggestedQuery);
      a.innerHTML = highlightSuggestionMatch(suggestedQuery, activeQuery);
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const input = dialog.querySelector('.sd-search-input');
        if (input) {
          input.value = suggestedQuery;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      a.addEventListener('mouseenter', () => {
        previewSuggestionResults(dialog, suggestedQuery);
      });
      a.addEventListener('focus', () => {
        previewSuggestionResults(dialog, suggestedQuery);
      });
      li.appendChild(a);
      list.appendChild(li);
    });
  });
}

function toggleSearchDialogQueryMode(dialog, active) {
  dialog.classList.toggle('sd-query-mode', active);
}

async function handleSearchDialogQuery(dialog, query) {
  const trimmed = (query || '').trim();
  if (!trimmed) {
    toggleSearchDialogQueryMode(dialog, false);
    const initial = await fetchUnbxdAutosuggest('*', {
      inFieldsCount: 0,
      topQueriesCount: 8,
      popularProductsCount: 6,
      includeSourceFields: true,
    });
    if (initial) renderSearchDialogResults(dialog, initial, { preferInField: false, queryMode: false, queryText: '' });
    else {
      renderTrendingQueries(dialog, FALLBACK_TRENDING_QUERIES);
      renderSuggestions(dialog, [], false, '');
    }
    return;
  }

  toggleSearchDialogQueryMode(dialog, true);

  if (trimmed.length < 3) {
    renderSuggestions(dialog, [], true, trimmed);
    return;
  }

  const autoData = await fetchUnbxdAutosuggest(trimmed, {
    inFieldsCount: 10,
    topQueriesCount: 0,
    popularProductsCount: 6,
    includeSourceFields: true,
  });

  if (autoData) {
    renderSearchDialogResults(dialog, autoData, {
      preferInField: true, queryMode: true, queryText: trimmed,
    });
  }
}

async function handleSearchDialogSearchResults(dialog, query) {
  const productsContainer = dialog.querySelector('.sd-best-results-grid');
  if (!productsContainer || !query || query.length < 3) return;

  const searchData = await fetchUnbxdSearch(query);
  if (!searchData) return;

  const searchProducts = extractSearchProducts(searchData);
  renderSearchProducts(productsContainer, searchProducts, false);
}

function buildSearchDialog() {
  const overlay = document.createElement('div');
  overlay.className = 'search-dialog-overlay';

  const dialog = document.createElement('div');
  dialog.className = 'search-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-label', 'Search');

  // Top: search bar row
  const topBar = document.createElement('div');
  topBar.className = 'sd-search-bar';

  const searchIcon = document.createElement('span');
  searchIcon.className = 'sd-search-icon';
  /* eslint-disable max-len */
  searchIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
  /* eslint-enable max-len */

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'sd-search-input';
  input.placeholder = 'Search';
  input.setAttribute('autocomplete', 'off');

  const cameraIcon = document.createElement('button');
  cameraIcon.className = 'sd-camera-btn';
  cameraIcon.type = 'button';
  cameraIcon.setAttribute('aria-label', 'Search by image');

  const closeBtn = document.createElement('button');
  closeBtn.className = 'sd-close-btn';
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close search');
  closeBtn.innerHTML = '&times;';

  topBar.append(searchIcon, input, cameraIcon, closeBtn);

  // Content area: two columns
  const content = document.createElement('div');
  content.className = 'sd-content';

  // Left column
  const leftCol = document.createElement('div');
  leftCol.className = 'sd-left';

  // Trending queries
  const trendingSection = document.createElement('div');
  trendingSection.className = 'sd-section';
  trendingSection.classList.add('sd-trending-section');
  const trendingTitle = document.createElement('h3');
  trendingTitle.className = 'sd-section-title';
  trendingTitle.textContent = 'Trending Queries';
  const trendingList = document.createElement('div');
  trendingList.className = 'sd-trending-list';
  trendingSection.append(trendingTitle, trendingList);

  // Suggestions
  const sugSection = document.createElement('div');
  sugSection.className = 'sd-section';
  sugSection.classList.add('sd-suggestions-section');
  const sugTitle = document.createElement('h3');
  sugTitle.className = 'sd-section-title';
  sugTitle.textContent = 'Suggestions';
  const sugList = document.createElement('ul');
  sugList.className = 'sd-suggestions-list';
  renderSuggestions(dialog, [], false);
  sugSection.append(sugTitle, sugList);

  // Quick links
  const qlSection = document.createElement('div');
  qlSection.className = 'sd-section';
  qlSection.classList.add('sd-quicklinks-section');
  const qlTitle = document.createElement('h3');
  qlTitle.className = 'sd-section-title';
  qlTitle.textContent = 'Quick links';
  const qlGrid = document.createElement('div');
  qlGrid.className = 'sd-quicklinks-grid';
  SEARCH_QUICK_LINKS.forEach((link) => {
    const card = document.createElement('a');
    card.className = 'sd-quicklink-card';
    card.href = link.href;
    const iconSpan = document.createElement('span');
    iconSpan.className = `icon icon-${link.icon}`;
    iconSpan.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    label.className = 'sd-quicklink-label';
    label.textContent = link.text;
    card.append(iconSpan, label);
    qlGrid.appendChild(card);
  });
  decorateIcons(qlGrid);
  qlSection.append(qlTitle, qlGrid);

  leftCol.append(trendingSection, sugSection, qlSection);

  // Right column: Best Results
  const rightCol = document.createElement('div');
  rightCol.className = 'sd-right';

  const brTitle = document.createElement('h3');
  brTitle.className = 'sd-section-title';
  brTitle.textContent = 'Best Results';

  const brGrid = document.createElement('div');
  brGrid.className = 'sd-best-results-grid';

  const seeAll = document.createElement('a');
  seeAll.className = 'sd-see-all';
  seeAll.href = getApApi().SEARCH_RESULTS;
  seeAll.textContent = 'See all results';
  const seeAllArrow = document.createElement('span');
  seeAllArrow.textContent = ' \u203A';
  seeAll.appendChild(seeAllArrow);

  rightCol.append(brTitle, brGrid, seeAll);

  const locationResults = document.createElement('section');
  locationResults.className = 'sd-location-results';
  const locationTitle = document.createElement('h3');
  locationTitle.className = 'sd-section-title sd-location-title';
  const locationList = document.createElement('div');
  locationList.className = 'sd-location-list';
  const locationEmpty = document.createElement('p');
  locationEmpty.className = 'sd-location-empty';
  const locationExplore = document.createElement('a');
  locationExplore.className = 'sd-location-explore';
  locationExplore.textContent = 'Explore more';
  locationExplore.style.display = 'none';
  locationResults.append(locationTitle, locationList, locationEmpty, locationExplore);

  content.append(leftCol, rightCol);
  dialog.append(topBar, content, locationResults);
  overlay.appendChild(dialog);

  let locationRequestToken = 0;

  // Interactions
  const closeDialog = () => {
    locationRequestToken += 1;
    overlay.classList.remove('active');
    document.body.classList.remove('search-dialog-open');
    input.value = '';
    toggleSearchDialogQueryMode(dialog, false);
  };

  closeBtn.addEventListener('click', closeDialog);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeDialog();
  });

  // Search input: debounced query
  let dialogDebounce = null;
  let searchDebounce = null;
  let locationDebounce = null;
  input.addEventListener('input', () => {
    clearTimeout(dialogDebounce);
    clearTimeout(searchDebounce);
    clearTimeout(locationDebounce);
    locationRequestToken += 1;
    const currentLocationToken = locationRequestToken;
    const rawQuery = input.value;
    const query = rawQuery.trim();
    dialogDebounce = setTimeout(() => {
      handleSearchDialogQuery(dialog, rawQuery);
      seeAll.href = query
        ? getSearchResultUrl(query)
        : getApApi().SEARCH_RESULTS;
    }, SEARCH_DEBOUNCE_MS);
    searchDebounce = setTimeout(() => {
      handleSearchDialogSearchResults(dialog, rawQuery);
    }, SEARCH_RESULTS_DEBOUNCE_MS);
    locationDebounce = setTimeout(() => {
      handleLocationAwareSearch(dialog, rawQuery, currentLocationToken, () => locationRequestToken);
    }, LOCATION_DETECTION_DEBOUNCE_MS);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = input.value;
      closeDialog();
      navigateToSearchResults(query);
    }
    if (e.key === 'Escape') closeDialog();
  });

  return overlay;
}

async function openSearchDialog(block) {
  const overlay = block.querySelector('.search-dialog-overlay');
  if (!overlay) return;

  overlay.classList.add('active');
  document.body.classList.add('search-dialog-open');

  const input = overlay.querySelector('.sd-search-input');
  if (input) {
    setTimeout(() => input.focus(), 100);
  }
  const dialog = overlay.querySelector('.search-dialog');
  if (!dialog) return;
  setLocationResultState(dialog, { visible: false });

  // Load initial data (trending + popular products)
  const data = await fetchUnbxdAutosuggest('*', {
    inFieldsCount: 0,
    topQueriesCount: 8,
    popularProductsCount: 6,
    includeSourceFields: true,
  });
  if (data) {
    renderSearchDialogResults(dialog, data, { queryMode: false, queryText: '' });
  }
}

// ──────────────────────────────────────────────
//  Build Functions
// ──────────────────────────────────────────────

function getAuthBase() {
  const api = getApApi();
  return `${api.KEYCLOAK_URL}/realms/${api.KEYCLOAK_REALM}/protocol/openid-connect/auth`;
}
function getAuthLogoutBase() {
  const api = getApApi();
  return `${api.KEYCLOAK_URL}/realms/${api.KEYCLOAK_REALM}/protocol/openid-connect/logout`;
}

function parseJwtPayload(token) {
  try {
    const parts = String(token).split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    const payload = JSON.parse(json);
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

function getUserFromAuthCookie() {
  try {
    const cookies = document.cookie.split(';');
    const match = cookies.find((cookie) => {
      const eq = cookie.trim().indexOf('=');
      if (eq <= 0) return false;
      const value = cookie.trim().slice(eq + 1).trim();
      if (!value) return false;
      const decoded = parseJwtPayload(value);
      if (!decoded) return false;
      const nameVal = decoded.name
        || decoded.given_name || decoded.preferred_username;
      const isAp = decoded.iss?.includes('auth.asianpaints.com')
        || decoded.iss?.includes('betaauth.asianpaints.com');
      return nameVal && isAp;
    });
    if (match) {
      const value = match.trim().slice(match.trim().indexOf('=') + 1).trim();
      const decoded = parseJwtPayload(value);
      const nameVal = decoded.name
        || decoded.given_name || decoded.preferred_username;
      return { name: nameVal, email: decoded.email, id_token: value };
    }
  } catch (e) {
    /* ignore */
  }
  return null;
}

function getUserFromUrlHash() {
  try {
    const { hash } = window.location;
    if (!hash) return null;
    const params = new URLSearchParams(hash.slice(1));
    // Mock auth: ?mock_login=1&mock_name=XXX (for localhost testing)
    const mockName = params.get('mock_name');
    if (params.get('mock_login') === '1' && mockName) {
      return { name: mockName, email: params.get('mock_email') || '' };
    }
    const idToken = params.get('id_token');
    if (idToken) {
      const payload = parseJwtPayload(idToken);
      if (payload) {
        const nameVal = payload.name || payload.given_name || payload.preferred_username;
        if (nameVal) {
          const authUser = { name: nameVal, email: payload.email, id_token: idToken };
          const hashRefresh = params.get('refresh_token');
          if (hashRefresh) authUser.refresh_token = hashRefresh;
          return authUser;
        }
      }
    }
  } catch (e) {
    /* ignore */
  }
  return null;
}

function getUser() {
  if (keycloakInstance?.authenticated && keycloakInstance?.tokenParsed) {
    const p = keycloakInstance.tokenParsed;
    const name = p.given_name || p.name || p.preferred_username || '';
    return { name, email: p.email || '', id_token: keycloakInstance.token };
  }
  if (!canUsePersistedAuth()) return null;
  try {
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      const p = JSON.parse(userProfile);
      const name = p.given_name || p.name || p.preferred_username || '';
      const idToken = localStorage.getItem('keycloak-token');
      return name && idToken ? { name, email: p.email || '', id_token: idToken } : null;
    }
  } catch (e) { /* ignore */ }
  return null;
}

function setUser(user) {
  try {
    localStorage.removeItem(SIGNED_OUT_KEY);
    if (user?.id_token) {
      localStorage.setItem('keycloak-token', user.id_token);
      const payload = parseJwtPayload(user.id_token);
      if (payload) localStorage.setItem('userProfile', JSON.stringify(payload));
    }
    if (user?.refresh_token) {
      localStorage.setItem('keycloak-refresh-token', user.refresh_token);
    }
  } catch (e) { /* ignore */ }
}

function clearUser() {
  try {
    localStorage.setItem(SIGNED_OUT_KEY, '1');
    clearKeycloakTokens();
  } catch (e) { /* ignore */ }
}

function uuid() {
  /* eslint-disable no-bitwise */
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  /* eslint-enable no-bitwise */
}

async function sha256Base64Url(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const base64 = btoa(String.fromCharCode(...new Uint8Array(hash)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function buildProfileAuthUrl(redirectUri) {
  const state = uuid();
  const nonce = uuid();
  const codeVerifier = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const codeChallenge = await sha256Base64Url(codeVerifier);

  try {
    sessionStorage.setItem('ap_code_verifier', codeVerifier);
    sessionStorage.setItem('ap_auth_state', state);
  } catch (e) {
    /* sessionStorage may be unavailable */
  }

  const params = new URLSearchParams({
    client_id: 'asianpaints',
    redirect_uri: redirectUri,
    state,
    response_mode: 'fragment',
    response_type: 'code id_token',
    scope: 'openid profile offline_access',
    nonce,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });
  return `${getAuthBase()}?${params.toString()}`;
}

function buildBrandBar(brandDiv) {
  const brandBar = document.createElement('div');
  brandBar.className = 'header-brands';

  const inner = document.createElement('div');
  inner.className = 'header-brands-inner';

  const logos = brandDiv.querySelectorAll('p');
  logos.forEach((p, idx) => {
    const anchor = p.querySelector('a');
    const img = p.querySelector('img');
    if (!anchor && !img) return;

    const brandItem = document.createElement('a');
    brandItem.className = 'brand-item';
    if (idx === 0) brandItem.classList.add('active');
    brandItem.href = anchor ? anchor.getAttribute('href') : '#';

    if (img) {
      const clonedImg = img.cloneNode(true);
      brandItem.appendChild(clonedImg);
    }

    inner.appendChild(brandItem);
  });

  brandBar.appendChild(inner);
  return brandBar;
}

function buildMainHeader(mainDiv) {
  const mainHeader = document.createElement('div');
  mainHeader.className = 'header-main';

  const inner = document.createElement('div');
  inner.className = 'header-main-inner';

  // Hamburger (mobile)
  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.type = 'button';
  hamburger.setAttribute('aria-controls', 'nav');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span class="hamburger-icon"></span><span class="hamburger-cross"></span>';
  inner.appendChild(hamburger);

  // Logo
  const paragraphs = mainDiv.querySelectorAll('p');
  if (paragraphs[0]) {
    const logoAnchor = paragraphs[0].querySelector('a');
    if (logoAnchor) {
      const logoLink = document.createElement('a');
      logoLink.className = 'header-logo';
      logoLink.href = logoAnchor.getAttribute('href');
      const logoImg = logoAnchor.querySelector('img');
      if (logoImg) logoLink.appendChild(logoImg.cloneNode(true));
      inner.appendChild(logoLink);
    }
  }

  // Search bar with suggestions dropdown
  const searchBar = document.createElement('div');
  searchBar.className = 'header-search';

  const searchIconSpan = document.createElement('span');
  searchIconSpan.className = 'search-icon';
  if (paragraphs[1]) {
    const imgs = paragraphs[1].querySelectorAll('img');
    if (imgs[0]) {
      searchIconSpan.appendChild(imgs[0].cloneNode(true));
    }
  }

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.className = 'search-input';
  searchInput.setAttribute('aria-label', 'Search');
  searchInput.setAttribute('name', 'global-search');
  searchInput.setAttribute('autocomplete', 'off');

  // Rotating placeholder (matching original site's data-search-values)
  const placeholders = [
    'Search for Wall colours',
    'Search for Interior paints',
    'Search for Colour inspiration',
    'Search for Budget calculator',
  ];
  let placeholderIdx = 0;
  [searchInput.placeholder] = placeholders;
  setInterval(() => {
    placeholderIdx = (placeholderIdx + 1) % placeholders.length;
    searchInput.placeholder = placeholders[placeholderIdx];
  }, 3000);

  const cameraBtn = document.createElement('button');
  cameraBtn.className = 'camera-btn';
  cameraBtn.type = 'button';
  cameraBtn.setAttribute('aria-label', 'Search by image');
  if (paragraphs[1]) {
    const imgs = paragraphs[1].querySelectorAll('img');
    if (imgs[1]) {
      cameraBtn.appendChild(imgs[1].cloneNode(true));
    }
  }

  searchBar.appendChild(searchIconSpan);
  searchBar.appendChild(searchInput);
  searchBar.appendChild(cameraBtn);
  inner.appendChild(searchBar);

  // Mobile search icon — created here, appended into actions container below
  const mobileSearchBtn = document.createElement('button');
  mobileSearchBtn.className = 'mobile-search-btn';
  mobileSearchBtn.type = 'button';
  mobileSearchBtn.setAttribute('aria-label', 'Search');
  if (paragraphs[1]) {
    const imgs = paragraphs[1].querySelectorAll('img');
    if (imgs[0]) {
      mobileSearchBtn.appendChild(imgs[0].cloneNode(true));
    }
  }

  // Action icons — from p.header-actions or <ul> in mainDiv
  const actionsContainer = document.createElement('div');
  actionsContainer.className = 'header-actions';

  // Insert mobile search icon as first item in actions (visible only on mobile)
  actionsContainer.appendChild(mobileSearchBtn);
  const actionsP = mainDiv.querySelector('p.header-actions');

  // Action icons

  const actionsUl = mainDiv.querySelector('ul');
  let actionAnchors = [];
  if (actionsP) {
    actionAnchors = [...actionsP.querySelectorAll('a')];
  } else if (actionsUl) {
    actionAnchors = actionsUl.querySelectorAll(':scope > li a');
  }

  if (actionAnchors.length) {
    actionAnchors.forEach((anchor) => {
      const actionLink = document.createElement('a');
      actionLink.className = 'action-btn';
      actionLink.href = anchor.getAttribute('href');

      const img = anchor.querySelector('img');
      if (img) {
        actionLink.appendChild(img.cloneNode(true));
        const label = img.alt || anchor.getAttribute('aria-label') || '';
        actionLink.setAttribute('aria-label', label);
        actionLink.title = label;
      }

      const altText = (img?.alt || '').toLowerCase();

      // Profile button — save original (logged-in) icon src,
      // start with clean local icon (no green dot) for logged-out state.
      if (altText.includes('profile') || altText.includes('user') || altText.includes('login')) {
        actionLink.classList.add('profile-btn');
        const existingImg = actionLink.querySelector('img');
        if (existingImg) {
          existingImg.dataset.loggedInSrc = existingImg.src;
          existingImg.src = '/icons/profile-icon.svg';
        }
        const greeting = document.createElement('span');
        greeting.className = 'profile-greeting';
        actionLink.appendChild(greeting);
      }

      // Cart badge
      if (altText.includes('cart')) {
        actionLink.classList.add('cart-btn');
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.textContent = '0';
        actionLink.appendChild(badge);
      }

      // Profile button — dropdown when logged in, auth redirect when not
      const href = anchor.getAttribute('href') || '';
      const isProfile = (img && img.alt && img.alt.toLowerCase().includes('profile'))
        || href.includes('profile') || href.includes('my-profile');

      if (isProfile) {
        actionLink.classList.add('profile-auth-link');
        actionLink.href = '#'; // Prevent default nav; click handler shows dropdown or redirects to auth
        const profileImg = actionLink.querySelector('img');
        if (profileImg) {
          profileImg.dataset.loggedOutSrc = HEADER_ICON_PATHS.PROFILE_LOGGED_OUT;
          profileImg.dataset.loggedInSrc = HEADER_ICON_PATHS.PROFILE_LOGGED_IN;
          profileImg.src = HEADER_ICON_PATHS.PROFILE_LOGGED_OUT;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'profile-dropdown-wrapper';
        wrapper.appendChild(actionLink);

        const profileIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M6 21V19a4 4 0 014-4h4a4 4 0 014 4v2"/></svg>';
        const wishlistIconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>';

        const dropdown = document.createElement('div');
        dropdown.className = 'profile-dropdown';
        dropdown.setAttribute('aria-hidden', 'true');
        dropdown.innerHTML = `
          <p class="profile-dropdown-greeting"></p>
          <a href="https://www.asianpaints.com/my-profile.html" class="profile-dropdown-item">
            <span class="profile-dropdown-icon">${profileIconSvg}</span>
            My Profile
          </a>
          <a href="https://www.asianpaints.com/my-wishlist.html" class="profile-dropdown-item">
            <span class="profile-dropdown-icon">${wishlistIconSvg}</span>
            Wishlist
          </a>
          <button type="button" class="profile-dropdown-signout">Sign out</button>
        `;
        wrapper.appendChild(dropdown);
        actionsContainer.appendChild(wrapper);
      } else {
        actionsContainer.appendChild(actionLink);
      }
    });
    inner.appendChild(actionsContainer);
  }

  // CTA button
  const lastP = paragraphs[paragraphs.length - 1];
  if (lastP) {
    const ctaAnchor = lastP.querySelector('a');
    if (ctaAnchor && !ctaAnchor.querySelector('img')) {
      const ctaContainer = document.createElement('div');
      ctaContainer.className = 'header-cta';

      const ctaLink = document.createElement('a');
      ctaLink.className = 'cta-btn';
      const ctaHref = ctaAnchor.getAttribute('href');
      ctaLink.href = resolveCtaHref(ctaHref);
      ctaLink.textContent = ctaAnchor.textContent.trim();
      const modalPath = getModalPathFromHref(ctaHref);
      if (modalPath) {
        ctaLink.dataset.modalPath = modalPath;
        ctaLink.setAttribute('aria-haspopup', 'dialog');
      }

      ctaContainer.appendChild(ctaLink);
      inner.appendChild(ctaContainer);
    }
  }

  mainHeader.appendChild(inner);
  return mainHeader;
}

function buildMobileSearchPanel(mainDiv) {
  const panel = document.createElement('div');
  panel.className = 'mobile-search-panel';

  const paragraphs = mainDiv.querySelectorAll('p');

  const searchIcon = document.createElement('span');
  searchIcon.className = 'search-icon';
  if (paragraphs[1]) {
    const imgs = paragraphs[1].querySelectorAll('img');
    if (imgs[0]) searchIcon.appendChild(imgs[0].cloneNode(true));
  }

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'search-input';
  input.placeholder = 'Search';
  input.setAttribute('aria-label', 'Search');
  input.setAttribute('autocomplete', 'off');

  const cameraBtn = document.createElement('button');
  cameraBtn.className = 'camera-btn';
  cameraBtn.type = 'button';
  cameraBtn.setAttribute('aria-label', 'Search by image');

  const closeBtn = document.createElement('button');
  closeBtn.className = 'mobile-search-close';
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close search');
  closeBtn.innerHTML = '&times;';

  panel.append(searchIcon, input, cameraBtn, closeBtn);
  return panel;
}

function buildCartModal() {
  const overlay = document.createElement('div');
  overlay.className = 'cart-modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'cart-modal';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'cart-modal-close';
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close cart');
  closeBtn.innerHTML = '&times;';

  const iconWrap = document.createElement('div');
  iconWrap.className = 'cart-modal-icon';

  const cartTitle = document.createElement('p');
  cartTitle.className = 'cart-modal-title';
  cartTitle.textContent = 'Your cart is empty';

  const shopBtn = document.createElement('a');
  shopBtn.className = 'cart-modal-shop';
  shopBtn.href = getApApi().SHOP_URL;
  shopBtn.textContent = 'Shop now';

  // Cart items list (populated when items exist)
  const cartItems = document.createElement('div');
  cartItems.className = 'cart-items-list';

  modal.append(closeBtn, iconWrap, cartTitle, cartItems, shopBtn);
  overlay.appendChild(modal);

  const close = () => overlay.classList.remove('active');
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  return overlay;
}

function buildMegamenuPanel(submenuUl) {
  const dropdown = document.createElement('div');
  dropdown.className = 'nav-dropdown';

  const dropdownInner = document.createElement('div');
  dropdownInner.className = 'dropdown-inner';

  submenuUl.querySelectorAll(':scope > li').forEach((colLi) => {
    const column = document.createElement('div');
    column.className = 'dropdown-column';

    const headingLink = colLi.querySelector(':scope > a, :scope > p > a');
    if (headingLink) {
      const heading = document.createElement('h4');
      heading.className = 'dropdown-title';
      heading.textContent = headingLink.textContent.trim();
      column.appendChild(heading);
    }

    const itemsUl = colLi.querySelector(':scope > ul');
    if (itemsUl) {
      const linkList = document.createElement('ul');
      linkList.className = 'dropdown-links';

      itemsUl.querySelectorAll(':scope > li').forEach((itemLi) => {
        const li = document.createElement('li');
        const a = itemLi.querySelector('a');
        if (a) {
          const link = document.createElement('a');
          link.href = a.getAttribute('href');
          link.textContent = a.textContent.trim();

          const text = a.textContent.trim();
          if (text === 'Textures For You' || text === 'Shade Cards') {
            const badge = document.createElement('span');
            badge.className = 'new-badge';
            badge.textContent = 'New';
            link.appendChild(badge);
          }

          li.appendChild(link);
        }
        linkList.appendChild(li);
      });

      column.appendChild(linkList);
    }

    dropdownInner.appendChild(column);
  });

  dropdown.appendChild(dropdownInner);
  return dropdown;
}

function buildNavBar(navDiv, secondaryDiv) {
  const navBar = document.createElement('div');
  navBar.className = 'header-nav-bar';
  navBar.id = 'nav';

  const inner = document.createElement('div');
  inner.className = 'header-nav-inner';

  const navLeft = document.createElement('div');
  navLeft.className = 'nav-left';

  const mainUl = navDiv.querySelector('ul');
  if (mainUl) {
    const nav = document.createElement('nav');
    nav.className = 'main-nav';
    nav.setAttribute('aria-label', 'Main navigation');

    const navList = document.createElement('ul');
    navList.className = 'nav-list';

    mainUl.querySelectorAll(':scope > li').forEach((li) => {
      const navItem = document.createElement('li');
      navItem.className = 'nav-item';

      const anchor = li.querySelector(':scope > a, :scope > p > a');
      if (!anchor) return;

      const link = document.createElement('a');
      link.className = 'nav-link';
      link.href = anchor.getAttribute('href');
      link.textContent = anchor.textContent.trim();

      if (link.textContent === 'Home') {
        navItem.classList.add('nav-home');
        link.setAttribute('aria-label', 'Home');
        link.textContent = '';
      }

      const submenuUl = li.querySelector(':scope > ul');
      if (submenuUl) {
        navItem.classList.add('has-dropdown');
        const chevron = document.createElement('span');
        chevron.className = 'nav-chevron';
        link.appendChild(chevron);
      }

      navItem.appendChild(link);

      if (submenuUl) {
        navItem.appendChild(buildMegamenuPanel(submenuUl));
      }

      navList.appendChild(navItem);
    });

    nav.appendChild(navList);
    navLeft.appendChild(nav);
  }

  inner.appendChild(navLeft);

  if (secondaryDiv) {
    const secUl = secondaryDiv.querySelector('ul');
    if (secUl) {
      const navRight = document.createElement('div');
      navRight.className = 'nav-right';

      const secNav = document.createElement('nav');
      secNav.className = 'secondary-nav';
      secNav.setAttribute('aria-label', 'Secondary navigation');

      const secList = document.createElement('ul');
      secList.className = 'secondary-nav-list';

      secUl.querySelectorAll(':scope > li').forEach((li) => {
        const secItem = document.createElement('li');
        const a = li.querySelector('a');
        if (a) {
          const link = document.createElement('a');
          link.href = a.getAttribute('href');
          link.textContent = a.textContent.trim();
          secItem.appendChild(link);
        }
        secList.appendChild(secItem);
      });

      secNav.appendChild(secList);
      navRight.appendChild(secNav);
      inner.appendChild(navRight);
    }
  }

  navBar.appendChild(inner);
  return navBar;
}

/* Visual search assets must come from AP origin outside first-party domains. */
/* eslint-disable max-len */
function getDragDropGifUrl() {
  return `${getApOrigin()}/content/dam/apcolourcatalogue/asset/ap-revamp/visual-search/drag-drop-gif-desktop.gif`;
}
const BROWSE_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
/* eslint-enable max-len */

function buildVisualSearchModal() {
  const overlay = document.createElement('div');
  overlay.className = 'vs-modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'vs-modal';

  const header = document.createElement('div');
  header.className = 'vs-modal-header';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'vs-modal-close';
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML = '&times;';
  header.appendChild(closeBtn);

  const dropZone = document.createElement('div');
  dropZone.className = 'vs-dropzone';

  const title = document.createElement('p');
  title.className = 'vs-title';
  title.textContent = 'Get recommendations for Colour inspiration, Textures, Wallpapers, Interior Design ideas, etc...';

  const uploadIcon = document.createElement('div');
  uploadIcon.className = 'vs-upload-icon';
  uploadIcon.style.setProperty('--drag-image-url', `url('${getDragDropGifUrl()}')`);

  const dragText = document.createElement('p');
  dragText.className = 'vs-drag-text';
  dragText.textContent = 'Drag & drop your image here';

  const orText = document.createElement('p');
  orText.className = 'vs-or';
  orText.textContent = 'or';

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/jpeg,image/png,image/tiff';
  fileInput.className = 'vs-file-input';
  fileInput.setAttribute('aria-label', 'Browse an image');

  const browseBtn = document.createElement('button');
  browseBtn.className = 'vs-browse-btn';
  browseBtn.type = 'button';
  const browseLabel = document.createElement('span');
  browseLabel.className = 'vs-browse-label';
  browseLabel.textContent = 'Browse an image';
  browseBtn.appendChild(browseLabel);
  const browseIcon = document.createElement('span');
  browseIcon.className = 'vs-browse-icon';
  browseIcon.innerHTML = BROWSE_ICON_SVG;
  browseBtn.appendChild(browseIcon);

  const hint = document.createElement('p');
  hint.className = 'vs-hint';
  hint.textContent = 'JPG or PNG. 5MB Maximum';

  const statusMsg = document.createElement('p');
  statusMsg.className = 'vs-status';
  statusMsg.style.display = 'none';

  const errorMsg = document.createElement('p');
  errorMsg.className = 'vs-error';
  errorMsg.style.display = 'none';

  dropZone.append(title, uploadIcon, dragText, orText, browseBtn, hint, statusMsg, errorMsg);
  modal.append(header, dropZone);
  overlay.appendChild(modal);

  const resetState = () => {
    statusMsg.style.display = 'none';
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';
    statusMsg.textContent = '';
  };

  const close = () => {
    overlay.classList.remove('active');
    resetState();
  };
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  browseBtn.addEventListener('click', () => {
    resetState();
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      uploadVisualSearchImage(fileInput.files[0], modal);
    }
  });

  // Drag & drop with actual file handling
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });
  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    resetState();
    const { files } = e.dataTransfer;
    if (files.length > 1) {
      errorMsg.textContent = 'Please upload only 1 file';
      errorMsg.style.display = 'block';
      return;
    }
    if (files.length === 1) {
      uploadVisualSearchImage(files[0], modal);
    }
  });

  return overlay;
}

// ──────────────────────────────────────────────
//  Cart Modal: Refresh with live data
// ──────────────────────────────────────────────

async function refreshCartModal(block) {
  const modal = block.querySelector('.cart-modal');
  if (!modal) return;

  const titleEl = modal.querySelector('.cart-modal-title');
  const iconEl = modal.querySelector('.cart-modal-icon');
  const itemsList = modal.querySelector('.cart-items-list');
  const shopBtn = modal.querySelector('.cart-modal-shop');
  const setShopState = () => {
    if (titleEl) titleEl.textContent = 'Your cart is empty';
    if (iconEl) iconEl.style.display = '';
    if (itemsList) itemsList.innerHTML = '';
    if (shopBtn) {
      shopBtn.textContent = 'Shop now';
      shopBtn.href = getApApi().SHOP_URL;
    }
  };

  try {
    const resp = await fetchFromAp(`${getApApi().MINI_CART}?_=${Date.now()}`, { credentials: 'include' });
    if (!resp) {
      setShopState();
      return;
    }
    const data = await resp.json();

    if (data.status === 'failure' || !data.entries || data.entries.length === 0) {
      setShopState();
      return;
    }

    if (titleEl) titleEl.textContent = `Your cart (${data.entries.length} items)`;
    if (iconEl) iconEl.style.display = 'none';
    if (itemsList) {
      itemsList.innerHTML = '';
      data.entries.forEach((entry) => {
        const row = document.createElement('div');
        row.className = 'cart-item-row';

        const name = document.createElement('span');
        name.className = 'cart-item-name';
        name.textContent = entry.product?.name || entry.name || 'Product';

        const qty = document.createElement('span');
        qty.className = 'cart-item-qty';
        qty.textContent = `Qty: ${entry.quantity || 1}`;

        row.append(name, qty);
        itemsList.appendChild(row);
      });
    }
    if (shopBtn) {
      const cartPathOrUrl = data.cartUrl || data.redirectUrl || data.cartPageUrl || data.url;
      if (cartPathOrUrl) {
        shopBtn.textContent = 'View cart';
        shopBtn.href = resolveApLink(cartPathOrUrl);
      } else {
        shopBtn.textContent = 'Shop now';
        shopBtn.href = getApApi().SHOP_URL;
      }
    }
  } catch {
    setShopState();
  }
}

// ──────────────────────────────────────────────
//  Interactions
// ──────────────────────────────────────────────

function closeMobilePanel(block) {
  const navInner = block.querySelector('.header-nav-inner');
  block.querySelectorAll('.nav-item.has-dropdown.active').forEach((item) => {
    item.classList.remove('active');
  });
  if (navInner) navInner.classList.remove('has-active-panel');
}

function addInteractions(block) {
  const hamburger = block.querySelector('.nav-hamburger');
  const navBar = block.querySelector('.header-nav-bar');

  // Mobile hamburger toggle
  if (hamburger && navBar) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      hamburger.classList.toggle('is-open', !expanded);
      navBar.classList.toggle('mobile-open', !expanded);
      document.body.classList.toggle('nav-open', !expanded);
      if (expanded) closeMobilePanel(block);
    });
  }

  // Back buttons for mobile dropdown panels
  block.querySelectorAll('.nav-item.has-dropdown').forEach((item) => {
    const dropdown = item.querySelector('.nav-dropdown');
    const link = item.querySelector('.nav-link');
    if (!dropdown || !link) return;

    const backBtn = document.createElement('div');
    backBtn.className = 'dropdown-back';
    const arrow = document.createElement('span');
    arrow.className = 'back-arrow';
    arrow.textContent = '\u2039';
    backBtn.appendChild(arrow);
    backBtn.appendChild(document.createTextNode(` ${link.textContent.trim()}`));
    dropdown.insertBefore(backBtn, dropdown.firstChild);

    backBtn.addEventListener('click', () => {
      closeMobilePanel(block);
    });
  });

  // Desktop megamenu hover
  block.querySelectorAll('.nav-item.has-dropdown').forEach((item) => {
    let hoverTimeout;

    item.addEventListener('mouseenter', () => {
      if (window.innerWidth < DESKTOP_BREAKPOINT) return;
      clearTimeout(hoverTimeout);
      block.querySelectorAll('.nav-item.has-dropdown.active').forEach((other) => {
        if (other !== item) other.classList.remove('active');
      });
      item.classList.add('active');
    });

    item.addEventListener('mouseleave', () => {
      if (window.innerWidth < DESKTOP_BREAKPOINT) return;
      hoverTimeout = setTimeout(() => {
        item.classList.remove('active');
      }, 100);
    });

    const link = item.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth < DESKTOP_BREAKPOINT) {
          e.preventDefault();
          const navInner = block.querySelector('.header-nav-inner');
          block.querySelectorAll('.nav-item.has-dropdown.active').forEach((other) => {
            if (other !== item) other.classList.remove('active');
          });
          item.classList.add('active');
          if (navInner) navInner.classList.add('has-active-panel');
        }
      });
    }
  });

  // Click outside closes megamenu
  document.addEventListener('click', (e) => {
    if (!block.contains(e.target)) {
      block.querySelectorAll('.nav-item.has-dropdown.active').forEach((item) => {
        item.classList.remove('active');
      });
    }
  });

  // Cart modal + live cart data fetch
  const cartBtn = block.querySelector('.cart-btn');
  const cartModal = block.querySelector('.cart-modal-overlay');
  if (cartBtn && cartModal) {
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      refreshCartModal(block);
      cartModal.classList.add('active');
    });
  }

  // Profile — dropdown when logged in, auth redirect when not
  const profileWrapper = block.querySelector('.profile-dropdown-wrapper');
  if (profileWrapper) {
    const profileLink = profileWrapper.querySelector('.profile-auth-link');
    const dropdown = profileWrapper.querySelector('.profile-dropdown');
    const greeting = dropdown?.querySelector('.profile-dropdown-greeting');
    const signOutBtn = dropdown?.querySelector('.profile-dropdown-signout');

    const updateDropdown = () => {
      const user = getUser();
      if (user && greeting) {
        greeting.textContent = `Hello ${user.name.toUpperCase()}`;
        greeting.style.display = '';
      }
    };

    const updateProfileButton = () => {
      const user = getUser();
      profileWrapper?.classList.toggle('is-logged-in', !!user);
    };

    const closeDropdown = () => {
      dropdown?.classList.remove('active');
      dropdown?.setAttribute('aria-hidden', 'true');
    };

    const openDropdown = () => {
      block.querySelectorAll('.profile-dropdown').forEach((d) => d.classList.remove('active'));
      dropdown?.classList.add('active');
      dropdown?.setAttribute('aria-hidden', 'false');
      updateDropdown();
    };

    profileLink?.addEventListener('click', async (e) => {
      e.preventDefault();
      const user = getUser();
      if (user) {
        openDropdown();
      } else {
        // Production: redirect to OIDC auth URL (auth.asianpaints.com)
        try {
          sessionStorage.setItem(AUTH_REDIRECTED_KEY, '1');
        } catch (err) { /* ignore */ }
        const url = await buildProfileAuthUrl(AUTH_REDIRECT_URI);
        window.location.href = url;
      }
    });

    signOutBtn?.addEventListener('click', () => {
      const user = getUser();
      const idToken = user?.id_token || (typeof localStorage !== 'undefined' ? localStorage.getItem('keycloak-token') : null);
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      clearUser();
      try {
        sessionStorage.removeItem(AUTH_REDIRECTED_KEY);
      } catch (err) { /* ignore */ }
      closeDropdown();
      updateProfileButton();
      if (!isLocalhost) {
        const params = new URLSearchParams({
          client_id: 'asianpaints',
          post_logout_redirect_uri: AUTH_REDIRECT_URI,
        });
        if (idToken) {
          params.set('id_token_hint', idToken);
        }
        window.location.href = `${getAuthLogoutBase()}?${params.toString()}`;
      }
    });

    document.addEventListener('click', (e) => {
      if (profileWrapper && !profileWrapper.contains(e.target)) {
        closeDropdown();
      }
    });
  }

  // Visual search modal (from header camera buttons AND search dialog camera button)
  const vsModal = block.querySelector('.vs-modal-overlay');
  if (vsModal) {
    block.querySelectorAll('.camera-btn, .sd-camera-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Close search dialog if open
        const sdOverlay = block.querySelector('.search-dialog-overlay');
        if (sdOverlay?.classList.contains('active')) {
          sdOverlay.classList.remove('active');
          document.body.classList.remove('search-dialog-open');
        }
        vsModal.classList.add('active');
      });
    });
  }

  // Desktop search: clicking search bar opens the search dialog
  const searchBarEl = block.querySelector('.header-search');
  if (searchBarEl) {
    searchBarEl.addEventListener('click', () => {
      openSearchDialog(block);
    });
    searchBarEl.style.cursor = 'pointer';
    const searchInput = searchBarEl.querySelector('.search-input');
    if (searchInput) searchInput.style.cursor = 'pointer';
  }

  // Mobile search: open search dialog instead of inline panel
  const mobileSearchBtn = block.querySelector('.mobile-search-btn');
  if (mobileSearchBtn) {
    mobileSearchBtn.addEventListener('click', () => {
      openSearchDialog(block);
    });
  }

  block.querySelectorAll('.cta-btn[data-modal-path]').forEach((ctaBtn) => {
    ctaBtn.addEventListener('click', async (e) => {
      const { modalPath } = ctaBtn.dataset;
      if (!modalPath || ctaBtn.dataset.loading === 'true') return;

      e.preventDefault();
      ctaBtn.dataset.loading = 'true';

      try {
        const { openModal } = await import('../modal/modal.js');
        await openModal(modalPath);
      } catch {
        window.location.assign(ctaBtn.href);
      } finally {
        delete ctaBtn.dataset.loading;
      }
    });
  });

  // Profile button: when profileWrapper exists, profileLink handler manages click
  // (dropdown when logged in, auth redirect when not). Only use handleProfileClick
  // when there is no dropdown (legacy/fallback).
  const profileBtn = block.querySelector('.action-btn.profile-btn');
  const hasProfileDropdown = !!block.querySelector('.profile-dropdown-wrapper');
  if (profileBtn && !hasProfileDropdown) {
    profileBtn.addEventListener('click', handleProfileClick);
  }

  // Viewport resize handler
  const mql = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
  mql.addEventListener('change', (e) => {
    if (e.matches) {
      if (hamburger) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('is-open');
      }
      if (navBar) navBar.classList.remove('mobile-open');
      document.body.classList.remove('nav-open');
      closeMobilePanel(block);
      const searchPanel = block.querySelector('.mobile-search-panel');
      if (searchPanel) searchPanel.classList.remove('active');
    } else {
      block.querySelectorAll('.nav-item.has-dropdown.active').forEach((li) => li.classList.remove('active'));
    }
  });
}

// ──────────────────────────────────────────────
//  Async Integrations Init (non-blocking)
// ──────────────────────────────────────────────

async function initIntegrations(block) {
  // Prime location context for search/location-aware integrations
  primeLocationContext();

  // Fetch cart count and update badge
  const count = await fetchMiniCartCount();
  updateCartBadge(block, count);

  // Initialize Keycloak authentication (non-blocking)
  initKeycloak(block);
}

// ──────────────────────────────────────────────
//  Main Decorate
// ──────────────────────────────────────────────

export default async function decorate(block) {
  await fetchHeaderConfig();

  const hasSignedOut = typeof localStorage !== 'undefined' && localStorage.getItem(SIGNED_OUT_KEY) === '1';

  // 1. Real login: user returned from auth with token in URL hash
  let authUser = getUserFromUrlHash();
  if (authUser) {
    setUser(authUser);
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  // 2. Real login: JWT from cookie (live asianpaints.com integration)
  if (!getUser() && !hasSignedOut) {
    authUser = getUserFromAuthCookie();
    if (authUser) setUser(authUser);
  }

  // 3. Auth redirect return: clear flags only (no mock user)
  if (!getUser()) {
    try {
      if (sessionStorage.getItem(AUTH_REDIRECTED_KEY) === '1') {
        sessionStorage.removeItem(AUTH_REDIRECTED_KEY);
        localStorage.removeItem(SIGNED_OUT_KEY);
      }
    } catch (err) { /* ignore */ }
  }

  // Standard EDS nav fetch: read path from metadata, fallback to /nav

  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const resp = await fetch(`${navPath}.plain.html`);
  if (!resp.ok) return;

  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const divs = [...doc.body.querySelectorAll(':scope > div')];
  if (divs.length < 4) return;

  const [brandDiv, mainDiv, navDiv, secondaryDiv] = divs;

  block.textContent = '';

  // Row 0: Brand bar
  block.appendChild(buildBrandBar(brandDiv));

  // Sticky wrapper for rows 1 + 2
  const stickyWrapper = document.createElement('div');
  stickyWrapper.className = 'header-sticky';

  // Row 1: Main header
  stickyWrapper.appendChild(buildMainHeader(mainDiv));

  // Row 2: Navigation bar
  stickyWrapper.appendChild(buildNavBar(navDiv, secondaryDiv));

  block.appendChild(stickyWrapper);

  // Mobile search panel
  block.appendChild(buildMobileSearchPanel(mainDiv));

  // Cart modal
  block.appendChild(buildCartModal());

  // Visual search modal
  block.appendChild(buildVisualSearchModal());

  // Search dialog (full-screen overlay)
  block.appendChild(buildSearchDialog());

  // Wire up all UI interactions
  addInteractions(block);

  // Defer integrations (cart, Keycloak) to avoid blocking LCP — run when idle
  const runIntegrations = () => initIntegrations(block);
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(runIntegrations, { timeout: 2000 });
  } else {
    setTimeout(runIntegrations, 0);
  }
}
