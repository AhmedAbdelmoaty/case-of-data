import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, BookOpen, CheckCircle2 } from "lucide-react";
import { usePFGame, FRAMING_SECTIONS } from "@/contexts/PFGameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { PFNotebook } from "../PFNotebook";
import { StampEffect } from "../StampEffect";
import storeCounterImg from "@/assets/scenes/store-counter.png";

interface FramingScreenProps {
  onComplete: () => void;
}

export const FramingScreen = ({ onComplete }: FramingScreenProps) => {
  const { state, setFramingSelection, submitFraming } = usePFGame();
  const { playSound } = useSound();

  const [confirmed, setConfirmed] = useState(false);
  const [showStamp, setShowStamp] = useState(false);
  const [flash, setFlash] = useState(false);

  const allSelected = useMemo(() => {
    return (
      !!state.framing.client_view &&
      !!state.framing.hypothesis &&
      !!state.framing.true_frame &&
      !!state.framing.next_decision
    );
  }, [state.framing]);

  const handleSelect = (sectionId: keyof typeof state.framing, optionId: string) => {
    if (confirmed) return;
    setFramingSelection(sectionId, optionId);
    try { playSound("tick"); } catch {}
  };

  const handleConfirm = () => {
    if (!allSelected || confirmed) return;
    submitFraming();
    setConfirmed(true);
    setShowStamp(true);
    setFlash(true);
    try { playSound("stamp"); } catch {}
    setTimeout(() => setFlash(false), 120);
    setTimeout(() => {
      setShowStamp(false);
      onComplete();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 overflow-hidden">
        <img src={storeCounterImg} alt="" className="w-full h-full object-cover animate-ken-burns" />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      </div>

      <AnimatePresence>
        {flash && (
          <motion.div
            className="fixed inset-0 z-[90] bg-white pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          />
        )}
      </AnimatePresence>

      <PFNotebook />
      <StampEffect isVisible={showStamp} text="✓ تم التأكيد" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-8">
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <motion.div
            className="text-5xl mb-4"
            animate={{ scale: [1, 1.08, 1], rotate: [0, -4, 4, 0] }}
            transition={{ duration: 2, repeat: 1 }}
          >
            🧠
          </motion.div>
          <h1 className="text-xl font-bold text-foreground mb-2" dir="rtl">وقت التأطير</h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed" dir="rtl">
            دلوقتي محتاج تبني فهمك للمشكلة بشكل واضح. اختار من كل قسم اللي تشوفه الأقرب.
          </p>
          <p className="text-muted-foreground text-xs mt-3 flex items-center justify-center gap-1" dir="rtl">
            <BookOpen className="w-3.5 h-3.5" />
            راجع الدفتر قبل ما تعتمد التأطير
          </p>
        </motion.div>

        <div className="space-y-5">
          {FRAMING_SECTIONS.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-4"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <div className="mb-4 text-right" dir="rtl">
                <h2 className="text-foreground font-bold text-base">{section.title}</h2>
              </div>

              <div className="space-y-3">
                {section.options.map((option, optionIndex) => {
                  const selected = state.framing[section.id] === option.id;
                  return (
                    <motion.button
                      key={option.id}
                      onClick={() => handleSelect(section.id, option.id)}
                      className={`w-full p-4 rounded-xl border text-right transition-all ${
                        selected
                          ? "bg-primary/10 border-primary/50 ring-2 ring-primary/20"
                          : "bg-background/40 border-border hover:border-primary/30"
                      } ${confirmed ? "pointer-events-none" : ""}`}
                      dir="rtl"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: sectionIndex * 0.1 + optionIndex * 0.04 }}
                      whileHover={!confirmed ? { scale: 1.01 } : {}}
                      whileTap={!confirmed ? { scale: 0.99 } : {}}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                            selected ? "border-primary bg-primary/15" : "border-muted-foreground/40"
                          }`}
                        >
                          {selected && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                        </div>
                        <p className="text-foreground text-sm leading-relaxed flex-1">{option.text}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {allSelected && !confirmed && (
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
              أكّد التأطير وقدّم التقرير
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
