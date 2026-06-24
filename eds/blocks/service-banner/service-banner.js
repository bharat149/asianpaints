import { triggerCTAClickWithLinkAndTitle } from '../../scripts/analytics_1.js';

export default function decorate(block) {
  const wrapper = block.firstElementChild;
  wrapper.classList.add("wrapper");

  const banner = wrapper.firstElementChild;
  const content = wrapper.children[1];
  const img = banner.querySelector("picture");

  banner.innerHTML = "";
  banner.className = "banner";
  content.className = "content";

  banner.appendChild(img);

  content.querySelectorAll('.button-container a.button').forEach((cta) => {
    // The global bindButtonContainerTracking() (decorateMain) already binds
    // a click handler to every .button-container a.button and sets
    // dataset.analyticsBound. Respect that shared flag so we don't fire a
    // duplicate cta_link_text/custom_cta_click for the same click.
    if (cta.dataset.analyticsBound === 'true') return;
    if (cta.dataset.serviceBannerAnalyticsBound === 'true') return;

    cta.dataset.analyticsBound = 'true';
    cta.dataset.serviceBannerAnalyticsBound = 'true';
    cta.addEventListener('click', () => {
      const ctaLink = cta.getAttribute('href') || '';
      const btnTitle = cta.textContent.trim();
      const parentTitle = content.querySelector('h1, h2, h3, h4, h5, h6')?.textContent.trim() || 'service-banner';

      triggerCTAClickWithLinkAndTitle(ctaLink, btnTitle, parentTitle);
    });
  });
}
