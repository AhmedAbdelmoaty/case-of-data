import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import cityDriveImg from "@/assets/scenes/city-drive.png";

interface TravelScreenProps {
  onComplete: () => void;
}

const WAYPOINTS = [
  { label: "📍 وسط المدينة", delay: 0.5 },
  { label: "📍 المنطقة التجارية", delay: 1.8 },
  { label: "📍 Fashion House", delay: 3.0 },
];

export const TravelScreen = ({ onComplete }: TravelScreenProps) => {
  const [activeWaypoint, setActiveWaypoint] = useState(0);

  useEffect(() => {
    const timer = setTimeout(onComplete, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  useEffect(() => {
    const timers = WAYPOINTS.map((wp, i) =>
      setTimeout(() => setActiveWaypoint(i), wp.delay * 1000)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1, x: 30 }}
        animate={{ scale: 1, x: -30 }}
        transition={{ duration: 4.5, ease: "linear" }}
      >
        <img src={cityDriveImg} alt="" className="w-full h-full object-cover" />
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
            animate={{ x: [0, -5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            🚗
          </motion.p>
          <h2 className="text-foreground text-xl font-bold" dir="rtl">
            في الطريق لمتجر Fashion House...
          </h2>
        </motion.div>

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
            transition={{ duration: 4, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
};
