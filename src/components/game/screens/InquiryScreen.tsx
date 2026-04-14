import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { INQUIRY_ROUNDS } from "@/data/pf-scenario";
import { usePFGame } from "@/contexts/PFGameContext";
import { useAuth } from "@/contexts/AuthContext";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { PFNotebook } from "../PFNotebook";
import type { InquiryOption } from "@/data/pf-scenario";
import storeFrontImg from "@/assets/scenes/store-front.png";

interface InquiryScreenProps {
  onComplete: () => void;
}

export const InquiryScreen = ({ onComplete }: InquiryScreenProps) => {
  const { state, chooseQuestion, addNote } = usePFGame();
  const { profile } = useAuth();

  const [phase, setPhase] = useState<"choosing" | "dialogue">("choosing");
  const [roundIndex, setRoundIndex] = useState(0);
  const [currentLines, setCurrentLines] = useState<any[]>([]);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [savedNoteIds, setSavedNoteIds] = useState<string[]>([]);
  const [dialogueKey, setDialogueKey] = useState(0);
  const [flashColor, setFlashColor] = useState<string | null>(null);

  const playerName = profile?.display_name || "محلل";
  const g = (profile?.gender || "male") as "male" | "female";

  const round = INQUIRY_ROUNDS[roundIndex];

  const shuffledOptions = useMemo(() => {
    if (!round) return [];
    const arr = [...round.options];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [roundIndex, round]);

  const triggerFlash = useCallback((tier: string) => {
    if (tier === "strong") {
      setFlashColor("bg-green-500/20");
    } else if (tier === "weak") {
      setFlashColor("bg-red-500/20");
    } else {
      setFlashColor(null);
      return;
    }
    setTimeout(() => setFlashColor(null), 600);
  }, []);

  const getMoodForTier = (tier: string): "neutral" | "happy" | "suspicious" => {
    if (tier === "strong") return "happy";
    if (tier === "weak") return "suspicious";
    return "neutral";
  };

  const handlePickQuestion = (option: InquiryOption) => {
    chooseQuestion(option);
    triggerFlash(option.tier);

    const abuMood = getMoodForTier(option.tier);

    // Dynamic prefix for high/low trust in later rounds
    let responsePrefix = "";
    if (roundIndex >= 3) {
      const currentTrust = state.trustLevel + (option.tier === "strong" ? 1 : option.tier === "weak" ? -1 : 0);
      if (currentTrust >= 7) {
        responsePrefix = "فعلاً أنت خلّيتني أفكر في حاجات ما كنتش واخد بالي منها… ";
      } else if (currentTrust <= 3) {
        responsePrefix = "مش عارف يا أستاذ… ";
      }
    }

    const lines = [
      {
        characterId: "detective",
        text: option.text,
        mood: "neutral" as const,
      },
      {
        characterId: "abuSaeed",
        text: responsePrefix + option.response,
        mood: abuMood,
        isSaveable: true,
        saveId: `round-${roundIndex}`,
        saveText: option.response,
      },
    ];

    setCurrentLines(lines);
    setDialogueIndex(0);
    setDialogueKey(prev => prev + 1);
    setPhase("dialogue");
  };

  const handleDialogueComplete = () => {
    if (roundIndex < INQUIRY_ROUNDS.length - 1) {
      setRoundIndex(prev => prev + 1);
      setPhase("choosing");
    } else {
      onComplete();
    }
  };

  const handleSaveNote = (saveId: string, saveText: string) => {
    if (!savedNoteIds.includes(saveId)) {
      setSavedNoteIds(prev => [...prev, saveId]);
      const rIdx = parseInt(saveId.replace("round-", ""), 10);
      const roundId = INQUIRY_ROUNDS[rIdx]?.id ?? rIdx;
      addNote(roundId, saveText);
    }
  };

  if (!round) return null;

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0">
        <img src={storeFrontImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* Flash overlay for strong/weak choices */}
      <AnimatePresence>
        {flashColor && (
          <motion.div
            className={`fixed inset-0 z-30 pointer-events-none ${flashColor}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Round indicator */}
      <div className="fixed top-4 right-4 z-20 flex gap-1.5">
        {INQUIRY_ROUNDS.map((_, i) => (
          <motion.div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i < roundIndex
                ? "bg-primary"
                : i === roundIndex
                ? "bg-primary/60 ring-2 ring-primary/30"
                : "bg-muted"
            }`}
            initial={i === roundIndex ? { scale: 0 } : {}}
            animate={i === roundIndex ? { scale: 1 } : {}}
          />
        ))}
      </div>

      <PFNotebook />

      {/* Question choices */}
      <AnimatePresence>
        {phase === "choosing" && (
          <motion.div
            key={`choices-${roundIndex}`}
            className="fixed inset-0 z-40 flex items-end justify-center pb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-lg w-full px-4 space-y-3">
              {/* Round title */}
              <motion.div
                className="text-center mb-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="text-xs text-muted-foreground bg-card/60 backdrop-blur-sm px-3 py-1 rounded-full">
                  جولة {roundIndex + 1} من {INQUIRY_ROUNDS.length} — {round.title}
                </span>
              </motion.div>

              {shuffledOptions.map((option, i) => (
                <motion.button
                  key={option.id}
                  onClick={() => handlePickQuestion(option)}
                  className="w-full p-4 rounded-xl bg-card/80 backdrop-blur-sm border border-border hover:border-primary/50 hover:bg-card transition-all text-right"
                  dir="rtl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                >
                  <p className="text-foreground text-sm leading-relaxed">{option.text}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EnhancedDialogue */}
      {phase === "dialogue" && currentLines.length > 0 && (
        <EnhancedDialogue
          key={dialogueKey}
          dialogues={currentLines}
          isActive={true}
          onComplete={handleDialogueComplete}
          currentIndex={dialogueIndex}
          onIndexChange={setDialogueIndex}
          onSaveNote={handleSaveNote}
          savedNoteIds={savedNoteIds}
          playerName={playerName}
          playerGender={g}
        />
      )}
    </div>
  );
};
