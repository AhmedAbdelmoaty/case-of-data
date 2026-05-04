import { useState, useEffect, useCallback } from "react";
import { CompanyBriefingScreen } from "@/components/game/screens/CompanyBriefingScreen";
import { TravelScreen } from "@/components/game/screens/TravelScreen";
import { VelaroStreetScreen } from "@/components/game/screens/VelaroStreetScreen";
import { ArrivalScreen } from "@/components/game/screens/ArrivalScreen";
import { InquiryScreen } from "@/components/game/screens/InquiryScreen";
import { FramingScreen } from "@/components/game/screens/FramingScreen";
import { ReflectionTransition } from "@/components/game/screens/ReflectionTransition";

import { EmailSendScreen } from "@/components/game/screens/EmailSendScreen";
import { MansourReceivesEmailScreen } from "@/components/game/screens/MansourReceivesEmailScreen";
import { IncomingCallScreen } from "@/components/game/screens/IncomingCallScreen";
import { PhoneCallDebriefScreen } from "@/components/game/screens/PhoneCallDebriefScreen";
import { ResultScreen } from "@/components/game/screens/ResultScreen";
import { SoundProvider } from "@/hooks/useSoundEffects";
import { MusicProvider } from "@/hooks/useBackgroundMusic";
import { PlayerSettingsPanel } from "@/components/game/PlayerSettingsPanel";
import { PFGameProvider, usePFGame } from "@/contexts/PFGameContext";
import { ScreenTransition } from "@/components/game/ScreenTransition";
import { ProgressTimeline } from "@/components/game/ProgressTimeline";
import { AssetLoadingOverlay } from "@/components/game/AssetLoadingOverlay";
import { getScreenAssets, getWarmupAssets, type GameScreenId } from "@/lib/gameAssets";
import { preloadAssets } from "@/lib/assetPreloader";
import { useAuth } from "@/contexts/AuthContext";

type Screen =
  | "company-briefing"
  | "travel"
  | "velaro-street"
  | "arrival"
  | "inquiry"
  | "reflection"
  | "framing"
  | "email-send"
  | "mansour-receives"
  | "incoming-call"
  | "phone-call"
  | "result"
  | "replay-briefing";

const GameContent = () => {
  const { resetGame, state: pfState, consumeRestartFlag } = usePFGame();
  const { profile } = useAuth();

  const storageKey = `pf-game-screen-guest`;

  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    const saved = localStorage.getItem(storageKey) as Screen | null;
    if (saved === "replay-briefing") return "company-briefing";
    return saved || "company-briefing";
  });

  const [transitioning, setTransitioning] = useState(false);
  const [assetLoading, setAssetLoading] = useState(true);
  const [assetProgress, setAssetProgress] = useState(0);
  const gender = (profile?.gender || "male") as "male" | "female";

  const preloadScreen = useCallback(
    async (screen: Screen, foreground = true) => {
      const assets = getScreenAssets(
        screen as GameScreenId,
        gender,
        pfState.outcome,
      );
      if (foreground) {
        setAssetProgress(0);
        setAssetLoading(true);
      }
      await preloadAssets({
        ...assets,
        timeoutMs: foreground ? 4200 : 2400,
        onProgress: foreground
          ? ({ loaded, total }) => setAssetProgress(total ? loaded / total : 1)
          : undefined,
      });
      if (foreground) {
        setAssetProgress(1);
        setAssetLoading(false);
      }
    },
    [gender, pfState.outcome],
  );

  useEffect(() => {
    let cancelled = false;
    setAssetLoading(true);
    preloadAssets({
      ...getWarmupAssets(gender),
      timeoutMs: 4200,
      onProgress: ({ loaded, total }) => {
        if (!cancelled) setAssetProgress(total ? loaded / total : 1);
      },
    })
      .then(() => preloadScreen(currentScreen, false))
      .finally(() => {
        if (!cancelled) {
          setAssetProgress(1);
          setAssetLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
    // Run once for the first playable screen; later transitions handle themselves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const order: Screen[] = [
      "company-briefing",
      "travel",
      "velaro-street",
      "arrival",
      "inquiry",
      "reflection",
      "framing",
      "email-send",
      "mansour-receives",
      "incoming-call",
      "phone-call",
      "result",
    ];
    const idx = order.indexOf(currentScreen === "replay-briefing" ? "company-briefing" : currentScreen);
    const next = order[idx + 1];
    if (next) preloadScreen(next, false).catch(() => {});
  }, [currentScreen, preloadScreen]);

  useEffect(() => {
    if (currentScreen !== "replay-briefing") {
      localStorage.setItem(storageKey, currentScreen);
    }
  }, [currentScreen, storageKey]);

  // Handle "restart from beginning" — navigate back to store-arrival scene
  useEffect(() => {
    if (pfState.restartFromBeginning) {
      consumeRestartFlag();
      setTransitioning(true);
      setTimeout(() => {
        preloadScreen("arrival").finally(() => {
          setCurrentScreen("arrival");
          setTimeout(() => setTransitioning(false), 100);
        });
      }, 400);
    }
  }, [pfState.restartFromBeginning, consumeRestartFlag]);

  const navigateWithTransition = useCallback(
    (screen: Screen, options?: { reset?: boolean; clearStorage?: boolean }) => {
      setTransitioning(true);

      setTimeout(() => {
        if (options?.reset) {
          resetGame();
        }

        if (options?.clearStorage) {
          localStorage.removeItem(storageKey);
          localStorage.removeItem("pf-game-submitted");
        }

        preloadScreen(screen).finally(() => {
          setCurrentScreen(screen);
          setTimeout(() => {
            setTransitioning(false);
          }, 100);
        });
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
      <AssetLoadingOverlay visible={assetLoading} progress={assetProgress} />

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
        <TravelScreen onComplete={() => handleNavigate("velaro-street")} />
      )}

      {currentScreen === "velaro-street" && (
        <VelaroStreetScreen onComplete={() => handleNavigate("arrival")} />
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
        <FramingScreen onComplete={() => handleNavigate("email-send")} />
      )}

      {currentScreen === "email-send" && (
        <EmailSendScreen onComplete={() => handleNavigate("mansour-receives")} />
      )}

      {currentScreen === "mansour-receives" && (
        <MansourReceivesEmailScreen onComplete={() => handleNavigate("incoming-call")} />
      )}

      {currentScreen === "incoming-call" && (
        <IncomingCallScreen onAnswer={() => handleNavigate("phone-call")} />
      )}

      {currentScreen === "phone-call" && (
        <PhoneCallDebriefScreen onComplete={() => handleNavigate("result")} />
      )}

      {currentScreen === "result" && (
        <ResultScreen onNavigate={handleNavigate} />
      )}
    </div>
  );
};

const Index = () => (
  <PFGameProvider>
    <GameContent />
  </PFGameProvider>
);

export default Index;
