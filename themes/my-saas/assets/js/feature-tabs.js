document.querySelectorAll('[data-feature-stage]').forEach((stage) => {
  const tabs = Array.from(stage.querySelectorAll('[data-feature-tab]'));
  const panels = Array.from(stage.querySelectorAll('[data-feature-panel]'));

  function activate(tab) {
    const selected = tab.dataset.featureTab;

    tabs.forEach((candidate) => {
      const active = candidate === tab;
      candidate.setAttribute('aria-selected', String(active));
      candidate.tabIndex = active ? 0 : -1;
      candidate.classList.toggle('bg-primary-700', active);
      candidate.classList.toggle('dark:bg-primary-600', active);
      candidate.classList.toggle('text-white', active);
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
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
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
});
