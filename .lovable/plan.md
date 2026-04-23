

# 🎯 الخطة: تحسينات السلاسة والواجهة في مرحلة الأسئلة

## أولاً: ملخص فهمي لطلباتك (٦ تعديلات)

| # | التعديل | الحالة |
|---|---|---|
| 1 | **حذف سؤال المحلل** من الـ dialogue بعد اختيار الخيار → يظهر رد هشام مباشرة (مؤقت، قابل للرجوع) | تسريع |
| 2 | **مستطيل التقرير كله Clickable** بدل زر "افتح التقرير" بس | UX |
| 3 | **مشهد العربية (TravelScreen)** يقل ٢ ثانية: 9s → 7s | تسريع |
| 4 | **مشهد الوصول (ArrivalScreen)** يقل ١ ثانية في الانتقالات الأوتوماتيكية | تسريع |
| 5 | **الدفتر** يفضل ظاهر دايمًا ومش يتدارى تحت الـ Dialogue (نقله أو رفع z-index) | UX |
| 6 | **زر إعادة المحادثة**: تغيير الاسم + الشكل + المكان + يرجع من أول دخول المتجر + ٢ محاولات | UX + Logic |

---

## ثانياً: التفاصيل الدقيقة لكل تعديل

### 1️⃣ حذف سؤال المحلل من الـ Dialogue (مؤقتًا)

**الملف:** `src/components/game/screens/InquiryScreen.tsx` (السطور ٩٢–١٠٣)

**الحالي:**
```ts
const lines: DialogueLineUI[] = [
  { characterId: "detective", text: result.questionText, mood: "neutral" },  // ← السؤال
  { characterId: "hisham", text: result.responseText, ... },                  // ← الرد
];
```

**الجديد:** نعلّق سطر المحلل بـ comment واضح للرجوع لاحقًا:
```ts
const lines: DialogueLineUI[] = [
  // TEMPORARILY HIDDEN — uncomment to restore analyst question line
  // { characterId: "detective", text: result.questionText, mood: "neutral" },
  { characterId: "hisham", text: result.responseText, ... },
];
```

✅ بضغطة واحدة في المستقبل ترجع زي ما كانت.

---

### 2️⃣ مستطيل التقرير كله Clickable

**الملف:** `src/components/game/EnhancedDialogue.tsx` (السطور ٢٨٨–٣١٧)

**التغيير:**
- نحوّل الـ `motion.div` للتقرير من container عادي إلى **زر كامل**.
- نشيل زر "افتح التقرير" المنفصل، ونحط مكانه **أيقونة بسيطة** (سهم ◀ أو chevron) في الجهة الشمال كإشارة بصرية فقط.
- نضيف `onClick` على الـ container كله مع `e.stopPropagation()` عشان ما يتقدمش الـ dialogue.
- نضيف `hover` effect (border يبقى أوضح + scale خفيف) للوضوح إنه قابل للضغط.

**النتيجة البصرية:**
```
┌──────────────────────────────────────┐
│ 📄 أ. هشام سلّمك تقرير               │
│    تقرير المبيعات الشهري        ◀  │  ← المستطيل كله Clickable
└──────────────────────────────────────┘
```

✅ مفيش مخاطرة إن المستخدم يعدّي الرد عن طريق الخطأ.

---

### 3️⃣ تسريع TravelScreen بمقدار ٢ ثانية

**الملف:** `src/components/game/screens/TravelScreen.tsx` (السطر ١٢)

**التغيير:**
- `TOTAL_DURATION: 9000` → `7000`
- إعادة ضبط توقيتات الـ MONOLOGUES عشان تفضل متوزّعة بشكل طبيعي:
  - `{ at: 1000, dur: 2000 }` (بدل 1400/2400)
  - `{ at: 3300, dur: 2000 }` (بدل 4400/2400)
  - `{ at: 5500, dur: 1500 }` (بدل 7000/1800)

✅ نفس الإحساس السينمائي بس أسرع، مفيش تغيير في الصورة أو الحركة.

---

### 4️⃣ تسريع ArrivalScreen بمقدار ١ ثانية

**الملف:** `src/components/game/screens/ArrivalScreen.tsx` (السطور ٦٠–٧٠)

**التغيير:**
- `entering → interior`: `2200ms` → `1700ms` (-500ms)
- `interior → dialogue`: `2500ms` → `2000ms` (-500ms)
- **المجموع:** -1000ms = ثانية كاملة

✅ مفيش تغيير في الصور ولا الانتقالات البصرية.

---

### 5️⃣ الدفتر يفضل ظاهر فوق الـ Dialogue

**المشكلة الحالية:** زر الدفتر `z-50` والـ Dialogue كمان `z-50` → الـ Dialogue بيغطي على الزر لأنه بياخد مساحة أكبر من الأسفل.

**الملف:** `src/components/game/PFNotebook.tsx` (السطر ٦٠)

**الحل المقترح (الأنسب):**
- نرفع z-index الزر إلى **`z-[55]`** (فوق الـ Dialogue اللي عند `z-50`).
- ننقل الزر من `bottom-6 right-6` إلى **`top-20 right-6`** (أعلى الشاشة على اليمين، تحت progress dots مباشرة) → كده مش بيتعارض مع الـ Dialogue اللي بياخد النصف السفلي بالكامل.
- نخلّي البادج (العدد) والـ glow effect واضحين عشان يلفت النظر.

**النتيجة:**
```
┌─────────────────────────────────┐
│  ●●○○○○      📓 الدفتر [3] ←  │  ← موضع جديد ثابت
│                                  │
│         [خلفية]                  │
│                                  │
│  ┌───────────────────────────┐  │
│  │  🗨️  Dialogue هشام        │  │  ← الديالوج تحت
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

✅ ظاهر دايمًا، وفي مكان منطقي بعيد عن الـ Dialogue.

---

### 6️⃣ زر "اطلب محادثة جديدة من البداية" — إعادة تصميم كامل

#### أ) الملف: `src/components/game/screens/InquiryScreen.tsx`

**المشاكل الحالية:**
- اسمه: "إعادة المحادثة" → نغيّره
- مكانه: `fixed bottom-24 left-4` → بيتعارض مع الـ Dialogue
- شكله: زر صغير أبيض عادي → مش لافت
- وظيفته: بترجّع لبداية الأسئلة فقط
- العدد: محاولة واحدة → نخليها اتنين

#### ب) التغييرات:

**1. الاسم:**
```
"إعادة المحادثة" → "اطلب محادثة جديدة من البداية"
```

**2. الشكل والمكان:**
```tsx
className="fixed top-4 left-4 z-[55] flex items-center gap-2 px-4 py-2.5 
  rounded-full border-2 border-amber-400/60 
  bg-gradient-to-r from-amber-500/20 to-orange-500/20 
  backdrop-blur-md text-amber-300 font-bold text-xs 
  shadow-lg shadow-amber-500/30 
  hover:shadow-amber-500/50 hover:scale-105 
  animate-pulse-subtle transition-all"
```
- **المكان:** `top-4 left-4` (أعلى يسار، بعيد عن progress dots اللي على اليمين، وبعيد عن الـ Dialogue).
- **الحجم:** صغير ومتزن (`px-4 py-2.5`).
- **اللون:** ذهبي/برتقالي مميز (مش primary) عشان يلفت النظر بدون إزعاج.
- **z-index:** `z-[55]` فوق الـ Dialogue.
- **Animation:** pulse خفيف عشان واضح إنه فعّال.

**3. زيادة المحاولات إلى ٢:**

**الملف:** `src/contexts/PFGameContext.tsx`
```ts
canRestart: state.restartCount < 2,  // كان < 1
```

**الملف:** `src/lib/pf-case-engine/gameStateMachine.ts` (داخل `restartInquiry` لو فيه فحص)
```ts
if (prev.restartCount >= 2) return prev;  // كان >= 1
```

**4. الإعادة من بداية الترحيب (مش الأسئلة فقط):**

**الملف:** `src/contexts/PFGameContext.tsx` — إضافة flag جديد:
```ts
interface PFGameContextValue {
  // ...
  restartFromBeginning: boolean;  // جديد
  consumeRestartFlag: () => void; // جديد
}
```

**الملف:** `src/pages/Index.tsx` — نراقب الـ flag:
```ts
const { restartFromBeginning, consumeRestartFlag } = usePFGame();

useEffect(() => {
  if (restartFromBeginning) {
    consumeRestartFlag();
    setCurrentScreen("arrival");  // يرجع لمشهد دخول المتجر + ترحيب هشام
  }
}, [restartFromBeginning]);
```

**في `restartInquiry` بـ PFGameContext:**
```ts
const restartInquiry = useCallback(() => {
  setState((prev) => {
    if (prev.restartCount >= 2) return prev;
    return {
      ...prev,
      ...resetInquiryState(),
      notes: [],
      collectedReports: [],
      restartCount: prev.restartCount + 1,
      restartFromBeginning: true,  // ← يطلق الـ navigation
    };
  });
}, []);
```

**5. تحديث شرط ظهور الزر** — يفضل ظاهر طول ما `restartCount < 2`:
```ts
const showRestartButton =
  canRestart &&  // الآن يسمح بمحاولتين
  state.questionsUsed >= 1 &&
  state.questionsUsed < 4 &&
  !state.isComplete &&
  phase === "choosing";
```

**6. تحديث الـ Modal:**
- العنوان: "اطلب محادثة جديدة من البداية؟"
- الرسالة الجديدة: "هترجع تاني لمشهد دخولك المحل ومحادثة الترحيب مع أ. هشام، وكل الملاحظات والتقارير اللي جمعتها هتتمسح. متبقّى لك **{2 - restartCount}** محاولة."
- زرار التأكيد: "أيوه، ابدأ من الأول"

---

## ثالثاً: الملفات اللي هتتعدل (جدول مختصر)

| الملف | التعديلات |
|---|---|
| `src/components/game/screens/InquiryScreen.tsx` | حذف سؤال المحلل (مؤقت) + إعادة تصميم زر Restart + تحديث الـ modal |
| `src/components/game/EnhancedDialogue.tsx` | مستطيل التقرير Clickable كله |
| `src/components/game/screens/TravelScreen.tsx` | TOTAL_DURATION من 9000 → 7000 + توقيتات monologues |
| `src/components/game/screens/ArrivalScreen.tsx` | تخفيض timeouts من 2200/2500 → 1700/2000 |
| `src/components/game/PFNotebook.tsx` | نقل الزر من `bottom-6 right-6` → `top-20 right-6` + رفع z-index |
| `src/contexts/PFGameContext.tsx` | `restartCount < 2` + flag `restartFromBeginning` + `consumeRestartFlag` |
| `src/pages/Index.tsx` | useEffect يرجع لـ `arrival` لما الـ flag ينطلق |

---

## رابعاً: ضمانات

✅ **سؤال المحلل مؤقت بس** — comment واضح للرجوع لاحقًا.  
✅ **مستطيل التقرير** سهل الفتح من أي نقطة + مفيش مخاطرة لتجاوز الرد.  
✅ **التوقيتات أسرع** بدون تشويه الإحساس السينمائي.  
✅ **الدفتر ظاهر دايمًا** فوق الـ Dialogue ومش يتدارى.  
✅ **زر Restart** فخم، واضح، قابل للضغط، ٢ محاولات، يرجّع لأول دخول المحل.  
✅ مفيش تأثير على شجرة الأسئلة، السكوريبتات، أو الـ Framing Board.

