import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import { INTRO_SCENES } from "@/data/case1";
import abuSaeed1 from "@/assets/scenes/abu-saeed-1.png";
import abuSaeed2 from "@/assets/scenes/abu-saeed-2.png";
import abuSaeed3 from "@/assets/scenes/abu-saeed-3.png";
import abuSaeed4 from "@/assets/scenes/abu-saeed-4.png";

interface ScenesScreenProps {
  onComplete: () => void;
}

const sceneBgs = [abuSaeed1, abuSaeed2, abuSaeed3, abuSaeed4];

export const ScenesScreen = ({ onComplete }: ScenesScreenProps) => {
  const [currentScene, setCurrentScene] = useState(0);
  const { addToNotebook, isInNotebook } = useGame();
  const { profile } = useAuth();
  const scene = INTRO_SCENES[currentScene];
  const savedNoteIds = [...Array(100)].map((_, i) => `S${i}`).filter(id => isInNotebook(id));

  const handleSceneComplete = () => {
    if (currentScene < INTRO_SCENES.length - 1) {
      setCurrentScene(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSaveNote = (saveId: string, saveText: string) => {
    addToNotebook({ text: saveText, source: "story", sourceId: saveId });
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src={sceneBgs[currentScene] || abuSaeed1} alt="Scene" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {INTRO_SCENES.map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-colors ${i === currentScene ? "bg-primary" : i < currentScene ? "bg-primary/50" : "bg-muted"}`} />
        ))}
      </div>

      <div className="absolute top-4 right-4 z-30 px-3 py-1 rounded-lg bg-background/80 backdrop-blur-sm border border-border">
        <span className="text-sm text-muted-foreground">المشهد {currentScene + 1}/{INTRO_SCENES.length}</span>
      </div>

      {scene && (
        <motion.div className="fixed inset-0 z-20" key={`dialogue-${currentScene}`}>
          <EnhancedDialogue
            dialogues={scene.dialogues}
            isActive={true}
            onComplete={handleSceneComplete}
            allowClickOutside={false}
            onSaveNote={handleSaveNote}
            savedNoteIds={savedNoteIds}
            playerName={profile?.display_name || undefined}
            playerGender={profile?.gender as "male" | "female" | undefined}
          />
        </motion.div>
      )}
    </div>
  );
};
