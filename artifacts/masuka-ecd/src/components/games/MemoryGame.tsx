import { useEffect, useRef, useState } from "react";
import { GameHeader, GameSurface, WinBanner } from "./GameShell";

const EMOJIS = ["🦁", "🐘", "🦒", "🦓", "🐒", "🦏", "🐊", "🦋"];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Card = { id: number; emoji: string; flipped: boolean; matched: boolean };

function newDeck(): Card[] {
  const pairs = shuffle(EMOJIS).slice(0, 6);
  return shuffle([...pairs, ...pairs]).map((emoji, id) => ({ id, emoji, flipped: false, matched: false }));
}

export default function MemoryGame() {
  const [deck, setDeck] = useState<Card[]>(newDeck);
  const [picked, setPicked] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const timers = useRef<number[]>([]);

  const matchedCount = deck.filter((c) => c.matched).length;
  const won = matchedCount === deck.length;

  useEffect(() => () => { timers.current.forEach(clearTimeout); timers.current = []; }, []);

  useEffect(() => {
    if (picked.length !== 2) return;
    const [a, b] = picked;
    const ca = deck[a];
    const cb = deck[b];
    setMoves((m) => m + 1);
    const match = ca.emoji === cb.emoji;
    const t = window.setTimeout(() => {
      setDeck((d) => d.map((c, i) => (i === a || i === b ? (match ? { ...c, matched: true } : { ...c, flipped: false }) : c)));
      setPicked([]);
    }, match ? 400 : 800);
    timers.current.push(t);
    return () => { clearTimeout(t); timers.current = timers.current.filter((x) => x !== t); };
  }, [picked, deck]);

  function flip(idx: number) {
    if (picked.length === 2) return;
    if (deck[idx].flipped || deck[idx].matched) return;
    setDeck((d) => d.map((c, i) => (i === idx ? { ...c, flipped: true } : c)));
    setPicked((p) => [...p, idx]);
  }

  function reset() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setDeck(newDeck());
    setPicked([]);
    setMoves(0);
  }

  return (
    <div className="space-y-3">
      <GameHeader score={matchedCount / 2} total={deck.length / 2} onReset={reset} />
      {won ? (
        <WinBanner onPlayAgain={reset} />
      ) : (
        <GameSurface>
          <div className="text-center text-xs text-muted-foreground mb-3">Moves: {moves}</div>
          <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
            {deck.map((c, i) => (
              <button
                key={c.id}
                onClick={() => flip(i)}
                className={`aspect-square rounded-2xl text-4xl flex items-center justify-center transition-all duration-300 ${
                  c.matched
                    ? "bg-emerald-200 scale-95 opacity-70"
                    : c.flipped
                    ? "bg-secondary/30 shadow-inner"
                    : "bg-gradient-to-br from-primary to-primary/70 text-transparent hover:scale-105 shadow-md"
                }`}
                data-testid={`card-${c.id}`}
                aria-label={c.flipped || c.matched ? c.emoji : "Hidden card"}
              >
                {c.flipped || c.matched ? c.emoji : "?"}
              </button>
            ))}
          </div>
        </GameSurface>
      )}
    </div>
  );
}
