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
  });
});
