import { renderGenderText, type Gender, type GenderText } from "@/lib/genderText";

const FEMALE_AUDIO_AVAILABLE: ReadonlySet<string> = new Set<string>([
  "/voiceover/mansour/mansour_intro_office_01_female.wav",
  "/voiceover/mansour/mansour_intro_office_02_female.wav",
  "/voiceover/mansour/mansour_intro_office_03_female.wav",
  "/voiceover/mansour/mansour_intro_office_04_female.wav",
  "/voiceover/mansour/mansour_call_strong_01_female.wav",
  "/voiceover/mansour/mansour_call_strong_02_female.wav",
  "/voiceover/mansour/mansour_call_strong_03_female.wav",
  "/voiceover/mansour/mansour_call_strong_04_female.wav",
  "/voiceover/mansour/mansour_call_weak_01_female.wav",
  "/voiceover/mansour/mansour_call_weak_02_female.wav",
  "/voiceover/mansour/mansour_call_weak_03_female.wav",
  "/voiceover/mansour/mansour_call_weak_04_female.wav",

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

const ANALYST_FEMALE_AUDIO_OVERRIDES: Readonly<Record<string, string>> = {
  "/voiceover/analyst_male/analyst_a_team_performance.wav":
    "/voiceover/analyst_female/analyst_a_team_performance.wav",
};

const toFemaleCandidate = (maleSrc?: string): string | undefined => {
  if (!maleSrc || !maleSrc.endsWith(".wav")) return undefined;
  if (maleSrc.endsWith("_female.wav")) return maleSrc;
  return maleSrc.slice(0, -4) + "_female.wav";
};

const toAnalystFemaleCandidate = (maleSrc: string): string => {
  return ANALYST_FEMALE_AUDIO_OVERRIDES[maleSrc]
    ?? maleSrc.replace("/voiceover/analyst_male/", "/voiceover/analyst_female/").replace(/\.wav$/, "_female.wav");
};

export const getVoiceoverSrc = (
  maleSrc: string | undefined,
  gender: Gender | null | undefined,
): string | undefined => {
  if (!maleSrc) return undefined;
  if (gender !== "female") return maleSrc;

  if (maleSrc.includes("/voiceover/analyst_male/")) {
    return toAnalystFemaleCandidate(maleSrc);
  }

  const candidate = toFemaleCandidate(maleSrc);
  if (candidate && FEMALE_AUDIO_AVAILABLE.has(candidate)) return candidate;
  return maleSrc;
};

export interface GenderableLine {
  text: GenderText;
  audioSrc?: string;
  characterId?: string;
}

export const applyGenderToLine = <T extends GenderableLine>(
  line: T,
  gender: Gender | null | undefined,
): Omit<T, "text" | "audioSrc"> & { text: string; audioSrc?: string } => {
  const text = renderGenderText(line.text, gender);
  const audioSrc = getVoiceoverSrc(line.audioSrc, gender);
  return { ...line, text, audioSrc };
};
