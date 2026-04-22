import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useSound } from "@/hooks/useSoundEffects";
import cityDriveLuxuryMaleImg from "@/assets/scenes/city-drive-luxury-male.png";
import cityDriveLuxuryFemaleImg from "@/assets/scenes/city-drive-luxury-female.png";

interface TravelScreenProps {
  onComplete: () => void;
}

const TOTAL_DURATION = 9000;

const MONOLOGUES = [
  { text: "يا ترى الصورة الحقيقية عاملة إزاي...", at: 1400, dur: 2400 },
  { text: "لازم أسمع كويس قبل أي حكم...", at: 4400, dur: 2400 },
  { text: "وصلنا تقريباً... ركّز.", at: 7000, dur: 1800 },
];

// Realistic street-side scenery only
const AMBIENT_EMOJIS = ["🏙️", "🌆", "🚦", "🏢", "🚖", "🏛️"];

export const TravelScreen = ({ onComplete }: TravelScreenProps) => {
  const { profile } = useAuth();
  const { playSound } = useSound();
  const [currentMonologue, setCurrentMonologue] = useState<string | null>(null);

  const driveImg = profile?.gender === "female" ? cityDriveLuxuryFemaleImg : cityDriveLuxuryMaleImg;

  // Faster floating scenery — gives a real sense of speed
  const floatingEmojis = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        id: i,
        emoji: AMBIENT_EMOJIS[i % AMBIENT_EMOJIS.length],
        top: 10 + i * 11,
        delay: i * 0.9,
        duration: 3 + Math.random() * 1.2,
        size: 24 + Math.random() * 10,
        opacity: 0.5,
      })),
    []
  );

  useEffect(() => {
    try { playSound("carEngine"); } catch {}
    const t = setTimeout(onComplete, TOTAL_DURATION);
    return () => clearTimeout(t);
  }, [onComplete, playSound]);

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
      {/* Camera rig: micro-shake (car vibration) wraps a strong zoom+pan */}
      <motion.div
        className="absolute inset-0"
        animate={{ y: [0, -1.2, 0.8, -0.6, 1, 0], x: [0, 0.6, -0.4, 0.8, -0.5, 0] }}
        transition={{ duration: 0.45, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.05, x: "5%" }}
          animate={{ scale: 1.22, x: "-5%" }}
          transition={{ duration: TOTAL_DURATION / 1000, ease: [0.33, 0, 0.67, 1] }}
        >
          <img
            src={driveImg}
            alt="Driving toward VELARO"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30" />
        </motion.div>
      </motion.div>

      {/* Side motion-blur vignette — sells the speed */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background/60 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background/60 to-transparent pointer-events-none z-10" />

      {/* Subtle horizontal speed streaks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={`streak-${i}`}
            className="absolute h-px bg-foreground/15"
            style={{ top: `${20 + i * 18}%`, width: "30%" }}
            initial={{ x: "120vw" }}
            animate={{ x: "-40vw" }}
            transition={{
              duration: 0.9 + Math.random() * 0.4,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Subtle floating realistic scenery */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {floatingEmojis.map((e) => (
          <motion.span
            key={e.id}
            className="absolute"
            style={{
              top: `${e.top}%`,
              fontSize: e.size,
              opacity: e.opacity,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
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

      {/* Foreground UI — minimal */}
      <div className="relative z-30 flex flex-col items-center justify-end min-h-screen text-center px-4 pb-16">
        {/* Simple small caption */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-foreground/85 text-sm tracking-wider"
          dir="rtl"
        >
          🚗 في الطريق إلى <span className="text-accent font-semibold">VELARO</span>
        </motion.p>

        {/* Monologue */}
        <div className="mt-4 min-h-[44px] flex items-center">
          <AnimatePresence mode="wait">
            {currentMonologue && (
              <motion.p
                key={currentMonologue}
                className="text-muted-foreground text-xs italic"
                dir="rtl"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
              >
                💭 {currentMonologue}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Slim progress bar */}
        <div className="mt-4 w-48">
          <div className="w-full h-1 bg-muted/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: TOTAL_DURATION / 1000, ease: "linear" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
