import type { KnowledgeState, RunState } from "@/data/pf-case";
import { QUESTION_BUNDLES } from "@/data/pf-case";

export function getAvailableBundle(knowledge: KnowledgeState, run: RunState): string {
  if (!knowledge.claimOpened) {
    return run.recoveryUsed > 0 ? "bundle_1_recovery" : "bundle_1_opening";
  }

  if (!knowledge.claimDefined) {
    return run.recoveryUsed > 0 ? "bundle_2_recovery" : "bundle_2_claim_definition";
  }

  if (!knowledge.requestKnown) {
    return run.recoveryUsed > 0 ? "bundle_3_recovery" : "bundle_3_request_bias";
  }

  if (!knowledge.baselineKnown) {
    return run.recoveryUsed > 0 ? "bundle_4_recovery" : "bundle_4_baseline";
  }

  if (!knowledge.realityChecked) {
    return run.recoveryUsed > 0 ? "bundle_5_recovery" : "bundle_5_reality_check";
  }

  if (!knowledge.baselineQuestioned) {
    return run.recoveryUsed > 0 ? "bundle_6_recovery" : "bundle_6_baseline_validity";
  }

  if (!knowledge.exceptionalYearKnown) {
    return run.recoveryUsed > 0 ? "bundle_7_recovery" : "bundle_7_exceptional_factor";
  }

  if (!knowledge.exceptionalCauseKnown) {
    return "bundle_7a_followup";
  }

  return QUESTION_BUNDLES.bundle_7a_followup.id;
}
