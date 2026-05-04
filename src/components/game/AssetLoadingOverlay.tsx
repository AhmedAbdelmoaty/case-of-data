import { motion, AnimatePresence } from "framer-motion";

interface AssetLoadingOverlayProps {
  visible: boolean;
  progress: number;
  label?: string;
}

export const AssetLoadingOverlay = ({
  visible,
  progress,
  label = "جاري تجهيز المشهد",
}: AssetLoadingOverlayProps) => {
  const pct = Math.max(6, Math.min(100, Math.round(progress * 100)));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-background/95 backdrop-blur-md px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="w-full max-w-sm text-center" dir="rtl">
            <div className="mb-4 text-sm font-bold text-primary">{label}</div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-l from-primary via-amber-300 to-teal-300"
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.18, ease: "linear" }}
              />
            </div>
            <div className="mt-3 text-xs text-muted-foreground">{pct}%</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
