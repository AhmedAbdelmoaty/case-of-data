

# 🎬 خطة إعادة صياغة المشاهد بشكل سينمائي كامل

## ✅ فهمت إيه بالظبط

راجعت كل شيء وعندي صورة كاملة دلوقتي:

### 📸 الصور الموجودة فعلاً في `src/assets/scenes/` (29 صورة)

كل الصور بأسمائها الصح ومتاحة للاستخدام. عدّيتها واحدة واحدة:

**مكتب Prism (5)**: `prism-building-exterior` · `prism-hallway` · `prism-knock-{m/f}` · `mansour-office-welcome-{m/f}` · `mansour-office-seated-{m/f}`

**السفر (3)**: `city-drive-luxury-{m/f}` · `velaro-street` · `velaro-storefront`

**داخل VELARO (6)**: `velaro-entering-{m/f}` · `velaro-interior-wide` · `hisham-greeting-{m/f}` · `hisham-office-seated-{m/f}`

**كادرات الحوار (5)**: `velaro-mens-section` · `velaro-womens-section` · `velaro-checkout-busy` · `hisham-handing-report-{m/f}`

**التأطير والتقديم (3)**: `analyst-reflecting-{m/f}` · `framing-board-desk` · `hisham-receiving-report-{m/f}`

> ✅ **مفيش `return-to-prism`** (اتشال — استبدلناه بمشاهد الإيميل والمكالمة).

### 🐛 الأخطاء اللي حصلت قبل كده وهنصلحها

| # | المشكلة | السبب | الحل |
|---|---|---|---|
| 1 | `ArrivalScreen` لسه شغال بصور قديمة محذوفة (`store-front.png`, `abu-saeed-greeting.jpg`) | الملف ما اتحدّثش لما الصور الجديدة وصلت | إعادة بناء كاملة |
| 2 | لما أضغط "اطرق باب المكتب" الصورة بتظهر متأخرة | `playDoorKnock()` بيستنى يخلص قبل الـ setPhase | نقدم الـ setPhase + نعمل preload للصورة |
| 3 | `FramingScreen` مستخدم `store-counter.png` (محذوفة) — هيكسر الـ build | الملف ما اتحدّثش | استخدام `framing-board-desk.png` |
| 4 | `Auth.tsx` مستخدم `store-front.png` (محذوفة) — هيكسر الـ build | reference قديم | استبدال بـ `prism-building-exterior.png` |
| 5 | كادرات `InquiryScreen` بتستخدم `hisham-office-seated-male` فقط (مش gender-aware) | hard-coded male | gender-aware |
| 6 | `velaro-entering` و `velaro-interior-wide` و `velaro-storefront` صور موجودة بس مش مستخدمة | ما اتربطتش | نضيفها في ArrivalScreen |
| 7 | timing الـ phases جامد (مثلاً 2500ms للـ entrance) → بيحس بـ delay أو سرعة | بدون preload + بدون tuning | preload كل صور المشهد + tuning الأوقات |

---

## 🎯 الفلسفة السينمائية الجديدة (مستوحاة من نجاح مشاهد الإيميل/المكالمة)

اللي خلى مشاهد الإيميل ممتعة:
- **انتقالات `AnimatePresence` نظيفة** بين كل phase
- **الصور preloaded** فمفيش flash أبيض
- **كل phase ليه auto-advance بعد timing محسوب** (مش طويل، مش قصير)
- **النص متزامن مع الصورة** (مش بيظهر قبلها أو بعدها)
- **Ken Burns hover effect دايماً شغال** = إحساس إن الصورة بتتنفس
- **Bottom gradient فقط** (مفيش backdrop-blur على الصورة)

هطبق نفس النهج ده على كل مشهد.

---

## 📋 خطة المشاهد الجديدة (شاشة بشاشة)

### 🎬 1. CompanyBriefingScreen (5 phases — 4 صور)

**التوزيع الزمني الجديد**:

| Phase | المدة | الصورة | إيش بيحصل |
|---|---|---|---|
| `exterior` | **2.5s** auto-advance | `prism-building-exterior` | Ken Burns slow zoom + لوجو "PRISM CONSULTING" يفيد + نص "رحلتك بتبدأ من هنا" |
| `hallway` | **انتظار click** | `prism-hallway` | "Floor 12 · مكتب أ. منصور" + زرار "اطرق باب المكتب" |
| `door-knock` | **2.5s ثابت** + سهل للضغط | `prism-knock-{gender}` | **الصورة تظهر فوراً** (preloaded) + sound یشتغل بـ delay 150ms + "طق طق طق" بعد 600ms + "اتفضل!" بعد 1.6s + زرار "ادخل المكتب" بعد 2.2s |
| `welcome` | **انتظار click** | `mansour-office-welcome-{gender}` | منصور بيشاور للاعب يقعد + GraduationCap + نص الترحيب + زرار "يلا نروح VELARO!" |
| `dialogue` | للحوار | `mansour-office-seated-{gender}` | EnhancedDialogue كامل |

**الإصلاح الأهم**: الـ `door-knock` phase دلوقتي بيظهر بعد click فوراً (مفيش أي delay لأن بنعمل preload). الـ `welcome` بقى phase منفصل عن `dialogue` عشان مفيش لخبطة.

---

### 🚗 2. TravelScreen (الموجود حالياً تمام — تحسين بسيط)

| Phase | المدة | الصورة |
|---|---|---|
| `drive` | **3.5s** | `city-drive-luxury-{gender}` |
| `street` | **2.8s** | `velaro-street` |

Total: 6.3s → onComplete. الـ waypoints والـ monologues متزامنين مع الـ phase changes.

---

### 🏪 3. ArrivalScreen — إعادة بناء كاملة (4 phases)

**حالياً مكسور** (بصور قديمة). هنبنيه من جديد:

| Phase | المدة | الصورة | إيش بيحصل |
|---|---|---|---|
| `storefront` | **انتظار click** | `velaro-storefront` | "وصلت متجر VELARO" + "أ. هشام مستنيك جوه" + زرار "ادخل المتجر" |
| `entering` | **2.2s** auto + storeBell sound | `velaro-entering-{gender}` | لقطة POV الباب بيتفتح |
| `interior` | **2.5s** auto | `velaro-interior-wide` | لقطة wide للصالة الفخمة + نص "صالة VELARO" يفيد ثم يختفي |
| `greeting` | للحوار | `hisham-greeting-{gender}` ← `hisham-office-seated-{gender}` بعد 2 سطور | EnhancedDialogue + الصورة تتبدل من greeting لـ office-seated مع تقدم الحوار |

> ✨ **جديد**: مرحلة `interior` بتعرض صالة VELARO كاملة قبل ما هشام يقابله — ده بيدّي إحساس "وصلت لمكان فاخر".

---

### ❓ 4. InquiryScreen (تحسين الـ scene logic)

كل الكادرات شغالة، بس فيه bug:
- `hisham-office-seated-male` hardcoded → نخليه gender-aware

**Scene mapping محسّن**:
```
TRACK_A → velaro-mens-section
TRACK_C → velaro-womens-section  
TRACK_B/D → velaro-checkout-busy
inlineEvidence → hisham-handing-report-{gender}
greeting (q=0) → hisham-greeting-{gender}
default dialogue → hisham-office-seated-{gender}  ← gender fix
timeout → hisham-office-seated-{gender}
```

---

### 🧠 5. ReflectionTransition (تمام — تعديل بسيط)

| المدة الحالية | المقترحة |
|---|---|
| 4.0s | **4.5s** (يدي وقت أكتر للقراءة) |

الصورة `analyst-reflecting-{gender}` شغالة صح. هنضيف بس fade-out في آخر 600ms.

---

### 🎯 6. FramingScreen (إصلاح الصورة المكسورة)

**Bug**: مستخدم `store-counter.png` (محذوفة) → الـ build هيكسر.

**الحل**: نستبدل بـ `framing-board-desk.png` كخلفية top-down للوحة التأطير. ده مناسب جداً لأنه flat-lay لمكتب فيه دفتر وتقارير.

---

### 📊 7. PresentationScreen (تمام — تحسين الـ flow)

شغال صح بـ `hisham-receiving-report-{gender}`. التحسين:
- نضيف زرار **"📧 أرسل التقرير لأستاذ منصور بالإيميل"** في آخر سطر من الحوار (موجود بالفعل في الكود؟ خليني أتأكد، لو مش موجود هضيفه)

---

### 🔐 8. Auth.tsx (إصلاح bug)

`storeFrontImg` reference broken → استبدال بـ `prism-building-exterior.png` كخلفية صفحة الدخول.

---

## 🛠️ التقنيات اللي هستخدمها (نفس اللي خلت مشاهد الإيميل ممتازة)

### 1. **Image preloading** قبل كل phase change
```ts
useEffect(() => {
  const img = new Image();
  img.src = nextPhaseImg;
}, [phase]);
```
ده بيلغي الـ flash الأبيض اللي بين الـ phases.

### 2. **AnimatePresence mode="wait"** لكل تبديل صورة
عشان الـ exit animation تخلص قبل ما الـ enter تبدأ.

### 3. **Ken Burns على كل الصور الثابتة**
class `animate-ken-burns` (موجود في `index.css`) → zoom-in بطيء 8s.

### 4. **Bottom-only gradient overlay** (لا blur نهائي على الصورة)
```css
bg-gradient-to-t from-background/95 via-background/20 to-transparent
```

### 5. **Timing محسوب لكل phase** بدل القيم العشوائية
- **Establishing shots** (exterior, interior wide): 2.2-2.5s
- **Action shots** (knocking, entering): 2.0-2.5s
- **Conversation shots**: انتظار click أو حوار

### 6. **زرار "Skip"** خفيف لو اللاعب مش عايز يستنى التحول
في الكورنر السفلي (موجود في بعض المشاهد، هنوحده).

---

## 📦 الملفات اللي هتتعدل بالظبط

| الملف | التعديل | السبب |
|---|---|---|
| `ArrivalScreen.tsx` | **إعادة بناء كاملة** | الصور القديمة محذوفة |
| `CompanyBriefingScreen.tsx` | إضافة phase `welcome` منفصل + preload + timing tuning | door-knock delay fix |
| `InquiryScreen.tsx` | gender-aware لـ `hisham-office-seated` | bug fix |
| `FramingScreen.tsx` | `store-counter.png` → `framing-board-desk.png` | broken import |
| `Auth.tsx` | `store-front.png` → `prism-building-exterior.png` | broken import |
| `PresentationScreen.tsx` | تأكيد أن زرار "أرسل بالإيميل" بيظهر في آخر سطر | flow continuity |

**ملفات هتفضل زي ما هي** (شغالة صح):
- `TravelScreen.tsx` (تعديل بسيط في timing لو محتاج)
- `ReflectionTransition.tsx` (تعديل بسيط في duration)
- `EmailSendScreen.tsx`, `MansourReceivesEmailScreen.tsx`, `IncomingCallScreen.tsx`, `PhoneCallDebriefScreen.tsx` (شغالين ممتاز)

---

## 🎨 الـ Color Grading والاتساق البصري

كل الصور تم توليدها بنفس الـ style prefix (teal-orange cinematic). هنضمن الاتساق بـ:

1. **نفس الـ overlay gradient** على كل المشاهد: `from-background/95 via-background/20 to-transparent`
2. **نفس مدة Ken Burns**: 8s slow zoom 1.05x
3. **نفس مدة الـ crossfade**: 0.8-1.0s بين phases
4. **نفس font weights ونفس الـ glassmorphism**: `bg-card/65 border border-border` على كل الـ text overlays

---

## ✅ الترتيب الزمني للمشهد الكامل (من الدخول للنهاية)

```text
1. CompanyBriefing
   ├─ [2.5s] prism-building-exterior         (auto)
   ├─ [click] prism-hallway                  
   ├─ [2.5s] prism-knock-{g}                 (auto + sound)
   ├─ [click] mansour-office-welcome-{g}     
   └─ [dialogue] mansour-office-seated-{g}   (EnhancedDialogue)

2. TravelScreen
   ├─ [3.5s] city-drive-luxury-{g}
   └─ [2.8s] velaro-street                   → auto onComplete

3. ArrivalScreen
   ├─ [click] velaro-storefront
   ├─ [2.2s] velaro-entering-{g}             (auto)
   ├─ [2.5s] velaro-interior-wide            (auto)
   └─ [dialogue] hisham-greeting-{g} → hisham-office-seated-{g}

4. InquiryScreen (existing — gender fix)
   └─ Dynamic scenes per question track

5. ReflectionTransition
   └─ [4.5s] analyst-reflecting-{g}

6. FramingScreen
   └─ Static framing-board-desk + UI

7. PresentationScreen
   ├─ [dialogue] hisham-receiving-report-{g}
   └─ [click] "📧 أرسل لأستاذ منصور" → EmailSendScreen

8. EmailSendScreen → MansourReceivesEmail → IncomingCall → PhoneCallDebrief → Result
   (شغالين ممتاز — مفيش تعديل)
```

---

## 🛡️ ضمانات

- ✅ **مفيش imports مكسورة** — هحذف كل reference لصورة محذوفة
- ✅ **كل صورة gender-aware** زي ما المفروض (أو static لو الصورة عامة)
- ✅ **مفيش delay** بعد click — كل phase change instant + preloaded
- ✅ **انتقالات نظيفة** بـ `AnimatePresence mode="wait"`
- ✅ **التوقيتات محسوبة** لإحساس سينمائي (مش طويلة، مش قصيرة)
- ✅ **اللوجيك صفر تغيير** — scoring, framing, choices زي ما هي
- ✅ **مفيش backdrop-blur** على الصور — الصور واضحة طول الوقت
- ✅ **Auth + Framing build errors اتصلحوا**

---

## 🎯 النتيجة المتوقعة

اللاعب هيحس إنه **بيشاهد فيلم تفاعلي**:
- يدخل مبنى Prism فاخر بالليل ✨
- يمشي في الممر، يطرق الباب، الباب يفتح
- يقابل منصور في مكتبه، يسمع البريفينغ
- يركب عربية فخمة، يوصل حي راقي، يدخل VELARO
- يشوف الصالة الفخمة، يقابل هشام، يدخل مكتبه
- يسأل أسئلته، الكادرات بتتبدل حسب السؤال
- يفكّر في كافيه، يبني الـ framing
- يقدم لهشام، يبعت إيميل لمنصور، منصور يرن عليه

**كل الانتقالات سلسة، كل صورة في وقتها، كل صوت متزامن.**

