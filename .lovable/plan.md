

# 🗑️ خطة حذف نظام HUD الوقت بالكامل

## ✅ فهمت بالظبط

عايز ترجع للنظام البسيط:
- **5 أسئلة بس** — ايا كان اختيار اللاعب صح أو غلط، يكمل لحد ما يخلص الـ 5
- **مفيش HUD وقت** على الشاشة
- **مفيش تكلفة وقت** (3 أو 5 دقايق) لكل سؤال
- **مفيش رد سردي** من هشام لما الوقت يخلص (لأن مفيش وقت أصلاً)
- **مفيش حالة `timeout`** — اللعبة تنتهي بس لما اللاعب يخلص الـ 5 أسئلة أو يوصل لـ END

⚠️ **مش هلمس**:
- الصور الجديدة في `src/assets/scenes/`
- مشاهد الإيميل والمكالمة (`EmailSendScreen`, `MansourReceivesEmailScreen`, `IncomingCallScreen`, `PhoneCallDebriefScreen`)
- شجرة الأسئلة، المسارات، الـ recovery، التأطير، التقييم
- أي كود تاني خارج نظام الوقت

---

## 📋 الملفات اللي هتتعدل

### 1. `src/components/game/TimeBudgetHUD.tsx` — **حذف الملف بالكامل**
الـ component ده مش هيتستخدم أصلاً.

### 2. `src/lib/pf-case/case-tree.ts` — **حذف ثوابت الوقت**
نشيل الكتلة دي من آخر الملف:
```ts
export const TOTAL_TIME_BUDGET = 15;
export const TIME_COST_CORRECT = 3;
export const TIME_COST_WRONG = 5;
export const getTimeCost = (choice) => ...
```
**نسيب**: `TOTAL_QUESTION_BUDGET = 5` (ده الأصلي من غير علاقة بالوقت).

### 3. `src/lib/pf-case/mansour-scripts.ts` — **حذف `ABU_SAEED_TIMEOUT_LINE`**
نشيل الـ export ده بالكامل (السطور 107-113).

### 4. `src/lib/pf-case-engine/gameStateMachine.ts` — **حذف منطق الوقت**
- نشيل من الـ imports: `TOTAL_TIME_BUDGET`, `getTimeCost`
- نشيل من `GameState` interface: `timeRemaining`, `lastTimeCost`, `endedByTimeout`
- نشيل من `initialGameState` نفس الحقول
- في `applyChoice`: نشيل حساب `timeCost`, `timeRemaining`, `timeExhausted`, `endedByTimeout`
- شرط الإكمال يرجع: `isComplete = reachedEnd || questionsUsed >= TOTAL_QUESTION_BUDGET` (بدون `timeExhausted`)

### 5. `src/contexts/PFGameContext.tsx` — **تنظيف**
الـ context بيستخدم spread `...result.nextState` فهيتنظف تلقائي. بس نتأكد إن مفيش reference مباشر للحقول المحذوفة.

### 6. `src/components/game/screens/InquiryScreen.tsx` — **تنظيف كامل**
- نشيل import: `TimeBudgetHUD`, `ABU_SAEED_TIMEOUT_LINE`
- نشيل الـ state: `costFlashKey`
- نشيل `phase: "timeout"` من الـ union — يبقى `"choosing" | "dialogue"` بس
- نشيل `setCostFlashKey((k) => k + 1)` من `handlePick`
- نشيل branch `state.endedByTimeout` من `handleDialogueComplete` و `useEffect`
- نشيل `handleTimeoutComplete`
- نشيل rendering الـ `<TimeBudgetHUD ... />`
- نشيل block `{phase === "timeout" && ...}` بالكامل
- نشيل `if (phase === "timeout") return ownerOffice;` من `dialogueScene`

---

## 🛡️ ضمانات

- ✅ اللعبة هترجع تشتغل بـ **5 أسئلة بالظبط** بدون أي قيد وقت
- ✅ الـ HUD الوقت هيختفي تماماً من الشاشة
- ✅ مفيش رد timeout من هشام أبداً
- ✅ كل التحسينات السينمائية والصور الجديدة ومشاهد الإيميل/المكالمة **مش هتتلمس**
- ✅ شجرة الأسئلة وكل اللوجيك التحليلي **زي ما هو 100%**
- ✅ مفيش imports مكسورة بعد التنظيف

---

## 🎯 النتيجة

اللاعب هيدخل المحادثة، يلاقي **مفيش ساعة ومفيش ضغط وقت**، يسأل 5 أسئلة بحرية كاملة (ايا كانت صح أو غلط)، وبعدها يروح للتأطير عادي. زي ما كان قبل ما نضيف الـ HUD أصلاً.

