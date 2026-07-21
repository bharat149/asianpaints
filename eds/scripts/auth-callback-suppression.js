const AUTH_CALLBACK_ANALYTICS_SUPPRESS_KEY = 'ap_auth_callback_suppress_analytics';

function hasAuthCallbackHashParams() {
  try {
    const hash = window.location.hash;
    if (!hash || hash.length <= 1) return false;
    const params = new URLSearchParams(hash.slice(1));
    return ['state', 'session_state', 'iss', 'code', 'id_token']
      .some((key) => params.has(key));
  } catch {
    return false;
  }
}

export function readAuthCallbackSuppressFlag() {
  try {
    return sessionStorage.getItem(AUTH_CALLBACK_ANALYTICS_SUPPRESS_KEY) === '1';
  } catch {
    return false;
  }
}

export function writeAuthCallbackSuppressFlag() {
  try {
    sessionStorage.setItem(AUTH_CALLBACK_ANALYTICS_SUPPRESS_KEY, '1');
  } catch {
    // ignore storage errors
  }
}

export function clearAuthCallbackSuppressFlag() {
  try {
    sessionStorage.removeItem(AUTH_CALLBACK_ANALYTICS_SUPPRESS_KEY);
  } catch {
    // ignore storage errors
  }
}

export function markAuthCallbackSuppressionFromUrlHash() {
  const hasHashCallback = hasAuthCallbackHashParams();
  if (hasHashCallback) writeAuthCallbackSuppressFlag();
  return hasHashCallback;
}