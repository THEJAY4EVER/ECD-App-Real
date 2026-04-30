import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

type Ctx = { enabled: boolean; toggle: () => void };
const MusicCtx = createContext<Ctx | null>(null);

// 4-bar happy progression in C major (I - V - vi - IV)
// Each bar lists [chord notes (Hz), bass note, melody notes over 4 beats]
type Bar = { chord: number[]; bass: number; melody: number[] };
const BARS: Bar[] = [
  { chord: [261.63, 329.63, 392.0], bass: 130.81, melody: [523.25, 659.25, 783.99, 659.25] }, // C
  { chord: [392.0, 493.88, 587.33], bass: 196.0,  melody: [587.33, 698.46, 880.0, 698.46] },   // G
  { chord: [440.0, 523.25, 659.25], bass: 220.0,  melody: [659.25, 783.99, 880.0, 783.99] },   // Am
  { chord: [349.23, 440.0, 523.25], bass: 174.61, melody: [523.25, 659.25, 698.46, 587.33] },  // F
];

export function MusicProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(() => {
    if (typeof localStorage === "undefined") return false;
    return localStorage.getItem("music.enabled") === "1";
  });
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    localStorage.setItem("music.enabled", enabled ? "1" : "0");

    if (!enabled) {
      stopRef.current?.();
      stopRef.current = null;
      return;
    }

    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = ctxRef.current ?? new AC();
    ctxRef.current = ctx;
    if (ctx.state === "suspended") ctx.resume();

    const master = masterRef.current ?? ctx.createGain();
    master.gain.value = 0.09;
    master.connect(ctx.destination);
    masterRef.current = master;

    let stopped = false;
    let timeout = 0;
    let barIdx = 0;

    function env(node: GainNode, when: number, attack: number, peak: number, dur: number) {
      node.gain.setValueAtTime(0, when);
      node.gain.linearRampToValueAtTime(peak, when + attack);
      node.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    }

    function tone(type: OscillatorType, freq: number, when: number, dur: number, peak: number) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      env(g, when, 0.02, peak, dur);
      osc.connect(g);
      g.connect(master);
      osc.start(when);
      osc.stop(when + dur + 0.05);
    }

    // soft chord pad: stacked sines
    function chord(notes: number[], when: number, dur: number) {
      for (const f of notes) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = f;
        env(g, when, 0.18, 0.18, dur);
        osc.connect(g);
        g.connect(master);
        osc.start(when);
        osc.stop(when + dur + 0.05);
      }
    }

    // pluck arpeggio (filtered triangle)
    function pluck(freq: number, when: number, dur: number) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 2500;
      osc.type = "triangle";
      osc.frequency.value = freq;
      env(g, when, 0.005, 0.35, dur);
      osc.connect(lp);
      lp.connect(g);
      g.connect(master);
      osc.start(when);
      osc.stop(when + dur + 0.05);
    }

    // soft kick
    function kick(when: number) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(120, when);
      osc.frequency.exponentialRampToValueAtTime(40, when + 0.18);
      env(g, when, 0.005, 0.6, 0.22);
      osc.connect(g);
      g.connect(master);
      osc.start(when);
      osc.stop(when + 0.3);
    }

    const beat = 0.42; // seconds per beat (≈140 bpm in 4/4 ish — bouncy)

    function playBar() {
      if (stopped) return;
      const bar = BARS[barIdx % BARS.length];
      const t = ctx.currentTime + 0.05;
      const barDur = beat * 4;

      // pad
      chord(bar.chord, t, barDur * 0.95);
      // bass on 1 and 3
      tone("triangle", bar.bass, t + 0, beat * 1.5, 0.45);
      tone("triangle", bar.bass, t + beat * 2, beat * 1.5, 0.45);
      // kick on 1 and 3
      kick(t);
      kick(t + beat * 2);
      // melody (one per beat)
      for (let i = 0; i < 4; i++) {
        pluck(bar.melody[i], t + i * beat, beat * 0.9);
      }
      // sparkly arpeggio between melody notes
      for (let i = 0; i < 8; i++) {
        const f = bar.chord[i % bar.chord.length] * 2;
        pluck(f, t + i * (beat / 2) + beat / 4, beat * 0.4);
      }

      barIdx += 1;
      timeout = window.setTimeout(playBar, barDur * 1000);
    }

    timeout = window.setTimeout(playBar, 50);

    stopRef.current = () => {
      stopped = true;
      window.clearTimeout(timeout);
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);
      // restore later if re-enabled
      window.setTimeout(() => {
        master.gain.setValueAtTime(0.09, ctx.currentTime);
      }, 400);
    };

    return () => stopRef.current?.();
  }, [enabled]);

  return <MusicCtx.Provider value={{ enabled, toggle: () => setEnabled((v) => !v) }}>{children}</MusicCtx.Provider>;
}

export function useMusic() {
  const c = useContext(MusicCtx);
  if (!c) throw new Error("MusicProvider missing");
  return c;
}
