export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // Ensure the hero LCP image is fetched eagerly at highest priority.
  const firstImg = block.querySelector(':scope > div:first-child img');
  if (firstImg) {
    firstImg.loading = 'eager';
    firstImg.fetchPriority = 'high';
  }
}
