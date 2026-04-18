import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { INQUIRY_ROUNDS, FRAMING_OPTIONS, FRAMING_POINTS, type InquiryOption } from "@/data/pf-scenario";

interface NoteEntry {
  roundId: number;
  text: string;
}

export type PerformanceTier = "exceptional" | "promising" | "beginner";

interface PFGameState {
  currentRound: number;
  choices: InquiryOption[];
  score: number;
  notes: NoteEntry[];
  chosenFramingId: string | null;
  gamePhase: "briefing" | "travel" | "arrival" | "inquiry" | "framing" | "presentation" | "return-travel" | "debrief" | "result";
  trustLevel: number; // 0-10, starts at 5
}

interface PFGameContextValue {
  state: PFGameState;
  chooseQuestion: (option: InquiryOption) => void;
  addNote: (roundId: number, text: string) => void;
  removeNote: (roundId: number) => void;
  chooseFraming: (framingId: string) => void;
  getFinalScore: () => number;
  resetGame: () => void;
  setPhase: (phase: PFGameState["gamePhase"]) => void;
  getPerformanceTier: () => PerformanceTier;
  isFramingCorrect: () => boolean;
}

const initialState: PFGameState = {
  currentRound: 0,
  choices: [],
  score: 0,
  notes: [],
  chosenFramingId: null,
  gamePhase: "briefing",
  trustLevel: 5,
};

const PFGameContext = createContext<PFGameContextValue | null>(null);

export const usePFGame = () => {
  const ctx = useContext(PFGameContext);
  if (!ctx) throw new Error("usePFGame must be used within PFGameProvider");
  return ctx;
};

export const PFGameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PFGameState>(initialState);

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
      return { ...prev, notes: [...prev.notes, { roundId, text }] };
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

  return (
    <PFGameContext.Provider
      value={{ state, chooseQuestion, addNote, removeNote, chooseFraming, getFinalScore, resetGame, setPhase, getPerformanceTier, isFramingCorrect }}
    >
      {children}
    </PFGameContext.Provider>
  );
};
