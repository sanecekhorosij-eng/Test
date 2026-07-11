(() => {
  const screens = [...document.querySelectorAll('.screen')];
  const toast = document.getElementById('toast');
  let toastTimer;
  let notificationsEnabled = true;

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  function goTo(page) {
    const target = screens.find((screen) => screen.dataset.page === page);
    if (!target) {
      showToast('Экран пока недоступен');
      return;
    }
    screens.forEach((screen) => screen.classList.toggle('active', screen === target));
    history.replaceState({ page }, '', `#${page}`);
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    if (button.dataset.go) {
      goTo(button.dataset.go);
      return;
    }

    if (button.dataset.soon) {
      showToast(`${button.dataset.soon}: раздел в разработке`);
      return;
    }

    if (button.dataset.setting) {
      showToast(`${button.dataset.setting}: настройка будет добавлена позже`);
      return;
    }

    switch (button.dataset.action) {
      case 'toggle-notifications':
        notificationsEnabled = !notificationsEnabled;
        showToast(`Уведомления ${notificationsEnabled ? 'включены' : 'выключены'}`);
        break;
      case 'open-chest':
        showToast('Для открытия сундука нужно 30 кристаллов');
        break;
      case 'spin-wheel':
        showToast('Следующая бесплатная попытка через 23:59:59');
        break;
      case 'watch-video':
        showToast('Видео-награда будет подключена позже');
        break;
      default:
        break;
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') goTo('home');
  });

  const initial = location.hash.replace('#', '');
  goTo(screens.some((screen) => screen.dataset.page === initial) ? initial : 'home');
})();
