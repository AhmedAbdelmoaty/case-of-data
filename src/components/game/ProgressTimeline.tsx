import { motion } from "framer-motion";

type Screen =
  | "company-briefing"
  | "travel"
  | "arrival"
  | "inquiry"
  | "reflection"
  | "framing"
  | "presentation"
  | "return-travel"
  | "debrief"
  | "result";

const STAGES: { key: Screen; icon: string; label: string }[] = [
  { key: "company-briefing", icon: "🏢", label: "المكتب" },
  { key: "travel", icon: "🚗", label: "السفر" },
  { key: "arrival", icon: "🏪", label: "الوصول" },
  { key: "inquiry", icon: "❓", label: "الأسئلة" },
  { key: "reflection", icon: "🧠", label: "التأمل" },
  { key: "framing", icon: "📋", label: "التأطير" },
  { key: "presentation", icon: "📊", label: "التقديم" },
  { key: "return-travel", icon: "🚗", label: "العودة" },
  { key: "debrief", icon: "🏢", label: "التقييم" },
  { key: "result", icon: "⭐", label: "النتيجة" },
];

interface ProgressTimelineProps {
  currentScreen: string;
}

export const ProgressTimeline = ({ currentScreen }: ProgressTimelineProps) => {
  const currentIdx = STAGES.findIndex((s) => s.key === currentScreen);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-40 px-2 py-1.5 bg-black/40 backdrop-blur-sm"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center justify-center gap-0.5 max-w-xl mx-auto">
        {STAGES.map((stage, i) => {
          const isPast = i < currentIdx;
          const isCurrent = i === currentIdx;
          const isFuture = i > currentIdx;

          return (
            <div key={stage.key} className="flex items-center">
              <motion.div
                className={`flex flex-col items-center px-1 ${
                  isFuture ? "opacity-30" : ""
                }`}
                animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                transition={isCurrent ? { duration: 2, repeat: Infinity } : {}}
              >
                <span className={`text-xs ${isCurrent ? "text-base" : ""}`}>
                  {isPast ? "✓" : stage.icon}
                </span>
              </motion.div>
              {i < STAGES.length - 1 && (
                <div
                  className={`w-3 h-px mx-0.5 ${
                    isPast ? "bg-primary" : "bg-muted-foreground/20"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
