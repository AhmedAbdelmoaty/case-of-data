// ════════════════════════════════════════════════════════════════════════════
// ResultScreenV2 — تقييم متعدد الأبعاد + feedback
// ════════════════════════════════════════════════════════════════════════════
import { motion } from "framer-motion";
import { Trophy, Sparkles, Zap, ListOrdered, FileCheck, RotateCcw } from "lucide-react";
import { usePFGameV2 } from "@/contexts/PFGameContextV2";
import { getScoreLevel, GOLDEN_QUESTION_IDS } from "@/data/pf-scenario";

interface Props { onNavigate: (screen: string) => void; }

export const ResultScreenV2 = ({ onNavigate }: Props) => {
  const { state, getScoreBreakdown } = usePFGameV2();
  const breakdown = getScoreBreakdown();
  const level = getScoreLevel(breakdown.total);
  const goldenAsked = state.askedIds.filter((id) => GOLDEN_QUESTION_IDS.includes(id)).length;

  const dimensions = [
    {
      key: "golden",
      icon: Sparkles,
      label: "الأسئلة الذهبية",
      score: breakdown.goldenQuestionsScore,
      max: 40,
      color: "text-amber-400",
      bg: "from-amber-500/10 to-yellow-500/5 border-amber-500/30",
      detail: `كشفت ${goldenAsked} من ${GOLDEN_QUESTION_IDS.length} معلومة محورية`,
    },
    {
      key: "efficiency",
      icon: Zap,
      label: "الكفاءة",
      score: breakdown.efficiencyScore,
      max: 15,
      color: "text-cyan-400",
      bg: "from-cyan-500/10 to-blue-500/5 border-cyan-500/30",
      detail: `فاضل ${state.budgetRemaining} من الميزانية`,
    },
    {
      key: "sequence",
      icon: ListOrdered,
      label: "تسلسل التحقيق",
      score: breakdown.sequencingScore,
      max: 15,
      color: "text-purple-400",
      bg: "from-purple-500/10 to-pink-500/5 border-purple-500/30",
      detail: "السياق قبل التفكيك قبل العوامل الخارجية",
    },
    {
      key: "framing",
      icon: FileCheck,
      label: "دقة التأطير",
      score: breakdown.framingScore,
      max: 30,
      color: "text-emerald-400",
      bg: "from-emerald-500/10 to-teal-500/5 border-emerald-500/30",
      detail: "الـ 4 خانات: العَرَض، تفسير العميل، السبب الحقيقي، القرار",
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Total */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-3">{level.icon}</div>
          <h1 className={`text-3xl font-bold mb-2 ${level.color}`} dir="rtl">{level.title}</h1>
          <p className="text-muted-foreground mb-4" dir="rtl">{level.description}</p>
          <div className="inline-flex items-center gap-2 bg-card/60 border border-border rounded-2xl px-6 py-3">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span className="text-3xl font-bold text-foreground">{breakdown.total}</span>
            <span className="text-muted-foreground">/100</span>
          </div>
        </motion.div>

        {/* Dimensions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {dimensions.map((d, i) => {
            const Icon = d.icon;
            const pct = (d.score / d.max) * 100;
            return (
              <motion.div
                key={d.key}
                className={`bg-gradient-to-br ${d.bg} border rounded-xl p-4`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                dir="rtl"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`flex items-center gap-2 ${d.color}`}>
                    <Icon className="w-5 h-5" />
                    <span className="font-bold">{d.label}</span>
                  </div>
                  <span className="text-foreground font-bold">
                    {d.score}<span className="text-muted-foreground text-sm">/{d.max}</span>
                  </span>
                </div>
                <div className="h-2 bg-background/40 rounded-full overflow-hidden mb-2">
                  <motion.div
                    className={`h-full bg-current ${d.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{d.detail}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Notebook recap */}
        {state.insights.length > 0 && (
          <motion.div
            className="bg-card/40 border border-border rounded-xl p-5 mb-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            dir="rtl"
          >
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              ملخص اللي اكتشفته ({state.insights.length} معلومة)
            </h3>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {state.insights.map((ins) => (
                <div
                  key={ins.questionId}
                  className={`text-sm p-2 rounded ${ins.isGolden ? "text-foreground bg-amber-500/5" : "text-muted-foreground"}`}
                >
                  {ins.isGolden && "✨ "}{ins.text}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        >
          <button
            onClick={() => onNavigate("office-briefing")}
            className="px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-primary to-accent text-white hover:scale-105 flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            ابدأ قضية جديدة
          </button>
        </motion.div>
      </div>
    </div>
  );
};
