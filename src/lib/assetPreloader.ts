type AssetProgress = {
  loaded: number;
  total: number;
  current?: string;
};

type PreloadOptions = {
  images?: Array<string | undefined | null>;
  audio?: Array<string | undefined | null>;
  timeoutMs?: number;
  onProgress?: (progress: AssetProgress) => void;
};

const imageCache = new Map<string, Promise<void>>();
const audioCache = new Map<string, HTMLAudioElement>();
const audioReadyCache = new Map<string, Promise<HTMLAudioElement>>();

const normalizeAssets = (items: Array<string | undefined | null> = []) =>
  [...new Set(items.filter((item): item is string => Boolean(item)))];

const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return new Promise((resolve) => {
    const timer = window.setTimeout(() => resolve(undefined as T), timeoutMs);
    promise
      .then((value) => resolve(value))
      .catch(() => resolve(undefined as T))
      .finally(() => window.clearTimeout(timer));
  });
};

export const preloadImage = (src: string, timeoutMs = 4500): Promise<void> => {
  const cached = imageCache.get(src);
  if (cached) return cached;

  const task = withTimeout(
    new Promise<void>((resolve) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = async () => {
        try {
          if ("decode" in img) await img.decode();
        } catch {
          /* The image is usable after onload even if decode rejects. */
        }
        resolve();
      };
      img.onerror = () => resolve();
      img.src = src;
    }),
    timeoutMs,
  );

  imageCache.set(src, task);
  return task;
};

export const getPreloadedAudio = (src: string): HTMLAudioElement => {
  let audio = audioCache.get(src);
  if (!audio) {
    audio = new Audio(src);
    audio.preload = "auto";
    audioCache.set(src, audio);
  }
  return audio;
};

export const preloadAudio = (src: string, timeoutMs = 3500): Promise<HTMLAudioElement> => {
  const cached = audioReadyCache.get(src);
  if (cached) return cached;

  const audio = getPreloadedAudio(src);
  const task = withTimeout(
    new Promise<HTMLAudioElement>((resolve) => {
      if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        resolve(audio);
        return;
      }

      const done = () => {
        cleanup();
        resolve(audio);
      };
      const cleanup = () => {
        audio.removeEventListener("canplaythrough", done);
        audio.removeEventListener("canplay", done);
        audio.removeEventListener("loadeddata", done);
        audio.removeEventListener("error", done);
      };

      audio.addEventListener("canplaythrough", done, { once: true });
      audio.addEventListener("canplay", done, { once: true });
      audio.addEventListener("loadeddata", done, { once: true });
      audio.addEventListener("error", done, { once: true });
      try {
        audio.load();
      } catch {
        done();
      }
    }),
    timeoutMs,
  );

  audioReadyCache.set(src, task);
  return task;
};

export const preloadAssets = async ({
  images = [],
  audio = [],
  timeoutMs,
  onProgress,
}: PreloadOptions): Promise<void> => {
  const imageList = normalizeAssets(images);
  const audioList = normalizeAssets(audio);
  const tasks = [
    ...imageList.map((src) => ({ type: "image" as const, src })),
    ...audioList.map((src) => ({ type: "audio" as const, src })),
  ];

  let loaded = 0;
  const total = tasks.length;
  onProgress?.({ loaded, total });
  if (!total) return;

  await Promise.all(
    tasks.map(async (asset) => {
      if (asset.type === "image") {
        await preloadImage(asset.src, timeoutMs);
      } else {
        await preloadAudio(asset.src, timeoutMs);
      }
      loaded += 1;
      onProgress?.({ loaded, total, current: asset.src });
    }),
  );
};

export const warmAudioUnlock = () => {
  audioCache.forEach((audio) => {
    try {
      audio.load();
    } catch {
      /* noop */
    }
  });
};

export const hasImageStartedLoading = (src: string) => imageCache.has(src);
