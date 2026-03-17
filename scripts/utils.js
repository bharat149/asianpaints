export function isProd() {
  // FIXME: Revisit this once we have a proper way to identify production environment
  return !window.location.hostname.includes('aem.page')
    && !window.location.hostname.includes('aem.live')
    && !window.location.hostname.includes('localhost');
}