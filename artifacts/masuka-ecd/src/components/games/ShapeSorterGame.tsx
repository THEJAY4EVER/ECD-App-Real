import { useState } from "react";
import { GameHeader, GameSurface } from "./GameShell";

const SHAPES = [
  { name: "Circle", svg: <circle cx="40" cy="40" r="32" /> },
  { name: "Square", svg: <rect x="10" y="10" width="60" height="60" rx="4" /> },
  { name: "Triangle", svg: <polygon points="40,8 72,68 8,68" /> },
  { name: "Star", svg: <polygon points="40,6 50,30 76,32 56,50 62,76 40,62 18,76 24,50 4,32 30,30" /> },
  { name: "Heart", svg: <path d="M40 70 C 10 50, 10 18, 40 28 C 70 18, 70 50, 40 70 Z" /> },
];

const COLORS = ["#16a34a", "#facc15", "#dc2626", "#2563eb", "#9333ea", "#ea580c"];

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function newRound() {
  const target = rand(SHAPES);
  const others = SHAPES.filter((s) => s.name !== target.name).sort(() => Math.random() - 0.5).slice(0, 3);
  const all = [...others, target].sort(() => Math.random() - 0.5);
  const colors = all.map(() => rand(COLORS));
  return { target, all, colors };
}

export default function ShapeSorterGame() {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(newRound);
  const [feedback, setFeedback] = useState<"good" | "bad" | null>(null);

  function pick(name: string) {
    if (feedback) return;
    if (name === round.target.name) {
      setScore((s) => s + 1);
      setFeedback("good");
      setTimeout(() => { setRound(newRound()); setFeedback(null); }, 600);
    } else {
      setFeedback("bad");
      setTimeout(() => setFeedback(null), 500);
    }
  }

  return (
    <div className="space-y-3">
      <GameHeader score={score} onReset={() => { setScore(0); setRound(newRound()); }} />
      <GameSurface>
        <div className="text-center mb-4">
          <div className="text-sm text-muted-foreground mb-1">Find the</div>
          <div className={`text-3xl font-extrabold text-primary ${feedback === "good" ? "scale-125 transition-transform" : feedback === "bad" ? "animate-pulse text-rose-600" : ""}`}>
            {round.target.name}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          {round.all.map((s, i) => (
            <button
              key={i}
              onClick={() => pick(s.name)}
              className="aspect-square rounded-2xl bg-white shadow-md active:scale-95 hover:scale-105 transition-transform p-4 flex items-center justify-center"
              data-testid={`shape-${s.name}`}
              aria-label={s.name}
            >
              <svg viewBox="0 0 80 80" className="w-full h-full" fill={round.colors[i]}>
                {s.svg}
              </svg>
            </button>
          ))}
        </div>
      </GameSurface>
    </div>
  );
}
