/**
 * Asian Paints Footer Block
 * Transforms footer content into pixel-perfect layout matching design
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Fetch footer content
  const resp = await fetch('/footer.plain.html');
  if (!resp.ok) {
    // eslint-disable-next-line no-console
    console.error('Failed to load footer:', resp.status);
    return;
  }

  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Get the footer-wrapper content
  const wrapper = doc.querySelector('.footer-wrapper');
  if (!wrapper) return;

  const sections = [...wrapper.children];
  block.textContent = '';

  // Create footer container
  const footerContainer = document.createElement('div');
  footerContainer.className = 'footer-container';

  // ========================================
  // SECTION 1: Our Divisions + Main Content
  // ========================================
  const mainSection = sections[0];
  if (mainSection) {
    const mainDivs = [...mainSection.querySelectorAll(':scope > div')];
    const leftContent = mainDivs[0];
    const rightContent = mainDivs[1];

    // --- OUR DIVISIONS ---
    const divisionsSection = document.createElement('div');
    divisionsSection.className = 'footer-divisions';

    // Get first text as title
    const divisionTitle = leftContent?.querySelector('p:first-child');
    if (divisionTitle && !divisionTitle.querySelector('a')) {
      const title = document.createElement('h3');
      title.className = 'footer-section-title';
      title.textContent = divisionTitle.textContent;
      divisionsSection.appendChild(title);
    }

    // Get division logos (all p elements with pictures/links before the hr)
    const divisionLogos = document.createElement('div');
    divisionLogos.className = 'division-logos';

    const hrElement = leftContent?.querySelector('hr');
    const allParagraphs = leftContent ? [...leftContent.querySelectorAll('p')] : [];

    allParagraphs.forEach((p, idx) => {
      if (idx === 0) return; // Skip title
      const link = p.querySelector('a');
      const picture = p.querySelector('picture');

      // Stop at hr
      if (hrElement && p.compareDocumentPosition(hrElement) & Node.DOCUMENT_POSITION_PRECEDING) {
        return;
      }

      if (link && picture) {
        const logoLink = document.createElement('a');
        logoLink.href = link.getAttribute('href') || '#';
        logoLink.className = 'division-logo';
        logoLink.appendChild(picture.cloneNode(true));
        divisionLogos.appendChild(logoLink);
      }
    });

    divisionsSection.appendChild(divisionLogos);
    footerContainer.appendChild(divisionsSection);

    // --- MAIN CONTENT GRID ---
    const mainGrid = document.createElement('div');
    mainGrid.className = 'footer-main-grid';

    // Left side: Menu columns
    const menuSection = document.createElement('div');
    menuSection.className = 'footer-menus';

    // Parse menu sections (after hr)
    const menuTitles = ['About', 'Policies', 'Content', 'Calculators'];
    const lists = leftContent ? [...leftContent.querySelectorAll('ul')] : [];
    const titleElements = leftContent ? [...leftContent.querySelectorAll('p')] : [];

    menuTitles.forEach((menuTitle, idx) => {
      const column = document.createElement('div');
      column.className = 'footer-menu-column';

      const title = document.createElement('h4');
      title.className = 'menu-title';
      title.textContent = menuTitle;
      column.appendChild(title);

      if (lists[idx]) {
        const ul = document.createElement('ul');
        ul.className = 'menu-links';
        lists[idx].querySelectorAll('li').forEach((li) => {
          const newLi = document.createElement('li');
          const link = li.querySelector('a');
          if (link) {
            const a = document.createElement('a');
            a.href = link.getAttribute('href') || '#';
            a.textContent = link.textContent;
            newLi.appendChild(a);
          }
          ul.appendChild(newLi);
        });
        column.appendChild(ul);
      }

      menuSection.appendChild(column);
    });

    mainGrid.appendChild(menuSection);

    // Right side: Logo, Country, Contact, etc.
    const rightSection = document.createElement('div');
    rightSection.className = 'footer-right';

    if (rightContent) {
      // Logo and Country selector
      const logoCountry = document.createElement('div');
      logoCountry.className = 'footer-logo-country';

      // Logo
      const logoPic = rightContent.querySelector('p:first-child picture');
      if (logoPic) {
        const logoLink = document.createElement('a');
        logoLink.href = '/';
        logoLink.className = 'footer-logo';
        logoLink.appendChild(logoPic.cloneNode(true));
        logoCountry.appendChild(logoLink);
      }

      // Country selector
      const countryList = rightContent.querySelector('ul');
      if (countryList) {
        const countrySelector = document.createElement('div');
        countrySelector.className = 'country-selector';

        const selectedCountry = document.createElement('button');
        selectedCountry.className = 'country-selected';
        selectedCountry.innerHTML = `
          <span class="country-flag"></span>
          <span class="country-name">India</span>
          <svg class="dropdown-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        `;

        const dropdown = document.createElement('div');
        dropdown.className = 'country-dropdown';
        const dropdownUl = document.createElement('ul');
        countryList.querySelectorAll('li').forEach((li) => {
          const link = li.querySelector('a');
          if (link) {
            const newLi = document.createElement('li');
            const a = document.createElement('a');
            a.href = link.getAttribute('href') || '#';
            a.textContent = link.textContent;
            newLi.appendChild(a);
            dropdownUl.appendChild(newLi);
          }
        });
        dropdown.appendChild(dropdownUl);

        countrySelector.appendChild(selectedCountry);
        countrySelector.appendChild(dropdown);
        logoCountry.appendChild(countrySelector);
      }

      rightSection.appendChild(logoCountry);

      // Contact Us section
      const contactSection = document.createElement('div');
      contactSection.className = 'footer-contact';

      const contactTitle = document.createElement('h4');
      contactTitle.className = 'footer-subsection-title';
      contactTitle.textContent = 'Contact Us';
      contactSection.appendChild(contactTitle);

      // Phone
      const phoneLink = rightContent.querySelector('a[href^="tel:"]');
      if (phoneLink) {
        const phoneDiv = document.createElement('div');
        phoneDiv.className = 'contact-item';
        phoneDiv.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          <a href="${phoneLink.getAttribute('href')}">${phoneLink.textContent}</a>
        `;
        contactSection.appendChild(phoneDiv);
      }

      // Email
      const emailLink = rightContent.querySelector('a[href^="mailto:"]');
      if (emailLink) {
        const emailDiv = document.createElement('div');
        emailDiv.className = 'contact-item';
        emailDiv.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <a href="${emailLink.getAttribute('href')}">${emailLink.textContent}</a>
        `;
        contactSection.appendChild(emailDiv);
      }

      rightSection.appendChild(contactSection);

      // Find a store section
      const storeSection = document.createElement('div');
      storeSection.className = 'footer-store';

      const storeTitle = document.createElement('h4');
      storeTitle.className = 'footer-subsection-title';
      storeTitle.textContent = 'Find a store';
      storeSection.appendChild(storeTitle);

      const storeForm = document.createElement('form');
      storeForm.className = 'store-form';
      storeForm.innerHTML = `
        <input type="text" placeholder="Enter pincode" maxlength="6" pattern="[0-9]{6}">
        <button type="submit">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      `;
      storeSection.appendChild(storeForm);

      rightSection.appendChild(storeSection);

      // Newsletter section
      const newsSection = document.createElement('div');
      newsSection.className = 'footer-newsletter';

      const newsTitle = document.createElement('h4');
      newsTitle.className = 'footer-subsection-title';
      newsTitle.textContent = 'Get the latest trending news';
      newsSection.appendChild(newsTitle);

      const newsForm = document.createElement('form');
      newsForm.className = 'newsletter-form';
      newsForm.innerHTML = `
        <input type="email" placeholder="Enter email id">
        <button type="submit">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      `;
      newsSection.appendChild(newsForm);

      rightSection.appendChild(newsSection);

      // Download App section
      const appSection = document.createElement('div');
      appSection.className = 'footer-app';

      const appTitle = document.createElement('h4');
      appTitle.className = 'footer-subsection-title';
      appTitle.textContent = 'Download our visualiser app';
      appSection.appendChild(appTitle);

      const appWrapper = document.createElement('div');
      appWrapper.className = 'app-downloads';

      // Get QR codes and store buttons from content
      const allPics = rightContent.querySelectorAll('picture');
      const qrCodes = [];
      const storeButtons = [];

      allPics.forEach((pic) => {
        const img = pic.querySelector('img');
        const alt = img?.getAttribute('alt') || '';
        if (alt.includes('QR')) {
          qrCodes.push(pic);
        } else if (alt.includes('Play') || alt.includes('App Store')) {
          const parentA = pic.closest('a');
          storeButtons.push({ pic, link: parentA?.getAttribute('href') || '/' });
        }
      });

      // Create app download items
      for (let i = 0; i < Math.min(qrCodes.length, 2); i += 1) {
        const appItem = document.createElement('div');
        appItem.className = 'app-item';

        const qrDiv = document.createElement('div');
        qrDiv.className = 'qr-code';
        qrDiv.appendChild(qrCodes[i].cloneNode(true));
        appItem.appendChild(qrDiv);

        if (storeButtons[i]) {
          const storeLink = document.createElement('a');
          storeLink.href = storeButtons[i].link;
          storeLink.className = 'store-button';
          storeLink.appendChild(storeButtons[i].pic.cloneNode(true));
          appItem.appendChild(storeLink);
        }

        appWrapper.appendChild(appItem);
      }

      appSection.appendChild(appWrapper);
      rightSection.appendChild(appSection);

      // Connect with us
      const socialSection = document.createElement('div');
      socialSection.className = 'footer-social';

      const socialTitle = document.createElement('h4');
      socialTitle.className = 'footer-subsection-title';
      socialTitle.textContent = 'Connect with us';
      socialSection.appendChild(socialTitle);

      const socialLinks = document.createElement('div');
      socialLinks.className = 'social-links';

      // Get social icons
      const socialPics = rightContent.querySelectorAll('a[href*="facebook"], a[href*="twitter"], a[href*="x.com"], a[href*="instagram"], a[href*="youtube"], a[href*="pinterest"]');
      socialPics.forEach((link) => {
        const socialLink = document.createElement('a');
        socialLink.href = link.getAttribute('href') || '#';
        socialLink.className = 'social-link';
        const pic = link.querySelector('picture');
        if (pic) {
          socialLink.appendChild(pic.cloneNode(true));
        }
        socialLinks.appendChild(socialLink);
      });

      socialSection.appendChild(socialLinks);
      rightSection.appendChild(socialSection);
    }

    mainGrid.appendChild(rightSection);
    footerContainer.appendChild(mainGrid);
  }

  // ========================================
  // SECTION 2: Colour Tools
  // ========================================
  const colourToolsSection = sections[1];
  if (colourToolsSection) {
    const colourTools = document.createElement('div');
    colourTools.className = 'footer-colour-tools';

    const toolsTitle = document.createElement('h3');
    toolsTitle.className = 'footer-section-title';
    toolsTitle.textContent = 'Colour tools';
    colourTools.appendChild(toolsTitle);

    const toolsGrid = document.createElement('div');
    toolsGrid.className = 'colour-tools-grid';

    const toolLinks = colourToolsSection.querySelectorAll('a');
    toolLinks.forEach((link) => {
      const toolLink = document.createElement('a');
      toolLink.href = link.getAttribute('href') || '#';
      toolLink.className = 'colour-tool-link';
      toolLink.textContent = link.textContent;
      toolsGrid.appendChild(toolLink);
    });

    colourTools.appendChild(toolsGrid);
    footerContainer.appendChild(colourTools);
  }

  // ========================================
  // SECTION 3: Copyright
  // ========================================
  const copyrightSection = sections[2];
  if (copyrightSection) {
    const copyright = document.createElement('div');
    copyright.className = 'footer-copyright';
    copyright.textContent = copyrightSection.textContent.trim();
    footerContainer.appendChild(copyright);
  }

  // ========================================
  // SECTION 4: Public Notice
  // ========================================
  const noticeSection = sections[3];
  if (noticeSection) {
    const notice = document.createElement('div');
    notice.className = 'footer-notice';

    const noticeDivs = noticeSection.querySelectorAll('div');
    if (noticeDivs.length >= 2) {
      const noticeTitle = document.createElement('span');
      noticeTitle.className = 'notice-title';
      noticeTitle.textContent = noticeDivs[0].textContent;
      notice.appendChild(noticeTitle);

      const noticeText = document.createElement('p');
      noticeText.className = 'notice-text';
      noticeText.textContent = noticeDivs[1].textContent;
      notice.appendChild(noticeText);
    }

    footerContainer.appendChild(notice);
  }

  block.appendChild(footerContainer);

  // ========================================
  // INTERACTIONS
  // ========================================

  // Country selector toggle
  const countryBtn = block.querySelector('.country-selected');
  const countryDropdown = block.querySelector('.country-dropdown');

  if (countryBtn && countryDropdown) {
    countryBtn.addEventListener('click', () => {
      countryDropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.country-selector')) {
        countryDropdown.classList.remove('open');
      }
    });
  }

  // Store form submission
  const storeForm = block.querySelector('.store-form');
  if (storeForm) {
    storeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = storeForm.querySelector('input');
      const pincode = input.value.trim();
      if (pincode && /^\d{6}$/.test(pincode)) {
        window.location.href = `/store-locator?pincode=${pincode}`;
      } else {
        input.classList.add('error');
        setTimeout(() => input.classList.remove('error'), 2000);
      }
    });
  }

  // Newsletter form
  const newsForm = block.querySelector('.newsletter-form');
  if (newsForm) {
    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsForm.querySelector('input');
      const email = input.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email)) {
        input.value = '';
        // Show success (could add toast notification)
      } else {
        input.classList.add('error');
        setTimeout(() => input.classList.remove('error'), 2000);
      }
    });
  }
}
