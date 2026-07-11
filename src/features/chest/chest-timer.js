export function formatChestTime(ms) {
  if (ms <= 0) return 'ГОТОВО';
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
}

export function createChestTimer({ getReadyAt, onTick }) {
  let intervalId = 0;

  const tick = () => {
    const remaining = Math.max(0, getReadyAt() - Date.now());
    onTick({ remaining, ready: remaining <= 0, label: formatChestTime(remaining) });
  };

  return {
    start() {
      tick();
      intervalId = window.setInterval(tick, 1000);
    },
    stop() {
      window.clearInterval(intervalId);
    },
    refresh: tick
  };
}
