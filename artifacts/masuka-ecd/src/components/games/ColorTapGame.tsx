import { useState } from "react";
import { GameHeader, GameSurface } from "./GameShell";
import { useI18n } from "@/lib/i18n";

const COLORS = [
  { name: { en: "Red", fr: "Rouge", zh: "红色", sn: "Tsvuku", nd: "Bomvu" }, hex: "#dc2626" },
  { name: { en: "Blue", fr: "Bleu", zh: "蓝色", sn: "Bhuruu", nd: "Luhlaza okwesibhakabhaka" }, hex: "#2563eb" },
  { name: { en: "Yellow", fr: "Jaune", zh: "黄色", sn: "Yero", nd: "Ophuzi" }, hex: "#facc15" },
  { name: { en: "Green", fr: "Vert", zh: "绿色", sn: "Girini", nd: "Luhlaza" }, hex: "#16a34a" },
  { name: { en: "Orange", fr: "Orange", zh: "橙色", sn: "Orenji", nd: "Olamula" }, hex: "#ea580c" },
  { name: { en: "Purple", fr: "Violet", zh: "紫色", sn: "Pepuru", nd: "Okuyibubende" }, hex: "#9333ea" },
];

function pick<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export default function ColorTapGame() {
  const { lang } = useI18n();
  const [score, setScore] = useState(0);
  const [target, setTarget] = useState(() => COLORS[Math.floor(Math.random() * COLORS.length)]);
  const [options, setOptions] = useState(() => pick(COLORS, 4));
  const [feedback, setFeedback] = useState<"good" | "bad" | null>(null);

  function next() {
    const newOpts = pick(COLORS, 4);
    const t = newOpts[Math.floor(Math.random() * newOpts.length)];
    setOptions(newOpts);
    setTarget(t);
    setFeedback(null);
  }

  function tap(c: typeof target) {
    if (feedback) return;
    if (c.hex === target.hex) {
      setScore((s) => s + 1);
      setFeedback("good");
      setTimeout(next, 600);
    } else {
      setFeedback("bad");
      setTimeout(() => setFeedback(null), 500);
    }
  }

  // Ensure target is in options
  const finalOptions = options.find((o) => o.hex === target.hex) ? options : [target, ...options.slice(1)];

  return (
    <div className="space-y-3">
      <GameHeader score={score} onReset={() => { setScore(0); next(); }} />
      <GameSurface>
        <div className="text-center mb-6">
          <div className="text-sm text-muted-foreground mb-2">Tap the colour</div>
          <div className={`text-4xl font-extrabold transition-transform ${feedback === "good" ? "scale-125 text-emerald-600" : feedback === "bad" ? "animate-pulse text-rose-600" : ""}`}>
            {target.name[lang as keyof typeof target.name]}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          {finalOptions.map((c, i) => (
            <button
              key={i}
              onClick={() => tap(c)}
              style={{ background: c.hex }}
              className="aspect-square rounded-3xl shadow-lg active:scale-95 transition-transform hover:scale-105 ring-4 ring-white"
              data-testid={`color-${c.hex}`}
              aria-label={c.name.en}
            />
          ))}
        </div>
      </GameSurface>
    </div>
  );
}
