import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InteractiveRoom } from "../InteractiveRoom";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { AnimatedCharacter } from "../AnimatedCharacter";
import { NavigationButton } from "../NavigationButton";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSound } from "@/hooks/useSoundEffects";
import { CHARACTERS } from "@/data/case1";
import { toast } from "sonner";
import interrogationRoom from "@/assets/rooms/interrogation-room.png";

interface InterrogationScreenProps {
  onNavigate: (screen: string) => void;
}

export const InterrogationScreen = ({ onNavigate }: InterrogationScreenProps) => {
  const { state, addToNotebook, isInNotebook, markInterviewComplete, isInterviewComplete } = useGame();
  const { profile } = useAuth();
  const { playSound } = useSound();
  const [activeCharacter, setActiveCharacter] = useState<string | null>(null);

  const interviewees = CHARACTERS.filter(c => c.id !== "abuSaeed");

  const handleCharacterClick = (charId: string) => {
    setActiveCharacter(charId);
    playSound("click");
  };

  const handleDialogueComplete = () => {
    if (activeCharacter) {
      markInterviewComplete(activeCharacter);
      toast.success("تمت المقابلة!");
    }
    setActiveCharacter(null);
  };

  const handleSaveNote = (saveId: string, saveText: string) => {
    addToNotebook({ text: saveText, source: "interview", sourceId: saveId });
    toast.success("تم الحفظ في الدفتر!");
  };

  const savedNoteIds = state.notebook.map(n => n.sourceId);
  const activeChar = CHARACTERS.find(c => c.id === activeCharacter);
  const isActiveCharCompleted = activeCharacter ? isInterviewComplete(activeCharacter) : false;

  const positions = [
    { left: "18%", bottom: "20%" },
    { left: "45%", bottom: "20%" },
    { left: "72%", bottom: "20%" },
  ];

  return (
    <>
      <InteractiveRoom
        backgroundImage={interrogationRoom}
        hotspots={[]}
        onHotspotClick={() => {}}
        activeHotspot={null}
      >
        {/* Status */}
        <motion.div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
          <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-background/90 backdrop-blur-xl border border-primary/30">
            <span className="font-bold text-foreground">👥 غرفة الاجتماعات</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-foreground">مقابلات: {state.completedInterviews.length}/3</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-primary font-bold">📓 {state.notebook.length}</span>
          </div>
        </motion.div>

        {/* Characters */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {interviewees.map((char, i) => {
            const completed = isInterviewComplete(char.id);
            return (
              <motion.div
                key={char.id}
                className="absolute pointer-events-auto"
                style={positions[i]}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <div className="relative">
                  <AnimatedCharacter
                    characterId={char.avatarCharacterId}
                    size="lg"
                    isActive={!completed}
                    mood={completed ? "happy" : "neutral"}
                    onClick={() => handleCharacterClick(char.id)}
                    showName={false}
                  />
                  <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-background/90 text-center whitespace-nowrap border border-border">
                    <p className="font-bold text-foreground text-sm">{char.name}</p>
                    <p className="text-xs text-muted-foreground">{char.role}</p>
                    {completed && <p className="text-xs text-neon-green mt-1">✓ تمت المقابلة</p>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-4 px-4">
          <NavigationButton iconEmoji="🏢" label="المكتب" onClick={() => onNavigate("office")} />
          <NavigationButton iconEmoji="📁" label="الأدلة" onClick={() => onNavigate("evidence")} />
          <NavigationButton iconEmoji="📊" label="البيانات" onClick={() => onNavigate("dashboard")} />
          <NavigationButton iconEmoji="🔬" label="التحليل" onClick={() => onNavigate("analysis")} />
        </div>
      </InteractiveRoom>

      {/* Dialogue overlay */}
      <AnimatePresence>
        {activeChar && (
          <motion.div className="fixed inset-0 z-50 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EnhancedDialogue
              dialogues={activeChar.dialogues}
              isActive={true}
              onComplete={handleDialogueComplete}
              onClose={() => setActiveCharacter(null)}
              allowClickOutside={isActiveCharCompleted}
              onSaveNote={handleSaveNote}
              savedNoteIds={savedNoteIds}
              playerName={profile?.display_name || undefined}
              playerGender={profile?.gender as "male" | "female" | undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};