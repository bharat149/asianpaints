export default function decorate(block) {
  console.log('block', block);

  // scope cards inside block
  block.querySelectorAll(':scope > div').forEach((card) => {
    const divs = card.querySelectorAll(':scope > div');
    if (divs[0]) divs[0].classList.add('inspiration-popular-image');
    if (divs[1]) divs[1].classList.add('inspiration-popular-title');
    if (divs[2]) divs[2].classList.add('inspiration-popular-read-more');
  });

  // scope links inside block
  block.querySelectorAll('a').forEach((a) => {
    a.textContent = 'Read more';
  });

  const items = Array.from(block.children);

  const isMobile = window.outerWidth < 900;

  // create blocks
  const blocks = (isMobile ? [1, 2] : [1, 2, 3]).map((i) => {
    const div = document.createElement('div');
    div.classList.add(`block-${i}`);
    return div;
  });

  // distribute items
  items.forEach((item, index) => {
    blocks[index % (isMobile ? 2 : 3)].appendChild(item);
  });

  // append back
  block.innerHTML = '';
  blocks.forEach((b) => block.appendChild(b));
}
