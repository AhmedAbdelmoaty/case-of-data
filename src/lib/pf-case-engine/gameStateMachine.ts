// ============================================================
// Game State Machine — drives the new case logic
// ============================================================

import {
  NODES,
  TOTAL_QUESTION_BUDGET,
  TOTAL_TIME_BUDGET,
  getTimeCost,
  type CaseNode,
  type NodeId,
  type TrackId,
  type CaseOutcome,
} from "@/lib/pf-case/case-tree";
import { countCorrectFraming, type FramingSelection } from "@/lib/pf-case/framing-board";

export interface GameState {
  currentNodeId: NodeId;
  questionsUsed: number;
  hasUsedRecovery: boolean;
  trackEntered: TrackId | null;
  /** History of choices: [{nodeId, choice}] */
  history: { nodeId: NodeId; choice: "correct" | "wrong" }[];
  collectedEvidence: string[];
  savedNoteIds: string[];
  isComplete: boolean;
  /** Abstract time budget in minutes (does not tick in real time) */
  timeRemaining: number;
  /** Cost of the last question taken (for HUD animation) */
  lastTimeCost: number;
  /** True if the meeting ended because time ran out before 5 questions */
  endedByTimeout: boolean;
}

export const initialGameState: GameState = {
  currentNodeId: "S1",
  questionsUsed: 0,
  hasUsedRecovery: false,
  trackEntered: null,
  history: [],
  collectedEvidence: [],
  savedNoteIds: [],
  isComplete: false,
  timeRemaining: TOTAL_TIME_BUDGET,
  lastTimeCost: 0,
  endedByTimeout: false,
};

export function getNode(state: GameState): CaseNode {
  return NODES[state.currentNodeId];
}

export interface ApplyChoiceResult {
  nextState: GameState;
  responseText: string;
  evidenceId?: string;
  note?: { id: string; text: string };
  questionText: string;
  isCorrect: boolean;
}

export function applyChoice(
  state: GameState,
  choice: "correct" | "wrong"
): ApplyChoiceResult {
  if (state.isComplete) {
    const node = getNode(state);
    return {
      nextState: state,
      responseText: "",
      questionText: "",
      isCorrect: choice === "correct",
    };
  }

  const node = getNode(state);
  const option = choice === "correct" ? node.correct : node.wrong;
  const nextNodeId = choice === "correct" ? node.nextOnCorrect : node.nextOnWrong;

  // Track entry: only set on first wrong move; recovery to correct keeps trackEntered = null
  let trackEntered = state.trackEntered;
  if (choice === "wrong" && !trackEntered && node.wrongEntersTrack) {
    trackEntered = node.wrongEntersTrack;
  }

  // Recovery flag — used when leaving S1 wrong
  let hasUsedRecovery = state.hasUsedRecovery;
  if (state.currentNodeId === "S1" && choice === "wrong") {
    hasUsedRecovery = true;
  }

  const questionsUsed = state.questionsUsed + 1;

  // Time budget: each question costs 3 (correct) or 5 (wrong) abstract minutes
  const timeCost = getTimeCost(choice);
  const timeRemaining = Math.max(0, state.timeRemaining - timeCost);

  // Determine completion: reached END, hit question cap, or ran out of time
  const reachedEnd = nextNodeId === "END";
  const budgetExhausted = questionsUsed >= TOTAL_QUESTION_BUDGET;
  const timeExhausted = timeRemaining <= 0;
  const isComplete = reachedEnd || budgetExhausted || timeExhausted;
  const endedByTimeout = timeExhausted && !reachedEnd && questionsUsed < TOTAL_QUESTION_BUDGET;

  const collectedEvidence = option.evidenceId
    ? [...state.collectedEvidence, option.evidenceId]
    : state.collectedEvidence;

  const nextState: GameState = {
    ...state,
    currentNodeId: isComplete ? "END" : nextNodeId,
    questionsUsed,
    hasUsedRecovery,
    trackEntered,
    history: [...state.history, { nodeId: state.currentNodeId, choice }],
    collectedEvidence,
    isComplete,
    timeRemaining,
    lastTimeCost: timeCost,
    endedByTimeout,
  };

  return {
    nextState,
    responseText: option.abuSaeedReply,
    evidenceId: option.evidenceId,
    note: option.note ? { id: option.note.id, text: option.note.text } : undefined,
    questionText: option.text,
    isCorrect: choice === "correct",
  };
}

export interface ChoicePresentation {
  /** Stable ID; combines node + correctness for React key */
  id: string;
  text: string;
  /** Hidden — used only by handler to advance */
  isCorrect: boolean;
}

/**
 * Returns the two options shuffled for display, with stable seeding per node so
 * shuffling does not flip on re-render.
 */
export function getChoices(state: GameState): ChoicePresentation[] {
  const node = getNode(state);
  if (state.isComplete || node.id === "END") return [];

  const options: ChoicePresentation[] = [
    { id: `${node.id}_correct`, text: node.correct.text, isCorrect: true },
    { id: `${node.id}_wrong`, text: node.wrong.text, isCorrect: false },
  ];

  // Stable pseudo-shuffle: seed by node id char-sum
  const seed = node.id.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  if (seed % 2 === 0) options.reverse();

  return options;
}

export function evaluate(
  state: GameState,
  framing: FramingSelection
): { outcome: CaseOutcome; correctCount: number } {
  const correctCount = countCorrectFraming(framing);

  // Check if player walked the full spine correctly
  const wentFullSpine =
    !state.trackEntered &&
    !state.hasUsedRecovery &&
    state.history.length >= 5 &&
    state.history.every((h) => h.choice === "correct");

  const wentSpineWithRecovery =
    !state.trackEntered &&
    state.hasUsedRecovery;

  let outcome: CaseOutcome;
  if (wentFullSpine && correctCount === 4) outcome = "strong";
  else if (wentSpineWithRecovery && correctCount >= 3) outcome = "medium";
  else if (!state.trackEntered && correctCount >= 3) outcome = "medium";
  else outcome = "weak";

  return { outcome, correctCount };
}
