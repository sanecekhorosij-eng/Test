import { renderPages } from './pages/index.js';
import { initChestFeature } from './features/chest/chest-controller.js';

const app = document.getElementById('app');

if (!app) {
  throw new Error('Не найден корневой элемент приложения #app');
}

renderPages(app);

// Загружаем существующую общую логику после создания страниц.
await import('../app.js?v=15');

// Инициализируем независимые функциональные модули.
initChestFeature();
