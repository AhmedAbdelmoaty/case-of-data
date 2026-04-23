import { useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, RotateCcw, AlertTriangle, Brain, Target, NotebookPen, CheckCircle } from "lucide-react";
import { usePFGame } from "@/contexts/PFGameContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import analystImg from "@/assets/characters/analyst.png";
import saraImg from "@/assets/characters/sara.png";
import strongOutcomeImg from "@/assets/scenes/hisham-receiving-report-male.webp";
import otherOutcomeImg from "@/assets/scenes/prism-building-exterior.webp";

interface ResultScreenProps {
  onNavigate: (screen: string) => void;
}

const outcomeConfig = {
  strong: {
    title: "تأطير قوي جدًا",
    subtitle: "مسكت لبّ المشكلة ووقفت قبل الحل في الوقت الصح",
    badge: "🏆",
    gradient: "from-yellow-400 to-amber-600",
    ring: "border-amber-400/50 shadow-amber-500/20",
    panel: "bg-amber-500/10 border-amber-500/30",
    text: "text-amber-300",
  },
  medium: {
    title: "فهم جيد... لكن لسه محتاج حسم أكتر",
    subtitle: "اتحركت في الاتجاه الصح، لكن التأطير كان محتاج وضوح أعلى",
    badge: "🥈",
    gradient: "from-slate-300 to-slate-500",
    ring: "border-slate-400/40 shadow-slate-400/15",
    panel: "bg-slate-500/10 border-slate-400/25",
    text: "text-slate-200",
  },
  weak: {
    title: "المشكلة ما اتمسكتش صح",
    subtitle: "وصلت لتفسير قبل ما تثبت أصل المشكلة ومرجع المقارنة",
    badge: "⚠️",
    gradient: "from-amber-700 to-orange-800",
    ring: "border-orange-500/40 shadow-orange-500/15",
    panel: "bg-orange-500/10 border-orange-500/25",
    text: "text-orange-200",
  },
};

export const ResultScreen = ({ onNavigate }: ResultScreenProps) => {
  const { state } = usePFGame();
  const { profile } = useAuth();

  const playerName = profile?.display_name || "محلل";
  const g = profile?.gender || "male";
  const avatarImg = g === "female" ? saraImg : analystImg;

  const outcome = state.outcome || "medium";
  const config = outcomeConfig[outcome];

  const trackLabel = useMemo(() => {
    if (!state.trackEntered) return "مسار نظيف — مشيت على الـ spine للنهاية";
    return `دخلت في مسار ${state.trackEntered} ووصلت لنهايته`;
  }, [state.trackEntered]);

  const summary = [
    { label: "عدد الأسئلة", value: `${state.questionsUsed} / 5`, icon: <Target className="w-4 h-4" /> },
    { label: "الملاحظات المحفوظة", value: `${state.savedNoteIds.length}`, icon: <NotebookPen className="w-4 h-4" /> },
    { label: "صحة التأطير", value: `${state.framingCorrectCount} / 3`, icon: <Brain className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <motion.div className="absolute inset-0" initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.5 }}>
        <img src={outcome === "strong" ? strongOutcomeImg : otherOutcomeImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-xl">
        <motion.div
          className={cn("p-5 rounded-2xl bg-card/75 backdrop-blur-sm border shadow-xl mb-5", config.ring)}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-4 mb-4" dir="rtl">
            <motion.div
              className={cn("relative w-20 h-20 rounded-full overflow-hidden border-4 bg-background/40", config.ring)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10 }}
            >
              <img src={avatarImg} alt={playerName} className="w-full h-full object-cover" />
            </motion.div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{playerName}</h2>
              <p className={cn("text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r", config.gradient)}>
                {config.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{config.subtitle}</p>
            </div>
            <div className="text-4xl">{config.badge}</div>
          </div>

          {state.restartCount > 0 && (
            <div className="mb-3 flex justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/60 border border-border text-xs text-muted-foreground" dir="rtl">
                <RotateCcw className="w-3 h-3" />
                أعاد المحادثة مرة
              </span>
            </div>
          )}

          <div className={cn("p-4 rounded-xl border text-center", config.panel)}>
            <div className="flex items-center justify-center gap-2 mb-2">
              {outcome === "weak" ? <AlertTriangle className="w-5 h-5 text-orange-300" /> : <Trophy className="w-5 h-5 text-amber-300" />}
              <span className={cn("font-bold text-sm", config.text)}>
                النتيجة النهائية: {outcome === "strong" ? "قوية" : outcome === "weak" ? "ضعيفة" : "متوسطة"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed" dir="rtl">{trackLabel}</p>
          </div>
        </motion.div>

        <motion.div className="grid grid-cols-2 gap-3 mb-5" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          {summary.map((item, i) => (
            <motion.div
              key={item.label}
              className="p-3 rounded-xl bg-card/55 backdrop-blur-sm border border-border"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-primary">{item.icon}</span>
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
              <p className="text-sm font-bold text-foreground" dir="rtl">{item.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {state.notes.length > 0 && (
          <motion.div
            className="p-4 rounded-xl bg-card/50 border border-border mb-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42 }}
          >
            <h3 className="text-sm font-bold text-foreground mb-3" dir="rtl">الملاحظات اللي حفظتها</h3>
            <div className="space-y-2" dir="rtl">
              {state.notes.map((note) => (
                <div key={note.roundId} className="p-3 rounded-lg bg-background/35 border border-border">
                  <p className="text-sm text-foreground leading-relaxed">{note.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.button
          onClick={() => onNavigate("company-briefing")}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58 }}
        >
          <RotateCcw className="w-5 h-5" />
          العب مرة أخرى
        </motion.button>
      </div>
    </div>
  );
};
