import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Brain,
  Target,
  NotebookPen,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { usePFGame } from "@/contexts/PFGameContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import analystImg from "@/assets/characters/analyst.png";
import saraImg from "@/assets/characters/sara.png";
import storeCounterImg from "@/assets/scenes/store-counter.png";
import officeHallwayImg from "@/assets/scenes/office-hallway.jpg";

interface ResultScreenProps {
  onNavigate: (screen: string) => void;
}

type SummaryItem = {
  label: string;
  value: string;
  icon: React.ReactNode;
};

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
    subtitle: "اتحركت في الاتجاه الصح، لكن framingك كان محتاج وضوح وربط أقوى",
    badge: "🥈",
    gradient: "from-slate-300 to-slate-500",
    ring: "border-slate-400/40 shadow-slate-400/15",
    panel: "bg-slate-500/10 border-slate-400/25",
    text: "text-slate-200",
  },
  weak: {
    title: "المشكلة ما اتمسكتش صح",
    subtitle: "وصلت لحل أو تفسير قبل ما تثبت أصل المشكلة ومرجع المقارنة",
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

  const [showDetails, setShowDetails] = useState(false);
  const [animatedQuestions, setAnimatedQuestions] = useState(0);

  const playerName = profile?.display_name || "محلل";
  const g = profile?.gender || "male";
  const avatarImg = g === "female" ? saraImg : analystImg;

  const outcome = state.finalOutcome || "medium";
  const framingQuality = state.framingQuality || "medium";
  const config = outcomeConfig[outcome];

  useEffect(() => {
    let frame = 0;
    const target = state.totalQuestionsAsked;
    const interval = setInterval(() => {
      frame += 1;
      setAnimatedQuestions((prev) => {
        if (prev >= target) {
          clearInterval(interval);
          return target;
        }
        return Math.min(target, prev + 1);
      });
    }, 80);

    return () => clearInterval(interval);
  }, [state.totalQuestionsAsked]);

  const notesCount = state.savedNoteIds.length;

  const framingCompletion = useMemo(() => {
    const parts = [
      !!state.framingPart1,
      !!state.framingPart2,
      !!state.framingPart3,
      !!state.framingPart4,
    ].filter(Boolean).length;

    return `${parts}/4`;
  }, [state.framingPart1, state.framingPart2, state.framingPart3, state.framingPart4]);

  const trustLabel =
    state.trustLevel >= 8
      ? "ثقة قوية"
      : state.trustLevel >= 6
      ? "ثقة جيدة"
      : state.trustLevel >= 4
      ? "ثقة متوسطة"
      : "ثقة ضعيفة";

  const inquiryLabel =
    state.recoveryUsed === 0
      ? "مسار نظيف"
      : state.recoveryUsed === 1
      ? "مسار جيد مع تصحيح واحد"
      : "المسار احتاج أكثر من تصحيح";

  const topSummary: SummaryItem[] = [
    {
      label: "عدد الأسئلة",
      value: `${animatedQuestions}`,
      icon: <Target className="w-4 h-4" />,
    },
    {
      label: "عدد الملاحظات المحفوظة",
      value: `${notesCount}`,
      icon: <NotebookPen className="w-4 h-4" />,
    },
    {
      label: "جودة الـframing",
      value: framingQuality === "strong" ? "قوية" : framingQuality === "weak" ? "ضعيفة" : "متوسطة",
      icon: <Brain className="w-4 h-4" />,
    },
    {
      label: "الثقة",
      value: trustLabel,
      icon: <Sparkles className="w-4 h-4" />,
    },
  ];

  const notesByType = useMemo(() => {
    const grouped = new Map<string, number>();

    for (const note of state.notes) {
      const key = note.type || "other";
      grouped.set(key, (grouped.get(key) || 0) + 1);
    }

    return Array.from(grouped.entries());
  }, [state.notes]);

  const highlightedStrengths = useMemo(() => {
    if (outcome === "strong") {
      return [
        "ما بلعتش تعريف العميل للمشكلة زي ما هو.",
        "فصلت بين المشكلة اللي شايفها أبو سعيد والحل اللي كان ناوي عليه.",
        "راجعت baseline قبل ما تقفز لتفسير أو قرار.",
      ];
    }

    if (outcome === "medium") {
      return [
        "بدأت تشك في المقارنة ودي خطوة مهمة.",
        "فيه فهم حقيقي ظهر في النص، لكن الـframing النهائية كانت محتاجة حسم أوضح.",
        "فيه أساس جيد، لكن لسه محتاج discipline أقوى في ترتيب الأسئلة.",
      ];
    }

    return [
      "أسرعت تجاه التفسير أو الحل قبل ما تثبت أصل المشكلة.",
      "ما استخدمتش baseline بالشكل الكافي لتعيد تعريف الموقف.",
      "النتيجة النهائية كانت أضعف من المعلومات اللي كان ممكن توصل لها.",
    ];
  }, [outcome]);

  const handleReplay = () => {
    onNavigate("company-briefing");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <img
          src={outcome === "strong" ? storeCounterImg : officeHallwayImg}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />
      </motion.div>

      {outcome === "strong" && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ["#FFD700", "#FFA000", "#FFF176", "#E53935", "#43A047"][i % 5],
              }}
              initial={{ top: "-5%", opacity: 1, rotate: 0 }}
              animate={{
                top: "110%",
                opacity: [1, 1, 0],
                rotate: Math.random() * 720,
                x: [0, (Math.random() - 0.5) * 90],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatDelay: Math.random() * 3,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-xl">
        <motion.div
          className={cn(
            "p-5 rounded-2xl bg-card/75 backdrop-blur-sm border shadow-xl mb-5",
            config.ring
          )}
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-4 mb-4" dir="rtl">
            <motion.div
              className={cn(
                "relative w-20 h-20 rounded-full overflow-hidden border-4 bg-background/40",
                config.ring
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10 }}
            >
              <img src={avatarImg} alt={playerName} className="w-full h-full object-cover" />
            </motion.div>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{playerName}</h2>
              <p
                className={cn(
                  "text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r",
                  config.gradient
                )}
              >
                {config.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{config.subtitle}</p>
            </div>

            <div className="text-4xl">{config.badge}</div>
          </div>

          <div className={cn("p-4 rounded-xl border text-center", config.panel)}>
            <div className="flex items-center justify-center gap-2 mb-2">
              {outcome === "weak" ? (
                <AlertTriangle className="w-5 h-5 text-orange-300" />
              ) : (
                <Trophy className="w-5 h-5 text-amber-300" />
              )}
              <span className={cn("font-bold text-sm", config.text)}>
                {outcome === "strong"
                  ? "النتيجة النهائية: قوية"
                  : outcome === "weak"
                  ? "النتيجة النهائية: ضعيفة"
                  : "النتيجة النهائية: متوسطة"}
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed" dir="rtl">
              {outcome === "strong"
                ? "قدّمت فهم واضح للمشكلة الحقيقية، وربطت بين baseline الخاطئة وخطر قرار الخصومات."
                : outcome === "weak"
                ? "النهاية وضحت إن المشكلة ما اتمسكتش بالشكل الكافي قبل ما يتم التفكير في الحل."
                : "فيه فهم حقيقي حصل، لكن لسه محتاج دقة أعلى في إعادة تعريف المشكلة وصياغة القرار التالي."}
            </p>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-3 mb-5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {topSummary.map((item, i) => (
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
              <p className="text-sm font-bold text-foreground" dir="rtl">
                {item.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="p-4 rounded-xl bg-card/50 border border-border mb-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center gap-2 mb-3" dir="rtl">
            <Brain className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">ملخص الأداء</h3>
          </div>

          <div className="space-y-2 text-sm text-foreground" dir="rtl">
            <p>
              <span className="text-muted-foreground">المسار:</span>{" "}
              <span className="font-bold">{inquiryLabel}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Recovery مستخدمة:</span>{" "}
              <span className="font-bold">{state.recoveryUsed} / 2</span>
            </p>
            <p>
              <span className="text-muted-foreground">الـFraming Builder:</span>{" "}
              <span className="font-bold">{framingCompletion}</span>
            </p>
            <p>
              <span className="text-muted-foreground">الأسئلة القوية / الجيدة / الضعيفة:</span>{" "}
              <span className="font-bold">
                {state.strongQuestionsCount} / {state.goodQuestionsCount} / {state.weakQuestionsCount}
              </span>
            </p>
          </div>
        </motion.div>

        <motion.div
          className="p-4 rounded-xl bg-card/50 border border-border mb-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
        >
          <div className="flex items-center gap-2 mb-3" dir="rtl">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <h3 className="text-sm font-bold text-foreground">ماذا كشف أداؤك؟</h3>
          </div>

          <div className="space-y-2" dir="rtl">
            {highlightedStrengths.map((line, i) => (
              <motion.div
                key={i}
                className="p-3 rounded-lg bg-background/40 border border-border"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.48 + i * 0.05 }}
              >
                <p className="text-sm text-foreground leading-relaxed">{line}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.button
          onClick={() => setShowDetails((prev) => !prev)}
          className="w-full p-3 rounded-xl bg-card/50 border border-border flex items-center justify-between mb-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-sm font-bold text-foreground">📋 مراجعة الدفتر والمسار</span>
          <ChevronDown
            className={cn("w-4 h-4 text-muted-foreground transition-transform", showDetails && "rotate-180")}
          />
        </motion.button>

        {showDetails && (
          <motion.div
            className="space-y-3 mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <div className="p-4 rounded-xl bg-card/45 border border-border">
              <h4 className="text-sm font-bold text-foreground mb-3" dir="rtl">
                الملاحظات المحفوظة حسب النوع
              </h4>

              {notesByType.length === 0 ? (
                <p className="text-xs text-muted-foreground" dir="rtl">
                  ما فيش ملاحظات محفوظة في الدفتر.
                </p>
              ) : (
                <div className="space-y-2" dir="rtl">
                  {notesByType.map(([type, count]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between p-2 rounded-lg bg-background/35 border border-border"
                    >
                      <span className="text-xs text-foreground">{type}</span>
                      <span className="text-xs font-bold text-primary">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-card/45 border border-border">
              <h4 className="text-sm font-bold text-foreground mb-3" dir="rtl">
                آخر الملاحظات المحفوظة
              </h4>

              {state.notes.length === 0 ? (
                <p className="text-xs text-muted-foreground" dir="rtl">
                  ما اتحفظتش ملاحظات لسه.
                </p>
              ) : (
                <div className="space-y-2" dir="rtl">
                  {state.notes.slice(-5).reverse().map((note) => (
                    <div
                      key={`${note.roundId}-${note.text}`}
                      className="p-3 rounded-lg bg-background/35 border border-border"
                    >
                      <p className="text-sm text-foreground leading-relaxed">{note.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58 }}
        >
          <motion.button
            onClick={handleReplay}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="w-5 h-5" />
            العب مرة أخرى
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
