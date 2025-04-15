const sections = document.querySelectorAll('section');

// Function to apply initial styles only if the section is off-screen
const applyInitialStyles = (section) => {
  const rect = section.getBoundingClientRect();
  const isOffScreen = rect.bottom < 0 || rect.top > (window.innerHeight || document.documentElement.clientHeight);

  if (isOffScreen) {
    section.style.opacity = '0';
    section.style.transform = 'translateY(15rem)';
    section.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
  } else {
    // Apply on-screen styles directly if visible on initial load
    section.style.opacity = '1';
    section.style.transform = 'translateY(0)';
    section.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out'; // Still add the transition for subsequent scrolls
  }
};

// Apply initial styles to each section
sections.forEach(applyInitialStyles);


const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    } else {
      entry.target.style.opacity = '0';
      entry.target.style.transform = 'translateY(8rem)';
    }
  });
}, {
  threshold: 0.15
});

sections.forEach(section => {
  observer.observe(section);
});
