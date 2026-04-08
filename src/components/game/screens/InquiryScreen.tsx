import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { INQUIRY_ROUNDS } from "@/data/pf-scenario";
import { usePFGame } from "@/contexts/PFGameContext";
import { useAuth } from "@/contexts/AuthContext";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { PFNotebook } from "../PFNotebook";
import type { InquiryOption } from "@/data/pf-scenario";

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

  const playerName = profile?.display_name || "محلل";
  const g = (profile?.gender || "male") as "male" | "female";

  const round = INQUIRY_ROUNDS[roundIndex];

  // Shuffle options once per round
  const shuffledOptions = useMemo(() => {
    if (!round) return [];
    const arr = [...round.options];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [roundIndex, round]);

  const handlePickQuestion = (option: InquiryOption) => {
    chooseQuestion(option);

    const lines = [
      {
        characterId: "detective",
        text: option.text,
        mood: "neutral" as const,
      },
      {
        characterId: "abuSaeed",
        text: option.response,
        mood: "neutral" as const,
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
      const rIdx = parseInt(saveId.replace("round-", ""));
      addNote(INQUIRY_ROUNDS[rIdx]?.id || saveId, saveText);
    }
  };

  if (!round) return null;

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-background to-background" />

      <PFNotebook />

      {/* Question choices — appear at the bottom like dialogue options */}
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
                  whileTap={{ scale: 0.99 }}
                >
                  <p className="text-foreground text-sm leading-relaxed">{option.text}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EnhancedDialogue — same style as briefing conversations */}
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
