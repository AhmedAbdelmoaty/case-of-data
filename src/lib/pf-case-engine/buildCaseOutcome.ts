import type { FramingQuality, OutcomeType, RunState } from "@/data/pf-case";

export function buildCaseOutcome(run: RunState, framingQuality: FramingQuality): OutcomeType {
  if (framingQuality === "strong" && run.recoveryUsed === 0 && run.weakQuestionsCount === 0) {
    return "strong";
  }

  if (framingQuality === "weak") {
    return "weak";
  }

  return "medium";
}
