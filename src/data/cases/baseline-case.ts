// ============================================================================
// Baseline Case — "المقارنة الخاطئة"
// Full implementation of the design doc (.lovable/plan.md)
// Lesson: "Compared to what?" — challenge the baseline before chasing causes
// ============================================================================

import type {
  Case,
  Question,
  Evidence,
  FramingComponent,
  FramingCombo,
  EvaluationAxis,
} from "@/types/case";

// ----------------------------------------------------------------------------
// 1. Truth
// ----------------------------------------------------------------------------
const truth: Case["truth"] = {
  surfaceSymptom: "مبيعات الموسم الحالي أقل بـ 20% من السنة اللي فاتت",
  presentedRequest: "اعمل لي خطة تخفيضات وعروض عشان تنشّط الحركة",
  misleadingInterpretation:
    "في مشكلة جذب — الناس مش بتشتري — لازم نحرّك الحركة بالسعر",
  hiddenReality:
    "الموسم الحالي طبيعي. الموسم السابق (2024) كان استثنائياً بسبب عاملين خارجيين انتهوا: " +
    "(أ) افتتاح مول كبير على بُعد 200 متر سبتمبر 2024 جاب موجة مشاة ضخمة لـ 4-5 شهور. " +
    "(ب) سوق رمضاني كبير في الميدان قدام المتجر — السنة دي السوق اتنقل لميدان تاني. " +
    "لو نفّذ الخصومات هيخسر 15-20% من هامش الربح على بيع كان هيحصل أصلاً.",
  correctFraming:
    "العَرَض مش مشكلة أداء — العَرَض هو مقارنة غير عادلة. المرجع كان استثنائياً " +
    "بسبب عاملين خارجيين انتهوا. الأرقام الحالية هي خط الأساس الطبيعي. " +
    "التوصية: لا تخفيضات. أعد بناء baseline من متوسط 3 سنوات.",
  keyLesson:
    "أي رقم بدون مرجع هو ضوضاء. قبل ما تسأل 'ليه نزلت؟'، اسأل 'مقارن بإيه؟'. " +
    "المقارنة نفسها هي أول فرضية لازم تختبرها.",
};

// ----------------------------------------------------------------------------
// 2. Briefing
// ----------------------------------------------------------------------------
const briefingContext = `أبو سعيد صاحب متجر "بيت الموضة" في منطقة شعبية بالقاهرة. شغّال 12 سنة، عائلي.
نزل المكتب يطلب استشارة. بيقول إن مبيعات موسم رمضان/العيد أقل بـ 20% عن السنة اللي فاتت.
عايز "حلّ سريع" — تخفيضات وعروض.

مهمتك: روح للمتجر، اتكلم مع أبو سعيد، افهم الموقف، ارجعلي بـ تأطير للمشكلة. مش حلول دلوقتي — تأطير.`;

// ----------------------------------------------------------------------------
// 3. Question Bank (20)
// ----------------------------------------------------------------------------
const questionBank: Question[] = [
  // ---------- Golden (5) ----------
  {
    id: "Q1",
    text: "السنة اللي فاتت اللي بتقارن بيها — كانت سنة عادية ولا حصل فيها حاجة استثنائية في المنطقة؟",
    category: "golden",
    reveals: ["E1", "E2"],
    characterResponse:
      "استثنائية إزاي يعني؟ ... آه استنى، السنة اللي فاتت كان فيه افتتاح مول جنبنا في سبتمبر، جاب ناس كتير المنطقة. وكمان كان فيه سوق رمضاني كبير في الميدان قدامنا — السنة دي السوق ده اتنقل.",
    characterMood: "thoughtful",
    trustImpact: 1,
  },
  {
    id: "Q2",
    text: "ممكن نشوف أرقام مبيعات الـ 3 أو 4 سنين اللي فاتوا، مش بس السنة اللي فاتت؟",
    category: "golden",
    reveals: ["E3", "E4"],
    characterResponse:
      "والله أنا مش محتفظ بأرقام تفصيلية، بس عندي إجمالي كل سنة في دفتر. خليني أجيبه ... [يجيب الدفتر] ... بص: 2022 الموسم كان حوالي 180 ألف، 2023 كان 195 ألف، 2024 كان 240 ألف، السنة دي لحد دلوقتي 192 ألف.",
    characterMood: "open",
    trustImpact: 1,
  },
  {
    id: "Q3",
    text: "الزباين اللي بتدخل المحل دلوقتي — قليلين أو زي العادي؟ وبيشتروا ولا بيتفرجوا؟",
    category: "golden",
    reveals: ["E5", "E6"],
    characterResponse:
      "والله الحركة... [يفكر] ... مش وحشة. بتدخل ناس عادي. اللي بيدخل أغلبه بيشتري. بس مش زي السنة اللي فاتت اللي كانوا داخلين فوج ورا فوج — السنة دي ناس المنطقة بس.",
    characterMood: "thoughtful",
    trustImpact: 1,
  },
  {
    id: "Q4",
    text: "لو عملنا الخصومات اللي بتفكر فيها، هامش الربح هيتأثر إزاي؟ بتربح كام في القطعة دلوقتي وهتربح كام بعد الخصم؟",
    category: "golden",
    reveals: ["E7", "E8"],
    characterResponse:
      "الهامش عندي حوالي 35% على القطعة. لو عملت 20% خصم زي ما بفكر، الهامش هيبقى حوالي 15%. ... [يصمت] ... يعني تقريباً نص الربح.",
    characterMood: "thoughtful",
    trustImpact: 0,
  },
  {
    id: "Q5",
    text: "في المنطقة حواليك — في حاجة اتغيرت في آخر سنة؟ مولات، أسواق، طرق، أي حاجة؟",
    category: "golden",
    reveals: ["E2", "E9", "E10"],
    characterResponse:
      "آه طبعاً. السوق الرمضاني اللي كان قدامنا اتنقل لميدان تاني. وفي شارع جنبنا قفلوه للترميم من 4 شهور. الحركة في المنطقة كلها قلت شوية مش بس عندي.",
    characterMood: "open",
    trustImpact: 1,
  },

  // ---------- Misleading-deep (6) ----------
  {
    id: "Q6",
    text: "في تغيير في طاقم البيع؟ موظف جديد ممكن مش بيتعامل كويس مع الزباين؟",
    category: "misleading-deep",
    reveals: ["E11"],
    characterResponse:
      "لأ والله، نفس الطاقم من 3 سنين. ولاد كويسين، الزباين بتحبهم. مفيش شكاوى.",
    characterMood: "neutral",
    trustImpact: 0,
  },
  {
    id: "Q7",
    text: "ممكن المنتجات بقت قديمة على ذوق الزباين؟ في موضة فاتتك؟",
    category: "misleading-deep",
    reveals: ["E12"],
    characterResponse:
      "أنا بجدد المخزون كل موسم زي العادة. نفس الموردين، نفس الجودة. واللي بيشتري راضي.",
    characterMood: "annoyed",
    trustImpact: -1,
  },
  {
    id: "Q8",
    text: "الناس بقت بتشتكي من الأسعار والاقتصاد. هل ده بيأثر عليك؟",
    category: "misleading-deep",
    reveals: ["E13"],
    characterResponse:
      "بصراحة الكل بيقول كده، بس اللي بيدخل المحل بيشتري عادي. مش حاسس فرق كبير في قدرة الزبون.",
    characterMood: "neutral",
    trustImpact: 0,
  },
  {
    id: "Q9",
    text: "في محلات جديدة فتحت قريب منك بتاخد منك زباين؟",
    category: "misleading-deep",
    reveals: ["E14", "E1"],
    characterResponse:
      "المول اللي فتح من سنة فيه محلات ملابس آه. بس زباينّي القدام مستمرين معايا. الناس اللي راحت للمول ناس مكنتش زباين أصلاً.",
    characterMood: "neutral",
    trustImpact: 0,
  },
  {
    id: "Q10",
    text: "بتعمل أي تسويق على السوشيال ميديا أو إعلانات؟ ممكن المشكلة إن الناس مش عارفاك.",
    category: "misleading-deep",
    reveals: ["E15"],
    characterResponse:
      "أنا في المنطقة دي من 12 سنة، كل أهل المنطقة عارفينّي. التسويق ده للمحلات الجديدة. زباينّي بييجوا لأن بيعرفوني.",
    characterMood: "annoyed",
    trustImpact: -1,
  },
  {
    id: "Q11",
    text: "ساعات فتح المحل اتغيرت؟ ممكن بتفوّت زباين.",
    category: "misleading-deep",
    reveals: ["E16"],
    characterResponse: "نفس المواعيد من زمان. من 11 الصبح لـ 11 بالليل.",
    characterMood: "neutral",
    trustImpact: 0,
  },

  // ---------- Premature-solution (4) ----------
  {
    id: "Q12",
    text: "إيه رأيك نبدأ بخصم 15% على كل المحل لمدة أسبوعين كتجربة؟",
    category: "premature-solution",
    reveals: [],
    characterResponse:
      "والله فكرة! ده اللي كنت بفكر فيه. تقدر تحطّلي الأرقام؟",
    characterMood: "open",
    trustImpact: 1, // misleading — confirms wrong frame
  },
  {
    id: "Q13",
    text: "ممكن نعمل حملة على فيسبوك بميزانية 5 آلاف جنيه نجذب بيها ناس جداد؟",
    category: "premature-solution",
    reveals: [],
    characterResponse: "ممكن، بس أنا مش فاهم في النت. اللي تشوفه.",
    characterMood: "neutral",
    trustImpact: 0,
  },
  {
    id: "Q14",
    text: "إيه رأيك في تجديد ديكور المحل أو الواجهة؟ ممكن ده يجذب ناس جداد.",
    category: "premature-solution",
    reveals: ["E17"],
    characterResponse:
      "الديكور كويس. جددته من سنتين. مش حاسس إنه المشكلة.",
    characterMood: "neutral",
    trustImpact: 0,
  },
  {
    id: "Q15",
    text: "ممكن نضيف صنف جديد، زي ملابس أطفال أو إكسسوارات، نزود مصادر الدخل.",
    category: "premature-solution",
    reveals: [],
    characterResponse:
      "ده قرار كبير محتاج فلوس وتفكير. مش حل سريع.",
    characterMood: "annoyed",
    trustImpact: -1,
  },

  // ---------- Neutral-context (3) ----------
  {
    id: "Q16",
    text: "المتجر ده موجود من سنة كام؟ وإيه قصته؟",
    category: "neutral-context",
    reveals: ["E18"],
    characterResponse:
      "من 12 سنة. ورّثته من والدي رحمه الله. بدأنا بمحل صغير، كبّرناه شوية شوية.",
    characterMood: "open",
    trustImpact: 1,
  },
  {
    id: "Q17",
    text: "كم موظف عندك؟",
    category: "neutral-context",
    reveals: ["E19"],
    characterResponse: "تلاتة. اتنين بياعين وواحد بيرتب المخزن.",
    characterMood: "neutral",
    trustImpact: 0,
  },
  {
    id: "Q18",
    text: "عندك مخزون كبير دلوقتي؟",
    category: "neutral-context",
    reveals: ["E20"],
    characterResponse: "عادي. زي كل موسم. مفيش تكدّس.",
    characterMood: "neutral",
    trustImpact: 0,
  },

  // ---------- Frame-challenge (2) ----------
  {
    id: "Q19",
    text: "الـ 20% اللي بتقول عليها — ده إحساس عام ولا رقم حسبته فعلاً؟ وحسبته إزاي؟",
    category: "frame-challenge",
    reveals: ["E21", "E4"],
    characterResponse:
      "[يفكر] ... بصراحة قعدت قارنت أرقام شهرين الموسم بشهرين موسم السنة اللي فاتت. السنة اللي فاتت كانوا 240 ألف، السنة دي 192. يعني فرق 48 ألف، يعني 20%.",
    characterMood: "thoughtful",
    trustImpact: 0,
  },
  {
    id: "Q20",
    text: "ممكن نخطو خطوة لورا — هل أكيد إن في مشكلة؟ يعني الأرقام الحالية وحشة فعلاً، ولا بس مش زي السنة اللي فاتت؟",
    category: "frame-challenge",
    reveals: ["E22", "E3"],
    characterResponse:
      "[يصمت] ... يعني ... هي مش وحشة في المطلق. هي بس أقل من السنة اللي فاتت. السنة اللي فاتت كنت مبسوط جداً. بس قبلها ... [يفتح الدفتر] ... قبلها كانت أقل.",
    characterMood: "confused",
    trustImpact: -1,
  },
];

// ----------------------------------------------------------------------------
// 4. Evidence Pool (22)
// ----------------------------------------------------------------------------
const evidencePool: Evidence[] = [
  { id: "E1", text: "افتتح مول كبير سبتمبر 2024 — 200 متر من المحل", weight: "critical", pointsTo: ["R1", "R2"], contradicts: ["R4"] },
  { id: "E2", text: "السوق الرمضاني اتنقل من ميدان قدام المحل", weight: "critical", pointsTo: ["R1", "R2"], contradicts: [] },
  { id: "E3", text: "أرقام تاريخية: 2022=180k، 2023=195k، 2024=240k، 2025=192k", weight: "critical", pointsTo: ["S1", "R1"], contradicts: ["S2"] },
  { id: "E4", text: "2024 كان outlier واضح في السلسلة التاريخية", weight: "critical", pointsTo: ["S1", "R1"], contradicts: ["S2"] },
  { id: "E5", text: "نسبة التحويل (دخل/اشترى) طبيعية", weight: "supporting", pointsTo: ["S1"], contradicts: ["S4"] },
  { id: "E6", text: "حركة المشاة كانت مضخمة في 2024 بسبب المول والسوق", weight: "critical", pointsTo: ["R1"], contradicts: [] },
  { id: "E7", text: "الهامش الحالي 35%، ينخفض لـ 15% بعد خصم 20%", weight: "supporting", pointsTo: ["A1", "A2"], contradicts: ["A3"] },
  { id: "E8", text: "الخصم على بيع موجود = خسارة هامش مزدوجة", weight: "supporting", pointsTo: ["A1"], contradicts: ["A3"] },
  { id: "E9", text: "شارع جنب المتجر مقفول للترميم 4 شهور", weight: "supporting", pointsTo: ["R2"], contradicts: [] },
  { id: "E10", text: "الحركة قلت في المنطقة كلها مش بس المتجر", weight: "critical", pointsTo: ["R1", "R2"], contradicts: ["R3", "R5"] },
  { id: "E11", text: "الطاقم ثابت من 3 سنين، بدون شكاوى", weight: "distracting", pointsTo: [], contradicts: ["R3"] },
  { id: "E12", text: "المنتج والموردين لم يتغيروا، الزباين راضين", weight: "distracting", pointsTo: [], contradicts: ["R3"] },
  { id: "E13", text: "اللي بيدخل بيشتري — الاقتصاد مش العامل الرئيسي", weight: "distracting", pointsTo: [], contradicts: ["R6"] },
  { id: "E14", text: "زباين أبو سعيد القدام مستمرين — المنافسة مش بتاخد منه", weight: "distracting", pointsTo: [], contradicts: ["R4"] },
  { id: "E15", text: "زباين المنطقة بيعرفوه — التسويق غير ذي صلة", weight: "distracting", pointsTo: [], contradicts: ["R5"] },
  { id: "E16", text: "ساعات العمل لم تتغير", weight: "distracting", pointsTo: [], contradicts: [] },
  { id: "E17", text: "الديكور جُدّد قبل سنتين", weight: "distracting", pointsTo: [], contradicts: [] },
  { id: "E18", text: "المتجر عمره 12 سنة، عائلي", weight: "contextual", pointsTo: [], contradicts: [] },
  { id: "E19", text: "3 موظفين (2 بياعين + 1 مخزن)", weight: "contextual", pointsTo: [], contradicts: [] },
  { id: "E20", text: "المخزون طبيعي، مفيش تكدّس", weight: "contextual", pointsTo: [], contradicts: [] },
  { id: "E21", text: "الـ 20% محسوبة من شهرين فقط، بمقارنة سنة واحدة", weight: "critical", pointsTo: ["S1", "R1"], contradicts: ["S2"] },
  { id: "E22", text: "الأرقام الحالية ليست سيئة في المطلق — فقط أقل من 2024", weight: "critical", pointsTo: ["S1"], contradicts: ["S2"] },
];

// ----------------------------------------------------------------------------
// 5. Framing Components
// ----------------------------------------------------------------------------
const symptoms: FramingComponent[] = [
  { id: "S1", kind: "symptom", quality: "correct", text: "المبيعات تبدو منخفضة فقط لأنها تُقارن بسنة استثنائية، وهي ضمن النطاق التاريخي الطبيعي" },
  { id: "S2", kind: "symptom", quality: "partial", text: "المبيعات انخفضت 20% عن العام الماضي ويجب فهم السبب" },
  { id: "S3", kind: "symptom", quality: "wrong",   text: "حركة الزباين انخفضت بسبب عوامل خارج المتجر" },
  { id: "S4", kind: "symptom", quality: "wrong",   text: "الزباين فقدوا الاهتمام بمنتجات المتجر" },
  { id: "S5", kind: "symptom", quality: "wrong",   text: "الاقتصاد العام أثّر على القدرة الشرائية" },
];

const rootCauses: FramingComponent[] = [
  { id: "R1", kind: "root-cause", quality: "correct", text: "المرجع المستخدم (موسم 2024) كان استثنائياً بسبب عوامل خارجية مؤقتة (افتتاح مول + سوق رمضاني) لا تتكرر" },
  { id: "R2", kind: "root-cause", quality: "partial", text: "حركة المنطقة المحيطة انخفضت بسبب نقل السوق وقفل الشارع" },
  { id: "R3", kind: "root-cause", quality: "wrong",   text: "ضعف في جذب الزباين الجداد" },
  { id: "R4", kind: "root-cause", quality: "wrong",   text: "منافسة المول الجديد" },
  { id: "R5", kind: "root-cause", quality: "wrong",   text: "ضعف التسويق والحضور الرقمي" },
  { id: "R6", kind: "root-cause", quality: "wrong",   text: "تراجع القوة الشرائية في السوق" },
];

const recommendations: FramingComponent[] = [
  { id: "A1", kind: "recommendation", quality: "correct", text: "إعادة بناء خط الأساس من متوسط 3-4 سنوات بدلاً من سنة واحدة، ومراقبة الأداء الفعلي ضد المرجع الجديد قبل أي تدخل" },
  { id: "A2", kind: "recommendation", quality: "partial", text: "تأجيل أي خصومات لحين فهم أعمق للسوق" },
  { id: "A3", kind: "recommendation", quality: "wrong",   text: "تخفيضات 15-20% لتنشيط الحركة" },
  { id: "A4", kind: "recommendation", quality: "wrong",   text: "حملة إعلانية رقمية" },
  { id: "A5", kind: "recommendation", quality: "wrong",   text: "توسيع تشكيلة المنتجات" },
  { id: "A6", kind: "recommendation", quality: "wrong",   text: "تجديد الديكور والواجهة" },
];

// ----------------------------------------------------------------------------
// 6. Valid Framing Combinations (with traps)
// ----------------------------------------------------------------------------
// Helper for trap rules using wildcards in evaluator (kept explicit here for clarity)
const validFramingCombinations: FramingCombo[] = [
  // -------- GOLD --------
  {
    symptomId: "S1", rootCauseId: "R1", recommendationId: "A1",
    tier: "gold",
    feedback:
      "تأطير ناضج. شككت في المقارنة نفسها قبل ما تطارد أسباب. " +
      "بنيت baseline أحسن بدل ما تعالج عَرَض ممكن مش يكون مشكلة أصلاً.",
    requiresEvidence: ["E3", "E4", "E1", "E2"],
  },

  // -------- SILVER --------
  {
    symptomId: "S1", rootCauseId: "R1", recommendationId: "A2",
    tier: "silver",
    feedback: "تأطيرك صح، لكن التوصية متحفظة. كان ممكن تقترح إعادة بناء الـ baseline صراحة.",
    requiresEvidence: ["E3", "E4"],
  },
  {
    symptomId: "S1", rootCauseId: "R2", recommendationId: "A1",
    tier: "silver",
    feedback: "العَرَض صح، لكن السبب الجذري ناقص — ركّزت على المنطقة من غير ما توصل لفكرة المرجع الاستثنائي.",
    requiresEvidence: ["E2", "E10"],
  },
  {
    symptomId: "S2", rootCauseId: "R1", recommendationId: "A1",
    tier: "silver",
    feedback: "السبب والتوصية صح، لكن العَرَض لسه بيقول 'في انخفاض' بدل ما يشكك في وجوده.",
    requiresEvidence: ["E3", "E4"],
  },

  // -------- BRONZE --------
  {
    symptomId: "S1", rootCauseId: "R2", recommendationId: "A2",
    tier: "bronze",
    feedback: "حذر في الاتجاه الصح، لكن من غير الجرأة على التشكيك في الإطار.",
    requiresEvidence: [],
  },
  {
    symptomId: "S2", rootCauseId: "R2", recommendationId: "A2",
    tier: "bronze",
    feedback: "حذر بدون فهم الإطار. تأجيل القرار أحسن من الخطأ، لكن مش أحسن من فهم.",
    requiresEvidence: [],
  },

  // -------- TRAP: Baseline Ignored --------
  {
    symptomId: "S2", rootCauseId: "R3", recommendationId: "A3",
    tier: "trap-baseline-ignored",
    feedback:
      "الفخ الكلاسيكي. قبلت العَرَض كحقيقة، فتشت عن سبب داخلي، واقترحت خصومات. " +
      "السؤال اللي ما سألتوش: 'مقارن بإيه؟'",
    requiresEvidence: [],
  },
  {
    symptomId: "S2", rootCauseId: "R4", recommendationId: "A3",
    tier: "trap-baseline-ignored",
    feedback:
      "حمّلت المنافسة المسؤولية واقترحت خصومات. لكن مقارنتك نفسها كانت غلط. " +
      "زباين أبو سعيد القدام مستمرين — المول ما خدش منه.",
    requiresEvidence: [],
  },
];

// ----------------------------------------------------------------------------
// 7. Trust Mechanics
// ----------------------------------------------------------------------------
const trustMechanics: Case["trustMechanics"] = {
  initial: 5,
  min: 0,
  max: 8,
  triggers: [
    { category: "golden", delta: 1 },
    { category: "neutral-context", delta: 1 },
    { category: "misleading-deep", delta: 0 },
    { category: "premature-solution", delta: 1 }, // dangerous: confirms wrong frame
    { category: "frame-challenge", delta: 0 },
  ],
};

// ----------------------------------------------------------------------------
// 8. Evaluation Axes
// ----------------------------------------------------------------------------
const evaluationAxes: EvaluationAxis[] = [
  { id: "frame-challenge",     label: "تحدي الإطار",        description: "هل سأل سؤال يشكك في الإطار (Q1, Q5, Q19, Q20)؟", weight: 0.25 },
  { id: "evidence-discovery",  label: "اكتشاف الأدلة",       description: "كم دليل حرج كشف من 5؟",                          weight: 0.25 },
  { id: "question-economy",    label: "اقتصاد الأسئلة",      description: "نسبة الأسئلة الذهبية وtشكيك الإطار من الـ 7",   weight: 0.20 },
  { id: "framing-synthesis",   label: "تركيب التأطير",       description: "جودة التركيبة النهائية (gold/silver/bronze/trap)", weight: 0.25 },
  { id: "trust-management",    label: "إدارة الثقة",          description: "مستوى الثقة النهائي مع العميل",                  weight: 0.05 },
];

// ----------------------------------------------------------------------------
// 9. Critical Evidence (3 of 5 required to "solve")
// ----------------------------------------------------------------------------
const criticalEvidenceIds = ["E2", "E4", "E6", "E10", "E22"];

// ============================================================================
// EXPORT
// ============================================================================
export const baselineCase: Case = {
  id: "baseline-comparison",
  title: "المقارنة الخاطئة",
  industryDomain: "تجزئة — متجر ملابس",

  truth,
  briefingContext,

  questionBank,
  questionBudget: 7,

  evidencePool,

  framingComponents: { symptoms, rootCauses, recommendations },
  validFramingCombinations,

  trustMechanics,
  evaluationAxes,

  criticalEvidenceIds,
};
