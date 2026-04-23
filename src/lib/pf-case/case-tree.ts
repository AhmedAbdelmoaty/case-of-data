// ============================================================
// Case Tree — Spine (S1..S5) + Topic Pools for wrong tracks (A/C/D)
// ============================================================
// Spine nodes use fixed correct/wrong options.
// Wrong tracks (A/C/D) use TOPIC POOLS — engine picks 2 unasked
// topics each round, so no question repeats and the order changes
// based on what the player picks.
// ------------------------------------------------------------

export type SpineNodeId = "S1" | "S2" | "S3" | "S4" | "S5" | "END";
export type NodeId = SpineNodeId | "ON_TRACK";

export type TrackId = "A" | "C" | "D";

export type CaseOutcome = "strong" | "medium" | "weak";

export interface CaseNoteCandidate {
  id: string;
  text: string;
}

export interface CaseQuestionOption {
  text: string;
  hishamReply: string;
  evidenceId?: string;
  note?: CaseNoteCandidate;
}

export interface SpineNode {
  id: SpineNodeId;
  context?: string;
  correct: CaseQuestionOption;
  wrong: CaseQuestionOption;
  nextOnCorrect: SpineNodeId;
  /** When wrong is chosen, player enters this track (or END) */
  nextOnWrong: SpineNodeId | "ON_TRACK";
  /** Track to enter when wrong is chosen */
  wrongEntersTrack?: TrackId;
  /** Optional: which topic in the track is auto-skipped because the wrong question already covered it */
  wrongConsumesTopicId?: string;
}

/** A single inquiry topic inside a wrong track */
export interface TrackTopic {
  id: string;
  text: string;
  hishamReply: string;
  evidenceId?: string;
  note?: CaseNoteCandidate;
}

/** A wrong track is a pool of topics + a final "conclusion" option */
export interface TrackPool {
  id: TrackId;
  topics: TrackTopic[];
  /** Final wrap-up shown when player has exhausted topics or reaches last question */
  conclusion: TrackTopic;
}

// ============================================================
// SPINE — unchanged narrative on the correct path
// ============================================================

export const SPINE: Record<SpineNodeId, SpineNode> = {
  S1: {
    id: "S1",
    context: "البداية: أستاذ هشام قاعد قدامك، حاطط إيده على راسه. لسه ما قال أرقام ولا سنين.",
    correct: {
      text: "تعالى نمشي خطوة خطوة يا أستاذ هشام. الإحساس ده جالك إزاي بالظبط؟ ممكن تحكيلي إيه اللي حاصل وشايف المشكلة فين؟",
      hishamReply:
        "والله يا فندم، الموضوع كله إن المحل فيه حركة كويسة، الناس داخلة طالعة. بس في آخر الشهر لما قعدت أبصّ على الورق، لقيت المبيعات قليلة، الرقم اللي طالع لي أقل من المتوقّع.",
      note: {
        id: "n_s1_problem_open",
        text: "أستاذ هشام حاسس إن مبيعات الشهر مش زي ما هو متوقّع — تقييم مبني على إحساس مش رقم.",
      },
    },
    wrong: {
      text: "أستاذ هشام، عندي إحساس إن المشكلة دي غالبًا من فريق البيع — يمكن مش بيتحركوا زي الأول. ممكن نبص على شغلهم الأول؟",
      hishamReply:
        "هممم… والله ممكن يا فندم. الفريق عندي من زمان، بس فعلاً ممكن يكونوا اتراخوا في حاجة. تعالى نشوف سوا.",
      note: {
        id: "n_s1_jump_internal",
        text: "اقتراح مبكر إن المشكلة من فريق البيع — قبل ما المشكلة نفسها تتحدد.",
      },
    },
    nextOnCorrect: "S2",
    nextOnWrong: "ON_TRACK",
    wrongEntersTrack: "A",
  },

  S2: {
    id: "S2",
    context: "أستاذ هشام قال 'أقل من المتوقع' — محتاج تفهم: متوقّع مقارنةً بإيه؟",
    correct: {
      text: "طب خلينا نقف هنا. لما بتقول المبيعات أقل من المتوقع، ممكن تقولي قلت بنسبة قد ايه وحضرتك بتقارن بإيه؟ ",
      hishamReply:
        "أنا قارنت الشهر ده بنفس الشهر السنة اللي فاتت، يعني فبراير 2025. ولقيت الفرق بالنسبة لي كبير، المبيعات أقل بحوالي 30%، حاجة تقلق فعلاً، مش حاجة أقدر أسكت عليها.",
      note: {
        id: "n_s2_baseline_one_year",
        text: "أستاذ هشام بيقارن فبراير 2026 بفبراير 2025 بس — مرجعية سنة وحدة.",
      },
    },
    wrong: {
      text: "تمام، ممكن أبص على تقرير المبيعات بتاعت الشهر ده؟ خلينا نشوف الأرقام.",
      hishamReply:
        "اتفضل يا فندم. ده تقرير المبيعات اليومية للشهر اللي إحنا فيه. هتلاقي تذبذب طبيعي في الأرقام، بس الإجمالي في الآخر هو اللي قلقني.",
      evidenceId: "ev_daily_sales",
      note: {
        id: "n_s2_jumped_to_data",
        text: "طلب البيانات قبل ما يفهم المرجع — التقرير اليومي مش بيرد على سؤال «أقل مقارنةً بإيه؟».",
      },
    },
    nextOnCorrect: "S3",
    nextOnWrong: "ON_TRACK",
    wrongEntersTrack: "D",
  },

  S3: {
    id: "S3",
    context: "عرفت إنه بيقارن بسنة وحدة. محتاج تشوف المقارنة دي على ورق.",
    correct: {
      text: "تمام. طب ممكن أشوف الأرقام دي على ورق؟ هل فيه تقرير بيأكد الكلام ده؟",
      hishamReply:
        "أكيد يا فندم. أنا طلبت من المحاسبة تطبع لي التقرير لما بدأت أقلق. اتفضل، خد التقرير ده وبصّ بنفسك.",
      evidenceId: "ev_year_vs_year",
      note: {
        id: "n_s3_chart1_confirmed",
        text: "تقرير المحاسبة (فبراير 2025 vs فبراير 2026) في الدفتر — الفرق واضح بالأرقام.",
      },
    },
    wrong: {
      // Pure competitors framing — no marketing/campaign mention
      text: "طب قبل ما نكمل، المنافسين حواليك بيعملوا إيه دلوقتي؟ ممكن السوق بقى أصعب.",
      hishamReply:
        "صراحة يا فندم، المحلات حواليّا بيعملوا عروض وخصومات كل أسبوع تقريبًا. ممكن ده بيسحب مني زباين فعلاً.",
      evidenceId: "ev_competitor_offers",
      note: {
        id: "n_s3_jumped_external",
        text: "اللاعب قفز للمنافسين قبل ما يتأكد من أصل المقارنة.",
      },
    },
    nextOnCorrect: "S4",
    nextOnWrong: "ON_TRACK",
    wrongEntersTrack: "C",
    // S3 wrong already showed competitor offers report — skip that topic in track C
    wrongConsumesTopicId: "c_competitor_offers",
  },

  S4: {
    id: "S4",
    context: "التقرير عرض سنة واحدة بس. السنة دي طبيعية ولا استثنائية؟",
    correct: {
      text: "حضرتك بتقارن بسنة واحدة بس. ممكن تقرير لمبيعات شهر فبراير لآخر 3 سنين، نشوف فبراير 2024 كمان عشان نعرف هل سنة 2025 كانت طبيعية ولا لأ؟",
      hishamReply:
        "مفيش مشكلة. خليني أطلب من المحاسبة تطلّعهالي على ورقة تانية… اتفضل، ده تقرير الـ 3 سنين كلهم جنب بعض. شوف بنفسك.",
      evidenceId: "ev_three_year",
      note: {
        id: "n_s4_chart2_anomaly",
        text: "تقرير 3 سنين في الدفتر — سنة 2025 واضح إنها مختلفة عن 2024 و2026.",
      },
    },
    wrong: {
      text: "طب ممكن نقارن أسعارنا بأسعار المنافسين دلوقتي؟ يمكن السعر هو اللي بيفرق.",
      hishamReply:
        "ماشي يا فندم. أنا جمعت من زمان آخر العروض من المحلات اللي حوالينا. اتفضل، ده اللي عندي.",
      evidenceId: "ev_competitor_offers",
      note: {
        id: "n_s4_jumped_external",
        text: "قفز لفرضية خارجية (المنافسين) قبل ما يتأكد إن المرجع نفسه صحيح.",
      },
    },
    nextOnCorrect: "S5",
    nextOnWrong: "ON_TRACK",
    wrongEntersTrack: "C",
    wrongConsumesTopicId: "c_competitor_offers",
  },

  S5: {
    id: "S5",
    context: "التقرير وضّح إن سنة 2025 طالعة عن الباقي. ليه؟ محتاج تفكيك للرقم.",
    correct: {
      text: "حضرتك عندك تقرير بيوضح المبيعات دي ماشية إزاي؟ يعني نوعية البيع، تفاصيله، مش بس رقم إجمالي؟",
      hishamReply:
        "آه طبعًا، عندي تقرير من المحاسبة بيقسّم البيع. خليني أجيب لك ورقة بتفصّل كل سنة على حدة. اتفضل، خد ده وبصّ بنفسك.",
      evidenceId: "ev_breakdown",
      note: {
        id: "n_s5_truth",
        text: "تقرير التفكيك في الدفتر — كشف إن سنة 2025 جالها أوردر شركات استثنائي. الأفراد ماشيين في نمو طبيعي.",
      },
    },
    wrong: {
      text: "طب ممكن نبص على أداء الحملات الإعلانية الأخيرة؟",
      hishamReply:
        "اتفضل يا فندم، ده تقرير التسويق بتاع السنة دي والسنة اللي فاتت. هتلاقي فيه الميزانية والأرقام.",
      evidenceId: "ev_marketing",
      note: {
        id: "n_s5_jumped_marketing",
        text: "قفز لفرضية تسويقية بدل ما يفكك الرقم نفسه — ضاع المفتاح اللي كان هيكشف الحقيقة.",
      },
    },
    nextOnCorrect: "END",
    nextOnWrong: "ON_TRACK",
    wrongEntersTrack: "D",
    // S5 wrong already showed the marketing report — skip that topic in track D
    wrongConsumesTopicId: "d_marketing_report",
  },

  END: {
    id: "END",
    correct: { text: "", hishamReply: "" },
    wrong: { text: "", hishamReply: "" },
    nextOnCorrect: "END",
    nextOnWrong: "END",
  },
};

// ============================================================
// TRACKS — Topic pools (shown 2-at-a-time, never repeating)
// ============================================================

export const TRACKS: Record<TrackId, TrackPool> = {
  // -------- TRACK A — Sales team --------
  A: {
    id: "A",
    topics: [
      {
        id: "a_team_performance",
        text: "ممكن أشوف أداء كل واحد في الفريق على حدة؟",
        hishamReply:
          "أكيد يا فندم. اتفضل، ده الجدول. هتلاقي فرق واضح بين الأول والأخير.",
        evidenceId: "ev_team_performance",
        note: {
          id: "n_a_perf",
          text: "تقرير أداء البائعين في الدفتر — كريم الأعلى، هاني الأقل.",
        },
      },
      {
        id: "a_team_conversion",
        text: "طب نبص على نسبة الإغلاق (التحويل) لكل واحد فيهم؟",
        hishamReply:
          "اتفضل، ده تقرير التحويلات. الفرق في الإغلاق نفسه واضح، مش بس في الكميات.",
        evidenceId: "ev_team_conversion",
        note: {
          id: "n_a_conv",
          text: "تقرير نسب التحويل في الدفتر — فروق واضحة بين البائعين.",
        },
      },
      {
        id: "a_team_training",
        text: "في تدريب أو متابعة منتظمة بتعملها للفريق؟ آخر تدريب كان امتى؟",
        hishamReply:
          "بصراحة يا فندم… آخر تدريب عملته للفريق بقاله سنة. والمتابعة اليومية أنا اللي بعملها بإيدي، بس مش منتظمة قوي.",
        note: {
          id: "n_a_train",
          text: "أستاذ هشام بيعترف إن التدريب والمتابعة اليومية مش منتظمين.",
        },
      },
    ],
    conclusion: {
      id: "a_conclude",
      text: "تمام، الصورة بقت أوضح: ضعف تنفيذ ومتابعة من ناحية الفريق.",
      hishamReply:
        "ماشي يا فندم… الصورة بقت أوضح. بس بصراحة لسه عندي حاجة جوايا مش مرتاح لها 100%.",
      note: {
        id: "n_a_conclude",
        text: "اللاعب حسم الفرضية على الفريق — أستاذ هشام لسه عنده شك خفيف.",
      },
    },
  },

  // -------- TRACK C — Competitors / pricing (NO marketing) --------
  C: {
    id: "C",
    topics: [
      {
        id: "c_competitor_offers",
        text: "إيه طبيعة العروض اللي بيقدمها المنافسين دلوقتي؟",
        hishamReply:
          "اتفضل يا فندم، ده اللي جمعته من حوالينا. أكتر حاجة شايفها خصومات وعروض 2+1 على بعض الموديلات.",
        evidenceId: "ev_competitor_offers",
        note: { id: "n_c_offers", text: "تقرير عروض المنافسين في الدفتر." },
      },
      {
        id: "c_customer_price_feedback",
        text: "العملاء عندك بيشتكوا من السعر مقارنة بالسوق؟",
        hishamReply:
          "بعض الزباين فعلاً قالوا «ده غالي شوية» الفترة الأخيرة، بس مش كلهم. اتفضل ده اللي سجلته من ملاحظاتهم.",
        evidenceId: "ev_customer_feedback",
        note: {
          id: "n_c_feedback",
          text: "ملاحظات العملاء — شكاوى متفرقة من السعر.",
        },
      },
      {
        id: "c_price_response",
        text: "نعمل رد سعري تنافسي — عرض محدد لفترة قصيرة على خط معين؟",
        hishamReply:
          "ممكن يا فندم. بس ده قرار محتاج دراسة، مش حاجة آخدها على ضربة واحدة.",
        note: {
          id: "n_c_response",
          text: "اقتراح رد سعري محدود — أستاذ هشام متردد.",
        },
      },
    ],
    conclusion: {
      id: "c_conclude",
      text: "يبقى الصورة بقت أوضح: السوق بيضغط على السعر ومحتاجين تحرك سعري.",
      hishamReply:
        "كلام منطقي يا فندم. بس صدّقني، لسه عندي حاجة جوايا مش مرتاح لها 100%.",
      note: {
        id: "n_c_conclude",
        text: "اللاعب حسم على فرضية المنافسين/السعر. أستاذ هشام لسه متردد.",
      },
    },
  },

  // -------- TRACK D — Marketing / demand (NO competitors) --------
  D: {
    id: "D",
    topics: [
      {
        id: "d_active_campaign",
        text: "في حملة تنشيط أو ترويج طلقتها الشهر ده؟",
        hishamReply:
          "لأ يا فندم، ما عملتش حملة تنشيط مخصوصة الشهر ده. السنة اللي فاتت كان فيه حملة موسمية بميزانية أكبر.",
        note: {
          id: "n_d_campaign",
          text: "مفيش حملة تنشيط الشهر ده، عكس السنة اللي فاتت.",
        },
      },
      {
        id: "d_new_vs_returning",
        text: "الفترة دي اللي بيشتري عملاء جدد ولا الاعتماد كله على الزبون الدائم؟",
        hishamReply:
          "بصراحة الجدد قلوا الفترة دي يا فندم. الاعتماد بقى كله تقريبًا على الزباين القدام.",
        note: {
          id: "n_d_new_customers",
          text: "تراجع واضح في العملاء الجدد — الاعتماد على القاعدة الحالية.",
        },
      },
      {
        id: "d_marketing_report",
        text: "ممكن نبص على ملخص أداء التسويق — السنة دي والسنة اللي فاتت؟",
        hishamReply:
          "اتفضل يا فندم. ده تقرير التسويق بميزانية وأرقام السنتين جنب بعض.",
        evidenceId: "ev_marketing",
        note: {
          id: "n_d_marketing",
          text: "تقرير التسويق في الدفتر — ميزانية وحملات أقل عن السنة اللي فاتت.",
        },
      },
    ],
    conclusion: {
      id: "d_conclude",
      text: "يبقى محتاجين حملة تنشيط مدروسة قبل الموسم الجاي، بميزانية محسوبة.",
      hishamReply:
        "كلام منطقي يا فندم. الصورة بقت أوضح… بس صدقني، لسه عندي حاجة جوايا مش مرتاح لها 100%.",
      note: {
        id: "n_d_conclude",
        text: "اللاعب حسم على فرضية التسويق. أستاذ هشام لسه متردد.",
      },
    },
  },
};

export const TOTAL_QUESTION_BUDGET = 5;
