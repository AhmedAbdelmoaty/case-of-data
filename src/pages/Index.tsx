import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CompanyBriefingScreen } from "@/components/game/screens/CompanyBriefingScreen";
import { TravelScreen } from "@/components/game/screens/TravelScreen";
import { ArrivalScreen } from "@/components/game/screens/ArrivalScreen";
import { InquiryScreen } from "@/components/game/screens/InquiryScreen";
import { FramingScreen } from "@/components/game/screens/FramingScreen";
import { ReflectionTransition } from "@/components/game/screens/ReflectionTransition";
import { PresentationScreen } from "@/components/game/screens/PresentationScreen";
import { ReturnTravelScreen } from "@/components/game/screens/ReturnTravelScreen";
import { DebriefScreen } from "@/components/game/screens/DebriefScreen";
import { ResultScreen } from "@/components/game/screens/ResultScreen";
import { SoundProvider } from "@/hooks/useSoundEffects";
import { MusicProvider } from "@/hooks/useBackgroundMusic";
import { PlayerSettingsPanel } from "@/components/game/PlayerSettingsPanel";
import { PFGameProvider, usePFGame } from "@/contexts/PFGameContext";
import { ScreenTransition } from "@/components/game/ScreenTransition";
import { ProgressTimeline } from "@/components/game/ProgressTimeline";

type Screen =
  | "company-briefing"
  | "travel"
  | "arrival"
  | "inquiry"
  | "reflection"
  | "framing"
  | "presentation"
  | "return-travel"
  | "debrief"
  | "result"
  | "replay-briefing";

const GameContent = () => {
  const { user } = useAuth();
  const { resetGame } = usePFGame();

  const userId = user?.id || "guest";
  const storageKey = `pf-game-screen-${userId}`;

  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    const saved = localStorage.getItem(storageKey) as Screen | null;
    if (saved === "replay-briefing") return "company-briefing";
    return saved || "company-briefing";
  });

  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (currentScreen !== "replay-briefing") {
      localStorage.setItem(storageKey, currentScreen);
    }
  }, [currentScreen, storageKey]);

  const navigateWithTransition = useCallback(
    (screen: Screen, options?: { reset?: boolean; clearStorage?: boolean }) => {
      setTransitioning(true);

      setTimeout(() => {
        if (options?.reset) {
          resetGame();
        }

        if (options?.clearStorage) {
          localStorage.removeItem(storageKey);
        }

        setCurrentScreen(screen);

        setTimeout(() => {
          setTransitioning(false);
        }, 100);
      }, 400);
    },
    [resetGame, storageKey]
  );

  const handleNavigate = useCallback(
    (screen: string) => {
      if (screen === "company-briefing") {
        navigateWithTransition("company-briefing", {
          reset: true,
          clearStorage: true,
        });
        return;
      }

      navigateWithTransition(screen as Screen);
    },
    [navigateWithTransition]
  );

  const handleReplayBriefing = useCallback(() => {
    setCurrentScreen("replay-briefing");
  }, []);

  const handleResetProgress = useCallback(() => {
    navigateWithTransition("company-briefing", {
      reset: true,
      clearStorage: true,
    });
  }, [navigateWithTransition]);

  const showSettings = currentScreen !== "replay-briefing";
  const showTimeline = !["company-briefing", "replay-briefing", "result"].includes(currentScreen);

  return (
    <div className="min-h-screen bg-background">
      <ScreenTransition isActive={transitioning} />

      {showTimeline && <ProgressTimeline currentScreen={currentScreen} />}

      {showSettings && (
        <PlayerSettingsPanel
          onReplayBriefing={handleReplayBriefing}
          onResetProgress={handleResetProgress}
        />
      )}

      {currentScreen === "company-briefing" && (
        <CompanyBriefingScreen onComplete={() => handleNavigate("travel")} />
      )}

      {currentScreen === "replay-briefing" && (
        <CompanyBriefingScreen
          onComplete={() => {
            const saved = localStorage.getItem(storageKey) as Screen | null;
            setCurrentScreen(saved && saved !== "replay-briefing" ? saved : "company-briefing");
          }}
          isReviewMode
        />
      )}

      {currentScreen === "travel" && (
        <TravelScreen onComplete={() => handleNavigate("arrival")} />
      )}

      {currentScreen === "arrival" && (
        <ArrivalScreen onComplete={() => handleNavigate("inquiry")} />
      )}

      {currentScreen === "inquiry" && (
        <InquiryScreen onComplete={() => handleNavigate("reflection")} />
      )}

      {currentScreen === "reflection" && (
        <ReflectionTransition onComplete={() => handleNavigate("framing")} />
      )}

      {currentScreen === "framing" && (
        <FramingScreen onComplete={() => handleNavigate("presentation")} />
      )}

      {currentScreen === "presentation" && (
        <PresentationScreen onComplete={() => handleNavigate("return-travel")} />
      )}

      {currentScreen === "return-travel" && (
        <ReturnTravelScreen onComplete={() => handleNavigate("debrief")} />
      )}

      {currentScreen === "debrief" && (
        <DebriefScreen onComplete={() => handleNavigate("result")} />
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
