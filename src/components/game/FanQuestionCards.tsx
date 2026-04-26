import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { ChoicePresentation } from "@/lib/pf-case-engine/gameStateMachine";

interface FanQuestionCardsProps {
  choices: ChoicePresentation[];
  onPick: (option: ChoicePresentation) => void;
}

/**
 * Renders question choices as a fanned stack of "paper cards".
 * On pick: the chosen card flashes + lifts, the others throw off-screen,
 * then onPick is invoked.
 */
export const FanQuestionCards = ({ choices, onPick }: FanQuestionCardsProps) => {
  const [pickedId, setPickedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const n = choices.length;
  // Spread cards across a small arc; rotation/y-offset based on index
  const center = (n - 1) / 2;

  const handleClick = (option: ChoicePresentation) => {
    if (pickedId) return;
    setPickedId(option.id);
    // Allow throw-away animation to play, then notify parent
    window.setTimeout(() => onPick(option), 380);
  };

  return (
    <div className="relative w-full max-w-3xl px-4">
      <div
        className="relative mx-auto flex items-end justify-center"
        style={{ minHeight: 180 }}
      >
        <AnimatePresence>
          {choices.map((option, i) => {
            const offset = i - center; // -1, 0, 1 for 3 cards
            const baseRotate = offset * 6;
            const baseX = offset * 60;
            const baseY = Math.abs(offset) * 14;

            const isPicked = pickedId === option.id;
            const isOther = pickedId && !isPicked;
            const isHovered = hoverId === option.id && !pickedId;

            // Throw direction for "other" cards: away from center
            const throwX = offset < 0 ? -window.innerWidth : offset > 0 ? window.innerWidth : (Math.random() < 0.5 ? -1 : 1) * window.innerWidth;
            const throwRot = offset < 0 ? -45 : 45;

            return (
              <motion.button
                key={option.id}
                onMouseEnter={() => setHoverId(option.id)}
                onMouseLeave={() => setHoverId(null)}
                onClick={() => handleClick(option)}
                disabled={!!pickedId}
                dir="rtl"
                className={`absolute w-[260px] sm:w-[300px] rounded-2xl border-2 p-4 text-right shadow-2xl backdrop-blur-md transition-colors ${
                  isPicked
                    ? "border-primary bg-primary/15"
                    : isHovered
                    ? "border-primary/70 bg-card/95"
                    : "border-border/70 bg-card/85 hover:border-primary/50"
                }`}
                style={{
                  transformOrigin: "bottom center",
                  zIndex: isHovered || isPicked ? 30 : 10 + i,
                }}
                initial={{
                  y: 220,
                  x: baseX,
                  rotate: baseRotate,
                  opacity: 0,
                  scale: 0.85,
                }}
                animate={
                  isPicked
                    ? {
                        // Selected card: lift, center, glow flash
                        x: 0,
                        y: -40,
                        rotate: 0,
                        scale: [1.05, 1.15, 1.05],
                        opacity: [1, 1, 0],
                        boxShadow: [
                          "0 0 0px hsl(var(--primary) / 0)",
                          "0 0 60px hsl(var(--primary) / 0.9)",
                          "0 0 30px hsl(var(--primary) / 0.5)",
                        ],
                      }
                    : isOther
                    ? {
                        // Non-picked cards: throw off-screen
                        x: throwX,
                        y: -40,
                        rotate: throwRot,
                        opacity: 0,
                        scale: 0.7,
                      }
                    : {
                        x: baseX + (isHovered ? 0 : 0),
                        y: baseY + (isHovered ? -28 : 0),
                        rotate: isHovered ? 0 : baseRotate,
                        opacity: 1,
                        scale: isHovered ? 1.06 : 1,
                      }
                }
                transition={
                  isPicked
                    ? { duration: 0.36, ease: [0.22, 1, 0.36, 1] }
                    : isOther
                    ? { duration: 0.32, ease: [0.5, 0, 0.75, 0] }
                    : {
                        delay: pickedId ? 0 : i * 0.06,
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                      }
                }
                whileTap={{ scale: 0.97 }}
              >
                {/* Hover badge */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute -top-3 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_18px_hsl(var(--primary)/0.7)]"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Subtle paper texture / gradient line */}
                <div className="mb-2 h-0.5 w-10 rounded-full bg-primary/50" />

                <p className="text-sm leading-relaxed text-foreground">
                  {option.text}
                </p>

                {/* Flash overlay on pick */}
                {isPicked && (
                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-2xl bg-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.85, 0] }}
                    transition={{ duration: 0.36 }}
                  />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
