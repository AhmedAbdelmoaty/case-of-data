// ============================================================
// Case Tree — Single source of truth for the new game logic
// ============================================================
// LOGIC UNCHANGED. Only narrative content rewritten:
//  - No early leaks (Hisham never mentions years/numbers before player asks)
//  - Real dates: Feb 2024 / Feb 2025 / Feb 2026 (current month)
//  - All numeric facts moved into REPORT documents (not into reply text)
//  - Player questions = natural shopkeeper conversation, not interrogation
//  - S5 question is GENERAL ("breakdown report") — no leak of "individuals/corporate"
// ------------------------------------------------------------

export type NodeId =
  | "S1"
  | "R1"
  | "S2"
  | "S3"
  | "S4"
  | "S5"
  | "TRACK_A_1"
  | "TRACK_A_2"
  | "TRACK_A_3"
  | "TRACK_B_1"
  | "TRACK_B_2"
  | "TRACK_B_3"
  | "TRACK_C_1"
  | "TRACK_C_2"
  | "TRACK_C_3"
  | "TRACK_D_1"
  | "TRACK_D_2"
  | "TRACK_D_3"
  | "END";

export type TrackId = "A" | "B" | "C" | "D";

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

export interface CaseNode {
  id: NodeId;
  /** Short context label shown above choices */
  context?: string;
  correct: CaseQuestionOption;
  wrong: CaseQuestionOption;
  nextOnCorrect: NodeId;
  nextOnWrong: NodeId;
  /** When entering a wrong branch, mark the player as on this track */
  wrongEntersTrack?: TrackId;
}

// ----- Spine -----

export const NODES: Record<NodeId, CaseNode> = {
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
        "هممم… والله ممكن يا فندم. الفريق عندي من زمان، بس فعلاً ممكن يكونوا اتراخوا في حاجة. لو حضرتك شايف نبدأ من هناك، أنا معاك.",
      note: {
        id: "n_s1_jump_internal",
        text: "اقتراح مبكر إن المشكلة من فريق البيع — قبل ما المشكلة نفسها تتحدد.",
      },
    },
    nextOnCorrect: "S2",
    nextOnWrong: "R1",
    wrongEntersTrack: "A",
  },

  R1: {
    id: "R1",
    context: "فرصة تصحيح وحدة بس — لو مشيت في الفرضية الداخلية هتتوّه.",
    correct: {
      text: "طب ممكن تقولي إيه اللي شد انتباهك وخلاك تحس إن في حاجة مش ماشية… احكيلي ايه المشكلة؟",
      hishamReply:
        "تمام يا فندم. الموضوع كله إن الحركة في المحل كويسة بس لما بصيت على ارقام المبيعات في آخر الشهر، لقيت إن الرقم النهائي أقل من اللي انا كنت متوقعه..",
      note: {
        id: "n_r1_recover",
        text: "بعد توجيه السؤال للمشكلة نفسها: قلق أستاذ هشام مبني على شعور إن الرقم النهائي أقل من المتوقع.",
      },
    },
    wrong: {
      text: "طب مين تحديدًا من الفريق حاسس إن أداؤه أقل من غيره؟",
      hishamReply: "والله… ممكن وليد وهاني. كريم وسامح شغلهم تمام. بس مش متأكد. لو تحب نطلع تقرير لكل واحد فيهم؟",
      note: {
        id: "n_r1_deeper_internal",
        text: "تعميق نفس الفرضية الداخلية بدون فحص أصل المشكلة.",
      },
    },
    nextOnCorrect: "S2",
    nextOnWrong: "TRACK_A_1",
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
    nextOnWrong: "TRACK_B_1",
    wrongEntersTrack: "B",
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
      text: "طب قبل ما نكمل، ممكن نبص على أداء فريق البيع؟ مين أحسن واحد فيهم ومين الأقل؟",
      hishamReply: "ماشي يا فندم، عندي تقرير لكل واحد فيهم. اتفضل، خد ده، فيه الأرقام بتاعتهم كلها.",
      evidenceId: "ev_team_performance",
      note: {
        id: "n_s3_jumped_internal",
        text: "بعد ما بان إن في فرق، اللاعب قفز لفرضية الفريق بدل ما يفحص المقارنة نفسها.",
      },
    },
    nextOnCorrect: "S4",
    nextOnWrong: "TRACK_A_1",
    wrongEntersTrack: "A",
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
      text: "طب ممكن نقارن أسعارنا والعروض اللي بيعملها المنافسين دلوقتي؟",
      hishamReply: "ماشي يا فندم. أنا جمعت من زمان آخر العروض من المحلات اللي حوالينا. اتفضل، ده اللي عندي.",
      evidenceId: "ev_competitor_offers",
      note: {
        id: "n_s4_jumped_external",
        text: "قفز لفرضية خارجية (المنافسين) قبل ما يتأكد إن المرجع نفسه صحيح.",
      },
    },
    nextOnCorrect: "S5",
    nextOnWrong: "TRACK_C_1",
    wrongEntersTrack: "C",
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
      hishamReply: "اتفضل يا فندم، ده تقرير التسويق بتاع السنة دي والسنة اللي فاتت. هتلاقي فيه الميزانية والأرقام.",
      evidenceId: "ev_marketing",
      note: {
        id: "n_s5_jumped_marketing",
        text: "قفز لفرضية تسويقية بدل ما يفكك الرقم نفسه — ضاع المفتاح اللي كان هيكشف الحقيقة.",
      },
    },
    nextOnCorrect: "END",
    nextOnWrong: "TRACK_D_1",
    wrongEntersTrack: "D",
  },

  // ============= TRACK A — Internal execution =============
  TRACK_A_1: {
    id: "TRACK_A_1",
    context: "دخلت في مسار «الفريق» — هتشوف تقارير بتأكد الفرضية دي.",
    correct: {
      text: "ممكن أشوف أداء كل واحد في الفريق على حدة؟",
      hishamReply: "أكيد يا فندم. اتفضل، ده الجدول. هتلاقي فرق واضح بين الأول والأخير.",
      evidenceId: "ev_team_performance",
      note: {
        id: "n_a1",
        text: "تقرير أداء البائعين في الدفتر — كريم الأعلى، هاني الأقل.",
      },
    },
    wrong: {
      text: "طب نبص على نسبة الإقفال (التحويل) لكل واحد فيهم؟",
      hishamReply: "اتفضل، ده تقرير عملته المحاسبة الأسبوع اللي فات. فيه الفرق في التحويل واضح كمان.",
      evidenceId: "ev_team_conversion",
      note: {
        id: "n_a1_alt",
        text: "تقرير نسب التحويل في الدفتر.",
      },
    },
    nextOnCorrect: "TRACK_A_2",
    nextOnWrong: "TRACK_A_2",
  },
  TRACK_A_2: {
    id: "TRACK_A_2",
    correct: {
      text: "ومن ناحية الإقفال، نسبة التحويل لكل واحد كام؟",
      hishamReply: "اتفضل، ده تقرير التحويلات. هتلاقي إن الفرق فعلاً مش بس في الكميات، الفرق في الإقفال نفسه.",
      evidenceId: "ev_team_conversion",
      note: {
        id: "n_a2",
        text: "تقرير التحويلات في الدفتر — الفرق بين البائعين كبير.",
      },
    },
    wrong: {
      text: "في تدريب أو متابعة ناقصة عند الفريق؟",
      hishamReply:
        "بصراحة يا فندم… آخر تدريب عملته للفريق بقاله سنة. والمتابعة اليومية أنا اللي بعملها بإيدي، بس مش منتظمة قوي.",
      note: {
        id: "n_a2_alt",
        text: "أستاذ هشام بيعترف إن التدريب والمتابعة اليومية مش منتظمين.",
      },
    },
    nextOnCorrect: "TRACK_A_3",
    nextOnWrong: "TRACK_A_3",
  },
  TRACK_A_3: {
    id: "TRACK_A_3",
    correct: {
      text: "إيه آخر تدريب أو متابعة عملتها للفريق؟",
      hishamReply:
        "زي ما قلت لحضرتك، آخر تدريب بقاله سنة، والمتابعة بقت متفرقة. الصورة بقت أوضح يا فندم… بس صدّقني، أنا لسه عندي حاجة جوايا مش مرتاح لها 100%.",
      note: {
        id: "n_a3",
        text: "اعتراف بضعف التدريب والمتابعة. أستاذ هشام لسه عنده شك خفيف.",
      },
    },
    wrong: {
      text: "تمام، يبقى المشكلة محسومة — ضعف تنفيذ من الفريق.",
      hishamReply: "ماشي يا فندم… الصورة بقت أوضح. بس بصراحة لسه عندي حاجة جوايا مش مرتاح لها.",
      note: {
        id: "n_a3_alt",
        text: "اللاعب حسم الفرضية بدري، أستاذ هشام لسه متردد.",
      },
    },
    nextOnCorrect: "END",
    nextOnWrong: "END",
  },

  // ============= TRACK B — Daily ops =============
  TRACK_B_1: {
    id: "TRACK_B_1",
    context: "البيانات اليومية ظهرت — مفيش مرجع تاني، خلينا نلف فيها.",
    correct: {
      text: "خلينا نبص على البيع أسبوعياً، يمكن نلاقي نمط معيّن.",
      hishamReply: "اتفضل، ده تقرير المبيعات الأسبوعية هتلاقي فيه الأسبوع الأخير بالذات الأضعف.",
      evidenceId: "ev_weekly_sales",
      note: {
        id: "n_b1",
        text: "تقرير المبيعات الأسبوعية في الدفتر — الأسبوع الأخير الأضعف.",
      },
    },
    wrong: {
      text: "في حاجة في الشغل اليومي حصلت الشهر ده؟ بضاعة اتأخرت أو حاجة شبه كده؟",
      hishamReply: "آه فعلاً يا فندم. فيه شحنة اتأخرت أسبوع كامل تقريبًا، ومنتجات معينة خلصت من على الرفوف لفترة.",
      note: {
        id: "n_b1_alt",
        text: "أستاذ هشام يعترف بتأخير شحنة ونفاد منتجات.",
      },
    },
    nextOnCorrect: "TRACK_B_2",
    nextOnWrong: "TRACK_B_2",
  },
  TRACK_B_2: {
    id: "TRACK_B_2",
    correct: {
      text: "في ظرف معيّن في الشغل اتأثر بيه المحل الشهر ده؟ حاجة في البضاعة مثلاً؟",
      hishamReply: "أيوه يا فندم. فيه شحنة اتأخرت، وفيه منتجات خلصت من على الرف لفترة. ممكن ده أثّر فعلاً.",
      note: {
        id: "n_b2",
        text: "تأخير شحنة + نفاد منتجات الشهر ده.",
      },
    },
    wrong: {
      text: "ساعات الذروة بتاعت البيع متأثرة برضو؟",
      hishamReply: "بصراحة يا فندم مش متابع الساعات بدقة. بس الموظفين بيقولوا فترة بعد العصر بقت أهدى عن قبل كده.",
      note: {
        id: "n_b2_alt",
        text: "انطباع بضعف فترة العصر، بدون قياس دقيق.",
      },
    },
    nextOnCorrect: "TRACK_B_3",
    nextOnWrong: "TRACK_B_3",
  },
  TRACK_B_3: {
    id: "TRACK_B_3",
    correct: {
      text: "يبقى محتاجين نحسّن الشغل اليومي — متابعة البضاعة وساعات الذروة.",
      hishamReply: "كلام معقول يا فندم. الصورة بقت أوضح… بس صدّقني، لسه عندي حاجة جوايا مش مرتاح لها 100%.",
      note: {
        id: "n_b3",
        text: "توصية تشغيلية. أستاذ هشام لسه عنده شك خفيف.",
      },
    },
    wrong: {
      text: "نغيّر مواعيد الشغل عشان نوفّر تكلفة الفترات الضعيفة؟",
      hishamReply: "هممم… ممكن، بس ده قرار كبير يا فندم. الصورة بقت أوضح، بس لسه في حاجة مش مرتاح لها.",
      note: {
        id: "n_b3_alt",
        text: "اقتراح تغيير مواعيد بدون أساس قوي.",
      },
    },
    nextOnCorrect: "END",
    nextOnWrong: "END",
  },

  // ============= TRACK C — Price / competitors =============
  TRACK_C_1: {
    id: "TRACK_C_1",
    context: "دخلت في مسار «المنافسة والسعر».",
    correct: {
      text: "إيه طبيعة العروض اللي بيقدمها المنافسين دلوقتي؟",
      hishamReply: "اتفضل يا فندم، ده اللي جمعته من حوالينا. أكتر حاجة شايفها خصومات وعروض 2+1 على بعض الموديلات.",
      evidenceId: "ev_competitor_offers",
      note: {
        id: "n_c1",
        text: "تقرير عروض المنافسين في الدفتر.",
      },
    },
    wrong: {
      text: "العملاء عندك بيشتكوا من السعر؟",
      hishamReply:
        "بعض الزباين فعلاً قالوا «ده غالي شوية» الفترة الأخيرة، بس مش كلهم. اتفضل ده اللي سجلته من ملاحظاتهم.",
      evidenceId: "ev_customer_feedback",
      note: {
        id: "n_c1_alt",
        text: "ملاحظات العملاء في الدفتر — شكاوى متفرقة من السعر.",
      },
    },
    nextOnCorrect: "TRACK_C_2",
    nextOnWrong: "TRACK_C_2",
  },
  TRACK_C_2: {
    id: "TRACK_C_2",
    correct: {
      text: "العملاء عندك بيقولوا إيه عن أسعارك مقارنة بالسوق؟",
      hishamReply: "بعضهم بيقول غالي شوية يا فندم. بس أنا حاسس إن الجودة بتاعتي أحسن، ومش حابب أنزل.",
      evidenceId: "ev_customer_feedback",
      note: {
        id: "n_c2",
        text: "انطباع بأن السعر مرتفع نسبياً عن المنافسين.",
      },
    },
    wrong: {
      text: "محتاج تنزل الأسعار في خط معيّن وتشوف؟",
      hishamReply: "وارد يا فندم… بس ده قرار محتاج دراسة، مش حاجة آخدها على ضربة.",
      note: {
        id: "n_c2_alt",
        text: "اقتراح تخفيض سعر مباشر بدون أساس.",
      },
    },
    nextOnCorrect: "TRACK_C_3",
    nextOnWrong: "TRACK_C_3",
  },
  TRACK_C_3: {
    id: "TRACK_C_3",
    correct: {
      text: "يبقى محتاجين رد سعري تنافسي — عرض محدد لفترة قصيرة.",
      hishamReply: "ممكن يا فندم. الصورة بقت أوضح… بس صدقني، لسه عندي حاجة جوايا مش مرتاح لها 100%.",
      note: {
        id: "n_c3",
        text: "توصية بعرض سعري. أستاذ هشام متردد.",
      },
    },
    wrong: {
      text: "نعمل خصم 15% على المحل كله شهر كامل؟",
      hishamReply: "ده هياكل من الربح يا فندم… الصورة بقت أوضح، بس لسه في حاجة جوايا مش مرتاح لها.",
      note: {
        id: "n_c3_alt",
        text: "توصية خصم شامل خطرة على هامش الربح.",
      },
    },
    nextOnCorrect: "END",
    nextOnWrong: "END",
  },

  // ============= TRACK D — Marketing / demand =============
  TRACK_D_1: {
    id: "TRACK_D_1",
    context: "دخلت في مسار «التسويق والطلب».",
    correct: {
      text: "ممكن أشوف تفاصيل الميزانية والحملات الأخيرة؟",
      hishamReply: "اتفضل يا فندم، ده ملخص التسويق اللي عندي. هتلاقي فيه ميزانية الإعلانات والأرقام كلها.",
      evidenceId: "ev_marketing",
      note: {
        id: "n_d1",
        text: "تقرير التسويق في الدفتر — ميزانية الإعلانات نزلت عن السنة اللي فاتت.",
      },
    },
    wrong: {
      text: "الـ engagement على السوشيال أقل بكتير عن الأول؟",
      hishamReply: "فرق بسيط يا فندم بصراحة. اتفضل ده التقرير، شوف بنفسك مش حاجة كبيرة تبرّر النزول كله.",
      evidenceId: "ev_marketing",
      note: {
        id: "n_d1_alt",
        text: "تقرير التسويق — التفاعل تقريبًا ثابت، مش مفسّر للنزول.",
      },
    },
    nextOnCorrect: "TRACK_D_2",
    nextOnWrong: "TRACK_D_2",
  },
  TRACK_D_2: {
    id: "TRACK_D_2",
    correct: {
      text: "في حملة تنشيط طلقتها الشهر ده؟",
      hishamReply:
        "لأ يا فندم، ما عملتش حملة تنشيط مخصوصة الشهر ده. السنة اللي فاتت كان فيه حملة موسمية بميزانية أكبر.",
      note: {
        id: "n_d2",
        text: "مفيش حملة تنشيط الشهر ده، عكس السنة اللي فاتت.",
      },
    },
    wrong: {
      text: "محتاجين نزود ميزانية الإعلانات؟",
      hishamReply: "ممكن يا فندم… بس مش متأكد ده هيرجّع البيع ولا لأ.",
      note: {
        id: "n_d2_alt",
        text: "اقتراح زيادة ميزانية بدون عائد محسوب.",
      },
    },
    nextOnCorrect: "TRACK_D_3",
    nextOnWrong: "TRACK_D_3",
  },
  TRACK_D_3: {
    id: "TRACK_D_3",
    correct: {
      text: "يبقى محتاجين حملة تنشيط مدروسة قبل الموسم الجاي.",
      hishamReply: "كلام منطقي يا فندم. الصورة بقت أوضح… بس صدقني، لسه عندي حاجة جوايا مش مرتاح لها 100%.",
      note: {
        id: "n_d3",
        text: "توصية حملة تنشيط. شك خفيف من أستاذ هشام.",
      },
    },
    wrong: {
      text: "نزوّد ميزانية الإعلانات على طول.",
      hishamReply: "هممم… الصورة بقت أوضح يا فندم، بس لسه في حاجة جوايا مش مرتاح لها.",
      note: {
        id: "n_d3_alt",
        text: "قرار صرف بدون قياس.",
      },
    },
    nextOnCorrect: "END",
    nextOnWrong: "END",
  },

  END: {
    id: "END",
    correct: { text: "", hishamReply: "" },
    wrong: { text: "", hishamReply: "" },
    nextOnCorrect: "END",
    nextOnWrong: "END",
  },
};

export const TOTAL_QUESTION_BUDGET = 5;
