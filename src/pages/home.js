import { PAGE_BACKGROUNDS } from '../config/page-backgrounds.js';

export function createHomePage() {
  return `
    <section class="screen active" data-page="home" style="--ratio:1024/1536" aria-hidden="false">
      <img id="home-image" src="${PAGE_BACKGROUNDS.home}" alt="Главный экран космической станции" draggable="false" />
      <button type="button" class="hotspot settings" data-go="settings" aria-label="Настройки"></button>
      <button type="button" class="hotspot wheel" data-go="wheel" aria-label="Колесо фортуны"></button>
      <button type="button" class="hotspot chest" data-go="chest" aria-label="Сундук"></button>
      <output id="chest-timer" class="timer-badge chest-timer" aria-label="Таймер сундука"></output>
      <output id="wheel-timer" class="timer-badge wheel-timer" aria-label="Таймер колеса"></output>
      <button type="button" class="hotspot card collection" data-soon="Коллекция" aria-label="Коллекция"></button>
      <button type="button" class="hotspot card laboratory" data-soon="Лаборатория" aria-label="Лаборатория"></button>
      <button type="button" class="hotspot card mine" data-soon="Майн станция" aria-label="Майн станция"></button>
      <button type="button" class="hotspot card digs" data-soon="Раскопки" aria-label="Раскопки"></button>
    </section>`;
}
