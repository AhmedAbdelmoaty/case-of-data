// ============================================================
// Case Tree — Single source of truth for the new game logic
// ============================================================
// Spine S1 → S5 (correct path) + R1 (recovery after S1) +
// Wrong Tracks: A (internal execution), B (daily ops), C (price/competitors), D (marketing/demand)
// ------------------------------------------------------------

export type NodeId =
  | "S1" | "R1" | "S2" | "S3" | "S4" | "S5"
  | "TRACK_A_1" | "TRACK_A_2" | "TRACK_A_3"
  | "TRACK_B_1" | "TRACK_B_2" | "TRACK_B_3"
  | "TRACK_C_1" | "TRACK_C_2" | "TRACK_C_3"
  | "TRACK_D_1" | "TRACK_D_2" | "TRACK_D_3"
  | "END";

export type TrackId = "A" | "B" | "C" | "D";

export type CaseOutcome = "strong" | "medium" | "weak";

export interface CaseNoteCandidate {
  id: string;
  text: string;
}

export interface CaseQuestionOption {
  text: string;
  abuSaeedReply: string;
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
    context: "البداية: أبو سعيد قاعد في المحل، شكله مشغول البال.",
    correct: {
      text: "تعالى نبدأ من الأول يا أبو سعيد، إيه اللي مخليك حاسس إن في مشكلة؟",
      abuSaeedReply:
        "والله يا باشا، حاسس إن المبيعات مش زي الأول. الشهر ده شايفه واطي عن السنة اللي فاتت. الناس بتدخل المحل عادي، بس آخر اليوم لما باجي أحسب الرقم… مش مطمنّي.",
      note: {
        id: "n_s1_problem_open",
        text: "أبو سعيد حاسس إن مبيعات الشهر الحالي أقل من نفس الشهر السنة اللي فاتت — تقييم مبني على إحساس مش رقم.",
      },
    },
    wrong: {
      text: "حاسس إن المشكلة من فريق البيع؟ يمكن مش بيشتغلوا زي الأول؟",
      abuSaeedReply:
        "ممكن… والله أنا مش متأكد. الفريق عندي من زمان، بس فعلاً ممكن يكونوا مقصرين في حاجة. لو حضرتك شايف نبص على الموضوع ده، تمام.",
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
      text: "قبل ما نحكم على الفريق، خليني أفهم المشكلة الأول. إيه اللي خلاك تحس إن في مشكلة أصلاً؟",
      abuSaeedReply:
        "تمام… بصراحة الموضوع كله إن المبيعات شكلها أقل. لما باقارن بالشهر ده السنة اللي فاتت، حاسس إن الرقم نزل. ده اللي شاغلني.",
      note: {
        id: "n_r1_recover",
        text: "بعد توجيه السؤال للمشكلة نفسها: أبو سعيد بيحدد إن قلقه مبني على مقارنة بالسنة اللي فاتت.",
      },
    },
    wrong: {
      text: "طب مين تحديدًا من الفريق حاسس إن أداؤه أقل من غيره؟",
      abuSaeedReply:
        "والله… ممكن وليد وهاني أقل من كريم وسامح. بس مش متأكد. لو تحب نبص على أرقام كل واحد فيهم.",
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
    context: "بعد ما وضّح إن في إحساس بنزول، محتاج تثبت الـ baseline.",
    correct: {
      text: "نزلت بنسبة قد إيه؟ ومقارنة بإيه بالظبط؟",
      abuSaeedReply:
        "تقريبًا 30% أقل. وأنا بقارن بنفس الشهر السنة اللي فاتت — كان الشهر ده فيها قوي جدًا، عملنا حوالي 430 ألف. السنة دي حوالي 300 ألف بس.",
      note: {
        id: "n_s2_baseline_one_year",
        text: "المقارنة: 30% نزول، مرجعية = نفس الشهر السنة اللي فاتت فقط (430 → 300).",
      },
    },
    wrong: {
      text: "تمام، طب وريني البيانات اللي عندك دلوقتي.",
      abuSaeedReply:
        "حاضر، شوف بنفسك — ده تقرير المبيعات اليومية للشهر ده. تذبذب عادي، بس الرقم الإجمالي في الآخر طلع أقل من اللي عامله حسابي.",
      evidenceId: "ev_daily_sales",
      note: {
        id: "n_s2_jumped_to_data",
        text: "طلب البيانات قبل تثبيت الـ baseline — التقرير اليومي مش بيرد على سؤال «أقل مقارنةً بإيه؟».",
      },
    },
    nextOnCorrect: "S3",
    nextOnWrong: "TRACK_B_1",
    wrongEntersTrack: "B",
  },

  S3: {
    id: "S3",
    context: "عندك رقم: 30% أقل من نفس الشهر السنة اللي فاتت. محتاج تشوف ده فعلاً.",
    correct: {
      text: "وريني المقارنة دي بشكل واضح — الشهر ده والشهر ده السنة اللي فاتت.",
      abuSaeedReply:
        "ده الـ chart — الشهر الحالي 300 ألف، نفس الشهر السنة اللي فاتت 430 ألف. الفرق واضح، حوالي 30%.",
      evidenceId: "ev_year_vs_year",
      note: {
        id: "n_s3_chart1_confirmed",
        text: "Chart 1: 300 (الشهر الحالي) vs 430 (نفس الشهر السنة اللي فاتت) = فرق 30%.",
      },
    },
    wrong: {
      text: "طب وريني أداء فريق البيع، مين أحسن واحد فيهم ومين الأقل؟",
      abuSaeedReply:
        "حاضر، عندي تقرير لكل واحد فيهم — كريم أعلى واحد، وهاني الأقل. بصراحة الفرق بينهم بايين.",
      evidenceId: "ev_team_performance",
      note: {
        id: "n_s3_jumped_internal",
        text: "بعد ما الفرق ظهر، اللاعب قفز لفرضية داخلية (الفريق) بدل ما يفحص المقارنة نفسها.",
      },
    },
    nextOnCorrect: "S4",
    nextOnWrong: "TRACK_A_1",
    wrongEntersTrack: "A",
  },

  S4: {
    id: "S4",
    context: "الفرق ظهر، بس مقارنة بسنة وحدة. السنة دي طبيعية ولا استثنائية؟",
    correct: {
      text: "وريني السنة اللي قبل اللي فاتت كمان، عشان نشوف الـ pattern على مدى أوسع.",
      abuSaeedReply:
        "آه عندي البيانات. شوف — السنة الأسبق كانت 290 ألف، السنة اللي فاتت 430 ألف، السنة دي 300 ألف. يعني فعلاً السنة اللي فاتت كانت طالعة عن الباقي.",
      evidenceId: "ev_three_year",
      note: {
        id: "n_s4_chart2_anomaly",
        text: "Chart 2: 290 → 430 → 300. السنة اللي فاتت شاذة — مش الشهر الحالي هو اللي واطي.",
      },
    },
    wrong: {
      text: "طب وريني أسعار المنافسين والعروض اللي بيعملوها.",
      abuSaeedReply:
        "حاضر — جمعت لك آخر العروض من المحلات اللي حوالينا. فيه ناس بيعملوا 10% خصم، وفيه 2+1.",
      evidenceId: "ev_competitor_offers",
      note: {
        id: "n_s4_jumped_external",
        text: "قفز لفرضية خارجية (المنافسين) قبل ما يتأكد إن الـ baseline نفسها صحيحة.",
      },
    },
    nextOnCorrect: "S5",
    nextOnWrong: "TRACK_C_1",
    wrongEntersTrack: "C",
  },

  S5: {
    id: "S5",
    context: "السنة اللي فاتت طالعة. ليه؟ لازم نفكك الرقم.",
    correct: {
      text: "نفكك الـ 430 بتاعة السنة اللي فاتت — أفراد ولا شركات؟",
      abuSaeedReply:
        "آه فاكر دلوقتي… السنة اللي فاتت جالنا أوردر شركات كبير، حوالي 150 ألف لوحدها. الأفراد كانوا تقريبًا 280. لو شيلنا الأوردر ده، يبقى الأفراد كانوا 280 السنة اللي فاتت، 270 السنة الأسبق، و290 السنة دي. يعني فعلاً نمو طبيعي.",
      evidenceId: "ev_breakdown",
      note: {
        id: "n_s5_truth",
        text: "Chart 3 (تفكيك): الطفرة من أوردر شركات استثنائي 150 ألف. بدون الشركات: 270 → 280 → 290 = نمو طبيعي. مفيش مشكلة بيع حقيقية.",
      },
    },
    wrong: {
      text: "طب وريني أداء الحملات الإعلانية الأخيرة.",
      abuSaeedReply:
        "حاضر، ده dashboard التسويق — الميزانية والـ reach. فيه فرق بسيط في الـ engagement عن السنة اللي فاتت.",
      evidenceId: "ev_marketing",
      note: {
        id: "n_s5_jumped_marketing",
        text: "قفز لفرضية تسويقية بدل تفكيك الرقم نفسه — ضاع المفتاح اللي كان هيكشف الحقيقة.",
      },
    },
    nextOnCorrect: "END",
    nextOnWrong: "TRACK_D_1",
    wrongEntersTrack: "D",
  },

  // ============= TRACK A — Internal execution =============
  TRACK_A_1: {
    id: "TRACK_A_1",
    context: "دخلت في مسار «الفريق» — هتشوف dashboards بتأكد الفرضية دي.",
    correct: {
      text: "وريني أداء كل فرد في الفريق.",
      abuSaeedReply:
        "ده الجدول: كريم 110 ألف، سامح 75، وليد 60، هاني 55. الفرق بين الأول والأخير واضح.",
      evidenceId: "ev_team_performance",
      note: {
        id: "n_a1",
        text: "Track A — أداء البائعين متفاوت: كريم 110 / سامح 75 / وليد 60 / هاني 55.",
      },
    },
    wrong: {
      text: "تمام، خلينا نشوف نسبة الإقفال (conversion) لكل واحد.",
      abuSaeedReply:
        "أيوه ده عندي — كريم 28%، سامح 21%، وليد 17%، هاني 16%. الفرق في التحويل واضح هو كمان.",
      evidenceId: "ev_team_conversion",
      note: {
        id: "n_a1_alt",
        text: "Track A — نسب التحويل: 28% / 21% / 17% / 16%.",
      },
    },
    nextOnCorrect: "TRACK_A_2",
    nextOnWrong: "TRACK_A_2",
  },
  TRACK_A_2: {
    id: "TRACK_A_2",
    correct: {
      text: "ومن ناحية الإقفال، نسبة التحويل لكل واحد كام؟",
      abuSaeedReply:
        "كريم 28%، سامح 21%، وليد 17%، هاني 16%. يعني فعلاً الفرق مش بس في الكميات.",
      evidenceId: "ev_team_conversion",
      note: {
        id: "n_a2",
        text: "Track A — التحويل: 28/21/17/16 — يدعم فرضية التنفيذ.",
      },
    },
    wrong: {
      text: "في تدريب أو متابعة ناقصة عند الفريق؟",
      abuSaeedReply:
        "بصراحة… التدريب آخر مرة بقاله سنة. والمتابعة اليومية أنا اللي بعملها بس مش منتظمة قوي.",
      note: {
        id: "n_a2_alt",
        text: "Track A — أبو سعيد بيعترف إن التدريب والمتابعة فعلاً مش منتظمين.",
      },
    },
    nextOnCorrect: "TRACK_A_3",
    nextOnWrong: "TRACK_A_3",
  },
  TRACK_A_3: {
    id: "TRACK_A_3",
    correct: {
      text: "إيه آخر تدريب أو متابعة عملتها للفريق؟",
      abuSaeedReply:
        "آخر تدريب بقاله سنة، والمتابعة اليومية مش منتظمة. الصورة بقت أوضح يا باشا… بس أنا لسه عندي حاجة جوايا مش مرتاحلها 100%.",
      note: {
        id: "n_a3",
        text: "Track A — اعتراف بضعف التدريب والمتابعة. أبو سعيد لسه عنده شك.",
      },
    },
    wrong: {
      text: "تمام، يبقى المشكلة محسومة — ضعف تنفيذ.",
      abuSaeedReply:
        "ماشي… الصورة بقت أوضح. بس أنا لسه عندي حاجة جوايا مش مرتاحلها 100%.",
      note: {
        id: "n_a3_alt",
        text: "Track A — اللاعب حسم الفرضية بدري، أبو سعيد متردد.",
      },
    },
    nextOnCorrect: "END",
    nextOnWrong: "END",
  },

  // ============= TRACK B — Daily ops =============
  TRACK_B_1: {
    id: "TRACK_B_1",
    context: "البيانات اليومية ظهرت — مفيش baseline تاني، خلينا نلف فيها.",
    correct: {
      text: "نبص بقى على البيع أسبوعياً، يمكن نلاقي pattern.",
      abuSaeedReply:
        "ماشي — الأسبوع الأول 78 ألف، التاني 92، التالت 71، الرابع 59. فيه تذبذب فعلاً.",
      evidenceId: "ev_weekly_sales",
      note: {
        id: "n_b1",
        text: "Track B — مبيعات أسبوعية: 78/92/71/59. الأسبوع الأخير الأضعف.",
      },
    },
    wrong: {
      text: "في حاجة تشغيلية حصلت الشهر ده؟ stock أو تأخير؟",
      abuSaeedReply:
        "آه فعلاً، فيه شحنة اتأخرت أسبوع تقريبًا، ومنتجات معينة خلصت من على الرفوف.",
      note: {
        id: "n_b1_alt",
        text: "Track B — أبو سعيد يعترف بتأخير شحنة ونفاد منتجات.",
      },
    },
    nextOnCorrect: "TRACK_B_2",
    nextOnWrong: "TRACK_B_2",
  },
  TRACK_B_2: {
    id: "TRACK_B_2",
    correct: {
      text: "في ظرف تشغيلي معين تأثر بيه الشهر ده؟ stock مثلاً؟",
      abuSaeedReply:
        "آه، فيه شحنة اتأخرت، وفيه منتجات خلصت من على الرف لفترة. ممكن ده أثّر.",
      note: {
        id: "n_b2",
        text: "Track B — تأخير شحنة + نفاد منتجات الشهر ده.",
      },
    },
    wrong: {
      text: "ساعات الذروة بتاعة البيع متأثرة برضو؟",
      abuSaeedReply:
        "ممكن… بصراحة مش متابع الساعات بدقة. بس الموظفين بيقولوا فترة بعد العصر بقت أهدى.",
      note: {
        id: "n_b2_alt",
        text: "Track B — انطباع بضعف فترة العصر، بدون قياس دقيق.",
      },
    },
    nextOnCorrect: "TRACK_B_3",
    nextOnWrong: "TRACK_B_3",
  },
  TRACK_B_3: {
    id: "TRACK_B_3",
    correct: {
      text: "يبقى محتاجين نحسّن التشغيل — متابعة stock وساعات الذروة.",
      abuSaeedReply:
        "كلام معقول. الصورة بقت أوضح يا باشا… بس أنا لسه عندي حاجة جوايا مش مرتاحلها 100%.",
      note: {
        id: "n_b3",
        text: "Track B — توصية تشغيلية. أبو سعيد لسه عنده شك خفيف.",
      },
    },
    wrong: {
      text: "نغيّر مواعيد العمل عشان نوفر تكلفة الفترات الضعيفة؟",
      abuSaeedReply:
        "هممم… ممكن، بس ده قرار كبير. الصورة بقت أوضح يا باشا… بس أنا لسه عندي حاجة جوايا مش مرتاحلها 100%.",
      note: {
        id: "n_b3_alt",
        text: "Track B — اقتراح تغيير مواعيد بدون أساس قوي.",
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
      abuSaeedReply:
        "أكتر حاجة شايفها: 10% خصم على المجموعات، وعرض 2+1 على بعض الموديلات. اتنين منهم بيعملوا حملات أونلاين كمان.",
      evidenceId: "ev_competitor_offers",
      note: {
        id: "n_c1",
        text: "Track C — عروض المنافسين: 10% خصم + 2+1 + حملات أونلاين.",
      },
    },
    wrong: {
      text: "العملاء بيشتكوا من السعر عندك؟",
      abuSaeedReply:
        "بعض الزباين فعلاً قالوا «ده غالي شوية» الفترة الأخيرة، بس مش كلهم.",
      evidenceId: "ev_customer_feedback",
      note: {
        id: "n_c1_alt",
        text: "Track C — feedback مختصر: شكاوى متفرقة من السعر.",
      },
    },
    nextOnCorrect: "TRACK_C_2",
    nextOnWrong: "TRACK_C_2",
  },
  TRACK_C_2: {
    id: "TRACK_C_2",
    correct: {
      text: "العملاء عندك بيقولوا إيه عن أسعارك مقارنة بالسوق؟",
      abuSaeedReply:
        "بعضهم بيقول غالي شوية. بس أنا حاسس إن الجودة أحسن، ومش حابب أنزل.",
      evidenceId: "ev_customer_feedback",
      note: {
        id: "n_c2",
        text: "Track C — انطباع بأن السعر مرتفع نسبياً عن المنافسين.",
      },
    },
    wrong: {
      text: "محتاج تنزل الأسعار في خط معيّن وتشوف؟",
      abuSaeedReply:
        "وارد… بس ده قرار محتاج دراسة.",
      note: {
        id: "n_c2_alt",
        text: "Track C — اقتراح تخفيض سعر مباشر بدون أساس.",
      },
    },
    nextOnCorrect: "TRACK_C_3",
    nextOnWrong: "TRACK_C_3",
  },
  TRACK_C_3: {
    id: "TRACK_C_3",
    correct: {
      text: "يبقى محتاجين رد سعري تنافسي — عرض محدد لفترة قصيرة.",
      abuSaeedReply:
        "ممكن. الصورة بقت أوضح يا باشا… بس أنا لسه عندي حاجة جوايا مش مرتاحلها 100%.",
      note: {
        id: "n_c3",
        text: "Track C — توصية بعرض سعري. أبو سعيد متردد.",
      },
    },
    wrong: {
      text: "نعمل خصم 15% على المحل كله شهر كامل؟",
      abuSaeedReply:
        "ده هياكل من الهامش… الصورة بقت أوضح بس أنا لسه عندي حاجة جوايا مش مرتاحلها 100%.",
      note: {
        id: "n_c3_alt",
        text: "Track C — توصية خصم شامل خطرة على الهامش.",
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
      text: "وريني تفاصيل الميزانية والحملات الأخيرة.",
      abuSaeedReply:
        "ميزانية الإعلانات الشهر ده 12 ألف. السنة اللي فاتت كانت 18 ألف في نفس الفترة. الـ reach نزل بنسبة بسيطة، والـ engagement تقريباً نفسه.",
      evidenceId: "ev_marketing",
      note: {
        id: "n_d1",
        text: "Track D — ميزانية تسويق نزلت من 18 لـ 12 ألف. reach أقل بشكل بسيط.",
      },
    },
    wrong: {
      text: "الـ engagement على السوشيال أقل بكتير؟",
      abuSaeedReply:
        "فرق بسيط بصراحة. مش حاجة كبيرة تبرر النزول كله.",
      evidenceId: "ev_marketing",
      note: {
        id: "n_d1_alt",
        text: "Track D — engagement تقريبًا ثابت — مش مفسر للنزول.",
      },
    },
    nextOnCorrect: "TRACK_D_2",
    nextOnWrong: "TRACK_D_2",
  },
  TRACK_D_2: {
    id: "TRACK_D_2",
    correct: {
      text: "في حملة تنشيط طلقت الشهر ده؟",
      abuSaeedReply:
        "لأ، ما عملتش حملة تنشيط مخصوصة الشهر ده. السنة اللي فاتت كان فيه حملة موسمية بميزانية أكبر.",
      note: {
        id: "n_d2",
        text: "Track D — مفيش حملة تنشيط الشهر ده، عكس السنة اللي فاتت.",
      },
    },
    wrong: {
      text: "محتاجين نزود ميزانية الإعلانات؟",
      abuSaeedReply:
        "ممكن… بس مش متأكد ده هيرجع البيع ولا لأ.",
      note: {
        id: "n_d2_alt",
        text: "Track D — اقتراح زيادة ميزانية بدون عائد محسوب.",
      },
    },
    nextOnCorrect: "TRACK_D_3",
    nextOnWrong: "TRACK_D_3",
  },
  TRACK_D_3: {
    id: "TRACK_D_3",
    correct: {
      text: "يبقى محتاجين حملة تنشيط مدروسة قبل الموسم الجاي.",
      abuSaeedReply:
        "كلام منطقي. الصورة بقت أوضح يا باشا… بس أنا لسه عندي حاجة جوايا مش مرتاحلها 100%.",
      note: {
        id: "n_d3",
        text: "Track D — توصية حملة تنشيط. شك خفيف من أبو سعيد.",
      },
    },
    wrong: {
      text: "نزود ميزانية الإعلانات على طول.",
      abuSaeedReply:
        "هممم… الصورة بقت أوضح بس أنا لسه عندي حاجة جوايا مش مرتاحلها 100%.",
      note: {
        id: "n_d3_alt",
        text: "Track D — قرار صرف بدون قياس.",
      },
    },
    nextOnCorrect: "END",
    nextOnWrong: "END",
  },

  END: {
    id: "END",
    correct: { text: "", abuSaeedReply: "" },
    wrong: { text: "", abuSaeedReply: "" },
    nextOnCorrect: "END",
    nextOnWrong: "END",
  },
};

export const TOTAL_QUESTION_BUDGET = 5;
