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

// Cinematic 4-layer architecture per room.
// scale notes are absolute frequencies (Hz). bassRoot is the deep drone.
interface RoomConfig {
  bassRoot: number;
  padNotes: [number, number, number]; // root + 5th + octave
  melodyNotes: number[];
  melodyIntervalMs: [number, number]; // min/max delay between melody notes
  filterFreq: number;
  filterLfoRate: number; // Hz, slow movement on pad filter
  bassLfoRate: number;
  noteDecay: number; // melody note decay seconds
}

const A_MINOR = [220, 261.63, 329.63, 392, 440, 523.25, 659.25];
const C_MAJOR = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33];
const D_DORIAN = [293.66, 329.63, 349.23, 440, 493.88, 587.33, 659.25];
const E_PHRYGIAN = [329.63, 349.23, 392, 440, 493.88, 523.25, 587.33];
const F_MINOR = [174.61, 207.65, 261.63, 311.13, 349.23, 415.3, 523.25];
const C_FANFARE = [261.63, 329.63, 392, 523.25, 659.25, 783.99];

const roomConfigs: Record<RoomType, RoomConfig> = {
  intro:         { bassRoot: 55,    padNotes: [110, 164.81, 220], melodyNotes: A_MINOR,    melodyIntervalMs: [3500, 6000], filterFreq: 700,  filterLfoRate: 0.08, bassLfoRate: 0.05, noteDecay: 3.5 },
  office:        { bassRoot: 65.41, padNotes: [130.81, 196, 261.63], melodyNotes: C_MAJOR, melodyIntervalMs: [3500, 5500], filterFreq: 900,  filterLfoRate: 0.06, bassLfoRate: 0.04, noteDecay: 3 },
  evidence:      { bassRoot: 73.42, padNotes: [146.83, 220, 293.66], melodyNotes: D_DORIAN, melodyIntervalMs: [4000, 6500], filterFreq: 750,  filterLfoRate: 0.07, bassLfoRate: 0.05, noteDecay: 4 },
  analysis:      { bassRoot: 82.41, padNotes: [164.81, 246.94, 329.63], melodyNotes: E_PHRYGIAN, melodyIntervalMs: [2500, 4000], filterFreq: 1100, filterLfoRate: 0.12, bassLfoRate: 0.08, noteDecay: 2.5 },
  interrogation: { bassRoot: 43.65, padNotes: [87.31, 130.81, 174.61], melodyNotes: F_MINOR, melodyIntervalMs: [4500, 7000], filterFreq: 600,  filterLfoRate: 0.05, bassLfoRate: 0.06, noteDecay: 4 },
  result:        { bassRoot: 65.41, padNotes: [130.81, 196, 261.63], melodyNotes: C_FANFARE, melodyIntervalMs: [2000, 3500], filterFreq: 1400, filterLfoRate: 0.1,  bassLfoRate: 0.05, noteDecay: 2.2 },
};

const CROSSFADE_SEC = 2;

export const MusicProvider = ({ children }: { children: ReactNode }) => {
  const [currentRoom, setCurrentRoomState] = useState<RoomType>("intro");
  const [volume, setVolume] = useState(0.4);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);

  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const reverbBusRef = useRef<GainNode | null>(null);

  // current scene nodes (for crossfade out)
  const sceneRef = useRef<{
    sceneGain: GainNode;
    nodes: AudioNode[];
    intervals: number[];
  } | null>(null);

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const master = ctxRef.current.createGain();
      master.gain.value = volume;
      master.connect(ctxRef.current.destination);
      masterGainRef.current = master;

      // Convolution reverb bus from white-noise impulse
      const ctx = ctxRef.current;
      const conv = ctx.createConvolver();
      const len = ctx.sampleRate * 2.2;
      const ir = ctx.createBuffer(2, len, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const d = ir.getChannelData(ch);
        for (let i = 0; i < len; i++) {
          d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
        }
      }
      conv.buffer = ir;
      const reverbGain = ctx.createGain();
      reverbGain.gain.value = 0.35;
      conv.connect(reverbGain).connect(master);

      // expose a "send-to-reverb" gain entry node
      const sendBus = ctx.createGain();
      sendBus.gain.value = 1;
      sendBus.connect(conv);
      reverbBusRef.current = sendBus;
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, [volume]);

  const stopScene = useCallback((scene: typeof sceneRef.current, immediate = false) => {
    if (!scene || !ctxRef.current) return;
    const ctx = ctxRef.current;
    const now = ctx.currentTime;
    const fade = immediate ? 0.05 : CROSSFADE_SEC;
    try {
      scene.sceneGain.gain.cancelScheduledValues(now);
      scene.sceneGain.gain.setValueAtTime(scene.sceneGain.gain.value, now);
      scene.sceneGain.gain.linearRampToValueAtTime(0, now + fade);
    } catch { /* noop */ }
    scene.intervals.forEach((id) => clearInterval(id));
    setTimeout(() => {
      scene.nodes.forEach((n) => {
        try { (n as OscillatorNode).stop?.(); } catch { /* noop */ }
        try { n.disconnect(); } catch { /* noop */ }
      });
      try { scene.sceneGain.disconnect(); } catch { /* noop */ }
    }, (fade + 0.2) * 1000);
  }, []);

  const startScene = useCallback((room: RoomType) => {
    const ctx = ensureCtx();
    const master = masterGainRef.current!;
    const reverbBus = reverbBusRef.current!;
    const cfg = roomConfigs[room];
    const now = ctx.currentTime;

    // Per-scene gain — enables crossfade
    const sceneGain = ctx.createGain();
    sceneGain.gain.setValueAtTime(0, now);
    sceneGain.gain.linearRampToValueAtTime(1, now + CROSSFADE_SEC);
    sceneGain.connect(master);
    // Also send a copy to reverb
    const reverbSend = ctx.createGain();
    reverbSend.gain.value = 0.4;
    sceneGain.connect(reverbSend).connect(reverbBus);

    const nodes: AudioNode[] = [sceneGain, reverbSend];
    const intervals: number[] = [];

    // ---- BASS LAYER ----
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    const bassLfo = ctx.createOscillator();
    const bassLfoGain = ctx.createGain();
    bassOsc.type = "sine";
    bassOsc.frequency.value = cfg.bassRoot;
    bassGain.gain.value = 0.22;
    bassLfo.type = "sine";
    bassLfo.frequency.value = cfg.bassLfoRate;
    bassLfoGain.gain.value = 0.05;
    bassLfo.connect(bassLfoGain).connect(bassGain.gain);
    bassOsc.connect(bassGain).connect(sceneGain);
    bassOsc.start(now);
    bassLfo.start(now);
    nodes.push(bassOsc, bassGain, bassLfo, bassLfoGain);

    // ---- PAD LAYER (3 oscillators harmonic) ----
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = "lowpass";
    padFilter.frequency.value = cfg.filterFreq;
    padFilter.Q.value = 0.8;
    const padGain = ctx.createGain();
    padGain.gain.value = 0.13;
    padFilter.connect(padGain).connect(sceneGain);

    const padOsc1 = ctx.createOscillator();
    const padOsc2 = ctx.createOscillator();
    const padOsc3 = ctx.createOscillator();
    padOsc1.type = "sine";
    padOsc2.type = "triangle";
    padOsc3.type = "sine";
    padOsc1.frequency.value = cfg.padNotes[0];
    padOsc2.frequency.value = cfg.padNotes[1];
    padOsc3.frequency.value = cfg.padNotes[2];
    padOsc1.detune.value = -7;
    padOsc3.detune.value = 7;
    padOsc1.connect(padFilter);
    padOsc2.connect(padFilter);
    padOsc3.connect(padFilter);
    padOsc1.start(now);
    padOsc2.start(now);
    padOsc3.start(now);
    nodes.push(padFilter, padGain, padOsc1, padOsc2, padOsc3);

    // Filter LFO
    const filterLfo = ctx.createOscillator();
    const filterLfoGain = ctx.createGain();
    filterLfo.type = "sine";
    filterLfo.frequency.value = cfg.filterLfoRate;
    filterLfoGain.gain.value = cfg.filterFreq * 0.35;
    filterLfo.connect(filterLfoGain).connect(padFilter.frequency);
    filterLfo.start(now);
    nodes.push(filterLfo, filterLfoGain);

    // ---- MELODY LAYER (bell-like notes pentatonic-ish) ----
    const playMelodyNote = () => {
      if (!ctxRef.current) return;
      const c = ctxRef.current;
      const t = c.currentTime;
      const note = cfg.melodyNotes[Math.floor(Math.random() * cfg.melodyNotes.length)];
      // Fundamental + 2x harmonic for bell quality
      [
        { f: note, vol: 0.18, type: "sine" as OscillatorType },
        { f: note * 2, vol: 0.06, type: "sine" as OscillatorType },
        { f: note * 3, vol: 0.025, type: "triangle" as OscillatorType },
      ].forEach(({ f, vol: v, type }) => {
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = type;
        o.frequency.value = f;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(v, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + cfg.noteDecay);
        o.connect(g).connect(sceneGain);
        // Send to reverb
        g.connect(reverbSend);
        o.start(t);
        o.stop(t + cfg.noteDecay + 0.1);
      });
    };

    const scheduleNext = () => {
      const [minMs, maxMs] = cfg.melodyIntervalMs;
      const delay = minMs + Math.random() * (maxMs - minMs);
      const id = window.setTimeout(() => {
        playMelodyNote();
        scheduleNext();
      }, delay);
      intervals.push(id as unknown as number);
    };
    // First melody note slight delay so scene fades in first
    const startId = window.setTimeout(() => {
      playMelodyNote();
      scheduleNext();
    }, 1500);
    intervals.push(startId as unknown as number);

    return { sceneGain, nodes, intervals };
  }, [ensureCtx]);

  const setCurrentRoom = useCallback((room: RoomType) => {
    setCurrentRoomState(room);
  }, []);

  // React to room/enabled changes — crossfade scenes
  useEffect(() => {
    if (!isMusicEnabled) {
      if (sceneRef.current) {
        stopScene(sceneRef.current, false);
        sceneRef.current = null;
      }
      return;
    }

    // Crossfade: start new scene, fade out previous
    const previous = sceneRef.current;
    const next = startScene(currentRoom);
    sceneRef.current = next;
    if (previous) {
      stopScene(previous, false);
    }

    return () => {
      // Cleanup of *this* scene only when it's unmounted/swapped
      // The next effect run handles its own previous via the closure above.
    };
  }, [currentRoom, isMusicEnabled, startScene, stopScene]);

  // Update master volume live
  useEffect(() => {
    if (masterGainRef.current && ctxRef.current) {
      const now = ctxRef.current.currentTime;
      masterGainRef.current.gain.cancelScheduledValues(now);
      masterGainRef.current.gain.linearRampToValueAtTime(volume, now + 0.2);
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sceneRef.current) {
        sceneRef.current.intervals.forEach((id) => clearTimeout(id as unknown as number));
        sceneRef.current.nodes.forEach((n) => {
          try { (n as OscillatorNode).stop?.(); } catch { /* noop */ }
          try { n.disconnect(); } catch { /* noop */ }
        });
      }
      try { ctxRef.current?.close(); } catch { /* noop */ }
    };
  }, []);

  const toggleMusic = useCallback(() => {
    setIsMusicEnabled((prev) => !prev);
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
