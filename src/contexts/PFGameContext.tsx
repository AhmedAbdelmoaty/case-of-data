import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  INQUIRY_ROUNDS,
  FRAMING_OPTIONS,
  FRAMING_POINTS,
  type InquiryOption,
} from "@/data/pf-scenario";

import type {
  FramingQuality,
  FramingSubmission,
  GamePhase,
  NoteCandidate,
  OutcomeType,
  QuestionOption,
} from "@/data/pf-case";
import {
  CASE_META,
  NOTES_CATALOG,
  QUESTION_BUNDLES,
  QUESTION_OPTIONS,
} from "@/data/pf-case";

import {
  applyQuestionChoice,
  buildCaseOutcome,
  canOpenFollowUp,
  canOpenFraming,
  evaluateFraming,
  getAvailableBundle,
} from "@/lib/pf-case-engine";

interface NoteEntry {
  roundId: number;
  text: string;
  noteId?: string;
  type?: string;
}

export type PerformanceTier = "exceptional" | "promising" | "beginner";

interface PFGameState {
  // ===== Existing state kept for compatibility with current UI =====
  currentRound: number;
  choices: InquiryOption[];
  score: number;
  notes: NoteEntry[];
  chosenFramingId: string | null;
  gamePhase: GamePhase;
  trustLevel: number; // 0-10 for current UI compatibility

  // ===== New case-runtime state =====
  currentBundleId: string | null;
  askedQuestionIds: string[];
  seenBundleIds: string[];
  savedNoteIds: string[];

  totalQuestionsAsked: number;
  recoveryUsed: number;
  strongQuestionsCount: number;
  goodQuestionsCount: number;
  weakQuestionsCount: number;

  // Knowledge flags
  claimOpened: boolean;
  claimDefined: boolean;
  contextOpened: boolean;
  stakesKnown: boolean;
  requestKnown: boolean;
  baselineKnown: boolean;
  comparisonBasedConcern: boolean;
  realityChecked: boolean;
  baselineQuestioned: boolean;
  comparisonMethodWeak: boolean;
  exceptionalYearKnown: boolean;
  exceptionalCauseKnown: boolean;
  framingReady: boolean;

  // Framing state
  framingPart1: string | null;
  framingPart2: string | null;
  framingPart3: string | null;
  framingPart4: string | null;
  framingSubmitted: boolean;
  framingQuality: FramingQuality | null;

  // Outcome state
  abuSaeedReactionType: OutcomeType | null;
  mansourDebriefType: OutcomeType | null;
  finalOutcome: OutcomeType | null;
}

interface PFGameContextValue {
  state: PFGameState;

  // ===== Existing API kept for current screens =====
  chooseQuestion: (option: InquiryOption) => void;
  addNote: (roundId: number, text: string) => void;
  removeNote: (roundId: number) => void;
  chooseFraming: (framingId: string) => void;
  getFinalScore: () => number;
  resetGame: () => void;
  setPhase: (phase: PFGameState["gamePhase"]) => void;
  getPerformanceTier: () => PerformanceTier;
  isFramingCorrect: () => boolean;

  // ===== New API for rebuilt case flow =====
  startCase: () => void;
  getCurrentBundle: () => QuestionOption[];
  selectQuestion: (questionId: string) => {
    question: QuestionOption;
    responseText: string;
    noteCandidates: NoteCandidate[];
  } | null;
  saveCaseNote: (noteId: string) => void;
  canProceedToFraming: () => boolean;
  isFollowUpAvailable: () => boolean;
  submitFramingParts: (submission: FramingSubmission) => FramingQuality;
}

const initialState: PFGameState = {
  // existing
  currentRound: 0,
  choices: [],
  score: 0,
  notes: [],
  chosenFramingId: null,
  gamePhase: "briefing",
  trustLevel: 5,

  // new runtime
  currentBundleId: "bundle_1_opening",
  askedQuestionIds: [],
  seenBundleIds: [],
  savedNoteIds: [],

  totalQuestionsAsked: 0,
  recoveryUsed: 0,
  strongQuestionsCount: 0,
  goodQuestionsCount: 0,
  weakQuestionsCount: 0,

  // knowledge
  claimOpened: false,
  claimDefined: false,
  contextOpened: false,
  stakesKnown: false,
  requestKnown: false,
  baselineKnown: false,
  comparisonBasedConcern: false,
  realityChecked: false,
  baselineQuestioned: false,
  comparisonMethodWeak: false,
  exceptionalYearKnown: false,
  exceptionalCauseKnown: false,
  framingReady: false,

  // framing
  framingPart1: null,
  framingPart2: null,
  framingPart3: null,
  framingPart4: null,
  framingSubmitted: false,
  framingQuality: null,

  // outcome
  abuSaeedReactionType: null,
  mansourDebriefType: null,
  finalOutcome: null,
};

const PFGameContext = createContext<PFGameContextValue | null>(null);

export const usePFGame = () => {
  const ctx = useContext(PFGameContext);
  if (!ctx) throw new Error("usePFGame must be used within PFGameProvider");
  return ctx;
};

function clampTrustToLegacyScale(runTrust: number) {
  // Internal engine currently works effectively in a smaller range.
  // We remap it gently to the existing 0-10 UI scale.
  // -2 => 1, -1 => 3, 0 => 5, +1 => 7, +2 => 9
  const mapping: Record<number, number> = {
    [-2]: 1,
    [-1]: 3,
    [0]: 5,
    [1]: 7,
    [2]: 9,
  };

  return mapping[runTrust] ?? 5;
}

export const PFGameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PFGameState>(initialState);

  // ===== Helpers =====
  const buildKnowledgeState = useCallback(
    (s: PFGameState) => ({
      claimOpened: s.claimOpened,
      claimDefined: s.claimDefined,
      contextOpened: s.contextOpened,
      stakesKnown: s.stakesKnown,
      requestKnown: s.requestKnown,
      baselineKnown: s.baselineKnown,
      comparisonBasedConcern: s.comparisonBasedConcern,
      realityChecked: s.realityChecked,
      baselineQuestioned: s.baselineQuestioned,
      comparisonMethodWeak: s.comparisonMethodWeak,
      exceptionalYearKnown: s.exceptionalYearKnown,
      exceptionalCauseKnown: s.exceptionalCauseKnown,
      framingReady: s.framingReady,
    }),
    []
  );

  const buildRunState = useCallback(
    (s: PFGameState) => ({
      totalQuestionsAsked: s.totalQuestionsAsked,
      recoveryUsed: s.recoveryUsed,
      strongQuestionsCount: s.strongQuestionsCount,
      goodQuestionsCount: s.goodQuestionsCount,
      weakQuestionsCount: s.weakQuestionsCount,
      trustLevel:
        s.trustLevel >= 8 ? 2 : s.trustLevel >= 6 ? 1 : s.trustLevel <= 2 ? -2 : s.trustLevel <= 4 ? -1 : 0,
      askedQuestionIds: s.askedQuestionIds,
      seenBundleIds: s.seenBundleIds,
      currentBundleId: s.currentBundleId,
      currentStateId: s.currentBundleId ?? "bundle_1_opening",
    }),
    []
  );

  const getCurrentBundle = useCallback((): QuestionOption[] => {
    const knowledge = buildKnowledgeState(state);
    const run = buildRunState(state);

    const bundleId = state.currentBundleId || getAvailableBundle(knowledge, run);
    const bundle = QUESTION_BUNDLES[bundleId];

    if (!bundle) return [];

    return bundle.optionIds
      .map((id) => QUESTION_OPTIONS[id])
      .filter(Boolean);
  }, [state, buildKnowledgeState, buildRunState]);

  // ===== Existing API (kept for current screens) =====
  const chooseQuestion = useCallback((option: InquiryOption) => {
    setState((prev) => {
      const trustDelta = option.tier === "strong" ? 1 : option.tier === "weak" ? -1 : 0;
      const newTrust = Math.max(0, Math.min(10, prev.trustLevel + trustDelta));

      return {
        ...prev,
        choices: [...prev.choices, option],
        score: prev.score + option.points,
        currentRound: prev.currentRound + 1,
        trustLevel: newTrust,
      };
    });
  }, []);

  const addNote = useCallback((roundId: number, text: string) => {
    setState((prev) => {
      if (prev.notes.some((n) => n.roundId === roundId)) return prev;

      return {
        ...prev,
        notes: [...prev.notes, { roundId, text }],
      };
    });
  }, []);

  const removeNote = useCallback((roundId: number) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.roundId !== roundId),
    }));
  }, []);

  const chooseFraming = useCallback((framingId: string) => {
    const framing = FRAMING_OPTIONS.find((f) => f.id === framingId);
    const bonus = framing?.isCorrect ? FRAMING_POINTS : 0;

    setState((prev) => ({
      ...prev,
      chosenFramingId: framingId,
      score: prev.score + bonus,
    }));
  }, []);

  const getFinalScore = useCallback(() => state.score, [state.score]);

  const getPerformanceTier = useCallback((): PerformanceTier => {
    if (state.score >= 20) return "exceptional";
    if (state.score >= 10) return "promising";
    return "beginner";
  }, [state.score]);

  const isFramingCorrect = useCallback(() => {
    const framing = FRAMING_OPTIONS.find((f) => f.id === state.chosenFramingId);
    return framing?.isCorrect || false;
  }, [state.chosenFramingId]);

  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  const setPhase = useCallback((phase: PFGameState["gamePhase"]) => {
    setState((prev) => ({ ...prev, gamePhase: phase }));
  }, []);

  // ===== New API (for rebuilt logic) =====
  const startCase = useCallback(() => {
    setState((prev) => ({
      ...initialState,
      gamePhase: prev.gamePhase === "briefing" ? "arrival" : prev.gamePhase,
      currentBundleId: "bundle_1_opening",
    }));
  }, []);

  const selectQuestion = useCallback(
    (questionId: string) => {
      const question = QUESTION_OPTIONS[questionId];
      if (!question) return null;

      const result = applyQuestionChoice(questionId, buildKnowledgeState(state), buildRunState(state));

      const nextKnowledge = result.nextKnowledge;
      const nextRun = result.nextRun;

      const nextBundleId = getAvailableBundle(nextKnowledge, nextRun);
      const framingReady = canOpenFraming(nextKnowledge);
      const nextTrust = clampTrustToLegacyScale(nextRun.trustLevel);

      setState((prev) => ({
        ...prev,
        trustLevel: nextTrust,

        // runtime
        currentBundleId: nextBundleId,
        askedQuestionIds: nextRun.askedQuestionIds,
        seenBundleIds: nextRun.seenBundleIds,
        totalQuestionsAsked: nextRun.totalQuestionsAsked,
        recoveryUsed: Math.min(nextRun.recoveryUsed, CASE_META.recoveryBudget),
        strongQuestionsCount: nextRun.strongQuestionsCount,
        goodQuestionsCount: nextRun.goodQuestionsCount,
        weakQuestionsCount: nextRun.weakQuestionsCount,

        // knowledge
        claimOpened: nextKnowledge.claimOpened,
        claimDefined: nextKnowledge.claimDefined,
        contextOpened: nextKnowledge.contextOpened,
        stakesKnown: nextKnowledge.stakesKnown,
        requestKnown: nextKnowledge.requestKnown,
        baselineKnown: nextKnowledge.baselineKnown,
        comparisonBasedConcern: nextKnowledge.comparisonBasedConcern,
        realityChecked: nextKnowledge.realityChecked,
        baselineQuestioned: nextKnowledge.baselineQuestioned,
        comparisonMethodWeak: nextKnowledge.comparisonMethodWeak,
        exceptionalYearKnown: nextKnowledge.exceptionalYearKnown,
        exceptionalCauseKnown: nextKnowledge.exceptionalCauseKnown,
        framingReady,
      }));

      const responseText =
        result.response.variantsByTrust?.find((variant) => {
          const trust = nextRun.trustLevel;
          const minOk = variant.minTrust === undefined || trust >= variant.minTrust;
          const maxOk = variant.maxTrust === undefined || trust <= variant.maxTrust;
          return minOk && maxOk;
        })?.text ?? result.response.text;

      return {
        question: result.question,
        responseText,
        noteCandidates: result.noteCandidates,
      };
    },
    [state, buildKnowledgeState, buildRunState]
  );

  const saveCaseNote = useCallback((noteId: string) => {
    setState((prev) => {
      if (prev.savedNoteIds.includes(noteId)) return prev;

      const note = NOTES_CATALOG[noteId];
      if (!note) return prev;

      const nextRoundId = prev.notes.length + 1;

      return {
        ...prev,
        savedNoteIds: [...prev.savedNoteIds, noteId],
        notes: [
          ...prev.notes,
          {
            roundId: nextRoundId,
            text: note.text,
            noteId: note.id,
            type: note.type,
          },
        ],
      };
    });
  }, []);

  const canProceedToFraming = useCallback(() => {
    return canOpenFraming(buildKnowledgeState(state));
  }, [state, buildKnowledgeState]);

  const isFollowUpAvailable = useCallback(() => {
    return canOpenFollowUp(buildKnowledgeState(state), buildRunState(state));
  }, [state, buildKnowledgeState, buildRunState]);

  const submitFramingParts = useCallback((submission: FramingSubmission): FramingQuality => {
    const quality = evaluateFraming(submission);

    setState((prev) => {
      const outcome = buildCaseOutcome(buildRunState(prev), quality);

      return {
        ...prev,
        framingPart1: submission.clientViewId,
        framingPart2: submission.flawId,
        framingPart3: submission.trueFrameId,
        framingPart4: submission.nextDecisionId,
        framingSubmitted: true,
        framingQuality: quality,
        finalOutcome: outcome,
        abuSaeedReactionType: outcome,
        mansourDebriefType: outcome,
      };
    });

    return quality;
  }, [buildRunState]);

  return (
    <PFGameContext.Provider
      value={{
        state,

        // existing
        chooseQuestion,
        addNote,
        removeNote,
        chooseFraming,
        getFinalScore,
        resetGame,
        setPhase,
        getPerformanceTier,
        isFramingCorrect,

        // new
        startCase,
        getCurrentBundle,
        selectQuestion,
        saveCaseNote,
        canProceedToFraming,
        isFollowUpAvailable,
        submitFramingParts,
      }}
    >
      {children}
    </PFGameContext.Provider>
  );
};
