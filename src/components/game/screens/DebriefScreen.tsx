import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { usePFGame } from "@/contexts/PFGameContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSound } from "@/hooks/useSoundEffects";
import { useAmbientSound } from "@/hooks/useAmbientSound";
import { EnhancedDialogue } from "../EnhancedDialogue";
import {
  MANSOUR_DEBRIEF_STRONG,
  MANSOUR_DEBRIEF_MEDIUM,
  MANSOUR_DEBRIEF_WEAK,
} from "@/lib/pf-case/mansour-scripts";
import prismHallwayImg from "@/assets/scenes/prism-hallway.png";
import mansourOfficeSeatedMaleImg from "@/assets/scenes/mansour-office-seated-male.png";
import mansourOfficeSeatedFemaleImg from "@/assets/scenes/mansour-office-seated-female.png";

interface DebriefScreenProps {
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

export const DebriefScreen = ({ onComplete }: DebriefScreenProps) => {
  const { state } = usePFGame();
  const { profile } = useAuth();
  const { playSound } = useSound();
  useAmbientSound("office");

  const [phase, setPhase] = useState<"hallway" | "dialogue">("hallway");
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const playerName = profile?.display_name || "محلل";
  const g = (profile?.gender || "male") as "male" | "female";
  const bg = g === "female" ? mansourOfficeSeatedFemaleImg : mansourOfficeSeatedMaleImg;
  const tier = state.outcome || "medium";

  const dialogues = useMemo(() => {
    const source = tier === "strong" ? MANSOUR_DEBRIEF_STRONG : tier === "weak" ? MANSOUR_DEBRIEF_WEAK : MANSOUR_DEBRIEF_MEDIUM;
    return source.map((line) => ({ characterId: line.characterId, text: line.text, mood: mapMood(line.mood) }));
  }, [tier]);

  const hallwayTitle = tier === "strong" ? "راجع المكتب — منصور مستني يسمع منك" : tier === "weak" ? "راجع المكتب — تقييم منصور مهم المرة دي" : "راجع المكتب — وقت التقييم النهائي";

  if (phase === "hallway") {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <motion.div className="absolute inset-0" initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5 }}>
          <img src={prismHallwayImg} alt="Prism hallway" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/65 to-transparent" />
        </motion.div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-3 max-w-md">
              <p className="text-muted-foreground text-sm tracking-widest">🏢 PRISM</p>
            <h2 className="text-foreground text-lg font-bold" dir="rtl">{hallwayTitle}</h2>
          </motion.div>
          <motion.button onClick={() => { try { playSound("door"); } catch {}; setPhase("dialogue"); }} className="mt-8 px-8 py-3 rounded-xl bg-card/60 border border-border text-foreground font-bold hover:bg-card/80 transition-all" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            ادخل المكتب
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <motion.div className="absolute inset-0" initial={{ scale: 1.04, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2 }}>
        <img src={bg} alt="Debrief with Mansour" className="w-full h-full object-cover animate-ken-burns" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />
      </motion.div>
      <EnhancedDialogue dialogues={dialogues} isActive={true} onComplete={onComplete} currentIndex={dialogueIndex} onIndexChange={setDialogueIndex} playerName={playerName} playerGender={g} />
    </div>
  );
};