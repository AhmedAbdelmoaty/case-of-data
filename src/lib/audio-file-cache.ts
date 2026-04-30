const audioCache = new Map<string, HTMLAudioElement>();
const preloadLinks = new Set<string>();

const canUseAudio = () => typeof window !== "undefined" && typeof Audio !== "undefined";

const ensurePreloadLink = (src: string) => {
  if (typeof document === "undefined" || preloadLinks.has(src)) return;

  const existing = document.head.querySelector<HTMLLinkElement>(
    `link[rel="preload"][as="audio"][href="${src}"]`
  );

  if (!existing) {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "audio";
    link.href = src;
    document.head.appendChild(link);
  }

  preloadLinks.add(src);
};

export const getCachedFileAudio = (src: string) => {
  if (!canUseAudio()) return null;

  let audio = audioCache.get(src);
  if (!audio) {
    ensurePreloadLink(src);
    audio = new Audio(src);
    audio.preload = "auto";
    try {
      audio.load();
    } catch {
      /* noop */
    }
    audioCache.set(src, audio);
  }

  return audio;
};

export const preloadFileAudio = (src?: string | null) => {
  if (!src) return null;

  const audio = getCachedFileAudio(src);
  if (!audio) return null;

  ensurePreloadLink(src);
  audio.preload = "auto";
  try {
    audio.load();
  } catch {
    /* noop */
  }

  return audio;
};

export const preloadFileAudioList = (sources: Array<string | null | undefined>) => {
  const uniqueSources = [...new Set(sources.filter((src): src is string => Boolean(src)))];
  uniqueSources.forEach((src) => preloadFileAudio(src));
};

export const stopFileAudio = (audio?: HTMLAudioElement | null, reset = true) => {
  if (!audio) return;

  try {
    audio.pause();
    if (reset) audio.currentTime = 0;
  } catch {
    /* noop */
  }
};

export const playFileAudio = (
  audio: HTMLAudioElement | null | undefined,
  options?: {
    loop?: boolean;
    volume?: number;
    restart?: boolean;
  }
) => {
  if (!audio) return null;

  if (typeof options?.loop === "boolean") audio.loop = options.loop;
  if (typeof options?.volume === "number") audio.volume = options.volume;

  if (options?.restart !== false) {
    try {
      audio.currentTime = 0;
    } catch {
      /* noop */
    }
  }

  const playPromise = audio.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      /* autoplay blocked — ignore */
    });
  }

  return audio;
};