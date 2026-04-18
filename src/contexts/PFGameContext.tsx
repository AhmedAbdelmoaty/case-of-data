// ============================================================================
// PFGameContext — rebuilt from scratch on the new Case Schema
// Manages: question budget (7), trust, discovered evidence, framing selections,
// game phase, and answered-question history.
// ============================================================================

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { baselineCase } from "@/data/cases/baseline-case";
import type {
  Case,
  Question,
  Evidence,
  FramingCombo,
  PerformanceTier,
} from "@/types/case";

// ----------------------------------------------------------------------------
// Phases
// ----------------------------------------------------------------------------
export type GamePhase =
  | "briefing"
  | "travel"
  | "arrival"
  | "investigation"
  | "synthesis"
  | "framing"
  | "debrief"
  | "result";

// ----------------------------------------------------------------------------
// Answered question record (for replay/debrief)
// ----------------------------------------------------------------------------
export interface AnsweredQuestion {
  questionId: string;
  order: number; // 1..budget
  trustBefore: number;
  trustAfter: number;
  newEvidenceIds: string[];
}

// ----------------------------------------------------------------------------
// Framing selection
// ----------------------------------------------------------------------------
export interface FramingSelection {
  symptomId: string | null;
  rootCauseId: string | null;
  recommendationId: string | null;
}

// ----------------------------------------------------------------------------
// Game State
// ----------------------------------------------------------------------------
export interface PFGameState {
  caseId: string;
  phase: GamePhase;

  // Investigation
  askedQuestionIds: string[];        // ordered (most recent last)
  answeredHistory: AnsweredQuestion[];
  discoveredEvidenceIds: string[];   // dedup, in discovery order
  trust: number;
  lastQuestionId: string | null;

  // Framing
  framing: FramingSelection;
  framingSubmitted: boolean;

  // Notes (player-curated; subset of discoveredEvidenceIds)
  pinnedEvidenceIds: string[];
}

const buildInitialState = (c: Case): PFGameState => ({
  caseId: c.id,
  phase: "briefing",
  askedQuestionIds: [],
  answeredHistory: [],
  discoveredEvidenceIds: [],
  trust: c.trustMechanics.initial,
  lastQuestionId: null,
  framing: { symptomId: null, rootCauseId: null, recommendationId: null },
  framingSubmitted: false,
  pinnedEvidenceIds: [],
});

// ----------------------------------------------------------------------------
// Context value
// ----------------------------------------------------------------------------
interface PFGameContextValue {
  caseData: Case;
  state: PFGameState;

  // Derived
  remainingBudget: number;
  isBudgetExhausted: boolean;
  isTrustCollapsed: boolean;
  availableQuestions: Question[];      // not-yet-asked
  discoveredEvidence: Evidence[];      // resolved objects
  lastQuestion: Question | null;
  lastAnswer: AnsweredQuestion | null;
  framingComplete: boolean;
  matchedCombo: FramingCombo | null;   // null if incoherent

  // Actions
  setPhase: (phase: GamePhase) => void;
  askQuestion: (questionId: string) => void;
  endInvestigation: () => void;        // moves to synthesis
  togglePinEvidence: (evidenceId: string) => void;
  setFramingComponent: (
    kind: "symptom" | "root-cause" | "recommendation",
    componentId: string
  ) => void;
  submitFraming: () => void;
  resetGame: () => void;

  // Evaluation helper (lightweight; full evaluator lives in case-evaluator)
  getPerformanceTier: () => PerformanceTier;
}

const PFGameContext = createContext<PFGameContextValue | null>(null);

export const usePFGame = () => {
  const ctx = useContext(PFGameContext);
  if (!ctx) throw new Error("usePFGame must be used within PFGameProvider");
  return ctx;
};

// ----------------------------------------------------------------------------
// Provider
// ----------------------------------------------------------------------------
interface PFGameProviderProps {
  children: ReactNode;
  caseData?: Case;
}

export const PFGameProvider = ({
  children,
  caseData = baselineCase,
}: PFGameProviderProps) => {
  const [state, setState] = useState<PFGameState>(() => buildInitialState(caseData));

  // ----- Lookup helpers (memoized maps) -----
  const questionMap = useMemo(
    () => new Map(caseData.questionBank.map((q) => [q.id, q])),
    [caseData]
  );
  const evidenceMap = useMemo(
    () => new Map(caseData.evidencePool.map((e) => [e.id, e])),
    [caseData]
  );

  // ----- Derived state -----
  const remainingBudget = caseData.questionBudget - state.askedQuestionIds.length;
  const isBudgetExhausted = remainingBudget <= 0;
  const isTrustCollapsed = state.trust <= 0;

  const availableQuestions = useMemo(
    () =>
      caseData.questionBank.filter((q) => !state.askedQuestionIds.includes(q.id)),
    [caseData, state.askedQuestionIds]
  );

  const discoveredEvidence = useMemo(
    () =>
      state.discoveredEvidenceIds
        .map((id) => evidenceMap.get(id))
        .filter((e): e is Evidence => Boolean(e)),
    [state.discoveredEvidenceIds, evidenceMap]
  );

  const lastQuestion = state.lastQuestionId
    ? questionMap.get(state.lastQuestionId) ?? null
    : null;

  const lastAnswer =
    state.answeredHistory.length > 0
      ? state.answeredHistory[state.answeredHistory.length - 1]
      : null;

  const framingComplete =
    state.framing.symptomId !== null &&
    state.framing.rootCauseId !== null &&
    state.framing.recommendationId !== null;

  const matchedCombo = useMemo<FramingCombo | null>(() => {
    if (!framingComplete) return null;
    return (
      caseData.validFramingCombinations.find(
        (c) =>
          c.symptomId === state.framing.symptomId &&
          c.rootCauseId === state.framing.rootCauseId &&
          c.recommendationId === state.framing.recommendationId
      ) ?? null
    );
  }, [framingComplete, state.framing, caseData]);

  // ----- Actions -----
  const setPhase = useCallback((phase: GamePhase) => {
    setState((prev) => ({ ...prev, phase }));
  }, []);

  const askQuestion = useCallback(
    (questionId: string) => {
      const q = questionMap.get(questionId);
      if (!q) return;

      setState((prev) => {
        // Guards
        if (prev.askedQuestionIds.includes(questionId)) return prev;
        if (prev.askedQuestionIds.length >= caseData.questionBudget) return prev;
        if (prev.trust <= 0) return prev;

        // Trust delta: prefer per-question impact; fallback to category trigger
        const categoryTrigger = caseData.trustMechanics.triggers.find(
          (t) => t.category === q.category
        );
        const delta = q.trustImpact ?? categoryTrigger?.delta ?? 0;
        const trustAfter = Math.max(
          caseData.trustMechanics.min,
          Math.min(caseData.trustMechanics.max, prev.trust + delta)
        );

        // New evidence (dedup)
        const newEvidenceIds = q.reveals.filter(
          (eid) => !prev.discoveredEvidenceIds.includes(eid) && evidenceMap.has(eid)
        );

        const order = prev.askedQuestionIds.length + 1;
        const record: AnsweredQuestion = {
          questionId,
          order,
          trustBefore: prev.trust,
          trustAfter,
          newEvidenceIds,
        };

        return {
          ...prev,
          askedQuestionIds: [...prev.askedQuestionIds, questionId],
          answeredHistory: [...prev.answeredHistory, record],
          discoveredEvidenceIds: [
            ...prev.discoveredEvidenceIds,
            ...newEvidenceIds,
          ],
          trust: trustAfter,
          lastQuestionId: questionId,
        };
      });
    },
    [questionMap, evidenceMap, caseData]
  );

  const endInvestigation = useCallback(() => {
    setState((prev) => ({ ...prev, phase: "synthesis" }));
  }, []);

  const togglePinEvidence = useCallback((evidenceId: string) => {
    setState((prev) => {
      if (!prev.discoveredEvidenceIds.includes(evidenceId)) return prev;
      const isPinned = prev.pinnedEvidenceIds.includes(evidenceId);
      return {
        ...prev,
        pinnedEvidenceIds: isPinned
          ? prev.pinnedEvidenceIds.filter((id) => id !== evidenceId)
          : [...prev.pinnedEvidenceIds, evidenceId],
      };
    });
  }, []);

  const setFramingComponent = useCallback(
    (kind: "symptom" | "root-cause" | "recommendation", componentId: string) => {
      setState((prev) => {
        if (prev.framingSubmitted) return prev;
        const next = { ...prev.framing };
        if (kind === "symptom") next.symptomId = componentId;
        else if (kind === "root-cause") next.rootCauseId = componentId;
        else next.recommendationId = componentId;
        return { ...prev, framing: next };
      });
    },
    []
  );

  const submitFraming = useCallback(() => {
    setState((prev) => {
      if (
        prev.framing.symptomId === null ||
        prev.framing.rootCauseId === null ||
        prev.framing.recommendationId === null
      ) {
        return prev;
      }
      return { ...prev, framingSubmitted: true, phase: "debrief" };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(buildInitialState(caseData));
  }, [caseData]);

  // ----- Lightweight performance tier (final scoring lives in case-evaluator) -----
  const getPerformanceTier = useCallback((): PerformanceTier => {
    if (!matchedCombo) return "missed-the-frame";
    switch (matchedCombo.tier) {
      case "gold":
        return "master-framer";
      case "silver":
        return "solid-analyst";
      case "bronze":
        return "promising";
      case "trap-baseline-ignored":
      case "trap-jumped-to-solution":
      case "trap-internal-cause":
        return "missed-the-frame";
      case "incoherent":
      default:
        return "failed";
    }
  }, [matchedCombo]);

  const value: PFGameContextValue = {
    caseData,
    state,
    remainingBudget,
    isBudgetExhausted,
    isTrustCollapsed,
    availableQuestions,
    discoveredEvidence,
    lastQuestion,
    lastAnswer,
    framingComplete,
    matchedCombo,
    setPhase,
    askQuestion,
    endInvestigation,
    togglePinEvidence,
    setFramingComponent,
    submitFraming,
    resetGame,
    getPerformanceTier,
  };

  return <PFGameContext.Provider value={value}>{children}</PFGameContext.Provider>;
};
