import type { KnowledgeState } from "@/data/pf-case";

export function canOpenFraming(knowledge: KnowledgeState): boolean {
  return (
    knowledge.claimDefined &&
    knowledge.requestKnown &&
    knowledge.baselineKnown &&
    knowledge.realityChecked &&
    knowledge.baselineQuestioned &&
    (knowledge.exceptionalYearKnown || knowledge.exceptionalCauseKnown)
  );
}
