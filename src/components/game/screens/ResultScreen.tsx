import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  RotateCcw,
  Brain,
  Sparkles,
  Lightbulb,
  ChevronDown,
  Medal,
  Award,
  BookOpen,
  Star,
} from "lucide-react";
import { usePFGame } from "@/contexts/PFGameContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import analystImg from "@/assets/characters/analyst.png";
import saraImg from "@/assets/characters/sara.png";
import strongOutcomeImg from "@/assets/scenes/hisham-handing-report-male.webp";
import otherOutcomeImg from "@/assets/scenes/prism-building-exterior.webp";

interface ResultScreenProps {
  onNavigate: (screen: string) => void;
}

type Outcome = "strong" | "medium" | "weak";

const outcomeConfig: Record<Outcome, {
  title: string;
  subtitle: string;
  icon: typeof Trophy;
  stars: number;
  gradient: string;
  ring: string;
  panel: string;
  text: string;
  glow: string;
  rank: string;
}> = {
  strong: {
    title: "محلل استثنائي",
    subtitle: "مسكت لبّ المشكلة قبل ما تقفز لأي حل",
    icon: Trophy,
    stars: 3,
    gradient: "from-amber-300 via-yellow-400 to-amber-600",
    ring: "border-amber-400/60 shadow-[0_0_40px_rgba(251,191,36,0.35)]",
    panel: "bg-gradient-to-br from-amber-500/15 to-yellow-600/10 border-amber-500/40",
    text: "text-amber-300",
    glow: "shadow-amber-500/40",
    rank: "ذهبي",
  },
  medium: {
    title: "أداء جيد",
    subtitle: "مشيت في الاتجاه الصح بس محتاج حسم أكتر",
    icon: Medal,
    stars: 2,
    gradient: "from-slate-200 via-slate-300 to-slate-500",
    ring: "border-slate-300/50 shadow-[0_0_30px_rgba(203,213,225,0.2)]",
    panel: "bg-gradient-to-br from-slate-400/15 to-slate-600/10 border-slate-300/35",
    text: "text-slate-200",
    glow: "shadow-slate-400/30",
    rank: "فضي",
  },
  weak: {
    title: "محتاج تراجع",
    subtitle: "قفزت على الحل قبل ما تتأكد من المشكلة",
    icon: BookOpen,
    stars: 1,
    gradient: "from-orange-400 via-amber-600 to-orange-700",
    ring: "border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.25)]",
    panel: "bg-gradient-to-br from-orange-500/15 to-amber-700/10 border-orange-500/35",
    text: "text-orange-200",
    glow: "shadow-orange-500/30",
    rank: "برونزي",
  },
};

const lessonsByOutcome: Record<Outcome, { title: string; body: string }[]> = {
  strong: [
    {
      title: "اللي عملته صح",
      body: "وقفت قبل ما تقفز للحل، وسألت أسئلة بتثبت أصل المشكلة قبل ما تفسّرها.",
    },
    {
      title: "قاعدة Problem Framing",
      body: "أي رقم لازم يتقارن بمرجع صح. لو المرجع غلط، التفسير كله بيقع.",
    },
    {
      title: "خطوتك الجاية",
      body: "كمل على نفس المنهج: اثبت → قارن → فسّر → قرّر. ده اللي بيفرّق المحلل المحترف.",
    },
  ],
  medium: [
    {
      title: "اللي فاتك",
      body: "شفت إن المقارنة فيها مشكلة، بس ما حسمتش إن العميل ماشي على مرجع غلط أصلًا.",
    },
    {
      title: "الدرس الأساسي",
      body: "Problem Framing مش بس فهم — ده توصيل واضح وحاسم يخلي العميل يغيّر اتجاهه.",
    },
    {
      title: "تمرين للمرة الجاية",
      body: "اسأل نفسك: 'هل المقارنة عادلة؟' قبل ما تبدأ تفسّر أي فرق في الأرقام.",
    },
  ],
  weak: [
    {
      title: "الفخ اللي وقعت فيه",
      body: "أخدت كلام العميل على إنه الحقيقة، وبدأت تدوّر على حل لمشكلة مش مثبتة أصلًا.",
    },
    {
      title: "قاعدة ذهبية",
      body: "لما العميل يقولك 'عندي مشكلة'، اسأل: 'مقارنة بإيه؟ ومين قال إنها مشكلة؟' قبل أي حاجة.",
    },
    {
      title: "ابدأ من الأول",
      body: "اثبت وجود المشكلة → حدّد المرجع الصح → قارن → بعدين فسّر. متعكسش الترتيب.",
    },
  ],
};

export const ResultScreen = ({ onNavigate }: ResultScreenProps) => {
  const { state } = usePFGame();
  const { profile } = useAuth();
  const [notesOpen, setNotesOpen] = useState(false);

  const playerName = profile?.first_name || profile?.display_name || "محلل";
  const g = profile?.gender || "male";
  const avatarImg = g === "female" ? saraImg : analystImg;

  const recordedRef = useRef(false);
  useEffect(() => {
    if (recordedRef.current) return;
    if (!profile?.first_name || !profile?.last_name) return;
    const key = "pf-game-submitted";
    if (localStorage.getItem(key)) return;
    recordedRef.current = true;
    localStorage.setItem(key, "1");
    supabase
      .from("completed_players")
      .insert({ first_name: profile.first_name, last_name: profile.last_name })
      .then(({ error }) => {
        if (error) {
          localStorage.removeItem(key);
          console.warn("Failed to record completion:", error.message);
        }
      });
  }, [profile?.first_name, profile?.last_name]);

  const outcome: Outcome = state.outcome || "medium";
  const config = outcomeConfig[outcome];
  const Icon = config.icon;
  const lessons = lessonsByOutcome[outcome];

  const isStrong = outcome === "strong";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden" dir="rtl">
      {/* Background */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <img
          src={isStrong ? strongOutcomeImg : otherOutcomeImg}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      </motion.div>

      {/* Confetti / Sparkles for strong */}
      {isStrong && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-amber-300"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
              }}
              animate={{
                y: ["0vh", "110vh"],
                opacity: [1, 1, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                delay: Math.random() * 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-md">
        {/* Hero Trophy/Medal */}
        <motion.div
          className="flex flex-col items-center mb-6"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            className={cn(
              "relative w-28 h-28 rounded-full flex items-center justify-center bg-gradient-to-br border-4",
              `bg-gradient-to-br ${config.gradient}`,
              config.ring
            )}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, delay: 0.2 }}
          >
            <Icon className="w-14 h-14 text-background drop-shadow-lg" strokeWidth={2.5} />
            {isStrong && (
              <motion.div
                className="absolute -inset-2 rounded-full border-2 border-amber-300/50"
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>

          {/* Stars */}
          <motion.div
            className="flex gap-1.5 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.7 + i * 0.15, type: "spring" }}
              >
                <Star
                  className={cn(
                    "w-7 h-7",
                    i <= config.stars
                      ? `fill-current ${config.text} drop-shadow-md`
                      : "text-muted/40"
                  )}
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <span
              className={cn(
                "inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 bg-gradient-to-r text-background",
                config.gradient
              )}
            >
              التقييم: {config.rank}
            </span>
            <h1
              className={cn(
                "text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r",
                config.gradient
              )}
            >
              {config.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed px-4">
              {config.subtitle}
            </p>
          </motion.div>
        </motion.div>

        {/* Player chip */}
        <motion.div
          className="flex items-center justify-center gap-2.5 mb-5 px-3 py-2 rounded-full bg-card/60 backdrop-blur-sm border border-border w-fit mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-border">
            <img src={avatarImg} alt={playerName} className="w-full h-full object-cover" />
          </div>
          <span className="text-sm font-medium text-foreground">{playerName}</span>
        </motion.div>

        {/* Educational Feedback Card */}
        <motion.div
          className={cn(
            "rounded-2xl p-5 border backdrop-blur-sm mb-4",
            config.panel
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className={cn("w-5 h-5", config.text)} />
            <h2 className="text-base font-bold text-foreground">
              تغذية راجعة تعليمية
            </h2>
          </div>

          <div className="space-y-3.5">
            {lessons.map((lesson, i) => (
              <motion.div
                key={i}
                className="flex gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 + i * 0.1 }}
              >
                <div
                  className={cn(
                    "shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br text-background",
                    config.gradient
                  )}
                >
                  {i + 1}
                </div>
                <div className="flex-1 pt-0.5">
                  <h3 className={cn("text-sm font-bold mb-1", config.text)}>
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {lesson.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Collapsible Notes */}
        {state.notes.length > 0 && (
          <motion.div
            className="rounded-2xl bg-card/55 backdrop-blur-sm border border-border mb-4 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
          >
            <button
              onClick={() => setNotesOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-foreground">
                  ملاحظاتك أثناء التحقيق
                </span>
                <span className="text-xs text-muted-foreground">
                  ({state.notes.length})
                </span>
              </div>
              <motion.div animate={{ rotate: notesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {notesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-1 space-y-2">
                    {state.notes.map((note, i) => (
                      <motion.div
                        key={note.roundId}
                        className="p-3 rounded-lg bg-background/40 border border-border"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <p className="text-xs text-foreground leading-relaxed">
                          {note.text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Action button */}
        <motion.button
          onClick={() => onNavigate("company-briefing")}
          className={cn(
            "w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold bg-gradient-to-r text-background shadow-lg",
            config.gradient,
            config.glow
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
        >
          <RotateCcw className="w-5 h-5" />
          العب مرة أخرى
        </motion.button>

        <motion.p
          className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
        >
          <Sparkles className="w-3 h-3" />
          كل لعبة فرصة جديدة تحسّن تفكيرك التحليلي
        </motion.p>
      </div>
    </div>
  );
};
