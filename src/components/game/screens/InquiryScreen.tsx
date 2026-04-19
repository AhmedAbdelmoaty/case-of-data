import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePFGame } from "@/contexts/PFGameContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSound } from "@/hooks/useSoundEffects";
import { useAmbientSound } from "@/hooks/useAmbientSound";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { PFNotebook } from "../PFNotebook";
import { CASE_META, QUESTION_BUNDLES, type NoteCandidate, type QuestionOption } from "@/data/pf-case";
import storeInsideImg from "@/assets/scenes/store-inside.png";
import storeCounterImg from "@/assets/scenes/store-counter.png";
import storeWomensSectionImg from "@/assets/scenes/store-womens-section.jpg";

interface InquiryScreenProps {
  onComplete: () => void;
}

interface DialogueLineUI {
  characterId: string;
  text: string;
  mood?: "neutral" | "happy" | "suspicious";
  isSaveable?: boolean;
  saveId?: string;
  saveText?: string;
}

const TOTAL_BUDGET = CASE_META.coreQuestionBudget + CASE_META.recoveryBudget;

const getBackgroundForBundle = (bundleId: string | null) => {
  if (!bundleId) return storeInsideImg;

  if (
    bundleId === "bundle_6_baseline_validity" ||
    bundleId === "bundle_6_recovery" ||
    bundleId === "bundle_7_exceptional_factor" ||
    bundleId === "bundle_7_recovery" ||
    bundleId === "bundle_7a_followup"
  ) {
    return storeCounterImg;
  }

  if (
    bundleId === "bundle_4_baseline" ||
    bundleId === "bundle_4_recovery" ||
    bundleId === "bundle_5_reality_check" ||
    bundleId === "bundle_5_recovery"
  ) {
    return storeWomensSectionImg;
  }

  return storeInsideImg;
};

const getQuestionMood = (quality: QuestionOption["quality"]): "neutral" | "happy" | "suspicious" => {
  if (quality === "strong") return "happy";
  if (quality === "weak") return "suspicious";
  return "neutral";
};

const getOverlayClass = (bundleId: string | null) => {
  if (
    bundleId === "bundle_6_baseline_validity" ||
    bundleId === "bundle_6_recovery" ||
    bundleId === "bundle_7_exceptional_factor" ||
    bundleId === "bundle_7_recovery" ||
    bundleId === "bundle_7a_followup"
  ) {
    return "bg-black/70";
  }

  return "bg-black/60";
};

export const InquiryScreen = ({ onComplete }: InquiryScreenProps) => {
  const {
    state,
    startCase,
    getCurrentBundle,
    selectQuestion,
    saveCaseNote,
    canProceedToFraming,
  } = usePFGame();

  const { profile } = useAuth();
  const { playSound } = useSound();
  useAmbientSound("store");

  const [phase, setPhase] = useState<"choosing" | "dialogue" | "scene-transition">("choosing");
  const [currentLines, setCurrentLines] = useState<DialogueLineUI[]>([]);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [dialogueKey, setDialogueKey] = useState(0);
  const [displayBg, setDisplayBg] = useState<string>(storeInsideImg);
  const [pendingBg, setPendingBg] = useState<string | null>(null);

  const playerName = profile?.display_name || "محلل";
  const g = (profile?.gender || "male") as "male" | "female";

  useEffect(() => {
    startCase();
  }, [startCase]);

  useEffect(() => {
    const targetBg = getBackgroundForBundle(state.currentBundleId);
    setDisplayBg(targetBg);
  }, [state.currentBundleId]);

  const currentBundleOptions = useMemo(() => getCurrentBundle(), [getCurrentBundle]);
  const currentBundle = state.currentBundleId ? QUESTION_BUNDLES[state.currentBundleId] : null;

  const progressDots = useMemo(() => {
    return Array.from({ length: TOTAL_BUDGET }, (_, i) => i);
  }, []);

  const handlePickQuestion = useCallback(
    (option: QuestionOption) => {
      try {
        playSound("pageFlip");
      } catch {}

      const result = selectQuestion(option.id);
      if (!result) return;

      const firstNote: NoteCandidate | undefined = result.noteCandidates[0];

      const lines: DialogueLineUI[] = [
        {
          characterId: "detective",
          text: result.question.text,
          mood: "neutral",
        },
        {
          characterId: "abuSaeed",
          text: result.responseText,
          mood: getQuestionMood(result.question.quality),
          isSaveable: !!firstNote,
          saveId: firstNote?.id,
          saveText: firstNote?.text,
        },
      ];

      setCurrentLines(lines);
      setDialogueIndex(0);
      setDialogueKey((prev) => prev + 1);
      setPhase("dialogue");
    },
    [playSound, selectQuestion]
  );

  const handleSaveNote = useCallback(
    (saveId: string) => {
      saveCaseNote(saveId);
    },
    [saveCaseNote]
  );

  const handleDialogueComplete = useCallback(() => {
    const followUpPending =
      state.currentBundleId === "bundle_7a_followup" && !state.exceptionalCauseKnown;

    if (followUpPending) {
      setPhase("choosing");
      return;
    }

    const readyForFraming = canProceedToFraming();

    const budgetExhausted =
      state.totalQuestionsAsked >= TOTAL_BUDGET && !followUpPending;

    if (readyForFraming || budgetExhausted) {
      onComplete();
      return;
    }

    const nextBg = getBackgroundForBundle(state.currentBundleId);

    if (nextBg !== displayBg) {
      setPendingBg(nextBg);
      setPhase("scene-transition");
      setTimeout(() => {
        setDisplayBg(nextBg);
        setPendingBg(null);
        setPhase("choosing");
      }, 1200);
      return;
    }

    setPhase("choosing");
  }, [
    state.currentBundleId,
    state.exceptionalCauseKnown,
    state.totalQuestionsAsked,
    canProceedToFraming,
    onComplete,
    displayBg,
  ]);

  const currentBg = displayBg;
  const overlayOpacity = getOverlayClass(state.currentBundleId);

  if (phase === "scene-transition") {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          key={pendingBg || currentBg}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img src={pendingBg || currentBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBg}
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src={currentBg} alt="" className="w-full h-full object-cover animate-ken-burns" />
          <div className={`absolute inset-0 ${overlayOpacity} backdrop-blur-[2px]`} />
        </motion.div>
      </AnimatePresence>

      <div className="fixed top-4 right-4 z-20 flex gap-1.5">
        {progressDots.map((i) => (
          <motion.div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i < state.totalQuestionsAsked
                ? "bg-primary"
                : i === state.totalQuestionsAsked
                ? "bg-primary/60 ring-2 ring-primary/30"
                : "bg-muted"
            }`}
            initial={i === state.totalQuestionsAsked ? { scale: 0 } : {}}
            animate={i === state.totalQuestionsAsked ? { scale: 1 } : {}}
          />
        ))}
      </div>

      <PFNotebook />

      <AnimatePresence>
        {phase === "choosing" && currentBundleOptions.length > 0 && (
          <motion.div
            key={`choices-${state.currentBundleId}-${state.totalQuestionsAsked}`}
            className="fixed inset-0 z-40 flex items-end justify-center pb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-lg w-full px-4 space-y-3">
              <motion.div
                className="text-center mb-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="text-xs text-muted-foreground bg-card/60 backdrop-blur-sm px-3 py-1 rounded-full">
                  سؤال {Math.min(state.totalQuestionsAsked + 1, TOTAL_BUDGET)} من {TOTAL_BUDGET}
                  {currentBundle?.purpose ? ` — ${currentBundle.purpose}` : ""}
                </span>
              </motion.div>

              {currentBundleOptions.map((option, i) => (
                <motion.button
                  key={option.id}
                  onClick={() => handlePickQuestion(option)}
                  onMouseEnter={() => {
                    try {
                      playSound("tick");
                    } catch {}
                  }}
                  className="w-full p-4 rounded-xl bg-card/80 backdrop-blur-sm border border-border hover:border-primary/60 hover:bg-card hover:shadow-[0_0_24px_hsl(var(--primary)/0.18)] transition-all text-right group"
                  dir="rtl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                >
                  <p className="text-foreground text-sm leading-relaxed group-hover:text-primary transition-colors">
                    {option.text}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "dialogue" && currentLines.length > 0 && (
        <EnhancedDialogue
          key={dialogueKey}
          dialogues={currentLines}
          isActive={true}
          onComplete={handleDialogueComplete}
          currentIndex={dialogueIndex}
          onIndexChange={setDialogueIndex}
          onSaveNote={(saveId) => handleSaveNote(saveId)}
          savedNoteIds={state.savedNoteIds}
          playerName={playerName}
          playerGender={g}
        />
      )}
    </div>
  );
};
