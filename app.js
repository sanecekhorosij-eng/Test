(() => {
  'use strict';

  const screens = [...document.querySelectorAll('.screen')];
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
      screen.setAttribute('aria-hidden', String(!active));
    });
    return safePage;
  }

  function goTo(page, push = true) {
    if (!validPages.has(page)) {
      showToast('Экран пока недоступен');
      return;
    }
    renderPage(page);
    const url = `${location.pathname}${location.search}#${page}`;
    if (push) history.pushState({ page }, '', url);
    else history.replaceState({ page }, '', url);
  }

  function goBack() {
    if (location.hash && location.hash !== '#home' && history.length > 1) history.back();
    else goTo('home');
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    if (button.hasAttribute('data-back')) return goBack();
    if (button.dataset.go) return goTo(button.dataset.go);
    if (button.dataset.soon) return showToast(`${button.dataset.soon}: раздел скоро будет доступен`);
    if (button.dataset.setting) return showToast(`${button.dataset.setting}: пункт выбран`);

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
  });

  window.addEventListener('popstate', () => renderPage(location.hash.slice(1) || 'home'));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') goBack();
  });

  const initial = location.hash.slice(1);
  goTo(validPages.has(initial) ? initial : 'home', false);
})();