import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, BookOpen } from "lucide-react";
import { FRAMING_OPTIONS } from "@/data/pf-scenario";
import { usePFGame } from "@/contexts/PFGameContext";
import { PFNotebook } from "../PFNotebook";

interface FramingScreenProps {
  onComplete: () => void;
}

export const FramingScreen = ({ onComplete }: FramingScreenProps) => {
  const { chooseFraming } = usePFGame();
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  // Shuffle framing options once
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
    setTimeout(onComplete, 600);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-background to-background" />

      <PFNotebook />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="text-4xl mb-3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            🎯
          </motion.div>
          <h1 className="text-xl font-bold text-foreground mb-2" dir="rtl">
            التأطير النهائي
          </h1>
          <p className="text-muted-foreground text-sm" dir="rtl">
            بناءً على اللي سمعته وفهمته… إيه التأطير اللي بيوصف المشكلة الحقيقية؟
          </p>
          <p className="text-muted-foreground text-xs mt-2 flex items-center justify-center gap-1" dir="rtl">
            <BookOpen className="w-3.5 h-3.5" />
            راجع الدفتر قبل ما تختار
          </p>
        </motion.div>

        <div className="space-y-3">
          {shuffled.map((option, i) => (
            <motion.button
              key={option.id}
              onClick={() => !confirmed && setSelected(option.id)}
              className={`w-full p-4 rounded-xl border text-right transition-all ${
                selected === option.id
                  ? "bg-primary/10 border-primary/50 ring-2 ring-primary/30"
                  : "bg-card/80 border-border hover:border-primary/30"
              } ${confirmed ? "pointer-events-none opacity-80" : ""}`}
              dir="rtl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              whileHover={!confirmed ? { scale: 1.01 } : {}}
              whileTap={!confirmed ? { scale: 0.99 } : {}}
            >
              <p className="text-foreground text-sm leading-relaxed">{option.text}</p>
            </motion.button>
          ))}
        </div>

        {/* Confirm button */}
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
              تأكيد الاختيار
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
