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
  | "accuse";

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
  attack?: number;
  decay?: number;
  detune?: number;
  secondaryFreq?: number;
}

const soundConfigs: Record<SoundType, SoundConfig> = {
  click: {
    frequency: 800,
    duration: 0.08,
    type: "sine",
    volume: 0.2,
    attack: 0.01,
    decay: 0.05,
  },
  hover: {
    frequency: 600,
    duration: 0.05,
    type: "sine",
    volume: 0.1,
    attack: 0.01,
    decay: 0.03,
  },
  success: {
    frequency: 523.25,
    duration: 0.4,
    type: "sine",
    volume: 0.25,
    attack: 0.02,
    secondaryFreq: 659.25,
  },
  error: {
    frequency: 200,
    duration: 0.3,
    type: "sawtooth",
    volume: 0.2,
    attack: 0.01,
    detune: -50,
  },
  navigate: {
    frequency: 440,
    duration: 0.15,
    type: "triangle",
    volume: 0.15,
    attack: 0.02,
    decay: 0.1,
    secondaryFreq: 550,
  },
  collect: {
    frequency: 880,
    duration: 0.2,
    type: "sine",
    volume: 0.2,
    attack: 0.01,
    secondaryFreq: 1100,
  },
  reveal: {
    frequency: 300,
    duration: 0.3,
    type: "triangle",
    volume: 0.15,
    attack: 0.05,
    decay: 0.2,
  },
  dialogue: {
    frequency: 350,
    duration: 0.06,
    type: "sine",
    volume: 0.1,
    attack: 0.01,
    decay: 0.04,
  },
  suspense: {
    frequency: 150,
    duration: 0.5,
    type: "sawtooth",
    volume: 0.1,
    attack: 0.1,
    decay: 0.3,
    detune: 20,
  },
  accuse: {
    frequency: 250,
    duration: 0.6,
    type: "sawtooth",
    volume: 0.2,
    attack: 0.05,
    secondaryFreq: 200,
  },
};

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(true);

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
    
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const config = soundConfigs[soundType];
    const now = audioCtx.currentTime;

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.frequency, now);

    if (config.detune) {
      oscillator.detune.setValueAtTime(config.detune, now);
    }

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(
      config.volume,
      now + (config.attack || 0.01)
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      now + config.duration
    );

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
      gain2.gain.linearRampToValueAtTime(
        config.volume * 0.7,
        now + (config.attack || 0.01) + 0.05
      );
      gain2.gain.exponentialRampToValueAtTime(
        0.001,
        now + config.duration + 0.1
      );

      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);

      osc2.start(now + 0.05);
      osc2.stop(now + config.duration + 0.15);
    }
  }, []);

  const playDialogueTyping = useCallback(() => {
    playSound("dialogue");
  }, [playSound]);

  const toggleSound = useCallback((enabled: boolean) => {
    enabledRef.current = enabled;
  }, []);

  return {
    playSound,
    playDialogueTyping,
    toggleSound,
    isEnabled: () => enabledRef.current,
  };
};

interface SoundContextType {
  playSound: (type: SoundType) => void;
  playDialogueTyping: () => void;
  toggleSound: (enabled: boolean) => void;
  isSoundEnabled: boolean;
  setIsSoundEnabled: (enabled: boolean) => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const { playSound, playDialogueTyping, toggleSound } = useSoundEffects();
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const handleToggle = (enabled: boolean) => {
    setIsSoundEnabled(enabled);
    toggleSound(enabled);
  };

  const contextPlaySound = useCallback((type: SoundType) => {
    if (isSoundEnabled) {
      playSound(type);
    }
  }, [isSoundEnabled, playSound]);

  const contextPlayDialogueTyping = useCallback(() => {
    if (isSoundEnabled) {
      playDialogueTyping();
    }
  }, [isSoundEnabled, playDialogueTyping]);

  return (
    <SoundContext.Provider
      value={{
        playSound: contextPlaySound,
        playDialogueTyping: contextPlayDialogueTyping,
        toggleSound: handleToggle,
        isSoundEnabled,
        setIsSoundEnabled: handleToggle,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within SoundProvider");
  }
  return context;
};
