import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import velaroStreetImg from "@/assets/scenes/velaro-street.png";

interface VelaroStreetScreenProps {
  onComplete: () => void;
}

const TOTAL_DURATION = 4500;

export const VelaroStreetScreen = ({ onComplete }: VelaroStreetScreenProps) => {
  const [showCaption, setShowCaption] = useState(false);
  const [showSubtext, setShowSubtext] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowCaption(true), 600);
    const t2 = setTimeout(() => setShowSubtext(true), 1800);
    const done = setTimeout(onComplete, TOTAL_DURATION);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background with elegant ken-burns */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1.0, opacity: 1 }}
        transition={{ duration: TOTAL_DURATION / 1000, ease: "easeOut" }}
      >
        <img
          src={velaroStreetImg}
          alt="VELARO storefront from the street"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_hsl(var(--background)/0.55)_100%)]" />
      </motion.div>

      {/* Soft floating particles for atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-accent/40"
            style={{
              left: `${10 + i * 11}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-10, -30, -10],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <AnimatePresence>
          {showCaption && (
            <motion.div
              key="caption"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, type: "spring" }}
              className="px-8 py-5 rounded-2xl bg-card/65 backdrop-blur-md border border-accent/30 shadow-[0_0_50px_hsl(var(--accent)/0.25)]"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-accent animate-pulse" />
                <span className="text-accent text-xs font-bold tracking-widest" dir="rtl">
                  وصلت قدام المتجر
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-[0.35em]">
                VELARO
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSubtext && (
            <motion.div
              key="subtext"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-6 space-y-2"
            >
              <motion.p
                className="text-muted-foreground text-sm italic"
                dir="rtl"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                💭 لحظة الحقيقة قربت...
              </motion.p>
              <p className="text-foreground/80 text-xs tracking-wider" dir="rtl">
                🚶 خطوة وهتقابل أ. هشام
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
