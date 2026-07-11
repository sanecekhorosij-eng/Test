let timerId = 0;

export function showToast(message, duration = 1800) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  window.clearTimeout(timerId);
  toast.textContent = message;
  toast.classList.add('show');
  timerId = window.setTimeout(() => toast.classList.remove('show'), duration);
}
