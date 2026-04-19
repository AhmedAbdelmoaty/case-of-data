import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, BookOpen, CheckCircle2 } from "lucide-react";
import { usePFGame } from "@/contexts/PFGameContext";
import { useSound } from "@/hooks/useSoundEffects";
import { PFNotebook } from "../PFNotebook";
import { StampEffect } from "../StampEffect";
import { FRAMING_BUILDER_SECTIONS } from "@/data/pf-case";
import type { FramingSubmission } from "@/data/pf-case";
import storeCounterImg from "@/assets/scenes/store-counter.png";

interface FramingScreenProps {
  onComplete: () => void;
}

export const FramingScreen = ({ onComplete }: FramingScreenProps) => {
  const { state, submitFramingParts } = usePFGame();
  const { playSound } = useSound();

  const [submission, setSubmission] = useState<FramingSubmission>({
    clientViewId: state.framingPart1,
    flawId: state.framingPart2,
    trueFrameId: state.framingPart3,
    nextDecisionId: state.framingPart4,
  });

  const [confirmed, setConfirmed] = useState(false);
  const [showStamp, setShowStamp] = useState(false);
  const [flash, setFlash] = useState(false);

  const allSelected = useMemo(() => {
    return (
      !!submission.clientViewId &&
      !!submission.flawId &&
      !!submission.trueFrameId &&
      !!submission.nextDecisionId
    );
  }, [submission]);

  const handleSelect = (sectionId: string, optionId: string) => {
    if (confirmed) return;

    setSubmission((prev) => {
      if (sectionId === "client_view") {
        return { ...prev, clientViewId: optionId };
      }
      if (sectionId === "flaw_in_view") {
        return { ...prev, flawId: optionId };
      }
      if (sectionId === "true_frame") {
        return { ...prev, trueFrameId: optionId };
      }
      return { ...prev, nextDecisionId: optionId };
    });

    try {
      playSound("tick");
    } catch {}
  };

  const handleConfirm = () => {
    if (!allSelected || confirmed) return;

    submitFramingParts(submission);
    setConfirmed(true);
    setShowStamp(true);
    setFlash(true);

    try {
      playSound("stamp");
    } catch {}

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
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="text-5xl mb-4"
            animate={{ scale: [1, 1.08, 1], rotate: [0, -4, 4, 0] }}
            transition={{ duration: 2, repeat: 1 }}
          >
            🧠
          </motion.div>

          <h1 className="text-xl font-bold text-foreground mb-2" dir="rtl">
            وقت التأطير
          </h1>

          <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed" dir="rtl">
            دلوقتي محتاج تبني فهمك للمشكلة بشكل واضح.  
            مش المطلوب تختار حل... المطلوب تحدد: أبو سعيد كان شايف المشكلة إزاي، والخلل الحقيقي كان فين.
          </p>

          <p className="text-muted-foreground text-xs mt-3 flex items-center justify-center gap-1" dir="rtl">
            <BookOpen className="w-3.5 h-3.5" />
            راجع الدفتر قبل ما تعتمد الـframing النهائي
          </p>
        </motion.div>

        <div className="space-y-5">
          {FRAMING_BUILDER_SECTIONS.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-4"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <div className="mb-4 text-right" dir="rtl">
                <div className="flex items-center justify-end gap-2 mb-1">
                  <span className="text-xs text-primary font-bold">
                    جزء {sectionIndex + 1}
                  </span>
                </div>
                <h2 className="text-foreground font-bold text-base">{section.title}</h2>
              </div>

              <div className="space-y-3">
                {section.options.map((option, optionIndex) => {
                  const selected =
                    (section.id === "client_view" && submission.clientViewId === option.id) ||
                    (section.id === "flaw_in_view" && submission.flawId === option.id) ||
                    (section.id === "true_frame" && submission.trueFrameId === option.id) ||
                    (section.id === "next_decision" && submission.nextDecisionId === option.id);

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

        <AnimatePresence>
          {confirmed && !showStamp && (
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, scale: 0.85 }}
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
                بتجمع التأطير النهائي عشان تقدمه لأبو سعيد...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
