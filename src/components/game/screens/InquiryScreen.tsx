import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookmarkPlus, Check, ChevronLeft } from "lucide-react";
import { INQUIRY_ROUNDS } from "@/data/pf-scenario";
import { usePFGame } from "@/contexts/PFGameContext";
import { useAuth } from "@/contexts/AuthContext";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { PFNotebook } from "../PFNotebook";
import type { InquiryOption } from "@/data/pf-scenario";

interface InquiryScreenProps {
  onComplete: () => void;
}

export const InquiryScreen = ({ onComplete }: InquiryScreenProps) => {
  const { state, chooseQuestion, addNote } = usePFGame();
  const { profile } = useAuth();
  const { currentRound, notes } = state;

  const [phase, setPhase] = useState<"pick" | "response">("pick");
  const [selectedOption, setSelectedOption] = useState<InquiryOption | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  const round = INQUIRY_ROUNDS[currentRound];

  // Shuffle options once per round
  const shuffledOptions = useMemo(() => {
    if (!round) return [];
    const arr = [...round.options];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [currentRound, round]);

  // If all rounds done, move to framing
  useEffect(() => {
    if (currentRound >= INQUIRY_ROUNDS.length) {
      onComplete();
    }
  }, [currentRound, onComplete]);

  if (!round || currentRound >= INQUIRY_ROUNDS.length) return null;

  const handlePickQuestion = (option: InquiryOption) => {
    setSelectedOption(option);
    chooseQuestion(option);
    setPhase("response");
    setShowSaved(false);
  };

  const handleSaveNote = () => {
    if (selectedOption) {
      addNote(round.id, selectedOption.response);
      setShowSaved(true);
    }
  };

  const isNoteSaved = notes.some((n) => n.roundId === round.id);

  const handleNextRound = () => {
    setSelectedOption(null);
    setPhase("pick");
  };

  const playerName = profile?.display_name || "محلل";
  const g = (profile?.gender || "male") as "male" | "female";

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-background to-background" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      {/* Header */}
      <motion.div
        className="relative z-10 pt-6 pb-2 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-muted-foreground text-xs">🏪 Fashion House — محادثة مع أبو سعيد</p>
        <div className="flex items-center justify-center gap-3 mt-2">
          {INQUIRY_ROUNDS.map((_, i) => (
            <div
              key={i}
              className={`w-8 h-1.5 rounded-full transition-all ${
                i < currentRound
                  ? "bg-primary"
                  : i === currentRound
                  ? "bg-accent"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
        <p className="text-muted-foreground text-xs mt-1">
          جولة {currentRound + 1} من {INQUIRY_ROUNDS.length}
        </p>
      </motion.div>

      <PFNotebook />

      <AnimatePresence mode="wait">
        {phase === "pick" && (
          <motion.div
            key={`pick-${currentRound}`}
            className="relative z-10 max-w-lg mx-auto px-4 pt-6 pb-24"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <h3 className="text-foreground font-bold text-lg mb-2 text-center" dir="rtl">
              اختار سؤالك
            </h3>
            <p className="text-muted-foreground text-sm text-center mb-6" dir="rtl">
              اختار السؤال اللي شايف إنه الأنسب تسأله لأبو سعيد دلوقتي.
            </p>

            <div className="space-y-3">
              {shuffledOptions.map((option, i) => (
                <motion.button
                  key={option.id}
                  onClick={() => handlePickQuestion(option)}
                  className="w-full p-4 rounded-xl bg-card/80 backdrop-blur-sm border border-border hover:border-primary/50 hover:bg-card transition-all text-right"
                  dir="rtl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <p className="text-foreground text-sm leading-relaxed">{option.text}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "response" && selectedOption && (
          <motion.div
            key={`response-${currentRound}`}
            className="relative z-10 max-w-lg mx-auto px-4 pt-6 pb-24"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            {/* Player question bubble */}
            <motion.div
              className="p-4 rounded-xl bg-primary/10 border border-primary/30 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-xs text-primary font-bold mb-1">{playerName}</p>
              <p className="text-foreground text-sm leading-relaxed" dir="rtl">
                {selectedOption.text}
              </p>
            </motion.div>

            {/* Abu Saeed response */}
            <motion.div
              className="p-4 rounded-xl bg-teal-900/30 border border-teal-500/30 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-xs text-teal-400 font-bold mb-1">أبو سعيد</p>
              <p className="text-foreground text-sm leading-relaxed" dir="rtl">
                {selectedOption.response}
              </p>
            </motion.div>

            {/* Save to notebook */}
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <button
                onClick={handleSaveNote}
                disabled={isNoteSaved || showSaved}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  isNoteSaved || showSaved
                    ? "bg-green-500/20 border border-green-500/50 text-green-400 cursor-default"
                    : "bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30"
                }`}
              >
                {isNoteSaved || showSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    تم الحفظ في الدفتر
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-4 h-4" />
                    احفظ في الدفتر
                  </>
                )}
              </button>
            </motion.div>

            {/* Next round button */}
            <motion.button
              onClick={handleNextRound}
              className="w-full py-3 rounded-xl font-bold text-base text-primary-foreground"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {currentRound >= INQUIRY_ROUNDS.length
                ? "اختار التأطير النهائي"
                : "السؤال التالي ▶"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
