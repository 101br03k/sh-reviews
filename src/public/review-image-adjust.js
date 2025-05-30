// This script adjusts the review image height based on the text height in .review-content
window.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.review-content').forEach(function (content) {
    const img = content.querySelector('img');
    const text = content.querySelector('.text');
    if (!img || !text) return;

    // Wait for image to load to get natural size
    function adjustImage() {
      // Get height of text content (excluding image)
      const textHeight = text.offsetHeight;
      if (textHeight < 120) {
        img.style.height = '120px';
        img.style.width = 'auto';
      } else {
        // Set max width to 120px, height auto, but not less than 120px
        img.style.width = '120px';
        img.style.height = 'auto';
        // If the resulting height is less than 120px, set min-height
        if (img.offsetHeight < 120) {
          img.style.height = '120px';
        }
      }
    }
    if (img.complete) {
      adjustImage();
    } else {
      img.addEventListener('load', adjustImage);
    }

    // Add popup on click
    img.style.cursor = 'pointer';
    img.addEventListener('click', function () {
      // Create overlay
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
      overlay.style.background = 'rgba(0,0,0,0.8)';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.zIndex = 9999;
      overlay.style.cursor = 'zoom-out';

      // Create big image
      const bigImg = document.createElement('img');
      bigImg.src = img.src;
      bigImg.alt = img.alt;
      bigImg.style.maxWidth = '90vw';
      bigImg.style.maxHeight = '90vh';
      bigImg.style.borderRadius = '8px';
      bigImg.style.boxShadow = '0 4px 32px rgba(0,0,0,0.5)';
      bigImg.style.background = '#fff';
      bigImg.style.objectFit = 'contain';
      overlay.appendChild(bigImg);

      // Remove overlay on click
      overlay.addEventListener('click', function () {
        overlay.remove();
      });
      document.body.appendChild(overlay);
    });
  });
});
