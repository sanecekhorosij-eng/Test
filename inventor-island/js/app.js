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

const notificationElement =
  document.getElementById("notification");

const buildingButtons =
  document.querySelectorAll("[data-building]");

const navigationButtons =
  document.querySelectorAll("[data-page]");

const actionButtons =
  document.querySelectorAll("[data-action]");

let notificationTimer = null;

function showNotification(message) {
  if (!notificationElement) {
    return;
  }

  notificationElement.textContent = message;
  notificationElement.classList.add("is-visible");

  window.clearTimeout(notificationTimer);

  notificationTimer = window.setTimeout(() => {
    notificationElement.classList.remove("is-visible");
  }, 2200);
}

function handleBuildingClick(event) {
  const button = event.currentTarget;
  const buildingId = button.dataset.building;
  const buildingName = buildingNames[buildingId] ?? "Здание";

  const isLocked = button.classList.contains("is-locked");

  if (isLocked) {
    showNotification(
      `${buildingName} пока недоступна. Требуется второй уровень.`
    );

    return;
  }

  showNotification(`Открываем здание: ${buildingName}`);
}

function handleNavigationClick(event) {
  const selectedButton = event.currentTarget;
  const pageId = selectedButton.dataset.page;
  const pageName = pageNames[pageId] ?? "Раздел";

  navigationButtons.forEach((button) => {
    button.classList.remove("is-active");
  });

  selectedButton.classList.add("is-active");

  showNotification(`Выбран раздел: ${pageName}`);
}

function handleActionClick(event) {
  const button = event.currentTarget;
  const actionId = button.dataset.action;
  const actionName = actionNames[actionId] ?? "Действие";

  showNotification(`Открываем: ${actionName}`);
}

buildingButtons.forEach((button) => {
  button.addEventListener("click", handleBuildingClick);
});

navigationButtons.forEach((button) => {
  button.addEventListener("click", handleNavigationClick);
});

actionButtons.forEach((button) => {
  button.addEventListener("click", handleActionClick);
});

showNotification("Добро пожаловать на Остров изобретателя!");
