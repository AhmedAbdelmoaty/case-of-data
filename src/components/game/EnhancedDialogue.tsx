import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookmarkPlus, Check, X, ChevronRight, FileText } from "lucide-react";
import { AnimatedCharacter, type CharacterId } from "./AnimatedCharacter";
import { ReportDocument } from "./ReportDocument";
import type { EvidenceData } from "@/lib/pf-case/evidence-catalog";
import analystImg from "@/assets/characters/analyst.png";
import saraImg from "@/assets/characters/sara.png";

interface DialogueLine {
  characterId: string;
  text: string;
  mood?: "neutral" | "happy" | "nervous" | "angry" | "suspicious";
  isSaveable?: boolean;
  saveId?: string;
  saveText?: string;
  audioSrc?: string;
  inlineEvidence?: EvidenceData;
}

interface EnhancedDialogueProps {
  dialogues: DialogueLine[];
  isActive: boolean;
  onComplete?: () => void;
  onClose?: () => void;
  allowClickOutside?: boolean;
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
  onSaveNote?: (saveId: string, saveText: string) => void;
  savedNoteIds?: string[];
  playerName?: string;
  playerGender?: "male" | "female";
}

const characterColors: Record<string, { bg: string; border: string; name: string }> = {
  ahmed: { bg: "from-cyan-900/90 to-cyan-950/90", border: "border-cyan-500/50", name: "text-cyan-400" },
  sara: { bg: "from-purple-900/90 to-purple-950/90", border: "border-purple-500/50", name: "text-purple-400" },
  karim: { bg: "from-red-900/90 to-red-950/90", border: "border-red-500/50", name: "text-red-400" },
  detective: { bg: "from-amber-900/90 to-amber-950/90", border: "border-amber-500/50", name: "text-amber-400" },
  abuSaeed: { bg: "from-teal-900/90 to-teal-950/90", border: "border-teal-500/50", name: "text-teal-400" },
  khaled: { bg: "from-red-900/90 to-red-950/90", border: "border-red-500/50", name: "text-red-400" },
  noura: { bg: "from-purple-900/90 to-purple-950/90", border: "border-purple-500/50", name: "text-purple-400" },
  umFahd: { bg: "from-cyan-900/90 to-cyan-950/90", border: "border-cyan-500/50", name: "text-cyan-400" },
  mansour: { bg: "from-emerald-900/90 to-emerald-950/90", border: "border-emerald-500/50", name: "text-emerald-400" },
};

const characterNames: Record<string, { ar: string; en: string }> = {
  ahmed: { ar: "أحمد", en: "Ahmed" },
  sara: { ar: "سارة", en: "Sara" },
  karim: { ar: "كريم", en: "Karim" },
  detective: { ar: "المحلل", en: "Analyst" },
  abuSaeed: { ar: "أبو سعيد", en: "Abu Saeed" },
  khaled: { ar: "خالد", en: "Khaled" },
  noura: { ar: "نورة", en: "Noura" },
  umFahd: { ar: "أميرة", en: "Amira" },
  mansour: { ar: "أ. منصور", en: "A. Mansour" },
};

export const EnhancedDialogue = ({
  dialogues,
  isActive,
  onComplete,
  onClose,
  allowClickOutside = false,
  currentIndex: externalIndex,
  onIndexChange,
  onSaveNote,
  savedNoteIds = [],
  playerName,
  playerGender,
}: EnhancedDialogueProps) => {
  const [internalIndex, setInternalIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  const currentIndex = externalIndex ?? internalIndex;
  const setCurrentIndex = onIndexChange ?? setInternalIndex;
  
  const currentDialogue = dialogues[currentIndex];
  const colors = characterColors[currentDialogue?.characterId || "detective"];
  const isDetective = currentDialogue?.characterId === "detective";
  const resolvedNames = isDetective && playerName
    ? { ar: playerName, en: playerName }
    : characterNames[currentDialogue?.characterId || "detective"];
  const detectiveImageOverride = isDetective && playerGender
    ? (playerGender === "female" ? saraImg : analystImg)
    : undefined;

  // Reset state when deactivated
  useEffect(() => {
    if (!isActive) {
      stopAudio();
      setInternalIndex(0);
      setDisplayedText("");
      setIsTyping(false);
      setShowSaveButton(false);
    }
  }, [isActive]);

  // Typing effect
  useEffect(() => {
    if (!isActive || !currentDialogue) return;

    stopAudio();
    setDisplayedText("");
    setIsTyping(true);
    setShowSaveButton(false);

    // Play voice over if available
    if (currentDialogue.audioSrc) {
      try {
        const audio = new Audio(currentDialogue.audioSrc);
        audioRef.current = audio;
        audio.play().catch(() => {/* silent fallback */});
      } catch {/* silent fallback */}
    }

    let charIndex = 0;
    const text = currentDialogue.text;

    const typingInterval = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
        if (currentDialogue.isSaveable) {
          setShowSaveButton(true);
        }
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [currentIndex, isActive, currentDialogue]);

  const handleClose = () => {
    stopAudio();
    if (onClose) {
      onClose();
    } else {
      onComplete?.();
    }
  };

  const handleNext = () => {
    if (isTyping) {
      setDisplayedText(currentDialogue.text);
      setIsTyping(false);
      if (currentDialogue.isSaveable) {
        setShowSaveButton(true);
      }
      return;
    }

    if (currentIndex < dialogues.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete?.();
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentDialogue.saveId && currentDialogue.saveText && onSaveNote) {
      onSaveNote(currentDialogue.saveId, currentDialogue.saveText);
    }
  };

  const handlePrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentIndex > 0) {
      stopAudio();
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleBackdropClick = () => {
    if (allowClickOutside) {
      handleClose();
    }
  };

  // Keyboard navigation: ← back, →/Space forward
  useEffect(() => {
    if (!isActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, currentIndex, isTyping, currentDialogue]);

  if (!isActive || !currentDialogue) return null;

  const isSaved = currentDialogue.saveId ? savedNoteIds.includes(currentDialogue.saveId) : false;
  const validCharacterIds: CharacterId[] = ["ahmed", "sara", "karim", "detective", "abuSaeed", "khaled", "noura", "umFahd", "mansour"];
  const animCharId = validCharacterIds.includes(currentDialogue.characterId as CharacterId)
    ? (currentDialogue.characterId as CharacterId)
    : "detective";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50"
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 200, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <motion.div
          className="flex justify-center mb-4"
          key={currentDialogue.characterId}
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <AnimatedCharacter
            characterId={animCharId}
            size="lg"
            isActive
            isSpeaking={isTyping}
            mood={currentDialogue.mood || "neutral"}
            showName={false}
            entrance="bounce"
            imageOverride={detectiveImageOverride}
          />
        </motion.div>

        <motion.div
          className={`mx-4 mb-4 rounded-xl border backdrop-blur-md cursor-pointer bg-gradient-to-r ${colors.bg} ${colors.border} p-6 relative`}
          onClick={handleNext}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          layoutId="dialogue-box"
        >
          {/* Close button - top right */}
          <button
            onClick={(e) => { e.stopPropagation(); handleClose(); }}
            className="absolute top-3 left-3 p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white/90 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <motion.div
            className="flex items-center gap-3 mb-3"
            key={currentDialogue.characterId}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <h4 className={`font-bold text-lg ${colors.name}`}>
              {resolvedNames.ar}
            </h4>
            <span className="text-muted-foreground text-sm">
              ({resolvedNames.en})
            </span>
          </motion.div>

          <p className="text-foreground text-lg leading-relaxed" dir="rtl">
            {displayedText}
            {isTyping && (
              <motion.span
                className="inline-block w-3 h-5 bg-primary ml-1 align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </p>

          {!isTyping && currentDialogue.inlineEvidence && (
            <motion.div
              className="mt-3 rounded-xl border border-primary/40 bg-primary/5 p-3 flex items-center justify-between gap-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              dir="rtl"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FileText className="w-5 h-5 text-primary shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] text-muted-foreground">
                    أبو سعيد سلّمك تقرير
                  </span>
                  <span className="text-sm font-bold text-foreground truncate">
                    {currentDialogue.inlineEvidence.title}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setReportOpen(true);
                }}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors"
              >
                افتح التقرير
              </button>
            </motion.div>
          )}

          {/* Report modal */}
          <AnimatePresence>
            {reportOpen && currentDialogue.inlineEvidence && (
              <motion.div
                className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setReportOpen(false);
                }}
              >
                <motion.div
                  className="relative max-w-xl w-full max-h-[88vh] overflow-y-auto"
                  initial={{ scale: 0.92, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.92, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setReportOpen(false)}
                    className="absolute -top-2 -left-2 z-10 w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-foreground hover:bg-muted transition-colors shadow-lg"
                    aria-label="إغلاق"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <ReportDocument evidence={currentDialogue.inlineEvidence} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>


          <AnimatePresence>
            {showSaveButton && onSaveNote && currentDialogue.isSaveable && (
              <motion.button
                className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  isSaved
                    ? "bg-neon-green/20 border border-neon-green/50 text-neon-green cursor-default"
                    : "bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30"
                }`}
                onClick={handleSave}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                disabled={isSaved}
              >
                {isSaved ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                {isSaved ? "تم الحفظ في الدفتر" : "احفظ في الدفتر"}
              </motion.button>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!isTyping && (
              <motion.div
                className="flex items-center justify-between mt-4 pt-3 border-t border-border/30 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-2">
                  <AnimatePresence>
                    {currentIndex > 0 && (
                      <motion.button
                        onClick={handlePrevious}
                        initial={{ opacity: 0, scale: 0.8, x: -8 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: -8 }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.92 }}
                        title="رجوع للجملة السابقة (←)"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/25 text-xs text-white/80 hover:text-white transition-all"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span>رجوع</span>
                      </motion.button>
                    )}
                  </AnimatePresence>
                  <span className="text-xs text-muted-foreground">
                    {currentIndex + 1} / {dialogues.length}
                  </span>
                </div>
                <motion.span
                  className="text-sm text-primary flex items-center gap-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  اضغط للاستمرار
                  <span>▶</span>
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};