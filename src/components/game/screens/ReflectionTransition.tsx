import { useEffect } from "react";
import { motion } from "framer-motion";
import storeCounterImg from "@/assets/scenes/store-counter.png";

interface ReflectionTransitionProps {
  onComplete: () => void;
}

export const ReflectionTransition = ({ onComplete }: ReflectionTransitionProps) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2 }}
      >
        <img src={storeCounterImg} alt="" className="w-full h-full object-cover blur-sm" />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/60" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <motion.div
            className="text-5xl"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🧠
          </motion.div>

          <h2 className="text-foreground text-lg font-bold" dir="rtl">
            بتراجع اللي جمعته من الحوار...
          </h2>

          <motion.p
            className="text-muted-foreground text-sm max-w-sm leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            dir="rtl"
          >
            وبتحاول تحدد: أبو سعيد كان شايف المشكلة إزاي، والخلل الحقيقي كان فين قبل ما تبني الـframing النهائي.
          </motion.p>

          <div className="flex justify-center gap-2 mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-primary"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, delay: i * 0.3, repeat: Infinity }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
