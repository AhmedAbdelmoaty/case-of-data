import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from "react";

type RoomType = "intro" | "office" | "evidence" | "analysis" | "interrogation" | "result";

interface MusicContextType {
  currentRoom: RoomType;
  setCurrentRoom: (room: RoomType) => void;
  volume: number;
  setVolume: (vol: number) => void;
  isMusicEnabled: boolean;
  toggleMusic: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

// تعريف الأجواء الموسيقية لكل غرفة
const roomConfigs: Record<RoomType, { 
  baseFreq: number; 
  notes: number[]; 
  tempo: number; 
  mood: "mysterious" | "tense" | "calm" | "dramatic" | "victory" 
}> = {
  intro: { baseFreq: 220, notes: [1, 1.25, 1.5, 1.25], tempo: 2000, mood: "mysterious" },
  office: { baseFreq: 196, notes: [1, 1.189, 1.335, 1.498], tempo: 2500, mood: "calm" },
  evidence: { baseFreq: 185, notes: [1, 1.122, 1.335, 1.498], tempo: 1800, mood: "mysterious" },
  analysis: { baseFreq: 207, notes: [1, 1.25, 1.414, 1.587], tempo: 1500, mood: "tense" },
  interrogation: { baseFreq: 174, notes: [1, 1.122, 1.26, 1.498], tempo: 1200, mood: "dramatic" },
  result: { baseFreq: 262, notes: [1, 1.25, 1.5, 2], tempo: 2000, mood: "victory" },
};

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [currentRoom, setCurrentRoom] = useState<RoomType>("intro");
  const [volume, setVolume] = useState(0.3);
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const intervalRef = useRef<number | null>(null);
  const noteIndexRef = useRef(0);

  const stopMusic = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    oscillatorsRef.current = [];
  }, []);

  const createAmbientPad = useCallback((freq: number, duration: number) => {
    if (!audioContextRef.current || !gainNodeRef.current) return;
    
    const ctx = audioContextRef.current;
    const now = ctx.currentTime;
    
    // Main oscillator
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const oscGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    osc1.type = "sine";
    osc2.type = "triangle";
    osc1.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * 0.5, now);
    
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, now);
    filter.Q.setValueAtTime(1, now);
    
    // Envelope
    oscGain.gain.setValueAtTime(0, now);
    oscGain.gain.linearRampToValueAtTime(0.15, now + 0.3);
    oscGain.gain.linearRampToValueAtTime(0.1, now + duration * 0.5);
    oscGain.gain.linearRampToValueAtTime(0, now + duration);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(oscGain);
    oscGain.connect(gainNodeRef.current);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
    
    oscillatorsRef.current.push(osc1, osc2);
    
    // Cleanup
    setTimeout(() => {
      oscillatorsRef.current = oscillatorsRef.current.filter(o => o !== osc1 && o !== osc2);
    }, duration * 1000);
  }, []);

  const createDramaticHit = useCallback((freq: number) => {
    if (!audioContextRef.current || !gainNodeRef.current) return;
    
    const ctx = audioContextRef.current;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq * 0.5, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.25, now + 0.5);
    
    oscGain.gain.setValueAtTime(0.08, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    
    osc.connect(oscGain);
    oscGain.connect(gainNodeRef.current);
    
    osc.start(now);
    osc.stop(now + 1.5);
    
    oscillatorsRef.current.push(osc);
  }, []);

  const startMusic = useCallback(() => {
    if (!isMusicEnabled) return;
    
    stopMusic();
    
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    
    if (!gainNodeRef.current) {
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
    
    gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
    
    const config = roomConfigs[currentRoom];
    noteIndexRef.current = 0;
    
    const playNote = () => {
      const noteMultiplier = config.notes[noteIndexRef.current % config.notes.length];
      const freq = config.baseFreq * noteMultiplier;
      
      createAmbientPad(freq, config.tempo / 1000 * 1.5);
      
      if (config.mood === "dramatic" && noteIndexRef.current % 4 === 0) {
        createDramaticHit(config.baseFreq);
      }
      
      noteIndexRef.current++;
    };
    
    playNote();
    intervalRef.current = window.setInterval(playNote, config.tempo);
  }, [currentRoom, volume, isMusicEnabled, stopMusic, createAmbientPad, createDramaticHit]);

  // تحديث مستوى الصوت
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
    }
  }, [volume]);

  // تشغيل/إيقاف الموسيقى
  useEffect(() => {
    if (isMusicEnabled) {
      startMusic();
    } else {
      stopMusic();
    }
    
    return () => stopMusic();
  }, [isMusicEnabled, currentRoom, startMusic, stopMusic]);

  const toggleMusic = useCallback(() => {
    setIsMusicEnabled(prev => !prev);
  }, []);

  return (
    <MusicContext.Provider value={{
      currentRoom,
      setCurrentRoom,
      volume,
      setVolume,
      isMusicEnabled,
      toggleMusic,
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};
