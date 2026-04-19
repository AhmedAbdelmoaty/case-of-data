import type { KnowledgeState, RunState } from "@/data/pf-case";

function shouldUseRecoveryBundle(
  normalBundleId: string,
  recoveryBundleId: string,
  run: RunState
): boolean {
  const alreadySawNormal =
    run.seenBundleIds.includes(normalBundleId) || run.currentBundleId === normalBundleId;

  const alreadyInRecovery = run.currentBundleId === recoveryBundleId;

  return alreadySawNormal || alreadyInRecovery;
}

export function getAvailableBundle(knowledge: KnowledgeState, run: RunState): string {
  if (!knowledge.claimOpened) {
    return shouldUseRecoveryBundle("bundle_1_opening", "bundle_1_recovery", run)
      ? "bundle_1_recovery"
      : "bundle_1_opening";
  }

  if (!knowledge.claimDefined) {
    return shouldUseRecoveryBundle("bundle_2_claim_definition", "bundle_2_recovery", run)
      ? "bundle_2_recovery"
      : "bundle_2_claim_definition";
  }

  if (!knowledge.requestKnown) {
    return shouldUseRecoveryBundle("bundle_3_request_bias", "bundle_3_recovery", run)
      ? "bundle_3_recovery"
      : "bundle_3_request_bias";
  }

  if (!knowledge.baselineKnown) {
    return shouldUseRecoveryBundle("bundle_4_baseline", "bundle_4_recovery", run)
      ? "bundle_4_recovery"
      : "bundle_4_baseline";
  }

  if (!knowledge.realityChecked) {
    return shouldUseRecoveryBundle("bundle_5_reality_check", "bundle_5_recovery", run)
      ? "bundle_5_recovery"
      : "bundle_5_reality_check";
  }

  if (!knowledge.baselineQuestioned) {
    return shouldUseRecoveryBundle("bundle_6_baseline_validity", "bundle_6_recovery", run)
      ? "bundle_6_recovery"
      : "bundle_6_baseline_validity";
  }

  if (!knowledge.exceptionalYearKnown) {
    return shouldUseRecoveryBundle("bundle_7_exceptional_factor", "bundle_7_recovery", run)
      ? "bundle_7_recovery"
      : "bundle_7_exceptional_factor";
  }

  if (!knowledge.exceptionalCauseKnown) {
    return "bundle_7a_followup";
  }

  return "bundle_7a_followup";
}
