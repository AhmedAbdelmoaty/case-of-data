import { motion } from "framer-motion";
import { Trophy, Star, RotateCcw, CheckCircle, XCircle, ChevronDown, User, Award, MessageSquare, Briefcase } from "lucide-react";
import { usePFGame, type PerformanceTier } from "@/contexts/PFGameContext";
import { useAuth } from "@/contexts/AuthContext";
import { INQUIRY_ROUNDS, FRAMING_OPTIONS, getScoreLevel, MAX_SCORE } from "@/data/pf-scenario";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ResultScreenProps {
  onNavigate: (screen: string) => void;
}

const tierConfig: Record<PerformanceTier, { rank: string; rankEn: string; badgeColor: string; badgeIcon: string }> = {
  exceptional: { rank: "محلل استثنائي", rankEn: "Exceptional Analyst", badgeColor: "from-yellow-400 to-amber-600", badgeIcon: "🏆" },
  promising: { rank: "محلل واعد", rankEn: "Promising Analyst", badgeColor: "from-slate-300 to-slate-500", badgeIcon: "🥈" },
  beginner: { rank: "محلل مبتدئ", rankEn: "Getting Started", badgeColor: "from-amber-600 to-amber-800", badgeIcon: "📚" },
};

export const ResultScreen = ({ onNavigate }: ResultScreenProps) => {
  const { state, resetGame, getPerformanceTier, isFramingCorrect } = usePFGame();
  const { profile } = useAuth();
  const [showDetails, setShowDetails] = useState(false);

  const level = getScoreLevel(state.score);
  const tier = getPerformanceTier();
  const tierInfo = tierConfig[tier];
  const correct = isFramingCorrect();
  const chosenFraming = FRAMING_OPTIONS.find((f) => f.id === state.chosenFramingId);
  const correctFraming = FRAMING_OPTIONS.find((f) => f.isCorrect);
  const playerName = profile?.display_name || "محلل";

  const clientSatisfaction = correct ? "راضي ✅" : "مش مقتنع ⚠️";
  const managerRating = tier === "exceptional" ? "فخور 🌟" : tier === "promising" ? "يشجّع 👍" : "يعاتب ⚡";

  const handleReplay = () => {
    resetGame();
    onNavigate("company-briefing");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Confetti for exceptional */}
      {tier === "exceptional" && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ["#FFD700", "#FF6B6B", "#4CAF50", "#2196F3", "#FF9800"][i % 5],
              }}
              initial={{ top: "-5%", opacity: 1, rotate: 0 }}
              animate={{
                top: "110%",
                opacity: [1, 1, 0],
                rotate: Math.random() * 720,
                x: [0, (Math.random() - 0.5) * 100],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 1.5,
                repeat: Infinity,
                repeatDelay: Math.random() * 3,
              }}
            />
          ))}
        </div>
      )}

      {/* Particles for non-exceptional */}
      {tier !== "exceptional" && (
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/20"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-lg">
        {/* Analyst Profile Card */}
        <motion.div
          className="p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border mb-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-4 mb-4" dir="rtl">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${tierInfo.badgeColor} flex items-center justify-center text-2xl shadow-lg`}>
              {tierInfo.badgeIcon}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">{playerName}</h2>
              <p className={`text-sm font-bold ${level.color}`}>{tierInfo.rank}</p>
              <p className="text-xs text-muted-foreground">{tierInfo.rankEn}</p>
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <Star className="w-5 h-5 text-amber-400" />
            <span className="text-3xl font-bold text-amber-400">{state.score}</span>
            <span className="text-muted-foreground text-lg">/ {MAX_SCORE}</span>
          </div>

          {/* Ratings row */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="p-2.5 rounded-lg bg-background/50 text-center" dir="rtl">
              <div className="flex items-center justify-center gap-1 mb-1">
                <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
                <span className="text-xs text-muted-foreground">تقييم العميل</span>
              </div>
              <p className="text-sm font-bold text-foreground">{clientSatisfaction}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-background/50 text-center" dir="rtl">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-muted-foreground">تقييم المدير</span>
              </div>
              <p className="text-sm font-bold text-foreground">{managerRating}</p>
            </div>
          </div>
        </motion.div>

        {/* Level description */}
        <motion.div
          className="p-4 rounded-xl bg-card/40 border border-border mb-4 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-foreground text-sm leading-relaxed" dir="rtl">
            {level.description}
          </p>
        </motion.div>

        {/* Framing result */}
        <motion.div
          className={cn(
            "p-4 rounded-xl border mb-4",
            correct ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
          )}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-start gap-2 mb-2">
            {correct ? (
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-sm font-bold text-foreground" dir="rtl">
                {correct ? "التأطير صح! 🎯" : "التأطير مش دقيق"}
              </p>
              <p className="text-xs text-muted-foreground mt-1" dir="rtl">
                اختيارك: {chosenFraming?.text?.slice(0, 80)}...
              </p>
            </div>
          </div>
          {!correct && correctFraming && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs font-bold text-green-400 mb-1" dir="rtl">التأطير الصح:</p>
              <p className="text-xs text-foreground leading-relaxed" dir="rtl">
                {correctFraming.text}
              </p>
            </div>
          )}
        </motion.div>

        {/* Badges */}
        {tier === "exceptional" && (
          <motion.div
            className="flex justify-center gap-3 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            {[
              { icon: "🎯", label: "تأطير دقيق" },
              { icon: "🧠", label: "أسئلة حادة" },
              { icon: "⭐", label: "عميل راضي" },
            ].map((badge, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center gap-1 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <span className="text-lg">{badge.icon}</span>
                <span className="text-[10px] text-amber-400 font-bold">{badge.label}</span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Round details toggle */}
        <motion.button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full p-3 rounded-xl bg-card/50 border border-border flex items-center justify-between mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-sm font-bold text-foreground">📋 مراجعة الأسئلة</span>
          <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", showDetails && "rotate-180")} />
        </motion.button>

        {showDetails && (
          <motion.div
            className="space-y-2 mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            {state.choices.map((choice, i) => {
              const tierLabel = choice.tier === "strong" ? "🟢 قوي" : choice.tier === "medium" ? "🟡 متوسط" : "🔴 ضعيف";
              return (
                <div key={i} className="p-3 rounded-lg bg-card/30 border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">جولة {i + 1}</span>
                    <span className="text-xs font-bold">{tierLabel} (+{choice.points})</span>
                  </div>
                  <p className="text-xs text-foreground mb-1" dir="rtl">{choice.text.slice(0, 60)}...</p>
                  <p className="text-xs text-muted-foreground" dir="rtl">{choice.explanation}</p>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          className="space-y-3"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            onClick={handleReplay}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold"
            whileHover={{ scale: 1.02 }}
          >
            <RotateCcw className="w-5 h-5" />
            العب مرة أخرى
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
