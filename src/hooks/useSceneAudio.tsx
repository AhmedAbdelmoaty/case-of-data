import { useEffect, useRef } from "react";
import { useSound } from "./useSoundEffects";
import {
  getCachedFileAudio,
  playFileAudio,
  preloadFileAudio,
  preloadFileAudioList,
  stopFileAudio,
} from "@/lib/audio-file-cache";

/**
 * File-based scene audio manager.
 *
 * Rules enforced globally:
 *  - Only ONE ambience can play at a time.
 *  - Switching scenes immediately stops the previous ambience and resets currentTime to 0.
 *  - Ambiences loop automatically. One-shots never loop and self-clean.
 *  - Respects the global sound toggle from useSound().
 *  - Safely handles autoplay rejection promises.
 */

export type SceneAudioKey =
  | "hallway_footsteps"     // one-shot
  | "door_knock"            // one-shot
  | "car_traffic"           // loop
  | "storefront_street"     // loop
  | "store_interior"        // loop
  | "report_writing"        // loop
  | "keyboard_typing"       // loop
  | "phone_ringtone";       // loop

interface SceneSpec {
  src: string;
  loop: boolean;
  volume: number;
}

const SCENE_MAP: Record<SceneAudioKey, SceneSpec> = {
  hallway_footsteps:  { src: "/sounds/ambience_office_hallway_footsteps.mp3", loop: false, volume: 0.7 },
  door_knock:         { src: "/sounds/interaction_office_door_knock.mp3",     loop: false, volume: 0.95 },
  car_traffic:        { src: "/sounds/ambience_car_driving_traffic.mp3",      loop: true,  volume: 0.55 },
  storefront_street:  { src: "/sounds/ambience_storefront_street.mp3",        loop: true,  volume: 0.5 },
  store_interior:     { src: "/sounds/ambience_store_interior_light.mp3",     loop: true,  volume: 0.35 },
  report_writing:     { src: "/sounds/interaction_report_writing_paper.mp3",  loop: true,  volume: 0.55 },
  keyboard_typing:    { src: "/sounds/interaction_keyboard_typing.mp3",       loop: true,  volume: 0.55 },
  phone_ringtone:     { src: "/sounds/interaction_phone_ringtone.mp3",        loop: true,  volume: 0.7 },
};

// ============================================================
// Singleton audio manager — survives across React renders.
// ============================================================
class AudioManager {
  private currentAmbience: { key: SceneAudioKey; el: HTMLAudioElement } | null = null;
  private oneShots: Map<SceneAudioKey, HTMLAudioElement> = new Map();
  private muted = false;

  setMuted(muted: boolean) {
    this.muted = muted;
    if (muted) {
      this.stopAmbience();
      this.oneShots.forEach((a) => { try { a.pause(); a.currentTime = 0; } catch { /* noop */ } });
      this.oneShots.clear();
    }
  }

  private make(key: SceneAudioKey): HTMLAudioElement {
    const spec = SCENE_MAP[key];
    const el = getCachedFileAudio(spec.src) ?? new Audio(spec.src);
    el.preload = "auto";
    el.loop = spec.loop;
    el.volume = spec.volume;
    return el;
  }

  preload(key: SceneAudioKey) {
    preloadFileAudio(SCENE_MAP[key].src);
  }

  preloadMany(keys: SceneAudioKey[]) {
    preloadFileAudioList(keys.map((key) => SCENE_MAP[key].src));
  }

  playAmbience(key: SceneAudioKey) {
    if (this.muted) return;
    // Already playing this exact ambience? Do nothing.
    if (this.currentAmbience && this.currentAmbience.key === key) return;
    // Stop previous
    this.stopAmbience();
    const el = this.make(key);
    this.currentAmbience = { key, el };
    playFileAudio(el, { loop: true, volume: SCENE_MAP[key].volume });
  }

  stopAmbience() {
    if (!this.currentAmbience) return;
    const { el } = this.currentAmbience;
    stopFileAudio(el);
    this.currentAmbience = null;
  }

  /** Stop only if the currently-playing ambience matches key. */
  stopAmbienceIf(key: SceneAudioKey) {
    if (this.currentAmbience && this.currentAmbience.key === key) {
      this.stopAmbience();
    }
  }

  playOneShot(key: SceneAudioKey) {
    if (this.muted) return;
    // Replace any existing instance to enforce "no rapid double-trigger"
    const existing = this.oneShots.get(key);
    if (existing) {
      stopFileAudio(existing);
    }
    const el = this.make(key);
    el.loop = false;
    this.oneShots.set(key, el);
    el.addEventListener("ended", () => {
      if (this.oneShots.get(key) === el) this.oneShots.delete(key);
    }, { once: true });
    playFileAudio(el, { loop: false, volume: SCENE_MAP[key].volume });
  }

  stopOneShot(key: SceneAudioKey) {
    const el = this.oneShots.get(key);
    if (!el) return;
    stopFileAudio(el);
    this.oneShots.delete(key);
  }
}

const audioManager = new AudioManager();

// ============================================================
// React hooks
// ============================================================

/**
 * Plays the given ambience while mounted. Stops on unmount or scene change.
 * Pass `null` to play nothing.
 */
export const useSceneAmbience = (key: SceneAudioKey | null) => {
  const { isSoundEnabled } = useSound();

  // Keep the manager mute state in sync with the global toggle.
  useEffect(() => {
    audioManager.setMuted(!isSoundEnabled);
  }, [isSoundEnabled]);

  useEffect(() => {
    if (!key) return;
    if (!isSoundEnabled) return;
    audioManager.playAmbience(key);
    return () => {
      audioManager.stopAmbienceIf(key);
    };
  }, [key, isSoundEnabled]);
};

export const usePreloadSceneAudio = (keys: SceneAudioKey[]) => {
  useEffect(() => {
    audioManager.preloadMany(keys);
  }, [keys]);
};

/**
 * Plays a one-shot exactly once on mount (never loops, never repeats while mounted).
 * Stops the sound on unmount and resets currentTime to 0.
 */
export const useSceneOneShot = (key: SceneAudioKey | null, enabled: boolean = true) => {
  const { isSoundEnabled } = useSound();
  const playedRef = useRef(false);

  useEffect(() => {
    if (!key || !enabled || !isSoundEnabled) return;
    if (playedRef.current) return;
    playedRef.current = true;
    audioManager.playOneShot(key);
    return () => {
      audioManager.stopOneShot(key);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled, isSoundEnabled]);
};

/** Imperative trigger for click handlers (e.g. door-knock button). */
export const playSceneOneShot = (key: SceneAudioKey) => {
  audioManager.playOneShot(key);
};

export const preloadSceneAudio = (key: SceneAudioKey) => {
  audioManager.preload(key);
};

export const preloadSceneAudioList = (keys: SceneAudioKey[]) => {
  audioManager.preloadMany(keys);
};

export const stopSceneAmbience = () => audioManager.stopAmbience();
