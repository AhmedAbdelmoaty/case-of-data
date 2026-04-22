import { useCallback, useRef, useEffect, createContext, useContext, ReactNode, useState } from "react";

type SoundType = 
  | "click" 
  | "hover" 
  | "success" 
  | "error" 
  | "navigate" 
  | "collect" 
  | "reveal" 
  | "dialogue" 
  | "suspense"
  | "accuse"
  | "door"
  | "storeBell"
  | "confetti"
  | "doorKnock"
  | "pageFlip"
  | "stamp"
  | "penWrite"
  | "sparkle"
  | "tick"
  | "footstep"
  | "doorCreak"
  | "lowTension"
  | "fanfare"
  | "somber"
  | "whoosh";

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
  attack?: number;
  decay?: number;
  detune?: number;
  secondaryFreq?: number;
  /** if true, skip secondary oscillator pitch-glide overlap that creates buzz */
  noSecondary?: boolean;
}

// All volumes raised significantly (~3-4x) and cleaned up.
// REMOVED: carEngine (was the source of the annoying buzz).
const soundConfigs: Record<SoundType, SoundConfig> = {
  click: { frequency: 850, duration: 0.07, type: "sine", volume: 0.55, attack: 0.005, decay: 0.05 },
  hover: { frequency: 620, duration: 0.04, type: "sine", volume: 0.25, attack: 0.005, decay: 0.03 },
  success: { frequency: 523.25, duration: 0.45, type: "sine", volume: 0.6, attack: 0.01, secondaryFreq: 783.99 },
  error: { frequency: 220, duration: 0.28, type: "triangle", volume: 0.5, attack: 0.005, decay: 0.25 },
  navigate: { frequency: 520, duration: 0.16, type: "triangle", volume: 0.45, attack: 0.01, decay: 0.12, secondaryFreq: 660 },
  collect: { frequency: 880, duration: 0.22, type: "sine", volume: 0.55, attack: 0.005, secondaryFreq: 1320 },
  reveal: { frequency: 320, duration: 0.32, type: "triangle", volume: 0.4, attack: 0.03, decay: 0.25 },
  dialogue: { frequency: 360, duration: 0.05, type: "sine", volume: 0.18, attack: 0.005, decay: 0.04 },
  suspense: { frequency: 160, duration: 0.5, type: "triangle", volume: 0.3, attack: 0.08, decay: 0.4 },
  accuse: { frequency: 260, duration: 0.55, type: "triangle", volume: 0.5, attack: 0.03, secondaryFreq: 200 },
  // Solid wooden knock (louder + sharper)
  door: { frequency: 130, duration: 0.35, type: "sine", volume: 0.7, attack: 0.002, decay: 0.3, secondaryFreq: 90 },
  storeBell: { frequency: 1250, duration: 0.55, type: "sine", volume: 0.5, attack: 0.005, decay: 0.45, secondaryFreq: 1680 },
  confetti: { frequency: 660, duration: 0.32, type: "sine", volume: 0.55, attack: 0.005, secondaryFreq: 990 },
  // SHARP loud knock
  doorKnock: { frequency: 180, duration: 0.14, type: "sine", volume: 0.95, attack: 0.001, decay: 0.12, secondaryFreq: 110 },
  pageFlip: { frequency: 2400, duration: 0.13, type: "triangle", volume: 0.32, attack: 0.002, decay: 0.12 },
  stamp: { frequency: 95, duration: 0.25, type: "square", volume: 0.85, attack: 0.001, decay: 0.22, secondaryFreq: 60 },
  penWrite: { frequency: 2400, duration: 0.06, type: "triangle", volume: 0.18, attack: 0.002, decay: 0.05 },
  sparkle: { frequency: 1800, duration: 0.35, type: "sine", volume: 0.4, attack: 0.005, decay: 0.3, secondaryFreq: 2700 },
  tick: { frequency: 1400, duration: 0.03, type: "sine", volume: 0.18, attack: 0.001, decay: 0.025 },
  // Realistic footstep (low thud)
  footstep: { frequency: 95, duration: 0.12, type: "sine", volume: 0.45, attack: 0.002, decay: 0.1 },
  doorCreak: { frequency: 200, duration: 0.6, type: "triangle", volume: 0.4, attack: 0.08, decay: 0.5 },
  lowTension: { frequency: 90, duration: 1.0, type: "triangle", volume: 0.35, attack: 0.12, decay: 0.85 },
  fanfare: { frequency: 523.25, duration: 0.65, type: "triangle", volume: 0.6, attack: 0.005, secondaryFreq: 783.99 },
  somber: { frequency: 196, duration: 0.9, type: "sine", volume: 0.5, attack: 0.04, decay: 0.75, secondaryFreq: 164.81 },
  // Page transition whoosh
  whoosh: { frequency: 600, duration: 0.35, type: "sine", volume: 0.35, attack: 0.05, decay: 0.3 },
};

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(true);
  const masterVolumeRef = useRef(1);

  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
    };
    window.addEventListener("click", initAudio, { once: true });
    window.addEventListener("touchstart", initAudio, { once: true });
    return () => {
      window.removeEventListener("click", initAudio);
      window.removeEventListener("touchstart", initAudio);
    };
  }, []);

  const playSound = useCallback((soundType: SoundType) => {
    if (!enabledRef.current) return;
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    const audioCtx = audioContextRef.current;
    if (audioCtx.state === "suspended") audioCtx.resume();

    const config = soundConfigs[soundType];
    if (!config) return;
    const now = audioCtx.currentTime;
    const vol = config.volume * masterVolumeRef.current;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.frequency, now);
    if (config.detune) oscillator.detune.setValueAtTime(config.detune, now);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(vol, now + (config.attack || 0.005));
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + config.duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start(now);
    oscillator.stop(now + config.duration);

    if (config.secondaryFreq) {
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = config.type;
      osc2.frequency.setValueAtTime(config.secondaryFreq, now);
      gain2.gain.setValueAtTime(0, now);
      gain2.gain.linearRampToValueAtTime(vol * 0.65, now + (config.attack || 0.005) + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + config.duration + 0.08);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now + 0.03);
      osc2.stop(now + config.duration + 0.1);
    }
  }, []);

  const playDoorKnock = useCallback(() => {
    playSound("doorKnock");
    setTimeout(() => playSound("doorKnock"), 160);
    setTimeout(() => playSound("doorKnock"), 320);
  }, [playSound]);

  const playDialogueTyping = useCallback(() => {
    playSound("dialogue");
  }, [playSound]);

  const toggleSound = useCallback((enabled: boolean) => {
    enabledRef.current = enabled;
  }, []);

  const setMasterVolume = useCallback((v: number) => {
    masterVolumeRef.current = Math.max(0, Math.min(1, v));
  }, []);

  return {
    playSound,
    playDoorKnock,
    playDialogueTyping,
    toggleSound,
    setMasterVolume,
    isEnabled: () => enabledRef.current,
  };
};

interface SoundContextType {
  playSound: (type: SoundType) => void;
  playDoorKnock: () => void;
  playDialogueTyping: () => void;
  toggleSound: (enabled: boolean) => void;
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
  masterVolume: number;
  setMasterVolume: (v: number) => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const { playSound, playDoorKnock, playDialogueTyping, toggleSound, setMasterVolume } = useSoundEffects();
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [masterVolume, setMasterVolumeState] = useState(1);

  const handleToggle = (enabled: boolean) => {
    setIsSoundEnabled(enabled);
    toggleSound(enabled);
  };

  const handleSetVolume = (v: number) => {
    setMasterVolumeState(v);
    setMasterVolume(v);
  };

  const contextPlaySound = useCallback((type: SoundType) => {
    if (isSoundEnabled) playSound(type);
  }, [isSoundEnabled, playSound]);

  const contextPlayDoorKnock = useCallback(() => {
    if (isSoundEnabled) playDoorKnock();
  }, [isSoundEnabled, playDoorKnock]);

  const contextPlayDialogueTyping = useCallback(() => {
    if (isSoundEnabled) playDialogueTyping();
  }, [isSoundEnabled, playDialogueTyping]);

  return (
    <SoundContext.Provider
      value={{
        playSound: contextPlaySound,
        playDoorKnock: contextPlayDoorKnock,
        playDialogueTyping: contextPlayDialogueTyping,
        toggleSound: handleToggle,
        isSoundEnabled,
        setIsSoundEnabled: handleToggle,
        masterVolume,
        setMasterVolume: handleSetVolume,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) throw new Error("useSound must be used within SoundProvider");
  return context;
};
