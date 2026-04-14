import { motion } from "framer-motion";
import { Trophy, Star, RotateCcw, CheckCircle, XCircle, ChevronDown, MessageSquare, Briefcase, Target, Brain, Sparkles } from "lucide-react";
import { usePFGame, type PerformanceTier } from "@/contexts/PFGameContext";
import { useAuth } from "@/contexts/AuthContext";
import { FRAMING_OPTIONS, getScoreLevel, MAX_SCORE } from "@/data/pf-scenario";
import { useSound } from "@/hooks/useSoundEffects";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import analystImg from "@/assets/characters/analyst.png";
import saraImg from "@/assets/characters/sara.png";

interface ResultScreenProps {
  onNavigate: (screen: string) => void;
}

const tierConfig: Record<PerformanceTier, { rank: string; rankEn: string; badgeColor: string; badgeIcon: string; glowColor: string }> = {
  exceptional: { rank: "محلل استثنائي", rankEn: "Exceptional Analyst", badgeColor: "from-yellow-400 to-amber-600", badgeIcon: "🏆", glowColor: "shadow-amber-500/40" },
  promising: { rank: "محلل واعد", rankEn: "Promising Analyst", badgeColor: "from-slate-300 to-slate-500", badgeIcon: "🥈", glowColor: "shadow-slate-400/30" },
  beginner: { rank: "محلل مبتدئ", rankEn: "Getting Started", badgeColor: "from-amber-600 to-amber-800", badgeIcon: "📚", glowColor: "shadow-amber-700/20" },
};

export const ResultScreen = ({ onNavigate }: ResultScreenProps) => {
  const { state, resetGame, getPerformanceTier, isFramingCorrect } = usePFGame();
  const { profile } = useAuth();
  const { playSound } = useSound();
  const [showDetails, setShowDetails] = useState(false);
  const [scoreAnimated, setScoreAnimated] = useState(0);

  const level = getScoreLevel(state.score);
  const tier = getPerformanceTier();
  const tierInfo = tierConfig[tier];
  const correct = isFramingCorrect();
  const chosenFraming = FRAMING_OPTIONS.find((f) => f.id === state.chosenFramingId);
  const correctFraming = FRAMING_OPTIONS.find((f) => f.isCorrect);
  const playerName = profile?.display_name || "محلل";
  const g = profile?.gender || "male";
  const avatarImg = g === "female" ? saraImg : analystImg;

  const clientSatisfaction = correct ? "راضي ✅" : "مش مقتنع ⚠️";
  const managerRating = tier === "exceptional" ? "فخور 🌟" : tier === "promising" ? "يشجّع 👍" : "يعاتب ⚡";

  // Animate score counting up
  useEffect(() => {
    if (tier === "exceptional") {
      try { playSound("confetti"); } catch {}
    }
    const duration = 1500;
    const steps = 30;
    const increment = state.score / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= state.score) {
        setScoreAnimated(state.score);
        clearInterval(timer);
      } else {
        setScoreAnimated(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [state.score, tier, playSound]);

  const handleReplay = () => {
    resetGame();
    onNavigate("company-briefing");
  };

  const badges = [
    ...(correct ? [{ icon: "🎯", label: "تأطير دقيق", desc: "اختار التأطير الصحيح" }] : []),
    ...(state.score >= 20 ? [{ icon: "🧠", label: "أسئلة حادة", desc: "سأل أسئلة قوية" }] : []),
    ...(tier === "exceptional" ? [{ icon: "⭐", label: "عميل راضي", desc: "أبو سعيد مبسوط" }] : []),
    ...(state.trustLevel >= 8 ? [{ icon: "🤝", label: "ثقة عالية", desc: "بنى ثقة مع العميل" }] : []),
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Golden confetti for exceptional */}
      {tier === "exceptional" && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                width: i % 3 === 0 ? "8px" : "6px",
                height: i % 3 === 0 ? "8px" : "6px",
                borderRadius: i % 2 === 0 ? "50%" : "2px",
                backgroundColor: ["#FFD700", "#FFA500", "#FFE066", "#DAA520", "#F5D442"][i % 5],
              }}
              initial={{ top: "-5%", opacity: 1, rotate: 0 }}
              animate={{
                top: "110%",
                opacity: [1, 1, 0.5, 0],
                rotate: Math.random() * 720,
                x: [0, (Math.random() - 0.5) * 120],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
                repeatDelay: Math.random() * 3,
              }}
            />
          ))}
          {/* Golden shimmer overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-amber-400/5 to-transparent"
            animate={{ opacity: [0, 0.15, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      )}

      {/* Subtle particles for non-exceptional */}
      {tier !== "exceptional" && (
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary/15"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [0, -20, 0], opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-lg">
        {/* Analyst Profile Card */}
        <motion.div
          className={cn(
            "p-5 rounded-2xl bg-card/70 backdrop-blur-sm border border-border mb-4",
            tier === "exceptional" && "border-amber-500/40 shadow-lg shadow-amber-500/10"
          )}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-4 mb-4" dir="rtl">
            {/* Avatar with tier glow */}
            <motion.div
              className={cn(
                "relative w-18 h-18 rounded-full overflow-hidden border-3 shadow-lg",
                tier === "exceptional" ? "border-amber-400" : tier === "promising" ? "border-slate-400" : "border-muted",
                tierInfo.glowColor
              )}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10 }}
            >
              <img src={avatarImg} alt={playerName} className="w-full h-full object-cover" />
              {tier === "exceptional" && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-amber-400/20 to-transparent"
                  animate={{ opacity: [0, 0.4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">{playerName}</h2>
              <div className="flex items-center gap-1.5">
                <span className={cn(
                  "text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r",
                  tierInfo.badgeColor
                )}>
                  {tierInfo.rank}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{tierInfo.rankEn}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Pinnacle Consulting</p>
            </div>
            <div className="text-3xl">{tierInfo.badgeIcon}</div>
          </div>

          {/* Score with animation */}
          <div className="flex items-center justify-center gap-2 mb-3 p-3 rounded-xl bg-background/40">
            <Star className="w-5 h-5 text-amber-400" />
            <motion.span
              className="text-3xl font-bold text-amber-400 tabular-nums"
              key={scoreAnimated}
            >
              {scoreAnimated}
            </motion.span>
            <span className="text-muted-foreground text-lg">/ {MAX_SCORE}</span>
          </div>

          {/* Ratings row */}
          <div className="grid grid-cols-2 gap-3">
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

          {/* Trust level bar */}
          <div className="mt-3 p-2.5 rounded-lg bg-background/50" dir="rtl">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Target className="w-3 h-3" /> مستوى الثقة
              </span>
              <span className="text-xs font-bold text-foreground">{state.trustLevel}/10</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${(state.trustLevel / 10) * 100}%` }}
                transition={{ duration: 1.2, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Badges */}
        {badges.length > 0 && (
          <motion.div
            className="flex flex-wrap justify-center gap-2 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            {badges.map((badge, i) => (
              <motion.div
                key={i}
                className={cn(
                  "flex flex-col items-center gap-1 p-2.5 rounded-lg border",
                  tier === "exceptional"
                    ? "bg-amber-500/10 border-amber-500/30"
                    : "bg-primary/5 border-primary/20"
                )}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                title={badge.desc}
              >
                <span className="text-lg">{badge.icon}</span>
                <span className={cn(
                  "text-[10px] font-bold",
                  tier === "exceptional" ? "text-amber-400" : "text-primary"
                )}>{badge.label}</span>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Level description */}
        <motion.div
          className="p-4 rounded-xl bg-card/40 border border-border mb-4 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
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
          transition={{ delay: 0.4 }}
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
