import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, FileText, BookOpen } from "lucide-react";
import { InteractiveRoom } from "../InteractiveRoom";
import { EnhancedDialogue } from "../EnhancedDialogue";
import { GameOverlay } from "../GameOverlay";
import { useGame } from "@/contexts/GameContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSound } from "@/hooks/useSoundEffects";
import { CASE_INFO, INTRO_SCENES, ABU_SAEED_EXTRA_DIALOGUES, ENDINGS, HYPOTHESES } from "@/data/case1";
import detectiveOffice from "@/assets/rooms/detective-office.png";

interface OfficeScreenProps {
  onNavigate: (screen: string) => void;
}

export const OfficeScreen = ({ onNavigate }: OfficeScreenProps) => {
  const { state, addToNotebook, isInNotebook } = useGame();
  const { profile } = useAuth();
  const { playSound } = useSound();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [showReplayScenes, setShowReplayScenes] = useState(false);
  const [replaySceneIndex, setReplaySceneIndex] = useState(0);
  const [showExtraDialogue, setShowExtraDialogue] = useState(false);
  const [showConclusionDialogue, setShowConclusionDialogue] = useState(false);

  const hotspots = [
    { id: "case-board", x: 20, y: 10, width: 55, height: 45, label: "لوحة القضية", icon: "📋" },
    { id: "replay-scenes", x: 0, y: 30, width: 18, height: 50, label: "🔄 إعادة مشاهد البداية", icon: "🔄" },
    { id: "extra-questions", x: 75, y: 35, width: 20, height: 30, label: "أسئلة إضافية لأبو سعيد", icon: "❓" },
  ];

  const handleHotspotClick = (id: string) => {
    if (id === "replay-scenes") {
      setReplaySceneIndex(0);
      setShowReplayScenes(true);
    } else if (id === "extra-questions") {
      setShowExtraDialogue(true);
    } else {
      setActivePanel(id);
    }
    playSound("click");
  };

  const handleSaveNote = (saveId: string, saveText: string) => {
    addToNotebook({ text: saveText, source: "story", sourceId: saveId });
  };

  const savedNoteIds = state.notebook.map((n) => n.sourceId);
  const canSubmitReport = state.finalHypothesis !== null && state.gameStatus === "solved";

  const ending =
    state.gameStatus === "solved"
      ? (() => {
          if (!state.selectedHypotheses.includes("H3")) return ENDINGS.find((e) => e.type === "missing");
          const h = state.finalHypothesis;
          const hypothesis = h ? { isCorrect: h === "H3" } : null;
          if (!hypothesis?.isCorrect) return ENDINGS.find((e) => e.type === "wrong");
          const diagCount = ["K4", "K2", "I3"].filter((id) => state.notebook.some((n) => n.sourceId === id)).length;
          return diagCount >= 2
            ? ENDINGS.find((e) => e.type === "excellent")
            : ENDINGS.find((e) => e.type === "partial");
        })()
      : null;

  const getEndingDialogues = () => {
    if (!ending) return [];
    if (ending.type === "wrong" && state.finalHypothesis) {
      const chosenH = HYPOTHESES.find((h) => h.id === state.finalHypothesis);
      return ending.abuSaeedDialogues.map((d) => ({
        ...d,
        text: d.text.replace("{HYPOTHESIS_NAME}", chosenH?.text || ""),
      }));
    }
    return ending.abuSaeedDialogues;
  };

  const currentReplayScene = INTRO_SCENES[replaySceneIndex];
  const handleReplayComplete = () => {
    if (replaySceneIndex < INTRO_SCENES.length - 1) {
      setReplaySceneIndex((prev) => prev + 1);
    } else {
      setShowReplayScenes(false);
    }
  };

  const renderPanelContent = () => {
    if (activePanel === "case-board") {
      return (
        <div className="bg-background/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-auto">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            {CASE_INFO.title}
          </h3>
          <p className="text-muted-foreground mb-4">{CASE_INFO.description}</p>
          <div className="p-4 rounded-lg bg-secondary/50 border border-border mb-4">
            <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              ملخص القضية
            </h4>
            <p className="text-sm text-muted-foreground">{CASE_INFO.summary}</p>
            <p className="text-xs text-muted-foreground mt-2">📅 {CASE_INFO.date}</p>
          </div>
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
            <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-accent" />
              دفتر الملاحظات ({state.notebook.length})
            </h4>
            {state.notebook.length === 0 ? (
              <p className="text-sm text-muted-foreground">لم تحفظ أي ملاحظات بعد.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-auto">
                {state.notebook.map((n) => (
                  <div key={n.id} className="text-sm text-foreground p-2 rounded bg-card/50 border border-border">
                    {n.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <InteractiveRoom
        backgroundImage={detectiveOffice}
        hotspots={hotspots}
        onHotspotClick={handleHotspotClick}
        activeHotspot={activePanel}
        overlayContent={activePanel ? renderPanelContent() : undefined}
        onCloseOverlay={() => setActivePanel(null)}
      >
        <motion.div className="absolute top-12 right-4 z-20 flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border">
            <span className="text-amber-400 font-bold">{state.score} نقطة</span>
          </div>
        </motion.div>
        {canSubmitReport && !showConclusionDialogue && (
          <motion.button
            className="absolute top-12 left-4 z-20 px-6 py-3 rounded-lg font-bold text-lg"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))" }}
            onClick={() => setShowConclusionDialogue(true)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            📤 قدم التقرير لأبو سعيد
          </motion.button>
        )}
      </InteractiveRoom>
      <GameOverlay currentScreen="office" onNavigate={onNavigate} />

      <AnimatePresence>
        {showReplayScenes && currentReplayScene && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EnhancedDialogue
              key={currentReplayScene.id}
              dialogues={currentReplayScene.dialogues}
              isActive={true}
              onComplete={handleReplayComplete}
              onClose={() => setShowReplayScenes(false)}
              allowClickOutside={true}
              onSaveNote={handleSaveNote}
              savedNoteIds={savedNoteIds}
              playerName={profile?.display_name || undefined}
              playerGender={profile?.gender as "male" | "female" | undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExtraDialogue && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EnhancedDialogue
              dialogues={ABU_SAEED_EXTRA_DIALOGUES}
              isActive={true}
              onComplete={() => setShowExtraDialogue(false)}
              onClose={() => setShowExtraDialogue(false)}
              allowClickOutside={true}
              playerName={profile?.display_name || undefined}
              playerGender={profile?.gender as "male" | "female" | undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConclusionDialogue && ending && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EnhancedDialogue
              dialogues={getEndingDialogues()}
              isActive={true}
              onComplete={() => {
                setShowConclusionDialogue(false);
                onNavigate("result");
              }}
              allowClickOutside={false}
              playerName={profile?.display_name || undefined}
              playerGender={profile?.gender as "male" | "female" | undefined}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
