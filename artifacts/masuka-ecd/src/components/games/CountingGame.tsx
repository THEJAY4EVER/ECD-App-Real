import { useState } from "react";
import { GameHeader, GameSurface } from "./GameShell";

const ITEMS = ["🍎", "🌟", "🐝", "🌻", "🐞", "🦋", "🍓", "⚽"];

function rand(n: number) { return Math.floor(Math.random() * n); }

function newRound() {
  const item = ITEMS[rand(ITEMS.length)];
  const count = rand(8) + 2; // 2..9
  const choices = new Set<number>([count]);
  while (choices.size < 4) {
    const c = Math.max(1, count + rand(5) - 2);
    if (c !== count && c <= 10) choices.add(c);
  }
  return { item, count, options: [...choices].sort(() => Math.random() - 0.5) };
}

export default function CountingGame() {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(newRound);
  const [feedback, setFeedback] = useState<"good" | "bad" | null>(null);

  function pick(n: number) {
    if (feedback) return;
    if (n === round.count) {
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
        <div className="text-center mb-4 text-sm text-muted-foreground">How many do you see?</div>
        <div className={`flex flex-wrap justify-center gap-1 mb-6 p-4 rounded-2xl bg-muted/40 min-h-[140px] items-center ${feedback === "good" ? "ring-4 ring-emerald-400" : feedback === "bad" ? "ring-4 ring-rose-400 animate-pulse" : ""}`}>
          {Array.from({ length: round.count }).map((_, i) => (
            <span key={i} className="text-4xl">{round.item}</span>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
          {round.options.map((n) => (
            <button
              key={n}
              onClick={() => pick(n)}
              className="aspect-square rounded-2xl text-3xl font-extrabold bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md active:scale-95 hover:scale-105 transition-transform"
              data-testid={`count-${n}`}
            >
              {n}
            </button>
          ))}
        </div>
      </GameSurface>
    </div>
  );
}
