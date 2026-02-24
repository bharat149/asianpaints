/**
 * Asian Paints Header Block
 * Fetches nav content and transforms into styled 3-tier layout
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Fetch nav content
  const resp = await fetch('/nav.plain.html');
  if (!resp.ok) {
    // eslint-disable-next-line no-console
    console.error('Failed to load nav:', resp.status);
    return;
  }

  const html = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Get all divs from nav content
  const divs = [...doc.body.querySelectorAll(':scope > div')];
  if (divs.length < 4) return;

  // Structure:
  // divs[0] = Brand logos (3 pictures)
  // divs[1] = Main logo (p), search icon (p), camera icon (p), action icons (ul), CTA button (p)
  // divs[2] = Home icon (p), Main navigation (ul with dropdowns)
  // divs[3] = Secondary navigation (ul)

  const brandDiv = divs[0];
  const mainDiv = divs[1];
  const navDiv = divs[2];
  const secondaryNavDiv = divs[3];

  // Clear block
  block.textContent = '';

  // ========================================
  // 1. BRAND BAR (Top - Dark Blue)
  // ========================================
  const brandBar = document.createElement('div');
  brandBar.className = 'header-brands';

  const brandBarInner = document.createElement('div');
  const brandLogos = brandDiv.querySelectorAll('p');

  brandLogos.forEach((logo, idx) => {
    const brandItem = document.createElement('a');
    brandItem.className = 'brand-item';
    if (idx === 0) brandItem.classList.add('active');

    // Set URLs for each brand
    const urls = ['/', 'https://www.beautifulhomes.asianpaints.com', 'https://whiteteak.asianpaints.com'];
    brandItem.href = urls[idx] || '#';

    const picture = logo.querySelector('picture');
    if (picture) {
      brandItem.appendChild(picture.cloneNode(true));
    }

    brandBarInner.appendChild(brandItem);
  });

  brandBar.appendChild(brandBarInner);
  block.appendChild(brandBar);

  // ========================================
  // 2. MAIN HEADER (White - Logo, Search, Actions, CTA)
  // ========================================
  const mainHeader = document.createElement('div');
  mainHeader.className = 'header-main';

  const mainHeaderInner = document.createElement('div');

  // Get all paragraphs from mainDiv
  const mainParagraphs = mainDiv.querySelectorAll('p');
  // Structure: [0] = main logo, [1] = search icon, [2] = camera icon, [last] = CTA link

  // Main Logo (1st paragraph)
  if (mainParagraphs[0]) {
    const logoContainer = document.createElement('a');
    logoContainer.className = 'header-logo';
    logoContainer.href = '/';
    const picture = mainParagraphs[0].querySelector('picture');
    if (picture) {
      logoContainer.appendChild(picture.cloneNode(true));
    }
    mainHeaderInner.appendChild(logoContainer);
  }

  // Search Bar
  const searchBar = document.createElement('div');
  searchBar.className = 'header-search';

  // Search icon (2nd paragraph from mainDiv)
  const searchIcon = document.createElement('span');
  searchIcon.className = 'search-icon';
  if (mainParagraphs[1]) {
    const searchPic = mainParagraphs[1].querySelector('picture');
    if (searchPic) {
      searchIcon.appendChild(searchPic.cloneNode(true));
    }
  }

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search for  Colour inspiration';
  searchInput.className = 'search-input';

  // Camera icon (3rd paragraph from mainDiv)
  const cameraBtn = document.createElement('button');
  cameraBtn.className = 'camera-btn';
  cameraBtn.type = 'button';
  cameraBtn.setAttribute('aria-label', 'Search by image');
  if (mainParagraphs[2]) {
    const cameraPic = mainParagraphs[2].querySelector('picture');
    if (cameraPic) {
      cameraBtn.appendChild(cameraPic.cloneNode(true));
    }
  }

  searchBar.appendChild(searchIcon);
  searchBar.appendChild(searchInput);
  searchBar.appendChild(cameraBtn);
  mainHeaderInner.appendChild(searchBar);

  // Action Icons (from UL in mainDiv)
  const actionsUl = mainDiv.querySelector('ul');
  if (actionsUl) {
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'header-actions';

    const actionItems = actionsUl.querySelectorAll('li');
    const actionUrls = ['/store-locator', '/location', '/profile', '/cart'];
    const actionLabels = ['Store Locator', 'Location', 'Profile', 'Cart'];

    actionItems.forEach((item, idx) => {
      const actionLink = document.createElement('a');
      actionLink.href = actionUrls[idx] || '#';
      actionLink.className = 'action-btn';
      actionLink.setAttribute('aria-label', actionLabels[idx] || 'Action');

      // Add cart badge for last item
      if (idx === actionItems.length - 1) {
        actionLink.classList.add('cart-btn');
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.textContent = '0';
        actionLink.appendChild(badge);
      }

      const picture = item.querySelector('picture');
      if (picture) {
        actionLink.insertBefore(picture.cloneNode(true), actionLink.firstChild);
      }

      actionsContainer.appendChild(actionLink);
    });

    mainHeaderInner.appendChild(actionsContainer);
  }

  // CTA Button
  const ctaP = mainDiv.querySelector('p:last-of-type a');
  if (ctaP) {
    const ctaContainer = document.createElement('div');
    ctaContainer.className = 'header-cta';

    const ctaLink = document.createElement('a');
    ctaLink.href = ctaP.getAttribute('href') || '/';
    ctaLink.className = 'cta-btn';
    ctaLink.textContent = ctaP.textContent;

    ctaContainer.appendChild(ctaLink);
    mainHeaderInner.appendChild(ctaContainer);
  }

  // Hamburger Menu (for mobile)
  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.type = 'button';
  hamburger.setAttribute('aria-controls', 'nav');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span class="hamburger-icon"></span>';
  mainHeaderInner.appendChild(hamburger);

  mainHeader.appendChild(mainHeaderInner);

  // Create sticky wrapper for main header and nav bar
  const stickyWrapper = document.createElement('div');
  stickyWrapper.className = 'header-sticky';
  stickyWrapper.appendChild(mainHeader);

  // ========================================
  // 3. NAVIGATION BAR (Main + Secondary Nav)
  // ========================================
  const navBar = document.createElement('div');
  navBar.className = 'header-nav-bar';

  const navBarInner = document.createElement('div');

  // Left side: Home icon + Main Navigation
  const navLeft = document.createElement('div');
  navLeft.className = 'nav-left';

  // Home icon (first paragraph with picture in navDiv)
  const homeIconP = navDiv.querySelector('p');
  if (homeIconP) {
    const homeLink = document.createElement('a');
    homeLink.href = '/';
    homeLink.className = 'nav-home';
    homeLink.setAttribute('aria-label', 'Home');
    const homePic = homeIconP.querySelector('picture');
    if (homePic) {
      homeLink.appendChild(homePic.cloneNode(true));
    }
    navLeft.appendChild(homeLink);
  }

  // Main Navigation
  const mainNavUl = navDiv.querySelector('ul');
  if (mainNavUl) {
    const nav = document.createElement('nav');
    nav.className = 'main-nav';

    const navList = document.createElement('ul');
    navList.className = 'nav-list';

    const mainNavItems = mainNavUl.querySelectorAll(':scope > li');
    mainNavItems.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'nav-item';

      const linkP = item.querySelector(':scope > p > a');
      if (linkP) {
        const link = document.createElement('a');
        link.href = linkP.getAttribute('href') || '#';
        link.className = 'nav-link';
        link.textContent = linkP.textContent;

        // Check for dropdown
        const submenu = item.querySelector(':scope > ul');
        if (submenu) {
          li.classList.add('has-dropdown');
          link.innerHTML += `<svg class="dropdown-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>`;

          // Build dropdown
          const dropdown = document.createElement('div');
          dropdown.className = 'nav-dropdown';

          const dropdownInner = document.createElement('div');
          dropdownInner.className = 'dropdown-inner';

          const submenuItems = submenu.querySelectorAll(':scope > li');
          submenuItems.forEach((subItem) => {
            const column = document.createElement('div');
            column.className = 'dropdown-column';

            // Category title
            const titleStrong = subItem.querySelector(':scope > p > strong');
            if (titleStrong) {
              const title = document.createElement('h4');
              title.className = 'dropdown-title';
              title.textContent = titleStrong.textContent;
              column.appendChild(title);
            }

            // Submenu links
            const subLinks = subItem.querySelector(':scope > ul');
            if (subLinks) {
              const linkList = document.createElement('ul');
              linkList.className = 'dropdown-links';

              subLinks.querySelectorAll('li').forEach((linkItem) => {
                const linkLi = document.createElement('li');
                const linkA = linkItem.querySelector('a');
                if (linkA) {
                  const a = document.createElement('a');
                  a.href = linkA.getAttribute('href') || '#';
                  a.textContent = linkA.textContent;
                  linkLi.appendChild(a);
                }
                linkList.appendChild(linkLi);
              });

              column.appendChild(linkList);
            }

            dropdownInner.appendChild(column);
          });

          dropdown.appendChild(dropdownInner);
          li.appendChild(link);
          li.appendChild(dropdown);
        } else {
          li.appendChild(link);
        }
      }

      navList.appendChild(li);
    });

    nav.appendChild(navList);
    navLeft.appendChild(nav);
  }

  navBarInner.appendChild(navLeft);

  // Right side: Secondary Navigation
  const secondaryNavUl = secondaryNavDiv.querySelector('ul');
  if (secondaryNavUl) {
    const navRight = document.createElement('div');
    navRight.className = 'nav-right';

    const secNav = document.createElement('nav');
    secNav.className = 'secondary-nav';

    const secNavList = document.createElement('ul');
    secNavList.className = 'secondary-nav-list';

    secondaryNavUl.querySelectorAll('li').forEach((item) => {
      const li = document.createElement('li');
      const linkA = item.querySelector('a');
      if (linkA) {
        const a = document.createElement('a');
        a.href = linkA.getAttribute('href') || '#';
        a.textContent = linkA.textContent;
        li.appendChild(a);
      }
      secNavList.appendChild(li);
    });

    secNav.appendChild(secNavList);
    navRight.appendChild(secNav);
    navBarInner.appendChild(navRight);
  }

  navBar.appendChild(navBarInner);
  stickyWrapper.appendChild(navBar);
  block.appendChild(stickyWrapper);

  // ========================================
  // INTERACTIONS
  // ========================================

  // Mobile menu toggle
  const hamburgerBtn = block.querySelector('.nav-hamburger');
  const headerNavBar = block.querySelector('.header-nav-bar');

  if (hamburgerBtn && headerNavBar) {
    hamburgerBtn.addEventListener('click', () => {
      const expanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
      hamburgerBtn.setAttribute('aria-expanded', String(!expanded));
      headerNavBar.classList.toggle('mobile-open', !expanded);
      document.body.style.overflow = expanded ? '' : 'hidden';
    });
  }

  // Desktop dropdown hover
  block.querySelectorAll('.nav-item.has-dropdown').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      if (window.innerWidth >= 992) {
        item.classList.add('active');
      }
    });

    item.addEventListener('mouseleave', () => {
      if (window.innerWidth >= 992) {
        item.classList.remove('active');
      }
    });

    // Mobile click toggle
    const link = item.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth < 992) {
          e.preventDefault();
          item.classList.toggle('active');
        }
      });
    }
  });

  // Resize handler
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 992) {
      hamburgerBtn?.setAttribute('aria-expanded', 'false');
      headerNavBar?.classList.remove('mobile-open');
      document.body.style.overflow = '';
      block.querySelectorAll('.nav-item.active').forEach((li) => li.classList.remove('active'));
    }
  });

  // Search input focus effect
  const searchInput2 = block.querySelector('.search-input');
  const searchBar2 = block.querySelector('.header-search');
  if (searchInput2 && searchBar2) {
    searchInput2.addEventListener('focus', () => {
      searchBar2.classList.add('focused');
    });
    searchInput2.addEventListener('blur', () => {
      searchBar2.classList.remove('focused');
    });
  }
}
