import { useState } from "react";
import { GameHeader, GameSurface } from "./GameShell";

const WORDS = [
  { word: "Apple", emoji: "🍎", letter: "A" },
  { word: "Bee", emoji: "🐝", letter: "B" },
  { word: "Cat", emoji: "🐱", letter: "C" },
  { word: "Dog", emoji: "🐶", letter: "D" },
  { word: "Elephant", emoji: "🐘", letter: "E" },
  { word: "Fish", emoji: "🐟", letter: "F" },
  { word: "Goat", emoji: "🐐", letter: "G" },
  { word: "Hat", emoji: "🎩", letter: "H" },
  { word: "Igloo", emoji: "🧊", letter: "I" },
  { word: "Jug", emoji: "🫙", letter: "J" },
  { word: "Lion", emoji: "🦁", letter: "L" },
  { word: "Moon", emoji: "🌙", letter: "M" },
  { word: "Sun", emoji: "☀️", letter: "S" },
  { word: "Tree", emoji: "🌳", letter: "T" },
];

function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function newRound() {
  const target = rand(WORDS);
  const others = WORDS.filter((w) => w.letter !== target.letter).sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [...others.map((w) => w.letter), target.letter].sort(() => Math.random() - 0.5);
  return { target, options };
}

export default function PhonicsGame() {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(newRound);
  const [feedback, setFeedback] = useState<"good" | "bad" | null>(null);

  function pick(letter: string) {
    if (feedback) return;
    if (letter === round.target.letter) {
      setScore((s) => s + 1);
      setFeedback("good");
      setTimeout(() => { setRound(newRound()); setFeedback(null); }, 700);
    } else {
      setFeedback("bad");
      setTimeout(() => setFeedback(null), 500);
    }
  }

  return (
    <div className="space-y-3">
      <GameHeader score={score} onReset={() => { setScore(0); setRound(newRound()); }} />
      <GameSurface>
        <div className="text-center mb-2 text-sm text-muted-foreground">What letter does this start with?</div>
        <div className={`text-center my-4 ${feedback === "good" ? "scale-110 transition-transform" : feedback === "bad" ? "animate-pulse" : ""}`}>
          <div className="text-8xl mb-2">{round.target.emoji}</div>
          <div className="text-2xl font-bold text-primary">{round.target.word}</div>
        </div>
        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
          {round.options.map((l) => (
            <button
              key={l}
              onClick={() => pick(l)}
              className="aspect-square rounded-2xl text-4xl font-extrabold bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground shadow-md active:scale-95 hover:scale-105 transition-transform"
              data-testid={`letter-${l}`}
            >
              {l}
            </button>
          ))}
        </div>
      </GameSurface>
    </div>
  );
}
