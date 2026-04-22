import type { DialogueLine } from "./types";
import type { FramingSelection } from "./framing-board";
import { CORRECT_FRAMING, countCorrectFraming } from "./framing-board";

// ============================================================
// Dynamic Hisham Debrief Builder
// Builds a customized 6-7 line dialogue from the player's actual
// framing choices (4 cv × 4 tf × 4 nd = 64 combinations).
// Hisham always remains convinced and grateful — Mansour is the
// real evaluator in the next screen.
// ============================================================

// Analyst's acknowledgment of Hisham's original view (خانة 1)
const CLIENT_VIEW_ACK: Record<string, string> = {
  cv_lower_than_expected:
    "حضرتك من الأول حسّيت إن مبيعات الشهر أقل من اللي متوقّعها — وده شعور طبيعي.",
  cv_team_weak:
    "حضرتك كان عندك إحساس إن فريق البيع ضعيف، وده اللي خلّاك تطلب مراجعة.",
  cv_competitors:
    "حضرتك ركّزت على ضغط المنافسين، وده كان نقطة بداية مهمة.",
  cv_marketing:
    "حضرتك حسّيت إن في قصور في التسويق ومحتاج حملات.",
};

// Analyst's diagnosis recap (خانة 2)
const TRUE_FRAME_RECAPS: Record<string, string> = {
  tf_misleading_baseline:
    "بس لما رجعنا للأرقام، اكتشفنا إن المقارنة اللي حضرتك بنيت عليها كلامك مش متينة. حضرتك بتقارن فبراير ٢٠٢٦ بفبراير ٢٠٢٥، لكن ٢٠٢٥ هي اللي كانت استثنائية، مش ٢٠٢٦ هي اللي واطية. كان فيه أوردر شركات كبير لوحده طلّع رقم ٢٠٢٥. لو شيلناه، البيع للأفراد ماشي في نمو طبيعي.",
  tf_internal_gap:
    "اللي وصلت له إن في فجوة في شغل الفريق محتاجة تدريب ومتابعة منتظمة.",
  tf_operational:
    "اللي وصلت له إن في خلل في تنظيم الشغل اليومي وإدارة البضاعة.",
  tf_pricing_marketing:
    "اللي وصلت له إن في ضغط من السوق على السعر، والمنافسين بياخدوا حصة منك.",
};

// Analyst's recommended next decision (خانة 3)
const NEXT_DECISION_RECAPS: Record<string, string> = {
  nd_revalidate_baseline:
    "علشان كده اللي أنصح بيه: نراجع المقارنة الأول قبل أي قرار خصومات. لأن لو عملنا عروض دلوقتي، هنخسر من الربح من غير سبب حقيقي.",
  nd_training:
    "علشان كده اللي أنصح بيه: نعمل برنامج تدريب ومتابعة منتظمة لفريق البيع.",
  nd_ops_fix:
    "علشان كده اللي أنصح بيه: نحسّن تنظيم الشغل اليومي وإدارة البضاعة الأول.",
  nd_promotions:
    "علشان كده اللي أنصح بيه: نطلق عروض وحملات إعلانية على طول.",
};

// Hisham's reaction — two flavors per true_frame
// "aligned" = next_decision is the natural follow-up to the diagnosis
// "misaligned" = the recommendation doesn't match the diagnosis
const HISHAM_REACTIONS: Record<string, { aligned: string; misaligned: string }> = {
  tf_misleading_baseline: {
    aligned:
      "والله يا فندم… ده كلام منطقي جداً. يعني أنا كنت حاسس بحاجة وهي مش موجودة أصلاً؟ ربنا يكرمك، كنت قرّبت آخد قرار يخسّرني فلوس على الفاضي.",
    misaligned:
      "تمام، فاهم نقطة المقارنة. يعني الأرقام مش بتقول اللي كنت متخيّله. ماشي، أنا واثق فيك وهنمشي على نصيحتك.",
  },
  tf_internal_gap: {
    aligned:
      "صحيح والله، الفريق محتاج شغل أكتر، وأنا حاسس بكده من فترة. تمام، هاخد بنصيحتك وأبدأ التدريب الأسبوع الجاي.",
    misaligned:
      "ماشي، يعني المشكلة في الفريق نفسه. تمام، أنا واثق في تحليلك.",
  },
  tf_operational: {
    aligned:
      "أيوه، التنظيم عندي محتاج مراجعة فعلاً. كلامك في محله، هنبدأ نظبّط الشغل الجوّاني.",
    misaligned:
      "تمام، يعني عندي خلل تنظيمي. فاهم، هاخد بكلامك.",
  },
  tf_pricing_marketing: {
    aligned:
      "ده اللي كنت حاسه من الأول والله! المنافسين دول بيلعبوا في الأسعار وأنا واقف. تمام، هنبدأ في حملة وعروض على طول.",
    misaligned:
      "تمام، يعني المشكلة في السعر والسوق. فاهم، هنشوف الموضوع ده.",
  },
};

// The single "natural" pairing between a diagnosis and its decision
const ALIGNED_PAIRS: Record<string, string> = {
  tf_misleading_baseline: "nd_revalidate_baseline",
  tf_internal_gap: "nd_training",
  tf_operational: "nd_ops_fix",
  tf_pricing_marketing: "nd_promotions",
};

function isAligned(true_frame: string, next_decision: string): boolean {
  return ALIGNED_PAIRS[true_frame] === next_decision;
}

// Final thank-you line — varies subtly with overall correctness
function buildClosingThanks(correctCount: number): string {
  if (correctCount === 3) {
    return "شكراً ليك ولأستاذ منصور. ده شغل محترم، ربنا يبارك فيكم.";
  }
  if (correctCount === 2) {
    return "متشكر ليك جداً، فعلاً ساعدتني أركّز. هبلّغ أستاذ منصور إن الشغل ممتاز.";
  }
  if (correctCount === 1) {
    return "متشكر ليك، أنا مرتاح إن في حد فهم الموضوع. قول لأستاذ منصور إن الشغل تمام.";
  }
  return "ربنا يكرمك، إنت أكدّت اللي في دماغي. قول لأستاذ منصور إن الشغل ممتاز.";
}

/**
 * Build a customized debrief dialogue from the player's framing.
 * Returns 6-7 DialogueLines that reference the actual choices made.
 */
export function buildHishamDebrief(framing: FramingSelection): DialogueLine[] {
  const cv = framing.client_view ?? CORRECT_FRAMING.client_view;
  const tf = framing.true_frame ?? CORRECT_FRAMING.true_frame;
  const nd = framing.next_decision ?? CORRECT_FRAMING.next_decision;

  const aligned = isAligned(tf, nd);
  const correctCount = countCorrectFraming(framing);

  const lines: DialogueLine[] = [
    {
      characterId: "detective",
      text: "أستاذ هشام، خليني ألخّص لحضرتك اللي وصلت له.",
      mood: "confident",
    },
    {
      characterId: "detective",
      text: CLIENT_VIEW_ACK[cv],
      mood: "neutral",
    },
    {
      characterId: "detective",
      text: TRUE_FRAME_RECAPS[tf],
      mood: "confident",
    },
    {
      characterId: "detective",
      text: NEXT_DECISION_RECAPS[nd],
      mood: "neutral",
    },
    {
      characterId: "abuSaeed", // legacy id used in PresentationScreen for Hisham
      text: HISHAM_REACTIONS[tf][aligned ? "aligned" : "misaligned"],
      mood: aligned && correctCount >= 2 ? "happy" : "neutral",
    },
    {
      characterId: "abuSaeed",
      text: buildClosingThanks(correctCount),
      mood: correctCount >= 2 ? "happy" : "neutral",
    },
  ];

  return lines;
}
