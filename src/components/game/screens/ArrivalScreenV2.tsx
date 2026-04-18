// ════════════════════════════════════════════════════════════════════════════
// ArrivalScreenV2 — وصول المتجر + لقاء أبو سعيد محايد (مفيش تسريب للمشكلة)
// ════════════════════════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, DoorOpen, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSound } from "@/hooks/useSoundEffects";
import { EnhancedDialogue } from "../EnhancedDialogue";
import storeFrontImg from "@/assets/scenes/store-front.png";
import storeEntranceImg from "@/assets/scenes/store-entrance.jpg";
import abuSaeedGreetingImg from "@/assets/scenes/abu-saeed-greeting.jpg";

interface Props { onComplete: () => void; }

export const ArrivalScreenV2 = ({ onComplete }: Props) => {
  const { profile } = useAuth();
  const { playSound } = useSound();
  const g = profile?.gender || "male";
  const [phase, setPhase] = useState<"storefront" | "entrance" | "greeting" | "dialogue" | "ready">("storefront");

  // الحوار الافتتاحي = محايد تمامًا. أبو سعيد ميقولش حاجة عن المشكلة، الأرقام،
  // المقارنة، أو رغبته في التخفيضات. اللاعب هو اللي لازم يستخرج كل ده.
  const dialogues = [
    {
      characterId: "abuSaeed",
      text: "أهلاً وسهلاً يا أستاذ. منصور كلمني إنك جاي. اتفضل.",
      mood: "neutral" as const,
    },
    {
      characterId: "abuSaeed",
      text: "أنا أبو سعيد. دي محلي. تشرب حاجة الأول؟",
      mood: "happy" as const,
    },
    {
      characterId: "detective",
      text: "ميرسي، خليني أبدأ شغل على طول لو ما عندكش مانع.",
      mood: "neutral" as const,
    },
    {
      characterId: "abuSaeed",
      text: "براحتك. أنا تحت أمرك، اسأل اللي تحب. سلمى المحاسبة موجودة كمان لو احتجت أرقام.",
      mood: "neutral" as const,
    },
  ];

  useEffect(() => {
    if (phase === "entrance") {
      try { playSound("storeBell"); } catch {}
      const t = setTimeout(() => setPhase("greeting"), 2200);
      return () => clearTimeout(t);
    }
    if (phase === "greeting") {
      const t = setTimeout(() => setPhase("dialogue"), 2200);
      return () => clearTimeout(t);
    }
  }, [phase, playSound]);

  if (phase === "storefront") {
    return (
      <div className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0" initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 2 }}>
          <img src={storeFrontImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        </motion.div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <motion.div className="flex flex-col items-center px-8 py-5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 mb-6" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-accent text-sm font-bold">وصلت المنصورة — متجر أبو سعيد</span>
            </div>
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">متجر أبو سعيد للملابس</h1>
            <p className="text-white/70 text-xs" dir="rtl">العميل في انتظارك</p>
          </motion.div>
          <motion.button
            className="relative px-8 py-3 rounded-xl text-base font-bold"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
            onClick={() => setPhase("entrance")}
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
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
        <motion.div className="absolute inset-0" initial={{ scale: 1.15, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5 }}>
          <img src={storeEntranceImg} alt="" className="w-full h-full object-cover" />
        </motion.div>
      </div>
    );
  }

  if (phase === "greeting") {
    return (
      <div className="relative h-screen overflow-hidden">
        <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <img src={abuSaeedGreetingImg} alt="" className="w-full h-full object-cover" />
        </motion.div>
      </div>
    );
  }

  if (phase === "ready") {
    return (
      <div className="min-h-screen bg-background relative">
        <div className="absolute inset-0">
          <img src={abuSaeedGreetingImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <motion.div className="max-w-md w-full text-center space-y-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <Search className="w-12 h-12 text-accent mx-auto" />
            <div className="p-6 rounded-xl bg-card/80 backdrop-blur-md border border-border space-y-3">
              <h2 className="text-xl font-bold text-foreground" dir="rtl">جاهز للتحقيق</h2>
              <p className="text-muted-foreground" dir="rtl">
                اسأل بحكمة. عندك ميزانية محدودة من الأسئلة. كل سؤال يستهلك من ميزانيتك حتى لو كان غلط.
              </p>
              <p className="text-sm text-amber-400/80" dir="rtl">
                💡 تذكّر: اسأل قبل ما تحكم. فكّك قبل ما تحلّ.
              </p>
            </div>
            <motion.button
              onClick={onComplete}
              className="px-8 py-4 rounded-xl text-lg font-bold w-full text-white"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            >
              ابدأ التحقيق
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <img src={abuSaeedGreetingImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </motion.div>
      <motion.div className="relative z-10 pt-12 pb-4 text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-muted-foreground text-sm">داخل المتجر 🏪</p>
        <h2 className="text-accent font-bold text-lg">متجر أبو سعيد</h2>
      </motion.div>
      <EnhancedDialogue
        dialogues={dialogues}
        isActive={phase === "dialogue"}
        onComplete={() => setPhase("ready")}
        playerName={profile?.display_name || "محلل"}
        playerGender={g as "male" | "female"}
      />
    </div>
  );
};
