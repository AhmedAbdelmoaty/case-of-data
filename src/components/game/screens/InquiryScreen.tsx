import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePFGame } from "@/contexts/PFGameContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSound } from "@/hooks/useSoundEffects";
import { useAmbientSound } from "@/hooks/useAmbientSound";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { PFNotebook } from "../PFNotebook";
import { TimeBudgetHUD } from "../TimeBudgetHUD";
import { TOTAL_QUESTION_BUDGET } from "@/lib/pf-case/case-tree";
import { ABU_SAEED_TIMEOUT_LINE } from "@/lib/pf-case/mansour-scripts";
import type { EvidenceData } from "@/lib/pf-case/evidence-catalog";
import velaroInteriorWideImg from "@/assets/scenes/velaro-interior-wide.png";
import velaroCheckoutBusyImg from "@/assets/scenes/velaro-checkout-busy.png";
import velaroWomensSectionImg from "@/assets/scenes/velaro-womens-section.png";
import velaroMensSectionImg from "@/assets/scenes/velaro-mens-section.png";
import hishamOfficeSeatedMaleImg from "@/assets/scenes/hisham-office-seated-male.png";
import hishamGreetingMaleImg from "@/assets/scenes/hisham-greeting-male.png";
import hishamGreetingFemaleImg from "@/assets/scenes/hisham-greeting-female.png";
import hishamHandingReportMaleImg from "@/assets/scenes/hisham-handing-report-male.png";
import hishamHandingReportFemaleImg from "@/assets/scenes/hisham-handing-report-female.png";

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
  inlineEvidence?: EvidenceData;
}

export const InquiryScreen = ({ onComplete }: InquiryScreenProps) => {
  const { state, getChoices, pickChoice, saveNote } = usePFGame();
  const { profile } = useAuth();
  const { playSound } = useSound();
  useAmbientSound("store");

  const [phase, setPhase] = useState<"choosing" | "dialogue" | "timeout">("choosing");
  const [currentLines, setCurrentLines] = useState<DialogueLineUI[]>([]);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [dialogueKey, setDialogueKey] = useState(0);
  const [costFlashKey, setCostFlashKey] = useState(0);

  const playerName = profile?.display_name || "محلل";
  const g = (profile?.gender || "male") as "male" | "female";

  const choices = getChoices();

  const dialogueScene = useMemo(() => {
    const ownerBase = g === "female" ? hishamGreetingFemaleImg : hishamGreetingMaleImg;
    const ownerOffice = hishamOfficeSeatedMaleImg;
    const reportScene = g === "female" ? hishamHandingReportFemaleImg : hishamHandingReportMaleImg;

    if (phase === "timeout") return ownerOffice;
    if (currentLines.some((line) => line.inlineEvidence)) return reportScene;
    if (state.currentNodeId?.includes("TRACK_A")) return velaroMensSectionImg;
    if (state.currentNodeId?.includes("TRACK_C")) return velaroWomensSectionImg;
    if (state.currentNodeId?.includes("TRACK_B") || state.currentNodeId?.includes("TRACK_D")) return velaroCheckoutBusyImg;
    if (phase === "dialogue") return ownerOffice;
    if (state.questionsUsed === 0) return ownerBase;
    return velaroInteriorWideImg;
  }, [currentLines, g, phase, state.currentNodeId, state.questionsUsed]);

  const handlePick = useCallback(
    (isCorrect: boolean) => {
      try { playSound("pageFlip"); } catch {}
      try { playSound("tick"); } catch {}
      const result = pickChoice(isCorrect);
      if (!result) return;

      setCostFlashKey((k) => k + 1);

      const lines: DialogueLineUI[] = [
        { characterId: "detective", text: result.questionText, mood: "neutral" },
        {
          characterId: "abuSaeed",
          text: result.responseText,
          mood: isCorrect ? "happy" : "neutral",
          isSaveable: !!result.noteId,
          saveId: result.noteId,
          saveText: result.noteText,
          inlineEvidence: result.evidence,
        },
      ];

      setCurrentLines(lines);
      setDialogueIndex(0);
      setDialogueKey((k) => k + 1);
      setPhase("dialogue");
    },
    [pickChoice, playSound]
  );

  const handleDialogueComplete = useCallback(() => {
    if (state.isComplete) {
      if (state.endedByTimeout) {
        setCurrentLines(
          ABU_SAEED_TIMEOUT_LINE.map((l) => ({
            characterId: l.characterId,
            text: l.text,
            mood: "suspicious",
          }))
        );
        setDialogueIndex(0);
        setDialogueKey((k) => k + 1);
        setPhase("timeout");
        return;
      }
      onComplete();
      return;
    }
    setPhase("choosing");
  }, [state.isComplete, state.endedByTimeout, onComplete]);

  const handleTimeoutComplete = useCallback(() => {
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (state.isComplete && phase === "choosing") {
      if (state.endedByTimeout) {
        setCurrentLines(
          ABU_SAEED_TIMEOUT_LINE.map((l) => ({
            characterId: l.characterId,
            text: l.text,
            mood: "suspicious",
          }))
        );
        setDialogueIndex(0);
        setDialogueKey((k) => k + 1);
        setPhase("timeout");
      } else {
        onComplete();
      }
    }
  }, [state.isComplete, state.endedByTimeout, phase, onComplete]);

  const progressDots = Array.from({ length: TOTAL_QUESTION_BUDGET }, (_, i) => i);

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatePresence mode="wait">
        <motion.div key={dialogueScene} className="absolute inset-0 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
          <img src={dialogueScene} alt="VELARO conversation scene" className="w-full h-full object-cover animate-ken-burns" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/25 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <TimeBudgetHUD timeRemaining={state.timeRemaining} lastTimeCost={state.lastTimeCost} flashKey={costFlashKey} />

      <div className="fixed top-4 right-4 z-20 flex gap-1.5">
        {progressDots.map((i) => (
          <motion.div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i < state.questionsUsed ? "bg-primary" : i === state.questionsUsed ? "bg-primary/60 ring-2 ring-primary/30" : "bg-muted"}`} />
        ))}
      </div>

      <PFNotebook />

      <AnimatePresence>
        {phase === "choosing" && choices.length > 0 && !state.isComplete && (
          <motion.div key={`choices-${state.currentNodeId}-${state.questionsUsed}`} className="fixed inset-0 z-40 flex items-end justify-center pb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="max-w-lg w-full px-4 space-y-3">
              <motion.div className="text-center mb-2" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-xs text-muted-foreground bg-card/65 px-3 py-1 rounded-full">
                  سؤال {Math.min(state.questionsUsed + 1, TOTAL_QUESTION_BUDGET)} من {TOTAL_QUESTION_BUDGET}
                </span>
              </motion.div>

              {choices.map((option, i) => (
                <motion.button
                  key={option.id}
                  onClick={() => handlePick(option.isCorrect)}
                  onMouseEnter={() => { try { playSound("tick"); } catch {} }}
                  className="w-full p-4 rounded-xl bg-card/85 border border-border hover:border-primary/60 hover:bg-card hover:shadow-[0_0_24px_hsl(var(--primary)/0.18)] transition-all text-right group"
                  dir="rtl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                >
                  <p className="text-foreground text-sm leading-relaxed group-hover:text-primary transition-colors">{option.text}</p>
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
          onSaveNote={(saveId, saveText) => saveNote(saveId, saveText)}
          savedNoteIds={state.savedNoteIds}
          playerName={playerName}
          playerGender={g}
        />
      )}

      {phase === "timeout" && currentLines.length > 0 && (
        <EnhancedDialogue
          key={`timeout-${dialogueKey}`}
          dialogues={currentLines}
          isActive={true}
          onComplete={handleTimeoutComplete}
          currentIndex={dialogueIndex}
          onIndexChange={setDialogueIndex}
          savedNoteIds={state.savedNoteIds}
          playerName={playerName}
          playerGender={g}
        />
      )}
    </div>
  );
};