import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, DoorOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSound } from "@/hooks/useSoundEffects";
import { useAmbientSound, type AmbientScene } from "@/hooks/useAmbientSound";
import { EnhancedDialogue } from "../EnhancedDialogue";
import storeFrontImg from "@/assets/scenes/store-front.png";
import storeEntranceImg from "@/assets/scenes/store-entrance.jpg";
import abuSaeedGreetingImg from "@/assets/scenes/abu-saeed-greeting.jpg";
import { ABU_SAEED_GREETING } from "@/data/pf-case";

interface ArrivalScreenProps {
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

export const ArrivalScreen = ({ onComplete }: ArrivalScreenProps) => {
  const { profile } = useAuth();
  const { playSound } = useSound();
  const g = profile?.gender || "male";
  const [phase, setPhase] = useState<"storefront" | "entrance" | "greeting" | "dialogue">("storefront");

  const ambientScene: AmbientScene = phase === "storefront" ? "street" : "store";
  useAmbientSound(ambientScene);

  const dialogues = ABU_SAEED_GREETING.map((line) => ({
    characterId: line.characterId,
    text: line.text,
    mood: mapMood(line.mood),
    audioSrc: line.audioSrc,
  }));

  useEffect(() => {
    if (phase === "entrance") {
      try {
        playSound("storeBell");
      } catch {}
      const timer = setTimeout(() => setPhase("greeting"), 2500);
      return () => clearTimeout(timer);
    }
  }, [phase, playSound]);

  useEffect(() => {
    if (phase === "greeting") {
      const timer = setTimeout(() => setPhase("dialogue"), 2500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  if (phase === "storefront") {
    return (
      <div className="relative h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
        >
          <img src={storeFrontImg} alt="Store Front" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        </motion.div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <motion.div
            className="flex flex-col items-center px-8 py-5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 mb-6"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="flex items-center gap-2 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-accent text-sm font-bold">وصلت المتجر</span>
            </motion.div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-0.5 drop-shadow-lg">
              Fashion House
            </h1>
            <p className="text-white/70 text-xs" dir="rtl">
              أبو سعيد مستنيك جوه
            </p>
          </motion.div>

          <motion.button
            className="relative px-8 py-3 rounded-xl text-base font-bold overflow-hidden group"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
            onClick={() => setPhase("entrance")}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ["-200%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            <span className="relative z-10 flex items-center gap-2 text-white">
              <DoorOpen className="w-5 h-5" />
              ادخل المتجر
            </span>
          </motion.button>
        </div>
      </div>
    );
  }

  if (phase === "entrance") {
    return (
      <div className="relative h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img src={storeEntranceImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </motion.div>
      </div>
    );
  }

  if (phase === "greeting") {
    return (
      <div className="relative h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <img src={abuSaeedGreetingImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img src={abuSaeedGreetingImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </motion.div>

      <motion.div
        className="relative z-10 pt-12 pb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-muted-foreground text-sm">داخل المتجر 🏪</p>
        <h2 className="text-accent font-bold text-lg">Fashion House</h2>
      </motion.div>

      <EnhancedDialogue
        dialogues={dialogues}
        isActive={phase === "dialogue"}
        onComplete={onComplete}
        playerName={profile?.display_name || "محلل"}
        playerGender={g as "male" | "female"}
      />
    </div>
  );
};
