"use strict";

/*
  Если изображения были заменены, увеличьте это число:
  Увеличьте значение, чтобы браузер загрузил свежие файлы.
*/
const ASSET_VERSION = "5";

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
  island: "Остров",
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

/*
  Показывает небольшое сообщение на странице.
*/
function showNotification(message) {
  if (!notification) return;

  window.clearTimeout(notificationTimer);

  notification.textContent = message;
  notification.classList.add("is-visible");

  notificationTimer = window.setTimeout(() => {
    notification.classList.remove("is-visible");
  }, 2800);
}

/*
  Надёжная загрузка изображений.

  Обработчики load и error подключаются до установки src.
  Версия в адресе заставляет Safari и GitHub Pages
  запросить свежую версию изображения.
*/
function loadSceneAssets() {
  const images =
    document.querySelectorAll("[data-asset]");

  images.forEach((image) => {
    const source = image.dataset.src;

    if (!source) return;

    image.addEventListener(
      "load",
      () => {
        image.classList.remove("is-error");
        image.classList.add("is-loaded");
      },
      { once: true }
    );

    image.addEventListener(
      "error",
      () => {
        image.classList.remove("is-loaded");
        image.classList.add("is-error");

        const fileName =
          source.split("/").pop();

        showNotification(
          `Не удалось загрузить: ${fileName}`
        );
      },
      { once: true }
    );

    const imageUrl =
      new URL(source, document.baseURI);

    imageUrl.searchParams.set(
      "v",
      ASSET_VERSION
    );

    image.src = imageUrl.href;
  });
}

/*
  Снимает выделение со всех зданий.
*/
function clearDepartmentSelection() {
  departmentButtons.forEach((button) => {
    button.classList.remove("is-selected");
    button.setAttribute(
      "aria-pressed",
      "false"
    );
  });
}

/*
  Нажатия на здания.
*/
departmentButtons.forEach((button) => {
  button.setAttribute(
    "aria-pressed",
    "false"
  );

  button.addEventListener("click", () => {
    const departmentId =
      button.dataset.department;

    const department =
      departments[departmentId];

    if (!department) return;

    clearDepartmentSelection();

    button.classList.add("is-selected");

    button.setAttribute(
      "aria-pressed",
      "true"
    );

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

/*
  Закрытие карточки здания.
*/
if (closeInfoButton) {
  closeInfoButton.addEventListener(
    "click",
    () => {
      departmentInfo.hidden = true;

      clearDepartmentSelection();
    }
  );
}

/*
  Нижние разделы пока показывают сообщение.
*/
pageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const pageId =
      button.dataset.page;

    const pageName =
      pageNames[pageId] ?? "Раздел";

    const message = pageId === "island"
      ? "Вы уже находитесь в разделе «Остров»"
      : `${pageName}: страницу подключим следующим этапом`;

    showNotification(message);
  });
});

/*
  Верхние служебные кнопки.
*/
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

/*
  Запускаем загрузку всех изображений.
*/
loadSceneAssets();
