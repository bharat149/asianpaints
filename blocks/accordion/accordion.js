/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 *
 * Variants:
 * - default: standard expand/collapse with chevron
 * - faq: FAQ-style with plus/minus icons, view-all button, first item open
 */

import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const isFaq = block.classList.contains('faq');
  const rows = [...block.children];

  if (isFaq) {
    const initialVisibleCount = 5;
    const validRows = rows.filter((row) => {
      const label = row.children[0];
      const body = row.children[1];
      return label && body && (label.textContent.trim() || body.textContent.trim());
    });

    validRows.forEach((row, index) => {
      const label = row.children[0];
      const summary = document.createElement('summary');
      summary.className = 'accordion-item-label';
      summary.append(...label.childNodes);

      const body = row.children[1];
      body.className = 'accordion-item-body';

      const details = document.createElement('details');
      [...row.attributes].forEach((attr) => {
        if (attr.name.startsWith('data-')) {
          details.setAttribute(attr.name, attr.value);
        }
      });
      details.className = 'accordion-item';

      if (index === 0) details.open = true;

      details.append(summary, body);

      if (index >= initialVisibleCount) {
        details.style.display = 'none';
        details.classList.add('accordion-faq-hidden');
      }

      row.replaceWith(details);
    });

    if (validRows.length > initialVisibleCount) {
      const viewAllBtn = document.createElement('button');
      viewAllBtn.className = 'accordion-faq-view-all';
      viewAllBtn.textContent = 'View all';
      viewAllBtn.addEventListener('click', () => {
        block.querySelectorAll('.accordion-faq-hidden').forEach((item) => {
          item.style.display = 'block';
          item.classList.remove('accordion-faq-hidden');
        });
        viewAllBtn.style.display = 'none';
      });
      block.appendChild(viewAllBtn);
    }
  } else {
    rows.forEach((row) => {
      const label = row.children[0];
      const summary = document.createElement('summary');
      summary.className = 'accordion-item-label';
      summary.append(...label.childNodes);

      const body = row.children[1];
      body.className = 'accordion-item-body';

      const details = document.createElement('details');
      moveInstrumentation(row, details);
      details.className = 'accordion-item';
      details.append(summary, body);
      row.replaceWith(details);
    });
  }
}
