import { createHomePage } from './home.js';
import { createChestPage } from './chest.js';
import { createWheelPage } from './wheel.js';
import { createSettingsPage } from './settings.js';

const pageFactories = [
  createHomePage,
  createChestPage,
  createWheelPage,
  createSettingsPage
];

export function renderPages(container) {
  container.innerHTML = pageFactories.map((createPage) => createPage()).join('');
}
