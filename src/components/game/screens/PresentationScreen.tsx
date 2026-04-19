import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePFGame } from "@/contexts/PFGameContext";
import { useAuth } from "@/contexts/AuthContext";
import { EnhancedDialogue } from "../EnhancedDialogue";
import {
  ABU_SAEED_DEBRIEF_STRONG,
  ABU_SAEED_DEBRIEF_MEDIUM,
  ABU_SAEED_DEBRIEF_WEAK,
} from "@/lib/pf-case/debrief-scripts";
import storeInsideImg from "@/assets/scenes/store-inside.png";
import storeCounterImg from "@/assets/scenes/store-counter.png";

interface PresentationScreenProps {
  onComplete: () => void;
}

type DialogueMood = "neutral" | "happy" | "nervous" | "angry" | "suspicious";

const mapMood = (mood?: string): DialogueMood => {
  switch (mood) {
    case "happy": return "happy";
    case "concerned": return "nervous";
    case "impressed": return "happy";
    case "disappointed": return "angry";
    case "uncertain": return "suspicious";
    default: return "neutral";
  }
};

export const PresentationScreen = ({ onComplete }: PresentationScreenProps) => {
  const { state } = usePFGame();
  const { profile } = useAuth();
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const g = (profile?.gender || "male") as "male" | "female";
  const playerName = profile?.display_name || "محلل";
  const outcome = state.outcome || "medium";

  const dialogues = useMemo(() => {
    const source =
      outcome === "strong" ? ABU_SAEED_DEBRIEF_STRONG :
      outcome === "weak" ? ABU_SAEED_DEBRIEF_WEAK :
      ABU_SAEED_DEBRIEF_MEDIUM;
    return source.map((line) => ({
      characterId: line.characterId,
      text: line.text,
      mood: mapMood(line.mood),
    }));
  }, [outcome]);

  const titleText =
    outcome === "strong" ? "قدّمت تأطير قوي" :
    outcome === "weak" ? "أبو سعيد لسه محتاج صورة أوضح" :
    "بدأت توضح الصورة... لكن لسه محتاجة حسم أكتر";

  const backgroundImg = outcome === "strong" ? storeCounterImg : storeInsideImg;

  return (
    <div className="min-h-screen bg-background relative">
      <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <img src={backgroundImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px]" />
      </motion.div>

      <motion.div className="relative z-10 pt-12 pb-4 text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-accent font-bold text-lg" dir="rtl">عرض التأطير</h2>
        <p className="text-foreground text-sm mt-2" dir="rtl">{titleText}</p>
      </motion.div>

      <EnhancedDialogue
        dialogues={dialogues}
        isActive={true}
        onComplete={onComplete}
        currentIndex={dialogueIndex}
        onIndexChange={setDialogueIndex}
        playerName={playerName}
        playerGender={g}
      />
    </div>
  );
};
