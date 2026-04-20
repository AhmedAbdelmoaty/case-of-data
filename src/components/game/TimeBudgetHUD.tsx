import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
import { TOTAL_TIME_BUDGET } from "@/lib/pf-case/case-tree";

interface TimeBudgetHUDProps {
  timeRemaining: number;
  lastTimeCost: number;
  /** Increments each time a question is taken; used to retrigger the cost flash */
  flashKey: number;
}

export const TimeBudgetHUD = ({ timeRemaining, lastTimeCost, flashKey }: TimeBudgetHUDProps) => {
  const pct = Math.max(0, Math.min(100, (timeRemaining / TOTAL_TIME_BUDGET) * 100));

  // Tier styling
  const isCritical = timeRemaining > 0 && timeRemaining < 3;
  const isLow = timeRemaining < 6 && timeRemaining >= 3;

  const barColor = isCritical
    ? "bg-destructive"
    : isLow
    ? "bg-orange-500"
    : "bg-primary";

  const textColor = isCritical
    ? "text-destructive"
    : isLow
    ? "text-orange-400"
    : "text-foreground";

  return (
    <div
      className="fixed top-4 left-4 z-30 select-none"
      dir="rtl"
    >
      <div
        className={`relative flex items-center gap-2 px-3 py-2 rounded-xl bg-card/85 backdrop-blur-sm border ${
          isCritical ? "border-destructive/60" : "border-border"
        } shadow-lg ${isCritical ? "animate-pulse" : ""}`}
      >
        <Clock className={`w-4 h-4 ${textColor}`} />
        <div className="flex flex-col gap-1">
          <div className={`text-xs font-medium ${textColor} tabular-nums`}>
            متبقي: {timeRemaining} دقيقة من {TOTAL_TIME_BUDGET}
          </div>
          <div className="w-36 h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className={`h-full ${barColor}`}
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Floating cost indicator */}
        <AnimatePresence>
          {flashKey > 0 && lastTimeCost > 0 && (
            <motion.div
              key={flashKey}
              initial={{ opacity: 0, y: 0, scale: 0.8 }}
              animate={{ opacity: 1, y: -28, scale: 1 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 1.2 }}
              className={`absolute -top-1 left-1/2 -translate-x-1/2 text-sm font-bold tabular-nums ${
                lastTimeCost >= 5 ? "text-destructive" : "text-primary"
              }`}
            >
              -{lastTimeCost} دقايق
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
