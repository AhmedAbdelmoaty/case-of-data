/**
 * Lightweight audio preloader / cache.
 * Returns reusable HTMLAudioElement instances keyed by src.
 */

const audioCache = new Map<string, HTMLAudioElement>();

export const getPreloadedAudio = (src: string): HTMLAudioElement => {
  let el = audioCache.get(src);
  if (!el) {
    el = new Audio(src);
    el.preload = "auto";
    audioCache.set(src, el);
  }
  return el;
};

export const preloadAudio = (src: string, timeoutMs: number = 2000): Promise<void> => {
  return new Promise((resolve, reject) => {
    const el = getPreloadedAudio(src);
    if (el.readyState >= 3) {
      resolve();
      return;
    }
    const timer = window.setTimeout(() => {
      cleanup();
      resolve();
    }, timeoutMs);
    const onReady = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error(`Failed to preload ${src}`));
    };
    const cleanup = () => {
      window.clearTimeout(timer);
      el.removeEventListener("canplaythrough", onReady);
      el.removeEventListener("loadeddata", onReady);
      el.removeEventListener("error", onError);
    };
    el.addEventListener("canplaythrough", onReady, { once: true });
    el.addEventListener("loadeddata", onReady, { once: true });
    el.addEventListener("error", onError, { once: true });
    try {
      el.load();
    } catch {
      /* noop */
    }
  });
};

let unlocked = false;
export const warmAudioUnlock = (): void => {
  if (unlocked) return;
  unlocked = true;
  try {
    const el = new Audio();
    el.muted = true;
    const p = el.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
        try {
          el.pause();
        } catch {
          /* noop */
        }
      }).catch(() => {
        /* autoplay blocked — ignore */
      });
    }
  } catch {
    /* noop */
  }
};
