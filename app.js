(() => {
  'use strict';

  const screens = Array.from(document.querySelectorAll('.screen'));
  const toast = document.getElementById('toast');
  const validPages = new Set(screens.map((screen) => screen.dataset.page));
  let toastTimer = 0;
  let notificationsEnabled = localStorage.getItem('notificationsEnabled') !== 'false';
  let spinning = false;

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 1800);
  }

  function renderPage(page) {
    const safePage = validPages.has(page) ? page : 'home';

    screens.forEach((screen) => {
      const active = screen.dataset.page === safePage;
      screen.classList.toggle('active', active);
      screen.hidden = !active;
      screen.setAttribute('aria-hidden', String(!active));
    });

    document.body.dataset.page = safePage;
    window.scrollTo(0, 0);
    return safePage;
  }

  function setUrl(page, mode = 'push') {
    const url = `${location.pathname}${location.search}#${page}`;
    const state = { page };
    if (mode === 'replace') history.replaceState(state, '', url);
    else history.pushState(state, '', url);
  }

  function goTo(page, mode = 'push') {
    if (!validPages.has(page)) {
      showToast('Экран пока недоступен');
      return;
    }

    renderPage(page);
    setUrl(page, mode);
  }

  function goHome() {
    renderPage('home');
    setUrl('home', 'replace');
  }

  function activate(button) {
    if (!button || button.disabled) return;

    if (button.hasAttribute('data-back')) {
      goHome();
      return;
    }

    if (button.dataset.go) {
      goTo(button.dataset.go);
      return;
    }

    if (button.dataset.soon) {
      showToast(`${button.dataset.soon}: раздел скоро будет доступен`);
      return;
    }

    if (button.dataset.setting) {
      showToast(`${button.dataset.setting}: пункт выбран`);
      return;
    }

    switch (button.dataset.action) {
      case 'toggle-notifications':
        notificationsEnabled = !notificationsEnabled;
        localStorage.setItem('notificationsEnabled', String(notificationsEnabled));
        showToast(`Уведомления ${notificationsEnabled ? 'включены' : 'выключены'}`);
        break;
      case 'open-chest':
        showToast('Открытие сундука стоит 30 кристаллов');
        break;
      case 'spin-wheel':
        if (spinning) return;
        spinning = true;
        button.disabled = true;
        showToast('Колесо запущено!');
        window.setTimeout(() => {
          spinning = false;
          button.disabled = false;
          showToast('Прокрутка завершена');
        }, 1800);
        break;
      case 'watch-video':
        showToast('Видео-награда будет подключена позже');
        break;
      default:
        break;
    }
  }

  // Один обработчик click работает и для мыши, и для касаний,
  // и не допускает двойного срабатывания touchend + click на iPhone.
  document.addEventListener('click', (event) => {
    const button = event.target.closest('.hotspot');
    if (!button) return;
    event.preventDefault();
    activate(button);
  });

  window.addEventListener('popstate', (event) => {
    const page = event.state?.page || location.hash.slice(1) || 'home';
    renderPage(page);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') goHome();
  });

  // Приложение всегда запускается с главного экрана,
  // даже если браузер восстановил старый адрес #settings.
  renderPage('home');
  setUrl('home', 'replace');
})();