import type { FramingQuality, FramingSubmission } from "@/data/pf-case";

export function evaluateFraming(submission: FramingSubmission): FramingQuality {
  const correctClientView = submission.clientViewId === "client_view_expected_lower";
  const correctFlaw =
    submission.flawId === "flaw_unchecked_comparison" ||
    submission.flawId === "flaw_solution_before_understanding";
  const correctTrueFrame = submission.trueFrameId === "true_frame_baseline";
  const correctNextDecision = submission.nextDecisionId === "next_decision_fix_baseline";

  const score = [correctClientView, correctFlaw, correctTrueFrame, correctNextDecision].filter(Boolean).length;

  if (score === 4) return "strong";
  if (score >= 2) return "medium";
  return "weak";
}
