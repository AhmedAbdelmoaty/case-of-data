import { useEffect } from "react";
import { motion } from "framer-motion";

interface ReturnTravelScreenProps {
  onComplete: () => void;
}

export const ReturnTravelScreen = ({ onComplete }: ReturnTravelScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="relative z-10 text-center space-y-6">
        <motion.div className="flex justify-center gap-3 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: [0, 1, 0], x: [20, -20] }}
              transition={{
                duration: 1.2,
                delay: i * 0.2,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.p
            className="text-3xl mb-4"
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            🚗
          </motion.p>
          <h2 className="text-foreground text-xl font-bold mb-2" dir="rtl">
            في الطريق للمكتب...
          </h2>
          <motion.p
            className="text-muted-foreground text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            dir="rtl"
          >
            🏢 Pinnacle Consulting
          </motion.p>
        </motion.div>

        <motion.div className="w-48 h-1 bg-muted rounded-full mx-auto overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  );
};
