document.querySelectorAll('[data-feature-stage]').forEach((stage) => {
  const tabs = Array.from(stage.querySelectorAll('[data-feature-tab]'));
  const panels = Array.from(stage.querySelectorAll('[data-feature-panel]'));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeIndex = Math.max(0, tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true'));
  let autoplayTimer;
  let autoplayStopped = false;

  function activate(tab, animate = false) {
    const selected = tab.dataset.featureTab;
    activeIndex = tabs.indexOf(tab);

    tabs.forEach((candidate) => {
      const active = candidate === tab;
      candidate.setAttribute('aria-selected', String(active));
      candidate.tabIndex = active ? 0 : -1;
      candidate.classList.toggle('bg-primary-100', active);
      candidate.classList.toggle('dark:bg-primary-900', active);
      candidate.classList.toggle('text-primary-800', active);
      candidate.classList.toggle('dark:text-primary-100', active);
      candidate.classList.toggle('shadow-sm', active);
      candidate.classList.toggle('text-gray-600', !active);
      candidate.classList.toggle('dark:text-gray-300', !active);
      candidate.classList.toggle('hover:bg-primary-50', !active);
      candidate.classList.toggle('hover:text-primary-700', !active);
      candidate.classList.toggle('dark:hover:bg-gray-700', !active);
    });

    panels.forEach((panel) => {
      panel.hidden = panel.dataset.featurePanel !== selected;
    });

    if (animate && !prefersReducedMotion) {
      const activePanel = panels.find((panel) => panel.dataset.featurePanel === selected);
      activePanel?.animate(
        [
          { opacity: 0, transform: 'translateX(12px)' },
          { opacity: 1, transform: 'translateX(0)' },
        ],
        { duration: 240, easing: 'ease-out' },
      );
    }
  }

  function stopAutoplay() {
    autoplayStopped = true;
    window.clearInterval(autoplayTimer);
  }

  function startAutoplay() {
    window.clearInterval(autoplayTimer);
    if (autoplayStopped || prefersReducedMotion || tabs.length < 2 || document.hidden) return;

    autoplayTimer = window.setInterval(() => {
      activate(tabs[(activeIndex + 1) % tabs.length], true);
    }, 5000);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      stopAutoplay();
      activate(tab, true);
    });
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      stopAutoplay();
      const nextIndex = event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? tabs.length - 1
          : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      tabs[nextIndex].focus();
      activate(tabs[nextIndex]);
    });
  });

  const linkedPanel = window.location.hash.slice(1);
  const linkedTab = tabs.find((tab) => tab.getAttribute('aria-controls') === linkedPanel);
  if (linkedTab) activate(linkedTab);

  document.addEventListener('visibilitychange', startAutoplay);
  startAutoplay();
});
