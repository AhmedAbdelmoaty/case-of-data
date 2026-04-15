import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/useSoundEffects";
import carInteriorImg from "@/assets/scenes/car-interior.jpg";

interface TravelScreenProps {
  onComplete: () => void;
}

const WAYPOINTS = [
  { label: "📍 وسط المدينة", delay: 0.5 },
  { label: "📍 المنطقة التجارية", delay: 1.8 },
  { label: "📍 Fashion House", delay: 3.0 },
];

const MONOLOGUES = [
  { text: "يا ترى المشكلة فين بالظبط...", delay: 1000, duration: 2000 },
  { text: "لازم أسمع كويس وأفهم قبل ما أحكم...", delay: 3500, duration: 2000 },
];

export const TravelScreen = ({ onComplete }: TravelScreenProps) => {
  const { playSound } = useSound();
  const [activeWaypoint, setActiveWaypoint] = useState(0);
  const [currentMonologue, setCurrentMonologue] = useState<string | null>(null);

  useEffect(() => {
    try { playSound("carEngine"); } catch {}
    const timer = setTimeout(onComplete, 5500);
    return () => clearTimeout(timer);
  }, [onComplete, playSound]);

  useEffect(() => {
    const timers = WAYPOINTS.map((wp, i) =>
      setTimeout(() => setActiveWaypoint(i), wp.delay * 1000)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    MONOLOGUES.forEach((m) => {
      timers.push(setTimeout(() => setCurrentMonologue(m.text), m.delay));
      timers.push(setTimeout(() => setCurrentMonologue(null), m.delay + m.duration));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1, x: 30 }}
        animate={{ scale: 1, x: -30 }}
        transition={{ duration: 5.5, ease: "linear" }}
      >
        <img src={carInteriorImg} alt="" className="w-full h-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

      {/* Car window frame */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="absolute inset-0 border-[12px] border-black/40 rounded-[2rem]" />
        {/* Rearview mirror hint */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-6 bg-black/30 rounded-b-lg" />
      </div>

      {/* Floating city silhouettes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-20"
            style={{ top: `${20 + i * 10}%` }}
            initial={{ right: "-10%" }}
            animate={{ right: "110%" }}
            transition={{
              duration: 3 + i * 0.5,
              delay: i * 0.8,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {["🌴", "🏢", "🏬", "🌳", "🏗️"][i]}
          </motion.div>
        ))}
      </div>

      <div className="relative z-30 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-4"
        >
          <motion.p
            className="text-3xl"
            animate={{ x: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            🚗
          </motion.p>
          <h2 className="text-foreground text-xl font-bold" dir="rtl">
            في الطريق لمتجر Fashion House...
          </h2>
        </motion.div>

        {/* Internal monologue */}
        <AnimatePresence>
          {currentMonologue && (
            <motion.div
              className="mt-6 px-6 py-3 rounded-xl bg-card/40 backdrop-blur-sm border border-border/30"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-muted-foreground text-sm italic" dir="rtl">
                💭 {currentMonologue}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Waypoints */}
        <div className="mt-8 space-y-3">
          <AnimatePresence>
            {WAYPOINTS.map((wp, i) =>
              i <= activeWaypoint ? (
                <motion.p
                  key={wp.label}
                  className={`text-sm ${i === activeWaypoint ? "text-foreground font-bold" : "text-muted-foreground"}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  dir="rtl"
                >
                  {wp.label}
                </motion.p>
              ) : null
            )}
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <motion.div className="w-48 h-1 bg-muted rounded-full mx-auto overflow-hidden mt-8">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
};
