// ════════════════════════════════════════════════════════════════════════════
// PF SCENARIO — "الموسم اللي ما جاش"
// ════════════════════════════════════════════════════════════════════════════
// Case: أبو سعيد متضايق إن مبيعات الموسم الحالي أقل بـ 20% من السنة اللي فاتت.
// تفسيره الخاطئ: "محتاج أعمل تخفيضات."
// الحقيقة المخفية: السنة اللي فاتت كانت استثنائية بسبب افتتاح مول قريب.
//                  الأرقام الحالية = الأداء الطبيعي للمتجر.
// التأطير الصح: مفيش انخفاض حقيقي — المقارنة نفسها مبنية على baseline استثنائي.
// ════════════════════════════════════════════════════════════════════════════

export type QuestionCategory =
  | "C"  // Context — سياق
  | "B"  // Baseline — مرجع المقارنة
  | "D"  // Decomposition — تفكيك
  | "E"  // External — عوامل خارجية
  | "V"; // Vision — شكل النجاح

export type Character = "mansour" | "abuSaeed" | "salma";

export type QuestionLevel = 1 | 2 | 3;

export interface Question {
  id: string;
  character: Character;
  category: QuestionCategory;
  level: QuestionLevel;
  text: string;
  answer: string;
  /** المعلومة المكشوفة (تظهر في الدفتر) */
  insight: string;
  /** هل هذا سؤال "ذهبي" يساهم في الوصول للتأطير الصح؟ */
  isGolden: boolean;
  /** هل هذا سؤال هامشي/مضلل (يستهلك ميزانية بدون تقدم محوري)؟ */
  isTrap?: boolean;
  /**
   * شروط فتح السؤال:
   * - لو level === 1 → مفتوح من البداية.
   * - لو level === 2 أو 3 → لازم تتحقق requires (أي سؤال من القائمة كافي).
   * منطق "أي" (OR) داخل المصفوفة: لو اللاعب سأل أي سؤال من المصفوفة، السؤال يتفتح.
   * لو احتجنا منطق "كل" (AND)، نستخدم requiresAll بدل requires.
   */
  requires?: string[];
  requiresAll?: string[];
  /** الأسئلة اللي يفتحها هذا السؤال بعد سؤاله (للمراجع البصرية فقط — المنطق الفعلي عبر requires) */
  unlocks?: string[];
}

// ════════════════════════════════════════════════════════════════════════════
// 🧑‍💼 أسئلة منصور (4 — كلها مستوى 1) — تُطرح في المكتب قبل السفر
// ════════════════════════════════════════════════════════════════════════════

export const MANSOUR_QUESTIONS: Question[] = [
  {
    id: "M1",
    character: "mansour",
    category: "C",
    level: 1,
    text: "مين العميل ده وبيشتغل في إيه؟",
    answer: "أبو سعيد، عنده متجر ملابس في المنصورة. عميل معانا من سنتين. راجل محترم وشغله ماشي كويس عمومًا.",
    insight: "العميل: أبو سعيد — متجر ملابس في المنصورة. علاقة سابقة مع بيناكل من سنتين.",
    isGolden: false,
  },
  {
    id: "M2",
    character: "mansour",
    category: "C",
    level: 1,
    text: "هو قال إيه بالظبط لما تواصل معانا؟",
    answer: "قال إن الموسم ده وحش عليه ومبيعاته واقعة ومش عارف يعمل إيه. بيفكر يعمل تخفيضات بس عايز رأينا الأول.",
    insight: "العَرَض كما وصفه العميل: مبيعات واقعة + الحل اللي مقترحه (تخفيضات).",
    isGolden: false,
  },
  {
    id: "M3",
    character: "mansour",
    category: "C",
    level: 1,
    text: "إحنا اشتغلنا معاه قبل كده؟ فيه حاجة من الملف القديم تفيدني؟",
    answer: "أيوه، اشتغلنا معاه السنة اللي فاتت على تنظيم المخزون. وقتها كان مبسوط ومتفائل والأرقام كانت كويسة.",
    insight: "السنة اللي فاتت كان مبسوط والأرقام كانت كويسة — معلومة مهمة للمقارنة لاحقًا.",
    isGolden: false,
  },
  {
    id: "M4",
    character: "mansour",
    category: "C",
    level: 1,
    text: "فيه حاجة لازم أعرفها قبل ما أروح — حساسيات معينة أو حاجة تزعله؟",
    answer: "لا هو راجل بسيط ومتعاون. بس هو من النوع اللي بيقلق بسرعة ولما بيقلق بياخد قرارات متسرعة. عشان كده عايزينك تروح قبل ما يعمل حاجة.",
    insight: "أبو سعيد متسرّع في القرارات لما يقلق — لازم تتعامل معاه قبل ما يعمل التخفيضات.",
    isGolden: false,
  },
];

// ════════════════════════════════════════════════════════════════════════════
// 🧔 أسئلة أبو سعيد (12 — مقسومة على 3 مستويات)
// ════════════════════════════════════════════════════════════════════════════

export const ABU_SAEED_QUESTIONS: Question[] = [
  // ─── المستوى 1: مفتوح من البداية (6 أسئلة) ───
  {
    id: "A1",
    character: "abuSaeed",
    category: "C",
    level: 1,
    text: "المتجر ده بقاله قد إيه مفتوح؟",
    answer: "الحمد لله بقاله 6 سنين. يعني مش جديد — أنا عارف السوق كويس.",
    insight: "المتجر عمره 6 سنين → فيه تاريخ أداء طويل يصلح للمقارنة بسنوات أكتر.",
    isGolden: false,
    unlocks: ["S3"],
  },
  {
    id: "A2",
    character: "abuSaeed",
    category: "B",
    level: 1,
    text: "لما بتقول المبيعات وقعت — بتقارن بإيه بالظبط؟",
    answer: "بنفس الوقت ده السنة اللي فاتت. نفس الموسم، نفس الشهور. السنة اللي فاتت كنا ممتازين والسنة دي الأرقام أقل بـ 20% تقريبًا.",
    insight: "🔑 المقارنة بسنة واحدة فقط (السنة الماضية) — مفيش مقارنة بسنوات أقدم.",
    isGolden: true,
    unlocks: ["S1", "S2"],
  },
  {
    id: "A3",
    character: "abuSaeed",
    category: "B",
    level: 1,
    text: "الـ 20% دول — ده إحساسك ولا رقم فعلي من الحسابات؟",
    answer: "لا ده رقم. سلمى — المحاسبة بتاعتنا — هي اللي قالتلي. أنا سألتها وقالتلي الرقم أقل بحوالي 20%.",
    insight: "الرقم حقيقي (20% فعلاً) — لكن المرجع نفسه هو السؤال الحقيقي.",
    isGolden: false,
    unlocks: ["A6"],
  },
  {
    id: "A4",
    character: "abuSaeed",
    category: "D",
    level: 1,
    text: "الـ 20% دول نزلوا في إيه بالظبط؟ عدد الزبائن قلّ؟ ولا الناس بتشتري حاجات أقل؟ ولا أرخص؟",
    answer: "والله مش متأكد بالظبط… بس حاسس إن الحركة نفسها أقل شوية. يعني الناس مش بتدخل زي الأول. اللي بيدخل بيشتري عادي — بس العدد أقل.",
    insight: "🔑 العَرَض = حركة أقل (عدد زبائن أقل) — مش قيمة السلة اللي نزلت.",
    isGolden: true,
    unlocks: ["S4"],
  },
  {
    id: "A5",
    character: "abuSaeed",
    category: "D",
    level: 1,
    text: "غيّرت حاجة في المتجر الفترة الأخيرة؟ أسعار، تشكيلة، موظفين، مواعيد؟",
    answer: "لا والله. نفس الكلام بالظبط. نفس التشكيلة، نفس الموردين، نفس الأسعار، نفس الموظفين. مغيّرتش حاجة خالص — وده اللي محيّرني.",
    insight: "ثبات داخلي كامل — مفيش تغيير داخلي. إذن السبب خارجي أو في المقارنة.",
    isGolden: false,
    isTrap: true,
    unlocks: ["A8"],
  },
  {
    id: "A6",
    character: "abuSaeed",
    category: "V",
    level: 1,
    text: "لو المبيعات رجعت لرقم السنة اللي فاتت — ده يطمّنك؟ ولا عايز حاجة تانية؟",
    answer: "أيوه طبعًا. لو رجعت لنفس الرقم أنا مبسوط. أنا مش طمّاع — بس عايز أرجع لمستوايا.",
    insight: "🔑 شكل النجاح عنده = الرجوع لمستوى السنة الماضية — وده بالظبط جوهر المشكلة (المستوى ده مش 'مستواه الطبيعي').",
    isGolden: true,
    unlocks: ["A9"],
  },

  // ─── المستوى 2: يتفتح بناءً على معلومة سابقة (4 أسئلة) ───
  {
    id: "A7",
    character: "abuSaeed",
    category: "E",
    level: 2,
    text: "المنطقة حوالين المتجر — اتغيّر فيها حاجة السنة دي أو السنة اللي فاتت؟",
    answer: "هو الحقيقة السنة اللي فاتت اتفتح مول كبير قريب مننا. كان فيه ضجة كبيرة وناس كتير كانت بتيجي المنطقة. بس السنة دي الموضوع هدي.",
    insight: "🔑 معلومة محورية: حدث خارجي استثنائي السنة الماضية (افتتاح مول قريب).",
    isGolden: true,
    requiresAll: [], // يتفتح بعد سؤال أي 2 من أسئلة المستوى 1 لأبو سعيد (راجع منطق التحقق في pf-engine)
    requires: [], // الفتح يتم عبر شرط عام: 2+ من أسئلة المستوى 1 لأبو سعيد
    unlocks: ["A10", "S5"],
  },
  {
    id: "A8",
    character: "abuSaeed",
    category: "E",
    level: 2,
    text: "أنت بتقول مغيّرتش حاجة — طب المنطقة نفسها اتغيّرت؟ فيه محلات فتحت أو قفلت؟",
    answer: "فيه المول اللي اتفتح السنة اللي فاتت طبعًا… كان جايب حركة رهيبة. بس هو مش منافس ليّا — ده مول ملابس براندات ومحلي. أنا كنت بستفيد من الحركة بس.",
    insight: "🔑 نفس المعلومة المحورية من زاوية تانية: أبو سعيد نفسه كان مستفيد من زحمة المول لكن مش واخد باله.",
    isGolden: true,
    requires: ["A5"],
    unlocks: ["A10", "S5"],
  },
  {
    id: "A9",
    character: "abuSaeed",
    category: "B",
    level: 2,
    text: "أنت قلت عايز ترجع لمستوى السنة اللي فاتت. السنة اللي فاتت كانت سنة عادية ولا كانت أحسن من المعتاد؟",
    answer: "...هي كانت سنة حلوة فعلاً. بس أنا فاكر إنها كانت كويسة عشان أنا شاطر. يعني عملت شغل كويس.",
    insight: "أبو سعيد بيعزي نجاح السنة الماضية لنفسه (Attribution Bias) — مش للظروف الخارجية.",
    isGolden: false,
    requires: ["A6"],
  },
  {
    id: "A10",
    character: "abuSaeed",
    category: "B",
    level: 2,
    text: "طب لو المول ده هو اللي جاب الحركة الزيادة السنة اللي فاتت — يبقى الأرقام دي مش 'مستواك الطبيعي'، مش كده؟",
    answer: "... (يسكت شوية) … يعني أنت عايز تقولي إن السنة اللي فاتت مكانتش عادية؟ … بس أنا حسيتها طبيعية وقتها.",
    insight: "🔑 لحظة الكشف: أبو سعيد يبدأ يدرك إن المرجع بتاعه غلط.",
    isGolden: true,
    requires: ["A7", "A8"],
  },

  // ─── المستوى 3: الأسئلة الحاسمة (2 سؤال) ───
  {
    id: "A11",
    character: "abuSaeed",
    category: "V",
    level: 3,
    text: "لو عملت تخفيضات دلوقتي — إيه أسوأ حاجة ممكن تحصل؟",
    answer: "... يعني لو الناس اشترت بالتخفيض ده وبعدين ما رجعتش تشتري بالسعر العادي… يعني ممكن أأذي الهامش بتاعي. بس أنا قلقان!",
    insight: "التخفيضات ممكن تضرّ الهامش — وأبو سعيد نفسه عارف بس القلق بيدفعه.",
    isGolden: false,
    requiresAll: ["A6", "A7"],
  },
  {
    id: "A12",
    character: "abuSaeed",
    category: "V",
    level: 3,
    text: "لو طلعنا إن أداءك الحالي هو أداءك الطبيعي — هتبقى محتاج تعمل حاجة أصلاً؟",
    answer: "... (يفكّر) … يعني لو فعلاً الرقم ده هو الطبيعي… يعني أنا كنت هعمل تخفيضات على إيه؟ ... بس أنا عايز أتأكد.",
    insight: "🔑 لحظة التأطير النهائية: اللاعب بيوصّل أبو سعيد للاستنتاج بنفسه.",
    isGolden: true,
    requires: ["A10", "S5", "S6"],
  },
];

// ════════════════════════════════════════════════════════════════════════════
// 👩‍💼 أسئلة سلمى — المحاسبة (8 أسئلة)
// ════════════════════════════════════════════════════════════════════════════

export const SALMA_QUESTIONS: Question[] = [
  // ─── المستوى 1: مفتوح من البداية (2 سؤال) ───
  {
    id: "S1",
    character: "salma",
    category: "B",
    level: 1,
    text: "المبيعات السنة دي فعلاً أقل بـ 20% من السنة اللي فاتت؟",
    answer: "أيوه الرقم ده مضبوط. من ناحية الإجمالي، السنة اللي فاتت كان أعلى. ده رقم حقيقي.",
    insight: "تأكيد الرقم: 20% انخفاض حقيقي مقارنة بالسنة الماضية فقط.",
    isGolden: false,
  },
  {
    id: "S2",
    character: "salma",
    category: "D",
    level: 1,
    text: "أنا عايز أفهم الأرقام أكتر. الانخفاض ده في إيه بالظبط — عدد الفواتير ولا متوسط قيمة الفاتورة؟",
    answer: "عدد الفواتير هو اللي أقل — يعني زبائن أقل. بس متوسط الفاتورة ثابت تقريبًا. يعني اللي بيدخل بيشتري زي الأول، بس العدد اللي بيدخل أقل.",
    insight: "🔑 تفكيك MECE: المشكلة في الحجم (عدد الزبائن) مش في القيمة (سلة الشراء).",
    isGolden: true,
    unlocks: ["S4"],
  },

  // ─── المستوى 2: يتفتح بعد كشف معلومة (4 أسئلة) ───
  {
    id: "S3",
    character: "salma",
    category: "B",
    level: 2,
    text: "عندك أرقام أقدم من السنة اللي فاتت؟ يعني أقدر أشوف أداء 3 أو 4 سنين؟",
    answer: "أيوه عندي أرقام من أول سنة. تحب أجيبهالك؟ (بتطلع الأرقام) — شوف: أول 3 سنين كان المتوسط حوالي 85 ألف في الشهر. السنة اللي فاتت فجأة طلع 105 ألف. السنة دي رجع 87 ألف.",
    insight: "🔑 الدليل الحاسم: السنة الماضية هي الاستثناء مش القاعدة. الأرقام الحالية = المتوسط التاريخي.",
    isGolden: true,
    requires: ["A1"],
    unlocks: ["S5", "S6"],
  },
  {
    id: "S4",
    character: "salma",
    category: "D",
    level: 2,
    text: "الزبائن اللي بيدخلوا — نوعيتهم اتغيّرت؟ ولا نفس الناس بس أقل عدد؟",
    answer: "بصراحة أنا مش بتابع الوشوش — بس من الفواتير، نفس متوسط الشراء ونفس نوعية المنتجات. مفيش تغيّر واضح في نوع الزبون.",
    insight: "الزبائن نفسهم ما اتغيّروش — بس العدد. ده يعزز فرضية العامل الخارجي.",
    isGolden: false,
    isTrap: true,
    requires: ["S2"],
  },
  {
    id: "S5",
    character: "salma",
    category: "E",
    level: 2,
    text: "السنة اللي فاتت — فيه حاجة معينة حصلت في المنطقة خلّت الحركة تزيد؟",
    answer: "أيوه! المول اللي اتفتح. أول ما فتح كان فيه عروض افتتاحية وزحمة رهيبة. الشارع كله استفاد — مش بس إحنا. كل المحلات حواليه شافت حركة غير عادية. بس السنة دي الدنيا هديت والناس بقت بتروح المول على طول.",
    insight: "🔑 التأكيد النهائي: الحدث الخارجي (المول) أثّر على كل المنطقة — مش بس أبو سعيد.",
    isGolden: true,
    requires: ["A7", "A8", "S3"],
    unlocks: ["S7"],
  },
  {
    id: "S6",
    character: "salma",
    category: "B",
    level: 2,
    text: "لو قارنت الأرقام الحالية بمتوسط أول 3 سنين — الوضع إيه؟",
    answer: "هو تقريبًا نفس المستوى. يعني المتجر رجع لأدائه الطبيعي. السنة اللي فاتت كانت فوق المعتاد.",
    insight: "🔑 تأكيد إن الأداء الحالي = الطبيعي. مفيش 'انخفاض' حقيقي — فيه 'رجوع للمعتاد'.",
    isGolden: true,
    requires: ["S3"],
  },

  // ─── المستوى 3: الأسئلة الحاسمة (2 سؤال) ───
  {
    id: "S7",
    character: "salma",
    category: "E",
    level: 3,
    text: "المحلات التانية في الشارع — هل هي كمان شافت نفس النزول السنة دي؟",
    answer: "أنا عارفة صاحبة الصيدلية جنبنا. هي كمان بتقول إن السنة اللي فاتت كانت أحسن سنة عندها بسبب الزحمة. السنة دي رجعت طبيعي.",
    insight: "دليل خارجي مستقل: الظاهرة مش خاصة بأبو سعيد — كل المنطقة نفس الكلام.",
    isGolden: true,
    requires: ["S5"],
  },
  {
    id: "S8",
    character: "salma",
    category: "V",
    level: 3,
    text: "لو أبو سعيد عمل تخفيضات — الأرقام هتتحسن فعلاً ولا هتاكل الهامش؟",
    answer: "بصراحة… الزبائن اللي بيدخلوا بيشتروا بالسعر العادي ومبسوطين. لو نزّلنا السعر هنخسر هامش على بيع كان هيحصل أصلاً. مش هنجذب زبائن جداد — العدد اللي بيدخل هو ده العدد الطبيعي.",
    insight: "تحذير من خطورة الحل الخاطئ: التخفيض هيضرّ الهامش بدون فايدة.",
    isGolden: false,
    requiresAll: ["S6", "A6"],
  },
];

// ════════════════════════════════════════════════════════════════════════════
// 📚 كل الأسئلة في مكان واحد
// ════════════════════════════════════════════════════════════════════════════

export const ALL_QUESTIONS: Question[] = [
  ...MANSOUR_QUESTIONS,
  ...ABU_SAEED_QUESTIONS,
  ...SALMA_QUESTIONS,
];

export const QUESTIONS_BY_CHARACTER: Record<Character, Question[]> = {
  mansour: MANSOUR_QUESTIONS,
  abuSaeed: ABU_SAEED_QUESTIONS,
  salma: SALMA_QUESTIONS,
};

export const getQuestionById = (id: string): Question | undefined =>
  ALL_QUESTIONS.find((q) => q.id === id);

// ════════════════════════════════════════════════════════════════════════════
// 🔓 منطق فتح الأسئلة
// ════════════════════════════════════════════════════════════════════════════

/**
 * يحدد ما إذا كان السؤال مفتوحًا للسؤال بناءً على الأسئلة المسؤولة سابقًا.
 *
 * قواعد الفتح:
 * 1. أسئلة المستوى 1 → دائمًا مفتوحة (إلا منصور: مفتوح فقط في مرحلة المكتب).
 * 2. أسئلة المستوى 2/3 مع `requiresAll` → كل الأسئلة في القائمة لازم تكون مسؤولة.
 * 3. أسئلة المستوى 2/3 مع `requires` → سؤال واحد على الأقل من القائمة لازم يكون مسؤول.
 * 4. حالة خاصة (A7) → يتفتح بعد سؤال أي 2 من أسئلة المستوى 1 لأبو سعيد.
 */
export const isQuestionUnlocked = (
  question: Question,
  askedIds: string[]
): boolean => {
  if (question.level === 1) return true;

  // حالة خاصة: A7 يتفتح بعد سؤال أي 2 من أسئلة المستوى 1 لأبو سعيد
  if (question.id === "A7") {
    const level1AbuSaeed = ABU_SAEED_QUESTIONS.filter((q) => q.level === 1).map((q) => q.id);
    const askedLevel1 = askedIds.filter((id) => level1AbuSaeed.includes(id));
    return askedLevel1.length >= 2;
  }

  if (question.requiresAll && question.requiresAll.length > 0) {
    return question.requiresAll.every((reqId) => askedIds.includes(reqId));
  }

  if (question.requires && question.requires.length > 0) {
    return question.requires.some((reqId) => askedIds.includes(reqId));
  }

  return true;
};

// ════════════════════════════════════════════════════════════════════════════
// ⚡ نظام الميزانية
// ════════════════════════════════════════════════════════════════════════════

/** ميزانية الأسئلة الإجمالية (بدون منصور) */
export const QUESTION_BUDGET = 12;

/** الأسئلة الذهبية الستة الأساسية اللي بتوصّل للتأطير الصح */
export const GOLDEN_QUESTION_IDS = ["A2", "A4", "A7", "S2", "S3", "S5", "S6"];

/** الحد الأدنى من الأسئلة الذهبية المطلوب لتأطير قوي */
export const MIN_GOLDEN_FOR_STRONG_FRAMING = 4;

// ════════════════════════════════════════════════════════════════════════════
// 🎯 شاشة التأطير النهائية — 4 خانات
// ════════════════════════════════════════════════════════════════════════════

export interface FramingChoice {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface FramingSlot {
  id: "symptom" | "ownerBelief" | "rootCause" | "decision";
  label: string;
  prompt: string;
  choices: FramingChoice[];
}

export const FRAMING_SLOTS: FramingSlot[] = [
  {
    id: "symptom",
    label: "العَرَض الظاهر",
    prompt: "العَرَض الظاهر اللي العميل بيشكي منه هو…",
    choices: [
      {
        id: "sym_a",
        text: "المبيعات نزلت 20% عن السنة اللي فاتت",
        isCorrect: true,
        explanation: "ده العَرَض الفعلي اللي العميل بيقيسه ويشتكي منه — رقم محدد ومقارنة محددة.",
      },
      {
        id: "sym_b",
        text: "الزبائن مش مبسوطين من التشكيلة",
        isCorrect: false,
        explanation: "مفيش دليل من التحقيق على شكاوى من التشكيلة — الزبائن اللي بيدخلوا بيشتروا عادي.",
      },
      {
        id: "sym_c",
        text: "المنافسة زادت في المنطقة",
        isCorrect: false,
        explanation: "ده تفسير محتمل، مش العَرَض. العَرَض هو اللي العميل بيلاحظه ويقيسه.",
      },
      {
        id: "sym_d",
        text: "الموظفين مش بيشتغلوا كويس",
        isCorrect: false,
        explanation: "أبو سعيد نفسه قال إن الموظفين زي ما هم ومفيش شكاوى — ده مش العَرَض.",
      },
    ],
  },
  {
    id: "ownerBelief",
    label: "تفسير العميل",
    prompt: "صاحب المتجر فاكر إن السبب هو…",
    choices: [
      {
        id: "own_a",
        text: "الأسعار عالية ومحتاج يعمل تخفيضات",
        isCorrect: true,
        explanation: "ده بالظبط اللي قاله أبو سعيد لمنصور — وده الحل اللي عايز ينفذه قبل ما تتدخل.",
      },
      {
        id: "own_b",
        text: "الموظفين مش شاطرين",
        isCorrect: false,
        explanation: "أبو سعيد ما اتهمش الموظفين — هو متمسّك بفكرة التخفيضات.",
      },
      {
        id: "own_c",
        text: "الموردين بيأخّروا التشكيلة",
        isCorrect: false,
        explanation: "ما طرحش ده كسبب — التفسير الوحيد عنده هو الأسعار/التخفيضات.",
      },
      {
        id: "own_d",
        text: "المنطقة بقت وحشة",
        isCorrect: false,
        explanation: "بالعكس — هو لاحظ المول الجديد لكن ما ربطش بينه وبين أرقام السنة الماضية.",
      },
    ],
  },
  {
    id: "rootCause",
    label: "السبب الحقيقي",
    prompt: "السبب الحقيقي وراء العَرَض هو…",
    choices: [
      {
        id: "root_a",
        text: "المقارنة مبنية على سنة استثنائية — والأداء الحالي هو الطبيعي",
        isCorrect: true,
        explanation: "ده الكشف الحقيقي. السنة الماضية كانت قمة استثنائية بسبب افتتاح المول. متوسط 3 سنين قبلها = 85 ألف. السنة دي = 87 ألف. مفيش انخفاض حقيقي.",
      },
      {
        id: "root_b",
        text: "المنافسة من المول الجديد سحبت الزبائن",
        isCorrect: false,
        explanation: "المول مش منافس — هو ملابس براندات. الحقيقة العكس: المول جاب حركة استثنائية للمنطقة كلها السنة الماضية.",
      },
      {
        id: "root_c",
        text: "تغيّر في ذوق الزبائن",
        isCorrect: false,
        explanation: "سلمى أكدت إن الزبائن نفسهم ومتوسط الشراء ثابت. مفيش تغيّر في الذوق.",
      },
      {
        id: "root_d",
        text: "ضعف في التسويق والإعلان",
        isCorrect: false,
        explanation: "مفيش دليل على ده — ومش مرتبط بالظاهرة الحقيقية (الـ baseline الاستثنائي).",
      },
    ],
  },
  {
    id: "decision",
    label: "القرار الصح",
    prompt: "القرار الصح اللي تنصح بيه أبو سعيد هو…",
    choices: [
      {
        id: "dec_a",
        text: "ما يعملش تخفيضات — يعيد بناء baseline حقيقي ويطمّن إن أداءه طبيعي",
        isCorrect: true,
        explanation: "التخفيض هيخسره هامش على بيع كان هيحصل أصلاً. الصح: يفهم إن الأرقام دي طبيعية ويبني مرجع حقيقي لمتابعة مستقبلية.",
      },
      {
        id: "dec_b",
        text: "يعمل تخفيضات موسمية عشان يجذب زبائن",
        isCorrect: false,
        explanation: "ده بالظبط اللي حذّرت منه سلمى — هيأكل الهامش بدون ما يجيب زبائن جداد.",
      },
      {
        id: "dec_c",
        text: "يغيّر الموردين ويجدّد التشكيلة",
        isCorrect: false,
        explanation: "حل لمشكلة غير موجودة — التشكيلة مش هي السبب.",
      },
      {
        id: "dec_d",
        text: "يفتح فرع تاني في مكان تاني",
        isCorrect: false,
        explanation: "قرار توسّعي كبير لمشكلة وهمية — هيكلّفه أكتر بكتير.",
      },
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
// 📊 نظام التقييم
// ════════════════════════════════════════════════════════════════════════════

export interface ScoreBreakdown {
  goldenQuestionsScore: number;  // 40 نقطة
  efficiencyScore: number;        // 15 نقطة
  sequencingScore: number;        // 15 نقطة
  framingScore: number;           // 30 نقطة
  total: number;
}

export const MAX_SCORE = 100;

/**
 * احسب نقاط الأسئلة الذهبية (40 نقطة).
 * لكل سؤال ذهبي مسؤول → نقاط متناسبة.
 */
export const calculateGoldenScore = (askedIds: string[]): number => {
  const asked = askedIds.filter((id) => GOLDEN_QUESTION_IDS.includes(id));
  return Math.round((asked.length / GOLDEN_QUESTION_IDS.length) * 40);
};

/**
 * احسب نقاط الكفاءة (15 نقطة).
 * كل سؤال trap بيخصم نقاط، وكل ميزانية متبقية بتزود نقاط.
 */
export const calculateEfficiencyScore = (
  askedIds: string[],
  budgetRemaining: number
): number => {
  const trapsAsked = askedIds.filter((id) => {
    const q = getQuestionById(id);
    return q?.isTrap === true;
  }).length;
  const trapPenalty = Math.min(trapsAsked * 3, 9); // أقصى خصم 9
  const budgetBonus = Math.min(budgetRemaining * 1.5, 6); // أقصى بونص 6
  return Math.max(0, Math.round(15 - trapPenalty + budgetBonus - 6));
};

/**
 * احسب نقاط التسلسل (15 نقطة).
 * Context قبل Decomposition قبل External = ترتيب صح.
 */
export const calculateSequencingScore = (askedIds: string[]): number => {
  const categoryOrder = askedIds
    .map((id) => getQuestionById(id)?.category)
    .filter(Boolean) as QuestionCategory[];

  let score = 15;
  let firstD = -1;
  let firstE = -1;
  let firstC = -1;
  let lastC = -1;

  categoryOrder.forEach((cat, i) => {
    if (cat === "C") {
      if (firstC === -1) firstC = i;
      lastC = i;
    }
    if (cat === "D" && firstD === -1) firstD = i;
    if (cat === "E" && firstE === -1) firstE = i;
  });

  // عقوبة لو External قبل Decomposition
  if (firstE !== -1 && firstD !== -1 && firstE < firstD) score -= 5;
  // عقوبة لو Decomposition قبل أي Context
  if (firstD !== -1 && firstC === -1) score -= 5;
  // عقوبة لو Context جه متأخر جدًا
  if (firstC > 3) score -= 5;

  return Math.max(0, score);
};

/**
 * احسب نقاط التأطير (30 نقطة).
 * كل خانة صح = 7.5 نقطة.
 */
export const calculateFramingScore = (
  selectedChoiceIds: Record<string, string>
): number => {
  let correct = 0;
  FRAMING_SLOTS.forEach((slot) => {
    const selectedId = selectedChoiceIds[slot.id];
    const choice = slot.choices.find((c) => c.id === selectedId);
    if (choice?.isCorrect) correct++;
  });
  return Math.round((correct / FRAMING_SLOTS.length) * 30);
};

/**
 * احسب التقييم الكامل.
 */
export const calculateTotalScore = (
  askedIds: string[],
  budgetRemaining: number,
  framingChoices: Record<string, string>
): ScoreBreakdown => {
  const goldenQuestionsScore = calculateGoldenScore(askedIds);
  const efficiencyScore = calculateEfficiencyScore(askedIds, budgetRemaining);
  const sequencingScore = calculateSequencingScore(askedIds);
  const framingScore = calculateFramingScore(framingChoices);
  return {
    goldenQuestionsScore,
    efficiencyScore,
    sequencingScore,
    framingScore,
    total: goldenQuestionsScore + efficiencyScore + sequencingScore + framingScore,
  };
};

// ════════════════════════════════════════════════════════════════════════════
// 🏆 مستويات التقييم
// ════════════════════════════════════════════════════════════════════════════

export interface ScoreLevel {
  min: number;
  max: number;
  title: string;
  titleEn: string;
  icon: string;
  description: string;
  color: string;
}

export const SCORE_LEVELS: ScoreLevel[] = [
  {
    min: 80,
    max: 100,
    title: "محلل استثنائي",
    titleEn: "Exceptional Analyst",
    icon: "🏆",
    description: "فكّكت المشكلة بمنهجية وشككت في المرجع نفسه. ده اللي بيفرّق المستشار الحقيقي.",
    color: "text-yellow-400",
  },
  {
    min: 55,
    max: 79,
    title: "محلل واعد",
    titleEn: "Promising Analyst",
    icon: "🥈",
    description: "اقتربت من الصورة الصح بس فاتتك زوايا مهمة. حاول تشكك دايمًا في المرجع اللي بتقارن بيه.",
    color: "text-slate-300",
  },
  {
    min: 0,
    max: 54,
    title: "لسه في البداية",
    titleEn: "Getting Started",
    icon: "📚",
    description: "قفزت لتفسيرات قبل ما تثبّت المرجع. الدرس: قبل ما تقول 'فيه مشكلة'، اسأل 'مقارن بإيه؟'.",
    color: "text-amber-600",
  },
];

export const getScoreLevel = (score: number): ScoreLevel => {
  return SCORE_LEVELS.find((l) => score >= l.min && score <= l.max) || SCORE_LEVELS[2];
};

// ════════════════════════════════════════════════════════════════════════════
// 🔄 LEGACY COMPATIBILITY LAYER (مؤقت — للحفاظ على اشتغال الـ UI القديم)
// ════════════════════════════════════════════════════════════════════════════
// هذه الطبقة موجودة لحين بناء الـ UI الجديد (QuestionBankPanel + FramingTemplateScreen).
// الـ UI القديم (InquiryScreen + FramingScreen) يعتمد على INQUIRY_ROUNDS و FRAMING_OPTIONS.
// سيتم حذفها بمجرد إعادة بناء الشاشات.

export interface InquiryOption {
  id: string;
  text: string;
  tier: "strong" | "medium" | "weak";
  points: number;
  response: string;
  explanation: string;
}

export interface InquiryRound {
  id: number;
  title: string;
  options: InquiryOption[];
}

export interface FramingOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

/** بنية شكلية للحفاظ على الـ UI القديم — سيتم استبدالها بالكامل */
export const INQUIRY_ROUNDS: InquiryRound[] = [
  {
    id: 1,
    title: "اللعبة في طور إعادة البناء",
    options: [
      {
        id: "placeholder_1",
        text: "اللعبة في طور إعادة البناء — المرحلة الجاية: بناء بنك الأسئلة التفاعلي.",
        tier: "strong",
        points: 0,
        response: "بنك الأسئلة الكامل (24 سؤال) جاهز في الكود. الخطوة الجاية: بناء الـ UI الجديد.",
        explanation: "اللعبة الحالية في مرحلة انتقالية.",
      },
    ],
  },
];

export const FRAMING_OPTIONS: FramingOption[] = FRAMING_SLOTS[2].choices.map((c) => ({
  id: c.id,
  text: c.text,
  isCorrect: c.isCorrect,
  explanation: c.explanation,
}));

export const FRAMING_POINTS = 30;

