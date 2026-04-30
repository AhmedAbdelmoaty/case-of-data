# Mansour Voice-Over Integration — Plan

## فهمت المطلوب (تأكيد)

- عندك 4 ملفات صوتية كاملة (continuous) لمنصور:
  1. `mansour_intro_office_full.wav` — مشهد البريفنج في المكتب (22.65s)
  2. `mansour_call_strong_full.wav` — مكالمة النتيجة القوية (27.17s)
  3. `mansour_call_medium_full.wav` — مكالمة النتيجة المتوسطة (37.97s)
  4. `mansour_call_weak_full.wav` — مكالمة النتيجة الضعيفة (32.28s)

- المطلوب: لما يظهر سطر حوار لمنصور على الشاشة → يشتغل الجزء الصح من الملف الكامل المناسب.
- ممنوع تغيير النصوص أو الـ flow أو ترتيب الحوار.
- ممنوع تشغيل صوت منصور فوق سطر اللاعب/المحقق.
- لو مفيش timestamps دقيقة → ما أخمّنش.

## الحل المقترح (الأفضل تقنياً)

**Option A — Timestamped playback من نفس الملف الكامل** (بدون قطع/تقطيع يدوي).

ليه ده الأفضل:
- ملف واحد لكل مشهد = حجم أصغر، تحميل أسرع، مفيش race conditions بين clips.
- HTML5 `<audio>` بيدعم `currentTime` + إيقاف عند `endTime` بكل سهولة.
- لو احتجت تظبّط ميلي ثانية لاحقاً → تعديل سطر في mapping بس.
- مفيش خسارة جودة من إعادة الترميز.

كشفت سكوتات (silence gaps ≥ 0.35s) في كل ملف باستخدام `ffmpeg silencedetect`، والنتائج بتطلع حدود طبيعية بين الجمل — ده يخليني أحدد start/end لكل سطر منصور بدقة معقولة (مش تخمين أعمى، ده مبني على تحليل فعلي للملف).

## النتائج اللي طلعت من تحليل الملفات

### 1) `mansour_intro_office_full.wav` (22.65s)
السكريبت `MANSOUR_INTRO_DIALOGUES` فيه 5 أسطر، 4 منهم لمنصور + 1 للمحقق.

ملاحظة مهمة: الملف ده مدته 22.6s واتقسم لـ 11 segment تقريبًا حسب السكوت — ده معناه إن الملف فيه أسطر منصور الأربعة بس (مش سطر المحقق)، وكل سطر طويل اتقسم داخلياً لجمل صغيرة بفواصل تنفّس. هنعامل كل سطر منصور كـ range واحد متصل.

Mapping مبدئي (هتأكده بعد سماع نهائي):
| Line idx | Speaker  | Start | End   |
|----------|----------|-------|-------|
| 0        | mansour  | 0.00  | 4.42  |
| 1        | mansour  | 5.11  | 9.49  |
| 2        | mansour  | 10.18 | 15.36 |
| 3        | detective| —     | —     | (مفيش صوت)
| 4        | mansour  | 15.88 | 22.65 |

### 2) `mansour_call_strong_full.wav` (27.17s)
السكريبت `MANSOUR_CALL_STRONG` فيه 5 أسطر: 4 منصور + 1 محقق (سطر 2).

| Line idx | Speaker  | Start | End   |
|----------|----------|-------|-------|
| 0        | mansour  | 0.00  | 4.97  |
| 1        | mansour  | 5.92  | 17.01 |
| 2        | detective| —     | —     |
| 3        | mansour  | 17.46 | 21.29 |
| 4        | mansour  | 21.86 | 27.17 |

### 3) `mansour_call_medium_full.wav` (37.97s)
السكريبت `MANSOUR_CALL_MEDIUM` فيه 5 أسطر: 4 منصور + 1 محقق (سطر 1).

| Line idx | Speaker  | Start | End   |
|----------|----------|-------|-------|
| 0        | mansour  | 0.00  | 8.85  |
| 1        | detective| —     | —     |
| 2        | mansour  | 9.22  | 24.29 |
| 3        | mansour  | 25.23 | 32.87 |
| 4        | mansour  | 33.31 | 37.97 |

### 4) `mansour_call_weak_full.wav` (32.28s)
السكريبت `MANSOUR_CALL_WEAK` فيه 5 أسطر: 4 منصور + 1 محقق (سطر 1).

| Line idx | Speaker  | Start | End   |
|----------|----------|-------|-------|
| 0        | mansour  | 0.00  | 5.95  |
| 1        | detective| —     | —     |
| 2        | mansour  | 6.35  | 20.91 |
| 3        | mansour  | 21.40 | 26.67 |
| 4        | mansour  | 27.06 | 32.28 |

> الـ timestamps دي مبنية على silence detection فعلي بحد سكوت 0.35s. لو بعد الدمج لقيت سطر بيقطع بدري أو متأخر شوية، تعديله سطر واحد في mapping.

## التنفيذ التقني

### الملفات اللي هتتعمل/تتعدل

1. **نسخ ملفات الصوت** إلى `public/voice/`:
   - `public/voice/mansour_intro_office_full.wav`
   - `public/voice/mansour_call_strong_full.wav`
   - `public/voice/mansour_call_medium_full.wav`
   - `public/voice/mansour_call_weak_full.wav`

2. **إنشاء `src/lib/pf-case/mansour-voice-map.ts`**:
   ```ts
   export type VoiceSegment = { start: number; end: number };
   export type VoiceScript = {
     audioSrc: string;
     segments: Array<VoiceSegment | null>; // null = سطر مش لمنصور
   };
   export const MANSOUR_VOICE: {
     intro: VoiceScript;
     callStrong: VoiceScript;
     callMedium: VoiceScript;
     callWeak: VoiceScript;
   } = { /* ... الـ mapping اللي فوق ... */ };
   ```

3. **إنشاء hook جديد `src/hooks/useMansourVoice.tsx`**:
   - بيستقبل `(scriptKey, lineIndex, isActive)`.
   - بيحمّل `<Audio>` element مرة واحدة (lazy) ويعيد استخدامه لنفس الملف.
   - عند تغيّر `lineIndex`:
     - يوقف التشغيل الحالي فوراً.
     - لو الـ segment = null (سطر محقق) → ميشغّلش حاجة.
     - لو segment موجود → `audio.currentTime = start; audio.play()` ويبدأ مؤقت يوقف عند `end` (`requestAnimationFrame` loop يقارن currentTime بـ end لدقة أعلى من setTimeout).
   - يحترم mute toggle العام من `useMusic`/`useSoundEffects` (هشوف اللي مستخدم حالياً للـ SFX — على الأرجح `useSoundEffects`).
   - يتعامل مع `audio.play()` Promise rejection بصمت (autoplay policy).
   - cleanup عند unmount: pause + clear timer.

4. **تعديل `src/components/game/screens/PhoneCallDebriefScreen.tsx`**:
   - إضافة سطر واحد:
     ```ts
     const voiceKey = tier === "strong" ? "callStrong" : tier === "weak" ? "callWeak" : "callMedium";
     useMansourVoice(voiceKey, dialogueIndex, true);
     ```
   - مفيش أي تغيير في النصوص أو الـ UI أو الـ flow.

5. **تعديل المشهد اللي بيعرض `MANSOUR_INTRO_DIALOGUES`** (على الأرجح `CompanyBriefingScreen.tsx` — هتأكد بقراءة الملف أول حاجة):
   - إضافة `useMansourVoice("intro", dialogueIndex, true)`.

### قواعد التشغيل (مطابقة للمتطلبات بتاعتك)
- تغيّر السطر → إيقاف فوري للجزء الحالي قبل ما يبدأ الجديد (مفيش overlap).
- سطر محقق → segment = null → مفيش صوت منصور.
- مفيش re-encoding → مفيش قطع لأول حرف ولا نَفَس.
- استخدام `requestAnimationFrame` للتوقف عند `end` بدقة ~16ms (أحسن من setTimeout).
- لو المستخدم سكّت الصوت من السيتنجز → `audio.muted = true`.

## ليه مش Option B (تقطيع لـ clips منفصلة)؟
- يضاعف عدد ملفات public ويعقّد الصيانة.
- أي تعديل صغير في boundary بيتطلب re-cut.
- مفيش فايدة تقنية حقيقية مقابل Option A.

## ليه مش Option C (تقطيع يدوي منك)؟
- مش محتاجين — الـ silence detection طلع نظيف وكافي للـ playback من الملف الكامل. لو لقينا سطر فيه boundary غلط بعد التجربة، تعديل رقم في الـ map = 5 ثواني شغل.

## بعد الموافقة هعمل بالترتيب
1. نسخ 4 ملفات صوت لـ `public/voice/`.
2. إنشاء `mansour-voice-map.ts` بالـ timestamps اللي فوق.
3. إنشاء hook `useMansourVoice.tsx`.
4. ربط الـ hook في `PhoneCallDebriefScreen` و مشهد الـ briefing (هتأكد اسم الملف الصح).
5. تجربة سريعة وتأكيد إن مفيش overlap بين منصور والمحقق.

## محتاج تأكيد منك
- موافق على Option A (timestamps من ملف واحد)؟
- موافق على الـ timestamps المبدئية اللي فوق؟ (لو في سطر معين حسيت إنه بيقطع، ابعتلي رقم السطر بعد التشغيل وأظبطه فوراً.)
