export function createWheelPage() {
  return `
    <section class="screen" data-page="wheel" style="--ratio:991/1500" hidden aria-hidden="true">
      <img src="assets/IMG_1797.jpeg?v=13" alt="Колесо фортуны" draggable="false" />
      <div id="wheel-rotor" class="wheel-rotor" aria-hidden="true"></div>
      <div class="wheel-pointer" aria-hidden="true"></div>
      <button type="button" class="hotspot back" data-back aria-label="Назад"></button>
      <button type="button" class="hotspot spin" data-action="spin-wheel" aria-label="Крутить колесо"></button>
      <button type="button" class="hotspot watch" data-action="watch-video" aria-label="Смотреть видео"></button>
    </section>`;
}
