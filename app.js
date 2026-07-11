(() => {
  'use strict';

  function startApp() {
    const screens = Array.from(document.querySelectorAll('.screen'));
    const toast = document.getElementById('toast');
    const validPages = new Set(screens.map((screen) => screen.dataset.page));
    const wheelRotor = document.getElementById('wheel-rotor');
    const chestFlash = document.getElementById('chest-flash');
    const wheelTimer = document.getElementById('wheel-timer');
    const chestTimer = document.getElementById('chest-timer');
    const rewardModal = document.getElementById('reward-modal');
    const rewardIcon = document.getElementById('reward-icon');
    const rewardText = document.getElementById('reward-text');
    const rewardClose = document.getElementById('reward-close');

    const WHEEL_COOLDOWN_MS = 2 * 60 * 1000;
    const CHEST_COOLDOWN_MS = 60 * 1000;
    const rewards = [
      { icon: '💎', text: '25 кристаллов', value: 25 },
      { icon: '🪙', text: '500 монет', value: 500 },
      { icon: '⚡️', text: '10 энергии', value: 10 },
      { icon: '🎁', text: 'Редкий контейнер', value: 1 },
      { icon: '💎', text: '50 кристаллов', value: 50 },
      { icon: '🧬', text: '3 фрагмента', value: 3 }
    ];

    let toastTimerId = 0;
    let spinning = false;
    let openingChest = false;
    let notificationsEnabled = true;
    let wheelReadyAt = readNumber('wheelReadyAt');
    let chestReadyAt = readNumber('chestReadyAt');

    try {
      notificationsEnabled = window.localStorage.getItem('notificationsEnabled') !== 'false';
    } catch (_) {
      notificationsEnabled = true;
    }

    function readNumber(key) {
      try {
        const value = Number(window.localStorage.getItem(key));
        return Number.isFinite(value) ? value : 0;
      } catch (_) {
        return 0;
      }
    }

    function saveNumber(key, value) {
      try {
        window.localStorage.setItem(key, String(value));
      } catch (_) {
        // Приложение работает и без localStorage.
      }
    }

    function showToast(message) {
      if (!toast) return;
      window.clearTimeout(toastTimerId);
      toast.textContent = message;
      toast.classList.add('show');
      toastTimerId = window.setTimeout(() => toast.classList.remove('show'), 1800);
    }

    function saveNotifications() {
      try {
        window.localStorage.setItem('notificationsEnabled', String(notificationsEnabled));
      } catch (_) {
        // Работа продолжается даже при недоступном localStorage.
      }
    }

    function formatRemaining(ms) {
      if (ms <= 0) return 'ГОТОВО';
      const totalSeconds = Math.ceil(ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function updateTimers() {
      const now = Date.now();
      const wheelRemaining = wheelReadyAt - now;
      const chestRemaining = chestReadyAt - now;

      if (wheelTimer) {
        wheelTimer.textContent = formatRemaining(wheelRemaining);
        wheelTimer.classList.toggle('ready', wheelRemaining <= 0);
      }

      if (chestTimer) {
        chestTimer.textContent = formatRemaining(chestRemaining);
        chestTimer.classList.toggle('ready', chestRemaining <= 0);
      }
    }

    function showReward(reward) {
      if (!rewardModal || !rewardIcon || !rewardText) return;
      rewardIcon.textContent = reward.icon;
      rewardText.textContent = reward.text;
      rewardModal.hidden = false;
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

    function spinWheel(button) {
      const remaining = wheelReadyAt - Date.now();
      if (remaining > 0) {
        showToast(`Колесо будет готово через ${formatRemaining(remaining)}`);
        return;
      }
      if (spinning) return;

      spinning = true;
      button.disabled = true;
      wheelRotor?.classList.remove('spinning');
      void wheelRotor?.offsetWidth;
      wheelRotor?.classList.add('spinning');
      showToast('Колесо запущено!');

      window.setTimeout(() => {
        const reward = rewards[Math.floor(Math.random() * rewards.length)];
        spinning = false;
        button.disabled = false;
        wheelRotor?.classList.remove('spinning');
        wheelReadyAt = Date.now() + WHEEL_COOLDOWN_MS;
        saveNumber('wheelReadyAt', wheelReadyAt);
        updateTimers();
        showReward(reward);
      }, 3050);
    }

    function openChest(button) {
      const remaining = chestReadyAt - Date.now();
      if (remaining > 0) {
        showToast(`Сундук будет готов через ${formatRemaining(remaining)}`);
        return;
      }
      if (openingChest) return;

      openingChest = true;
      button.disabled = true;
      chestFlash?.classList.remove('opening');
      void chestFlash?.offsetWidth;
      chestFlash?.classList.add('opening');
      showToast('Сундук открывается…');

      window.setTimeout(() => {
        const chestRewards = [
          { icon: '💎', text: '30 кристаллов' },
          { icon: '🪙', text: '750 монет' },
          { icon: '🎁', text: 'Эпический контейнер' }
        ];
        const reward = chestRewards[Math.floor(Math.random() * chestRewards.length)];
        openingChest = false;
        button.disabled = false;
        chestFlash?.classList.remove('opening');
        chestReadyAt = Date.now() + CHEST_COOLDOWN_MS;
        saveNumber('chestReadyAt', chestReadyAt);
        updateTimers();
        showReward(reward);
      }, 1250);
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
          openChest(button);
          break;
        case 'spin-wheel':
          spinWheel(button);
          break;
        case 'watch-video':
          wheelReadyAt = 0;
          saveNumber('wheelReadyAt', 0);
          updateTimers();
          showToast('Дополнительная попытка получена');
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

    rewardClose?.addEventListener('click', () => {
      rewardModal.hidden = true;
    });

    window.addEventListener('popstate', (event) => {
      renderPage(event.state?.page || window.location.hash.slice(1) || 'home');
    });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (rewardModal && !rewardModal.hidden) rewardModal.hidden = true;
        else setPage('home');
      }
    });

    updateTimers();
    window.setInterval(updateTimers, 1000);
    setPage('home', true);
    document.documentElement.classList.add('app-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp, { once: true });
  } else {
    startApp();
  }
})();
