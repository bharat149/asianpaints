import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Carousel Expertise Block - Four Image in Row (Variant Five)
 */

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const container = document.createElement('div');
  container.className = 'fourimageinrow';

  rows.forEach((row) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'fourimageinrow-wraper';

    const pic = row.querySelector('picture');
    const link = row.querySelector('a');
    let title = '';
    const headings = row.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length > 0) {
      title = headings[0].textContent;
    } else if (link) {
      title = link.textContent;
    } else {
      title = row.textContent.trim();
    }

    const a = document.createElement('a');
    a.className = 'fourimageinrow-imagewithtext focus-visible-auto-imp fourimageinrow-track';
    a.href = link ? link.href : '#';
    if (link && link.target) {
      a.target = link.target;
    } else if (link) {
      a.target = '_blank';
    }
    a.setAttribute('aria-label', title);
    a.setAttribute('tabindex', '0');

    if (pic) {
      const img = pic.querySelector('img');
      if (img) {
        img.className = 'fourimageinrow-img';
        img.setAttribute('width', '314');
        img.setAttribute('height', '214');
      }
      a.append(pic);
    }

    const titleWrap = document.createElement('div');
    titleWrap.className = 'fourimageinrow-titlewitharrow';

    const titleSpan = document.createElement('span');
    titleSpan.className = 'fourimageinrow-imgtitle';
    titleSpan.textContent = title;

    const arrowSpan = document.createElement('span');
    arrowSpan.className = 'fourimageinrow-imgarrow';
    arrowSpan.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="15" viewBox="0 0 16 14" fill="none"><path d="M9.11103 1.1665L14.6666 6.99984M14.6666 6.99984L9.11103 12.8332M14.6666 6.99984L1.33325 6.99984" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    titleWrap.append(titleSpan, arrowSpan);
    a.append(titleWrap);
    wrapper.append(a);

    moveInstrumentation(row, wrapper);
    container.append(wrapper);
  });

  // Optimize images
  container.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '400' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
    optimizedPic.querySelector('img').className = 'fourimageinrow-img';
  });

  block.textContent = '';
  block.append(container);
}
