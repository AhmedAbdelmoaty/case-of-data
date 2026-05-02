// ============================================================
// Gender-aware dialogue helper
// ------------------------------------------------------------
// MALE: returns the line completely unchanged (text + audioSrc).
// FEMALE:
//   - text: swapped to female variant ONLY if explicitly mapped.
//           Otherwise the original text is kept (we never blindly
//           rewrite neutral lines).
//   - audioSrc: tries `<basename>_female.wav`. Used ONLY if that
//           exact path is in the allow-list of files we know exist
//           on disk. Otherwise the original (male) audio is kept.
//           We never request a non-existent file.
// ============================================================

export type Gender = "male" | "female";

// ------------------------------------------------------------
// Allow-list of female audio files that actually exist on disk
// (verified against /public/voiceover/...).
// If a `_female.wav` path is NOT in this set, we fall back to
// the original male audio.
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

/**
 * Compute the candidate female audio path for a male source path.
 * `/voiceover/x/foo.wav` → `/voiceover/x/foo_female.wav`
 * Returns undefined if the input doesn't end in `.wav` or is missing.
 */
const toFemaleCandidate = (maleSrc?: string): string | undefined => {
  if (!maleSrc || !maleSrc.endsWith(".wav")) return undefined;
  if (maleSrc.endsWith("_female.wav")) return maleSrc; // already female
  return maleSrc.slice(0, -4) + "_female.wav";
};

/**
 * Resolve the audio src for a given gender.
 * - male / undefined → original
 * - female → female variant if it exists in the allow-list, else original
 */
export const getVoiceoverSrc = (maleSrc: string | undefined, gender: Gender | null | undefined): string | undefined => {
  if (!maleSrc) return undefined;
  if (gender !== "female") return maleSrc;
  const candidate = toFemaleCandidate(maleSrc);
  if (candidate && FEMALE_AUDIO_AVAILABLE.has(candidate)) return candidate;
  return maleSrc;
};

// ------------------------------------------------------------
// Female text variants
// ------------------------------------------------------------
// Keys are the EXACT male text from the script files. Only lines
// that contain direct masculine address to the analyst are listed.
// Neutral lines are intentionally absent and remain unchanged.
//
// Whitespace is normalized for matching (collapse runs of spaces +
// trim) so accidental leading/trailing spaces in the source don't
// break the lookup.
// ------------------------------------------------------------
const normalize = (s: string): string => s.replace(/\s+/g, " ").trim();

const RAW_FEMALE_TEXT_MAP: Record<string, string> = {
  // ---------------- HISHAM_GREETING ----------------
  "أهلاً وسهلاً يا فندم، نوّرت. اتفضل اقعد، تحب تشرب حاجة؟":
    "أهلاً وسهلاً يا فندمة، نوّرتي. اتفضلي اقعدي، تحبي تشربي حاجة؟",

  // ---------------- MANSOUR_INTRO_DIALOGUES ----------------
  "أهلاً، اتفضل اقعد. عندنا استشارة جديدة محتاجة تركيز.": "أهلاً، اتفضلي اقعدي. عندنا استشارة جديدة محتاجة تركيز.",
  "عايزك تروح تقعد معاه، وتسأل صح وتفهم المشكلة بشكل كامل.":
    "عايزك تروحي تقعدي معاه، وتسألي صح وتفهمي المشكلة بشكل كامل.",
  "تمام، يلا بالتوفيق. خلّص وابعتلي تقرير كامل باللي وصلتله.":
    "تمام، يلا بالتوفيق. خلّصي وابعتيلي تقرير كامل باللي وصلتيله.",

  // ---------------- MANSOUR_DEBRIEF_STRONG ----------------
  "أهلاً… رجعت. ها، فهمت الصورة ولا لسه؟": "أهلاً… رجعتي. ها، فهمتي الصورة ولا لسه؟",
  "ممتاز. دي بالضبط النقطة. إنت ما خدتش وصف العميل للمشكلة كأنه الحقيقة، وما جريتش على الحل اللي هو كان داخل عليه.":
    "ممتاز. دي بالضبط النقطة. إنتي ما خدتيش وصف العميل للمشكلة كأنه الحقيقة، وما جريتيش على الحل اللي هو كان داخل عليه.",
  "القوة هنا مش إنك لقيت معلومة وخلاص… القوة إنك رجّعت تعريف المشكلة نفسه لمكانه الصح. وده أهم جزء في الشغل ده.":
    "القوة هنا مش إنك لقيتي معلومة وخلاص… القوة إنك رجّعتي تعريف المشكلة نفسه لمكانه الصح. وده أهم جزء في الشغل ده.",
  "شغلك المرة دي قوي. هاحسبها لك تقرير مضبوط، ومستواك في الكيس دي ممتاز.":
    "شغلك المرة دي قوي. هاحسبهالك تقرير مضبوط، ومستواكي في الكيس دي ممتاز.",

  // ---------------- MANSOUR_DEBRIEF_MEDIUM ----------------
  "رجعت. ها، وصلت لإيه؟": "رجعتي. ها، وصلتي لإيه؟",
  "ده جزء مهم… لكن إيه النتيجة اللي تبنيها على ده؟": "ده جزء مهم… لكن إيه النتيجة اللي تبنيها على ده؟",
  "صحيح، لكن كنت محتاج تكون أحسم من كده. الموضوع مش بس إن سنة 2025 مختلفة شوية… الموضوع إن ده يغيّر تعريف المشكلة كلها.":
    "صحيح، لكن كنتي محتاجة تكوني أحسم من كده. الموضوع مش بس إن سنة 2025 مختلفة شوية… الموضوع إن ده يغيّر تعريف المشكلة كلها.",
  "لو إنت ما فرّقتش بوضوح بين: العميل شايف إيه، والحل اللي هو رايح له، والمشكلة الحقيقية فين… يبقى الصورة عندك لسه ناقصة.":
    "لو إنتي ما فرّقتيش بوضوح بين: العميل شايف إيه، والحل اللي هو رايح له، والمشكلة الحقيقية فين… يبقى الصورة عندك لسه ناقصة.",
  "إنت مشيت في اتجاه صحيح، لكن كنت محتاج حسم أكتر، وربط أوضح بين المقارنة الغلط وبين خطر القرار اللي العميل كان داخل عليه.":
    "إنتي مشيتي في اتجاه صحيح، لكن كنتي محتاجة حسم أكتر، وربط أوضح بين المقارنة الغلط وبين خطر القرار اللي العميل كان داخل عليه.",
  "أعتبرها شغل كويس، لكن لسه محتاج تبقى أدق وأوضح في كلامك النهائي.":
    "أعتبرها شغل كويس، لكن لسه محتاجة تبقي أدق وأوضح في كلامك النهائي.",

  // ---------------- MANSOUR_DEBRIEF_WEAK ----------------
  "ها، طمّني. شايف المشكلة كانت فين؟": "ها، طمّنيني. شايفة المشكلة كانت فين؟",
  "لا… هنا إنت استعجلت.": "لا… هنا إنتي استعجلتي.",
  "إنت دخلت على الحل قبل ما تتأكد أصلًا إن في مشكلة بيع حقيقية. وده بالضبط الغلط اللي كان هشام الشريف نفسه داخل عليه.":
    "إنتي دخلتي على الحل قبل ما تتأكدي أصلًا إن في مشكلة بيع حقيقية. وده بالضبط الغلط اللي كان هشام الشريف نفسه داخل عليه.",
  "كان لازم تسأل: أقل من المتوقع مقارنة بإيه بالظبط؟ وكان لازم تتأكد إن المرجع اللي بيحكم بيه صح من الأساس.":
    "كان لازم تسألي: أقل من المتوقع مقارنة بإيه بالظبط؟ وكان لازم تتأكدي إن المرجع اللي بيحكم بيه صح من الأساس.",
  "لما العميل يوصّف لك موقف على إنه مشكلة، دورك مش إنك تساعده ينفذ أول حل جه في دماغه. دورك الأول إنك تتأكد: هل دي فعلًا المشكلة؟ ولا المشكلة في طريقة فهمه ليها؟":
    "لما العميل يوصّف لك موقف على إنه مشكلة، دورك مش إنك تساعديه ينفذ أول حل جه في دماغه. دورك الأول إنك تتأكدي: هل دي فعلًا المشكلة؟ ولا المشكلة في طريقة فهمه ليها؟",
  "في الكيس دي، إنت ما مسكتش المرجع الأول، وبالتالي بنيت تقريرك على أرضية ضعيفة. وده كان هيؤدي لقرار غلط.":
    "في الكيس دي، إنتي ما مسكتيش المرجع الأول، وبالتالي بنيتي تقريرك على أرضية ضعيفة. وده كان هيؤدي لقرار غلط.",
  "اعتبرها محاولة ضعيفة. المرة الجاية: ما تجريش على السبب، وما تجريش على الحل… امسك المرجع الأول.":
    "اعتبريها محاولة ضعيفة. المرة الجاية: ما تجريش على السبب، وما تجريش على الحل… امسكي المرجع الأول.",

  // ---------------- MANSOUR_CALL_STRONG ----------------
  "التقرير اللي بعتهولي ده شغل محترم . هشام الشريف اتصل بيا وكان مبسوط جداً.":
    "التقرير اللي بعتيهولي ده شغل محترم. هشام الشريف اتصل بيا وكان مبسوط جداً.",
  "أهم حاجة عملتها صح إنك مخدتش وصف العميل للمشكلة على إنه الحقيقة. ده بالظبط Problem Framing سليم. لو كنت جريت ورا كلامه كان ممكن يحصل مشاكل اكبر والشركة كانت هتخسر عميل كبير.":
    "أهم حاجة عملتيها صح إنك مخدتيش وصف العميل للمشكلة على إنه الحقيقة. ده بالظبط Problem Framing سليم. لو كنتي جريتي ورا كلامه كان ممكن يحصل مشاكل اكبر والشركة كانت هتخسر عميل كبير.",
  "تستاهل. هكتبلك على مكافأة. وهكلمك الأسبوع الجاي على استشارة جديدة.":
    "تستاهلي. هكتبلك على مكافأة. وهكلمك الأسبوع الجاي على استشارة جديدة.",
  "وكمل اللي إنت بتعمله — خليك ماشي على منهج IMP في التحليل، ده اللي فرق معاك النهارده. سلام.":
    "وكمّلي اللي إنتي بتعمليه — خليكي ماشية على منهج IMP في التحليل، ده اللي فرق معاكي النهارده. سلام.",

  // ---------------- MANSOUR_CALL_MEDIUM ----------------
  "خلّينا نتكلم بصراحة شغلك كويس بس مش كويس بالشكل اللي كنت متوقعه منك. مسكت إن سنة 2025 كانت استثنائية، وده تمام، لكن محسمتش الموضوع لآخره.":
    "خلّينا نتكلم بصراحة شغلك كويس بس مش كويس بالشكل اللي كنت متوقعه منك. مسكتي إن سنة 2025 كانت استثنائية، وده تمام، لكن محسمتيش الموضوع لآخره.",
  "بالظبط. كان لازم تربط بوضوح إن المقارنة الغلط كانت هتودي العميل لقرار غلط. الـ Problem Framing مش بس إنك تشوف الحقيقة، ده إنك توصّلها بحسم عشان العميل يغيّر اتجاهه.":
    "بالظبط. كان لازم تربطي بوضوح إن المقارنة الغلط كانت هتودي العميل لقرار غلط. الـ Problem Framing مش بس إنك تشوفي الحقيقة، ده إنك توصّليها بحسم عشان العميل يغيّر اتجاهه.",
  "هديك تقييم متوسط، مش هخصم منك كتير. بس خد بالك المرة الجاية.":
    "هديكي تقييم متوسط، مش هخصم منك كتير. بس خدي بالك المرة الجاية.",
  "نصيحة مني ذاكر دبلومة تحليل البيانات من IMP، هتساعدك جدًا في تنمية مهاراتك التحليلية، وازاي تفهم المشكلة بشكل صحيح.":
    "نصيحة مني ذاكري دبلومة تحليل البيانات من IMP، هتساعدك جدًا في تنمية مهاراتك التحليلية، وازاي تفهمي المشكلة بشكل صحيح.",

  // ---------------- MANSOUR_CALL_WEAK ----------------
  "التقرير ده مش اللي كنت متوقعه منك خالص. إنت دخلت على الحل قبل ما تتأكد إن في مشكلة أصلًا!":
    "التقرير ده مش اللي كنت متوقعه منك خالص. إنتي دخلتي على الحل قبل ما تتأكدي إن في مشكلة أصلًا!",
  "لو هشام نفّذ اللي إنت كاتبه ده هيروح في داهية، وهييجي يقول لنا إنتو نصحتوني غلط. إحنا شغلنا نفهم المشكلة الأول، مش نمشي ورا أول كلمة العميل يقولها.":
    "لو هشام نفّذ اللي إنتي كاتباه ده هيروح في داهية، وهييجي يقول لنا إنتو نصحتوني غلط. إحنا شغلنا نفهم المشكلة الأول، مش نمشي ورا أول كلمة العميل يقولها.",
  "الـ Problem Framing مش رفاهية. ده الفرق بين استشاري حقيقي، وحد بيكتب تقارير وخلاص. أنا هخصملك يومين والتقييم ضعيف.":
    "الـ Problem Framing مش رفاهية. ده الفرق بين استشاري حقيقية، وحد بيكتب تقارير وخلاص. أنا هخصملك يومين والتقييم ضعيف.",
  "روح ذاكر دبلومة تحليل البيانات من IMP. هتساعدك جدًا إنك تطوّر تفكيرك. ولما تفهم ده صح… ابقى كلّمني سلام.":
    "روحي ذاكري دبلومة تحليل البيانات من IMP. هتساعدك جدًا إنك تطوّري تفكيرك. ولما تفهمي ده صح… ابقي كلّميني سلام.",
};

const NORMALIZED_FEMALE_TEXT_MAP: Map<string, string> = new Map(
  Object.entries(RAW_FEMALE_TEXT_MAP).map(([k, v]) => [normalize(k), v]),
);

/**
 * Get a female-addressed text variant for a given male text.
 * Returns undefined if no explicit variant exists (caller keeps original).
 */
export const getFemaleText = (maleText: string | undefined): string | undefined => {
  if (!maleText) return undefined;
  return NORMALIZED_FEMALE_TEXT_MAP.get(normalize(maleText));
};

// ------------------------------------------------------------
// Apply gender to a single dialogue line.
// Generic on T so callers keep their full line shape (mood, saveId,
// inlineEvidence, etc.) intact — we only ever override `text` and
// `audioSrc`.
// ------------------------------------------------------------
export interface GenderableLine {
  text: string;
  audioSrc?: string;
  characterId?: string;
}

export const applyGenderToLine = <T extends GenderableLine>(line: T, gender: Gender | null | undefined): T => {
  if (gender !== "female") return line;

  const femaleText = getFemaleText(line.text);
  const femaleAudio = getVoiceoverSrc(line.audioSrc, "female");

  // No female-specific overrides → return original reference unchanged.
  if (!femaleText && femaleAudio === line.audioSrc) return line;

  return {
    ...line,
    text: femaleText ?? line.text,
    audioSrc: femaleAudio,
  };
};
