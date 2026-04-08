import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CompanyBriefingScreen } from "@/components/game/screens/CompanyBriefingScreen";
import { TravelScreen } from "@/components/game/screens/TravelScreen";
import { ArrivalScreen } from "@/components/game/screens/ArrivalScreen";
import { ResultScreen } from "@/components/game/screens/ResultScreen";
import { SoundProvider } from "@/hooks/useSoundEffects";
import { MusicProvider } from "@/hooks/useBackgroundMusic";
import { SoundToggle } from "@/components/game/SoundToggle";
import { PlayerSettingsPanel } from "@/components/game/PlayerSettingsPanel";
import { PFGameProvider } from "@/contexts/PFGameContext";

type Screen =
  | "company-briefing"
  | "travel"
  | "conversation"
  | "result"
  | "replay-briefing";

const GameContent = () => {
  const { user } = useAuth();
  const userId = user?.id || "guest";
  const storageKey = `pf-game-screen-${userId}`;

  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved === "replay-briefing") return "company-briefing";
    // Map old screen names to new ones
    if (saved === "arrival" || saved === "inquiry" || saved === "framing" || saved === "conversation") return "conversation" as Screen;
    return (saved as Screen) || "company-briefing";
  });

  useEffect(() => {
    if (currentScreen !== "replay-briefing") {
      localStorage.setItem(storageKey, currentScreen);
    }
  }, [currentScreen, storageKey]);

  const handleNavigate = useCallback((screen: string) => {
    setCurrentScreen(screen as Screen);
  }, []);

  const handleReplayBriefing = useCallback(() => {
    setCurrentScreen("replay-briefing");
  }, []);

  const handleResetProgress = useCallback(() => {
    localStorage.removeItem(storageKey);
    setCurrentScreen("company-briefing");
  }, [storageKey]);

  const showSettings = currentScreen !== "replay-briefing";

  return (
    <div className="min-h-screen bg-background">
      {showSettings && (
        <>
          <SoundToggle />
          <PlayerSettingsPanel
            onReplayBriefing={handleReplayBriefing}
            onResetProgress={handleResetProgress}
          />
        </>
      )}

      {currentScreen === "company-briefing" && (
        <CompanyBriefingScreen onComplete={() => handleNavigate("travel")} />
      )}
      {currentScreen === "replay-briefing" && (
        <CompanyBriefingScreen
          onComplete={() => {
            const saved = localStorage.getItem(storageKey) as Screen;
            setCurrentScreen(saved || "company-briefing");
          }}
          isReviewMode
        />
      )}
      {currentScreen === "travel" && (
        <TravelScreen onComplete={() => handleNavigate("conversation")} />
      )}
      {currentScreen === "conversation" && (
        <ArrivalScreen onComplete={() => handleNavigate("result")} />
      )}
      {currentScreen === "result" && (
        <ResultScreen onNavigate={handleNavigate} />
      )}
    </div>
  );
};

const Index = () => {
  return (
    <PFGameProvider>
      <MusicProvider>
        <SoundProvider>
          <GameContent />
        </SoundProvider>
      </MusicProvider>
    </PFGameProvider>
  );
};

export default Index;
