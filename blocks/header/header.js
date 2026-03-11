/**
 * Header Block
 * Fetches nav.plain.html and renders a 3-tier header:
 * Row 0: Brand bar (dark blue)
 * Row 1: Main header (logo, search, action icons, CTA, hamburger)
 * Row 2: Navigation bar (home icon, main nav with megamenu, secondary nav)
 */

import { getMetadata } from '../../scripts/aem.js';

const DESKTOP_BREAKPOINT = 992;

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

  // Logo — first <p> containing <a><img>
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

  // Search bar — second <p> containing search icon + camera icon
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

  // Rotating placeholder
  const placeholders = [
    'Search for Colour inspiration',
    'Search for Budget calculator',
    'Search for Waterproofing solutions',
    'Search for Interior design ideas',
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

  // Mobile search icon (standalone button, shown only on mobile)
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
  inner.appendChild(mobileSearchBtn);

  // Action icons — from <ul> in mainDiv
  const actionsUl = mainDiv.querySelector('ul');
  if (actionsUl) {
    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'header-actions';

    actionsUl.querySelectorAll(':scope > li').forEach((li) => {
      const anchor = li.querySelector('a');
      if (!anchor) return;

      const actionLink = document.createElement('a');
      actionLink.className = 'action-btn';
      actionLink.href = anchor.getAttribute('href');

      const img = anchor.querySelector('img');
      if (img) {
        actionLink.appendChild(img.cloneNode(true));
        actionLink.setAttribute('aria-label', img.alt || '');
      }

      // Cart badge
      if (img && img.alt && img.alt.toLowerCase().includes('cart')) {
        actionLink.classList.add('cart-btn');
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.textContent = '0';
        actionLink.appendChild(badge);
      }

      actionsContainer.appendChild(actionLink);
    });

    inner.appendChild(actionsContainer);
  }

  // CTA button — last <p> containing <a> without <img>
  const lastP = paragraphs[paragraphs.length - 1];
  if (lastP) {
    const ctaAnchor = lastP.querySelector('a');
    if (ctaAnchor && !ctaAnchor.querySelector('img')) {
      const ctaContainer = document.createElement('div');
      ctaContainer.className = 'header-cta';

      const ctaLink = document.createElement('a');
      ctaLink.className = 'cta-btn';
      ctaLink.href = ctaAnchor.getAttribute('href');
      ctaLink.textContent = ctaAnchor.textContent.trim();

      const arrow = document.createElement('span');
      arrow.className = 'cta-arrow';
      arrow.innerHTML = '&#8594;';
      ctaLink.appendChild(arrow);

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

  // Search icon
  const searchIcon = document.createElement('span');
  searchIcon.className = 'search-icon';
  if (paragraphs[1]) {
    const imgs = paragraphs[1].querySelectorAll('img');
    if (imgs[0]) searchIcon.appendChild(imgs[0].cloneNode(true));
  }

  // Search input
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'search-input';
  input.placeholder = 'Search';
  input.setAttribute('aria-label', 'Search');

  // Camera button (visual search)
  const cameraBtn = document.createElement('button');
  cameraBtn.className = 'camera-btn';
  cameraBtn.type = 'button';
  cameraBtn.setAttribute('aria-label', 'Search by image');

  // Close button
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

  // Empty cart icon (SVG shopping bag)
  const iconWrap = document.createElement('div');
  iconWrap.className = 'cart-modal-icon';

  const cartTitle = document.createElement('p');
  cartTitle.className = 'cart-modal-title';
  cartTitle.textContent = 'Your cart is empty';

  const shopBtn = document.createElement('a');
  shopBtn.className = 'cart-modal-shop';
  shopBtn.href = 'https://www.asianpaints.com/products';
  shopBtn.textContent = 'Shop now';

  modal.append(closeBtn, iconWrap, cartTitle, shopBtn);
  overlay.appendChild(modal);

  // Close modal
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

  // Each <li> in submenuUl is a column
  submenuUl.querySelectorAll(':scope > li').forEach((colLi) => {
    const column = document.createElement('div');
    column.className = 'dropdown-column';

    // Column heading is the first <a> in this <li>
    const headingLink = colLi.querySelector(':scope > a, :scope > p > a');
    if (headingLink) {
      const heading = document.createElement('h4');
      heading.className = 'dropdown-title';
      heading.textContent = headingLink.textContent.trim();
      column.appendChild(heading);
    }

    // Column items are in the nested <ul>
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

          // Check for "New" badge items
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

  // Left: main navigation
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

      // Home item gets special class
      if (link.textContent === 'Home') {
        navItem.classList.add('nav-home');
        link.setAttribute('aria-label', 'Home');
        link.textContent = '';
      }

      // Check for submenu (megamenu)
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

  // Right: secondary navigation
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

/* eslint-disable max-len */
const DRAG_DROP_GIF = 'https://www.asianpaints.com/content/dam/apcolourcatalogue/asset/ap-revamp/visual-search/drag-drop-gif-desktop.gif';
const BROWSE_ICON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>';
/* eslint-enable max-len */

function buildVisualSearchModal() {
  const overlay = document.createElement('div');
  overlay.className = 'vs-modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'vs-modal';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'vs-modal-close';
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.innerHTML = '&times;';

  const dropZone = document.createElement('div');
  dropZone.className = 'vs-dropzone';

  const title = document.createElement('p');
  title.className = 'vs-title';
  title.textContent = 'Get recommendations for Colour inspiration, Textures, Wallpapers, Interior Design ideas, etc...';

  const uploadIcon = document.createElement('div');
  uploadIcon.className = 'vs-upload-icon';
  uploadIcon.style.setProperty('--drag-image-url', `url('${DRAG_DROP_GIF}')`);

  const dragText = document.createElement('p');
  dragText.className = 'vs-drag-text';
  dragText.textContent = 'Drag & drop your image here';

  const orText = document.createElement('p');
  orText.className = 'vs-or';
  orText.textContent = 'or';

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/jpeg,image/png';
  fileInput.className = 'vs-file-input';
  fileInput.setAttribute('aria-label', 'Browse an image');

  const browseBtn = document.createElement('button');
  browseBtn.className = 'vs-browse-btn';
  browseBtn.type = 'button';
  const browseLabel = document.createElement('span');
  browseLabel.textContent = 'Browse an image';
  browseBtn.appendChild(browseLabel);
  const browseIcon = document.createElement('span');
  browseIcon.className = 'vs-browse-icon';
  browseIcon.innerHTML = BROWSE_ICON_SVG;
  browseBtn.appendChild(browseIcon);

  const hint = document.createElement('p');
  hint.className = 'vs-hint';
  hint.textContent = 'JPG or PNG. 5MB Maximum';

  dropZone.append(title, uploadIcon, dragText, orText, browseBtn, hint);
  modal.append(closeBtn, dropZone);
  overlay.appendChild(modal);

  // Close modal
  const close = () => overlay.classList.remove('active');
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  // Browse button opens file picker
  browseBtn.addEventListener('click', () => fileInput.click());

  // Drag & drop visuals
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
  });

  return overlay;
}

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
      // Close any open sub-panel when closing menu
      if (expanded) closeMobilePanel(block);
    });
  }

  // Add back buttons to dropdown panels for mobile slide-in
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

    // Click: desktop vs mobile behavior
    const link = item.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth < DESKTOP_BREAKPOINT) {
          e.preventDefault();
          const navInner = block.querySelector('.header-nav-inner');
          // Close any other open panels
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

  // Cart modal — open on cart button click
  const cartBtn = block.querySelector('.cart-btn');
  const cartModal = block.querySelector('.cart-modal-overlay');
  if (cartBtn && cartModal) {
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      cartModal.classList.add('active');
    });
  }

  // Visual search modal — wire ALL camera buttons (desktop + mobile search panel)
  const vsModal = block.querySelector('.vs-modal-overlay');
  if (vsModal) {
    block.querySelectorAll('.camera-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        vsModal.classList.add('active');
      });
    });
  }

  // Search focus effect (desktop)
  const searchInput = block.querySelector('.header-search .search-input');
  const searchBar = block.querySelector('.header-search');
  if (searchInput && searchBar) {
    searchInput.addEventListener('focus', () => searchBar.classList.add('focused'));
    searchInput.addEventListener('blur', () => searchBar.classList.remove('focused'));
  }

  // Mobile search panel: open/close
  const mobileSearchBtn = block.querySelector('.mobile-search-btn');
  const mobileSearchPanel = block.querySelector('.mobile-search-panel');
  if (mobileSearchBtn && mobileSearchPanel) {
    const mobileSearchClose = mobileSearchPanel.querySelector('.mobile-search-close');
    const mobileInput = mobileSearchPanel.querySelector('.search-input');

    mobileSearchBtn.addEventListener('click', () => {
      mobileSearchPanel.classList.add('active');
      if (mobileInput) mobileInput.focus();
    });

    if (mobileSearchClose) {
      mobileSearchClose.addEventListener('click', () => {
        mobileSearchPanel.classList.remove('active');
      });
    }
  }

  // Viewport resize handler
  const mql = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
  mql.addEventListener('change', (e) => {
    if (e.matches) {
      // Switched to desktop
      if (hamburger) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('is-open');
      }
      if (navBar) navBar.classList.remove('mobile-open');
      document.body.classList.remove('nav-open');
      closeMobilePanel(block);
      // Close mobile search panel
      const searchPanel = block.querySelector('.mobile-search-panel');
      if (searchPanel) searchPanel.classList.remove('active');
    } else {
      // Switched to mobile — close any open desktop dropdowns
      block.querySelectorAll('.nav-item.has-dropdown.active').forEach((li) => li.classList.remove('active'));
    }
  });
}

export default async function decorate(block) {
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

  // Wire up all interactions
  addInteractions(block);
}
