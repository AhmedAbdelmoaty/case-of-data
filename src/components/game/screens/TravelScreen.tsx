import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useSound } from "@/hooks/useSoundEffects";
import cityDriveLuxuryMaleImg from "@/assets/scenes/city-drive-luxury-male.png";
import cityDriveLuxuryFemaleImg from "@/assets/scenes/city-drive-luxury-female.png";

interface TravelScreenProps {
  onComplete: () => void;
}

const TOTAL_DURATION = 9000; // 9 seconds — feels like a real drive

const WAYPOINTS = [
  { label: "📍 Pinnacle Consulting", at: 600 },
  { label: "📍 Downtown", at: 2800 },
  { label: "📍 Luxury District", at: 5200 },
  { label: "📍 VELARO قريب...", at: 7600 },
];

const MONOLOGUES = [
  { text: "يا ترى الصورة الحقيقية عاملة إزاي...", at: 1200, dur: 2200 },
  { text: "لازم أسمع كويس وأفهم قبل أي حكم...", at: 4000, dur: 2200 },
  { text: "وصلنا تقريباً... ركّز.", at: 6800, dur: 1800 },
];

// Floating ambient emojis crossing the screen
const AMBIENT_EMOJIS = ["🏙️", "🌆", "🚦", "🏢", "✨", "🌃", "🚖", "🏛️"];

export const TravelScreen = ({ onComplete }: TravelScreenProps) => {
  const { profile } = useAuth();
  const { playSound } = useSound();
  const [activeWaypoint, setActiveWaypoint] = useState(-1);
  const [currentMonologue, setCurrentMonologue] = useState<string | null>(null);

  const driveImg = profile?.gender === "female" ? cityDriveLuxuryFemaleImg : cityDriveLuxuryMaleImg;

  // Generate floating emoji positions once
  const floatingEmojis = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        emoji: AMBIENT_EMOJIS[i % AMBIENT_EMOJIS.length],
        top: 10 + Math.random() * 70, // %
        delay: Math.random() * 6,
        duration: 3 + Math.random() * 3,
        size: 18 + Math.random() * 18,
        opacity: 0.35 + Math.random() * 0.4,
      })),
    []
  );

  // Speed lines
  const speedLines = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        duration: 0.6 + Math.random() * 0.6,
        height: 30 + Math.random() * 60,
      })),
    []
  );

  useEffect(() => {
    try { playSound("carEngine"); } catch {}
    const t = setTimeout(onComplete, TOTAL_DURATION);
    return () => clearTimeout(t);
  }, [onComplete, playSound]);

  useEffect(() => {
    const timers = WAYPOINTS.map((wp, i) =>
      setTimeout(() => setActiveWaypoint(i), wp.at)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    MONOLOGUES.forEach((m) => {
      timers.push(setTimeout(() => setCurrentMonologue(m.text), m.at));
      timers.push(setTimeout(() => setCurrentMonologue(null), m.at + m.dur));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Background image with parallax pan + camera shake */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: [0, -3, 2, -2, 3, 0],
          y: [0, 1, -1, 2, -1, 0],
        }}
        transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.15, x: "5%" }}
          animate={{ scale: 1.05, x: "-5%" }}
          transition={{ duration: TOTAL_DURATION / 1000, ease: "linear" }}
        >
          <img
            src={driveImg}
            alt="Driving toward VELARO"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Vignette gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-background/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_hsl(var(--background)/0.6)_100%)]" />
      </motion.div>

      {/* Speed lines — sense of velocity */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {speedLines.map((line) => (
          <motion.div
            key={line.id}
            className="absolute w-[2px] bg-gradient-to-b from-transparent via-primary/60 to-transparent"
            style={{ left: `${line.left}%`, height: line.height }}
            initial={{ y: "-20%", opacity: 0 }}
            animate={{ y: "120vh", opacity: [0, 0.7, 0] }}
            transition={{
              duration: line.duration,
              delay: line.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Floating ambient emojis (passing scenery) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingEmojis.map((e) => (
          <motion.span
            key={e.id}
            className="absolute"
            style={{
              top: `${e.top}%`,
              fontSize: e.size,
              opacity: e.opacity,
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
            }}
            initial={{ x: "110vw" }}
            animate={{ x: "-15vw" }}
            transition={{
              duration: e.duration,
              delay: e.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {e.emoji}
          </motion.span>
        ))}
      </div>

      {/* Foreground UI */}
      <div className="relative z-30 flex flex-col items-center justify-center min-h-screen text-center px-4">
        {/* Animated header card */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-3 px-6 py-4 rounded-2xl bg-card/55 backdrop-blur-md border border-primary/20 shadow-[0_0_40px_hsl(var(--primary)/0.25)]"
        >
          <motion.div
            className="text-5xl"
            animate={{ x: [-6, 6, -6], y: [0, -2, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
          >
            🚗💨
          </motion.div>
          <h2 className="text-foreground text-xl font-bold tracking-wide" dir="rtl">
            في الطريق إلى{" "}
            <span className="text-accent">VELARO</span>
            ...
          </h2>
        </motion.div>

        {/* Monologue */}
        <div className="mt-6 min-h-[60px] flex items-center">
          <AnimatePresence mode="wait">
            {currentMonologue && (
              <motion.div
                key={currentMonologue}
                className="px-6 py-3 rounded-xl bg-card/70 backdrop-blur-sm border border-border/60 max-w-md"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-muted-foreground text-sm italic" dir="rtl">
                  💭 {currentMonologue}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Waypoints */}
        <div className="mt-6 space-y-2 min-h-[120px]">
          <AnimatePresence>
            {WAYPOINTS.map((wp, i) =>
              i <= activeWaypoint ? (
                <motion.div
                  key={wp.label}
                  initial={{ opacity: 0, x: 30, scale: 0.9 }}
                  animate={{
                    opacity: i === activeWaypoint ? 1 : 0.5,
                    x: 0,
                    scale: i === activeWaypoint ? 1.05 : 1,
                  }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className={`text-sm ${
                    i === activeWaypoint
                      ? "text-accent font-bold drop-shadow-[0_0_8px_hsl(var(--accent)/0.6)]"
                      : "text-muted-foreground"
                  }`}
                >
                  {wp.label}
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </div>

        {/* Progress bar with glow */}
        <div className="mt-6 w-64">
          <motion.div className="w-full h-1.5 bg-muted/40 rounded-full overflow-hidden border border-border/30">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full shadow-[0_0_12px_hsl(var(--primary)/0.8)]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: TOTAL_DURATION / 1000, ease: "linear" }}
            />
          </motion.div>
          <p className="text-[10px] text-muted-foreground mt-2 tracking-widest" dir="rtl">
            🛣️ الرحلة جارية...
          </p>
        </div>
      </div>
    </div>
  );
};
