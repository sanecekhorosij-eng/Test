export function createChestPage() {
  return `
    <section class="screen" data-page="chest" style="--ratio:960/1639" hidden aria-hidden="true">
      <img src="assets/IMG_1813.jpeg?v=13" alt="Экран сундука" draggable="false" />
      <div id="chest-flash" class="chest-flash" aria-hidden="true"></div>
      <button type="button" class="hotspot back" data-back aria-label="Назад"></button>
      <button type="button" class="hotspot chest-open" data-action="open-chest" aria-label="Открыть сундук сейчас"></button>
    </section>`;
}
