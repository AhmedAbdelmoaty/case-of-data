// ════════════════════════════════════════════════════════════════════════════
// CompanyBriefingScreenV2 — لقاء منصور في المكتب — سيناريو "الموسم اللي ما جاش"
// ════════════════════════════════════════════════════════════════════════════
import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, GraduationCap, DoorOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { gText } from "@/lib/gText";
import { useSound } from "@/hooks/useSoundEffects";
import { EnhancedDialogue } from "../EnhancedDialogue";
import analystImg from "@/assets/characters/analyst.png";
import saraImg from "@/assets/characters/sara.png";
import officeHallwayImg from "@/assets/scenes/office-hallway.jpg";
import mansourDeskImg from "@/assets/scenes/mansour-desk.jpg";

interface Props {
  onComplete: () => void;
  isReviewMode?: boolean;
}

export const CompanyBriefingScreenV2 = ({ onComplete, isReviewMode = false }: Props) => {
  const { profile } = useAuth();
  const name = profile?.display_name || "محلل";
  const g = profile?.gender || "male";
  const { playSound, playDoorKnock } = useSound();
  const [phase, setPhase] = useState<"hallway" | "door-knock" | "dialogue" | "transition">(
    isReviewMode ? "dialogue" : "hallway"
  );

  const dialogues = [
    {
      characterId: "mansour",
      text: gText("أهلًا بيك، اتفضل اقعد. عندنا قضية محتاجة تتحرك بسرعة.", "أهلًا بيكي، اتفضلي اقعدي. عندنا قضية محتاجة تتحرك بسرعة.", g),
      mood: "neutral" as const,
    },
    {
      characterId: "detective",
      text: "تمام يا أستاذ منصور، أنا جاهز.",
      mood: "neutral" as const,
    },
    {
      characterId: "mansour",
      text: "العميل اسمه أبو سعيد. عنده متجر ملابس في المنصورة. عميل معانا من سنتين، اشتغلنا معاه قبل كده على تنظيم المخزون والشغل كان كويس.",
      mood: "neutral" as const,
    },
    {
      characterId: "mansour",
      text: "الراجل كلمني إمبارح متضايق. بيقول إن مبيعات الموسم ده نازلة 20% مقارنة بالموسم اللي فات.",
      mood: "nervous" as const,
    },
    {
      characterId: "mansour",
      text: "وعنده فكرة جاهزة في دماغه — عايز يعمل تخفيضات كبيرة عشان يرجّع المبيعات لمستواها.",
      mood: "neutral" as const,
    },
    {
      characterId: "detective",
      text: "يعني هو بياخد القرار قبل ما يفهم المشكلة؟",
      mood: "suspicious" as const,
    },
    {
      characterId: "mansour",
      text: gText(
        "بالظبط. وده اللي قلقني. أبو سعيد راجل طيب، بس لما بيقلق بياخد قرارات متسرعة. عايزك تروح المنصورة قبل ما يعمل أي تخفيضات.",
        "بالظبط. وده اللي قلقني. أبو سعيد راجل طيب، بس لما بيقلق بياخد قرارات متسرعة. عايزك تروحي المنصورة قبل ما يعمل أي تخفيضات.",
        g
      ),
      mood: "nervous" as const,
    },
    {
      characterId: "mansour",
      text: gText(
        "مهمتك مش تأكد كلامه ولا تعارضه — مهمتك تفهم الصورة كاملة. اسأل، فكّك، وبعدين قرر مع نفسك إيه المشكلة الحقيقية قبل ما تقترح أي حل.",
        "مهمتك مش تأكدي كلامه ولا تعارضيه — مهمتك تفهمي الصورة كاملة. اسألي، فكّكي، وبعدين قرّري مع نفسك إيه المشكلة الحقيقية قبل ما تقترحي أي حل.",
        g
      ),
      mood: "neutral" as const,
    },
    {
      characterId: "mansour",
      text: "هتلاقي في المتجر سلمى — المحاسبة بتاعتهم. هي اللي بتمسك الأرقام. اسألها زي ما تسأل أبو سعيد بالظبط.",
      mood: "happy" as const,
    },
    {
      characterId: "detective",
      text: gText("ماشي. هروح أشوف الصورة من كل الزوايا قبل ما أحكم.", "ماشي. هروح أشوف الصورة من كل الزوايا قبل ما أحكم.", g),
      mood: "neutral" as const,
    },
    {
      characterId: "mansour",
      text: gText("بالتوفيق. أنا مستنيك بالتأطير الكامل لما ترجع.", "بالتوفيق. أنا مستنيكي بالتأطير الكامل لما ترجعي.", g),
      mood: "happy" as const,
    },
  ];

  const handleDialogueComplete = () => {
    if (isReviewMode) { onComplete(); return; }
    setPhase("transition");
  };

  if (phase === "hallway") {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <motion.div className="absolute inset-0" initial={{ scale: 1.15, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 2 }}>
          <img src={officeHallwayImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        </motion.div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="space-y-3">
            <p className="text-muted-foreground text-sm tracking-widest uppercase">🏢 الطابق 12</p>
            <h1 className="text-accent font-bold text-2xl">Pinnacle Consulting</h1>
            <p className="text-muted-foreground text-sm">بيناكل للاستشارات</p>
          </motion.div>
          <motion.button
            onClick={() => { playDoorKnock(); setPhase("door-knock"); }}
            className="mt-10 px-8 py-3 rounded-xl bg-card/60 backdrop-blur-md border border-border text-foreground font-bold hover:bg-card/80 flex items-center gap-2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
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
        <motion.div className="absolute inset-0">
          <img src={officeHallwayImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
        </motion.div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
          <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.p className="text-4xl" animate={{ x: [0, -5, 5, -3, 3, 0] }} transition={{ duration: 0.4, delay: 0.3 }}>🚪</motion.p>
            <motion.p className="text-foreground text-lg font-bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} dir="rtl">طق طق طق...</motion.p>
            <motion.p className="text-accent text-base font-bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} dir="rtl">"اتفضل!"</motion.p>
            <motion.button
              onClick={() => { try { playSound("door"); } catch {} setPhase("dialogue"); }}
              className="mt-4 px-8 py-3 rounded-xl bg-card/60 backdrop-blur-md border border-border text-foreground font-bold hover:bg-card/80"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            >ادخل المكتب</motion.button>
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
          <motion.div className="max-w-md w-full text-center space-y-6" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <motion.div className="mx-auto w-28 h-28 rounded-full overflow-hidden border-4 border-accent glow-accent" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", damping: 12 }}>
              <img src={avatarImg} alt={name} className="w-full h-full object-cover" />
            </motion.div>
            <motion.div className="p-6 rounded-xl bg-card/80 backdrop-blur-md border border-border space-y-4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
              <GraduationCap className="w-8 h-8 text-accent mx-auto" />
              <p className="text-foreground text-lg font-bold leading-relaxed" dir="rtl">
                {gText(
                  "قدامك قضية: عميل قلقان ومتسرّع في قرار. روح اسمع، اسأل، وفكّك قبل ما تحكم.",
                  "قدامك قضية: عميل قلقان ومتسرّع في قرار. روحي اسمعي، اسألي، وفكّكي قبل ما تحكمي.",
                  g
                )}
              </p>
            </motion.div>
            <motion.button
              onClick={onComplete}
              className="relative px-8 py-4 rounded-xl text-lg font-bold overflow-hidden group w-full"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                <Rocket className="w-5 h-5" />
                يلا نروح المنصورة!
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <motion.div className="absolute inset-0" initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5 }}>
        <img src={mansourDeskImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </motion.div>
      <motion.div className="relative z-10 pt-12 pb-4 text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-muted-foreground text-sm">🏢 مكتب الشركة</p>
        <h2 className="text-accent font-bold text-lg">Pinnacle Consulting</h2>
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
