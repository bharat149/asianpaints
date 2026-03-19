import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const isCta = block.classList.contains('cta');
  const isRecommended = block.classList.contains('recommended');

  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);

    let cardLink = null;
    [...li.children].forEach((div) => {
      if (!isCta && div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
        if (isRecommended) {
          const link = div.querySelector('a');
          if (link) cardLink = link.href;
        }
      }
    });

    if (isRecommended && cardLink) {
      li.addEventListener('click', () => { window.location.href = cardLink; });
      li.setAttribute('role', 'link');
      li.setAttribute('tabindex', '0');
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') window.location.href = cardLink;
      });
    }

    ul.append(li);
  });

  const imgWidth = isRecommended ? '400' : '750';
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: imgWidth }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });



  ul.querySelectorAll('.cards-card-body p').forEach((p) => {
    [...p.childNodes].forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.remove(); // remove plain text
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'A') {
        node.remove(); // remove elements like <strong>, <em>, etc. but keep <a>
      }
    });
    // Optional: if no <a> remains, remove the empty <p>
    // if (!p.querySelector('a')) p.remove();
  });


  block.textContent = '';
  block.append(ul);

}
