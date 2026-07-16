"use strict";

const buildingNames = {
  generator: "Генератор",
  mine: "Шахта",
  workshop: "Мастерская",
  administration: "Администрация",
  laboratory: "Лаборатория"
};

const pageNames = {
  island: "Остров",
  inventions: "Изобретения",
  blueprints: "Чертежи",
  collection: "Коллекция",
  achievements: "Достижения"
};

const actionNames = {
  achievements: "Достижения",
  journal: "Журнал",
  settings: "Настройки"
};

const notification = document.querySelector("#notification");
const navigationButtons = document.querySelectorAll("[data-page]");
let notificationTimer;

function showNotification(message) {
  if (!notification) return;

  window.clearTimeout(notificationTimer);
  notification.textContent = message;
  notification.classList.add("is-visible");

  notificationTimer = window.setTimeout(() => {
    notification.classList.remove("is-visible");
  }, 2200);
}

document.addEventListener("click", (event) => {
  const buildingButton = event.target.closest("[data-building]");

  if (buildingButton) {
    const name = buildingNames[buildingButton.dataset.building] ?? "Здание";
    const message = buildingButton.dataset.locked === "true"
      ? `${name}: требуется второй уровень.`
      : `Открываем здание: ${name}`;

    showNotification(message);
    return;
  }

  const navigationButton = event.target.closest("[data-page]");

  if (navigationButton) {
    navigationButtons.forEach((button) => button.classList.remove("is-active"));
    navigationButton.classList.add("is-active");

    const pageName = pageNames[navigationButton.dataset.page] ?? "Раздел";
    showNotification(`Выбран раздел: ${pageName}`);
    return;
  }

  const actionButton = event.target.closest("[data-action]");

  if (actionButton) {
    const actionName = actionNames[actionButton.dataset.action] ?? "Действие";
    showNotification(`Открываем: ${actionName}`);
  }
});
