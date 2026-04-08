import { useState, useEffect, useMemo, useCallback } from "react";
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

export interface ChoiceOption {
  id: string;
  text: string;
  // Hidden data — not shown to player
  tier?: string;
  points?: number;
  response?: string;
  responseCharacterId?: string;
  responseMood?: "neutral" | "happy" | "nervous" | "angry" | "suspicious";
  isSaveable?: boolean;
  saveId?: string;
}

export interface TimelineEntry {
  type: "line" | "choice";
  // For type "line"
  line?: DialogueLine;
  // For type "choice"
  options?: ChoiceOption[];
}

interface InteractiveDialogueProps {
  timeline: TimelineEntry[];
  isActive: boolean;
  onComplete?: () => void;
  onChoice?: (optionId: string, option: ChoiceOption) => void;
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

const validCharacterIds: CharacterId[] = ["ahmed", "sara", "karim", "detective", "abuSaeed", "khaled", "noura", "umFahd", "mansour"];

/**
 * InteractiveDialogue: same visual shell as EnhancedDialogue,
 * but supports inline choice breakpoints within the conversation.
 * 
 * When the timeline hits a "choice" entry, instead of the usual
 * "press to continue" prompt, the player sees choice buttons.
 * Selecting one injects the player's line + response as typed dialogue.
 */
export const InteractiveDialogue = ({
  timeline,
  isActive,
  onComplete,
  onChoice,
  onSaveNote,
  savedNoteIds = [],
  playerName,
  playerGender,
}: InteractiveDialogueProps) => {
  // We build a "resolved timeline" that grows as choices are made
  const [resolvedLines, setResolvedLines] = useState<DialogueLine[]>([]);
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [currentChoiceOptions, setCurrentChoiceOptions] = useState<ChoiceOption[]>([]);

  // Shuffle utility
  const shuffleArray = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // Initialize: process timeline entries up to first choice
  useEffect(() => {
    if (!isActive) {
      setResolvedLines([]);
      setTimelineIndex(0);
      setCurrentLineIndex(0);
      setDisplayedText("");
      setIsTyping(false);
      setShowChoices(false);
      setShowSaveButton(false);
      return;
    }
    processTimeline(0, []);
  }, [isActive]);

  const processTimeline = useCallback((fromIndex: number, existingLines: DialogueLine[]) => {
    const newLines = [...existingLines];
    let i = fromIndex;

    while (i < timeline.length) {
      const entry = timeline[i];
      if (entry.type === "line" && entry.line) {
        newLines.push(entry.line);
        i++;
      } else if (entry.type === "choice" && entry.options) {
        // Stop here and show choices
        setResolvedLines(newLines);
        setTimelineIndex(i);
        // Start displaying from where we are
        if (newLines.length > 0 && existingLines.length < newLines.length) {
          setCurrentLineIndex(existingLines.length);
        }
        // Don't show choices yet — wait until player reaches this point in dialogue
        return;
      } else {
        i++;
      }
    }

    // No more choices — all done
    setResolvedLines(newLines);
    setTimelineIndex(i);
    if (newLines.length > 0 && existingLines.length < newLines.length) {
      setCurrentLineIndex(existingLines.length);
    }
  }, [timeline]);

  const currentLine = resolvedLines[currentLineIndex];

  // Typing effect
  // (moved below)

  const handleNext = () => {
    if (isTyping && currentLine) {
      setDisplayedText(currentLine.text);
      setIsTyping(false);
      if (currentLine.isSaveable) setShowSaveButton(true);
      return;
    }

    const nextIndex = currentLineIndex + 1;

    if (nextIndex < resolvedLines.length) {
      setCurrentLineIndex(nextIndex);
    } else {
      const atChoice = timelineIndex < timeline.length && 
        timeline[timelineIndex]?.type === "choice";
      
      if (atChoice) {
        const entry = timeline[timelineIndex];
        setCurrentChoiceOptions(shuffleArray(entry.options || []));
        setShowChoices(true);
      } else if (timelineIndex >= timeline.length) {
        onComplete?.();
      }
    }
  };

  const handleChoiceSelect = (option: ChoiceOption) => {
    setShowChoices(false);
    onChoice?.(option.id, option);

    // Inject player line + response into resolved lines
    const playerLine: DialogueLine = {
      characterId: "detective",
      text: option.text,
      mood: "neutral",
    };

    const responseLine: DialogueLine | null = option.response ? {
      characterId: option.responseCharacterId || "abuSaeed",
      text: option.response,
      mood: option.responseMood || "neutral",
      isSaveable: option.isSaveable,
      saveId: option.saveId,
      saveText: option.response,
    } : null;

    const newLines = [...resolvedLines, playerLine];
    if (responseLine) newLines.push(responseLine);

    // Continue processing timeline from the next entry
    const nextTimelineIndex = timelineIndex + 1;
    
    // Process remaining timeline entries
    let i = nextTimelineIndex;
    while (i < timeline.length) {
      const entry = timeline[i];
      if (entry.type === "line" && entry.line) {
        newLines.push(entry.line);
        i++;
      } else if (entry.type === "choice") {
        break;
      } else {
        i++;
      }
    }

    setResolvedLines(newLines);
    setTimelineIndex(i);
    // Move to the player's line (first new line)
    setCurrentLineIndex(resolvedLines.length); // index of playerLine
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentLine?.saveId && currentLine?.saveText && onSaveNote) {
      onSaveNote(currentLine.saveId, currentLine.saveText);
    }
  };

  if (!isActive || (!currentLine && !showChoices)) return null;

  const colors = currentLine ? characterColors[currentLine.characterId || "detective"] : characterColors["detective"];
  const isDetective = currentLine?.characterId === "detective";
  const resolvedNames = isDetective && playerName
    ? { ar: playerName, en: playerName }
    : characterNames[currentLine?.characterId || "detective"];
  const detectiveImageOverride = isDetective && playerGender
    ? (playerGender === "female" ? saraImg : analystImg)
    : undefined;
  const isSaved = currentLine?.saveId ? savedNoteIds.includes(currentLine.saveId) : false;
  const animCharId = currentLine && validCharacterIds.includes(currentLine.characterId as CharacterId)
    ? (currentLine.characterId as CharacterId)
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
        {/* Character */}
        {currentLine && !showChoices && (
          <motion.div
            className="flex justify-center mb-4"
            key={currentLine.characterId + "-" + currentLineIndex}
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <AnimatedCharacter
              characterId={animCharId}
              size="lg"
              isActive
              isSpeaking={isTyping}
              mood={currentLine.mood || "neutral"}
              showName={false}
              entrance="bounce"
              imageOverride={detectiveImageOverride}
            />
          </motion.div>
        )}

        {/* Choice buttons — appear INSIDE the dialogue shell area */}
        {showChoices && (
          <div className="mx-4 mb-4 space-y-2 max-h-[60vh] overflow-y-auto">
            {currentChoiceOptions.map((option, i) => (
              <motion.button
                key={option.id}
                onClick={() => handleChoiceSelect(option)}
                className="w-full p-4 rounded-xl bg-card/90 backdrop-blur-md border border-border hover:border-primary/50 hover:bg-card/95 transition-all text-right"
                dir="rtl"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <p className="text-foreground text-sm leading-relaxed">{option.text}</p>
              </motion.button>
            ))}
          </div>
        )}

        {/* Dialogue box */}
        {currentLine && !showChoices && (
          <motion.div
            className={`mx-4 mb-4 rounded-xl border backdrop-blur-md cursor-pointer bg-gradient-to-r ${colors.bg} ${colors.border} p-6 relative`}
            onClick={handleNext}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            layoutId="dialogue-box"
          >
            <motion.div
              className="flex items-center gap-3 mb-3"
              key={currentLine.characterId}
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

            {/* Save button */}
            <AnimatePresence>
              {showSaveButton && onSaveNote && currentLine.isSaveable && (
                <motion.button
                  className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    isSaved
                      ? "bg-green-500/20 border border-green-500/50 text-green-400 cursor-default"
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

            {/* Continue hint */}
            <AnimatePresence>
              {!isTyping && (
                <motion.div
                  className="flex items-center justify-end mt-4 pt-3 border-t border-border/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
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
        )}
      </motion.div>
    </AnimatePresence>
  );
};
