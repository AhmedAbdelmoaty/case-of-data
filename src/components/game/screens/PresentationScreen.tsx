import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePFGame } from "@/contexts/PFGameContext";
import { useAuth } from "@/contexts/AuthContext";
import { EnhancedDialogue } from "../EnhancedDialogue";
import storeInsideImg from "@/assets/scenes/store-inside.png";
import storeCounterImg from "@/assets/scenes/store-counter.png";

interface PresentationScreenProps {
  onComplete: () => void;
}

// Custom dialogue scripts per framing choice — proper address form to Abu Saeed
const PRESENTATION_SCRIPTS: Record<string, Array<{ characterId: string; text: string; mood: "neutral" | "happy" | "suspicious" | "angry" | "nervous" }>> = {
  // F1 — Correct: conversion problem
  F1: [
    {
      characterId: "detective",
      text: "أبو سعيد… بعد الأسئلة اللي سألتها والكلام اللي قولتهولي، أنا شايف إن المتجر عندك مش عنده مشكلة إقبال. الناس بتدخل وبتتفرج وبتهتم فعلاً. المشكلة الأقرب إن الاهتمام ده — خصوصاً في قسم الحريمي عندكم — مش بيتحول لشراء فعلي بالنسبة المتوقعة. يعني الزبونة بتدخل، بتقيس، بتجرب… وبتمشي من غير ما تشتري.",
      mood: "neutral",
    },
    {
      characterId: "abuSaeed",
      text: "والله فعلاً… أنا ما كنتش واخد بالي من ده بالشكل ده. فعلاً القسم شكله مليان بس مش كل اللي بيدخل بيشتري… يعني الحركة مش معناها بيع.",
      mood: "happy",
    },
    {
      characterId: "abuSaeed",
      text: "أنا كنت حاسس إن المحل كله فيه مشكلة… بس أنت خلّيتني أشوف إن الموضوع أضيق من كده وأوضح. شكراً يا أستاذ… فعلاً فرق معايا.",
      mood: "happy",
    },
  ],

  // F2 — Wrong: competition
  F2: [
    {
      characterId: "detective",
      text: "أبو سعيد… بعد ما سمعت كل الكلام، أنا شايف إن المبيعات عندكم قلّت بسبب المنافسة من المحل اللي جنبكم. هم بيعملوا عروض قوية وبيسحبوا الزباين منكم. الناس بتيجي عندكم تتفرج بس بتروح تشتري من عندهم بسبب الأسعار الأحسن.",
      mood: "neutral",
    },
    {
      characterId: "abuSaeed",
      text: "مش عارف يا أستاذ… أنا مش حاسس إن ده اللي بيحصل بالظبط. يعني الناس بتدخل عندي وبتهتم وبتقيس… لو كانوا بيروحوا للمنافس مش هيدخلوا عندي أصلاً. المنطق مش ماشي.",
      mood: "suspicious",
    },
    {
      characterId: "abuSaeed",
      text: "يعني أنا مقدّر مجهودك… بس كنت متوقع الصورة تكون أوضح شوية. مش مشكلة… خلينا نشوف.",
      mood: "neutral",
    },
  ],

  // F3 — Wrong: market recession
  F3: [
    {
      characterId: "detective",
      text: "أبو سعيد… من اللي شفته، أنا شايف إن السوق بشكل عام في فترة ركود دلوقتي. الطلب على الملابس ضعيف في الوقت ده من السنة، ومش بس عندكم — كل المحلات بتعاني. الناس بتيجي تتفسح وتتفرج بس مش بتشتري بجدية.",
      mood: "neutral",
    },
    {
      characterId: "abuSaeed",
      text: "بس يا أستاذ… نفس الوقت ده السنة اللي فاتت كان أحسن بكتير عندي. والناس مش بتتفسح — لا دي بتدخل وبتقيس وبتجرب فعلاً. مش حاسس إن الموضوع سوق.",
      mood: "suspicious",
    },
    {
      characterId: "abuSaeed",
      text: "يعني التفسير ده ممكن يكون جزء من الموضوع… بس مش حاسس إنه الصورة الكاملة. كنت متأمل في تحليل أعمق شوية بصراحة.",
      mood: "neutral",
    },
  ],

  // F4 — Wrong: employees
  F4: [
    {
      characterId: "detective",
      text: "أبو سعيد… بعد التحليل، أنا شايف إن المشكلة عندكم في الموظفين. الناس بتدخل وبتهتم بس الموظفين مش بيعرفوا يساعدوا الزبون ياخد قرار الشراء، فالزبون بيمشي من غير ما ياخد حاجة.",
      mood: "neutral",
    },
    {
      characterId: "abuSaeed",
      text: "لا يا أستاذ… أنا مش موافق على الكلام ده. خالد مدير الصالة معايا من سنين والناس بتحبه. مفيش شكاوى أبداً. مش عارف إزاي وصلت للنتيجة دي.",
      mood: "angry",
    },
    {
      characterId: "abuSaeed",
      text: "يعني أنا مقدّر إنك جيت وسألت… بس حاسس إن التحليل لسه محتاج شغل أكتر. مش مشكلة… خلينا نشوف.",
      mood: "neutral",
    },
  ],
};

export const PresentationScreen = ({ onComplete }: PresentationScreenProps) => {
  const { state, isFramingCorrect } = usePFGame();
  const { profile } = useAuth();
  const [phase, setPhase] = useState<"establishing" | "dialogue">("establishing");
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const playerName = profile?.display_name || "محلل";
  const g = (profile?.gender || "male") as "male" | "female";
  const chosenId = state.chosenFramingId || "F1";

  const dialogues = PRESENTATION_SCRIPTS[chosenId] || PRESENTATION_SCRIPTS.F1;

  // Alternate camera angles
  const getBackgroundForLine = (idx: number) => {
    if (idx === 0) return storeInsideImg;
    return storeCounterImg;
  };

  const currentBg = phase === "dialogue" ? getBackgroundForLine(dialogueIndex) : storeInsideImg;

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
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBg}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <img src={currentBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </motion.div>
      </AnimatePresence>

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