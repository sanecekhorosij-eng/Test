import { showToast } from '../../shared/toast.js';

const AD_DURATION_MS = 1800;

export async function watchRewardedAd(button) {
  if (button) button.disabled = true;
  showToast('Реклама запускается…');

  await new Promise((resolve) => window.setTimeout(resolve, AD_DURATION_MS));

  showToast('Реклама просмотрена');
  if (button) button.disabled = false;
  return true;
}
