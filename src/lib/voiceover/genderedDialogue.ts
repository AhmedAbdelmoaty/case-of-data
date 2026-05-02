// ============================================================
// Gender-aware dialogue helper
// ------------------------------------------------------------
// PRINCIPLE: There is ONE script (the male/default text). For a
// female player we DO NOT swap the line for a different sentence —
// we only substitute specific gendered words inside the same line
// (e.g. "نوّرت" → "نورتي", "اتفضل" → "اتفضلي"). Neutral words like
// "يا فندم" are NEVER changed.
//
// AUDIO: For female we try `<basename>_female.wav`. If that exact
// path is in the allow-list of files we know exist on disk, we use
// it. Otherwise we fall back to the original (male) audio.
// ============================================================

export type Gender = "male" | "female";

// ------------------------------------------------------------
// Allow-list of female audio files that actually exist on disk.
// If a `_female.wav` path is NOT here, we fall back to male audio.
// ------------------------------------------------------------
const FEMALE_AUDIO_AVAILABLE: ReadonlySet<string> = new Set<string>([
  // Mansour — every line has a female version
  "/voiceover/mansour/mansour_intro_office_01_female.wav",
  "/voiceover/mansour/mansour_intro_office_02_female.wav",
  "/voiceover/mansour/mansour_intro_office_03_female.wav",
  "/voiceover/mansour/mansour_intro_office_04_female.wav",
  "/voiceover/mansour/mansour_call_strong_01_female.wav",
  "/voiceover/mansour/mansour_call_strong_02_female.wav",
  "/voiceover/mansour/mansour_call_strong_03_female.wav",
  "/voiceover/mansour/mansour_call_strong_04_female.wav",
  "/voiceover/mansour/mansour_call_medium_01_female.wav",
  "/voiceover/mansour/mansour_call_medium_02_female.wav",
  "/voiceover/mansour/mansour_call_medium_03_female.wav",
  "/voiceover/mansour/mansour_call_medium_04_female.wav",
  "/voiceover/mansour/mansour_call_weak_01_female.wav",
  "/voiceover/mansour/mansour_call_weak_02_female.wav",
  "/voiceover/mansour/mansour_call_weak_03_female.wav",
  "/voiceover/mansour/mansour_call_weak_04_female.wav",

  // Hisham — only some lines have female versions
  "/voiceover/hesham/hisham_arrival_01_welcome_female.wav",
  "/voiceover/hesham/hisham_arrival_02_problem_feeling_female.wav",
  "/voiceover/hesham/hisham_s3_correct_year_report_female.wav",
  "/voiceover/hesham/hisham_s4_correct_three_year_report_female.wav",
  "/voiceover/hesham/hisham_s4_wrong_competitor_prices_female.wav",
  "/voiceover/hesham/hisham_s5_correct_breakdown_female.wav",
  "/voiceover/hesham/hisham_s5_wrong_marketing_entry_female.wav",
  "/voiceover/hesham/hisham_track_a_01_team_performance_female.wav",
  "/voiceover/hesham/hisham_track_d_03_marketing_report_female.wav",
]);

const toFemaleCandidate = (maleSrc?: string): string | undefined => {
  if (!maleSrc || !maleSrc.endsWith(".wav")) return undefined;
  if (maleSrc.endsWith("_female.wav")) return maleSrc;
  return maleSrc.slice(0, -4) + "_female.wav";
};

export const getVoiceoverSrc = (
  maleSrc: string | undefined,
  gender: Gender | null | undefined
): string | undefined => {
  if (!maleSrc) return undefined;
  if (gender !== "female") return maleSrc;
  const candidate = toFemaleCandidate(maleSrc);
  if (candidate && FEMALE_AUDIO_AVAILABLE.has(candidate)) return candidate;
  return maleSrc;
};

// ============================================================
// Word-level female substitutions
// ------------------------------------------------------------
// Each entry = a SINGLE word (no spaces) that should be replaced
// with its female form when the player is female. Substitution is
// applied with Arabic-aware word boundaries so we don't touch
// substrings inside other words.
//
// IMPORTANT:
// - We never touch neutral phrases (e.g. "يا فندم" stays as-is).
// - We never rewrite full sentences.
// - If you need a new gendered word, add ONE entry here.
// ============================================================
// NOTE on ambiguity: words like "كنت" / "خد" / "روح" can refer to
// either the analyst (2nd person, should swap) or the speaker
// themselves (1st person, must NOT swap) — e.g. منصور saying
// "كنت متوقعه منك". To stay safe we ONLY swap words that are
// unambiguously addressing the listener (2nd-person colloquial
// forms ending in ت/تش, or imperatives that only make sense as
// commands to the listener). Anything ambiguous is left alone.
const FEMALE_WORD_MAP: Record<string, string> = {
  // ---- 2nd-person past-tense (ends in ت / تش — unambiguous "أنت") ----
  "نوّرت": "نوّرتي",
  "نورت": "نورتي",
  "رجعت": "رجعتي",
  "فهمت": "فهمتي",
  "وصلت": "وصلتي",
  "خدت": "خدتي",
  "خدتش": "خدتيش",
  "مخدتش": "مخدتيش",
  "جريت": "جريتي",
  "جريتش": "جريتيش",
  "لقيت": "لقيتي",
  "رجّعت": "رجّعتي",
  "مشيت": "مشيتي",
  "استعجلت": "استعجلتي",
  "دخلت": "دخلتي",
  "مسكت": "مسكتي",
  "مسكتش": "مسكتيش",
  "بنيت": "بنيتي",
  "بعتهولي": "بعتيهولي",
  "عملتها": "عملتيها",
  "فرّقتش": "فرّقتيش",
  "محسمتش": "محسمتيش",
  // ---- 2nd-person imperatives addressed to the analyst ----
  "اتفضل": "اتفضلي",
  "اقعد": "اقعدي",
  "ابعتلي": "ابعتيلي",
  "اعتبرها": "اعتبريها",
  "امسك": "امسكي",
  "كمل": "كمّلي",
  "ذاكري": "ذاكري", // already fem; harmless
  "ابقى": "ابقي",
  "كلّمني": "كلّميني",
  "طمّني": "طمّنيني",
  // ---- 2nd-person present (تـ... addressed to listener) ----
  "تحب": "تحبي",
  "تشرب": "تشربي",
  // ---- adjectives describing the listener ----
  "شايف": "شايفة",
  "محتاج": "محتاجة",
  // ---- pronouns / suffixes (always 2nd person) ----
  "إنت": "إنتي",
  "انت": "انتي",
  "معاك": "معاكي",
  "ليك": "ليكي",
  "بيك": "بيكي",
  "عليك": "عليكي",
  "خليك": "خليكي",
  "هديك": "هديكي",
};

/**
 * Apply word-level female substitutions to a male/default text.
 * Uses Arabic-aware boundaries: a "word" is a run of Arabic letters
 * + tatweel + diacritics. We only replace when the surrounding chars
 * are NOT Arabic letters (so "نورت" inside a longer word is safe).
 */
const ARABIC_LETTER = "[\\u0621-\\u064A\\u0670\\u0640]";
const NOT_ARABIC_LETTER = `(?:^|[^\\u0621-\\u064A\\u0670\\u0640])`;
const NOT_ARABIC_LETTER_AHEAD = `(?=$|[^\\u0621-\\u064A\\u0670\\u0640])`;

// Strip Arabic diacritics for matching robustness.
const stripDiacritics = (s: string): string =>
  s.replace(/[\u064B-\u0652\u0670]/g, "");

export const applyFemaleWordSwaps = (text: string): string => {
  if (!text) return text;
  let out = text;
  for (const [male, female] of Object.entries(FEMALE_WORD_MAP)) {
    // Build a regex that matches `male` as a standalone Arabic word.
    // We escape, then wrap with non-letter lookbehind/ahead.
    const escaped = male.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(${NOT_ARABIC_LETTER})(${escaped})${NOT_ARABIC_LETTER_AHEAD}`, "g");
    out = out.replace(re, (_m, pre) => `${pre}${female}`);

    // Also try a diacritic-insensitive pass: if the source has the
    // word with different/no diacritics, match the bare form too.
    const bareMale = stripDiacritics(male);
    if (bareMale !== male) {
      const escapedBare = bareMale.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const reBare = new RegExp(`(${NOT_ARABIC_LETTER})(${escapedBare})${NOT_ARABIC_LETTER_AHEAD}`, "g");
      out = out.replace(reBare, (_m, pre) => `${pre}${female}`);
    }
  }
  return out;
};

// Backwards-compat name (used by some screens). Now returns the
// word-swapped version of the original text instead of a different
// sentence. Returns undefined if no change happened so callers can
// keep the original reference.
export const getFemaleText = (maleText: string | undefined): string | undefined => {
  if (!maleText) return undefined;
  const swapped = applyFemaleWordSwaps(maleText);
  return swapped === maleText ? undefined : swapped;
};

// ------------------------------------------------------------
// Apply gender to a single dialogue line.
// Generic on T so callers keep their full line shape intact —
// we only override `text` and `audioSrc`.
// ------------------------------------------------------------
export interface GenderableLine {
  text: string;
  audioSrc?: string;
  characterId?: string;
}

export const applyGenderToLine = <T extends GenderableLine>(
  line: T,
  gender: Gender | null | undefined
): T => {
  if (gender !== "female") return line;

  const femaleAudio = getVoiceoverSrc(line.audioSrc, "female");
  const femaleText = applyFemaleWordSwaps(line.text);

  const textChanged = femaleText !== line.text;
  const audioChanged = femaleAudio !== line.audioSrc;

  if (!textChanged && !audioChanged) return line;

  return {
    ...line,
    text: textChanged ? femaleText : line.text,
    audioSrc: femaleAudio,
  };
};
