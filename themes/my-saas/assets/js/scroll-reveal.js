const sections = document.querySelectorAll('section');
const minIntersectionPx = 75; // Minimum intersection in pixels

// Create the intersection observer with proper options
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // Calculate the actual intersection area in pixels
    const intersectionRect = entry.intersectionRect;
    const intersectionArea = intersectionRect.width * intersectionRect.height;
    const target = entry.target;

    // Use the fixed pixel threshold as required
    if (intersectionArea >= minIntersectionPx) {
      // Force a repaint before changing styles to ensure the browser applies them
      void target.offsetWidth;

      target.style.opacity = '1';
      target.style.transform = 'translateY(0)';

      // Stop observing this section
      observer.unobserve(target);
    }
  });
}, {
  // Fallback thresholds - we'll use our pixel-based calculation instead
  threshold: [0.01, 0.05, 0.1, 0.2, 0.5]
});

// Function to check if section is initially in viewport
const isInViewport = (section) => {
  const rect = section.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Apply initial styles to all sections
  sections.forEach(section => {
    // Set initial state
    if (isInViewport(section)) {
      // If in viewport on load, make visible immediately
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    } else {
      // If not in viewport, hide and observe
      section.style.opacity = '0';
      section.style.transform = 'translateY(8rem)';
      observer.observe(section);
    }

    // Always set the transition (after setting initial state) (this controls speed)
    section.style.transition = 'opacity 0.75s ease-in, transform 0.5s ease-out';
  });
});
