// ════════════════════════════════════════════════════════════════════════════
// FramingTemplateScreen — شاشة التأطير بالـ 4 خانات (synthesis)
// ════════════════════════════════════════════════════════════════════════════
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ArrowLeft, FileText } from "lucide-react";
import { usePFGameV2 } from "@/contexts/PFGameContextV2";
import { FRAMING_SLOTS, type FramingSlot } from "@/data/pf-scenario";

interface Props { onComplete: () => void; }

export const FramingTemplateScreen = ({ onComplete }: Props) => {
  const { state, setFramingChoice, submitFraming } = usePFGameV2();
  const [submitted, setSubmitted] = useState(state.framingSubmitted);

  const allFilled = FRAMING_SLOTS.every((s) => state.framingChoices[s.id]);

  const handleSubmit = () => {
    submitFraming();
    setSubmitted(true);
  };

  const renderSlot = (slot: FramingSlot, index: number) => {
    const selectedId = state.framingChoices[slot.id];
    return (
      <motion.div
        key={slot.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-card/60 border border-border rounded-xl p-5"
        dir="rtl"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="w-7 h-7 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-sm">
            {index + 1}
          </span>
          <h3 className="font-bold text-foreground">{slot.label}</h3>
        </div>
        <p className="text-muted-foreground text-sm mb-4">{slot.prompt}</p>
        <div className="space-y-2">
          {slot.choices.map((choice) => {
            const isSelected = selectedId === choice.id;
            const showFeedback = submitted && isSelected;
            return (
              <button
                key={choice.id}
                onClick={() => !submitted && setFramingChoice(slot.id, choice.id)}
                disabled={submitted}
                className={`
                  w-full text-right p-3 rounded-lg border transition-all
                  ${isSelected
                    ? showFeedback
                      ? choice.isCorrect
                        ? "bg-emerald-500/20 border-emerald-500/60"
                        : "bg-red-500/20 border-red-500/60"
                      : "bg-accent/20 border-accent/60"
                    : "bg-background/40 border-border/40 hover:border-primary/40"
                  }
                  ${submitted ? "cursor-default" : "cursor-pointer"}
                `}
              >
                <div className="flex items-start gap-2">
                  {showFeedback && (
                    choice.isCorrect
                      ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      : <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <span className="text-foreground text-sm leading-relaxed">{choice.text}</span>
                </div>
                {showFeedback && (
                  <p className={`text-xs mt-2 ${choice.isCorrect ? "text-emerald-300" : "text-red-300"}`}>
                    {choice.explanation}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-10 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <FileText className="w-10 h-10 text-accent mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-foreground mb-2" dir="rtl">تأطير المشكلة</h1>
          <p className="text-muted-foreground" dir="rtl">
            بعد كل الأسئلة اللي سألتها — ركّب الصورة كاملة. اختر إجابة لكل خانة.
          </p>
        </motion.div>

        <div className="space-y-4">
          {FRAMING_SLOTS.map((slot, i) => renderSlot(slot, i))}
        </div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="submit"
              className="mt-8 flex justify-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            >
              <button
                onClick={handleSubmit}
                disabled={!allFilled}
                className={`
                  px-8 py-4 rounded-xl font-bold text-lg transition-all
                  ${allFilled
                    ? "bg-gradient-to-r from-primary to-accent text-white hover:scale-105 shadow-lg shadow-primary/30"
                    : "bg-muted/30 text-muted-foreground cursor-not-allowed"}
                `}
              >
                {allFilled ? "سلّم التأطير" : "املا كل الخانات الأول"}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="next"
              className="mt-8 flex justify-center"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            >
              <button
                onClick={onComplete}
                className="px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-accent to-primary text-white hover:scale-105 flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                شوف النتيجة الكاملة
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
