# Gender-Aware Dialogue + Voice-Over Plan

## What I read and understood

I inspected the relevant code and the uploaded WAV files. Here is exactly what's there:

**Voice-over files in `public/voiceover/`:**
- `mansour/` — every Mansour file has a matching `_female.wav` version (16 male + 16 female, total 32). Covers all of: `mansour_intro_office_01..04`, `mansour_call_strong_01..04`, `mansour_call_medium_01..04`, `mansour_call_weak_01..04`.
- `hesham/` — only some files have `_female.wav` versions:
  - Has female: `hisham_arrival_01_welcome`, `hisham_arrival_02_problem_feeling`, `hisham_s3_correct_year_report`, `hisham_s4_correct_three_year_report`, `hisham_s4_wrong_competitor_prices`, `hisham_s5_correct_breakdown`, `hisham_s5_wrong_marketing_entry`, `hisham_track_a_01_team_performance`, `hisham_track_d_03_marketing_report`.
  - No female version (will keep male audio): the other Hisham files (s1, s2, s3 wrong, track_a 02/03/04, all track_c, track_d 01/02/04).

**Where dialogue is consumed:**
- `EnhancedDialogue.tsx` already accepts `playerGender` and uses cached/preloaded `audioSrc` with instant playback + stop-on-change. This is the single render point for all dialogue.
- Scripts: `src/lib/pf-case/mansour-scripts.ts` (HISHAM_GREETING, MANSOUR_INTRO, MANSOUR_DEBRIEF_*), `src/lib/pf-case/mansour-call-scripts.ts` (MANSOUR_CALL_*), `src/lib/pf-case/case-tree.ts` (SPINE + TRACKS hisham replies).
- Voice map: `src/lib/voiceover/heshamVoiceMap.ts` matches Hisham reply text → audio path.
- Screens that build dialogue arrays: `ArrivalScreen.tsx`, `CompanyBriefingScreen.tsx`, `InquiryScreen.tsx`, `PhoneCallDebriefScreen.tsx` — all already pass `playerGender` and `profile.gender`.

**Key insight:** Male behavior must be byte-identical to today. So the cleanest approach is:
1. Keep all existing text and `audioSrc` strings exactly as they are (= male path).
2. Add a small helper that, **only when `playerGender === "female"`**, swaps in a female text variant (if one is defined) and tries `_female.wav` (only if that path is in an allow-list of files we know exist).

## Plan

### 1) New helper: `src/lib/voiceover/genderedDialogue.ts`

Two pure functions:

- `getFemaleAudioSrc(maleSrc?: string): string | undefined`
  - If no `maleSrc` → return undefined.
  - Compute candidate `<basename>_female.wav`.
  - Look up against a hard-coded `Set<string>` of known-existing female files (the 16 Mansour + 9 Hisham listed above). If present → return female path. Else → return original `maleSrc`. **Never guess a path that doesn't exist.**
- `applyGenderToLine(line, gender)`
  - For `gender === "male"` → return line unchanged.
  - For `gender === "female"` → return `{ ...line, text: femaleTextFor(line.text) ?? line.text, audioSrc: getFemaleAudioSrc(line.audioSrc) }`.
- `femaleTextFor(maleText)` → looks up an explicit female-text map. If no entry → returns undefined (keeps male text). This avoids blindly rewriting neutral lines.

Example entries in the female-text map (only for lines that have direct masculine address to the analyst):

```
"التقرير اللي بعتهولي ده شغل محترم . هشام الشريف اتصل بيا وكان مبسوط جداً."
  → "التقرير اللي بعتيهولي ده شغل محترم . هشام الشريف اتصل بيا وكان مبسوط جداً."

"أهلاً، اتفضل اقعد. عندنا استشارة جديدة محتاجة تركيز."
  → "أهلاً، اتفضلي اقعدي. عندنا استشارة جديدة محتاجة تركيز."

"أهلاً وسهلاً يا فندم، نوّرت. اتفضل اقعد، تشرب حاجة؟"
  → "أهلاً وسهلاً يا فندمة، نوّرتي. اتفضلي اقعدي، تشربي حاجة؟"

"عايزك تروح تقعد معاه، وتسأل صح وتفهم المشكلة بشكل كامل."
  → "عايزك تروحي تقعدي معاه، وتسألي صح وتفهمي المشكلة بشكل كامل."
```

I'll go through every Mansour + Hisham line in the four script sources and add a female variant **only** where there is real masculine address (verbs/pronouns directed at the analyst). Lines like *"إحنا شغلنا نفهم المشكلة الأول"* or any narration that doesn't address the analyst stay untouched.

### 2) Wire the helper into the four screens

In each screen that builds a `dialogues` array, map through `applyGenderToLine(line, g)` before passing to `EnhancedDialogue`:

- `src/components/game/screens/ArrivalScreen.tsx` (HISHAM_GREETING)
- `src/components/game/screens/CompanyBriefingScreen.tsx` (MANSOUR_INTRO_DIALOGUES)
- `src/components/game/screens/PhoneCallDebriefScreen.tsx` (MANSOUR_CALL_*)
- `src/components/game/screens/InquiryScreen.tsx` (already calls `getHeshamVoice(result.responseText)` — I'll wrap the produced Hisham line through `applyGenderToLine` so its text + audio get female-shifted; player/detective lines pass through untouched)

Detective/player lines have no `audioSrc` so the audio swap is a no-op for them. Their text doesn't need gender swapping (they ARE the player; the existing UI already shows the player's name + chosen avatar).

### 3) Update `heshamVoiceMap.ts` (no breaking changes)

Keep existing male map exactly as-is (so male behavior is byte-identical). The female swap is handled centrally by `getFemaleAudioSrc` looking at the resulting path — no second map needed. Add a comment block listing which Hisham files have `_female.wav` available so future edits stay consistent.

### 4) Behavior guarantees

- Male player: zero change. Same text, same `.wav`, same timing.
- Female player:
  - Text changes only on lines we explicitly added a female variant for. Neutral lines stay identical.
  - Audio: tries `<file>_female.wav`; if that exact file isn't in the known-female allow-list, falls back to the original male file. We never request a non-existent file.
- Audio playback path is unchanged (`EnhancedDialogue` already preloads, stops on change, plays instantly). So no desync, no overlap, no delay regression.

## Files to add / edit

**New:**
- `src/lib/voiceover/genderedDialogue.ts` — helper with `applyGenderToLine`, `getFemaleAudioSrc`, female text map, female-audio allow-list.

**Edited (small wrapping changes only):**
- `src/components/game/screens/ArrivalScreen.tsx`
- `src/components/game/screens/CompanyBriefingScreen.tsx`
- `src/components/game/screens/PhoneCallDebriefScreen.tsx`
- `src/components/game/screens/InquiryScreen.tsx`
- `src/lib/voiceover/heshamVoiceMap.ts` — add a documentation comment listing female-available files (no logic change).

## Out of scope (intentionally not touched)

- Story content, dialogue meaning, scene flow, scoring, animations.
- Mansour debrief text and call text aren't required to change for female (no female versions of debrief audio exist anyway). Female text variants in those will only be added where there's clear masculine address; otherwise left untouched.
- No new audio files will be requested or invented.

## Confirmation

Yes — I read the uploaded files in `public/voiceover/mansour/` and `public/voiceover/hesham/`, identified exactly which `_female.wav` files exist, and my plan only references those. For files without a female version, the original male audio stays.
