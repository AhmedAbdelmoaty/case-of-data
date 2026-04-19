import type {
  KnowledgeState,
  NoteCandidate,
  QuestionOption,
  ResponseNode,
  RunState,
} from "@/data/pf-case";
import { NOTES_CATALOG, QUESTION_OPTIONS, RESPONSES } from "@/data/pf-case";

export interface ApplyQuestionChoiceResult {
  question: QuestionOption;
  response: ResponseNode;
  nextKnowledge: KnowledgeState;
  nextRun: RunState;
  noteCandidates: NoteCandidate[];
}

export function applyQuestionChoice(
  questionId: string,
  knowledge: KnowledgeState,
  run: RunState
): ApplyQuestionChoiceResult {
  const question = QUESTION_OPTIONS[questionId];
  const response = RESPONSES[question.responseId];

  if (!question) {
    throw new Error(`Question not found: ${questionId}`);
  }

  if (!response) {
    throw new Error(`Response not found for question: ${questionId}`);
  }

  const nextKnowledge: KnowledgeState = {
    ...knowledge,
    ...question.knowledgeEffects,
  };

  const nextRun: RunState = {
    ...run,
    totalQuestionsAsked: run.totalQuestionsAsked + 1,
    trustLevel: Math.max(-2, Math.min(2, run.trustLevel + question.trustEffect)),
    askedQuestionIds: [...run.askedQuestionIds, question.id],
    seenBundleIds: run.currentBundleId && !run.seenBundleIds.includes(run.currentBundleId)
      ? [...run.seenBundleIds, run.currentBundleId]
      : run.seenBundleIds,
  };

  if (question.quality === "strong") {
    nextRun.strongQuestionsCount += 1;
  } else if (question.quality === "good") {
    nextRun.goodQuestionsCount += 1;
  } else {
    nextRun.weakQuestionsCount += 1;
  }

  if (question.recoveryCost > 0) {
    nextRun.recoveryUsed += question.recoveryCost;
  }

  const noteCandidates = response.noteCandidateIds
    .map((id) => NOTES_CATALOG[id])
    .filter(Boolean)
    .map((note) => ({
      ...note,
      sourceQuestionId: question.id,
      sourceResponseId: response.id,
    }));

  return {
    question,
    response,
    nextKnowledge,
    nextRun,
    noteCandidates,
  };
}
