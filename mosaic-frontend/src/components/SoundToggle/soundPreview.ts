// Plays the original sound alongside the tile preview, the same way the export
// will: from the start of each 15-second cycle, looping to fill it. One shared
// element, because phones only allow audio an element has been tapped to start.
const audio = new Audio();
audio.loop = true;

let isWanted = false;
let isAnimating = false;
let cycleStartedAt = 0;
let hiddenAt = 0;

const play = () => {
  audio.play().catch(() => {
    // blocked or interrupted; the next cycle or tap tries again
  });
};

const seekToCycle = () => {
  if (!Number.isFinite(audio.duration) || audio.duration === 0) return;
  audio.currentTime = ((performance.now() - cycleStartedAt) / 1000) % audio.duration;
};

// must run directly from a tap, or phones will refuse to start the sound
export const startSoundPreview = (url: string) => {
  isWanted = true;
  if (!audio.src.endsWith(url)) audio.src = url;
  if (audio.readyState >= 1) seekToCycle();
  else audio.addEventListener('loadedmetadata', seekToCycle, { once: true });
  play();
};

export const stopSoundPreview = () => {
  isWanted = false;
  audio.pause();
};

// the tiles stopped, for example during an export; the sound comes back with them
export const pauseSoundPreview = () => {
  isAnimating = false;
  audio.pause();
};

export const markCycleStart = () => {
  isAnimating = true;
  cycleStartedAt = performance.now();
  if (!isWanted) return;
  audio.currentTime = 0;
  play();
};

// the tile clock stops while the tab is hidden, so the sound stops with it and
// the cycle is shifted to pick up where they both left off
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    hiddenAt = performance.now();
    audio.pause();
  } else {
    cycleStartedAt += performance.now() - hiddenAt;
    if (isWanted && isAnimating) play();
  }
});
