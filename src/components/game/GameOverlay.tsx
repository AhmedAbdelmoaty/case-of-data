import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RefreshCw, ChevronUp, ChevronDown } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { HYPOTHESES, PHASES } from "@/data/case1";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface GameOverlayProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export const GameOverlay = ({ currentScreen, onNavigate }: GameOverlayProps) => {
  const { state, advancePhase, canAdvance, swapHypothesis, setEntryMethod } = useGame();
  const { playSound } = useSound();
  const [showHypotheses, setShowHypotheses] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapOld, setSwapOld] = useState<string | null>(null);
  const [swapNew, setSwapNew] = useState<string | null>(null);

  const currentPhase = PHASES[state.currentPhaseIndex];
  const selectedH = HYPOTHESES.filter(h => state.selectedHypotheses.includes(h.id));
  const unselectedH = HYPOTHESES.filter(h => !state.selectedHypotheses.includes(h.id));

  // Show swap banner only in swap phase, after required evidence viewed, and not yet answered
  const requiredEvidenceForSwap = currentPhase?.isSwapPhase && currentPhase.requiredViews?.evidence
    ? currentPhase.requiredViews.evidence.every(id => state.viewedEvidence.includes(id))
    : false;
  const showSwapBanner = currentPhase?.isSwapPhase && !state.hasUsedSwap && requiredEvidenceForSwap && !showSwapModal;

  // CTA only shows if canAdvance AND not blocked by unanswered swap
  const shouldShowContinue = canAdvance() && currentPhase?.ctaLabel;

  const handleContinue = () => {
    playSound("click");
    // Read target from CURRENT phase before advancing
    const target = currentPhase.ctaTarget;
    const nextPhaseIndex = state.currentPhaseIndex + 1;
    advancePhase();
    
    // Show toast with next phase's message
    const nextPhase = PHASES[nextPhaseIndex];
    if (nextPhase?.toastMessage) {
      setTimeout(() => toast.info(nextPhase.toastMessage), 500);
    }
    
    onNavigate(target);
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

  // Room navigation buttons
  const rooms = [
    { id: "dashboard", label: "البيانات", icon: "📊", show: state.unlockedDashboard.length > 0 },
    { id: "evidence", label: "الأدلة", icon: "📁", show: state.unlockedEvidence.length > 0 },
    { id: "floor", label: "الصالة", icon: "👥", show: state.unlockedInterviews.length > 0 },
    { id: "office", label: "المكتب", icon: "🏢", show: true },
    { id: "analysis", label: "غرفة التحليل", icon: "🔬", show: state.currentPhaseIndex >= 10 },
  ];

  return (
    <>
      {/* Top: Hypotheses strip */}
      <div className="fixed top-0 left-0 right-0 z-30 pointer-events-none">
        <div className="flex justify-center pt-2 px-4">
          <motion.button
            onClick={() => setShowHypotheses(!showHypotheses)}
            className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-background/90 backdrop-blur-xl border border-primary/30 text-sm"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-primary font-bold">فرضياتي</span>
            <div className="flex gap-1">
              {selectedH.map(h => (
                <span key={h.id} className="px-2 py-0.5 rounded bg-primary/15 text-primary text-xs font-bold">{h.id}</span>
              ))}
            </div>
            {showHypotheses ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </motion.button>
        </div>
        
        <AnimatePresence>
          {showHypotheses && (
            <motion.div
              className="pointer-events-auto mx-auto max-w-lg mt-2 px-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-xl p-3 space-y-2">
                {selectedH.map(h => (
                  <div key={h.id} className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                    <span className="text-xs font-bold text-primary w-6">{h.id}</span>
                    <span className="text-xs text-foreground">{h.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom: Room navigation + Continue banner */}
      <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
        {/* Bottom bar: CTA/Swap on right, rooms center */}
        <div className="pointer-events-auto flex items-end justify-center gap-3 px-4 pb-4">
          {/* CTA / Swap box - right side */}
          <AnimatePresence>
            {shouldShowContinue && (
              <motion.div
                className="max-w-[200px] shrink-0 order-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="bg-background/95 backdrop-blur-xl border border-primary/40 rounded-xl p-2.5">
                  {currentPhase.ctaMessage && (
                    <p className="text-[11px] text-muted-foreground text-center mb-2 leading-tight" dir="rtl">
                      {currentPhase.ctaMessage}
                    </p>
                  )}
                  <motion.button
                    onClick={handleContinue}
                    className="w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 text-primary-foreground"
                    style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    {currentPhase.ctaLabel}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSwapBanner && (
              <motion.div
                className="max-w-[220px] shrink-0 order-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="bg-background/95 backdrop-blur-xl border border-accent/40 rounded-xl p-2.5">
                  <p className="text-[11px] text-muted-foreground text-center mb-2 leading-tight" dir="rtl">
                    تقدر تبدل فرضية لو اتجاهك اتغير
                  </p>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setShowSwapModal(true)}
                      className="flex-1 py-1.5 rounded-lg bg-accent/20 border border-accent/40 text-foreground text-[11px] font-bold flex items-center justify-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      بدّل
                    </button>
                    <button
                      onClick={() => swapHypothesis("__skip__", "__skip__")}
                      className="flex-1 py-1.5 rounded-lg bg-secondary text-foreground text-[11px]"
                    >
                      كمّل
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Room navigation - center */}
          <div className="flex gap-2 order-1">
            {rooms.filter(r => r.show).map(room => (
              <button
                key={room.id}
                onClick={() => { playSound("navigate"); setEntryMethod("direct"); onNavigate(room.id); }}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-all",
                  currentScreen === room.id
                    ? "bg-primary/15 border-primary/50"
                    : "bg-background/80 backdrop-blur-sm border-border/50 hover:border-primary/30"
                )}
              >
                <span className="text-lg">{room.icon}</span>
                <span className={cn("text-[10px] font-medium", currentScreen === room.id ? "text-primary" : "text-muted-foreground")}>{room.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Swap Modal */}
      <AnimatePresence>
        {showSwapModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
      </AnimatePresence>
    </>
  );
};
