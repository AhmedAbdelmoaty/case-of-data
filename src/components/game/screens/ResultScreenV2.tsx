// ════════════════════════════════════════════════════════════════════════════
// ResultScreenV2 — تقييم متعدد الأبعاد + شرح الأخطاء (V3)
// ════════════════════════════════════════════════════════════════════════════
import { motion } from "framer-motion";
import { Trophy, Sparkles, Zap, AlertTriangle, FileCheck, RotateCcw, XCircle, Clock } from "lucide-react";
import { usePFGameV2 } from "@/contexts/PFGameContextV2";
import { getScoreLevel, getQuestionById, FRAMING_SLOTS } from "@/data/pf-scenario";

interface Props { onNavigate: (screen: string) => void; }

export const ResultScreenV2 = ({ onNavigate }: Props) => {
  const { state, getScoreBreakdown } = usePFGameV2();
  const breakdown = getScoreBreakdown();
  const level = getScoreLevel(breakdown.total);

  // الأسئلة المضللة اللي اتسألت
  const misleadingAsked = state.askedIds
    .map((id) => getQuestionById(id))
    .filter((q) => q?.kind === "misleading");

  // الأسئلة الـ premature اللي ما اتحولتش لـ key
  const prematureAsked = state.askedIds
    .map((id) => getQuestionById(id))
    .filter((q) => {
      if (!q || q.kind !== "premature") return false;
      if (q.becomesKeyAfter && state.askedIds.includes(q.becomesKeyAfter)) return false;
      return true;
    });

  // مقارنة التأطير
  const framingComparison = FRAMING_SLOTS.map((slot) => {
    const playerChoiceId = state.framingChoices[slot.id];
    const playerChoice = slot.choices.find((c) => c.id === playerChoiceId);
    const correctChoice = slot.choices.find((c) => c.isCorrect);
    return {
      label: slot.label,
      player: playerChoice,
      correct: correctChoice,
      isCorrect: playerChoice?.isCorrect || false,
    };
  });

  return (
    <div className="min-h-screen bg-background pt-20 pb-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* الإجمالي */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-3">{level.icon}</div>
          <h1 className={`text-3xl font-bold mb-2 ${level.color}`} dir="rtl">{level.title}</h1>
          <p className="text-muted-foreground mb-4 max-w-xl mx-auto" dir="rtl">{level.description}</p>
          <div className="inline-flex items-center gap-2 bg-card/60 border border-border rounded-2xl px-6 py-3">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span className="text-3xl font-bold text-foreground">{breakdown.total}</span>
            <span className="text-muted-foreground">/100</span>
          </div>
        </motion.div>

        {/* تفاصيل النقاط */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <motion.div
            className="bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-amber-500/30 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            dir="rtl"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-amber-400">
                <Sparkles className="w-5 h-5" />
                <span className="font-bold">المعلومات المفتاحية</span>
              </div>
              <span className="text-foreground font-bold">+{breakdown.keyInsightsScore}<span className="text-muted-foreground text-sm">/50</span></span>
            </div>
            <p className="text-xs text-muted-foreground">اكتشفت {breakdown.keyAsked} من {breakdown.keyTotal} معلومة محورية</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/30 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            dir="rtl"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-emerald-400">
                <FileCheck className="w-5 h-5" />
                <span className="font-bold">دقة التأطير</span>
              </div>
              <span className="text-foreground font-bold">+{breakdown.framingScore}<span className="text-muted-foreground text-sm">/40</span></span>
            </div>
            <p className="text-xs text-muted-foreground">{breakdown.framingScore / 10} من 4 خانات صح</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-red-500/10 to-orange-500/5 border border-red-500/30 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            dir="rtl"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-bold">الأسئلة المضللة</span>
              </div>
              <span className="text-foreground font-bold">−{breakdown.misleadingPenalty}</span>
            </div>
            <p className="text-xs text-muted-foreground">سألت {breakdown.misleadingCount} سؤال بيوديك للفخ</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/30 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            dir="rtl"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-orange-400">
                <Clock className="w-5 h-5" />
                <span className="font-bold">قفز للأمام</span>
              </div>
              <span className="text-foreground font-bold">−{breakdown.prematurePenalty}</span>
            </div>
            <p className="text-xs text-muted-foreground">سألت {breakdown.prematureCount} سؤال في الوقت الغلط</p>
          </motion.div>

          {breakdown.efficiencyBonus > 0 && (
            <motion.div
              className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/30 rounded-xl p-4 sm:col-span-2"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              dir="rtl"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Zap className="w-5 h-5" />
                  <span className="font-bold">بونص الكفاءة</span>
                </div>
                <span className="text-foreground font-bold">+{breakdown.efficiencyBonus}</span>
              </div>
              <p className="text-xs text-muted-foreground">وصلت للحل وفاضلك {state.budgetRemaining} سؤال — شغل نظيف</p>
            </motion.div>
          )}
        </div>

        {/* مقارنة التأطير */}
        <motion.div
          className="bg-card/50 border border-border rounded-xl p-5 mb-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          dir="rtl"
        >
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-primary" />
            مراجعة التأطير
          </h3>
          <div className="space-y-3">
            {framingComparison.map((row, i) => (
              <div key={i} className="p-3 rounded-lg bg-background/40 border border-border/50">
                <div className="text-xs text-muted-foreground mb-1">{row.label}</div>
                <div className={`flex items-start gap-2 text-sm ${row.isCorrect ? "text-emerald-300" : "text-red-300"}`}>
                  {row.isCorrect ? (
                    <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold">{row.player?.text || "(لم تختر)"}</div>
                    {!row.isCorrect && (
                      <div className="mt-2 text-emerald-300/90 text-xs">
                        الصح: {row.correct?.text}
                      </div>
                    )}
                    <div className="mt-1 text-muted-foreground text-xs">
                      {row.isCorrect ? row.player?.explanation : row.correct?.explanation}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* مراجعة الأخطاء */}
        {(misleadingAsked.length > 0 || prematureAsked.length > 0) && (
          <motion.div
            className="bg-card/50 border border-border rounded-xl p-5 mb-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            dir="rtl"
          >
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              الأسئلة اللي اتسحبت لها
            </h3>
            <div className="space-y-2">
              {misleadingAsked.map((q) => (
                <div key={q!.id} className="p-3 rounded-lg bg-red-500/5 border border-red-500/30 text-sm">
                  <div className="text-red-300 font-bold mb-1">🔴 سؤال مضلل: {q!.text}</div>
                  <div className="text-muted-foreground text-xs">
                    ده النوع اللي بيقفز لاتهام أو لفرضية بدون دليل. الإجابة قد تبدو مفيدة لكنها بتبعدك عن السبب الحقيقي.
                  </div>
                </div>
              ))}
              {prematureAsked.map((q) => (
                <div key={q!.id} className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/30 text-sm">
                  <div className="text-orange-300 font-bold mb-1">⏱ في الوقت الغلط: {q!.text}</div>
                  <div className="text-muted-foreground text-xs">
                    ده سؤال صح لكنك سألته بدري قبل ما تكسّر السياق. لو سألته بعد ما تجيب الـ baseline من سلمى، كان هياخدك مباشرة للسبب.
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ملخص الـ insights */}
        {state.insights.length > 0 && (
          <motion.div
            className="bg-card/40 border border-border rounded-xl p-5 mb-8"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            dir="rtl"
          >
            <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              ملخص اللي اكتشفته ({state.insights.length})
            </h3>
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {state.insights.map((ins) => (
                <div
                  key={ins.questionId + ins.timestamp}
                  className={`text-sm p-2 rounded ${ins.isKey ? "text-foreground bg-amber-500/5" : "text-muted-foreground"}`}
                >
                  {ins.isKey && "✨ "}{ins.text}
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
            className="px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-primary to-accent text-white hover:scale-105 flex items-center gap-2 transition-transform"
          >
            <RotateCcw className="w-5 h-5" />
            ابدأ من جديد
          </button>
        </motion.div>
      </div>
    </div>
  );
};
