// ============================================================================
// case-evaluator.ts
// Takes a final game state and returns multi-axis evaluation, final tier,
// and a detailed breakdown for the debrief screen.
// ============================================================================

import type {
  Case,
  EvaluationAxisId,
  PerformanceTier,
  FramingCombo,
  Question,
  Evidence,
} from "@/types/case";
import type { PFGameState } from "@/contexts/PFGameContext";

// ----------------------------------------------------------------------------
// Result types
// ----------------------------------------------------------------------------
export interface AxisScore {
  id: EvaluationAxisId;
  label: string;
  description: string;
  weight: number;          // 0..1
  raw: number;             // 0..1 normalized score
  weighted: number;        // raw * weight (0..weight)
  detail: string;          // human-readable explanation
  metrics: Record<string, number | string>;
}

export interface CaseEvaluation {
  caseId: string;
  tier: PerformanceTier;
  totalScore: number;            // 0..100
  axes: AxisScore[];
  matchedCombo: FramingCombo | null;
  framingFeedback: string;
  summary: {
    questionsAsked: number;
    questionBudget: number;
    goldenAsked: number;
    frameChallengeAsked: number;
    prematureAsked: number;
    misleadingAsked: number;
    neutralAsked: number;
    evidenceDiscovered: number;
    criticalEvidenceFound: number;
    criticalEvidenceTotal: number;
    finalTrust: number;
    initialTrust: number;
  };
  // Per-question replay for the debrief
  questionLog: Array<{
    order: number;
    question: Question;
    trustBefore: number;
    trustAfter: number;
    newEvidence: Evidence[];
  }>;
  keyLesson: string;
}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

const tierFromCombo = (combo: FramingCombo | null): PerformanceTier => {
  if (!combo) return "missed-the-frame";
  switch (combo.tier) {
    case "gold":   return "master-framer";
    case "silver": return "solid-analyst";
    case "bronze": return "promising";
    case "trap-baseline-ignored":
    case "trap-jumped-to-solution":
    case "trap-internal-cause":
      return "missed-the-frame";
    case "incoherent":
    default:
      return "failed";
  }
};

// ----------------------------------------------------------------------------
// Main evaluator
// ----------------------------------------------------------------------------
export function evaluateCase(
  caseData: Case,
  state: PFGameState
): CaseEvaluation {
  const questionMap = new Map(caseData.questionBank.map((q) => [q.id, q]));
  const evidenceMap = new Map(caseData.evidencePool.map((e) => [e.id, e]));

  // Resolve asked questions in order
  const askedQuestions = state.askedQuestionIds
    .map((id) => questionMap.get(id))
    .filter((q): q is Question => Boolean(q));

  // Category counts
  const goldenAsked         = askedQuestions.filter((q) => q.category === "golden").length;
  const frameChallengeAsked = askedQuestions.filter((q) => q.category === "frame-challenge").length;
  const prematureAsked      = askedQuestions.filter((q) => q.category === "premature-solution").length;
  const misleadingAsked     = askedQuestions.filter((q) => q.category === "misleading-deep").length;
  const neutralAsked        = askedQuestions.filter((q) => q.category === "neutral-context").length;

  // Critical evidence
  const criticalFound = caseData.criticalEvidenceIds.filter((id) =>
    state.discoveredEvidenceIds.includes(id)
  ).length;
  const criticalTotal = caseData.criticalEvidenceIds.length;

  // Matched combo
  const matchedCombo: FramingCombo | null =
    state.framing.symptomId &&
    state.framing.rootCauseId &&
    state.framing.recommendationId
      ? caseData.validFramingCombinations.find(
          (c) =>
            c.symptomId === state.framing.symptomId &&
            c.rootCauseId === state.framing.rootCauseId &&
            c.recommendationId === state.framing.recommendationId
        ) ?? null
      : null;

  // ----- Axis 1: Frame Challenge (0.25) -----
  // Did the player ask a baseline-challenging question? (frame-challenge OR Q5 golden baseline)
  // raw = min(1, frameChallengeAsked / 1) — even one is sufficient; 2+ caps at 1.
  // Bonus if asked early (within first 3 questions).
  const earliestFrameChallengeOrder = (() => {
    for (let i = 0; i < askedQuestions.length; i++) {
      if (askedQuestions[i].category === "frame-challenge") return i + 1;
    }
    return null;
  })();
  const fcBase = clamp01(frameChallengeAsked / 1);
  const fcEarlyBonus = earliestFrameChallengeOrder !== null && earliestFrameChallengeOrder <= 3 ? 0.15 : 0;
  const frameChallengeRaw = clamp01(fcBase + fcEarlyBonus);

  // ----- Axis 2: Evidence Discovery (0.25) -----
  // raw = criticalFound / criticalTotal
  const evidenceRaw = clamp01(criticalFound / Math.max(1, criticalTotal));

  // ----- Axis 3: Question Economy (0.20) -----
  // ratio of (golden + frame-challenge) to total asked, penalized by premature.
  const productive = goldenAsked + frameChallengeAsked;
  const askedCount = Math.max(1, askedQuestions.length);
  const productiveRatio = productive / askedCount;
  const prematurePenalty = Math.min(0.5, prematureAsked * 0.15); // each premature -0.15, cap 0.5
  const economyRaw = clamp01(productiveRatio - prematurePenalty);

  // ----- Axis 4: Framing Synthesis (0.25) -----
  // Direct mapping from combo tier
  const synthesisRaw = (() => {
    if (!matchedCombo) return 0;
    switch (matchedCombo.tier) {
      case "gold":   return 1.0;
      case "silver": return 0.75;
      case "bronze": return 0.5;
      case "trap-baseline-ignored":
      case "trap-jumped-to-solution":
      case "trap-internal-cause":
        return 0.15;
      case "incoherent":
      default:
        return 0;
    }
  })();

  // ----- Axis 5: Trust Management (0.05) -----
  // raw = finalTrust / max
  const trustRaw = clamp01(state.trust / caseData.trustMechanics.max);

  // ----- Build axis scores -----
  const axisRawMap: Record<EvaluationAxisId, { raw: number; detail: string; metrics: Record<string, number | string> }> = {
    "frame-challenge": {
      raw: frameChallengeRaw,
      detail:
        frameChallengeAsked === 0
          ? "ما سألتش أي سؤال يشكك في إطار العميل. ده أهم نقص في الاستقصاء."
          : earliestFrameChallengeOrder !== null && earliestFrameChallengeOrder <= 3
            ? `ممتاز — شككت في الإطار من بدري (السؤال رقم ${earliestFrameChallengeOrder}).`
            : `سألت سؤال تحدي إطار في السؤال رقم ${earliestFrameChallengeOrder}. كان ينفع أبدر.`,
      metrics: {
        "أسئلة تحدي الإطار": frameChallengeAsked,
        "أول سؤال تحدي (الترتيب)": earliestFrameChallengeOrder ?? "—",
      },
    },
    "evidence-discovery": {
      raw: evidenceRaw,
      detail: `كشفت ${criticalFound} من ${criticalTotal} دليل حرج. الأدلة الحرجة هي اللي بتفك لغز المقارنة.`,
      metrics: {
        "أدلة حرجة مكتشفة": criticalFound,
        "إجمالي الأدلة الحرجة": criticalTotal,
        "إجمالي الأدلة المكتشفة": state.discoveredEvidenceIds.length,
      },
    },
    "question-economy": {
      raw: economyRaw,
      detail:
        prematureAsked > 0
          ? `${productive} من ${askedCount} أسئلة كانت منتجة، لكن ${prematureAsked} أسئلة قفزت للحلول وأكدت إطار غلط.`
          : `${productive} من ${askedCount} أسئلة كانت منتجة (ذهبية أو تحدي إطار).`,
      metrics: {
        "أسئلة ذهبية": goldenAsked,
        "أسئلة تحدي إطار": frameChallengeAsked,
        "أسئلة قفز للحل": prematureAsked,
        "أسئلة مضللة عميقة": misleadingAsked,
        "أسئلة سياق محايد": neutralAsked,
      },
    },
    "framing-synthesis": {
      raw: synthesisRaw,
      detail: matchedCombo
        ? matchedCombo.feedback
        : "التأطير اللي اخترته مش تركيبة معترف بيها — المكونات مش متماسكة مع بعض.",
      metrics: {
        "مستوى التأطير": matchedCombo?.tier ?? "incoherent",
      },
    },
    "trust-management": {
      raw: trustRaw,
      detail:
        state.trust >= caseData.trustMechanics.max * 0.75
          ? "الثقة عالية — العميل لسه فاتح معاك."
          : state.trust >= caseData.trustMechanics.max * 0.5
            ? "الثقة متوسطة — حافظت على العلاقة."
            : state.trust > 0
              ? "الثقة ضعيفة — بعض الأسئلة استفزّت العميل."
              : "الثقة انهارت — العميل قفل.",
      metrics: {
        "الثقة النهائية": state.trust,
        "الثقة الابتدائية": caseData.trustMechanics.initial,
        "الحد الأقصى": caseData.trustMechanics.max,
      },
    },
  };

  const axes: AxisScore[] = caseData.evaluationAxes.map((axis) => {
    const r = axisRawMap[axis.id];
    return {
      id: axis.id,
      label: axis.label,
      description: axis.description,
      weight: axis.weight,
      raw: r.raw,
      weighted: r.raw * axis.weight,
      detail: r.detail,
      metrics: r.metrics,
    };
  });

  const totalScore = Math.round(
    axes.reduce((sum, a) => sum + a.weighted, 0) * 100
  );

  // ----- Final tier: combo-driven, but downgrade if axes are weak -----
  let tier = tierFromCombo(matchedCombo);
  // Safety net: if combo says gold but frame-challenge was never asked AND critical evidence < 60%,
  // downgrade to silver (unlikely with current combos but defensive).
  if (tier === "master-framer" && frameChallengeAsked === 0 && evidenceRaw < 0.6) {
    tier = "solid-analyst";
  }
  // If totalScore is very low despite a "promising" combo, mark missed.
  if (tier === "promising" && totalScore < 35) {
    tier = "missed-the-frame";
  }

  // ----- Question log -----
  const questionLog = state.answeredHistory.map((rec) => ({
    order: rec.order,
    question: questionMap.get(rec.questionId)!,
    trustBefore: rec.trustBefore,
    trustAfter: rec.trustAfter,
    newEvidence: rec.newEvidenceIds
      .map((id) => evidenceMap.get(id))
      .filter((e): e is Evidence => Boolean(e)),
  }));

  return {
    caseId: caseData.id,
    tier,
    totalScore,
    axes,
    matchedCombo,
    framingFeedback: matchedCombo?.feedback ?? "تأطير غير متماسك — المكونات لا تشكّل قصة واحدة.",
    summary: {
      questionsAsked: askedQuestions.length,
      questionBudget: caseData.questionBudget,
      goldenAsked,
      frameChallengeAsked,
      prematureAsked,
      misleadingAsked,
      neutralAsked,
      evidenceDiscovered: state.discoveredEvidenceIds.length,
      criticalEvidenceFound: criticalFound,
      criticalEvidenceTotal: criticalTotal,
      finalTrust: state.trust,
      initialTrust: caseData.trustMechanics.initial,
    },
    questionLog,
    keyLesson: caseData.truth.keyLesson,
  };
}

// ----------------------------------------------------------------------------
// Tier display helpers (for UI)
// ----------------------------------------------------------------------------
export const tierLabel = (tier: PerformanceTier): string => {
  switch (tier) {
    case "master-framer":    return "مؤطّر بارع";
    case "solid-analyst":    return "محلل قوي";
    case "promising":        return "واعد";
    case "missed-the-frame": return "ضيّعت الإطار";
    case "failed":           return "تأطير فاشل";
  }
};

export const tierColor = (tier: PerformanceTier): string => {
  switch (tier) {
    case "master-framer":    return "text-amber-400";
    case "solid-analyst":    return "text-emerald-400";
    case "promising":        return "text-sky-400";
    case "missed-the-frame": return "text-orange-400";
    case "failed":           return "text-red-400";
  }
};
