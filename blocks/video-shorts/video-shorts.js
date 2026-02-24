export default function decorate(block) {
  // Get the title
  const titleRow = block.querySelector(':scope > div:first-child');
  const title = titleRow?.querySelector('h2, h3');
  
  // Extract video data from authored content
  const rows = [...block.querySelectorAll(':scope > div')];
  const videoData = [];
  
  rows.forEach((row, index) => {
    if (index === 0) return; // Skip title row
    
    const cols = [...row.querySelectorAll(':scope > div')];
    if (cols.length >= 2) {
      const mediaCol = cols[0];
      const ctaCol = cols[1];
      
      // Get video source - check for anchor link to video file first
      let videoSrc = '';
      const videoLink = mediaCol.querySelector('a');
      if (videoLink && videoLink.href.includes('.mp4')) {
        videoSrc = videoLink.href;
      } else {
        // Fallback: check for img src
        const img = mediaCol.querySelector('img');
        if (img) {
          videoSrc = img.src;
        } else {
          // Fallback: get URL from text content
          const textContent = mediaCol.textContent?.trim() || '';
          if (textContent.includes('.mp4') || textContent.includes('http')) {
            videoSrc = textContent;
          }
        }
      }
      
      // Get CTA
      const ctaLink = ctaCol.querySelector('a');
      const ctaText = ctaLink?.textContent?.trim() || 'Explore';
      const ctaHref = ctaLink?.href || '#';
      
      if (videoSrc) {
        videoData.push({
          src: videoSrc,
          alt: ctaText,
          ctaText,
          ctaHref
        });
      }
    }
  });

  // Clear block content
  block.innerHTML = '';

  // Add title
  if (title) {
    title.classList.add('video-shorts-title');
    block.appendChild(title);
  }

  // Create container
  const container = document.createElement('div');
  container.classList.add('video-shorts-container');

  // Create carousel wrapper
  const wrapper = document.createElement('div');
  wrapper.classList.add('carousel-wrapper');

  // Create carousel track
  const track = document.createElement('div');
  track.classList.add('carousel-track');

  // Create video cards
  videoData.forEach((video) => {
    const card = document.createElement('div');
    card.classList.add('video-card');

    // Create video element
    const videoEl = document.createElement('video');
    videoEl.preload = 'metadata';
    videoEl.playsInline = true;
    videoEl.autoplay = true;
    videoEl.loop = true;
    videoEl.muted = true;
    videoEl.poster = video.src;
    
    const source = document.createElement('source');
    source.src = video.src;
    source.type = 'video/mp4';
    videoEl.appendChild(source);

    // Create controls overlay
    const controls = document.createElement('div');
    controls.classList.add('video-controls');

    // Top controls (share, mute)
    const controlsTop = document.createElement('div');
    controlsTop.classList.add('video-controls-top');

    const shareBtn = document.createElement('button');
    shareBtn.classList.add('control-btn', 'share-btn');
    shareBtn.setAttribute('aria-label', 'Share');
    shareBtn.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.707,11.293l-8-8A.99991.99991,0,0,0,12,4V7.54492A11.01525,11.01525,0,0,0,2,18.5V20a1,1,0,0,0,1.78418.62061,11.45625,11.45625,0,0,1,7.88672-4.04932c.0498-.00635.1748-.01611.3291-.02588V20a.99991.99991,0,0,0,1.707.707l8-8A.99962.99962,0,0,0,21.707,11.293ZM14,17.58594V15.5a.99974.99974,0,0,0-1-1c-.25488,0-1.2959.04932-1.56152.085A14.00507,14.00507,0,0,0,4.05176,17.5332,9.01266,9.01266,0,0,1,13,9.5a.99974.99974,0,0,0,1-1V6.41406L19.58594,12Z" fill="#fff"/>
      </svg>
    `;

    const muteBtn = document.createElement('button');
    muteBtn.classList.add('control-btn', 'mute-btn');
    muteBtn.setAttribute('aria-label', 'Mute/Unmute');
    muteBtn.innerHTML = `
      <svg class="mute-icon" xmlns="http://www.w3.org/2000/svg" stroke="#fff" fill="none" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
        <path stroke-linecap="round" stroke-linejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
      </svg>
      <svg class="unmute-icon" style="display:none" xmlns="http://www.w3.org/2000/svg" stroke="#fff" fill="none" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
      </svg>
    `;

    // Mute/unmute toggle
    muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      videoEl.muted = !videoEl.muted;
      const muteIcon = muteBtn.querySelector('.mute-icon');
      const unmuteIcon = muteBtn.querySelector('.unmute-icon');
      if (videoEl.muted) {
        muteIcon.style.display = 'block';
        unmuteIcon.style.display = 'none';
      } else {
        muteIcon.style.display = 'none';
        unmuteIcon.style.display = 'block';
      }
    });

    controlsTop.append(shareBtn, muteBtn);
    controls.append(controlsTop);

    // CTA button
    const cta = document.createElement('a');
    cta.href = video.ctaHref;
    cta.classList.add('video-cta');
    cta.textContent = video.ctaText;

    card.append(videoEl, controls, cta);
    track.append(card);
  });

  // Create navigation buttons
  const prevBtn = document.createElement('button');
  prevBtn.classList.add('carousel-nav', 'prev');
  prevBtn.setAttribute('aria-label', 'Previous');
  prevBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M15 18l-6-6 6-6"/>
    </svg>
  `;

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('carousel-nav', 'next');
  nextBtn.setAttribute('aria-label', 'Next');
  nextBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  `;

  // Navigation logic
  const scrollAmount = 280;
  
  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  // Update nav button states
  const updateNavButtons = () => {
    prevBtn.disabled = track.scrollLeft <= 0;
    nextBtn.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 10;
  };

  track.addEventListener('scroll', updateNavButtons);
  setTimeout(updateNavButtons, 100);

  wrapper.append(prevBtn, track, nextBtn);
  container.append(wrapper);
  block.append(container);
}
