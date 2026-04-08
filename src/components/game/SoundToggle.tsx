import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music, Settings } from "lucide-react";
import { useSound } from "@/hooks/useSoundEffects";
import { useMusic } from "@/hooks/useBackgroundMusic";

export const SoundToggle = () => {
  const { isSoundEnabled, setIsSoundEnabled, playSound } = useSound();
  const { isMusicEnabled, toggleMusic, volume, setVolume } = useMusic();
  const [showPanel, setShowPanel] = useState(false);

  const handleSoundToggle = () => {
    const newState = !isSoundEnabled;
    setIsSoundEnabled(newState);
    if (newState) {
      setTimeout(() => playSound("click"), 100);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.button
        className="w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors shadow-lg"
        onClick={() => setShowPanel(!showPanel)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Settings className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            className="absolute top-14 right-0 w-64 p-4 rounded-xl bg-background/95 backdrop-blur-xl border border-border shadow-2xl"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
          >
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              إعدادات الصوت
            </h3>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                المؤثرات الصوتية
              </span>
              <motion.button
                className={`w-12 h-6 rounded-full p-1 transition-colors ${isSoundEnabled ? "bg-primary" : "bg-muted"}`}
                onClick={handleSoundToggle}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-4 h-4 rounded-full bg-white shadow"
                  animate={{ x: isSoundEnabled ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Music className="w-4 h-4" />
                الموسيقى
              </span>
              <motion.button
                className={`w-12 h-6 rounded-full p-1 transition-colors ${isMusicEnabled ? "bg-accent" : "bg-muted"}`}
                onClick={toggleMusic}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-4 h-4 rounded-full bg-white shadow"
                  animate={{ x: isMusicEnabled ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">مستوى الصوت</span>
                <span className="text-xs font-mono text-foreground">{Math.round(volume * 100)}%</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div
                  className="absolute top-0 left-0 h-2 bg-primary/50 rounded-full pointer-events-none"
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                {isMusicEnabled ? "🎵 الموسيقى تعمل" : "🔇 الموسيقى متوقفة"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
