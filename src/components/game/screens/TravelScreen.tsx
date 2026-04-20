import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useSound } from "@/hooks/useSoundEffects";
import cityDriveLuxuryMaleImg from "@/assets/scenes/city-drive-luxury-male.png";
import cityDriveLuxuryFemaleImg from "@/assets/scenes/city-drive-luxury-female.png";
import velaroStreetImg from "@/assets/scenes/velaro-street.png";

interface TravelScreenProps {
  onComplete: () => void;
}

const WAYPOINTS = [
  { label: "📍 Prism Consulting", delay: 0.4 },
  { label: "📍 Luxury District", delay: 1.8 },
  { label: "📍 VELARO", delay: 3.2 },
];

const MONOLOGUES = [
  { text: "يا ترى الصورة الحقيقية عاملة إزاي...", delay: 1000, duration: 1800 },
  { text: "لازم أسمع كويس وأفهم قبل أي حكم...", delay: 3300, duration: 1800 },
];

export const TravelScreen = ({ onComplete }: TravelScreenProps) => {
  const { profile } = useAuth();
  const { playSound } = useSound();
  const [activeWaypoint, setActiveWaypoint] = useState(0);
  const [currentMonologue, setCurrentMonologue] = useState<string | null>(null);
  const [scene, setScene] = useState<"drive" | "street">("drive");

  const driveImg = profile?.gender === "female" ? cityDriveLuxuryFemaleImg : cityDriveLuxuryMaleImg;

  useEffect(() => {
    try { playSound("carEngine"); } catch {}
    const switchTimer = setTimeout(() => setScene("street"), 3200);
    const doneTimer = setTimeout(onComplete, 5800);
    return () => {
      clearTimeout(switchTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete, playSound]);

  useEffect(() => {
    const timers = WAYPOINTS.map((wp, i) => setTimeout(() => setActiveWaypoint(i), wp.delay * 1000));
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
      <AnimatePresence mode="wait">
        <motion.div key={scene} className="absolute inset-0" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}>
          <img src={scene === "drive" ? driveImg : velaroStreetImg} alt="Travel to VELARO" className="w-full h-full object-cover animate-ken-burns" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-30 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="space-y-4">
          <motion.p className="text-3xl" animate={{ x: [0, -4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>🚗</motion.p>
          <h2 className="text-foreground text-xl font-bold" dir="rtl">في الطريق إلى VELARO...</h2>
        </motion.div>

        <AnimatePresence>
          {currentMonologue && (
            <motion.div className="mt-6 px-6 py-3 rounded-xl bg-card/60 border border-border/50" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <p className="text-muted-foreground text-sm italic" dir="rtl">💭 {currentMonologue}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 space-y-3">
          <AnimatePresence>
            {WAYPOINTS.map((wp, i) => i <= activeWaypoint ? (
              <motion.p key={wp.label} className={`text-sm ${i === activeWaypoint ? "text-foreground font-bold" : "text-muted-foreground"}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>{wp.label}</motion.p>
            ) : null)}
          </AnimatePresence>
        </div>

        <motion.div className="w-52 h-1 bg-muted rounded-full mx-auto overflow-hidden mt-8">
          <motion.div className="h-full bg-primary rounded-full" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 5.2, ease: "easeInOut" }} />
        </motion.div>
      </div>
    </div>
  );
};