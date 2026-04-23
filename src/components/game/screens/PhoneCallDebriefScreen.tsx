import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { usePFGame } from "@/contexts/PFGameContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAmbientSound } from "@/hooks/useAmbientSound";
import { EnhancedDialogue } from "../EnhancedDialogue";
import {
  MANSOUR_CALL_STRONG,
  MANSOUR_CALL_MEDIUM,
  MANSOUR_CALL_WEAK,
} from "@/lib/pf-case/mansour-call-scripts";
import analystMaleImg from "@/assets/photos/analyst-on-phone-male.webp";
import analystFemaleImg from "@/assets/photos/analyst-on-phone-female.webp";

interface PhoneCallDebriefScreenProps {
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
    case "angry": return "angry";
    case "nervous": return "nervous";
    default: return "neutral";
  }
};

const formatTime = (s: number) => {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
};

export const PhoneCallDebriefScreen = ({ onComplete }: PhoneCallDebriefScreenProps) => {
  const { state } = usePFGame();
  const { profile } = useAuth();
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useAmbientSound("phoneCall");

  const g = (profile?.gender || "male") as "male" | "female";
  const playerName = profile?.display_name || "محلل";
  const bg = g === "female" ? analystFemaleImg : analystMaleImg;
  const tier = state.outcome || "medium";

  const dialogues = useMemo(() => {
    const source = tier === "strong"
      ? MANSOUR_CALL_STRONG
      : tier === "weak"
      ? MANSOUR_CALL_WEAK
      : MANSOUR_CALL_MEDIUM;
    return source.map((line) => ({
      characterId: line.characterId,
      text: line.text,
      mood: mapMood(line.mood),
    }));
  }, [tier]);

  useEffect(() => {
    const i = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(i);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.04, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <img src={bg} alt="Analyst on the phone" className="w-full h-full object-cover animate-ken-burns" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-background/50" />
      </motion.div>

      {/* Call indicator */}
      <motion.div
        className="absolute top-12 right-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 backdrop-blur-md"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
          <Phone className="w-3.5 h-3.5 text-emerald-400" />
        </motion.div>
        <span className="text-emerald-400 text-xs font-bold" dir="rtl">
          مكالمة مع أ. منصور
        </span>
        <span className="text-emerald-300/80 text-xs font-mono">{formatTime(seconds)}</span>
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
