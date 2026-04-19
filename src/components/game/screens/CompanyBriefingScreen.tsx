import { useState } from "react";
import { useSound } from "@/hooks/useSoundEffects";
import { useAmbientSound } from "@/hooks/useAmbientSound";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { Rocket, GraduationCap, DoorOpen } from "lucide-react";
import analystImg from "@/assets/characters/analyst.png";
import saraImg from "@/assets/characters/sara.png";
import officeHallwayImg from "@/assets/scenes/office-hallway.jpg";
import mansourDeskImg from "@/assets/scenes/mansour-desk.jpg";
import { MANSOUR_INTRO_DIALOGUES } from "@/data/pf-case";

interface CompanyBriefingScreenProps {
  onComplete: () => void;
  isReviewMode?: boolean;
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

export const CompanyBriefingScreen = ({
  onComplete,
  isReviewMode = false,
}: CompanyBriefingScreenProps) => {
  const { profile } = useAuth();
  const name = profile?.display_name || "محلل";
  const g = profile?.gender || "male";
  const { playSound, playDoorKnock } = useSound();

  useAmbientSound("office");

  const [phase, setPhase] = useState<"hallway" | "door-knock" | "dialogue" | "transition">(
    isReviewMode ? "dialogue" : "hallway"
  );

  const dialogues = MANSOUR_INTRO_DIALOGUES.map((line) => ({
    characterId: line.characterId,
    text: line.text,
    mood: mapMood(line.mood),
    audioSrc: line.audioSrc,
  }));

  const handleDialogueComplete = () => {
    if (isReviewMode) {
      onComplete();
      return;
    }
    setPhase("transition");
  };

  if (phase === "hallway") {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <img src={officeHallwayImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        </motion.div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="space-y-3"
          >
            <motion.p
              className="text-muted-foreground text-sm tracking-widest uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              🏢 الطابق 12
            </motion.p>
            <h1 className="text-accent font-bold text-2xl">Pinnacle Consulting</h1>
            <p className="text-muted-foreground text-sm">بيناكل للاستشارات</p>
          </motion.div>

          <motion.button
            onClick={() => {
              playDoorKnock();
              setPhase("door-knock");
            }}
            className="mt-10 px-8 py-3 rounded-xl bg-card/60 backdrop-blur-md border border-border text-foreground font-bold hover:bg-card/80 transition-all flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <DoorOpen className="w-5 h-5" />
            اطرق باب المكتب
          </motion.button>
        </div>
      </div>
    );
  }

  if (phase === "door-knock") {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <img src={officeHallwayImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
        </motion.div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
          <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.p
              className="text-4xl"
              animate={{ x: [0, -5, 5, -3, 3, 0] }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              🚪
            </motion.p>
            <motion.p
              className="text-foreground text-lg font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              dir="rtl"
            >
              طق طق طق...
            </motion.p>
            <motion.p
              className="text-accent text-base font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              dir="rtl"
            >
              "اتفضل!"
            </motion.p>
            <motion.button
              onClick={() => {
                try {
                  playSound("door");
                } catch {}
                setPhase("dialogue");
              }}
              className="mt-4 px-8 py-3 rounded-xl bg-card/60 backdrop-blur-md border border-border text-foreground font-bold hover:bg-card/80 transition-all"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              ادخل المكتب
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (phase === "transition") {
    const avatarImg = g === "female" ? saraImg : analystImg;

    return (
      <div className="min-h-screen bg-background relative">
        <div className="absolute inset-0">
          <img src={mansourDeskImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <motion.div
            className="max-w-md w-full text-center space-y-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="mx-auto w-28 h-28 rounded-full overflow-hidden border-4 border-accent glow-accent"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 12 }}
            >
              <img src={avatarImg} alt={name} className="w-full h-full object-cover" />
            </motion.div>

            <motion.div
              className="p-6 rounded-xl bg-card/80 backdrop-blur-md border border-border space-y-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <GraduationCap className="w-8 h-8 text-accent mx-auto" />
              <p className="text-foreground text-lg font-bold leading-relaxed" dir="rtl">
                قدامك عميل داخل على قرار، ودورك الأول إنك تفهم الصورة صح قبل أي اقتراح.
              </p>
            </motion.div>

            <motion.button
              onClick={onComplete}
              className="relative px-8 py-4 rounded-xl text-lg font-bold overflow-hidden group w-full"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              />
              <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                <Rocket className="w-5 h-5" />
                يلا نروح المتجر!
              </span>
            </motion.button>
          </motion.div>
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
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <img src={mansourDeskImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </motion.div>

      <motion.div
        className="relative z-10 pt-12 pb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-muted-foreground text-sm">🏢 مكتب الشركة</p>
        <h2 className="text-accent font-bold text-lg">Pinnacle Consulting</h2>
        <p className="text-muted-foreground text-xs">بيناكل للاستشارات</p>
      </motion.div>

      <EnhancedDialogue
        dialogues={dialogues}
        isActive={phase === "dialogue"}
        onComplete={handleDialogueComplete}
        playerName={name}
        playerGender={g as "male" | "female"}
      />
    </div>
  );
};
