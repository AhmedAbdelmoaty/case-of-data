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
} from "@/data/pf-case";
import officeHallwayImg from "@/assets/scenes/office-hallway.jpg";
import mansourDeskImg from "@/assets/scenes/mansour-desk.jpg";

interface DebriefScreenProps {
  onComplete: () => void;
}

type EnhancedDialogueMood = "neutral" | "happy" | "nervous" | "angry" | "suspicious";

const mapMood = (mood?: string): EnhancedDialogueMood => {
  switch (mood) {
    case "happy":
      return "happy";
    case "concerned":
      return "nervous";
    case "serious":
      return "neutral";
    case "confident":
      return "neutral";
    case "impressed":
      return "happy";
    case "disappointed":
      return "angry";
    case "uncertain":
      return "suspicious";
    default:
      return "neutral";
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

  const tier = state.mansourDebriefType || state.finalOutcome || "medium";

  const dialogues = useMemo(() => {
    const source =
      tier === "strong"
        ? MANSOUR_DEBRIEF_STRONG
        : tier === "weak"
        ? MANSOUR_DEBRIEF_WEAK
        : MANSOUR_DEBRIEF_MEDIUM;

    return source.map((line) => ({
      characterId: line.characterId,
      text: line.text,
      mood: mapMood(line.mood),
      audioSrc: line.audioSrc,
    }));
  }, [tier]);

  const getLightingOverlay = () => {
    if (tier === "strong") return "bg-amber-900/20";
    if (tier === "weak") return "bg-blue-900/20";
    return "";
  };

  const hallwayTitle =
    tier === "strong"
      ? "راجع المكتب — منصور مستني يسمع منك"
      : tier === "weak"
      ? "راجع المكتب — تقييم منصور مهم المرة دي"
      : "راجع المكتب — وقت التقييم النهائي";

  const hallwaySubtext =
    tier === "strong"
      ? "واضح إنك رجعت بصورة قوية... دلوقتي هتشوف تقييم منصور"
      : tier === "weak"
      ? "في فرق كبير بين إنك تلاقي حل، وبين إنك تحدد المشكلة صح"
      : "أنت قريب من الفهم الصحيح، وده هيبان في التقييم";

  if (phase === "hallway") {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img src={officeHallwayImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
        </motion.div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3 max-w-md"
          >
            <p className="text-muted-foreground text-sm tracking-widest">🏢 الطابق 12</p>
            <h2 className="text-foreground text-lg font-bold" dir="rtl">
              {hallwayTitle}
            </h2>
            <motion.p
              className="text-muted-foreground text-xs leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              dir="rtl"
            >
              {hallwaySubtext}
            </motion.p>
          </motion.div>

          <motion.button
            onClick={() => {
              try {
                playSound("door");
              } catch {}
              setPhase("dialogue");
            }}
            className="mt-8 px-8 py-3 rounded-xl bg-card/60 backdrop-blur-md border border-border text-foreground font-bold hover:bg-card/80 transition-all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            ادخل المكتب
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <img src={mansourDeskImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        <div className={`absolute inset-0 ${getLightingOverlay()}`} />
      </motion.div>

      {tier === "strong" && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ["#FFD700", "#FFB300", "#FFE082", "#4CAF50"][i % 4],
              }}
              initial={{ top: "-5%", opacity: 1, rotate: 0 }}
              animate={{
                top: "110%",
                opacity: [1, 1, 0],
                rotate: Math.random() * 720,
                x: [0, (Math.random() - 0.5) * 70],
              }}
              transition={{
                duration: 2.6 + Math.random() * 1.6,
                delay: 1 + Math.random() * 1.5,
                repeat: Infinity,
                repeatDelay: Math.random() * 3,
              }}
            />
          ))}
        </div>
      )}

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
