import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { gText } from "@/lib/gText";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { Rocket, GraduationCap } from "lucide-react";
import analystImg from "@/assets/characters/analyst.png";
import saraImg from "@/assets/characters/sara.png";
import officeBriefingImg from "@/assets/scenes/office-briefing.png";

interface CompanyBriefingScreenProps {
  onComplete: () => void;
  isReviewMode?: boolean;
}

export const CompanyBriefingScreen = ({ onComplete, isReviewMode = false }: CompanyBriefingScreenProps) => {
  const { profile } = useAuth();
  const name = profile?.display_name || "محلل";
  const g = profile?.gender || "male";
  const [phase, setPhase] = useState<"establishing" | "dialogue" | "transition">(
    isReviewMode ? "dialogue" : "establishing"
  );

  const dialogues = [
    {
      characterId: "mansour",
      text: `أهلاً يا ${name}… ${gText("اتفضل اقعد", "اتفضلي اقعدي", g)}. ${gText("عامل", "عاملة", g)} إيه؟`,
      mood: "happy" as const,
    },
    {
      characterId: "detective",
      text: "الحمد لله يا أستاذ منصور، تمام.",
      mood: "happy" as const,
    },
    {
      characterId: "mansour",
      text: "عندنا مشروع جديد. وصلنا طلب استشارة من عميل اسمه أبو سعيد — عنده متجر ملابس في المنطقة التجارية اسمه Fashion House.",
      mood: "neutral" as const,
    },
    {
      characterId: "mansour",
      text: "الراجل ده شغال في المجال من أكتر من 12 سنة. عميل محترم ومحله ماشي كويس الحمد لله.",
      mood: "neutral" as const,
    },
    {
      characterId: "detective",
      text: "تمام. إيه الموضوع؟",
      mood: "neutral" as const,
    },
    {
      characterId: "mansour",
      text: "اتصل بينا وقال إن فيه حاجة غريبة بتحصل عنده. حاسس إن الدنيا ماشية والمحل فيه حركة… بس لما بييجي يحسب آخر الشهر بيلاقي الأرقام أقل من المتوقع.",
      mood: "neutral" as const,
    },
    {
      characterId: "mansour",
      text: `الراجل محتار. مش فاهم إيه اللي بيحصل. و${gText("عايزك تروح", "عايزك تروحي", g)} ${gText("تقعد", "تقعدي", g)} معاه و${gText("تفهم", "تفهمي", g)} الوضع.`,
      mood: "neutral" as const,
    },
    {
      characterId: "detective",
      text: `${gText("ماشي", "ماشي", g)} يا أستاذ منصور. ${gText("هروح أشوف", "هروح أشوف", g)} إيه الحكاية.`,
      mood: "neutral" as const,
    },
    {
      characterId: "mansour",
      text: `تمام. يلا بالتوفيق يا ${name}. أنا ${gText("مستنيك", "مستنياكي", g)}.`,
      mood: "happy" as const,
    },
  ];

  const handleDialogueComplete = () => {
    if (isReviewMode) {
      onComplete();
      return;
    }
    setPhase("transition");
  };

  // Establishing shot
  if (phase === "establishing") {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <img src={officeBriefingImg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/40" />
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
            onClick={() => setPhase("dialogue")}
            className="mt-10 px-8 py-3 rounded-xl bg-card/60 backdrop-blur-md border border-border text-foreground font-bold hover:bg-card/80 transition-all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            ادخل المكتب
          </motion.button>
        </div>
      </div>
    );
  }

  if (phase === "transition") {
    const avatarImg = g === "female" ? saraImg : analystImg;
    return (
      <div className="min-h-screen bg-background relative">
        <div className="absolute inset-0">
          <img src={officeBriefingImg} alt="" className="w-full h-full object-cover" />
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
                {gText(
                  "قدامك مهمة جديدة — عميل محتار ومش فاهم إيه اللي بيحصل في متجره. روح اسمع وافهم.",
                  "قدامك مهمة جديدة — عميل محتار ومش فاهم إيه اللي بيحصل في متجره. روحي اسمعي وافهمي.",
                  g
                )}
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
      <div className="absolute inset-0">
        <img src={officeBriefingImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

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
