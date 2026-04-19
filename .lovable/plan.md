

## فهمتها بالظبط دلوقتي — وهقولك إيه اللي صح وإيه اللي غلطت فيه قبل كده

### 3 غلطات عملتها في الـ blueprint السابق:
1. حطيت Chart في S2 — **غلط**. S2 سؤال كلامي بس (نزلت قد إيه؟ مقارنة بإيه؟)
2. خليت breakdown في S3 — **غلط**. الـ breakdown ده S5
3. السؤال الغلط في S2 خليته "نعمل تخفيضات" (قفز لحل) — **غلط**. الصح إنه "وريني البيانات" (طلب بيانات بدري قبل تثبيت baseline)

### الترتيب الصح اللي اتأكدت منه من الـ chat كامل:

| Node | السؤال الصح | Evidence فوري في نفس الرد |
|---|---|---|
| **S1** | "إيه اللي مخليك حاسس إن في مشكلة؟" | كلام بس |
| **S2** | "أقل بنسبة قد إيه؟ ومقارنة بإيه بالظبط؟" | كلام: "30% vs نفس الشهر السنة اللي فاتت" |
| **S3** | "وريني المقارنة دي بشكل واضح" | **Chart 1**: bar chart شهرين (300 vs 430) |
| **S4** | "وريني السنة اللي قبل اللي فاتت كمان" | **Chart 2**: 3 سنين (290 / 430 / 300) |
| **S5** | "فكك الرقم: أفراد ولا شركات؟" | **Chart 3**: stacked breakdown (يكشف طلبية الشركات 150 في السنة اللي فاتت) |

---

## القاعدة الذهبية للـ Evidence (نقطتك المهمة):

لما اللاعب يقول "وريني البيانات" → في **نفس الـ dialogue line** يجي:
- نص رد أبو سعيد + **Chart مدمج فورًا** + ملاحظة قابلة للحفظ

مفيش "تمام أقدر أوريك" → جولة جديدة → "طب وريني فعلاً". الـ chart جزء من الرد، مش حدث منفصل.

---

## شكل الشجرة الكامل

```text
S1 ──صح──→ S2 ──صح──→ S3 [Chart1] ──صح──→ S4 [Chart2] ──صح──→ S5 [Chart3] ──→ Framing✓
 │                      │                    │                    │
 غلط                   غلط                  غلط                  غلط
 ↓                      ↓                    ↓                    ↓
 R1                  Track B              Track A              Track C
 ├──صح──→ S2 (خسر سؤال — يوصل أقصاه S4)
 └──غلط──→ Track A

S5 غلط ──→ Track D
```

**Recovery مرة وحدة بس بعد S1.** بعدها أي غلطة = دخول Track غلط نهائي مفيهوش رجوع.

---

## تنوع الفخاخ (نقطتك الجوهرية):

| Node | السؤال الغلط | نوع الفخ (مش كلها بيانات) |
|---|---|---|
| S1 | "حاسس إن المشكلة من فريق البيع؟" | **قفز لسبب داخلي** بدري |
| R1 | "مين من الفريق أقل أداء؟" | تعميق نفس الفرضية الداخلية |
| S2 | "وريني البيانات اللي عندك" | **طلب بيانات قبل baseline** (الوحيد) |
| S3 | "وريني أداء فريق البيع" | **قفز لسبب داخلي** بعد ما شاف الفرق |
| S4 | "وريني أسعار المنافسين" | **قفز لسبب خارجي** |
| S5 | "وريني أداء الحملات الإعلانية" | **قفز لحل تسويقي** |

→ تنوع: قفز لسبب داخلي / قفز لسبب خارجي / قفز لحل / طلب بيانات بدري. مش رتيب.

---

## الـ 4 Wrong Tracks (مقنعة بس مش "محبوكة لدرجة تبان صح")

### Track A — التنفيذ الداخلي (يدخل من R1-W أو S3-W)
- **A1**: "أداء كل فرد في الفريق؟" → Dashboard (كريم 110 / سامح 75 / وليد 60 / هاني 55)
- **A2**: "ومن ناحية الإقفال؟" → جدول conversion (28% / 21% / 17% / 16%)
- **A3**: "في تدريب أو متابعة ناقصة؟" → اعتراف جزئي
- **Framing غلط**: "المشكلة في التنفيذ — تدريب ومتابعة"

### Track B — التشغيل اليومي (يدخل من S2-W)
- **B1**: "البيع اليومي خلال الشهر؟" → daily chart (تذبذب)
- **B2**: "نبص أسبوعيًا؟" → weekly (78/92/71/59)
- **B3**: "ظرف تشغيلي؟ stock؟" → اعتراف بـ stock delay
- **Framing غلط**: "المشكلة تشغيلية داخل الشهر"

### Track C — المنافسين/السعر (يدخل من S4-W)
- **C1**: "أسعار المنافسين؟" → عروض (10% خصم، 2+1)
- **C2**: "اعتراضات العملاء على السعر؟" → feedback مختصر
- **C3**: "كنا محتاجين رد سعري؟" → "وارد"
- **Framing غلط**: "المشكلة ضغط تنافسي/سعري — خصومات"

### Track D — التسويق/الطلب (يدخل من S5-W)
- **D1**: "ميزانية الإعلانات والحملات؟" → marketing dashboard
- **D2**: "الـ reach والـ engagement أقل؟" → فرق بسيط
- **D3**: "نزود الإعلانات؟" → "وارد جدًا"
- **Framing غلط**: "المشكلة في الطلب — حملة تنشيط"

كل Track ينتهي بجملة من أبو سعيد فيها شك خفيف: **"الصورة بقت أوضح... بس أنا لسه عندي حاجة جوايا مش مرتاحلها 100%"** — تلميح بدون تسريب.

---

## لوحة التأطير النهائية (4 أقسام × 4 خيارات — مفتوحة للكل)

| القسم | الصح | غلط A | غلط B | غلط C / D |
|---|---|---|---|---|
| **1. المشكلة كما رآها أبو سعيد** | "أقل من المتوقع" | (نفس الصح في كل القسم 1) | | |
| **2. الفرضية اللي مشيت وراها** | "المقارنة نفسها مش مفحوصة" | "أداء الفريق ضعيف" | "اضطراب داخل الشهر" | "ضغط منافسين" / "طلب ضعيف" |
| **3. التأطير الأدق** | "baseline مضللة" | "تنفيذ داخلي" | "تشغيلي/يومي" | "سعري" / "تسويقي" |
| **4. القرار التالي** | "إعادة تقييم المرجع قبل أي تدخل" | "تدريب ومتابعة" | "تحسين التشغيل" | "خصومات" / "حملة تنشيط" |

**مفتوحة لكل اللاعبين** — اللاعب اللي مشي صح هيختار الصح بسهولة، اللي مشي في track ممكن يلاحظ تناقض ويصحح، أو يختار اللي يطابق مساره ويفشل.

---

## التقييم (Strong / Medium / Weak)

| النتيجة | الشرط |
|---|---|
| **Strong** | S1→S5 كلهم صح + Framing صحيح |
| **Medium** | Recovery + S2/S3/S4 صح + Framing صحيح (وصل للحقيقة جزئيًا) |
| **Weak** | دخل أي Track + Framing غلط |

---

## الأرقام الرسمية (من الـ chat حرفيًا)

- **Chart 1**: الشهر الحالي 300 ألف / نفس الشهر السنة اللي فاتت 430 ألف (فرق ~30%)
- **Chart 2**: السنة الأسبق 290 / السنة اللي فاتت 430 / الحالي 300
- **Chart 3 (breakdown)**:
  - الأسبق: أفراد 270 + شركات 20
  - السنة اللي فاتت: أفراد 280 + شركات **150** ← الطفرة
  - الحالي: أفراد 290 + شركات 10
  - بدون الشركات: 270 → 280 → 290 = **نمو طبيعي تدريجي**

---

## الهيكل التقني للتنفيذ

### ملفات هتتحذف بالكامل (النظام القديم):
- `src/lib/pf-case-engine/applyQuestionChoice.ts`
- `src/lib/pf-case-engine/canOpenFollowUp.ts`
- `src/lib/pf-case-engine/canOpenFraming.ts`
- `src/lib/pf-case-engine/getAvailableBundle.ts`
- `src/lib/pf-case-engine/buildCaseOutcome.ts`
- `src/lib/pf-case-engine/evaluateFraming.ts`
- `src/lib/pf-case/abu-saeed-case.ts`
- `src/lib/pf-case/framing-builder.ts`
- `src/lib/pf-case/notes-catalog.ts` (يعاد بناؤه)
- `src/data/pf-scenario.ts` (legacy)

### ملفات جديدة (Source of Truth الجديدة):

**`src/lib/pf-case/case-tree.ts`** — تعريف 12 node:
```
S1, R1, S2, S3, S4, S5
TRACK_A_1, TRACK_A_2, TRACK_A_3
TRACK_B_1, TRACK_B_2, TRACK_B_3
TRACK_C_1, TRACK_C_2, TRACK_C_3
TRACK_D_1, TRACK_D_2, TRACK_D_3
```
كل node فيه: `{ correctOption, wrongOption, abuSaeedReply, evidenceId?, noteCandidate?, nextOnCorrect, nextOnWrong }`

**`src/lib/pf-case/evidence-catalog.ts`** — 7 charts:
- Chart 1: year_vs_year (bar)
- Chart 2: three_year (bar)
- Chart 3: breakdown_stacked (stacked bar)
- Track A: team_performance + conversion_table
- Track B: daily_sales + weekly_grouping
- Track C: competitor_offers + customer_feedback
- Track D: marketing_dashboard

**`src/lib/pf-case/framing-board.ts`** — 4×4 مفتوحة + correctSelections.

**`src/lib/pf-case/scripts.ts`** — كل الردود والصياغات بالعربي المصري (من chat.txt حرفيًا).

**`src/lib/pf-case-engine/gameStateMachine.ts`** — محرك واحد بسيط:
```ts
GameState = { currentNodeId, questionsUsed, hasUsedRecovery, trackEntered, history, evidenceSeen, savedNotes }
applyChoice(state, 'correct'|'wrong')
getCurrentNode(state) → { question, wrongQuestion, ... }
isComplete(state) → boolean
evaluate(state, framingChoices) → 'strong'|'medium'|'weak'
```

### تكييف الـ UI (الواجهة تفضل زي ما هي):

| Screen | التغيير |
|---|---|
| `EnhancedDialogue.tsx` | يقبل `inlineEvidence?: EvidenceData` ويعرض Chart بين الـ lines |
| `InquiryScreen.tsx` | **خيارين فقط** (صح + غلط مخلوطين عشوائيًا)، يعرض Chart embedded |
| `FramingScreen.tsx` | لوحة 4×4 مفتوحة |
| `PresentationScreen.tsx` | تقرير لأبو سعيد مبني على المسار |
| `DebriefScreen.tsx` | منصور يرد حسب outcome + المسار |
| `ResultScreen.tsx` | Strong/Medium/Weak + شرح المسار |
| `PFGameContext.tsx` | API جديد بس، تنظيف كامل |
| Charts component | استخدام `recharts` (موجودة في package) |

---

## خطة التنفيذ على مراحل (8 مراحل)

| م | الشغل | الناتج |
|---|---|---|
| **1** | بناء `case-tree.ts` + `scripts.ts` (كل الـ 18 node بالنصوص الكاملة من chat.txt) | المحتوى جاهز |
| **2** | بناء `evidence-catalog.ts` + مكوّن Chart بالـ recharts | Charts قابلة للعرض |
| **3** | بناء `framing-board.ts` (4×4) | لوحة جاهزة |
| **4** | بناء `gameStateMachine.ts` + `evaluate.ts` | المحرك شغال |
| **5** | تنظيف كامل لـ `PFGameContext.tsx` (API جديد) | State management نظيف |
| **6** | تكييف `EnhancedDialogue.tsx` لدعم inline evidence | الـ Chart يظهر embedded |
| **7** | إعادة كتابة `InquiryScreen` + `FramingScreen` (UI زي ما هو) | Gameplay شغال end-to-end |
| **8** | تكييف `Presentation`/`Debrief`/`Result` + حذف الملفات القديمة + اختبار | الكيس كاملة |

كل مرحلة قابلة للاختبار لوحدها. الـ build هيفضل سليم في كل خطوة.

---

## ضمانات

- **مفيش تسريب**: السؤال الصح والغلط بيتعرضوا مخلوطين عشوائيًا، نفس الـ styling، مفيش مؤشر بصري.
- **الـ UI ثابت 100%**: نفس الخلفيات، الـ ambient sounds، الـ animations، الـ notebook، الـ travel screens، شخصية منصور.
- **الـ scripts بالعربي المصري** زي اللي في chat.txt حرفيًا.
- **اللاعب يقدر يرجع للجملة اللي فاتت** (الميزة اللي اتعملت قبل كده) تفضل شغالة.

