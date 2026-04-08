import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { INQUIRY_ROUNDS, FRAMING_OPTIONS, FRAMING_POINTS, type InquiryOption } from "@/data/pf-scenario";

interface NoteEntry {
  roundId: number;
  text: string;
}

interface PFGameState {
  currentRound: number;
  choices: InquiryOption[];
  score: number;
  notes: NoteEntry[];
  chosenFramingId: string | null;
  gamePhase: "briefing" | "travel" | "arrival" | "inquiry" | "framing" | "result";
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
}

const initialState: PFGameState = {
  currentRound: 0,
  choices: [],
  score: 0,
  notes: [],
  chosenFramingId: null,
  gamePhase: "briefing",
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
    setState((prev) => ({
      ...prev,
      choices: [...prev.choices, option],
      score: prev.score + option.points,
      currentRound: prev.currentRound + 1,
    }));
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

  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  const setPhase = useCallback((phase: PFGameState["gamePhase"]) => {
    setState((prev) => ({ ...prev, gamePhase: phase }));
  }, []);

  return (
    <PFGameContext.Provider
      value={{ state, chooseQuestion, addNote, removeNote, chooseFraming, getFinalScore, resetGame, setPhase }}
    >
      {children}
    </PFGameContext.Provider>
  );
};
