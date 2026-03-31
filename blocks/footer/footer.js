/**
 * Asian Paints Footer Block
 * Content-driven: fetches /footer.plain.html and renders 5 sections
 * Mega Footer | Video Banner | Global Presence | Divisions | Bottom Bar
 * @param {Element} block The footer block element
 */

import { trackEvent, triggerCTAClickWithLinkAndTitle } from '../../scripts/analytics.js';

/* ---------- IMAGE FALLBACKS (local PNG images) ---------- */
const IMG = 'https://content.da.live/aemysites/asian-paints-demo/.footer';
const IMAGE_FALLBACKS = {
  'Asian Paints Logo': `${IMG}/ap-logo.png`,
  'Asian Paints': `${IMG}/ap-logo.png`,
  'Har Ghar Kuch Kehta Hai': `${IMG}/har-ghar-kuch-kehta-hai-desktop.png`,
  Global: `${IMG}/global.png`,
  Arabia: `${IMG}/arabia.png`,
  Bangladesh: `${IMG}/bangladesh.png`,
  Egypt: `${IMG}/egypt.png`,
  Ethiopia: `${IMG}/ethiopia.png`,
  Fiji: `${IMG}/fiji.png`,
  Nepal: `${IMG}/nepal.png`,
  'Sri Lanka': `${IMG}/sri-lanka.png`,
  Facebook: `${IMG}/facebook.png`,
  X: `${IMG}/x.png`,
  Instagram: `${IMG}/instagram.png`,
  YouTube: `${IMG}/youtube.png`,
  Pinterest: `${IMG}/pinterest.png`,
};

const FOOTER_BRAND_LOGO = 'https://static.asianpaints.com/content/dam/home-revamp/footer/ap-logo/ap-logo-4x.webp';

/**
 * Fix broken images in parsed HTML fragment.
 * DA content sometimes has src="about:error" for images that weren't uploaded.
 * Replace with known CDN URLs based on alt text.
 */
function fixBrokenImages(fragment) {
  fragment.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src') || '';
    if (src === 'about:error' || !src || src === '') {
      const alt = img.getAttribute('alt') || '';
      const fallback = IMAGE_FALLBACKS[alt];
      if (fallback) {
        img.setAttribute('src', fallback);
      }
    }
  });
}

/* ---------- HELPERS ---------- */
function el(tag, attrs = {}, ...children) {
  const elem = document.createElement(tag);
  Object.entries(attrs).forEach(([key, val]) => {
    if (key === 'className') elem.className = val;
    else elem.setAttribute(key, val);
  });
  children.forEach((child) => {
    if (typeof child === 'string') elem.appendChild(document.createTextNode(child));
    else if (child) elem.appendChild(child);
  });
  return elem;
}

function getFooterVideoLink(cell) {
  return cell.querySelector('a[href*="youtube"], a[href*="youtu.be"]')?.href
    || 'https://www.youtube.com/watch?v=c6GKMQDYI1k';
}

function getYouTubeEmbedUrl(videoUrl) {
  try {
    const url = new URL(videoUrl, window.location.origin);
    let videoId = url.searchParams.get('v') || '';

    if (url.hostname.includes('youtu.be')) {
      videoId = url.pathname.split('/').filter(Boolean).pop() || '';
    } else if (url.pathname.startsWith('/embed/')) {
      [, , videoId] = url.pathname.split('/');
    }

    if (!videoId) return '';

    return `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0&playsinline=1`;
  } catch (e) {
    return '';
  }
}

function openFooterVideo(banner, videoUrl) {
  const player = banner.querySelector('.footer-video-player');
  const frame = banner.querySelector('.footer-video-embed');
  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  if (!player || !frame || !embedUrl) return;

  frame.innerHTML = `
    <iframe
      src="${embedUrl}"
      title="Asian Paints footer video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    ></iframe>
  `;

  banner.classList.add('video-active');
  player.setAttribute('aria-hidden', 'false');
}

function closeFooterVideo(banner) {
  const player = banner.querySelector('.footer-video-player');
  const frame = banner.querySelector('.footer-video-embed');

  if (!player || !frame) return;

  banner.classList.remove('video-active');
  player.setAttribute('aria-hidden', 'true');
  frame.innerHTML = '';
}

/**
 * Parse link groups from a cell containing alternating title/link paragraphs.
 * DA format: <p>Title +</p> <p><a>link</a> <a>link</a>…</p>
 * @returns {Array<{title: string, links: Array<{text: string, href: string}>}>}
 */
function parseLinkGroups(cell) {
  const groups = [];
  const paras = [...cell.querySelectorAll(':scope > p')];
  let i = 0;
  while (i < paras.length) {
    const p = paras[i];
    const links = [...p.querySelectorAll('a')];
    const text = p.textContent.trim();

    if (links.length === 0 && text) {
      // Title paragraph (e.g. "Services +")
      const title = text.replace(/\s*\+\s*$/, '');
      i += 1;
      // Next paragraph should be links
      const linkPara = paras[i];
      const groupLinks = linkPara
        ? [...linkPara.querySelectorAll('a')].map((a) => ({
          text: a.textContent.trim(),
          href: a.getAttribute('href'),
        }))
        : [];
      groups.push({ title, links: groupLinks });
      i += 1;
    } else if (links.length > 0) {
      // Links paragraph without a preceding title (e.g. About section)
      groups.push({
        title: links[0].textContent.trim(),
        links: links.slice(1).map((a) => ({
          text: a.textContent.trim(),
          href: a.getAttribute('href'),
        })),
      });
      i += 1;
    } else {
      i += 1;
    }
  }
  return groups;
}

/* ---------- SECTION 1: MEGA FOOTER ---------- */
function buildBrandColumn(cell) {
  const col = el('div', { className: 'mega-col mega-col-brand' });

  // Logo — first <a> containing an <img>
  const logoAnchor = cell.querySelector('a');
  if (logoAnchor) {
    const logo = el('a', {
      href: logoAnchor.getAttribute('href') || '/',
      className: 'footer-brand-logo',
      'aria-label': 'Asian Paints Home',
    });
    const img = logoAnchor.querySelector('img');
    if (img) {
      logo.appendChild(el('img', {
        src: FOOTER_BRAND_LOGO,
        alt: img.getAttribute('alt') || 'Asian Paints',
        width: '180',
        height: '63',
        loading: 'lazy',
      }));
    }
    col.appendChild(logo);
  }

  // Contact — tel: and mailto: links
  const contact = el('div', { className: 'footer-brand-contact' });
  const allLinks = [...cell.querySelectorAll('a')];

  const phoneLink = allLinks.find((a) => a.getAttribute('href')?.startsWith('tel:'));
  if (phoneLink) {
    const phone = el('a', { href: phoneLink.getAttribute('href'), className: 'contact-row' });
    phone.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
    phone.appendChild(el('span', {}, phoneLink.textContent.trim()));
    contact.appendChild(phone);
  }

  const emailLink = allLinks.find((a) => a.getAttribute('href')?.startsWith('mailto:'));
  if (emailLink) {
    const email = el('a', { href: emailLink.getAttribute('href'), className: 'contact-row' });
    email.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';
    const emailLabel = el('span');
    const emailText = emailLink.textContent.trim();

    if (emailText.endsWith('@asianpaints.com')) {
      emailLabel.append(
        document.createTextNode(emailText.replace('@asianpaints.com', '@asian')),
        document.createElement('wbr'),
        document.createTextNode('paints.com'),
      );
    } else {
      emailLabel.appendChild(document.createTextNode(emailText));
    }

    email.appendChild(emailLabel);
    contact.appendChild(email);
  }
  col.appendChild(contact);

  // Public Notice — look for "Public Notice" text
  const paras = [...cell.querySelectorAll('p')];
  const noticeTitleP = paras.find((p) => p.textContent.trim().startsWith('Public Notice'));
  if (noticeTitleP) {
    const notice = el('div', { className: 'footer-public-notice' });
    notice.appendChild(el('div', { className: 'notice-label' }, noticeTitleP.textContent.trim()));
    const nextP = noticeTitleP.nextElementSibling;
    if (nextP && nextP.tagName === 'P') {
      notice.appendChild(el('p', { className: 'notice-body' }, nextP.textContent.trim()));
    }
    col.appendChild(notice);
  }

  return col;
}

function buildLinkGroup(group) {
  const section = el('div', { className: 'link-group panel-group' });

  const header = el('button', {
    className: 'link-group-title',
    'aria-expanded': 'false',
    type: 'button',
  });
  header.appendChild(el('span', {}, group.title));
  header.innerHTML += '<svg class="accordion-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>';
  section.appendChild(header);

  const list = el('ul', { className: 'link-group-list' });
  group.links.forEach((link) => {
    const li = el('li');
    li.appendChild(el('a', { href: link.href }, link.text));
    list.appendChild(li);
  });
  section.appendChild(list);

  return section;
}

function buildLinkColumnFromGroups(groups) {
  const col = el('div', { className: 'mega-col mega-col-links' });
  groups.forEach((group) => {
    const section = el('div', { className: 'link-group' });

    const header = el('button', {
      className: 'link-group-title',
      'aria-expanded': 'false',
      type: 'button',
    });
    header.appendChild(el('span', {}, group.title));
    header.innerHTML += '<span class="accordion-icon">+</span>';
    section.appendChild(header);

    const list = el('ul', { className: 'link-group-list' });
    group.links.forEach((link) => {
      const li = el('li');
      li.appendChild(el('a', { href: link.href }, link.text));
      list.appendChild(li);
    });
    section.appendChild(list);
    col.appendChild(section);
  });
  return col;
}

function buildMegaFooter(container, row) {
  const cells = [...row.querySelectorAll(':scope > div')];
  if (cells.length < 2) return;

  const section = el('section', { className: 'footer-mega', 'aria-label': 'Footer navigation' });
  const inner = el('div', { className: 'footer-mega-inner' });
  const grid = el('div', { className: 'mega-grid' });

  // Zone 1: Brand column (left — white text on grey)
  grid.appendChild(buildBrandColumn(cells[0]));

  // Parse groups from cells
  const linkGroups = parseLinkGroups(cells[1]);
  const aboutGroups = cells[2] ? parseLinkGroups(cells[2]) : [];

  // Zone 2: Center block (white background with link columns)
  const center = el('div', { className: 'mega-center' });
  const centerNav = el('nav', { className: 'mega-center-grid footer-col col-two' });

  const panelLeft = el('div', { className: 'panel-section panel-left mega-col-links' });
  linkGroups.slice(0, 2).forEach((group) => {
    panelLeft.appendChild(buildLinkGroup(group));
  });
  if (panelLeft.children.length) centerNav.appendChild(panelLeft);

  const panelMiddle = el('div', { className: 'panel-section panel-middle mega-col-links' });
  linkGroups.slice(2, 3).forEach((group) => {
    panelMiddle.appendChild(buildLinkGroup(group));
  });
  if (panelMiddle.children.length) centerNav.appendChild(panelMiddle);

  const panelRight = el('div', { className: 'panel-section panel-right mega-col-links' });
  const rightInner = el('div', { className: 'right-inner' });

  const rightColPrimary = el('div', { className: 'right-col' });
  linkGroups.slice(3, 5).forEach((group) => {
    rightColPrimary.appendChild(buildLinkGroup(group));
  });
  if (rightColPrimary.children.length) rightInner.appendChild(rightColPrimary);

  const rightColSecondary = el('div', { className: 'right-col' });
  linkGroups.slice(5).forEach((group) => {
    rightColSecondary.appendChild(buildLinkGroup(group));
  });
  if (rightColSecondary.children.length) rightInner.appendChild(rightColSecondary);

  if (rightInner.children.length) {
    panelRight.appendChild(rightInner);
    centerNav.appendChild(panelRight);
  }

  center.appendChild(centerNav);
  grid.appendChild(center);

  // Zone 3: About column (right — white text on grey)
  if (aboutGroups.length > 0) {
    const aboutCol = buildLinkColumnFromGroups(aboutGroups);
    aboutCol.classList.add('mega-col-about');
    grid.appendChild(aboutCol);
  }

  inner.appendChild(grid);
  section.appendChild(inner);
  container.appendChild(section);
}

/* ---------- SECTION 2: VIDEO BANNER ---------- */
function buildVideoBanner(container, row) {
  if (!row) return;
  const cell = row.querySelector(':scope > div') || row;
  const videoUrl = getFooterVideoLink(cell);

  const banner = el('section', { className: 'footer-video-banner' });
  const mediaBg = el('div', { className: 'video-bg' });

  // Banner image — find the large image (not the YouTube logo)
  const allImgs = [...cell.querySelectorAll('img')];
  const bannerImg = allImgs.find((img) => {
    const w = parseInt(img.getAttribute('width'), 10);
    return !w || w > 100;
  }) || allImgs[0];

  // Use the picture wrapping the banner image, or create one
  const bannerPicture = bannerImg?.closest('picture');
  if (bannerPicture) {
    const pic = bannerPicture.cloneNode(true);
    const picImg = pic.querySelector('img');
    if (picImg) {
      picImg.setAttribute('width', '755');
      picImg.setAttribute('height', '513');
      picImg.setAttribute('loading', 'lazy');
    }
    mediaBg.appendChild(pic);
  } else if (bannerImg) {
    const pic = document.createElement('picture');
    const imgEl = el('img', {
      src: bannerImg.getAttribute('src'),
      alt: bannerImg.getAttribute('alt') || 'Har Ghar Kuch Kehta Hai',
      loading: 'lazy',
      width: '755',
      height: '513',
    });
    pic.appendChild(imgEl);
    mediaBg.appendChild(pic);
  }
  banner.appendChild(mediaBg);

  // Gradient overlay
  banner.appendChild(el('div', { className: 'video-gradient' }));

  // CTA overlay — find "WATCH NOW" text
  const ctaText = cell.textContent.includes('WATCH NOW') ? 'WATCH NOW' : 'WATCH NOW';
  const overlay = el('div', { className: 'video-overlay' });
  const cta = el('button', {
    className: 'watch-now-btn',
    'aria-label': `${ctaText} on YouTube`,
    type: 'button',
  });
  cta.innerHTML = `<img class="yt-icon" src="${IMG}/youtube-logo.png" alt="YouTube" width="64" height="64">`;
  cta.appendChild(el('span', {}, ctaText));
  cta.addEventListener('click', () => {
    trackEvent('video_playbotton_click', {
      videoTitle: cta.getAttribute('aria-label') || '',
    });
    openFooterVideo(banner, videoUrl);
  });
  overlay.appendChild(cta);
  banner.appendChild(overlay);

  const player = el('div', {
    className: 'footer-video-player',
    'aria-hidden': 'true',
  });
  const closeButton = el('button', {
    className: 'footer-video-close',
    type: 'button',
    'aria-label': 'Close footer video',
  });
  const frame = el('div', { className: 'footer-video-frame' });
  const embed = el('div', { className: 'footer-video-embed' });

  closeButton.addEventListener('click', () => {
    closeFooterVideo(banner);
  });

  player.addEventListener('click', (event) => {
    if (event.target === player) {
      closeFooterVideo(banner);
    }
  });

  frame.append(closeButton, embed);
  player.append(frame);
  banner.appendChild(player);

  container.appendChild(banner);
}

/* ---------- SECTION 3: GLOBAL PRESENCE ---------- */
function buildGlobalPresence(container, row) {
  if (!row) return;
  const cells = [...row.querySelectorAll(':scope > div')];

  const wrapper = el('section', { className: 'footer-global', 'aria-label': 'Our Global Presence' });
  const inner = el('div', { className: 'footer-global-inner' });

  // Title from first cell
  const titleText = cells[0]?.textContent.trim() || 'OUR GLOBAL PRESENCE';
  const titleRow = el('div', { className: 'section-title-row' });
  titleRow.appendChild(el('span', { className: 'title-line' }));
  titleRow.appendChild(el('h3', { className: 'section-title' }, titleText));
  titleRow.appendChild(el('span', { className: 'title-line' }));
  inner.appendChild(titleRow);

  // Country items from second cell — pattern: <a><img></a> CountryName
  const contentCell = cells[1] || cells[0];
  const countries = el('div', { className: 'country-list' });

  // Parse country items: each <a> has an <img>, followed by text node with country name
  const anchors = [...contentCell.querySelectorAll('a')];
  anchors.forEach((a) => {
    const img = a.querySelector('img');
    if (!img) return;
    const href = a.getAttribute('href') || '#';
    const name = img.getAttribute('alt') || '';
    const item = el('a', {
      href,
      className: 'country-item',
      target: '_blank',
      rel: 'noopener',
      'aria-label': name,
    });
    item.appendChild(el('img', {
      src: img.getAttribute('src'),
      alt: name,
      width: '32',
      height: '32',
      loading: 'lazy',
      className: 'country-flag',
    }));
    item.appendChild(el('span', { className: 'country-name track_countryName' }, name));
    countries.appendChild(item);
  });
  inner.appendChild(countries);

  wrapper.appendChild(inner);
  container.appendChild(wrapper);
}

/* ---------- SECTION 4: DIVISIONS ---------- */
function buildDivisions(container, row) {
  if (!row) return;
  const cells = [...row.querySelectorAll(':scope > div')];

  const wrapper = el('section', { className: 'footer-divisions', 'aria-label': 'Our Divisions' });
  const inner = el('div', { className: 'footer-divisions-inner' });

  // Title from first cell
  const titleText = cells[0]?.textContent.trim() || 'OUR DIVISIONS';
  const titleRow = el('div', { className: 'section-title-row' });
  titleRow.appendChild(el('span', { className: 'title-line' }));
  titleRow.appendChild(el('h3', { className: 'section-title' }, titleText));
  titleRow.appendChild(el('span', { className: 'title-line' }));
  inner.appendChild(titleRow);

  // Division logos from second cell — <a> with <picture>/<img>
  const contentCell = cells[1] || cells[0];
  const logos = el('div', { className: 'division-logos' });
  const anchors = [...contentCell.querySelectorAll('a')];
  anchors.forEach((a) => {
    const img = a.querySelector('img');
    if (!img) return;
    const link = el('a', {
      href: a.getAttribute('href') || '#',
      className: 'division-logo',
      'aria-label': img.getAttribute('alt') || '',
      target: '_blank',
      rel: 'noopener',
    });
    link.appendChild(el('img', {
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt') || '',
      loading: 'lazy',
      height: '50',
    }));
    logos.appendChild(link);
  });
  inner.appendChild(logos);

  wrapper.appendChild(inner);
  container.appendChild(wrapper);
}

/* ---------- SECTION 5: BOTTOM BAR ---------- */
function buildBottomBar(container, row) {
  if (!row) return;
  const cells = [...row.querySelectorAll(':scope > div')];

  const bottom = el('section', { className: 'footer-bottom', 'aria-label': 'Footer info' });
  const inner = el('div', { className: 'footer-bottom-inner' });

  // Cell 0: Social icons
  if (cells[0]) {
    const social = el('div', { className: 'bottom-social' });
    [...cells[0].querySelectorAll('a')].forEach((a) => {
      const img = a.querySelector('img');
      if (!img) return;
      const platformName = img.getAttribute('alt') || '';
      const link = el('a', {
        href: a.getAttribute('href'),
        className: 'social-icon',
        'aria-label': platformName,
        'data-attr-platform': platformName,
        target: '_blank',
        rel: 'noopener',
      });
      link.appendChild(el('img', {
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt') || '',
        width: '28',
        height: '28',
        loading: 'lazy',
      }));
      social.appendChild(link);
    });
    inner.appendChild(social);
  }

  // Cell 1: Copyright
  if (cells[1]) {
    const copy = el('div', { className: 'bottom-copyright' });
    copy.textContent = cells[1].textContent.trim();
    inner.appendChild(copy);
  }

  // Cell 2: Sitemap
  if (cells[2]) {
    const sitemap = el('div', { className: 'bottom-sitemap' });
    const sitemapLink = cells[2].querySelector('a');
    if (sitemapLink) {
      const a = el('a', { href: sitemapLink.getAttribute('href') });
      a.innerHTML = 'Sitemap <span class="sitemap-arrow">&rsaquo;</span>';
      sitemap.appendChild(a);
    }
    inner.appendChild(sitemap);
  }

  bottom.appendChild(inner);
  container.appendChild(bottom);
}

/* ---------- MOBILE ACCORDION ---------- */
function initMobileAccordions(block) {
  const titles = block.querySelectorAll('.link-group-title');
  titles.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (window.innerWidth >= 1024) return;
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      titles.forEach((other) => {
        other.setAttribute('aria-expanded', 'false');
        other.nextElementSibling.style.maxHeight = null;
      });
      if (!expanded) {
        btn.setAttribute('aria-expanded', 'true');
        const list = btn.nextElementSibling;
        list.style.maxHeight = `${list.scrollHeight}px`;
      }
    });
  });

  const mq = window.matchMedia('(min-width: 1024px)');
  mq.addEventListener('change', (e) => {
    titles.forEach((btn) => {
      if (e.matches) {
        btn.nextElementSibling.style.maxHeight = null;
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

function initFooterContactTracking(block) {
  block.querySelectorAll('.footer-brand-contact').forEach((contact) => {
    contact.addEventListener('click', () => {
      trackEvent('footer_phone_number_click', {});
    });
  });
}

function initFooterTabTracking(block) {
  const centerGrid = block.querySelector('.mega-center-grid');
  if (!centerGrid || centerGrid.dataset.footerTabBound === 'true') return;

  centerGrid.dataset.footerTabBound = 'true';
  centerGrid.addEventListener('click', (event) => {
    const link = event.target.closest('.link-group-list li a');
    if (!link || !centerGrid.contains(link)) return;

    const parentTitle = link.closest('.link-group')
      ?.querySelector(':scope > .link-group-title span')
      ?.textContent
      ?.trim() || 'footer';
    const ctaLink = link.getAttribute('href') || '';

    triggerCTAClickWithLinkAndTitle(ctaLink, link.textContent.trim(), parentTitle);
  });
}

function initFooterAboutTabTracking(block) {
  block.querySelectorAll('.mega-col.mega-col-links.mega-col-about .link-group-list li a').forEach((link) => {
    link.addEventListener('click', () => {
      trackEvent('footer_tab', {
        cta_: link.textContent.trim(),
      });
    });
  });
}

function initFooterSitemapTracking(block) {
  block.querySelectorAll('.bottom-sitemap a').forEach((link) => {
    link.addEventListener('click', () => {
      trackEvent('custom_cta_click', {
        cta_: link.textContent.trim(),
        parentTitle: 'footer',
        redirectionLink: link.getAttribute('href') || '',
      });
    });
  });
}

function initFooterCountryTracking(block) {
  block.querySelectorAll('.country-list a').forEach((link) => {
    link.addEventListener('click', () => {
      const countryName = link.querySelector('.track_countryName')?.textContent?.trim() || '';

      trackEvent('footer_country', {
        cta_: countryName,
      });
    });
  });
}

function initFooterDivisionTracking(block) {
  block.querySelectorAll('.division-logos a').forEach((link) => {
    link.addEventListener('click', () => {
      const ctaTitle = link.getAttribute('aria-label') || link.textContent.trim();
      const ctaLink = link.getAttribute('href') || '';

      triggerCTAClickWithLinkAndTitle(ctaLink, ctaTitle, 'footer');
    });
  });
}

function initFooterSocialTracking(block) {
  block.querySelectorAll('.bottom-social a').forEach((link) => {
    link.addEventListener('click', () => {
      trackEvent('footer_socialicons', {
        cta_: link.getAttribute('data-attr-platform') || '',
      });
    });
  });
}

function initFooterVideoBanner(block) {
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    block.querySelectorAll('.footer-video-banner.video-active').forEach((banner) => {
      closeFooterVideo(banner);
    });
  });
}

/* ---------- DECORATE ---------- */
export default async function decorate(block) {
  const resp = await fetch('/footer.plain.html');
  if (!resp.ok) return;

  const html = await resp.text();
  const fragment = document.createElement('div');
  fragment.innerHTML = html;

  // Fix broken image sources before processing
  fixBrokenImages(fragment);

  // Find the footer block wrapper — DA content has <div class="footer-wrapper">
  const wrapper = fragment.querySelector('.footer-wrapper') || fragment;

  // Rows = direct div children of the wrapper (5 rows)
  const rows = [...wrapper.querySelectorAll(':scope > div')];

  block.textContent = '';
  const footerContent = el('div', { className: 'footer-content' });

  // Row 0: Mega Footer (brand + links + about)
  if (rows[0]) buildMegaFooter(footerContent, rows[0]);

  // Row 1: Video Banner
  if (rows[1]) buildVideoBanner(footerContent, rows[1]);

  // Row 2 + 3: Global Presence & Divisions (side-by-side on mobile)
  const globalDivGrid = el('div', { className: 'footer-global-divisions' });
  if (rows[2]) buildGlobalPresence(globalDivGrid, rows[2]);
  if (rows[3]) buildDivisions(globalDivGrid, rows[3]);
  footerContent.appendChild(globalDivGrid);

  // Row 4: Bottom Bar
  if (rows[4]) buildBottomBar(footerContent, rows[4]);

  block.append(footerContent);
  initMobileAccordions(block);
  initFooterContactTracking(block);
  initFooterTabTracking(block);
  initFooterAboutTabTracking(block);
  initFooterSitemapTracking(block);
  initFooterCountryTracking(block);
  initFooterDivisionTracking(block);
  initFooterSocialTracking(block);
  initFooterVideoBanner(block);
}
