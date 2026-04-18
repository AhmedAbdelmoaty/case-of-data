// ════════════════════════════════════════════════════════════════════════════
// PFGameContextV2 — السياق المحدّث (V3) — يدير: المراحل، الميزانية،
// المضللات، الـ Premature، فتح الشخصيات، اختيارات التأطير، التقييم.
// ════════════════════════════════════════════════════════════════════════════

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import {
  ALL_QUESTIONS,
  QUESTIONS_BY_CHARACTER,
  getQuestionById,
  getQuestionsForSet,
  computeCurrentPhase,
  isCharacterUnlocked as checkCharacterUnlocked,
  resolveQuestionState,
  QUESTION_BUDGET,
  GOLDEN_QUESTION_IDS,
  calculateTotalScore,
  type Character,
  type Question,
  type ScoreBreakdown,
  type GamePhase,
} from "@/data/pf-scenario";

export type PFGamePhase =
  | "office-briefing"
  | "travel"
  | "store-arrival"
  | "investigation"
  | "framing"
  | "result";

export interface PFInsight {
  questionId: string;
  character: Character;
  text: string;
  isKey: boolean;
  timestamp: number;
}

interface PFGameStateV2 {
  phase: PFGamePhase;
  askedIds: string[];
  insights: PFInsight[];
  budgetRemaining: number;
  activeCharacter: Character | null;
  framingChoices: Record<string, string>;
  framingSubmitted: boolean;
  /** آخر سؤال اتسأل — للعرض الفوري في الـ dialogue */
  lastAskedId: string | null;
}

interface PFGameContextV2Value {
  state: PFGameStateV2;
  currentInvestigationPhase: GamePhase;

  setPhase: (phase: PFGamePhase) => void;
  setActiveCharacter: (character: Character | null) => void;

  askQuestion: (questionId: string) => Question | null;
  isQuestionAsked: (questionId: string) => boolean;
  getQuestionsForCurrentSet: (character: Character) => Question[];
  isCharacterUnlocked: (character: Character) => boolean;
  getResolvedQuestion: (questionId: string) => { effectiveAnswer: string; effectiveInsight: string | null; isEffectivelyKey: boolean } | null;
  canAskMore: () => boolean;
  clearLastAsked: () => void;

  setFramingChoice: (slotId: string, choiceId: string) => void;
  submitFraming: () => void;

  getScoreBreakdown: () => ScoreBreakdown;
  resetGame: () => void;
}

const initialState: PFGameStateV2 = {
  phase: "office-briefing",
  askedIds: [],
  insights: [],
  budgetRemaining: QUESTION_BUDGET,
  activeCharacter: null,
  framingChoices: {},
  framingSubmitted: false,
  lastAskedId: null,
};

const PFGameContextV2 = createContext<PFGameContextV2Value | null>(null);

export const usePFGameV2 = () => {
  const ctx = useContext(PFGameContextV2);
  if (!ctx) throw new Error("usePFGameV2 must be used within PFGameProviderV2");
  return ctx;
};

export const PFGameProviderV2 = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PFGameStateV2>(initialState);

  const currentInvestigationPhase = useMemo(
    () => computeCurrentPhase(state.askedIds),
    [state.askedIds]
  );

  const setPhase = useCallback((phase: PFGamePhase) => {
    setState((prev) => ({ ...prev, phase }));
  }, []);

  const setActiveCharacter = useCallback((character: Character | null) => {
    setState((prev) => ({ ...prev, activeCharacter: character }));
  }, []);

  const askQuestion = useCallback((questionId: string): Question | null => {
    const question = getQuestionById(questionId);
    if (!question) return null;

    setState((prev) => {
      if (prev.askedIds.includes(questionId)) {
        return { ...prev, lastAskedId: questionId };
      }

      const consumesBudget = question.character !== "mansour";
      if (consumesBudget && prev.budgetRemaining <= 0) return prev;

      // resolve insight (لو premature بقى key)
      const resolved = resolveQuestionState(question, prev.askedIds);

      const newInsights = [...prev.insights];
      if (resolved.effectiveInsight) {
        newInsights.push({
          questionId: question.id,
          character: question.character,
          text: resolved.effectiveInsight,
          isKey: resolved.isEffectivelyKey,
          timestamp: Date.now(),
        });
      }

      return {
        ...prev,
        askedIds: [...prev.askedIds, questionId],
        insights: newInsights,
        budgetRemaining: consumesBudget ? prev.budgetRemaining - 1 : prev.budgetRemaining,
        lastAskedId: questionId,
      };
    });

    return question;
  }, []);

  const clearLastAsked = useCallback(() => {
    setState((prev) => ({ ...prev, lastAskedId: null }));
  }, []);

  const isQuestionAsked = useCallback(
    (questionId: string) => state.askedIds.includes(questionId),
    [state.askedIds]
  );

  const getQuestionsForCurrentSet = useCallback(
    (character: Character): Question[] => getQuestionsForSet(character, state.askedIds),
    [state.askedIds]
  );

  const isCharacterUnlocked = useCallback(
    (character: Character) => checkCharacterUnlocked(character, state.askedIds),
    [state.askedIds]
  );

  const getResolvedQuestion = useCallback(
    (questionId: string) => {
      const q = getQuestionById(questionId);
      if (!q) return null;
      // resolve based on state BEFORE this question was asked (use askedIds excluding it)
      const priorAsked = state.askedIds.filter((id) => id !== questionId);
      return resolveQuestionState(q, priorAsked);
    },
    [state.askedIds]
  );

  const canAskMore = useCallback(() => state.budgetRemaining > 0, [state.budgetRemaining]);

  const setFramingChoice = useCallback((slotId: string, choiceId: string) => {
    setState((prev) => ({
      ...prev,
      framingChoices: { ...prev.framingChoices, [slotId]: choiceId },
    }));
  }, []);

  const submitFraming = useCallback(() => {
    setState((prev) => ({ ...prev, framingSubmitted: true }));
  }, []);

  const getScoreBreakdown = useCallback(
    (): ScoreBreakdown =>
      calculateTotalScore(state.askedIds, state.budgetRemaining, state.framingChoices),
    [state.askedIds, state.budgetRemaining, state.framingChoices]
  );

  const resetGame = useCallback(() => setState(initialState), []);

  const value = useMemo<PFGameContextV2Value>(
    () => ({
      state,
      currentInvestigationPhase,
      setPhase,
      setActiveCharacter,
      askQuestion,
      isQuestionAsked,
      getQuestionsForCurrentSet,
      isCharacterUnlocked,
      getResolvedQuestion,
      canAskMore,
      clearLastAsked,
      setFramingChoice,
      submitFraming,
      getScoreBreakdown,
      resetGame,
    }),
    [
      state, currentInvestigationPhase, setPhase, setActiveCharacter, askQuestion,
      isQuestionAsked, getQuestionsForCurrentSet, isCharacterUnlocked, getResolvedQuestion,
      canAskMore, clearLastAsked, setFramingChoice, submitFraming, getScoreBreakdown, resetGame,
    ]
  );

  return <PFGameContextV2.Provider value={value}>{children}</PFGameContextV2.Provider>;
};

export type { Character, Question, ScoreBreakdown, GamePhase };
export { ALL_QUESTIONS, GOLDEN_QUESTION_IDS, QUESTIONS_BY_CHARACTER };
