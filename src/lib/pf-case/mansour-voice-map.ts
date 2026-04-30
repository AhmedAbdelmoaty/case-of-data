// Mansour voice-over mapping.
// Each entry corresponds to the SAME index in the matching dialogue script
// (MANSOUR_INTRO_DIALOGUES, MANSOUR_CALL_STRONG, MANSOUR_CALL_MEDIUM, MANSOUR_CALL_WEAK).
// `null` means the line is NOT spoken by Mansour (e.g. detective/player) — no audio plays.
//
// Timestamps were derived via ffmpeg silencedetect (noise=-32dB, d=0.35s) on the
// full continuous voice-over files. Adjust ±0.1-0.3s here if a boundary feels off.

export interface VoiceSegment {
  start: number;
  end: number;
}

export interface VoiceScript {
  audioSrc: string;
  // One entry per dialogue line, in script order. null = not Mansour.
  segments: Array<VoiceSegment | null>;
}

export type MansourVoiceKey = "intro" | "callStrong" | "callMedium" | "callWeak";

export const MANSOUR_VOICE: Record<MansourVoiceKey, VoiceScript> = {
  // MANSOUR_INTRO_DIALOGUES — 5 lines, line 3 is detective.
  intro: {
    audioSrc: "/voice/mansour_intro_office_full.wav",
    segments: [
      { start: 0.0, end: 4.42 },
      { start: 5.11, end: 9.49 },
      { start: 10.18, end: 15.36 },
      null, // detective
      { start: 15.88, end: 22.65 },
    ],
  },

  // MANSOUR_CALL_STRONG — 5 lines, line 2 is detective.
  callStrong: {
    audioSrc: "/voice/mansour_call_strong_full.wav",
    segments: [
      { start: 0.0, end: 4.97 },
      { start: 5.92, end: 17.01 },
      null, // detective
      { start: 17.46, end: 21.29 },
      { start: 21.86, end: 27.17 },
    ],
  },

  // MANSOUR_CALL_MEDIUM — 5 lines, line 1 is detective.
  callMedium: {
    audioSrc: "/voice/mansour_call_medium_full.wav",
    segments: [
      { start: 0.0, end: 8.85 },
      null, // detective
      { start: 9.22, end: 24.29 },
      { start: 25.23, end: 32.87 },
      { start: 33.31, end: 37.97 },
    ],
  },

  // MANSOUR_CALL_WEAK — 5 lines, line 1 is detective.
  callWeak: {
    audioSrc: "/voice/mansour_call_weak_full.wav",
    segments: [
      { start: 0.0, end: 5.95 },
      null, // detective
      { start: 6.35, end: 20.91 },
      { start: 21.4, end: 26.67 },
      { start: 27.06, end: 32.28 },
    ],
  },
};
