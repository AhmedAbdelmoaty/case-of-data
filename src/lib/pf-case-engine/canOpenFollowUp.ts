import type { KnowledgeState, RunState } from "@/data/pf-case";

export function canOpenFollowUp(knowledge: KnowledgeState, run: RunState): boolean {
  if (knowledge.exceptionalCauseKnown) return false;
  if (!knowledge.exceptionalYearKnown) return false;
  if (run.trustLevel < -1) return false;

  return true;
}
