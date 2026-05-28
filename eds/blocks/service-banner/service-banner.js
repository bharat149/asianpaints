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
    if (cta.dataset.serviceBannerAnalyticsBound === 'true') return;

    cta.dataset.serviceBannerAnalyticsBound = 'true';
    cta.addEventListener('click', () => {
      const ctaLink = cta.getAttribute('href') || '';
      const btnTitle = cta.textContent.trim();
      const parentTitle = content.querySelector('h1, h2, h3, h4, h5, h6')?.textContent.trim() || 'service-banner';

      triggerCTAClickWithLinkAndTitle(ctaLink, btnTitle, parentTitle);
    });
  });
}
