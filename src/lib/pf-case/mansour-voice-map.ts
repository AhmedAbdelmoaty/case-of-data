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
      { start: 0.0, end: 4.98 },
      { start: 5.0, end: 10.02 },
      { start: 10.02, end: 18.01 },
      null, // detective
      { start: 18.01, end: 22.65 },
    ],
  },

  // MANSOUR_CALL_STRONG — 5 lines, line 2 is detective.
  callStrong: {
    audioSrc: "/voice/mansour_call_strong_full.wav",
    segments: [
      { start: 0.0, end: 5.26 },
      { start: 5.76, end: 17.24 },
      null, // detective
      { start: 17.24, end: 21.6 },
      { start: 21.6, end: 27.17 },
    ],
  },

  // MANSOUR_CALL_MEDIUM — 5 lines, line 1 is detective.
  callMedium: {
    audioSrc: "/voice/mansour_call_medium_full.wav",
    segments: [
      { start: 0.0, end: 11.76 },
      null, // detective
      { start: 11.76, end: 24.52 },
      { start: 24.52, end: 29.16 },
      { start: 29.56, end: 37.97 },
    ],
  },

  // MANSOUR_CALL_WEAK — 5 lines, line 1 is detective.
  callWeak: {
    audioSrc: "/voice/mansour_call_weak_full.wav",
    segments: [
      { start: 0.0, end: 6.2 },
      null, // detective
      { start: 6.2, end: 15.42 },
      { start: 15.42, end: 23.94 },
      { start: 23.94, end: 32.28 },
    ],
  },
};
