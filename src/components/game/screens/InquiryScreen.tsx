import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { INQUIRY_ROUNDS } from "@/data/pf-scenario";
import { usePFGame } from "@/contexts/PFGameContext";
import { useAuth } from "@/contexts/AuthContext";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { PFNotebook } from "../PFNotebook";
import type { InquiryOption } from "@/data/pf-scenario";
import storeInsideImg from "@/assets/scenes/store-inside.png";
import storeCounterImg from "@/assets/scenes/store-counter.png";
import storeWomensSectionImg from "@/assets/scenes/store-womens-section.jpg";

interface InquiryScreenProps {
  onComplete: () => void;
}

export const InquiryScreen = ({ onComplete }: InquiryScreenProps) => {
  const { state, chooseQuestion, addNote } = usePFGame();
  const { profile } = useAuth();

  const [phase, setPhase] = useState<"choosing" | "dialogue" | "scene-transition">("choosing");
  const [roundIndex, setRoundIndex] = useState(0);
  const [currentLines, setCurrentLines] = useState<any[]>([]);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [savedNoteIds, setSavedNoteIds] = useState<string[]>([]);
  const [dialogueKey, setDialogueKey] = useState(0);
  const [transitionInfo, setTransitionInfo] = useState<{ bg: string; label: string; subtitle: string } | null>(null);

  const playerName = profile?.display_name || "محلل";
  const g = (profile?.gender || "male") as "male" | "female";

  const round = INQUIRY_ROUNDS[roundIndex];

  // Round-based backgrounds: 0-1 store-inside, 2 women's section, 3-4 counter
  const getBackgroundForRound = (idx: number) => {
    if (idx >= 3) return storeCounterImg;
    if (idx === 2) return storeWomensSectionImg;
    return storeInsideImg;
  };

  const currentBg = getBackgroundForRound(roundIndex);
  const overlayOpacity = roundIndex >= 4 ? "bg-black/70" : "bg-black/60";

  // Gradual body language: Abu Saeed's scale changes based on cumulative trust
  const trustScale = useMemo(() => {
    const trust = state.trustLevel;
    if (trust >= 7) return 1.05;
    if (trust <= 3) return 0.95;
    return 1;
  }, [state.trustLevel]);

  const shuffledOptions = useMemo(() => {
    if (!round) return [];
    const arr = [...round.options];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [roundIndex, round]);

  const getMoodForTier = (tier: string): "neutral" | "happy" | "suspicious" => {
    if (tier === "strong") return "happy";
    if (tier === "weak") return "suspicious";
    return "neutral";
  };

  const handlePickQuestion = (option: InquiryOption) => {
    chooseQuestion(option);

    const abuMood = getMoodForTier(option.tier);

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
      const nextRound = roundIndex + 1;
      const nextBg = getBackgroundForRound(nextRound);
      const currentBgNow = getBackgroundForRound(roundIndex);

      // Scene transition when background changes
      if (nextBg !== currentBgNow) {
        let label = "";
        let subtitle = "";
        if (nextRound === 2) {
          label = "📍 قسم الحريمي";
          subtitle = "أبو سعيد واخدك على قسم تاني...";
        } else if (nextRound === 3) {
          label = "📍 ركن الكاشير";
          subtitle = "قعدت مع أبو سعيد عند الكاونتر...";
        }
        setTransitionInfo({ bg: nextBg === storeWomensSectionImg ? "womens" : "counter", label, subtitle });
        setPhase("scene-transition");
        setTimeout(() => {
          setRoundIndex(nextRound);
          setTransitionInfo(null);
          setPhase("choosing");
        }, 3000);
      } else {
        setRoundIndex(nextRound);
        setPhase("choosing");
      }
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

  // Scene transition between store areas
  if (phase === "scene-transition" && transitionInfo) {
    const transitionBgImg = transitionInfo.bg === "womens" ? storeWomensSectionImg : storeCounterImg;
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img src={transitionBgImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60" />
        </motion.div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <p className="text-muted-foreground text-sm tracking-widest">{transitionInfo.label}</p>
            <h2 className="text-foreground text-lg font-bold" dir="rtl">
              {transitionInfo.subtitle}
            </h2>
            <motion.p
              className="text-muted-foreground text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              dir="rtl"
            >
              الكلام بيتعمّق أكتر
            </motion.p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBg}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src={currentBg} alt="" className="w-full h-full object-cover" />
          <div className={`absolute inset-0 ${overlayOpacity} backdrop-blur-[2px]`} />
        </motion.div>
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

      {/* EnhancedDialogue - rendered outside transform to preserve fixed positioning */}
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
