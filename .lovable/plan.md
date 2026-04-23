

# 🎬 الخطة: تحويل اللعبة لتجربة سينمائية صوتية كاملة

## ملخص فهمي لطلبك

عايز اللعبة تبقى **حية ومُعاشة** صوتياً:
1. **مؤثرات بيئية غنية** في كل مشهد (دوشة شارع، خطوات، طرقة، دوشة متجر…)
2. **رنة موبايل واقعية** (مش صوت bell الحالي السيء)
3. **موسيقى خلفية محترمة** بدل الأصوات الضعيفة الحالية
4. **كل حاجة تتنفذ بـ Web Audio API بدون أي ملف خارجي** (نفس الأسلوب الموجود حالياً، بس بجودة احترافية)

---

## القسم الأول: مكتبة أصوات جديدة موسّعة (في `useSoundEffects.tsx`)

### أصوات نضيفها (synthesized — كلها قابلة للتنفيذ بـ Web Audio):

| الصوت | الوصف الفني | الاستخدام |
|---|---|---|
| `phoneRingModern` | رنين iPhone-like: نغمتين متناوبتين (1318Hz + 1175Hz) مع envelope ناعم + reverb tail | بديل لـ storeBell في IncomingCallScreen |
| `footstepHard` | 4 طبقات: thump منخفض (60Hz) + click حاد (1200Hz noise burst) + reverb | مشي في الطرقة + دخول المتجر |
| `footstepSoft` | نفس الفكرة بـ volume أقل وفلتر lowpass للأرضية الناعمة | مشي على سجاد |
| `carHorn` | كلاكس واقعي: square wave 440Hz + 392Hz harmonics + decay سريع | TravelScreen |
| `carHornDistant` | نفسه بـ lowpass filter + reverb | خلفية الطريق |
| `cityTraffic` | brown noise + bandpass filter (200-800Hz) + LFO modulation | TravelScreen loop |
| `crowdChatter` | pink noise + multiple bandpass filters (وسط بشري 300-3000Hz) + slow modulation | داخل المتجر |
| `keyboardTyping` | sequential clicks (random pitch 800-1500Hz, random timing) | مشاهد المكتب |
| `paperRustle` | high-freq noise burst + envelope قصير | فتح التقرير |
| `clockTickEnhanced` | نسخة محسنة من tick الحالي بـ stereo + reverb | المكتب |
| `notification` | نغمة نقية مزدوجة (880Hz → 1320Hz) ناعمة | جمع note جديدة |
| `successChime` | 4 نوتات صاعدة (C-E-G-C) بـ sine + bell harmonic | إجابة صح |
| `failureBuzz` | low square wave (110Hz) descending + distortion | إجابة غلط |

### نظام مساعد جديد: `playLoopingSound(type, duration)`

دالة جديدة لتشغيل **حلقات مستمرة** (مش one-shot) — للأصوات اللي محتاجة تكمل لفترة (دوشة شارع، خطوات متتابعة).

---

## القسم الثاني: توسيع `useAmbientSound.tsx` بـ scenes جديدة

### Scenes جديدة هنضيفها:

| Scene | المحتوى الصوتي | المشهد |
|---|---|---|
| `street` | brown noise (محرك بعيد) + كلاكسات عشوائية كل 4-7 ثواني + city rumble | TravelScreen |
| `hallway` | low room tone + footstep loop خفيف + echo | CompanyBriefingScreen → hallway phase |
| `storeRich` | تطوير `store` الحالي: AC hum + chatter أعلى + خطوات بعيدة + موسيقى خلفية ناعمة جداً | ArrivalScreen + InquiryScreen |
| `phoneCall` | static خفيف + room tone | PhoneCallDebriefScreen |

### تحسين الموجود:
- **`store` الحالي**: نزود الـ chatter density ونضيف "cash register dings" عشوائية
- **`office` الحالي**: نضيف keyboard typing بعيد + ورق

---

## القسم الثالث: إعادة كتابة الموسيقى الخلفية بالكامل (`useBackgroundMusic.tsx`)

### المشكلة الحالية:
الموسيقى دلوقتي = oscillators بسيطة بتعزف نوتات منفردة → حاسة كأنها synthesizer قديم.

### الحل (كله Web Audio، بدون ملفات):

**معمارية موسيقية جديدة** بـ 4 طبقات متزامنة:

1. **Bass Layer**: sine wave عميق (40-80Hz) بـ slow LFO → يدي إحساس عمق
2. **Pad Layer**: 3 oscillators (sine + triangle + sine) بنوتات هارمونية (root + 5th + octave) مع lowpass filter متحرك → يدي نسيج ناعم cinematic
3. **Melody Layer**: نوتات pentatonic scale عشوائية بـ bell-like envelope (attack سريع + decay طويل) — بتطلع كل 3-6 ثواني
4. **Reverb Bus**: convolution reverb مصنوع من noise impulse → كل الطبقات تتغذى فيه → احساس مكان حقيقي

### Themes جديدة لكل غرفة:

| Room | المزاج | المفتاح | الإيقاع |
|---|---|---|---|
| `intro` | غامض/تشويقي | A minor | بطيء + bass متحرك |
| `office` | احترافي/هادي | C major | متوسط + pad ناعم |
| `evidence` | تفكير/تحقيق | D dorian | بطيء + ticks خفيفة |
| `analysis` | توتر متصاعد | E phrygian | متوسط-سريع + bass متكرر |
| `interrogation` | درامي/ثقيل | F minor | بطيء + low rumble |
| `result` | انتصار/فخر | C major | mid-tempo + fanfare melody |

**المخرج**: موسيقى cinematic فعلية (زي Hans Zimmer ambient) بدل beep بسيط.

### تحسينات إضافية للـ MusicContext:
- نخلي الموسيقى **on by default** (بدل off)
- نضيف `volume` يبقى 0.4 default (مش 0.3)
- نخلي الـ transition بين الـ rooms smooth (crossfade 2 ثانية بدل cut مفاجئ)

---

## القسم الرابع: ربط الأصوات بالمشاهد (الأماكن المحددة)

### 📍 `TravelScreen.tsx`
- إضافة `useAmbientSound("street")` → traffic loop طوال المشهد
- في الـ monologues: **car horn distant** عشوائي مرة-مرتين

### 📍 `CompanyBriefingScreen.tsx`
- **Phase: hallway** → `useAmbientSound("hallway")` + تشغيل `footstepHard` في loop (كل 600ms) لمدة 2 ثانية → احساس إنه ماشي
- **Phase: door-knock** → `playDoorKnock` (موجود بالفعل)
- **Phase: dialogue** → ambient office (موجود)

### 📍 `ArrivalScreen.tsx`
- **Phase: storefront** → بدون ambient (شارع خفيف)
- **Phase: entering** → footstep + storeBell (موجود) + start `storeRich` ambient
- **Phase: interior/dialogue** → `storeRich` يستمر

### 📍 `InquiryScreen.tsx`
- ambient `storeRich` طوال المرحلة
- لما اللاعب يختار سؤال → `paperRustle` خفيف
- لما يدخل تقرير → `pageFlip` (موجود) محسّن

### 📍 `IncomingCallScreen.tsx`
- استبدال `storeBell` بـ **`phoneRingModern`** الجديد
- pattern: رنة لمدة 2s → سكوت 1s → رنة (زي iPhone فعلي)

### 📍 `PhoneCallDebriefScreen.tsx`
- `useAmbientSound("phoneCall")` → static خفيف للإحساس بمكالمة حقيقية

### 📍 `EmailSendScreen.tsx`
- `keyboardTyping` لما يكتب الـ email
- `whoosh` لما يبعت (موجود)

### 📍 `FramingScreen.tsx`
- `paperRustle` لما يفتح section
- `successChime` أو `failureBuzz` على حسب الاختيار

### 📍 `ResultScreen.tsx`
- موسيقى result + `successChime` كبير

---

## القسم الخامس: تحسينات على نظام الصوت العام

### في `SoundProvider`:
- رفع `masterVolume` default من `1` إلى `1` (موجود بس نتأكد)
- إضافة دالة `playLoopingSound(type, durationMs)` للأصوات المتكررة
- إضافة دالة `stopAllLoops()` للتنظيف عند تغيير المشهد

### في `MusicProvider`:
- `isMusicEnabled` default = **true** (بدل false) — عشان الموسيقى الجديدة محترمة وما حدش هيقفلها
- crossfade بين المشاهد (gain ramp 2 ثانية)

---

## القسم السادس: ملخص الملفات اللي هتتعدل

| الملف | التغيير |
|---|---|
| `src/hooks/useSoundEffects.tsx` | إضافة 13 صوت جديد + نظام looping + تحسينات |
| `src/hooks/useAmbientSound.tsx` | إضافة scenes: `street`, `hallway`, `storeRich`, `phoneCall` + تحسين `store` و `office` |
| `src/hooks/useBackgroundMusic.tsx` | إعادة كتابة كاملة بـ 4-layer cinematic system + crossfade + on-by-default |
| `src/components/game/screens/TravelScreen.tsx` | ربط `street` ambient + car horns |
| `src/components/game/screens/CompanyBriefingScreen.tsx` | إضافة footstep loop في hallway |
| `src/components/game/screens/ArrivalScreen.tsx` | تفعيل `storeRich` + footsteps في entering |
| `src/components/game/screens/InquiryScreen.tsx` | ربط `storeRich` + paperRustle |
| `src/components/game/screens/IncomingCallScreen.tsx` | استبدال storeBell بـ `phoneRingModern` |
| `src/components/game/screens/PhoneCallDebriefScreen.tsx` | ambient `phoneCall` |
| `src/components/game/screens/EmailSendScreen.tsx` | keyboard typing |
| `src/components/game/screens/FramingScreen.tsx` | paper rustle + success/failure chimes |

---

## ضمانات

✅ كل صوت موصوف يتم توليده بـ **Web Audio API فقط** — مفيش ملفات خارجية ولا API keys.  
✅ كل الأصوات تحترم الـ **toggle العام** (`isSoundEnabled` و `isMusicEnabled`).  
✅ الـ ambient sounds بتتنظف automatically لما المشهد يتغير (cleanup في useEffect موجود).  
✅ مفيش تأثير على منطق اللعبة، الديالوجات، أو الـ Framing Board — صوت بس.  
✅ الموسيقى الجديدة cinematic فعلاً (4 طبقات + reverb)، مش oscillator واحد.  
✅ رنة الموبايل بـ pattern iPhone حقيقي (rise-fall + sustain + pause).  
✅ كل scene له profile صوتي مميز يعيش اللاعب جوا المكان.

