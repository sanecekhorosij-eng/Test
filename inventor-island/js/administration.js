"use strict";

const departments = {
  administration: {
    title: "Центральная администрация",
    description:
      "Центр управления островом и развития инфраструктуры."
  },

  blueprints: {
    title: "Отдел чертежей",
    description:
      "Проектирование зданий, механизмов и новых модулей."
  },

  inventions: {
    title: "Отдел изобретений",
    description:
      "Исследование технологий и создание экспериментальных устройств."
  }
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

const departmentButtons =
  document.querySelectorAll("[data-department]");

const pageButtons =
  document.querySelectorAll("[data-page]");

const utilityButtons =
  document.querySelectorAll("[data-utility]");

const departmentInfo =
  document.querySelector("#department-info");

const departmentTitle =
  document.querySelector("#department-title");

const departmentDescription =
  document.querySelector("#department-description");

const closeInfoButton =
  document.querySelector("#close-info");

const notification =
  document.querySelector("#notification");

let notificationTimer;

function showNotification(message) {
  if (!notification) return;

  window.clearTimeout(notificationTimer);

  notification.textContent = message;
  notification.classList.add("is-visible");

  notificationTimer = window.setTimeout(() => {
    notification.classList.remove("is-visible");
  }, 2400);
}

function clearDepartmentSelection() {
  departmentButtons.forEach((button) => {
    button.classList.remove("is-selected");
    button.setAttribute("aria-pressed", "false");
  });
}

departmentButtons.forEach((button) => {
  button.setAttribute("aria-pressed", "false");

  button.addEventListener("click", () => {
    const departmentId =
      button.dataset.department;

    const department =
      departments[departmentId];

    if (!department) return;

    clearDepartmentSelection();

    button.classList.add("is-selected");
    button.setAttribute("aria-pressed", "true");

    departmentTitle.textContent =
      department.title;

    departmentDescription.textContent =
      department.description;

    departmentInfo.hidden = false;

    showNotification(
      `${department.title}: объект выбран`
    );
  });
});

closeInfoButton.addEventListener("click", () => {
  departmentInfo.hidden = true;

  clearDepartmentSelection();
});

/*
  Эти страницы пока не существуют.
  Поэтому показываем сообщение вместо перехода на 404.
*/
pageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const pageId =
      button.dataset.page;

    const pageName =
      pageNames[pageId] ?? "Раздел";

    showNotification(
      `${pageName}: страницу подключим следующим этапом`
    );
  });
});

utilityButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const utilityId =
      button.dataset.utility;

    const utilityName =
      utilityNames[utilityId] ?? "Раздел";

    showNotification(
      `${utilityName}: раздел подключим позже`
    );
  });
});
