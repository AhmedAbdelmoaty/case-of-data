import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CompanyBriefingScreen } from "@/components/game/screens/CompanyBriefingScreen";
import { TravelScreen } from "@/components/game/screens/TravelScreen";
import { IntroScreen } from "@/components/game/screens/IntroScreen";
import { OnboardingScreen } from "@/components/game/screens/OnboardingScreen";
import { ScenesScreen } from "@/components/game/screens/ScenesScreen";
import { HypothesisSelectScreen } from "@/components/game/screens/HypothesisSelectScreen";
import { BriefingScreen } from "@/components/game/screens/BriefingScreen";
import { AnalystHubScreen } from "@/components/game/screens/AnalystHubScreen";
import { OfficeScreen } from "@/components/game/screens/OfficeScreen";
import { EvidenceScreen } from "@/components/game/screens/EvidenceScreen";
import { DashboardScreen } from "@/components/game/screens/DashboardScreen";
import { FloorScreen } from "@/components/game/screens/FloorScreen";
import { AnalysisScreen } from "@/components/game/screens/AnalysisScreen";
import { ResultScreen } from "@/components/game/screens/ResultScreen";
import { SoundProvider } from "@/hooks/useSoundEffects";
import { MusicProvider, useMusic } from "@/hooks/useBackgroundMusic";
import { SoundToggle } from "@/components/game/SoundToggle";
import { FloatingNotebook } from "@/components/game/FloatingNotebook";
import { PlayerSettingsPanel } from "@/components/game/PlayerSettingsPanel";
import { GameProvider } from "@/contexts/GameContext";

type Screen =
  | "company-briefing"
  | "travel"
  | "intro"
  | "onboarding"
  | "scenes"
  | "hypothesis-select"
  | "briefing"
  | "analyst-hub"
  | "office"
  | "evidence"
  | "dashboard"
  | "floor"
  | "analysis"
  | "result"
  | "replay-briefing";

const showNotebookScreens: Screen[] = ["analyst-hub", "office", "evidence", "dashboard", "floor", "analysis"];

const GameContent = () => {
  const { user } = useAuth();
  const userId = user?.id || "guest";
  const storageKey = `detective-game-screen-${userId}`;

  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    const saved = localStorage.getItem(storageKey) as Screen | null;
    // Don't restore replay-briefing
    if (saved === "replay-briefing") return "company-briefing";
    return saved || "company-briefing";
  });

  const { setCurrentRoom } = useMusic();

  useEffect(() => {
    // Don't persist replay-briefing
    if (currentScreen !== "replay-briefing") {
      localStorage.setItem(storageKey, currentScreen);
    }
  }, [currentScreen, storageKey]);

  const handleNavigate = useCallback((screen: string) => {
    setCurrentScreen(screen as Screen);
  }, []);

  useEffect(() => {
    const roomTypes = ["intro", "office", "evidence", "analysis", "floor", "result"];
    if (roomTypes.includes(currentScreen)) {
      setCurrentRoom(currentScreen as any);
    }
  }, [currentScreen, setCurrentRoom]);

  const handleReplayBriefing = useCallback(() => {
    setCurrentScreen("replay-briefing");
  }, []);

  const handleResetProgress = useCallback(() => {
    localStorage.removeItem(storageKey);
    setCurrentScreen("company-briefing");
  }, [storageKey]);

  const showNotebook = showNotebookScreens.includes(currentScreen);
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
      {showNotebook && <FloatingNotebook />}

      {currentScreen === "company-briefing" && (
        <CompanyBriefingScreen onComplete={() => handleNavigate("travel")} />
      )}
      {currentScreen === "replay-briefing" && (
        <CompanyBriefingScreen
          onComplete={() => {
            const saved = localStorage.getItem(storageKey) as Screen;
            setCurrentScreen(saved || "intro");
          }}
          isReviewMode
        />
      )}
      {currentScreen === "travel" && (
        <TravelScreen onComplete={() => handleNavigate("intro")} />
      )}
      {currentScreen === "intro" && <IntroScreen onNavigate={() => handleNavigate("onboarding")} />}
      {currentScreen === "onboarding" && <OnboardingScreen onComplete={() => handleNavigate("scenes")} />}
      {currentScreen === "scenes" && <ScenesScreen onComplete={() => handleNavigate("hypothesis-select")} />}
      {currentScreen === "hypothesis-select" && (
        <HypothesisSelectScreen onComplete={() => handleNavigate("briefing")} />
      )}
      {currentScreen === "briefing" && <BriefingScreen onNavigate={handleNavigate} />}
      {currentScreen === "analyst-hub" && <AnalystHubScreen onNavigate={handleNavigate} />}
      {currentScreen === "office" && <OfficeScreen onNavigate={handleNavigate} />}
      {currentScreen === "evidence" && <EvidenceScreen onNavigate={handleNavigate} />}
      {currentScreen === "dashboard" && <DashboardScreen onNavigate={handleNavigate} />}
      {currentScreen === "floor" && <FloorScreen onNavigate={handleNavigate} />}
      {currentScreen === "analysis" && <AnalysisScreen onNavigate={handleNavigate} />}
      {currentScreen === "result" && <ResultScreen onNavigate={handleNavigate} />}
    </div>
  );
};

const Index = () => {
  return (
    <GameProvider>
      <MusicProvider>
        <SoundProvider>
          <GameContent />
        </SoundProvider>
      </MusicProvider>
    </GameProvider>
  );
};

export default Index;
