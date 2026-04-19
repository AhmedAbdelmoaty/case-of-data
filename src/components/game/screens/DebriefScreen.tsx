import { useState } from "react";
import { motion } from "framer-motion";
import { usePFGame } from "@/contexts/PFGameContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSound } from "@/hooks/useSoundEffects";
import { useAmbientSound } from "@/hooks/useAmbientSound";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { gText } from "@/lib/gText";
import officeHallwayImg from "@/assets/scenes/office-hallway.jpg";
import mansourDeskImg from "@/assets/scenes/mansour-desk.jpg";

interface DebriefScreenProps {
  onComplete: () => void;
}

export const DebriefScreen = ({ onComplete }: DebriefScreenProps) => {
  const { state, getPerformanceTier, isFramingCorrect } = usePFGame();
  const { profile } = useAuth();
  const { playSound } = useSound();
  useAmbientSound("office");
  const [phase, setPhase] = useState<"hallway" | "dialogue">("hallway");
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const playerName = profile?.display_name || "محلل";
  const g = (profile?.gender || "male") as "male" | "female";
  const tier = getPerformanceTier();
  const correct = isFramingCorrect();

  // Performance-based lighting overlay
  const getLightingOverlay = () => {
    if (tier === "exceptional") return "bg-amber-900/20";
    if (tier === "beginner") return "bg-blue-900/20";
    return "";
  };

  const getDialogues = () => {
    if (tier === "exceptional") {
      return [
        {
          characterId: "mansour",
          text: `${gText("أهلاً يا", "أهلاً يا", g)} ${playerName}! أبو سعيد اتصل بيا وقالي إنه مبسوط جداً من التحليل.`,
          mood: "happy" as const,
        },
        {
          characterId: "mansour",
          text: `${gText("ممتاز", "ممتازة", g)} يا ${playerName}! التحليل ده قوي جداً. ${gText("فكّكت", "فكّكتي", g)} المشكلة بمنهجية و${gText("فصلت", "فصلتي", g)} بين الإحساس والواقع. ده بالظبط اللي بنتوقعه من محلل بيناكل.`,
          mood: "happy" as const,
        },
        {
          characterId: "mansour",
          text: `كمّل كده يا ${playerName}. العميل اتطمّن إننا فاهمين مشكلته… وده أهم حاجة في شغلنا. 🏆`,
          mood: "happy" as const,
        },
      ];
    }

    if (tier === "promising") {
      return [
        {
          characterId: "mansour",
          text: `أهلاً يا ${playerName}. تعالى نتكلم عن الزيارة.`,
          mood: "neutral" as const,
        },
        {
          characterId: "mansour",
          text: `شغل كويس بس ممكن ${gText("تكون أعمق", "تكوني أعمق", g)} شوية. ${correct ? "التأطير كان صح وده ممتاز." : "التأطير محتاج يتظبط أكتر."} المرة الجاية ${gText("ركّز", "ركّزي", g)} أكتر على تفكيك المشكلة خطوة خطوة.`,
          mood: "neutral" as const,
        },
        {
          characterId: "mansour",
          text: `${gText("أنت عندك", "أنتِ عندك", g)} أساس كويس. بس لازم نوصل لمستوى إن العميل يحس إننا فهمنا المشكلة أعمق منه.`,
          mood: "neutral" as const,
        },
      ];
    }

    return [
      {
        characterId: "mansour",
        text: `يا ${playerName}… تعالى ${gText("اقعد", "اقعدي", g)}.`,
        mood: "neutral" as const,
      },
      {
        characterId: "mansour",
        text: `بص يا ${playerName}… أنا حاسس إنك ${gText("استعجلت", "استعجلتي", g)} شوية. العميل مش مقتنع تماماً وده بيأثر على سمعة الشركة. ${gText("خد", "خدي", g)} وقتك المرة الجاية و${gText("فكّك", "فكّكي", g)} المشكلة قبل ما ${gText("تقفز", "تقفزي", g)} لحلول.`,
        mood: "angry" as const,
      },
      {
        characterId: "mansour",
        text: `مش مشكلة… كلنا بنتعلم. بس لازم ${gText("ترجع", "ترجعي", g)} ${gText("تذاكر", "تذاكري", g)} كويس و${gText("تجرب", "تجربي", g)} تاني. الأسئلة القوية هي اللي بتفرق.`,
        mood: "neutral" as const,
      },
    ];
  };

  // Phase: Walking through hallway back to office
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
            className="space-y-3"
          >
            <p className="text-muted-foreground text-sm tracking-widest">🏢 الطابق 12</p>
            <h2 className="text-foreground text-lg font-bold" dir="rtl">
              رجعت المكتب — منصور مستنيك
            </h2>
            <motion.p
              className="text-muted-foreground text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              dir="rtl"
            >
              وقت التقييم...
            </motion.p>
          </motion.div>

          <motion.button
            onClick={() => {
              try { playSound("door"); } catch {}
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

  // Dialogue — starts directly with mansour-desk + performance lighting
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

      {/* Confetti for exceptional */}
      {tier === "exceptional" && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ["#FFD700", "#FF6B6B", "#4CAF50", "#2196F3", "#FF9800"][i % 5],
              }}
              initial={{ top: "-5%", opacity: 1, rotate: 0 }}
              animate={{
                top: "110%",
                opacity: [1, 1, 0],
                rotate: Math.random() * 720,
                x: [0, (Math.random() - 0.5) * 80],
              }}
              transition={{
                duration: 2.5 + Math.random() * 2,
                delay: 1 + Math.random() * 2,
                repeat: Infinity,
                repeatDelay: Math.random() * 4,
              }}
            />
          ))}
        </div>
      )}

      <EnhancedDialogue
        dialogues={getDialogues()}
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