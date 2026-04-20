import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import analystReflectingMaleImg from "@/assets/scenes/analyst-reflecting-male.png";
import analystReflectingFemaleImg from "@/assets/scenes/analyst-reflecting-female.png";

interface ReflectionTransitionProps {
  onComplete: () => void;
}

export const ReflectionTransition = ({ onComplete }: ReflectionTransitionProps) => {
  const { profile } = useAuth();
  const bg = profile?.gender === "female" ? analystReflectingFemaleImg : analystReflectingMaleImg;

  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
        <img src={bg} alt="Analyst reflecting" className="w-full h-full object-cover animate-ken-burns" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-transparent" />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="space-y-6">
          <motion.div className="text-5xl" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>🧠</motion.div>
          <h2 className="text-foreground text-lg font-bold" dir="rtl">بتراجع اللي جمعته من الحوار...</h2>
          <motion.p className="text-muted-foreground text-sm max-w-sm leading-relaxed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} dir="rtl">
            وبتحاول تحدد: أستاذ هشام كان شايف المشكلة إزاي، والخلل الحقيقي كان فين قبل ما تبني الـ framing النهائي.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};