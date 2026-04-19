import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  initialGameState,
  applyChoice as engineApply,
  getChoices as engineGetChoices,
  getNode as engineGetNode,
  evaluate as engineEvaluate,
  type GameState,
  type ChoicePresentation,
} from "@/lib/pf-case-engine/gameStateMachine";
import {
  FRAMING_SECTIONS,
  type FramingSelection,
} from "@/lib/pf-case/framing-board";
import type { CaseOutcome } from "@/lib/pf-case/case-tree";
import { EVIDENCE, type EvidenceData } from "@/lib/pf-case/evidence-catalog";

interface SavedNote {
  id: string;
  text: string;
  roundId: number;
}

export interface PFGameState extends GameState {
  notes: SavedNote[];
  framing: FramingSelection;
  framingSubmitted: boolean;
  outcome: CaseOutcome | null;
  framingCorrectCount: number;
  /** Reports (evidence ids) Abu Saeed handed over, in receipt order */
  collectedReports: string[];
}

interface ChoiceResult {
  questionText: string;
  responseText: string;
  evidence?: EvidenceData;
  noteId?: string;
  noteText?: string;
}

interface PFGameContextValue {
  state: PFGameState;
  // Inquiry
  getChoices: () => ChoicePresentation[];
  pickChoice: (isCorrect: boolean) => ChoiceResult | null;
  saveNote: (id: string, text: string) => void;
  removeNote: (roundId: number) => void;
  // Framing
  setFramingSelection: (sectionId: keyof FramingSelection, optionId: string) => void;
  submitFraming: () => CaseOutcome;
  // Lifecycle
  resetGame: () => void;
  // Helpers
  isInquiryComplete: () => boolean;
}

const initialState: PFGameState = {
  ...initialGameState,
  notes: [],
  framing: { client_view: null, hypothesis: null, true_frame: null, next_decision: null },
  framingSubmitted: false,
  outcome: null,
  framingCorrectCount: 0,
  collectedReports: [],
};

const PFGameContext = createContext<PFGameContextValue | null>(null);

export const usePFGame = () => {
  const ctx = useContext(PFGameContext);
  if (!ctx) throw new Error("usePFGame must be used within PFGameProvider");
  return ctx;
};

export const PFGameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PFGameState>(initialState);

  const getChoices = useCallback(() => engineGetChoices(state), [state]);

  const pickChoice = useCallback(
    (isCorrect: boolean): ChoiceResult | null => {
      const choice = isCorrect ? "correct" : "wrong";
      const result = engineApply(state, choice);
      setState((prev) => {
        const newReports =
          result.evidenceId && !prev.collectedReports.includes(result.evidenceId)
            ? [...prev.collectedReports, result.evidenceId]
            : prev.collectedReports;
        return {
          ...prev,
          ...result.nextState,
          collectedReports: newReports,
        };
      });

      return {
        questionText: result.questionText,
        responseText: result.responseText,
        evidence: result.evidenceId ? EVIDENCE[result.evidenceId] : undefined,
        noteId: result.note?.id,
        noteText: result.note?.text,
      };
    },
    [state]
  );

  const saveNote = useCallback((id: string, text: string) => {
    setState((prev) => {
      if (prev.savedNoteIds.includes(id)) return prev;
      return {
        ...prev,
        savedNoteIds: [...prev.savedNoteIds, id],
        notes: [...prev.notes, { id, text, roundId: prev.notes.length + 1 }],
      };
    });
  }, []);

  const removeNote = useCallback((roundId: number) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.roundId !== roundId),
    }));
  }, []);

  const setFramingSelection = useCallback(
    (sectionId: keyof FramingSelection, optionId: string) => {
      setState((prev) => ({
        ...prev,
        framing: { ...prev.framing, [sectionId]: optionId },
      }));
    },
    []
  );

  const submitFraming = useCallback((): CaseOutcome => {
    let outcome: CaseOutcome = "weak";
    setState((prev) => {
      const { outcome: o, correctCount } = engineEvaluate(prev, prev.framing);
      outcome = o;
      return {
        ...prev,
        framingSubmitted: true,
        outcome: o,
        framingCorrectCount: correctCount,
      };
    });
    return outcome;
  }, []);

  const resetGame = useCallback(() => setState(initialState), []);

  const isInquiryComplete = useCallback(() => state.isComplete, [state.isComplete]);

  return (
    <PFGameContext.Provider
      value={{
        state,
        getChoices,
        pickChoice,
        saveNote,
        removeNote,
        setFramingSelection,
        submitFraming,
        resetGame,
        isInquiryComplete,
      }}
    >
      {children}
    </PFGameContext.Provider>
  );
};

export { FRAMING_SECTIONS };
