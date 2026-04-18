// ════════════════════════════════════════════════════════════════════════════
// PFGameContextV2 — السياق الجديد للعبة الجديدة "الموسم اللي ما جاش"
// ════════════════════════════════════════════════════════════════════════════
// مسؤول عن:
// - تتبع الأسئلة المسؤولة (askedIds) لكل شخصية
// - حساب الأسئلة المفتوحة/المقفولة بناءً على شجرة الكشف
// - إدارة ميزانية الأسئلة (questionsRemaining)
// - حفظ المعلومات المكتشفة (insights)
// - إدارة اختيارات شاشة التأطير
// - حساب التقييم النهائي
// ════════════════════════════════════════════════════════════════════════════

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import {
  ALL_QUESTIONS,
  QUESTIONS_BY_CHARACTER,
  isQuestionUnlocked,
  getQuestionById,
  QUESTION_BUDGET,
  GOLDEN_QUESTION_IDS,
  calculateTotalScore,
  type Character,
  type Question,
  type ScoreBreakdown,
} from "@/data/pf-scenario";

export type PFGamePhase =
  | "office-briefing"   // لقاء منصور في المكتب
  | "travel"            // السفر للمنصورة
  | "store-arrival"     // الوصول للمتجر
  | "investigation"     // التحقيق (بنك الأسئلة)
  | "framing"           // شاشة التأطير
  | "result";           // النتيجة

export interface PFInsight {
  questionId: string;
  character: Character;
  text: string;
  isGolden: boolean;
  timestamp: number;
}

interface PFGameStateV2 {
  phase: PFGamePhase;
  /** كل الأسئلة اللي اللاعب ساءلها (شامل منصور) */
  askedIds: string[];
  /** المعلومات المكتشفة بترتيب الكشف */
  insights: PFInsight[];
  /** الميزانية المتبقية (من QUESTION_BUDGET، لا يحسب أسئلة منصور) */
  budgetRemaining: number;
  /** الشخصية النشطة حاليًا (لما اللاعب يكون بيتكلم مع حد محدد) */
  activeCharacter: Character | null;
  /** اختيارات شاشة التأطير: slotId → choiceId */
  framingChoices: Record<string, string>;
  /** هل تم تسليم التأطير؟ */
  framingSubmitted: boolean;
}

interface PFGameContextV2Value {
  state: PFGameStateV2;

  // Phase
  setPhase: (phase: PFGamePhase) => void;

  // Character
  setActiveCharacter: (character: Character | null) => void;

  // Questions
  askQuestion: (questionId: string) => Question | null;
  isQuestionAsked: (questionId: string) => boolean;
  getUnlockedQuestionsFor: (character: Character) => Question[];
  getLockedQuestionsFor: (character: Character) => Question[];
  canAskMore: () => boolean;

  // Framing
  setFramingChoice: (slotId: string, choiceId: string) => void;
  submitFraming: () => void;

  // Score
  getScoreBreakdown: () => ScoreBreakdown;

  // Reset
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
};

const PFGameContextV2 = createContext<PFGameContextV2Value | null>(null);

export const usePFGameV2 = () => {
  const ctx = useContext(PFGameContextV2);
  if (!ctx) throw new Error("usePFGameV2 must be used within PFGameProviderV2");
  return ctx;
};

export const PFGameProviderV2 = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PFGameStateV2>(initialState);

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
      // لو السؤال متسأل قبل كده — لا تكرر
      if (prev.askedIds.includes(questionId)) return prev;

      // لو السؤال مش مفتوح — لا تسأله
      if (!isQuestionUnlocked(question, prev.askedIds)) return prev;

      // أسئلة منصور لا تستهلك من الميزانية
      const consumesBudget = question.character !== "mansour";
      if (consumesBudget && prev.budgetRemaining <= 0) return prev;

      const newInsight: PFInsight = {
        questionId: question.id,
        character: question.character,
        text: question.insight,
        isGolden: question.isGolden,
        timestamp: Date.now(),
      };

      return {
        ...prev,
        askedIds: [...prev.askedIds, questionId],
        insights: [...prev.insights, newInsight],
        budgetRemaining: consumesBudget
          ? prev.budgetRemaining - 1
          : prev.budgetRemaining,
      };
    });

    return question;
  }, []);

  const isQuestionAsked = useCallback(
    (questionId: string) => state.askedIds.includes(questionId),
    [state.askedIds]
  );

  const getUnlockedQuestionsFor = useCallback(
    (character: Character): Question[] => {
      const charQuestions = QUESTIONS_BY_CHARACTER[character];
      return charQuestions.filter((q) => isQuestionUnlocked(q, state.askedIds));
    },
    [state.askedIds]
  );

  const getLockedQuestionsFor = useCallback(
    (character: Character): Question[] => {
      const charQuestions = QUESTIONS_BY_CHARACTER[character];
      return charQuestions.filter((q) => !isQuestionUnlocked(q, state.askedIds));
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

  const getScoreBreakdown = useCallback((): ScoreBreakdown => {
    return calculateTotalScore(
      state.askedIds,
      state.budgetRemaining,
      state.framingChoices
    );
  }, [state.askedIds, state.budgetRemaining, state.framingChoices]);

  const resetGame = useCallback(() => setState(initialState), []);

  const value = useMemo<PFGameContextV2Value>(
    () => ({
      state,
      setPhase,
      setActiveCharacter,
      askQuestion,
      isQuestionAsked,
      getUnlockedQuestionsFor,
      getLockedQuestionsFor,
      canAskMore,
      setFramingChoice,
      submitFraming,
      getScoreBreakdown,
      resetGame,
    }),
    [
      state,
      setPhase,
      setActiveCharacter,
      askQuestion,
      isQuestionAsked,
      getUnlockedQuestionsFor,
      getLockedQuestionsFor,
      canAskMore,
      setFramingChoice,
      submitFraming,
      getScoreBreakdown,
      resetGame,
    ]
  );

  return <PFGameContextV2.Provider value={value}>{children}</PFGameContextV2.Provider>;
};

// Re-export types for convenience
export type { Character, Question, ScoreBreakdown };
export { ALL_QUESTIONS, GOLDEN_QUESTION_IDS };
