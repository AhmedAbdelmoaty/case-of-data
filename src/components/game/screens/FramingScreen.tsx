import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, BookOpen } from "lucide-react";
import { FRAMING_OPTIONS } from "@/data/pf-scenario";
import { usePFGame } from "@/contexts/PFGameContext";
import { PFNotebook } from "../PFNotebook";
import { StampEffect } from "../StampEffect";
import storeCounterImg from "@/assets/scenes/store-counter.png";

interface FramingScreenProps {
  onComplete: () => void;
}

export const FramingScreen = ({ onComplete }: FramingScreenProps) => {
  const { chooseFraming } = usePFGame();
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showStamp, setShowStamp] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const [shuffled] = useState(() => {
    const arr = [...FRAMING_OPTIONS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  const handleConfirm = () => {
    if (!selected) return;
    chooseFraming(selected);
    setConfirmed(true);
    setShowStamp(true);
    setTimeout(() => {
      setShowStamp(false);
      onComplete();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0">
        <img src={storeCounterImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      </div>

      <PFNotebook />
      <StampEffect isVisible={showStamp} text="✓ تم التأكيد" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onAnimationComplete={() => setTimeout(() => setShowOptions(true), 600)}
        >
          <motion.div
            className="text-5xl mb-4"
            animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: 1 }}
          >
            🤔
          </motion.div>
          <h1 className="text-xl font-bold text-foreground mb-2" dir="rtl">
            وقت التأطير
          </h1>
          <p className="text-muted-foreground text-sm" dir="rtl">
            بناءً على كل اللي سمعته وفهمته… إيه أقرب وصف للمشكلة الحقيقية؟
          </p>
          <p className="text-muted-foreground text-xs mt-2 flex items-center justify-center gap-1" dir="rtl">
            <BookOpen className="w-3.5 h-3.5" />
            راجع الدفتر قبل ما تختار
          </p>
        </motion.div>

        <AnimatePresence>
          {showOptions && (
            <div className="space-y-3">
              {shuffled.map((option, i) => {
                const isSelected = selected === option.id;
                const isOther = selected && !isSelected;

                return (
                  <motion.button
                    key={option.id}
                    onClick={() => !confirmed && setSelected(option.id)}
                    className={`w-full p-5 rounded-xl border text-right transition-all ${
                      isSelected
                        ? "bg-primary/10 border-primary/50 ring-2 ring-primary/30"
                        : "bg-card/80 backdrop-blur-sm border-border hover:border-primary/30"
                    } ${confirmed ? "pointer-events-none" : ""}`}
                    dir="rtl"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{
                      opacity: confirmed && isOther ? 0.3 : 1,
                      x: confirmed && isOther ? 60 : 0,
                      scale: confirmed && isSelected ? 1.03 : 1,
                    }}
                    transition={{ delay: i * 0.15, type: "spring", damping: 20 }}
                    whileHover={!confirmed ? { scale: 1.01 } : {}}
                    whileTap={!confirmed ? { scale: 0.99 } : {}}
                  >
                    <p className="text-foreground text-sm leading-relaxed font-bold mb-1">{option.text.slice(0, 60)}...</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">{option.text}</p>
                  </motion.button>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selected && !confirmed && (
            <motion.button
              onClick={handleConfirm}
              className="mt-6 w-full py-3 rounded-xl font-bold text-base text-primary-foreground flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Target className="w-5 h-5" />
              أكّد اختيارك وقدّم التقرير
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {confirmed && !showStamp && (
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <motion.div
                className="text-4xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                📋
              </motion.div>
              <p className="text-muted-foreground text-sm mt-2" dir="rtl">
                بتقدم التحليل لأبو سعيد...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
