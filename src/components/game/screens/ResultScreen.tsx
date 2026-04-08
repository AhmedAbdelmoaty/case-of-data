import { motion } from "framer-motion";
import { Trophy, Star, RotateCcw, CheckCircle, XCircle, BookOpen } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { CASE_INFO, EVIDENCE_ITEMS, HYPOTHESES } from "@/data/case1";
import { cn } from "@/lib/utils";
import excellentEndingImg from "@/assets/scenes/suspect-arrested.png";
import wrongEndingImg from "@/assets/scenes/suspect-escaped.png";

interface ResultScreenProps {
  onNavigate: (screen: string) => void;
}

export const ResultScreen = ({ onNavigate }: ResultScreenProps) => {
  const { state, resetGame, getEnding } = useGame();
  const ending = getEnding();
  const isWin = ending?.type === "excellent" || ending?.type === "partial";

  const totalPossibleScore = 700;
  const scorePercentage = Math.round((state.score / totalPossibleScore) * 100);

  const getRank = () => {
    if (ending?.type === "excellent") return { title: "محلل بيانات أسطوري", icon: "🏆", color: "text-yellow-400" };
    if (ending?.type === "partial") return { title: "محلل بيانات متقدم", icon: "🥈", color: "text-slate-300" };
    if (ending?.type === "wrong") return { title: "محلل بيانات مبتدئ", icon: "📚", color: "text-amber-600" };
    return { title: "متدرب", icon: "🔰", color: "text-muted-foreground" };
  };

  const rank = getRank();

  const handleReplay = () => {
    resetGame();
    onNavigate("intro");
  };

  const stats = [
    { label: "أدلة في الدفتر", value: state.notebook.length, max: 16, icon: "📓" },
    { label: "أدلة مشاهدة", value: state.viewedEvidence.length, max: EVIDENCE_ITEMS.length, icon: "📁" },
    { label: "مقابلات مكتملة", value: state.completedInterviews.length, max: 3, icon: "👥" },
    { label: "H3 ضمن الاختيارات", value: state.selectedHypotheses.includes("H3") ? "✓" : "✗", max: "", icon: "🎯" },
  ];

  const chosenHypothesis = HYPOTHESES.find(h => h.id === state.finalHypothesis);

  return (
    <div className={cn("min-h-screen relative overflow-hidden")}>
      {/* Background scene image */}
      <div className="absolute inset-0">
        <img src={isWin ? excellentEndingImg : wrongEndingImg} alt="Ending" className="w-full h-full object-cover" />
        <div className={cn("absolute inset-0",
          isWin ? "bg-gradient-to-b from-green-950/80 via-green-900/60 to-background/95" : "bg-gradient-to-b from-red-950/80 via-red-900/60 to-background/95"
        )} />
      </div>
      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div key={i}
            className={cn("absolute w-2 h-2 rounded-full", isWin ? "bg-green-400/30" : "bg-red-400/30")}
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div className="text-center mb-8" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <motion.div className="text-8xl mb-4" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            {ending?.rankIcon || "📊"}
          </motion.div>
          <h1 className={cn("text-4xl md:text-5xl font-bold mb-2", isWin ? "text-green-400" : "text-red-400")}>
            {ending?.title || "النتيجة"}
          </h1>
          <p className="text-muted-foreground text-lg">{ending?.description}</p>
        </motion.div>

        {/* What you chose */}
        <motion.div className="p-4 rounded-xl bg-card/50 border border-border mb-6 text-center"
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        >
          <p className="text-sm text-muted-foreground mb-1">اختيارك النهائي:</p>
          <p className="text-xl font-bold text-foreground">{chosenHypothesis?.text || "غير محدد"}</p>
        </motion.div>

        {/* Consequences */}
        {ending?.consequences && (
          <motion.div className={cn("p-6 rounded-2xl border mb-6",
            isWin ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
          )} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
            <h3 className="text-lg font-bold text-foreground mb-4">النتائج:</h3>
            <ul className="space-y-2">
              {ending.consequences.map((c, i) => (
                <motion.li key={i} className="flex items-start gap-3 text-foreground"
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.1 }}
                >
                  {isWin ? <CheckCircle className="w-5 h-5 text-green-400 shrink-0" /> : <XCircle className="w-5 h-5 text-destructive shrink-0" />}
                  <span>{c}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Score & Rank */}
        <motion.div className="p-6 rounded-2xl bg-card/50 border border-border mb-6"
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-right">
              <p className="text-muted-foreground text-sm mb-1">النقاط النهائية</p>
              <div className="flex items-center gap-2">
                <Star className="w-8 h-8 text-amber-400" />
                <span className="text-5xl font-bold text-amber-400">{state.score}</span>
              </div>
            </div>
            <div className="text-center">
              <motion.div className="text-6xl mb-2" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                {rank.icon}
              </motion.div>
              <p className={cn("text-2xl font-bold", rank.color)}>{rank.title}</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-muted-foreground text-sm">المهمة</p>
              <p className="text-xl font-bold text-foreground">{CASE_INFO.title}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
        >
          {stats.map((stat, i) => (
            <motion.div key={stat.label} className="p-4 rounded-xl bg-card/50 border border-border text-center"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
            >
              <span className="text-2xl mb-2 block">{stat.icon}</span>
              <p className="text-2xl font-bold text-foreground">
                {stat.value}{stat.max && <span className="text-muted-foreground text-sm">/{stat.max}</span>}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Lesson learned */}
        {ending?.lesson && (
          <motion.div className="p-6 rounded-2xl bg-accent/10 border border-accent/30 mb-6"
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}
          >
            <h3 className="text-lg font-bold text-accent mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              الدرس المستفاد
            </h3>
            <p className="text-foreground leading-relaxed">{ending.lesson}</p>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}
        >
          <motion.button onClick={handleReplay}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-lg"
            whileHover={{ scale: 1.05 }}
          >
            <RotateCcw className="w-6 h-6" />
            🔄 العب مرة أخرى
          </motion.button>
          <motion.button onClick={() => { resetGame(); onNavigate("intro"); }}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-secondary text-foreground font-bold text-lg border border-border"
            whileHover={{ scale: 1.05 }}
          >
            🏠 القائمة الرئيسية
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};
