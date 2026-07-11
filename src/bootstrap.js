import { renderPages } from './pages/index.js';

const app = document.getElementById('app');

if (!app) {
  throw new Error('Не найден корневой элемент приложения #app');
}

renderPages(app);

// Загружаем существующую логику только после создания модулей страниц.
await import('../app.js?v=14');
