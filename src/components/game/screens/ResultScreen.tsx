import { motion } from "framer-motion";
import { Trophy, Star, RotateCcw, CheckCircle, XCircle, ChevronDown } from "lucide-react";
import { usePFGame } from "@/contexts/PFGameContext";
import { INQUIRY_ROUNDS, FRAMING_OPTIONS, getScoreLevel, MAX_SCORE } from "@/data/pf-scenario";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ResultScreenProps {
  onNavigate: (screen: string) => void;
}

export const ResultScreen = ({ onNavigate }: ResultScreenProps) => {
  const { state, resetGame } = usePFGame();
  const [showDetails, setShowDetails] = useState(false);

  const level = getScoreLevel(state.score);
  const chosenFraming = FRAMING_OPTIONS.find((f) => f.id === state.chosenFramingId);
  const correctFraming = FRAMING_OPTIONS.find((f) => f.isCorrect);
  const isFramingCorrect = chosenFraming?.isCorrect || false;

  const handleReplay = () => {
    resetGame();
    onNavigate("company-briefing");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "absolute w-2 h-2 rounded-full",
              isFramingCorrect ? "bg-green-400/30" : "bg-amber-400/30"
            )}
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-lg">
        {/* Header */}
        <motion.div className="text-center mb-6" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <motion.div
            className="text-7xl mb-3"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {level.icon}
          </motion.div>
          <h1 className={cn("text-3xl font-bold mb-1", level.color)}>{level.title}</h1>
          <p className="text-muted-foreground text-sm">{level.description}</p>
        </motion.div>

        {/* Score */}
        <motion.div
          className="p-5 rounded-2xl bg-card/50 border border-border mb-4 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Star className="w-6 h-6 text-amber-400" />
            <span className="text-4xl font-bold text-amber-400">{state.score}</span>
            <span className="text-muted-foreground text-lg">/ {MAX_SCORE}</span>
          </div>
          <p className="text-muted-foreground text-xs">النقاط النهائية</p>
        </motion.div>

        {/* Framing result */}
        <motion.div
          className={cn(
            "p-4 rounded-xl border mb-4",
            isFramingCorrect ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
          )}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-start gap-2 mb-2">
            {isFramingCorrect ? (
              <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-sm font-bold text-foreground" dir="rtl">
                {isFramingCorrect ? "التأطير صح! 🎯" : "التأطير مش دقيق"}
              </p>
              <p className="text-xs text-muted-foreground mt-1" dir="rtl">
                اختيارك: {chosenFraming?.text?.slice(0, 80)}...
              </p>
            </div>
          </div>
          {!isFramingCorrect && correctFraming && (
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
          transition={{ delay: 0.4 }}
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
              const round = INQUIRY_ROUNDS[i];
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
          transition={{ delay: 0.5 }}
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
