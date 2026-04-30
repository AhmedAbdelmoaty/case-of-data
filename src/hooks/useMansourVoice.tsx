import { useCallback, useEffect, useRef } from "react";
import { useSound } from "@/hooks/useSoundEffects";
import {
  MANSOUR_VOICE,
  type MansourVoiceKey,
} from "@/lib/pf-case/mansour-voice-map";

/**
 * Plays the matching segment of Mansour's continuous voice-over file
 * for the currently displayed dialogue line.
 *
 * - One <audio> element per scene (lazy created, reused across line changes).
 * - When `lineIndex` changes: stop current playback, then if the new line's
 *   segment is non-null, seek to `start` and play until `end`.
 * - Detective/player lines (segment === null) play nothing.
 * - Respects the global sound-effects toggle from useSoundEffects.
 * - Cleans up on unmount.
 */
export const useMansourVoice = (
  scriptKey: MansourVoiceKey,
  lineIndex: number,
  isActive: boolean = true,
) => {
  const { isSoundEnabled } = useSound();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const playbackTokenRef = useRef(0);

  const stop = useCallback(() => {
    playbackTokenRef.current += 1;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    const audio = audioRef.current;
    if (!audio) return;

    try {
      audio.pause();
      audio.currentTime = 0;
    } catch {
      /* ignore */
    }
  }, []);

  // Lazy-create the audio element for this scene.
  useEffect(() => {
    const script = MANSOUR_VOICE[scriptKey];
    const el = new Audio(script.audioSrc);
    el.preload = "auto";
    el.muted = !isSoundEnabled;
    audioRef.current = el;

    return () => {
      stop();
      audioRef.current = null;
    };
  }, [isSoundEnabled, scriptKey, stop]);

  // Mirror sound-toggle changes onto the live element.
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = !isSoundEnabled;
  }, [isSoundEnabled]);

  // React to line changes: stop, then maybe play the matching segment.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const playbackToken = playbackTokenRef.current + 1;
    playbackTokenRef.current = playbackToken;

    // Always stop any in-flight playback first — never overlap.
    stop();
    playbackTokenRef.current = playbackToken;

    if (!isActive) return;

    const script = MANSOUR_VOICE[scriptKey];
    const segment = script.segments[lineIndex];
    if (!segment) return; // detective / player line — silence

    audio.muted = !isSoundEnabled;

    const startPlayback = () => {
      if (playbackTokenRef.current !== playbackToken) return;

      try {
        audio.currentTime = segment.start;
      } catch {
        /* seeking before metadata loaded — will be retried via canplay */
      }

      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch(() => {
          /* autoplay blocked or interrupted — stay silent */
        });
      }

      // Stop precisely at segment.end via rAF (more accurate than setTimeout).
      const tick = () => {
        if (!audioRef.current) return;
        if (playbackTokenRef.current !== playbackToken) return;

        if (audioRef.current.currentTime >= segment.end || audioRef.current.paused) {
          try {
            audioRef.current.pause();
          } catch {
            /* ignore */
          }
          rafRef.current = null;
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    if (audio.readyState >= 1 /* HAVE_METADATA */) {
      startPlayback();
    } else {
      const onReady = () => {
        audio.removeEventListener("loadedmetadata", onReady);
        startPlayback();
      };
      audio.addEventListener("loadedmetadata", onReady);

      return () => {
        audio.removeEventListener("loadedmetadata", onReady);
      };
    }

    return undefined;
  }, [scriptKey, lineIndex, isActive, isSoundEnabled, stop]);

  return { stop };
};
