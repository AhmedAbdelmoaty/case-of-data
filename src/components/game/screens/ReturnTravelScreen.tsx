import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/useSoundEffects";
import cityDriveReturnImg from "@/assets/scenes/city-drive-return.png";

interface ReturnTravelScreenProps {
  onComplete: () => void;
}

const WAYPOINTS = [
  { label: "📍 Fashion House", delay: 0.5 },
  { label: "📍 الطريق السريع", delay: 1.5 },
  { label: "🏢 Pinnacle Consulting", delay: 2.5 },
];

export const ReturnTravelScreen = ({ onComplete }: ReturnTravelScreenProps) => {
  const { playSound } = useSound();
  const [activeWaypoint, setActiveWaypoint] = useState(0);

  useEffect(() => {
    try { playSound("carEngine"); } catch {}
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete, playSound]);

  useEffect(() => {
    const timers = WAYPOINTS.map((wp, i) =>
      setTimeout(() => setActiveWaypoint(i), wp.delay * 1000)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1, x: -30 }}
        animate={{ scale: 1, x: 30 }}
        transition={{ duration: 3.5, ease: "linear" }}
      >
        <img src={cityDriveReturnImg} alt="" className="w-full h-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-4"
        >
          <motion.p
            className="text-3xl"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            🚗
          </motion.p>
          <h2 className="text-foreground text-xl font-bold" dir="rtl">
            في الطريق للمكتب...
          </h2>
        </motion.div>

        <div className="mt-8 space-y-3">
          <AnimatePresence>
            {WAYPOINTS.map((wp, i) =>
              i <= activeWaypoint ? (
                <motion.p
                  key={wp.label}
                  className={`text-sm ${i === activeWaypoint ? "text-foreground font-bold" : "text-muted-foreground"}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  dir="rtl"
                >
                  {wp.label}
                </motion.p>
              ) : null
            )}
          </AnimatePresence>
        </div>

        <motion.div className="w-48 h-1 bg-muted rounded-full mx-auto overflow-hidden mt-8">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
};
