/**
 * Fixed Color Partner - BCCI Campaign Sticky Badge
 * Shows a small badge on the left side that expands on click
 * @param {Element} block The fixed color partner block element
 */
export default function decorate(block) {
  const fixedImg = block.querySelector('.fixed-img');
  const autoCloseTime = fixedImg?.getAttribute('data-attr-autoclosetime') || 8;
  const autoCloseMs = parseInt(autoCloseTime, 10) * 1000;

  // Start and stay in collapsed state (small badge)
  block.classList.add('collapsed');

  // Create close button
  const closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML = '×';
  block.appendChild(closeBtn);

  let collapseTimer;

  // Click on collapsed badge to expand
  if (fixedImg) {
    fixedImg.addEventListener('click', (e) => {
      if (block.classList.contains('collapsed')) {
        e.preventDefault();
        block.classList.remove('collapsed');

        // Auto-collapse after specified time
        if (autoCloseMs > 0) {
          collapseTimer = setTimeout(() => {
            block.classList.add('collapsed');
          }, autoCloseMs);
        }
      }
    });
  }

  // Click close button to collapse
  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    block.classList.add('collapsed');
    if (collapseTimer) {
      clearTimeout(collapseTimer);
    }
  });

  // Keyboard accessibility - Escape to close
  block.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !block.classList.contains('collapsed')) {
      block.classList.add('collapsed');
      if (collapseTimer) {
        clearTimeout(collapseTimer);
      }
    }
  });

  // Respect user's motion preferences
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    block.style.transition = 'none';
  }

  // Pause auto-collapse on hover
  block.addEventListener('mouseenter', () => {
    if (collapseTimer) {
      clearTimeout(collapseTimer);
    }
  });

  block.addEventListener('mouseleave', () => {
    if (!block.classList.contains('collapsed')) {
      collapseTimer = setTimeout(() => {
        block.classList.add('collapsed');
      }, 3000);
    }
  });
}
