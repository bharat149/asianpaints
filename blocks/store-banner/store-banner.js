export default function decorate(block) {
  const link = block.querySelector('a');
  const picture = block.querySelector('picture');

  if (link && picture) {
    // Wrap entire block content in the link
    const wrapper = document.createElement('a');
    wrapper.href = link.href;
    wrapper.className = 'store-banner-link';

    // Clear the block and add picture
    block.textContent = '';
    wrapper.appendChild(picture);
    block.appendChild(wrapper);
  }
}
