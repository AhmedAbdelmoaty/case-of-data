import { useState } from "react";
import { motion } from "framer-motion";
import { usePFGame } from "@/contexts/PFGameContext";
import { useAuth } from "@/contexts/AuthContext";
import { FRAMING_OPTIONS } from "@/data/pf-scenario";
import { EnhancedDialogue } from "../EnhancedDialogue";
import storeInsideImg from "@/assets/scenes/store-inside.png";

interface PresentationScreenProps {
  onComplete: () => void;
}

export const PresentationScreen = ({ onComplete }: PresentationScreenProps) => {
  const { state, isFramingCorrect } = usePFGame();
  const { profile } = useAuth();
  const [phase, setPhase] = useState<"establishing" | "dialogue">("establishing");
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const playerName = profile?.display_name || "محلل";
  const g = (profile?.gender || "male") as "male" | "female";
  const correct = isFramingCorrect();
  const chosenFraming = FRAMING_OPTIONS.find((f) => f.id === state.chosenFramingId);

  const dialogues = correct
    ? [
        {
          characterId: "detective",
          text: `أبو سعيد… بعد الأسئلة اللي سألتها، أنا شايف إن المتجر مش عنده مشكلة إقبال. الناس بتدخل وبتهتم. المشكلة الأقرب إن الاهتمام ده مش بيتحول لشراء فعلي بالنسبة المتوقعة.`,
          mood: "neutral" as const,
        },
        {
          characterId: "abuSaeed",
          text: "والله فعلاً… أنا ما كنتش واخد بالي من ده بالشكل ده. فعلاً القسم شكله مليان بس مش كل اللي بيدخل بيشتري… يعني الحركة مش معناها بيع.",
          mood: "happy" as const,
        },
        {
          characterId: "abuSaeed",
          text: "أنا كنت حاسس إن المحل كله فيه مشكلة… بس أنت خلّيتني أشوف إن الموضوع أضيق من كده. شكراً يا أستاذ… فعلاً فرق معايا.",
          mood: "happy" as const,
        },
      ]
    : [
        {
          characterId: "detective",
          text: `أبو سعيد… بعد الأسئلة اللي سألتها، أنا شايف إن ${chosenFraming?.text?.slice(0, 80) || "المشكلة"}.`,
          mood: "neutral" as const,
        },
        {
          characterId: "abuSaeed",
          text: "مش عارف يا أستاذ… مش حاسس إن ده هو اللي بيحصل عندي بالظبط. يعني الكلام منطقي بس مش مطابق لإحساسي.",
          mood: "suspicious" as const,
        },
        {
          characterId: "abuSaeed",
          text: "يعني أنا مقدّر مجهودك… بس كنت متوقع الصورة تكون أوضح شوية. مش مشكلة… خلينا نشوف.",
          mood: "neutral" as const,
        },
      ];

  if (phase === "establishing") {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img src={storeInsideImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
        </motion.div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            <motion.p className="text-4xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: 1 }}>
              📋
            </motion.p>
            <h2 className="text-foreground text-lg font-bold" dir="rtl">
              وقت تقديم التقرير لأبو سعيد
            </h2>
            <p className="text-muted-foreground text-sm" dir="rtl">
              هتعرض عليه تحليلك وتشوف رأيه...
            </p>
          </motion.div>

          <motion.button
            onClick={() => setPhase("dialogue")}
            className="mt-8 px-8 py-3 rounded-xl bg-card/60 backdrop-blur-md border border-border text-foreground font-bold hover:bg-card/80 transition-all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            ابدأ العرض
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0">
        <img src={storeInsideImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

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
