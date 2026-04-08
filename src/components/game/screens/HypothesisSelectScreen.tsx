import { motion } from "framer-motion";
import { useGame } from "@/contexts/GameContext";
import { HYPOTHESES } from "@/data/case1";
import { cn } from "@/lib/utils";
import storeFrontImg from "@/assets/scenes/store-front.png";

interface HypothesisSelectScreenProps {
  onComplete: () => void;
}

export const HypothesisSelectScreen = ({ onComplete }: HypothesisSelectScreenProps) => {
  const { state, toggleHypothesis, isHypothesisSelected, advancePhase } = useGame();

  const handleStart = () => {
    if (state.selectedHypotheses.length === 4) {
      advancePhase(); // 0 -> 1
      advancePhase(); // 1 -> 2 (unlocks D1+D2)
      onComplete(); // navigate to "briefing"
    }
  };

  return (
    <div className="relative min-h-screen overflow-auto">
      <div className="absolute inset-0">
        <img src={storeFrontImg} alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">
        <motion.div className="text-center mb-6" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h1 className="text-2xl font-bold text-foreground mb-2">إيه التفسيرات الأقرب؟</h1>
          <p className="text-muted-foreground text-sm">قبل ما تبدأ تجمع أدلة… اختر 4 تفسيرات تحسها الأقرب من اللي سمعته.</p>
          <div className={cn("inline-block mt-3 px-4 py-1.5 rounded-full text-sm font-bold",
            state.selectedHypotheses.length === 4 ? "bg-neon-green/20 text-neon-green" : "bg-primary/20 text-primary"
          )}>
            {state.selectedHypotheses.length}/4 مختارة
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {HYPOTHESES.map((h, i) => {
            const isSelected = isHypothesisSelected(h.id);
            const isFull = state.selectedHypotheses.length >= 4 && !isSelected;
            return (
              <motion.button
                key={h.id}
                onClick={() => { if (!isFull) toggleHypothesis(h.id); }}
                disabled={isFull}
                className={cn(
                  "p-4 rounded-xl border text-right transition-all",
                  isSelected ? "bg-primary/20 border-primary ring-2 ring-primary/30" :
                  isFull ? "bg-muted/30 border-border opacity-50 cursor-not-allowed" :
                  "bg-card/50 border-border hover:border-primary/50"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={!isFull ? { scale: 1.02 } : {}}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                  )}>
                    {isSelected ? "✓" : h.id}
                  </div>
                  <div>
                    <p className={cn("font-bold text-sm", isSelected ? "text-primary" : "text-foreground")}>{h.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{h.description}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground text-center mb-4">
          اختيارك مبدئي… بعد أول مجموعة أدلة تقدر تبدّل فرضية واحدة.
        </p>

        {state.selectedHypotheses.length === 4 && (
          <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <motion.button
              onClick={handleStart}
              className="px-8 py-3 rounded-xl font-bold text-lg"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🚀 ابدأ التحليل
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
