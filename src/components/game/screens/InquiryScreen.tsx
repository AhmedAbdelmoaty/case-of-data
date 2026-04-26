import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Sparkles } from "lucide-react";
import { usePFGame } from "@/contexts/PFGameContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSound } from "@/hooks/useSoundEffects";
import { useAmbientSound } from "@/hooks/useAmbientSound";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { PFNotebook } from "../PFNotebook";
import { TOTAL_QUESTION_BUDGET } from "@/lib/pf-case/case-tree";
import type { EvidenceData } from "@/lib/pf-case/evidence-catalog";
import velaroInteriorWideImg from "@/assets/scenes/velaro-interior-wide.webp";
import velaroCheckoutBusyImg from "@/assets/scenes/velaro-checkout-busy.webp";
import velaroWomensSectionImg from "@/assets/scenes/velaro-womens-section.webp";
import velaroMensSectionImg from "@/assets/scenes/velaro-mens-section.webp";
import hishamOfficeSeatedMaleImg from "@/assets/scenes/hisham-office-seated-male.webp";
import hishamOfficeSeatedFemaleImg from "@/assets/scenes/hisham-office-seated-female.webp";
import hishamGreetingMaleImg from "@/assets/scenes/hisham-greeting-male.webp";
import hishamGreetingFemaleImg from "@/assets/scenes/hisham-greeting-female.webp";
import hishamHandingReportMaleImg from "@/assets/scenes/hisham-handing-report-male.webp";
import hishamHandingReportFemaleImg from "@/assets/scenes/hisham-handing-report-female.webp";

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
  const { state, getChoices, pickChoice, restartInquiry, canRestart } = usePFGame();
  const { profile } = useAuth();
  const { playSound } = useSound();
  useAmbientSound("storeRich");

  const [phase, setPhase] = useState<"preQuestions" | "choosing" | "dialogue">("preQuestions");
  const [currentLines, setCurrentLines] = useState<DialogueLineUI[]>([]);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [dialogueKey, setDialogueKey] = useState(0);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  const playerName = profile?.display_name || "محلل";
  const g = (profile?.gender || "male") as "male" | "female";

  const choices = getChoices();

  // Restart button visible: between Q1 and Q4, only if attempt still available
  const showRestartButton =
    canRestart &&
    state.questionsUsed >= 1 &&
    state.questionsUsed < 4 &&
    !state.isComplete &&
    phase === "choosing";

  const handleConfirmRestart = () => {
    try { playSound("pageFlip"); } catch {}
    restartInquiry();
    setShowRestartConfirm(false);
    setPhase("preQuestions");
    setCurrentLines([]);
    setDialogueIndex(0);
  };

  const dialogueScene = useMemo(() => {
    const ownerBase = g === "female" ? hishamGreetingFemaleImg : hishamGreetingMaleImg;
    const ownerOffice = g === "female" ? hishamOfficeSeatedFemaleImg : hishamOfficeSeatedMaleImg;
    const reportScene = g === "female" ? hishamHandingReportFemaleImg : hishamHandingReportMaleImg;

    if (currentLines.some((line) => line.inlineEvidence)) return reportScene;
    if (state.trackEntered === "A") return velaroMensSectionImg;
    if (state.trackEntered === "C") return velaroWomensSectionImg;
    if (state.trackEntered === "D") return velaroCheckoutBusyImg;
    if (phase === "dialogue") return ownerOffice;
    if (state.questionsUsed === 0) return ownerBase;
    return velaroInteriorWideImg;
  }, [currentLines, g, phase, state.trackEntered, state.questionsUsed]);

  const handlePick = useCallback(
    (option: typeof choices[number]) => {
      // Removed paperRustle + tick — harsh "tssss" on every selection.
      const result = pickChoice(option);
      if (!result) return;

      const lines: DialogueLineUI[] = [
        // TEMPORARILY HIDDEN — uncomment to restore the analyst question line before Hisham's response
        // { characterId: "detective", text: result.questionText, mood: "neutral" },
        {
          characterId: "hisham",
          text: result.responseText,
          mood: option.isCorrect ? "happy" : "neutral",
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
    [pickChoice]
  );

  const handleDialogueComplete = useCallback(() => {
    if (state.isComplete) {
      onComplete();
      return;
    }
    setPhase("choosing");
  }, [state.isComplete, onComplete]);

  useEffect(() => {
    if (state.isComplete && phase === "choosing") {
      onComplete();
    }
  }, [state.isComplete, phase, onComplete]);

  const progressDots = Array.from({ length: TOTAL_QUESTION_BUDGET }, (_, i) => i);

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatePresence mode="wait">
        <motion.div key={dialogueScene} className="absolute inset-0 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
          <img src={dialogueScene} alt="VELARO conversation scene" className="w-full h-full object-cover animate-ken-burns" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/25 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="fixed top-4 right-4 z-20 flex gap-1.5">
        {progressDots.map((i) => (
          <motion.div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i < state.questionsUsed ? "bg-primary" : i === state.questionsUsed ? "bg-primary/60 ring-2 ring-primary/30" : "bg-muted"}`} />
        ))}
      </div>

      <PFNotebook />

      {/* Restart inquiry button — up to 2 uses, only mid-game */}
      <AnimatePresence>
        {showRestartButton && (
          <motion.button
            key="restart-btn"
            onClick={() => setShowRestartConfirm(true)}
            className="fixed top-4 left-4 z-[55] flex items-center gap-2 px-4 py-2.5 rounded-full border-2 border-amber-400/60 bg-gradient-to-r from-amber-500/25 to-orange-500/25 backdrop-blur-md text-amber-200 font-bold text-xs shadow-lg shadow-amber-500/30 hover:shadow-amber-500/60 hover:scale-105 transition-all"
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: 1,
              y: 0,
              boxShadow: [
                "0 4px 14px hsl(38 92% 50% / 0.25)",
                "0 4px 22px hsl(38 92% 50% / 0.55)",
                "0 4px 14px hsl(38 92% 50% / 0.25)",
              ],
            }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              boxShadow: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
            }}
            whileTap={{ scale: 0.95 }}
            title="اطلب محادثة جديدة من البداية"
            dir="rtl"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>اطلب محادثة جديدة من البداية</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Confirm restart modal */}
      <AnimatePresence>
        {showRestartConfirm && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRestartConfirm(false)}
          >
            <motion.div
              className="max-w-sm w-full bg-card border border-amber-400/40 rounded-2xl p-5 shadow-2xl"
              dir="rtl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-foreground">اطلب محادثة جديدة من البداية؟</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                هترجع تاني لمشهد دخولك المحل ومحادثة الترحيب مع أ. هشام، وكل الملاحظات والتقارير اللي جمعتها هتتمسح. متبقّى لك{" "}
                <span className="text-amber-400 font-bold">{2 - state.restartCount}</span> محاولة.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowRestartConfirm(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/70 transition-colors text-sm font-medium"
                >
                  لا، كمل
                </button>
                <button
                  onClick={handleConfirmRestart}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 transition-opacity text-sm font-bold"
                >
                  أيوه، ابدأ من الأول
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {phase === "preQuestions" && state.questionsUsed === 0 && !state.isComplete && (
          <motion.div
            key="pre-questions"
            className="fixed inset-0 z-40 flex items-end justify-center pb-8 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="max-w-md w-full rounded-3xl border border-primary/25 bg-card/90 backdrop-blur-md p-6 text-center shadow-[0_0_40px_hsl(var(--primary)/0.16)]"
              dir="rtl"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.35 }}
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 border border-primary/25">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
      
              <h2 className="mb-4 text-xl font-bold text-foreground">
                قبل ما تبدأ
              </h2>
      
              <p className="mb-6 text-sm leading-7 text-muted-foreground">
                اختار أسئلتك بعناية؛ كل إجابة هتضيف جزءًا من الصورة، وبعدها هتكتب تقريرك بناءً على اللي وصلت له.
              </p>
      
              <button
                onClick={() => setPhase("choosing")}
                className="w-full rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-primary/35 active:scale-[0.98]"
              >
                ابدأ الأسئلة
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {phase === "choosing" && choices.length > 0 && !state.isComplete && (
          <motion.div key={`choices-${state.currentNodeId}-${state.questionsUsed}`} className="fixed inset-0 z-40 flex items-end justify-center pb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="max-w-lg w-full px-4 space-y-3">
              {choices.map((option, i) => (
                <motion.button
                  key={option.id}
                  onClick={() => handlePick(option)}
                  onMouseEnter={() => { /* hover tick removed — too noisy */ }}
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
          savedNoteIds={state.savedNoteIds}
          playerName={playerName}
          playerGender={g}
        />
      )}

    </div>
  );
};
