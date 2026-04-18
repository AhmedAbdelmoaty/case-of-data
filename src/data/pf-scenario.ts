// ════════════════════════════════════════════════════════════════════════════
// PF SCENARIO — "الموسم اللي ما جاش" — V3
// ════════════════════════════════════════════════════════════════════════════
// القضية: أبو سعيد قلقان من نزول مبيعات 20% مقارنة بالسنة اللي فاتت.
// تفسيره: "محتاج تخفيضات."
// الحقيقة المخفية: السنة اللي فاتت كانت استثنائية (افتتاح مول قريب جاب موجة
//   حركة لكل المنطقة). الأرقام الحالية = الأداء الطبيعي للمتجر.
// التأطير الصح: المرجع غلط. مفيش انخفاض حقيقي. التخفيضات هتأكل الهامش.
// ════════════════════════════════════════════════════════════════════════════

export type Character = "mansour" | "abuSaeed" | "salma";

/** نوع السؤال — اللاعب لا يراه، لكنه يحدد التأثير على التقييم والـ insights */
export type QuestionKind =
  | "key"          // 🟢 سؤال صح في وقته الصح — يدّي insight ذهبي ويفتح مرحلة
  | "minor"        // 🟡 معلومة بسيطة، مايفتحش مرحلة، بس مش غلط
  | "misleading"   // 🔴 سؤال بيوجّه التفكير لمسار غلط (المنافسة، الموظفين...)
  | "premature";   // ⚫ سؤال صح بس في الوقت الغلط — رد سطحي بدون insight

/** المراحل الـ 4 للتحقيق */
export type GamePhase = 1 | 2 | 3 | 4;
// Phase 1: Context (مين أبو سعيد، المتجر بيبيع إيه)
// Phase 2: Symptom (يطلع الشكوى من أبو سعيد)
// Phase 3: Decomposition (يكسّر الـ 20% — يفتح سلمى)
// Phase 4: Baseline + External (السنة اللي فاتت كانت استثناء بسبب المول)

export interface Question {
  id: string;
  character: Character;
  kind: QuestionKind;
  /** المرحلة اللي السؤال ده من المفترض يتسأل فيها (للـ Key/Minor). للمضللات: 0 = أي وقت */
  phase: GamePhase | 0;
  text: string;
  /** الإجابة اللي بتتعرض في الحوار */
  answer: string;
  /** الـ insight اللي بيدخل الدفتر — null للمضللات و الـ premature لما تتسأل في الوقت الغلط */
  insight: string | null;
  /** الأسئلة اللي السؤال ده بيدفعها للـ pool (تظهر بعده) */
  unlocks?: string[];
  /** للـ premature: الـ ID اللي لازم يتسأل قبله عشان يبقى Key مش Premature */
  becomesKeyAfter?: string;
  /** الـ insight البديل لما يبقى Key (مع becomesKeyAfter) */
  keyInsight?: string;
  /** الإجابة البديلة لما يبقى Key */
  keyAnswer?: string;
}

// ════════════════════════════════════════════════════════════════════════════
// 🧑‍💼 منصور (4 أسئلة — مجانية قبل السفر)
// ════════════════════════════════════════════════════════════════════════════

export const MANSOUR_QUESTIONS: Question[] = [
  {
    id: "M1", character: "mansour", kind: "key", phase: 1,
    text: "إيه القضية بالظبط؟",
    answer: "عميل قديم اسمه أبو سعيد، عنده متجر ملابس في المنصورة. اتصل بيا وقالي إن مبيعاته نزلت وعايز يعمل تخفيضات. بس قلتله استنى لحد ما تروح أنت تشوف.",
    insight: "العميل: أبو سعيد — متجر ملابس بالمنصورة. الشكوى المبدئية: مبيعات نزلت + عايز تخفيضات.",
  },
  {
    id: "M2", character: "mansour", kind: "key", phase: 1,
    text: "العميل عايز مننا إيه بالضبط؟",
    answer: "هو متمسّك بالتخفيضات. مهمتك إنك تتأكد إن ده الحل الصح قبل ما ننفّذ. لو طلع غلط، تطلعله البديل.",
    insight: "المهمة: التحقق من صحة الحل المقترح (التخفيضات) قبل التنفيذ.",
  },
  {
    id: "M3", character: "mansour", kind: "minor", phase: 1,
    text: "في معلومات أولية عن المتجر؟",
    answer: "متجر بقاله سنين، عميل عندنا من سنتين، اشتغلنا معاه قبل كده على المخزون. الباقي اعرفه أنت بنفسك من على الأرض.",
    insight: "علاقة سابقة مع العميل من سنتين — اشتغلنا معاه على تنظيم المخزون.",
  },
  {
    id: "M4", character: "mansour", kind: "key", phase: 1,
    text: "إيه القاعدة اللي لازم أمشي بيها؟",
    answer: "اسأل قبل ما تحكم. فكّك قبل ما تحلّ. والرقم لوحده مش حقيقة — لازم تعرف بتقارن بإيه.",
    insight: "🔑 المنهجية: اسأل قبل ما تحكم، فكّك قبل ما تحلّ، والرقم محتاج مرجع.",
  },
];

// ════════════════════════════════════════════════════════════════════════════
// 🧔 أبو سعيد (16 سؤال)
// ════════════════════════════════════════════════════════════════════════════
// التوزيع:
//   - Key (5): AS_CTX1, AS_SYM1, AS_SYM2, AS_BELIEF, AS_BRIDGE_SALMA
//   - Minor (3): AS_CTX2, AS_NOCHANGE, AS_NOCOMPLAINTS
//   - Misleading (7): AS_COMPETITOR, AS_PRICES, AS_STAFF_LAZY, AS_STAFF_LEFT,
//                     AS_DISCOUNT_NOW, AS_LOCATION_BAD, AS_QUALITY_DROP
//   - Premature (1): AS_MALL (يصبح Key بعد ما يفتح المرحلة 4)

export const ABU_SAEED_QUESTIONS: Question[] = [
  // ─── 🟢 Key — Phase 1 (السياق) ───
  {
    id: "AS_CTX1", character: "abuSaeed", kind: "key", phase: 1,
    text: "حضرتك بقالك قد إيه في مجال الملابس والمتجر ده تحديدًا؟",
    answer: "أنا في الملابس من 20 سنة. ابتدأت موظف صغير لحد ما فتحت لنفسي. المتجر ده عمره 6 سنين، عملته بإيدي. بدأت بـ 3 موظفين دلوقتي 8.",
    insight: "🔑 خبرة 20 سنة + متجر مستقر بقاله 6 سنين + توسّع تشغيلي (3 → 8 موظفين). ده مش متجر ناشئ.",
    unlocks: ["AS_SYM1"],
  },
  {
    id: "AS_CTX2", character: "abuSaeed", kind: "minor", phase: 1,
    text: "المتجر بيبيع إيه بالظبط ومين الفئة المستهدفة؟",
    answer: "ملابس عيلات — حريمي وأطفال أكتر. زباينا في الغالب من ست المنطقة، طبقة متوسطة. مفيش براندات عالمية، تشكيلة محترمة بأسعار مناسبة.",
    insight: "تخصص واضح: ملابس عيلات للطبقة المتوسطة في المنطقة المحلية.",
    unlocks: ["AS_SYM1"],
  },

  // ─── 🟢 Key — Phase 2 (عرض المشكلة) ───
  {
    id: "AS_SYM1", character: "abuSaeed", kind: "key", phase: 2,
    text: "طب إيه اللي خلاك تطلب استشارة دلوقتي تحديدًا؟",
    answer: "بصراحة المبيعات نزلت بشكل واضح الموسم ده، وأنا قلقان. الناس مش بتدخل زي الأول. حاسس إن في حاجة بتحصل ولازم أتحرك.",
    insight: "🔑 العَرَض: مبيعات نزلت + مالك قلقان + إحساس بأن الحركة قلّت.",
    unlocks: ["AS_SYM2", "AS_BELIEF"],
  },
  {
    id: "AS_SYM2", character: "abuSaeed", kind: "key", phase: 2,
    text: "نزلت بكام؟ ومقارنة بإيه بالظبط؟",
    answer: "حوالي 20% أقل من نفس الموسم السنة اللي فاتت. ده رقم سلمى المحاسبة طلعتهولي. مش إحساس — رقم.",
    insight: "🔑 الرقم: -20% مقارنة بنفس الموسم من السنة اللي فاتت فقط (مرجع سنة واحدة).",
    unlocks: ["AS_BRIDGE_SALMA"],
  },
  {
    id: "AS_BELIEF", character: "abuSaeed", kind: "key", phase: 2,
    text: "حضرتك شايف الحل في إيه من وجهة نظرك؟",
    answer: "تخفيضات. لازم نتحرك قبل ما الموسم يفوت. الناس بتحب الأوكازيون. هنرجّع الزحمة بسرعة.",
    insight: "🔑 تفسير العميل: 'السبب أسعار → الحل تخفيضات.' (Owner Belief)",
    unlocks: ["AS_BRIDGE_SALMA"],
  },

  // ─── 🟢 Key — Phase 3 (جسر سلمى) ───
  {
    id: "AS_BRIDGE_SALMA", character: "abuSaeed", kind: "key", phase: 3,
    text: "ممكن نبص على الأرقام والتفاصيل المالية مع المحاسبة؟",
    answer: "اتفضل. سلمى قاعدة في المكتب الجوّاني، بقالها معايا 4 سنين وعارفة كل حاجة. روح كلّمها وانا تحت أمرك بعدها.",
    insight: "🔑 يفتح سلمى — مصدر الأرقام التفصيلية.",
  },

  // ─── 🟡 Minor (مفيدة بس مش حاسمة) ───
  {
    id: "AS_NOCHANGE", character: "abuSaeed", kind: "minor", phase: 1,
    text: "غيّرت حاجة في المتجر مؤخرًا — تشكيلة، ديكور، أسعار، موظفين؟",
    answer: "لا والله، كل حاجة زي ما هي. نفس التشكيلة، نفس الموردين، نفس الأسعار، نفس الناس. ده اللي محيّرني.",
    insight: "ثبات داخلي كامل — مفيش متغيّر داخلي يفسّر النزول. → السبب خارجي أو في المرجع.",
  },
  {
    id: "AS_NOCOMPLAINTS", character: "abuSaeed", kind: "minor", phase: 2,
    text: "الزبائن اللي بيدخلوا بيشتكوا من حاجة؟",
    answer: "لا أبدًا. اللي بيدخل بيشتري وبيمشي مبسوط. الناس بتعرفنا بالاسم. بس العدد اللي بيدخل أقل.",
    insight: "نفي شكاوى الجودة/الخدمة. الزبائن الموجودين راضيين — المشكلة في 'العدد' مش في 'الرضا'.",
  },

  // ─── 🔴 Misleading — مغرية بس بتوديك للفخ ───
  {
    id: "AS_COMPETITOR", character: "abuSaeed", kind: "misleading", phase: 0,
    text: "في محلات منافسة فتحت قريب وممكن تكون بتسرق منك زباين؟",
    answer: "إممم… آه فيه محل فتح من شهرين شارع جنبنا. بس هو ملابس رجالي براندات. مش نفس فئتي بصراحة. بس ممكن يكون بياخد حركة عامة من المنطقة.",
    insight: null, // مفيش insight حقيقي — السؤال موّه السبب
    unlocks: ["AS_PRICES"],
  },
  {
    id: "AS_PRICES", character: "abuSaeed", kind: "misleading", phase: 0,
    text: "تفتكر أسعارهم أرخص منك ودي مشكلة؟",
    answer: "ممكن. الناس دلوقتي بتدور على الأرخص. يمكن ده اللي بيوديهم لمحلات تانية بدل عندي.",
    insight: null,
  },
  {
    id: "AS_STAFF_LAZY", character: "abuSaeed", kind: "misleading", phase: 0,
    text: "الموظفين بقوا أقل التزامًا ولا في مشاكل في خدمة العميل؟",
    answer: "صعب أقولك. أنا مش معاهم طول الوقت. ممكن يكون فيه تكاسل، الواحد لما يقعد كتير في مكان بيتعوّد.",
    insight: null, // اتهام بدون دليل
  },
  {
    id: "AS_STAFF_LEFT", character: "abuSaeed", kind: "misleading", phase: 0,
    text: "في موظف مشي مؤخرًا وأخد زباين معاه؟",
    answer: "لا كلهم زي ما هم. مفيش حد مشي من سنة على الأقل.",
    insight: null,
  },
  {
    id: "AS_DISCOUNT_NOW", character: "abuSaeed", kind: "misleading", phase: 0,
    text: "نعمل عروض وتخفيضات قوية دلوقتي عشان نواجه الموقف؟",
    answer: "إيه الكلام الجميل ده! ده اللي حاسس بيه فعلاً. خلينا نبدأ بكره. كنت محتاج حد يأكدلي.",
    insight: null, // الأسوأ — اللاعب وافق على الحل قبل ما يفهم المشكلة
  },
  {
    id: "AS_LOCATION_BAD", character: "abuSaeed", kind: "misleading", phase: 0,
    text: "تفتكر مكان المتجر نفسه بقى مش مناسب؟ نفكّر في نقله؟",
    answer: "والله محبّتش الكلام ده. أنا هنا 6 سنين والمكان عرفني. بس ممكن المنطقة هدت شوية، مش زي زمان.",
    insight: null,
  },
  {
    id: "AS_QUALITY_DROP", character: "abuSaeed", kind: "misleading", phase: 0,
    text: "ممكن جودة البضاعة من الموردين نزلت السنة دي؟",
    answer: "لا، نفس الموردين ونفس النوعيات. الزبائن مش بيرجعوا بضاعة ولا بيشتكوا من خامة. ده مش الموضوع.",
    insight: null,
  },

  // ─── ⚫ Premature → Key بعد ما يفتح Phase 4 ───
  {
    id: "AS_MALL", character: "abuSaeed", kind: "premature", phase: 4,
    text: "في مولات أو مشاريع كبيرة فتحت في المنطقة مؤخرًا؟",
    answer: "(ينظر مستغرب) إيه علاقة دي بالموضوع دلوقتي؟ خليني أقولك المشكلة الأول قبل ما نتفرّع.",
    insight: null,
    becomesKeyAfter: "SAL_BASELINE",
    keyAnswer: "آه فعلاً! من حوالي سنة ونص افتتح مول كبير على بُعد 10 دقايق. في الافتتاح كانت في موجة زباين رهيبة في كل المنطقة، الشارع كله استفاد. بس السنة دي الموضوع هدي خالص، الناس بقت تروح المول مباشرة.",
    keyInsight: "🔑 السبب الحقيقي اتأكد: مول قريب اتفتح السنة اللي فاتت → موجة حركة استثنائية لكل المنطقة → السنة دي رجعت طبيعي.",
  },
];

// ════════════════════════════════════════════════════════════════════════════
// 👩‍💼 سلمى (14 سؤال) — متقفلة لحد AS_BRIDGE_SALMA
// ════════════════════════════════════════════════════════════════════════════
// التوزيع:
//   - Key (4): SAL_DECOMPOSE, SAL_NEW_VS_OLD, SAL_BASELINE, SAL_NEIGHBORS
//   - Minor (3): SAL_AVG_BASKET, SAL_TIMING, SAL_SUPPLIER_COST
//   - Misleading (6): SAL_RETURNS, SAL_THEFT, SAL_OPEX, SAL_BIG_CLIENTS,
//                     SAL_REFUNDS, SAL_DISCOUNTS_HISTORY
//   - Premature (1): SAL_FORECAST

export const SALMA_QUESTIONS: Question[] = [
  // ─── 🟢 Key ───
  {
    id: "SAL_DECOMPOSE", character: "salma", kind: "key", phase: 3,
    text: "الـ 20% نزلوا في عدد الزبائن اللي بيدخلوا، ولا في قيمة الفاتورة الواحدة؟",
    answer: "سؤال مهم جدًا. عدد الفواتير هو اللي أقل — يعني زبائن أقل بيدخلوا. متوسط الفاتورة ثابت تقريبًا. اللي بيدخل بيشتري زي زمان، بس الناس اللي بتدخل قلّت.",
    insight: "🔑 تفكيك MECE: المشكلة في 'الحجم' (عدد الزبائن) مش في 'القيمة' (سلة الشراء). → فرضية جودة/أسعار/موظفين كلها تسقط.",
    unlocks: ["SAL_NEW_VS_OLD", "SAL_BASELINE"],
  },
  {
    id: "SAL_NEW_VS_OLD", character: "salma", kind: "key", phase: 3,
    text: "نسبة الزبائن الجداد للقدامى فضلت زي ما هي ولا اتغيّرت؟",
    answer: "تقريبًا نفس النسبة. الزبائن الدايمين بيرجعوا بنفس المعدّل. النقص في 'الناس اللي بتمر وتدخل أول مرة'.",
    insight: "🔑 الولاء صحي. النقص في 'تدفّق الجداد' = إشارة لتغيّر خارجي في حركة المنطقة، مش في المتجر.",
  },
  {
    id: "SAL_BASELINE", character: "salma", kind: "key", phase: 4,
    text: "ممكن أشوف أرقام آخر 3 أو 4 سنين مش سنة واحدة بس؟",
    answer: "اتفضل، دي الجداول. شوف بنفسك: متوسط أول 3 سنين كان حوالي 85 ألف في الشهر. السنة اللي فاتت فجأة طلع 105 ألف — يعني أعلى بـ 25% من المتوسط. السنة دي رجع 87 ألف — يعني تقريبًا نفس متوسط الـ 3 سنين الأولى.",
    insight: "🔑 الكشف الحاسم: السنة اللي فاتت كانت الاستثناء، مش القاعدة. الأداء الحالي = المتوسط التاريخي الطبيعي. مفيش 'انخفاض'. فيه 'رجوع لطبيعي بعد قمة استثنائية'.",
    unlocks: ["SAL_NEIGHBORS"],
  },
  {
    id: "SAL_NEIGHBORS", character: "salma", kind: "key", phase: 4,
    text: "المحلات التانية في الشارع شافت نفس النزول السنة دي؟",
    answer: "أنا عارفة صاحبة الصيدلية جنبنا، وأم محمد بتاعة محل الأحذية. الاتنين بيقولوا نفس الكلام: السنة اللي فاتت كانت أحسن سنة عندهم بسبب زحمة المول الجديد، السنة دي رجعت طبيعي. الموضوع مش خاص بينا.",
    insight: "🔑 دليل خارجي مستقل: الظاهرة شاملة لكل المنطقة. → السبب الحقيقي = صدمة خارجية إيجابية مؤقتة (افتتاح المول) رفعت baseline السنة الماضية بشكل غير مستدام.",
  },

  // ─── 🟡 Minor ───
  {
    id: "SAL_AVG_BASKET", character: "salma", kind: "minor", phase: 3,
    text: "متوسط قيمة الفاتورة اتغيّر؟",
    answer: "ثابت تقريبًا. فرق بسيط جدًا في حدود 2-3% مش حاجة معتبرة.",
    insight: "متوسط الفاتورة ثابت (~2-3% فرق) — الزبون اللي بيدخل بينفق نفس المبلغ.",
  },
  {
    id: "SAL_TIMING", character: "salma", kind: "minor", phase: 3,
    text: "في فترة معينة من الموسم نزلت أكتر من غيرها؟",
    answer: "موزّع على الموسم كله. مفيش شهر بعينه أوحش من شهر. النزول ثابت ومتساوي.",
    insight: "النزول موزّع بالتساوي — مش مرتبط بحدث معيّن في وقت محدد.",
  },
  {
    id: "SAL_SUPPLIER_COST", character: "salma", kind: "minor", phase: 3,
    text: "تكلفة البضاعة من المورد طلعت السنة دي؟",
    answer: "ثابتة تقريبًا. كان في زيادة بسيطة 3% بداية السنة وعدّيناها للعميل في السعر.",
    insight: "تكاليف ثابتة. الهامش محفوظ. → التخفيضات هتاكل الهامش ده مباشرة.",
  },

  // ─── 🔴 Misleading ───
  {
    id: "SAL_RETURNS", character: "salma", kind: "misleading", phase: 0,
    text: "المرتجعات زادت السنة دي ودي مشكلة جودة؟",
    answer: "لا بالعكس. المرتجعات أقل من السنة اللي فاتت. الناس راضية باللي بتشتريه.",
    insight: null,
  },
  {
    id: "SAL_THEFT", character: "salma", kind: "misleading", phase: 0,
    text: "في شك في سرقة من الموظفين أو نقص في المخزون؟",
    answer: "(تنظر بحدة) لأ خالص. الجرد بيتعمل كل أسبوعين والأرقام مظبوطة. أبو سعيد ميسمحش بكلام زي ده عن الناس بتاعته من غير دليل.",
    insight: null,
  },
  {
    id: "SAL_OPEX", character: "salma", kind: "misleading", phase: 0,
    text: "المصاريف التشغيلية زادت وأكلت من الأرباح؟",
    answer: "ثابتة. الإيجار، المرتبات، الكهرباء — كل ده زي السنة اللي فاتت. الموضوع مش في المصاريف.",
    insight: null, // الفخ: اللاعب بيخلط بين الإيراد والربح
  },
  {
    id: "SAL_BIG_CLIENTS", character: "salma", kind: "misleading", phase: 0,
    text: "في عملاء كبار وقفوا التعامل مع المتجر؟",
    answer: "إحنا تجزئة، مفيش 'عملاء كبار'. كل بيعاتنا فردية للزبون النهائي.",
    insight: null, // السؤال أصلًا غلط لنوع البزنس
  },
  {
    id: "SAL_REFUNDS", character: "salma", kind: "misleading", phase: 0,
    text: "في فلوس مردودة للزبائن السنة دي بشكل غير عادي؟",
    answer: "لا، الاسترداد نادر عندنا أصلاً وما اتغيرش. أرقام بسيطة جدًا.",
    insight: null,
  },
  {
    id: "SAL_DISCOUNTS_HISTORY", character: "salma", kind: "misleading", phase: 0,
    text: "السنة اللي فاتت كنا بنعمل تخفيضات أكتر؟ يعني الزبائن جم بسبب الأوكازيون؟",
    answer: "لا أبدًا. السنة اللي فاتت كان فيه أوكازيون نهاية الموسم العادي بس، نفس السنة دي بالظبط. مفيش فرق في سياسة التخفيضات.",
    insight: null, // الفخ: اللاعب بيحاول يربط النزول بالتخفيضات بدل ما يدور على السبب الحقيقي
  },

  // ─── ⚫ Premature ───
  {
    id: "SAL_FORECAST", character: "salma", kind: "premature", phase: 4,
    text: "تقدري تعملي توقّع للأرقام السنة الجاية؟",
    answer: "أقدر، بس عايز الأول نعرف بنحاول نفهم إيه. التوقّع لازم يكون مبني على فهم واضح للسبب، مش مجرد مدّ خط.",
    insight: null,
    becomesKeyAfter: "SAL_BASELINE",
    keyAnswer: "بناء على الـ 3 سنين قبل المول، التوقّع الواقعي يبقى استمرار حوالي 85-90 ألف في الشهر — اللي هو نفس مستوى السنة دي. السنة اللي فاتت كانت قمة استثنائية مش هتتكرر.",
    keyInsight: "التوقّع المستقبلي يجب يكون مبني على متوسط الـ 3 سنين قبل المول، مش على قمة السنة الماضية.",
  },
];

// ════════════════════════════════════════════════════════════════════════════
// 📚 تجميع
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
// ⚙️ الإعدادات الأساسية
// ════════════════════════════════════════════════════════════════════════════

/** ميزانية الأسئلة الإجمالية (بدون منصور) */
export const QUESTION_BUDGET = 14;

/** حجم الـ set الواحد المعروض في كل لحظة */
export const SET_SIZE = 5;

/** الأسئلة المفتاحية (Key) — معيار الـ Golden Insights */
export const GOLDEN_QUESTION_IDS = [
  "AS_CTX1", "AS_SYM1", "AS_SYM2", "AS_BELIEF", "AS_BRIDGE_SALMA", "AS_MALL",
  "SAL_DECOMPOSE", "SAL_NEW_VS_OLD", "SAL_BASELINE", "SAL_NEIGHBORS",
];

// ════════════════════════════════════════════════════════════════════════════
// 🔓 منطق فتح الأسئلة وتقدّم المراحل
// ════════════════════════════════════════════════════════════════════════════

/** يحسب المرحلة الحالية بناءً على الأسئلة المفتاحية اللي اتسألت */
export const computeCurrentPhase = (askedIds: string[]): GamePhase => {
  const askedSet = new Set(askedIds);
  // Phase 4: لما يكتشف الـ Baseline أو الـ Neighbors
  if (askedSet.has("SAL_BASELINE") || askedSet.has("SAL_NEIGHBORS")) return 4;
  // Phase 3: لما يفتح سلمى أو يفكّك
  if (askedSet.has("AS_BRIDGE_SALMA") || askedSet.has("SAL_DECOMPOSE")) return 3;
  // Phase 2: لما يكتشف الـ Symptom
  if (askedSet.has("AS_SYM1") || askedSet.has("AS_SYM2") || askedSet.has("AS_BELIEF")) return 2;
  // Phase 1 (افتراضي)
  return 1;
};

/** هل سلمى متاحة للسؤال؟ */
export const isCharacterUnlocked = (character: Character, askedIds: string[]): boolean => {
  if (character === "mansour" || character === "abuSaeed") return true;
  // سلمى تتفتح بعد AS_BRIDGE_SALMA
  return askedIds.includes("AS_BRIDGE_SALMA");
};

/**
 * يرجّع الـ set المعروض حاليًا للاعب لشخصية معيّنة.
 * المنطق:
 *   - يأخد الأسئلة من المرحلة الحالية والمراحل السابقة (اللي لسه مأتسألتش)
 *   - يضيف عينة من المضللات (phase 0) عشان دايمًا يكون فيه إغراء
 *   - الـ Premature يظهر فقط في مرحلته
 *   - يحدّ العدد بـ SET_SIZE (5)
 *   - الترتيب: مضللات + ثانوية + key مخلوطة (مش مرتبة)
 */
export const getQuestionsForSet = (
  character: Character,
  askedIds: string[]
): Question[] => {
  const askedSet = new Set(askedIds);
  const currentPhase = computeCurrentPhase(askedIds);
  const charQuestions = QUESTIONS_BY_CHARACTER[character];

  // الأسئلة اللي مأتسألتش
  const available = charQuestions.filter((q) => !askedSet.has(q.id));

  // 1) Key/Minor من المرحلة الحالية أو السابقة
  const relevantContent = available.filter(
    (q) => (q.kind === "key" || q.kind === "minor") && q.phase !== 0 && q.phase <= currentPhase
  );

  // 2) Premature من المرحلة الحالية (يظهر مغري لكن رد سطحي)
  const prematures = available.filter(
    (q) => q.kind === "premature" && q.phase <= currentPhase + 1
  );

  // 3) Misleading — دايمًا متاحة (phase 0)
  const misleading = available.filter((q) => q.kind === "misleading");

  // اختيار: نعرض كل الـ relevant content + 2-3 misleading + premature
  const set: Question[] = [];
  set.push(...relevantContent.slice(0, 2));
  set.push(...prematures.slice(0, 1));
  set.push(...misleading.slice(0, SET_SIZE - set.length));

  // لو فاضل مكان، نملا بـ relevant content
  if (set.length < SET_SIZE) {
    const extras = relevantContent.slice(2, SET_SIZE - set.length + 2);
    set.push(...extras);
  }

  // خلط بسيط (مش عشوائي تمامًا — نحط Key مش في الأول دايمًا)
  return shuffleStable(set, askedIds.length);
};

/** خلط مستقر بناءً على seed عشان الـ set ميتغيرش كل render */
function shuffleStable<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(((seed * 9301 + 49297 + i * 233) % 233280) / 233280 * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** يحدد لو السؤال Premature بقى Key بناءً على اللي اتسأل */
export const resolveQuestionState = (
  question: Question,
  askedIds: string[]
): { effectiveAnswer: string; effectiveInsight: string | null; isEffectivelyKey: boolean } => {
  if (question.kind === "premature" && question.becomesKeyAfter) {
    if (askedIds.includes(question.becomesKeyAfter)) {
      return {
        effectiveAnswer: question.keyAnswer || question.answer,
        effectiveInsight: question.keyInsight || null,
        isEffectivelyKey: true,
      };
    }
  }
  return {
    effectiveAnswer: question.answer,
    effectiveInsight: question.insight,
    isEffectivelyKey: question.kind === "key",
  };
};

// ════════════════════════════════════════════════════════════════════════════
// 🎯 شاشة التأطير — 4 خانات
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
    prompt: "العَرَض اللي العميل بيقيسه ويشتكي منه:",
    choices: [
      { id: "sym_a", text: "المبيعات نزلت 20% عن السنة اللي فاتت", isCorrect: true,
        explanation: "ده العَرَض الفعلي — رقم محدد ومرجع محدد." },
      { id: "sym_b", text: "المنافسة من المول الجديد سحبت زباين", isCorrect: false,
        explanation: "ده تفسير افتراضي مش عَرَض. والمول مش منافس أصلاً." },
      { id: "sym_c", text: "الموظفين بقوا أقل التزامًا", isCorrect: false,
        explanation: "اتهام بدون دليل. الزبائن الموجودين راضيين." },
      { id: "sym_d", text: "جودة البضاعة نزلت", isCorrect: false,
        explanation: "المرتجعات أقل من السنة اللي فاتت. الجودة ثابتة." },
    ],
  },
  {
    id: "ownerBelief",
    label: "تفسير العميل",
    prompt: "المالك فاكر إن السبب والحل هو:",
    choices: [
      { id: "own_a", text: "الأسعار عالية → نعمل تخفيضات قوية", isCorrect: true,
        explanation: "ده اللي قاله أبو سعيد بالحرف. هو متمسّك بالتخفيضات كحل." },
      { id: "own_b", text: "المنطقة بقت وحشة → ننقل المتجر", isCorrect: false,
        explanation: "أبو سعيد رفض فكرة النقل بشكل واضح." },
      { id: "own_c", text: "الموردين مأخّرين البضاعة", isCorrect: false,
        explanation: "ما طرحش ده. الموردين زي ما هم." },
      { id: "own_d", text: "محتاج يفتح فرع تاني", isCorrect: false,
        explanation: "الحل الوحيد اللي طرحه هو التخفيضات." },
    ],
  },
  {
    id: "rootCause",
    label: "السبب الحقيقي",
    prompt: "السبب الحقيقي للظاهرة هو:",
    choices: [
      { id: "root_a", text: "المرجع غلط — السنة اللي فاتت كانت قمة استثنائية بسبب افتتاح المول. الأرقام الحالية = الطبيعي.", isCorrect: true,
        explanation: "الكشف الحاسم. متوسط 3 سنين قبل المول = 85K. السنة الماضية = 105K (قمة). السنة دي = 87K (طبيعي). كل المنطقة نفس الكلام." },
      { id: "root_b", text: "المنافسة من المحل الجديد سحبت زباين", isCorrect: false,
        explanation: "المحل الجديد مش نفس الفئة (رجالي براندات). ومش هو السبب الحقيقي." },
      { id: "root_c", text: "تكاسل الموظفين وضعف الخدمة", isCorrect: false,
        explanation: "الزبائن الموجودين راضيين، نسبة الجداد/القدامى ثابتة، مفيش شكاوى." },
      { id: "root_d", text: "تغيّر في أذواق الزبائن", isCorrect: false,
        explanation: "متوسط الفاتورة ثابت ونوع المشتريات نفسه. الذوق ما اتغيرش." },
    ],
  },
  {
    id: "decision",
    label: "القرار الصح",
    prompt: "القرار الصح اللي تنصح بيه:",
    choices: [
      { id: "dec_a", text: "ما يعملش تخفيضات. يعيد بناء baseline حقيقي ويطمّن إن الأداء طبيعي. يبدأ يخطط لنمو حقيقي بدل ملاحقة قمة وهمية.", isCorrect: true,
        explanation: "التخفيض هيأكل هامش على بيع كان هيحصل أصلاً. الصح: تصحيح المرجع + استراتيجية نمو طويلة." },
      { id: "dec_b", text: "تخفيضات قوية فورية لجذب الزباين", isCorrect: false,
        explanation: "هيخسر هامش بدون ما يجيب زباين جداد. الزبائن مش بيتأخروا بسبب السعر." },
      { id: "dec_c", text: "نقل المتجر لمنطقة جديدة", isCorrect: false,
        explanation: "حل توسّعي ضخم لمشكلة وهمية." },
      { id: "dec_d", text: "تغيير الموردين والتشكيلة بالكامل", isCorrect: false,
        explanation: "تكلفة عالية لمشكلة مش موجودة." },
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
// 📊 نظام التقييم (100 نقطة)
// ════════════════════════════════════════════════════════════════════════════

export interface ScoreBreakdown {
  /** الأسئلة المفتاحية اللي اكتشفها (50 نقطة) */
  keyInsightsScore: number;
  /** عقاب الأسئلة المضللة (-4 لكل واحد، حد أقصى -20) */
  misleadingPenalty: number;
  /** عقاب الأسئلة السابقة لأوانها (-3 لكل واحد، حد أقصى -10) */
  prematurePenalty: number;
  /** بونص كفاءة الميزانية (حد أقصى 10) */
  efficiencyBonus: number;
  /** دقة التأطير (40 نقطة — 10 لكل خانة) */
  framingScore: number;
  total: number;
  /** عدد المضللات اللي اتسألت (للعرض) */
  misleadingCount: number;
  /** عدد الـ Premature اللي اتسألت (للعرض) */
  prematureCount: number;
  /** الأسئلة المفتاحية اللي اكتشفها */
  keyAsked: number;
  /** عدد المفتاحية الإجمالي */
  keyTotal: number;
}

export const MAX_SCORE = 100;

export const calculateTotalScore = (
  askedIds: string[],
  budgetRemaining: number,
  framingChoices: Record<string, string>
): ScoreBreakdown => {
  const askedSet = new Set(askedIds);

  // 1) Key insights (50 نقطة)
  // الـ Premature اللي بقى Key يتحسب
  const keyAsked = askedIds.filter((id) => {
    const q = getQuestionById(id);
    if (!q) return false;
    if (q.kind === "key") return true;
    if (q.kind === "premature" && q.becomesKeyAfter && askedSet.has(q.becomesKeyAfter)) return true;
    return false;
  }).length;
  const keyTotal = GOLDEN_QUESTION_IDS.length;
  const keyInsightsScore = Math.round((keyAsked / keyTotal) * 50);

  // 2) عقاب المضللات
  const misleadingCount = askedIds.filter((id) => getQuestionById(id)?.kind === "misleading").length;
  const misleadingPenalty = Math.min(misleadingCount * 4, 20);

  // 3) عقاب الـ Premature (اللي ما بقاش Key)
  const prematureCount = askedIds.filter((id) => {
    const q = getQuestionById(id);
    if (!q || q.kind !== "premature") return false;
    if (q.becomesKeyAfter && askedSet.has(q.becomesKeyAfter)) return false; // بقى key
    return true;
  }).length;
  const prematurePenalty = Math.min(prematureCount * 3, 10);

  // 4) بونص الكفاءة (لو وصل لـ insights كتير وفاضله ميزانية)
  const efficiencyBonus = keyAsked >= 6 ? Math.min(budgetRemaining, 10) : 0;

  // 5) دقة التأطير (40 نقطة)
  let correctFraming = 0;
  FRAMING_SLOTS.forEach((slot) => {
    const choice = slot.choices.find((c) => c.id === framingChoices[slot.id]);
    if (choice?.isCorrect) correctFraming++;
  });
  const framingScore = correctFraming * 10;

  const total = Math.max(
    0,
    keyInsightsScore - misleadingPenalty - prematurePenalty + efficiencyBonus + framingScore
  );

  return {
    keyInsightsScore,
    misleadingPenalty,
    prematurePenalty,
    efficiencyBonus,
    framingScore,
    total,
    misleadingCount,
    prematureCount,
    keyAsked,
    keyTotal,
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
  { min: 85, max: 100, title: "محلل استثنائي", titleEn: "Exceptional Analyst", icon: "🏆",
    description: "كسرت الفخ، شككت في المرجع، ووصلت للسبب الحقيقي بأقل عدد أسئلة. ده اللي بيفرّق المستشار الحقيقي.",
    color: "text-yellow-400" },
  { min: 65, max: 84, title: "محلل قوي", titleEn: "Strong Analyst", icon: "🥈",
    description: "وصلت للحل الصح بس مع بعض التشتت في أسئلة مضللة أو سابقة لأوانها. شغل كويس بيحتاج صقل.",
    color: "text-slate-300" },
  { min: 45, max: 64, title: "محلل واعد", titleEn: "Promising Analyst", icon: "🥉",
    description: "فهمت أجزاء من الصورة بس فاتك العمق. الدرس: لا تقفز للحلول قبل ما تكسّر المشكلة.",
    color: "text-amber-500" },
  { min: 0, max: 44, title: "وقعت في الفخ", titleEn: "Caught in the Trap", icon: "📚",
    description: "اتسحبت ورا الأسئلة الواضحة وفاتك السؤال الحقيقي: 'مقارن بإيه؟'. ده الفخ اللي بيقع فيه أغلب المحللين.",
    color: "text-orange-500" },
];

export const getScoreLevel = (score: number): ScoreLevel => {
  return SCORE_LEVELS.find((l) => score >= l.min && score <= l.max) || SCORE_LEVELS[SCORE_LEVELS.length - 1];
};
