export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'ql-list';

  const rows = [...block.children];

  rows.forEach((row) => {
    const cells = [...row.children];

    const type = (cells[0]?.textContent || '').trim().toLowerCase();
    const iconCell = cells[1];
    const headingCell = cells[2];
    const primaryTextCell = cells[3];
    const primaryLinkCell = cells[4];
    const secondaryTextCell = cells[5];

    const li = document.createElement('li');
    li.className = `ql-card ql-card--${type || 'default'}`;

    // icon url (supports url text OR authored link/img)
    const iconUrl =
      iconCell?.querySelector('a')?.href ||
      iconCell?.querySelector('img')?.src ||
      (iconCell?.textContent || '').trim();

    const primaryText = (primaryTextCell?.textContent || '').trim();
    const primaryLink =
      primaryLinkCell?.querySelector('a')?.href ||
      (primaryLinkCell?.textContent || '').trim();

    const secondaryHtml = (secondaryTextCell?.innerHTML || '').trim();

    // ---------- HEADER ----------
    const header = document.createElement('div');
    header.className = 'ql-header';

    const iconWrap = document.createElement('div');
    iconWrap.className = 'ql-icon';

    const iconImg = document.createElement('img');
    iconImg.src = iconUrl;
    iconImg.alt = '';
    iconImg.loading = 'lazy';
    iconWrap.append(iconImg);

    const titleWrap = document.createElement('div');
    titleWrap.className = 'ql-title';
    titleWrap.innerHTML = headingCell?.innerHTML || '';

    header.append(iconWrap, titleWrap);

    // ---------- SPACER (forces action alignment consistency) ----------
    const spacer = document.createElement('div');
    spacer.className = 'ql-spacer';

    // ---------- ACTION ROW ----------
    const actionRow = document.createElement('div');
    actionRow.className = 'ql-action-row';

    const primary = document.createElement('div');
    primary.className = 'ql-primary';

    const secondary = document.createElement('div');
    secondary.className = 'ql-secondary';

    if (type === 'call') {
      const number = document.createElement('span');
      number.className = 'ql-number';
      number.textContent = primaryText;
      primary.append(number);

      // Full-card click overlay (tel)
      let href = primaryLink;
      if (!href) {
        const digits = primaryText.replace(/[^\d+]/g, '');
        href = `tel:${digits}`;
      }

      const overlay = document.createElement('a');
      overlay.className = 'ql-cardlink';
      overlay.href = href;
      overlay.setAttribute('aria-label', `Call ${primaryText}`);
      overlay.setAttribute('role', 'link');
      overlay.tabIndex = 0;

      overlay.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') overlay.click();
      });

      li.append(overlay);
    } else {
      const btn = document.createElement('a');
      btn.className = 'ql-btn';
      btn.href = primaryLink || '#';
      btn.innerHTML = `
        <span class="ql-btntext">${primaryText}</span>
        <span class="ql-arrow" aria-hidden="true">→</span>
      `;
      primary.append(btn);

      if (secondaryHtml) {
        secondary.innerHTML = secondaryHtml;
      } else {
        secondary.innerHTML = ''; // keep node for consistent layout
        secondary.setAttribute('aria-hidden', 'true');
      }
    }

    actionRow.append(primary, secondary);

    // compose
    li.append(header, spacer, actionRow);
    ul.append(li);

    row.remove();
  });

  block.textContent = '';
  block.append(ul);
}