"use strict";

/*
  Имя записи в памяти браузера.
  Здесь сохраняются улучшения шахты.
*/
const STORAGE_KEY = "inventor-island-mine";

/*
  Начальные параметры добычи.
*/
const defaultMineState = {
  details: {
    level: 1,
    rate: 32,
    rateStep: 16
  },

  crystals: {
    level: 1,
    rate: 16,
    rateStep: 8
  }
};

const productionNames = {
  details: "Добыча деталей",
  crystals: "Добыча кристаллов"
};

const pageNames = {
  inventions: "Изобретения",
  blueprints: "Чертежи",
  laboratory: "Лаборатория",
  collection: "Коллекция",
  achievements: "Достижения"
};

const utilityNames = {
  achievements: "Достижения",
  guide: "Справочник",
  settings: "Настройки"
};

const notification =
  document.querySelector("#notification");

let notificationTimer;

/*
  Создаёт независимую копию
  начального состояния шахты.
*/
function cloneDefaultState() {
  return JSON.parse(
    JSON.stringify(defaultMineState)
  );
}

/*
  Загружает сохранённые уровни
  и скорость добычи.
*/
function loadMineState() {
  try {
    const savedState = JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    );

    const state = cloneDefaultState();

    Object.keys(state).forEach((resource) => {
      const savedResource =
        savedState?.[resource];

      if (
        Number.isInteger(savedResource?.level) &&
        savedResource.level >= 1 &&
        Number.isFinite(savedResource?.rate) &&
        savedResource.rate > 0
      ) {
        state[resource].level =
          savedResource.level;

        state[resource].rate =
          savedResource.rate;
      }
    });

    return state;
  } catch {
    return cloneDefaultState();
  }
}

const mineState = loadMineState();

/*
  Сохраняет прогресс шахты.
*/
function saveMineState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(mineState)
    );
  } catch {
    /*
      Если память браузера недоступна,
      игра всё равно продолжит работать.
    */
  }
}

/*
  Обновляет значения на странице.
*/
function renderMineState() {
  Object.entries(mineState).forEach(
    ([resource, data]) => {
      const rateElement =
        document.querySelector(
          `[data-rate="${resource}"]`
        );

      const levelElement =
        document.querySelector(
          `[data-level="${resource}"]`
        );

      const upgradeButton =
        document.querySelector(
          `[data-upgrade="${resource}"]`
        );

      if (rateElement) {
        rateElement.textContent =
          data.rate;
      }

      if (levelElement) {
        levelElement.textContent =
          data.level;
      }

      if (upgradeButton) {
        const isMaximumLevel =
          data.level >= 5;

        upgradeButton.disabled =
          isMaximumLevel;

        upgradeButton.textContent =
          isMaximumLevel ? "✓" : "↑";
      }
    }
  );
}

/*
  Показывает всплывающее сообщение.
*/
function showNotification(message) {
  if (!notification) return;

  window.clearTimeout(
    notificationTimer
  );

  notification.textContent =
    message;

  notification.classList.add(
    "is-visible"
  );

  notificationTimer =
    window.setTimeout(() => {
      notification.classList.remove(
        "is-visible"
      );
    }, 2600);
}

/*
  Все нажатия на странице шахты.
*/
document.addEventListener(
  "click",
  (event) => {
    /*
      Нажатие на вход в шахту.
    */
    const entranceButton =
      event.target.closest(
        "[data-object='entrance']"
      );

    if (entranceButton) {
      showNotification(
        "Внутренние уровни шахты подключим следующим этапом"
      );

      return;
    }

    /*
      Улучшение производства.
    */
    const upgradeButton =
      event.target.closest(
        "[data-upgrade]"
      );

    if (upgradeButton) {
      const resource =
        upgradeButton.dataset.upgrade;

      const production =
        mineState[resource];

      if (!production) return;

      if (production.level >= 5) {
        showNotification(
          `${productionNames[resource]}: достигнут максимальный уровень`
        );

        return;
      }

      production.level += 1;

      production.rate +=
        production.rateStep;

      saveMineState();
      renderMineState();

      showNotification(
        `${productionNames[resource]} улучшена до уровня ${production.level}`
      );

      return;
    }

    /*
      Нажатие на установку.
    */
    const productionButton =
      event.target.closest(
        "[data-production]"
      );

    if (productionButton) {
      const resource =
        productionButton.dataset.production;

      const production =
        mineState[resource];

      if (!production) return;

      showNotification(
        `${productionNames[resource]}: ${production.rate}/час, уровень ${production.level}`
      );

      return;
    }

    /*
      Нижнее меню.
    */
    const pageButton =
      event.target.closest(
        "[data-page]"
      );

    if (pageButton) {
      const pageId =
        pageButton.dataset.page;

      const pageName =
        pageNames[pageId] ?? "Раздел";

      const message =
        pageId === "laboratory"
          ? "Вы уже находитесь в разделе «Лаборатория»"
          : `${pageName}: страницу подключим следующим этапом`;

      showNotification(message);

      return;
    }

    /*
      Верхние кнопки.
    */
    const utilityButton =
      event.target.closest(
        "[data-utility]"
      );

    if (utilityButton) {
      const utilityId =
        utilityButton.dataset.utility;

      const utilityName =
        utilityNames[utilityId] ??
        "Раздел";

      showNotification(
        `${utilityName}: раздел подключим позже`
      );
    }
  }
);

/*
  Первичное отображение значений.
*/
renderMineState();
