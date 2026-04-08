import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { gText } from "@/lib/gText";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { Rocket, Target, GraduationCap } from "lucide-react";
import analystImg from "@/assets/characters/analyst.png";
import saraImg from "@/assets/characters/sara.png";

interface CompanyBriefingScreenProps {
  onComplete: () => void;
  isReviewMode?: boolean;
}

export const CompanyBriefingScreen = ({ onComplete, isReviewMode = false }: CompanyBriefingScreenProps) => {
  const { profile } = useAuth();
  const name = profile?.display_name || "محلل";
  const g = profile?.gender || "male";
  const [phase, setPhase] = useState<"dialogue" | "transition">("dialogue");

  const dialogues = [
    {
      characterId: "mansour",
      text: `أهلاً يا ${name}… ${gText("اتفضل اقعد", "اتفضلي اقعدي", g)}. ${gText("عامل", "عاملة", g)} إيه؟`,
      mood: "happy" as const,
    },
    {
      characterId: "detective",
      text: `الحمد لله يا أستاذ منصور، تمام.`,
      mood: "happy" as const,
    },
    {
      characterId: "mansour",
      text: `اليوم عندنا موضوع مهم. وصلنا طلب استشارة جديد، وأنا ${gText("شايفك الشخص المناسب ليه", "شايفك الشخص المناسب ليه", g)}.`,
      mood: "neutral" as const,
    },
    {
      characterId: "detective",
      text: `تحت أمرك يا أستاذ منصور. إيه التفاصيل؟`,
      mood: "neutral" as const,
    },
    {
      characterId: "mansour",
      text: "الطلب من متجر اسمه Fashion House — متجر ملابس في منطقة تجارية. صاحبه — أبو سعيد — راجل شغال من سنين في المجال.",
      mood: "neutral" as const,
    },
    {
      characterId: "mansour",
      text: "أبو سعيد بيقول إن المبيعات عنده نزلت الفترة الأخيرة، ومش فاهم السبب. حاسس إن فيه حاجة غلط بس مش قادر يحددها.",
      mood: "neutral" as const,
    },
    {
      characterId: "detective",
      text: gText("فاهم. يعني المطلوب أحلل الموقف وأوصل للسبب؟", "فاهمة. يعني المطلوب أحلل الموقف وأوصل للسبب؟", g),
      mood: "neutral" as const,
    },
    {
      characterId: "mansour",
      text: `بالظبط. المطلوب ${gText("تروح", "تروحي", g)} المتجر، ${gText("تقابل", "تقابلي", g)} أبو سعيد، ${gText("تسمع", "تسمعي", g)} منه، و${gText("تحلل", "تحللي", g)} الموقف. ${gText("شوف", "شوفي", g)} البيانات، ${gText("اتكلم", "اتكلمي", g)} مع الموظفين، و${gText("حاول توصل", "حاولي توصلي", g)} للسبب الحقيقي.`,
      mood: "neutral" as const,
    },
    {
      characterId: "mansour",
      text: `أبو سعيد راجل محترم وبيثق فينا. ${gText("فخلّي شغلك يعكس", "فخلّي شغلك يعكس", g)} مستوى الشركة.`,
      mood: "neutral" as const,
    },
    {
      characterId: "detective",
      text: gText("إن شاء الله يا أستاذ منصور. مش هخيب ظنك.", "إن شاء الله يا أستاذ منصور. مش هخيب ظنك.", g),
      mood: "happy" as const,
    },
    {
      characterId: "mansour",
      text: `يلا يا ${name}… بالتوفيق. أنا ${gText("مستنيك", "مستنياك", g)} بالنتيجة.`,
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

  if (phase === "transition") {
    const avatarImg = g === "female" ? saraImg : analystImg;
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
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
                `أنت خلّصت دبلومة IMP وفاهم عقلية المحلل ومنهجية التفكير الصح. دلوقتي جه وقت الاختبار الحقيقي — أثبت إنك قد المهمة.`,
                `أنتِ خلّصتي دبلومة IMP وفاهمة عقلية المحلل ومنهجية التفكير الصح. دلوقتي جه وقت الاختبار الحقيقي — أثبتي إنك قد المهمة.`,
                g
              )}
            </p>
            <p className="text-muted-foreground text-base leading-relaxed" dir="rtl">
              {gText(
                `قدامك قضية حقيقية — متجر بيخسر ومحتاج حد يفهم ليه. استخدم كل اللي اتعلمته: حلل، اسأل الأسئلة الصح، واوصل للسبب الحقيقي.`,
                `قدامك قضية حقيقية — متجر بيخسر ومحتاج حد يفهم ليه. استخدمي كل اللي اتعلمتيه: حللي، اسألي الأسئلة الصح، واوصلي للسبب الحقيقي.`,
                g
              )}
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <Target className="w-4 h-4 text-primary" />
              <p className="text-primary font-bold text-sm" dir="rtl">
                وقت التطبيق. القضية الأولى بتبدأ دلوقتي. 🚀
              </p>
            </div>
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
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-background to-background" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

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
