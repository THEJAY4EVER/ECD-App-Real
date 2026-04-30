import { useEffect, useRef, useState } from "react";
import { Volume2, RotateCcw, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GameHeader, GameSurface } from "./GameShell";

type Animal = { animal: string; emoji: string; sound: string; spoken: string };

const ANIMALS: Animal[] = [
  { animal: "Cow",     emoji: "🐄", sound: "Moo",   spoken: "Moooo" },
  { animal: "Dog",     emoji: "🐶", sound: "Woof",  spoken: "Woof woof" },
  { animal: "Cat",     emoji: "🐱", sound: "Meow",  spoken: "Meow" },
  { animal: "Sheep",   emoji: "🐑", sound: "Baa",   spoken: "Baaaa" },
  { animal: "Lion",    emoji: "🦁", sound: "Roar",  spoken: "Roooaar" },
  { animal: "Pig",     emoji: "🐖", sound: "Oink",  spoken: "Oink oink" },
  { animal: "Duck",    emoji: "🦆", sound: "Quack", spoken: "Quack quack" },
  { animal: "Horse",   emoji: "🐴", sound: "Neigh", spoken: "Neigh" },
  { animal: "Chicken", emoji: "🐔", sound: "Cluck", spoken: "Cluck cluck" },
  { animal: "Bee",     emoji: "🐝", sound: "Buzz",  spoken: "Bzzzz" },
];

const TOTAL_ROUNDS = 8;

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function newRound() {
  const target = rand(ANIMALS);
  const others = ANIMALS.filter((a) => a.animal !== target.animal)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const all = [...others, target].sort(() => Math.random() - 0.5);
  return { target, all };
}

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-GB";
    u.rate = 0.9;
    u.pitch = 1.2;
    u.volume = 1;
    window.speechSynthesis.speak(u);
  } catch {
    /* no-op */
  }
}

export default function AnimalSoundGame() {
  const [score, setScore] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [round, setRound] = useState(newRound);
  const [feedback, setFeedback] = useState<"good" | "bad" | null>(null);
  const [done, setDone] = useState(false);
  const advanceTimer = useRef<number | null>(null);

  // Speak the target sound at the start of each round.
  useEffect(() => {
    if (done) return;
    const t = window.setTimeout(() => speak(round.target.spoken), 250);
    return () => {
      window.clearTimeout(t);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [round, done]);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function reset() {
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    setScore(0);
    setRoundIndex(0);
    setRound(newRound());
    setFeedback(null);
    setDone(false);
  }

  function pick(a: Animal) {
    if (feedback || done) return;
    // Speak the picked animal's name + sound so kids hear what they chose.
    speak(`${a.animal}. ${a.spoken}`);

    const isCorrect = a.animal === round.target.animal;
    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedback("good");
    } else {
      setFeedback("bad");
    }

    advanceTimer.current = window.setTimeout(
      () => {
        setFeedback(null);
        const nextIdx = roundIndex + 1;
        if (nextIdx >= TOTAL_ROUNDS) {
          setDone(true);
        } else {
          setRoundIndex(nextIdx);
          setRound(newRound());
        }
      },
      isCorrect ? 1100 : 900,
    );
  }

  if (done) {
    const stars = score >= TOTAL_ROUNDS ? 3 : score >= Math.ceil(TOTAL_ROUNDS * 0.7) ? 2 : 1;
    return (
      <div className="space-y-3">
        <GameHeader score={score} onReset={reset} />
        <GameSurface>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220 }}
            className="text-center py-8"
          >
            <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.6 }}>
              <Trophy className="w-20 h-20 mx-auto text-amber-500 mb-2" />
            </motion.div>
            <div className="text-2xl font-extrabold text-primary">Well done!</div>
            <div className="text-lg mt-1 mb-2" data-testid="text-final-score">
              You scored {score} / {TOTAL_ROUNDS}
            </div>
            <div className="text-3xl mb-4" aria-hidden>
              {"⭐".repeat(stars)}{"☆".repeat(3 - stars)}
            </div>
            <Button onClick={reset} className="font-bold" data-testid="button-play-again">
              <RotateCcw className="w-4 h-4 mr-1" /> Play again
            </Button>
          </motion.div>
        </GameSurface>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <GameHeader score={score} onReset={reset} />
      <GameSurface>
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span data-testid="text-round-progress">
            Round {roundIndex + 1} of {TOTAL_ROUNDS}
          </span>
          <span>Score: {score}</span>
        </div>
        <div className="text-center mb-4">
          <div className="text-sm text-muted-foreground mb-1">Which animal says</div>
          <div className="flex items-center justify-center gap-2">
            <div
              className={`text-4xl font-extrabold text-primary ${
                feedback === "good"
                  ? "scale-125 transition-transform"
                  : feedback === "bad"
                    ? "animate-pulse text-rose-600"
                    : ""
              }`}
              data-testid="text-target-sound"
            >
              "{round.target.sound}"
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => speak(round.target.spoken)}
              aria-label="Hear the sound again"
              data-testid="button-replay-sound"
            >
              <Volume2 className="w-5 h-5 text-violet-600" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          {round.all.map((a) => (
            <button
              key={a.animal}
              onClick={() => pick(a)}
              disabled={feedback !== null}
              className="aspect-square rounded-2xl bg-gradient-to-br from-amber-100 to-orange-50 shadow-md active:scale-95 hover:scale-105 transition-transform flex flex-col items-center justify-center gap-1 disabled:opacity-60"
              data-testid={`animal-${a.animal}`}
            >
              <div className="text-6xl" aria-hidden>{a.emoji}</div>
              <div className="text-sm font-bold">{a.animal}</div>
            </button>
          ))}
        </div>
      </GameSurface>
    </div>
  );
}
