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
  | "carEngine"
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
  | "somber";

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
  door: {
    frequency: 120,
    duration: 0.4,
    type: "sine",
    volume: 0.2,
    attack: 0.02,
    decay: 0.3,
    secondaryFreq: 180,
  },
  carEngine: {
    frequency: 80,
    duration: 0.8,
    type: "sawtooth",
    volume: 0.12,
    attack: 0.1,
    decay: 0.5,
    detune: 10,
  },
  storeBell: {
    frequency: 1200,
    duration: 0.5,
    type: "sine",
    volume: 0.18,
    attack: 0.01,
    decay: 0.4,
    secondaryFreq: 1500,
  },
  confetti: {
    frequency: 600,
    duration: 0.3,
    type: "sine",
    volume: 0.2,
    attack: 0.01,
    secondaryFreq: 900,
  },
  doorKnock: {
    frequency: 200,
    duration: 0.12,
    type: "sine",
    volume: 0.3,
    attack: 0.005,
    decay: 0.08,
  },
  pageFlip: {
    frequency: 1800,
    duration: 0.18,
    type: "triangle",
    volume: 0.12,
    attack: 0.005,
    decay: 0.15,
    detune: -30,
  },
  stamp: {
    frequency: 90,
    duration: 0.22,
    type: "square",
    volume: 0.28,
    attack: 0.001,
    decay: 0.18,
    secondaryFreq: 60,
  },
  penWrite: {
    frequency: 2200,
    duration: 0.08,
    type: "sawtooth",
    volume: 0.06,
    attack: 0.003,
    decay: 0.06,
  },
  sparkle: {
    frequency: 1600,
    duration: 0.35,
    type: "sine",
    volume: 0.15,
    attack: 0.005,
    decay: 0.3,
    secondaryFreq: 2400,
  },
  tick: {
    frequency: 1200,
    duration: 0.04,
    type: "sine",
    volume: 0.07,
    attack: 0.002,
    decay: 0.03,
  },
  footstep: {
    frequency: 110,
    duration: 0.1,
    type: "sine",
    volume: 0.12,
    attack: 0.005,
    decay: 0.08,
  },
  doorCreak: {
    frequency: 180,
    duration: 0.7,
    type: "sawtooth",
    volume: 0.15,
    attack: 0.1,
    decay: 0.5,
    detune: -40,
  },
  lowTension: {
    frequency: 75,
    duration: 1.2,
    type: "sawtooth",
    volume: 0.18,
    attack: 0.15,
    decay: 1,
    detune: 15,
  },
  fanfare: {
    frequency: 523.25,
    duration: 0.6,
    type: "triangle",
    volume: 0.22,
    attack: 0.01,
    secondaryFreq: 783.99,
  },
  somber: {
    frequency: 196,
    duration: 0.9,
    type: "sine",
    volume: 0.2,
    attack: 0.05,
    decay: 0.7,
    secondaryFreq: 164.81,
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

  const playDoorKnock = useCallback(() => {
    // 3 rapid knocks
    playSound("doorKnock");
    setTimeout(() => playSound("doorKnock"), 150);
    setTimeout(() => playSound("doorKnock"), 300);
  }, [playSound]);

  const playDialogueTyping = useCallback(() => {
    playSound("dialogue");
  }, [playSound]);

  const toggleSound = useCallback((enabled: boolean) => {
    enabledRef.current = enabled;
  }, []);

  return {
    playSound,
    playDoorKnock,
    playDialogueTyping,
    toggleSound,
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
}

const SoundContext = createContext<SoundContextType | null>(null);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const { playSound, playDoorKnock, playDialogueTyping, toggleSound } = useSoundEffects();
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

  const contextPlayDoorKnock = useCallback(() => {
    if (isSoundEnabled) {
      playDoorKnock();
    }
  }, [isSoundEnabled, playDoorKnock]);

  const contextPlayDialogueTyping = useCallback(() => {
    if (isSoundEnabled) {
      playDialogueTyping();
    }
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
