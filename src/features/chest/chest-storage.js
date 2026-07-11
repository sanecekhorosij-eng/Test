import { CHEST_CONFIG } from './chest-config.js';

export function readChestReadyAt() {
  try {
    const value = Number(localStorage.getItem(CHEST_CONFIG.storageKey));
    return Number.isFinite(value) ? value : 0;
  } catch (_) {
    return 0;
  }
}

export function writeChestReadyAt(value) {
  try {
    localStorage.setItem(CHEST_CONFIG.storageKey, String(value));
  } catch (_) {
    // Сундук продолжает работать без сохранения между перезапусками.
  }
}
