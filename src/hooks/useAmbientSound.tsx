import { useEffect, useRef } from "react";
import { useSound } from "./useSoundEffects";

export type AmbientScene = "store" | "office" | "street" | "none";

/**
 * Plays a subtle synthesized ambient loop for a given scene.
 * - store: soft AC hum + distant chatter shimmer
 * - office: low room tone + faint clock tick
 * - street: low rumble + occasional whoosh
 *
 * Volume is intentionally very low (~0.04) so it sits behind dialogue & music.
 * Respects the global sound toggle via useSound().
 */
export const useAmbientSound = (scene: AmbientScene) => {
  const { isSoundEnabled } = useSound();
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<Array<AudioNode>>([]);
  const intervalsRef = useRef<number[]>([]);

  useEffect(() => {
    if (scene === "none" || !isSoundEnabled) return;

    let cancelled = false;
    let ctx: AudioContext;
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return;
    }
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 1.2);
    master.connect(ctx.destination);
    masterGainRef.current = master;

    const track = (n: AudioNode) => nodesRef.current.push(n);

    const buildStore = () => {
      // AC hum: low filtered noise
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 280;
      lp.Q.value = 0.7;
      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.6;
      noise.connect(lp).connect(noiseGain).connect(master);
      noise.start();
      track(noise); track(lp); track(noiseGain);

      // Distant chatter shimmer: occasional soft mid-band swells
      const chatter = window.setInterval(() => {
        if (cancelled) return;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        const f = ctx.createBiquadFilter();
        o.type = "triangle";
        o.frequency.value = 220 + Math.random() * 180;
        f.type = "bandpass";
        f.frequency.value = 600;
        const t = ctx.currentTime;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.04, t + 0.6);
        g.gain.linearRampToValueAtTime(0, t + 1.6);
        o.connect(f).connect(g).connect(master);
        o.start(t);
        o.stop(t + 1.7);
      }, 3500);
      intervalsRef.current.push(chatter);
    };

    const buildOffice = () => {
      // Low room tone
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 70;
      g.gain.value = 0.3;
      o.connect(g).connect(master);
      o.start();
      track(o); track(g);

      // Faint clock tick
      const tick = window.setInterval(() => {
        if (cancelled) return;
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const tg = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = 1800;
        tg.gain.setValueAtTime(0.05, t);
        tg.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.connect(tg).connect(master);
        osc.start(t);
        osc.stop(t + 0.05);
      }, 1000);
      intervalsRef.current.push(tick);
    };

    const buildStreet = () => {
      // Low rumble
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 180;
      const ng = ctx.createGain();
      ng.gain.value = 0.8;
      noise.connect(lp).connect(ng).connect(master);
      noise.start();
      track(noise); track(lp); track(ng);

      // Occasional car whoosh
      const whoosh = window.setInterval(() => {
        if (cancelled) return;
        const t = ctx.currentTime;
        const wb = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
        const wd = wb.getChannelData(0);
        for (let i = 0; i < wd.length; i++) wd[i] = Math.random() * 2 - 1;
        const ws = ctx.createBufferSource();
        ws.buffer = wb;
        const wf = ctx.createBiquadFilter();
        wf.type = "bandpass";
        wf.frequency.setValueAtTime(400, t);
        wf.frequency.linearRampToValueAtTime(900, t + 1.4);
        const wg = ctx.createGain();
        wg.gain.setValueAtTime(0, t);
        wg.gain.linearRampToValueAtTime(0.05, t + 0.4);
        wg.gain.linearRampToValueAtTime(0, t + 1.4);
        ws.connect(wf).connect(wg).connect(master);
        ws.start(t);
        ws.stop(t + 1.5);
      }, 4500);
      intervalsRef.current.push(whoosh);
    };

    if (scene === "store") buildStore();
    else if (scene === "office") buildOffice();
    else if (scene === "street") buildStreet();

    return () => {
      cancelled = true;
      intervalsRef.current.forEach((id) => clearInterval(id));
      intervalsRef.current = [];
      const m = masterGainRef.current;
      const c = ctxRef.current;
      if (m && c) {
        try {
          m.gain.cancelScheduledValues(c.currentTime);
          m.gain.linearRampToValueAtTime(0, c.currentTime + 0.4);
        } catch {}
      }
      setTimeout(() => {
        nodesRef.current.forEach((n) => {
          try { (n as any).stop?.(); } catch {}
          try { (n as any).disconnect?.(); } catch {}
        });
        nodesRef.current = [];
        try { ctxRef.current?.close(); } catch {}
        ctxRef.current = null;
        masterGainRef.current = null;
      }, 600);
    };
  }, [scene, isSoundEnabled]);
};
