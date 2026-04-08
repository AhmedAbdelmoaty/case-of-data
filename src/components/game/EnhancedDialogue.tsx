import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookmarkPlus, Check, X } from "lucide-react";
import { AnimatedCharacter, type CharacterId } from "./AnimatedCharacter";
import analystImg from "@/assets/characters/analyst.png";
import saraImg from "@/assets/characters/sara.png";

interface DialogueLine {
  characterId: string;
  text: string;
  mood?: "neutral" | "happy" | "nervous" | "angry" | "suspicious";
  isSaveable?: boolean;
  saveId?: string;
  saveText?: string;
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
      setInternalIndex(0);
      setDisplayedText("");
      setIsTyping(false);
      setShowSaveButton(false);
    }
  }, [isActive]);

  // Typing effect
  useEffect(() => {
    if (!isActive || !currentDialogue) return;

    setDisplayedText("");
    setIsTyping(true);
    setShowSaveButton(false);

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

  const handleBackdropClick = () => {
    if (allowClickOutside) {
      handleClose();
    }
  };

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
                className="flex items-center justify-between mt-4 pt-3 border-t border-border/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-xs text-muted-foreground">
                  {currentIndex + 1} / {dialogues.length}
                </span>
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