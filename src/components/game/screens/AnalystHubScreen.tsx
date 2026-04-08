import { motion } from "framer-motion";
import { ArrowLeft, RefreshCw, Grid3X3 } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { HYPOTHESES, CASE_INFO, PHASES } from "@/data/case1";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import analysisLabImg from "@/assets/rooms/analysis-lab.png";

interface AnalystHubScreenProps {
  onNavigate: (screen: string) => void;
}

export const AnalystHubScreen = ({ onNavigate }: AnalystHubScreenProps) => {
  const { state, advancePhase, getCTALabel, getCTATarget, canAdvance, getProgress, swapHypothesis } = useGame();
  const { playSound } = useSound();
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapOld, setSwapOld] = useState<string | null>(null);
  const [swapNew, setSwapNew] = useState<string | null>(null);

  const selectedH = HYPOTHESES.filter(h => state.selectedHypotheses.includes(h.id));
  const progress = getProgress();
  const ctaLabel = getCTALabel();
  const ctaTarget = getCTATarget();
  const showSwapButton = state.currentPhaseIndex >= 4 && !state.hasUsedSwap;
  const currentPhase = PHASES[state.currentPhaseIndex];

  const handleCTA = () => {
    playSound("click");
    if (canAdvance()) {
      const phase = PHASES[state.currentPhaseIndex + 1];
      advancePhase();
      if (phase?.toastMessage) {
        setTimeout(() => toast.info(phase.toastMessage), 500);
      }
      onNavigate(phase?.ctaTarget || "analyst-hub");
    }
  };

  const handleSwapConfirm = () => {
    if (swapOld && swapNew) {
      swapHypothesis(swapOld, swapNew);
      toast.success("تم تبديل الفرضية!");
      setShowSwapModal(false);
      setSwapOld(null);
      setSwapNew(null);
    }
  };

  const unselectedH = HYPOTHESES.filter(h => !state.selectedHypotheses.includes(h.id));

  return (
    <div className="relative min-h-screen overflow-auto">
      <div className="absolute inset-0">
        <img src={analysisLabImg} alt="Analysis Lab" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <motion.div className="text-center mb-6" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className="text-xl font-bold text-foreground mb-1">🔬 مركز التحليل</h1>
          <p className="text-sm text-muted-foreground">المرحلة {state.currentPhaseIndex}/{PHASES.length - 1}</p>
        </motion.div>

        {/* Selected Hypotheses */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {selectedH.map((h, i) => (
            <motion.div key={h.id} className="p-3 rounded-lg bg-primary/10 border border-primary/30 text-center"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
              <span className="text-xs font-bold text-primary">{h.id}</span>
              <p className="text-xs text-foreground mt-1">{h.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Case Summary */}
        <div className="p-4 rounded-xl bg-card/50 border border-border mb-4">
          <h3 className="font-bold text-foreground text-sm mb-1">📁 {CASE_INFO.title}</h3>
          <p className="text-xs text-muted-foreground">{CASE_INFO.summary}</p>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>التقدم</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Score + Notebook count */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 p-3 rounded-lg bg-card/50 border border-border text-center">
            <span className="text-amber-400 font-bold">{state.score}</span>
            <p className="text-xs text-muted-foreground">نقطة</p>
          </div>
          <div className="flex-1 p-3 rounded-lg bg-card/50 border border-border text-center">
            <span className="text-primary font-bold">📓 {state.notebook.length}</span>
            <p className="text-xs text-muted-foreground">ملاحظة</p>
          </div>
          <div className="flex-1 p-3 rounded-lg bg-card/50 border border-border text-center">
            <span className="text-foreground font-bold">{state.completedInterviews.length}/3</span>
            <p className="text-xs text-muted-foreground">مقابلات</p>
          </div>
        </div>

        {/* CTA Button */}
        {canAdvance() && ctaLabel && (
          <motion.button
            onClick={handleCTA}
            className="w-full py-4 rounded-xl font-bold text-lg mb-4 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ArrowLeft className="w-5 h-5" />
            {ctaLabel}
          </motion.button>
        )}

        {/* Matrix button when at phase 11 */}
        {state.currentPhaseIndex >= 11 && (
          <motion.button
            onClick={() => onNavigate("analysis")}
            className="w-full py-4 rounded-xl font-bold text-lg mb-4 flex items-center justify-center gap-2 bg-accent text-accent-foreground"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <Grid3X3 className="w-5 h-5" />
            افتح المصفوفة
          </motion.button>
        )}

        {/* Swap button */}
        {showSwapButton && (
          <motion.button
            onClick={() => setShowSwapModal(true)}
            className="w-full py-3 rounded-xl font-bold text-sm mb-4 flex items-center justify-center gap-2 bg-secondary text-foreground border border-border"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <RefreshCw className="w-4 h-4" />
            بدّل فرضية واحدة (اختياري)
          </motion.button>
        )}

        {/* Navigation buttons to revisit */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {state.unlockedDashboard.length > 0 && (
            <button onClick={() => onNavigate("dashboard")} className="p-3 rounded-lg bg-card/50 border border-border text-center hover:border-primary/50 transition-colors">
              <span className="text-lg">📊</span>
              <p className="text-xs text-muted-foreground mt-1">البيانات</p>
            </button>
          )}
          {state.unlockedEvidence.length > 0 && (
            <button onClick={() => onNavigate("evidence")} className="p-3 rounded-lg bg-card/50 border border-border text-center hover:border-primary/50 transition-colors">
              <span className="text-lg">📁</span>
              <p className="text-xs text-muted-foreground mt-1">الأدلة</p>
            </button>
          )}
          {state.unlockedInterviews.length > 0 && (
            <button onClick={() => onNavigate("floor")} className="p-3 rounded-lg bg-card/50 border border-border text-center hover:border-primary/50 transition-colors">
              <span className="text-lg">👥</span>
              <p className="text-xs text-muted-foreground mt-1">الصالة</p>
            </button>
          )}
          <button onClick={() => onNavigate("office")} className="p-3 rounded-lg bg-card/50 border border-border text-center hover:border-primary/50 transition-colors">
            <span className="text-lg">🏢</span>
            <p className="text-xs text-muted-foreground mt-1">المكتب</p>
          </button>
        </div>
      </div>

      {/* Swap Modal */}
      {showSwapModal && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowSwapModal(false)} />
          <div className="relative z-10 bg-background/95 border border-primary/30 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-foreground mb-4">بدّل فرضية</h3>
            <p className="text-sm text-muted-foreground mb-4">اختر الفرضية اللي عايز تشيلها، والفرضية الجديدة:</p>
            
            <div className="mb-4">
              <p className="text-sm font-bold text-foreground mb-2">شيل:</p>
              <div className="space-y-2">
                {selectedH.map(h => (
                  <button key={h.id} onClick={() => setSwapOld(h.id)}
                    className={cn("w-full p-2 rounded-lg border text-right text-sm", swapOld === h.id ? "border-destructive bg-destructive/10" : "border-border")}>
                    {h.id}: {h.text}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-bold text-foreground mb-2">ضيف:</p>
              <div className="space-y-2">
                {unselectedH.map(h => (
                  <button key={h.id} onClick={() => setSwapNew(h.id)}
                    className={cn("w-full p-2 rounded-lg border text-right text-sm", swapNew === h.id ? "border-primary bg-primary/10" : "border-border")}>
                    {h.id}: {h.text}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowSwapModal(false)} className="flex-1 py-2 rounded-lg bg-secondary text-foreground text-sm">إلغاء</button>
              <button onClick={handleSwapConfirm} disabled={!swapOld || !swapNew}
                className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm disabled:opacity-50">تأكيد التبديل</button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
