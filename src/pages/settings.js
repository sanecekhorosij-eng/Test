import { PAGE_BACKGROUNDS } from '../config/page-backgrounds.js';

export function createSettingsPage() {
  return `
    <section class="screen" data-page="settings" style="--ratio:960/2048" hidden aria-hidden="true">
      <img src="${PAGE_BACKGROUNDS.settings}" alt="Настройки" draggable="false" />
      <button type="button" class="hotspot back" data-back aria-label="Назад"></button>
      <button type="button" class="hotspot setting-row account" data-setting="Аккаунт" aria-label="Аккаунт"></button>
      <button type="button" class="hotspot setting-row sound" data-setting="Звук" aria-label="Звук"></button>
      <button type="button" class="hotspot setting-row language" data-setting="Язык" aria-label="Язык"></button>
      <button type="button" class="hotspot setting-row notifications" data-action="toggle-notifications" aria-label="Уведомления"></button>
      <button type="button" class="hotspot setting-row support" data-setting="Поддержка" aria-label="Поддержка"></button>
    </section>`;
}
