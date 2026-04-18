import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CompanyBriefingScreenV2 } from "@/components/game/screens/CompanyBriefingScreenV2";
import { TravelScreen } from "@/components/game/screens/TravelScreen";
import { ArrivalScreenV2 } from "@/components/game/screens/ArrivalScreenV2";
import { QuestionBankPanel } from "@/components/game/QuestionBankPanel";
import { FramingTemplateScreen } from "@/components/game/screens/FramingTemplateScreen";
import { ResultScreenV2 } from "@/components/game/screens/ResultScreenV2";
import { SoundProvider } from "@/hooks/useSoundEffects";
import { MusicProvider } from "@/hooks/useBackgroundMusic";
import { PlayerSettingsPanel } from "@/components/game/PlayerSettingsPanel";
import { PFGameProviderV2, usePFGameV2 } from "@/contexts/PFGameContextV2";
import { ScreenTransition } from "@/components/game/ScreenTransition";
import { ProgressTimeline } from "@/components/game/ProgressTimeline";

type Phase =
  | "office-briefing"
  | "travel"
  | "store-arrival"
  | "investigation"
  | "framing"
  | "result"
  | "replay-briefing";

const STORAGE_VERSION = "v2";

const GameContent = () => {
  const { user } = useAuth();
  const { resetGame } = usePFGameV2();
  const userId = user?.id || "guest";
  const storageKey = `pf-game-phase-${STORAGE_VERSION}-${userId}`;

  // Migration: clear old keys
  useEffect(() => {
    const oldKey = `pf-game-screen-${userId}`;
    if (localStorage.getItem(oldKey)) {
      localStorage.removeItem(oldKey);
    }
  }, [userId]);

  const [currentPhase, setCurrentPhase] = useState<Phase>(() => {
    const saved = localStorage.getItem(storageKey) as Phase | null;
    if (saved === "replay-briefing") return "office-briefing";
    return saved || "office-briefing";
  });
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (currentPhase !== "replay-briefing") {
      localStorage.setItem(storageKey, currentPhase);
    }
  }, [currentPhase, storageKey]);

  const handleNavigate = useCallback(
    (phase: string) => {
      setTransitioning(true);
      setTimeout(() => {
        if (phase === "office-briefing") {
          resetGame();
          localStorage.removeItem(storageKey);
        }
        setCurrentPhase(phase as Phase);
        setTimeout(() => setTransitioning(false), 100);
      }, 400);
    },
    [resetGame, storageKey]
  );

  const handleReplayBriefing = useCallback(() => setCurrentPhase("replay-briefing"), []);
  const handleResetProgress = useCallback(() => {
    localStorage.removeItem(storageKey);
    resetGame();
    setTransitioning(true);
    setTimeout(() => {
      setCurrentPhase("office-briefing");
      setTimeout(() => setTransitioning(false), 100);
    }, 400);
  }, [storageKey, resetGame]);

  const showSettings = currentPhase !== "replay-briefing";
  const showTimeline = !["office-briefing", "replay-briefing", "result"].includes(currentPhase);

  // Map new phases to old timeline keys for visual consistency
  const timelineKey =
    currentPhase === "office-briefing" ? "company-briefing"
    : currentPhase === "store-arrival" ? "arrival"
    : currentPhase === "investigation" ? "inquiry"
    : currentPhase;

  return (
    <div className="min-h-screen bg-background">
      <ScreenTransition isActive={transitioning} />

      {showTimeline && <ProgressTimeline currentScreen={timelineKey} />}

      {showSettings && (
        <PlayerSettingsPanel
          onReplayBriefing={handleReplayBriefing}
          onResetProgress={handleResetProgress}
        />
      )}

      {currentPhase === "office-briefing" && (
        <CompanyBriefingScreenV2 onComplete={() => handleNavigate("travel")} />
      )}
      {currentPhase === "replay-briefing" && (
        <CompanyBriefingScreenV2
          onComplete={() => {
            const saved = localStorage.getItem(storageKey) as Phase;
            setCurrentPhase(saved || "office-briefing");
          }}
          isReviewMode
        />
      )}
      {currentPhase === "travel" && (
        <TravelScreen onComplete={() => handleNavigate("store-arrival")} />
      )}
      {currentPhase === "store-arrival" && (
        <ArrivalScreenV2 onComplete={() => handleNavigate("investigation")} />
      )}
      {currentPhase === "investigation" && (
        <QuestionBankPanel
          availableCharacters={["abuSaeed", "salma"]}
          onProceedToFraming={() => handleNavigate("framing")}
        />
      )}
      {currentPhase === "framing" && (
        <FramingTemplateScreen onComplete={() => handleNavigate("result")} />
      )}
      {currentPhase === "result" && (
        <ResultScreenV2 onNavigate={handleNavigate} />
      )}
    </div>
  );
};

const Index = () => (
  <PFGameProviderV2>
    <MusicProvider>
      <SoundProvider>
        <GameContent />
      </SoundProvider>
    </MusicProvider>
  </PFGameProviderV2>
);

export default Index;
