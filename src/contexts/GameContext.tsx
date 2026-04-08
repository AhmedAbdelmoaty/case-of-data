import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { HYPOTHESES, EVIDENCE_ITEMS, DASHBOARD_DATA, ENDINGS, DIAGNOSTIC_EVIDENCE_IDS, PHASES } from "@/data/case1";

// ============================================
// Types
// ============================================

export interface NotebookEntry {
  id: string;
  text: string;
  source: "evidence" | "interview" | "dashboard" | "story";
  sourceId: string;
  timestamp: number;
}

export interface GameState {
  // Phase tracking
  currentPhaseIndex: number;

  // Navigation
  currentPhase: "intro" | "onboarding" | "scenes" | "hypothesis-select" | "analyst-hub" | "investigation" | "conclusion";
  hasSeenIntroDialogue: boolean;
  gameStatus: "briefing" | "playing" | "solved" | "failed";

  // Notebook
  notebook: NotebookEntry[];

  // Unlocks
  unlockedEvidence: string[];
  unlockedDashboard: string[];
  unlockedInterviews: string[];

  // Interviews
  completedInterviews: string[];

  // Evidence
  viewedEvidence: string[];

  // Dashboard
  viewedDashboard: string[];

  // Hypotheses
  selectedHypotheses: string[];

  // Swap
  hasUsedSwap: boolean;

  // ACH Matrix
  achMatrix: Record<string, Record<string, string>>;
  matrixEvidence: string[]; // evidence IDs player manually added to matrix

  // Final answer
  finalHypothesis: string | null;

  // Score
  score: number;

  // Room tracking
  currentRoom: string;
  visitedRooms: string[];

  // Scene system: how the user entered the current room
  entryMethod: "cta" | "direct";
  lastCTAPhaseIndex: number;
}

interface GameContextType {
  state: GameState;

  // Room navigation
  setCurrentRoom: (roomId: string) => void;
  setPhase: (phase: GameState["currentPhase"]) => void;
  setEntryMethod: (method: "cta" | "direct") => void;

  // Intro
  markIntroSeen: () => void;

  // Notebook
  addToNotebook: (entry: Omit<NotebookEntry, "id" | "timestamp">) => void;
  isInNotebook: (sourceId: string) => boolean;
  removeFromNotebook: (sourceId: string) => void;

  // Evidence
  viewEvidence: (evidenceId: string) => void;
  isEvidenceViewed: (evidenceId: string) => boolean;

  // Dashboard
  viewDashboardItem: (itemId: string) => void;

  // Interviews
  markInterviewComplete: (characterId: string) => void;
  isInterviewComplete: (characterId: string) => boolean;

  // Hypotheses
  toggleHypothesis: (hypothesisId: string) => void;
  isHypothesisSelected: (hypothesisId: string) => boolean;
  canSelectHypotheses: () => boolean;
  swapHypothesis: (oldId: string, newId: string) => void;

  // ACH Matrix
  setMatrixCell: (evidenceId: string, hypothesisId: string, value: string) => void;
  getMatrixCell: (evidenceId: string, hypothesisId: string) => string | null;
  canUseMatrix: () => boolean;
  addToMatrix: (sourceId: string) => void;
  removeFromMatrix: (sourceId: string) => void;

  // Phases
  advancePhase: () => void;
  getCTALabel: () => string;
  getCTATarget: () => string;
  canAdvance: () => boolean;

  // Final answer
  setFinalHypothesis: (hypothesisId: string) => void;
  canSubmitFinal: () => boolean;

  // Game helpers
  getProgress: () => number;
  getEnding: () => typeof ENDINGS[0] | null;
  resetGame: () => void;
}

// ============================================
// Initial State
// ============================================

const initialState: GameState = {
  currentPhaseIndex: 0,
  currentPhase: "intro",
  hasSeenIntroDialogue: false,
  gameStatus: "briefing",
  notebook: [],
  unlockedEvidence: [],
  unlockedDashboard: [],
  unlockedInterviews: [],
  completedInterviews: [],
  viewedEvidence: [],
  viewedDashboard: [],
  selectedHypotheses: [],
  hasUsedSwap: false,
  achMatrix: {},
  matrixEvidence: [],
  finalHypothesis: null,
  score: 0,
  currentRoom: "office",
  visitedRooms: [],
  entryMethod: "direct",
  lastCTAPhaseIndex: -1,
};

// ============================================
// Context
// ============================================

const GameContext = createContext<GameContextType | undefined>(undefined);

const loadState = (): GameState => {
  try {
    const saved = localStorage.getItem("detective-game-save");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with initial state to handle new fields
      return { ...initialState, ...parsed };
    }
    return initialState;
  } catch {
    return initialState;
  }
};

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GameState>(loadState);

  useEffect(() => {
    localStorage.setItem("detective-game-save", JSON.stringify(state));
  }, [state]);

  const setCurrentRoom = useCallback((roomId: string) => {
    setState(prev => ({
      ...prev,
      currentRoom: roomId,
      visitedRooms: prev.visitedRooms.includes(roomId) ? prev.visitedRooms : [...prev.visitedRooms, roomId],
    }));
  }, []);

  const setPhase = useCallback((phase: GameState["currentPhase"]) => {
    setState(prev => ({ ...prev, currentPhase: phase }));
  }, []);

  const setEntryMethod = useCallback((method: "cta" | "direct") => {
    setState(prev => ({ ...prev, entryMethod: method }));
  }, []);

  const markIntroSeen = useCallback(() => {
    setState(prev => ({ ...prev, hasSeenIntroDialogue: true, gameStatus: "playing" }));
  }, []);

  // Notebook
  const addToNotebook = useCallback((entry: Omit<NotebookEntry, "id" | "timestamp">) => {
    setState(prev => {
      if (prev.notebook.some(n => n.sourceId === entry.sourceId)) return prev;
      const newEntry: NotebookEntry = {
        ...entry,
        id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
      };
      return { ...prev, notebook: [...prev.notebook, newEntry], score: prev.score + 10 };
    });
  }, []);

  const isInNotebook = useCallback((sourceId: string): boolean => {
    return state.notebook.some(n => n.sourceId === sourceId);
  }, [state.notebook]);

  const removeFromNotebook = useCallback((sourceId: string) => {
    setState(prev => ({
      ...prev,
      notebook: prev.notebook.filter(n => n.sourceId !== sourceId),
      matrixEvidence: prev.matrixEvidence.filter(id => id !== sourceId),
    }));
  }, []);

  // Evidence
  const viewEvidence = useCallback((evidenceId: string) => {
    setState(prev => {
      if (prev.viewedEvidence.includes(evidenceId)) return prev;
      return { ...prev, viewedEvidence: [...prev.viewedEvidence, evidenceId], score: prev.score + 5 };
    });
  }, []);

  const isEvidenceViewed = useCallback((evidenceId: string): boolean => {
    return state.viewedEvidence.includes(evidenceId);
  }, [state.viewedEvidence]);

  // Dashboard
  const viewDashboardItem = useCallback((itemId: string) => {
    setState(prev => {
      if (prev.viewedDashboard.includes(itemId)) return prev;
      return { ...prev, viewedDashboard: [...prev.viewedDashboard, itemId], score: prev.score + 5 };
    });
  }, []);

  // Interviews
  const markInterviewComplete = useCallback((characterId: string) => {
    setState(prev => {
      if (prev.completedInterviews.includes(characterId)) return prev;
      return { ...prev, completedInterviews: [...prev.completedInterviews, characterId], score: prev.score + 15 };
    });
  }, []);

  const isInterviewComplete = useCallback((characterId: string): boolean => {
    return state.completedInterviews.includes(characterId);
  }, [state.completedInterviews]);

  // Hypotheses
  const toggleHypothesis = useCallback((hypothesisId: string) => {
    setState(prev => {
      const isSelected = prev.selectedHypotheses.includes(hypothesisId);
      if (isSelected) {
        return { ...prev, selectedHypotheses: prev.selectedHypotheses.filter(id => id !== hypothesisId) };
      }
      if (prev.selectedHypotheses.length >= 4) return prev;
      return { ...prev, selectedHypotheses: [...prev.selectedHypotheses, hypothesisId] };
    });
  }, []);

  const isHypothesisSelected = useCallback((hypothesisId: string): boolean => {
    return state.selectedHypotheses.includes(hypothesisId);
  }, [state.selectedHypotheses]);

  const canSelectHypotheses = useCallback((): boolean => {
    return true; // Always can select in new flow
  }, []);

  const swapHypothesis = useCallback((oldId: string, newId: string) => {
    setState(prev => {
      if (prev.hasUsedSwap) return prev;
      // Allow skipping swap (marks as used without changing)
      if (oldId === "__skip__" && newId === "__skip__") {
        return { ...prev, hasUsedSwap: true };
      }
      if (!prev.selectedHypotheses.includes(oldId)) return prev;
      if (prev.selectedHypotheses.includes(newId)) return prev;
      return {
        ...prev,
        selectedHypotheses: prev.selectedHypotheses.map(id => id === oldId ? newId : id),
        hasUsedSwap: true,
      };
    });
  }, []);

  // ACH Matrix
  const setMatrixCell = useCallback((evidenceId: string, hypothesisId: string, value: string) => {
    setState(prev => ({
      ...prev,
      achMatrix: {
        ...prev.achMatrix,
        [evidenceId]: { ...(prev.achMatrix[evidenceId] || {}), [hypothesisId]: value },
      },
    }));
  }, []);

  const getMatrixCell = useCallback((evidenceId: string, hypothesisId: string): string | null => {
    return state.achMatrix[evidenceId]?.[hypothesisId] || null;
  }, [state.achMatrix]);

  const canUseMatrix = useCallback((): boolean => {
    return state.selectedHypotheses.length === 4;
  }, [state.selectedHypotheses.length]);

  const addToMatrix = useCallback((sourceId: string) => {
    setState(prev => {
      if (prev.matrixEvidence.includes(sourceId)) return prev;
      return { ...prev, matrixEvidence: [...prev.matrixEvidence, sourceId] };
    });
  }, []);

  const removeFromMatrix = useCallback((sourceId: string) => {
    setState(prev => ({
      ...prev,
      matrixEvidence: prev.matrixEvidence.filter(id => id !== sourceId),
      achMatrix: { ...prev.achMatrix, [sourceId]: undefined as any },
    }));
  }, []);

  // Phases
  const advancePhase = useCallback(() => {
    setState(prev => {
      const nextIndex = prev.currentPhaseIndex + 1;
      if (nextIndex >= PHASES.length) return prev;

      const phase = PHASES[nextIndex];
      const newEvidence = [...prev.unlockedEvidence, ...(phase.unlocks.evidence || [])];
      const newDashboard = [...prev.unlockedDashboard, ...(phase.unlocks.dashboard || [])];
      const newInterviews = [...prev.unlockedInterviews, ...(phase.unlocks.interviews || [])];

      return {
        ...prev,
        currentPhaseIndex: nextIndex,
        entryMethod: "cta" as const,
        lastCTAPhaseIndex: nextIndex,
        unlockedEvidence: [...new Set(newEvidence)],
        unlockedDashboard: [...new Set(newDashboard)],
        unlockedInterviews: [...new Set(newInterviews)],
      };
    });
  }, []);

  const getCTALabel = useCallback((): string => {
    const phase = PHASES[state.currentPhaseIndex];
    return phase?.ctaLabel || "";
  }, [state.currentPhaseIndex]);

  const getCTATarget = useCallback((): string => {
    const phase = PHASES[state.currentPhaseIndex];
    return phase?.ctaTarget || "analyst-hub";
  }, [state.currentPhaseIndex]);

  const canAdvance = useCallback((): boolean => {
    if (state.currentPhaseIndex >= PHASES.length - 1) return false;
    const phase = PHASES[state.currentPhaseIndex];
    if (!phase.requiredViews) return true;

    const dashboardMet = phase.requiredViews.dashboard
      ? phase.requiredViews.dashboard.every(id => state.viewedDashboard.includes(id))
      : true;
    const evidenceMet = phase.requiredViews.evidence
      ? phase.requiredViews.evidence.every(id => state.viewedEvidence.includes(id))
      : true;
    const interviewsMet = phase.requiredViews.interviews
      ? phase.requiredViews.interviews.every(id => state.completedInterviews.includes(id))
      : true;

    // If swap phase, must answer swap before advancing
    if (phase.isSwapPhase && !state.hasUsedSwap) return false;

    return dashboardMet && evidenceMet && interviewsMet;
  }, [state.currentPhaseIndex, state.viewedDashboard, state.viewedEvidence, state.completedInterviews, state.hasUsedSwap]);

  // Final answer
  const setFinalHypothesis = useCallback((hypothesisId: string) => {
    setState(prev => {
      const hypothesis = HYPOTHESES.find(h => h.id === hypothesisId);
      if (!hypothesis) return prev;

      let endingType: string;
      if (!prev.selectedHypotheses.includes("H3")) {
        endingType = "missing";
      } else if (hypothesis.isCorrect) {
        const diagnosticCount = DIAGNOSTIC_EVIDENCE_IDS.filter(id =>
          prev.notebook.some(n => n.sourceId === id)
        ).length;
        endingType = diagnosticCount >= 2 ? "excellent" : "partial";
      } else {
        endingType = "wrong";
      }

      const ending = ENDINGS.find(e => e.type === endingType);

      return {
        ...prev,
        finalHypothesis: hypothesisId,
        gameStatus: "solved",
        currentPhase: "conclusion",
        score: prev.score + (ending?.score || 0),
      };
    });
  }, []);

  const canSubmitFinal = useCallback((): boolean => {
    return state.selectedHypotheses.length === 4 && state.finalHypothesis === null;
  }, [state.selectedHypotheses.length, state.finalHypothesis]);

  // Game helpers
  const getProgress = useCallback((): number => {
    const totalEvidence = EVIDENCE_ITEMS.length;
    const totalDashboard = DASHBOARD_DATA.length;
    const evidenceP = (state.viewedEvidence.length / totalEvidence) * 20;
    const dashboardP = (state.viewedDashboard.length / totalDashboard) * 15;
    const interviewP = (state.completedInterviews.length / 3) * 20;
    const notebookP = Math.min(state.notebook.length / 10, 1) * 20;
    const hypothesisP = (state.selectedHypotheses.length / 4) * 10;
    const phaseP = (state.currentPhaseIndex / PHASES.length) * 15;
    return Math.round(evidenceP + dashboardP + interviewP + notebookP + hypothesisP + phaseP);
  }, [state]);

  const getEnding = useCallback(() => {
    if (state.gameStatus !== "solved" || !state.finalHypothesis) return null;

    if (!state.selectedHypotheses.includes("H3")) {
      return ENDINGS.find(e => e.type === "missing") || null;
    }

    const hypothesis = HYPOTHESES.find(h => h.id === state.finalHypothesis);
    if (!hypothesis?.isCorrect) {
      return ENDINGS.find(e => e.type === "wrong") || null;
    }

    const diagnosticCount = DIAGNOSTIC_EVIDENCE_IDS.filter(id =>
      state.notebook.some(n => n.sourceId === id)
    ).length;

    if (diagnosticCount >= 2) {
      return ENDINGS.find(e => e.type === "excellent") || null;
    }
    return ENDINGS.find(e => e.type === "partial") || null;
  }, [state.gameStatus, state.finalHypothesis, state.selectedHypotheses, state.notebook]);

  const resetGame = useCallback(() => {
    localStorage.removeItem("detective-game-save");
    localStorage.removeItem("detective-game-screen");
    setState(initialState);
  }, []);

  return (
    <GameContext.Provider value={{
      state,
      setCurrentRoom,
      setPhase,
      setEntryMethod,
      markIntroSeen,
      addToNotebook,
      isInNotebook,
      removeFromNotebook,
      viewEvidence,
      isEvidenceViewed,
      viewDashboardItem,
      markInterviewComplete,
      isInterviewComplete,
      toggleHypothesis,
      isHypothesisSelected,
      canSelectHypotheses,
      swapHypothesis,
      setMatrixCell,
      getMatrixCell,
      canUseMatrix,
      addToMatrix,
      removeFromMatrix,
      advancePhase,
      getCTALabel,
      getCTATarget,
      canAdvance,
      setFinalHypothesis,
      canSubmitFinal,
      getProgress,
      getEnding,
      resetGame,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
