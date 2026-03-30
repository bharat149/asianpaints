// Select all direct div children of .inspiration-calculator
const calculatorDivs = document.querySelectorAll('.inspiration-calculator > div');

calculatorDivs.forEach(div => {
  const children = Array.from(div.children);
  if (children.length === 0) return; // Skip if no children

  // Wrap the first child in .image-wrapper
  const firstChild = children[0];
  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add('image-wrapper');
  firstChild.replaceWith(imageWrapper);
  imageWrapper.appendChild(firstChild);

  // Wrap all other children in .content-wrapper
  if (children.length > 1) {
    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('content-wrapper');

    // Process remaining children
    const remainingChildren = children.slice(1);
    remainingChildren.forEach(child => {
      const link = child.querySelector('a');
      if (link) {
        // Get the href
        const href = link.href;

        // Remove the original link from the DOM
        link.remove();

        // Create new "Calculate Now" anchor
        const calculateNowLink = document.createElement('a');
        calculateNowLink.href = href;
        calculateNowLink.textContent = 'Calculate Now';
        calculateNowLink.classList.add('calculate-now-link'); // optional class
        contentWrapper.appendChild(calculateNowLink);
      } else {
        contentWrapper.appendChild(child);
      }
    });

    // Append the content wrapper to the original div
    div.appendChild(contentWrapper);
  }
});
