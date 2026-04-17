// add delayed functionality here

/* Auto-prompt "Book Free Site Visit" modal
   Replicates asianpaints.com exit-intent popup behaviour:
   - 15 s dwell timer
   - 75 % scroll depth
   - Mouse exit-intent (desktop)
   Shown once per session. */

const DWELL_MS = 15_000;
const SCROLL_THRESHOLD = 0.75;
const STORAGE_KEY = 'bfsv-modal-shown';
const MODAL_PATH = '/eds/forms/book-free-site-visit';

function wasShown() {
  try { return !!sessionStorage.getItem(STORAGE_KEY); } catch { return false; }
}

function markShown() {
  try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch { /* noop */ }
}

async function showModal() {
  if (wasShown() || document.querySelector('dialog[open]')) return;
  markShown();
  cleanup();
  try {
    // eslint-disable-next-line import/no-cycle
    const { openModal } = await import('../blocks/modal/modal.js');
    await openModal(MODAL_PATH);
  } catch { /* fragment unavailable */ }
}

function onScroll() {
  const scrollPct = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
  if (scrollPct >= SCROLL_THRESHOLD) showModal();
}

function onMouseLeave(e) {
  if (e.clientY <= 0) showModal();
}

let timer;

function cleanup() {
  clearTimeout(timer);
  window.removeEventListener('scroll', onScroll);
  document.removeEventListener('mouseleave', onMouseLeave);
  document.removeEventListener('click', onManualOpen, true);
}

function onManualOpen(e) {
  if (e.target.closest?.('[data-modal-path]')) {
    markShown();
    cleanup();
  }
}

if (!wasShown()) {
  timer = setTimeout(showModal, DWELL_MS);
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('mouseleave', onMouseLeave);
  document.addEventListener('click', onManualOpen, { capture: true });
}
