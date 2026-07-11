import { PAGE_BACKGROUNDS } from '../config/page-backgrounds.js';
import { CHEST_CONFIG } from '../features/chest/chest-config.js';

export function createChestPage() {
  return `
    <section class="screen chest-screen" data-page="chest" style="--ratio:960/1639" hidden aria-hidden="true">
      <img src="${PAGE_BACKGROUNDS.chest}" alt="Экран сундука" draggable="false" />
      <div class="chest-overlay" aria-hidden="true"></div>

      <button type="button" class="hotspot back" data-back aria-label="Назад"></button>

      <div class="chest-status-panel">
        <div class="chest-wallet">💎 <span id="chest-crystal-balance">0</span></div>
        <div id="chest-page-timer" class="chest-page-timer">Следующий сундук: 00:00:00</div>
      </div>

      <div id="animated-chest" class="animated-chest" aria-label="Сундук с наградой">
        <div class="chest-glow"></div>
        <div class="chest-lid-part"></div>
        <div class="chest-base-part"></div>
      </div>

      <button id="chest-free-button" class="chest-action-button chest-free-button" type="button" hidden>
        Бесплатно
      </button>

      <button id="chest-paid-button" class="chest-action-button chest-paid-button" type="button">
        Открыть сейчас — ${CHEST_CONFIG.paidOpenCost} 💎
      </button>

      <button id="chest-reward" class="chest-reward" type="button" hidden aria-label="Забрать награду">
        <span id="chest-reward-icon" class="chest-reward-icon">🎁</span>
        <strong id="chest-reward-text">Награда</strong>
        <small>Нажмите, чтобы забрать</small>
      </button>
    </section>`;
}
