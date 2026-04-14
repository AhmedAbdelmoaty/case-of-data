import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, DoorOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { gText } from "@/lib/gText";
import { useSound } from "@/hooks/useSoundEffects";
import { EnhancedDialogue } from "../EnhancedDialogue";
import storeFrontImg from "@/assets/scenes/store-front.png";

interface ArrivalScreenProps {
  onComplete: () => void;
}

export const ArrivalScreen = ({ onComplete }: ArrivalScreenProps) => {
  const { profile } = useAuth();
  const { playSound } = useSound();
  const g = profile?.gender || "male";
  const [phase, setPhase] = useState<"storefront" | "dialogue">("storefront");

  const dialogues = [
    {
      characterId: "abuSaeed",
      text: "أهلاً وسهلاً… نوّرت يا أستاذ. اتفضل.",
      mood: "happy" as const,
      audioSrc: "/voiceover/abu-saeed/arrival-01-welcome.mp3",
    },
    {
      characterId: "abuSaeed",
      text: "أنا أبو سعيد. المحل ده بقالي فيه أكتر من اتناشر سنة، والحمد لله… عملته بإيدي من الصفر.",
      mood: "neutral" as const,
      audioSrc: "/voiceover/abu-saeed/arrival-02-pride.mp3",
    },
    {
      characterId: "abuSaeed",
      text: "بس من كام أسبوع كده… حاسس إن فيه حاجة مش مظبوطة.",
      mood: "nervous" as const,
      audioSrc: "/voiceover/abu-saeed/arrival-03-concern.mp3",
    },
    {
      characterId: "abuSaeed",
      text: "الحركة في المحل كويسة… الناس بتيجي وبتتفرج وبتدخل وبتطلع… يعني المحل مش فاضي.",
      mood: "neutral" as const,
      audioSrc: "/voiceover/abu-saeed/arrival-04-traffic.mp3",
    },
    {
      characterId: "abuSaeed",
      text: "بس لما باجي أحسِب آخِر الأسبوع… بلاقي الرقم مش زي ما متوقع. البيع مش باين… رغم إن الحركة شكلها كويس.",
      mood: "nervous" as const,
      audioSrc: "/voiceover/abu-saeed/arrival-05-sales-problem.mp3",
    },
    {
      characterId: "detective",
      text: "طيب… خليني أسألك كام سؤال عشان أفهم الصورة كويس.",
      mood: "neutral" as const,
    },
    {
      characterId: "abuSaeed",
      text: "اتفضل… اسأل اللي عايزه. أنا محتاج حد يفهمني إيه اللي بيحصل.",
      mood: "neutral" as const,
      audioSrc: "/voiceover/abu-saeed/arrival-06-invite.mp3",
    },
  ];

  if (phase === "storefront") {
    return (
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img src={storeFrontImg} alt="Store Front" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        </div>

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
            <p className="text-white/70 text-xs" dir="rtl">أبو سعيد مستنيك جوه</p>
          </motion.div>

          <motion.button
            className="relative px-8 py-3 rounded-xl text-base font-bold overflow-hidden group"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
            onClick={() => {
              try { playSound("storeBell"); } catch {}
              setPhase("dialogue");
            }}
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

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0">
        <img src={storeFrontImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

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
