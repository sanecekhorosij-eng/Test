(() => {
  'use strict';

  function startApp() {
    const screens = Array.from(document.querySelectorAll('.screen'));
    const toast = document.getElementById('toast');
    const validPages = new Set(screens.map((screen) => screen.dataset.page));
    let toastTimer = 0;
    let spinning = false;
    let notificationsEnabled = true;

    try {
      notificationsEnabled = window.localStorage.getItem('notificationsEnabled') !== 'false';
    } catch (_) {
      notificationsEnabled = true;
    }

    function showToast(message) {
      if (!toast) return;
      window.clearTimeout(toastTimer);
      toast.textContent = message;
      toast.classList.add('show');
      toastTimer = window.setTimeout(() => toast.classList.remove('show'), 1800);
    }

    function saveNotifications() {
      try {
        window.localStorage.setItem('notificationsEnabled', String(notificationsEnabled));
      } catch (_) {
        // Работа продолжается даже при недоступном localStorage.
      }
    }

    function renderPage(page) {
      const targetPage = validPages.has(page) ? page : 'home';

      screens.forEach((screen) => {
        const isActive = screen.dataset.page === targetPage;
        screen.hidden = !isActive;
        screen.classList.toggle('active', isActive);
        screen.setAttribute('aria-hidden', String(!isActive));
      });

      document.body.dataset.page = targetPage;
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }

    function setPage(page, replace = false) {
      const targetPage = validPages.has(page) ? page : 'home';
      renderPage(targetPage);

      const url = `${window.location.pathname}${window.location.search}#${targetPage}`;
      const state = { page: targetPage };

      try {
        if (replace) window.history.replaceState(state, '', url);
        else window.history.pushState(state, '', url);
      } catch (_) {
        window.location.hash = targetPage;
      }
    }

    function activate(button) {
      if (!button || button.disabled) return;

      if (button.hasAttribute('data-back')) {
        setPage('home');
        return;
      }

      if (button.dataset.go) {
        setPage(button.dataset.go);
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
          saveNotifications();
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

    document.querySelectorAll('.screen > img').forEach((image) => {
      image.addEventListener('error', () => {
        console.error(`Не удалось загрузить изображение: ${image.getAttribute('src')}`);
        showToast('Ошибка загрузки изображения');
      });
    });

    document.addEventListener('click', (event) => {
      const button = event.target.closest('.hotspot');
      if (!button) return;
      event.preventDefault();
      activate(button);
    });

    window.addEventListener('popstate', (event) => {
      renderPage(event.state?.page || window.location.hash.slice(1) || 'home');
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setPage('home');
    });

    setPage('home', true);
    document.documentElement.classList.add('app-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp, { once: true });
  } else {
    startApp();
  }
})();
