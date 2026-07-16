"use strict";

const departmentNames = {
  blueprints: "Отдел проектирования чертежей",
  administration: "Центральная администрация",
  inventions: "Лаборатория изобретений"
};

const notification = document.querySelector("#notification");
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

// Пока изображения отделов не добавлены в assets/images, остаются видны
// встроенные CSS-макеты. После загрузки PNG они заменятся автоматически.
document.querySelectorAll(".department__image").forEach((image) => {
  const hideMissingImage = () => {
    if (!image.naturalWidth) image.hidden = true;
  };

  image.addEventListener("error", hideMissingImage);

  if (image.complete) {
    hideMissingImage();
  }
});

document.addEventListener("click", (event) => {
  const departmentButton = event.target.closest("[data-department]");

  if (!departmentButton) return;

  const departmentName = departmentNames[departmentButton.dataset.department] ?? "Отдел";
  showNotification(`${departmentName}: раздел будет добавлен следующим этапом.`);
});
