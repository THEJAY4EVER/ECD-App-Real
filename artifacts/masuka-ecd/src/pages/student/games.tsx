import { Link } from "wouter";
import { Shell } from "@/components/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";

type GameEntry =
  | { type: "game"; slug: string; emoji: string; titleKey: string; descKey: string; bg: string }
  | { type: "draw"; emoji: string; title: string; desc: string; bg: string; href: string };

const GAMES: GameEntry[] = [
  { type: "game", slug: "memory",   emoji: "🧠", titleKey: "games.memory.title",   descKey: "games.memory.desc",   bg: "from-emerald-200 to-teal-100" },
  { type: "game", slug: "colors",   emoji: "🎨", titleKey: "games.colors.title",   descKey: "games.colors.desc",   bg: "from-pink-200 to-rose-100" },
  { type: "game", slug: "counting", emoji: "🔢", titleKey: "games.counting.title", descKey: "games.counting.desc", bg: "from-amber-200 to-yellow-100" },
  { type: "game", slug: "phonics",  emoji: "🔤", titleKey: "games.phonics.title",  descKey: "games.phonics.desc",  bg: "from-sky-200 to-blue-100" },
  { type: "game", slug: "shapes",   emoji: "🔺", titleKey: "games.shapes.title",   descKey: "games.shapes.desc",   bg: "from-violet-200 to-purple-100" },
  { type: "game", slug: "animals",  emoji: "🦁", titleKey: "games.animals.title",  descKey: "games.animals.desc",  bg: "from-orange-200 to-amber-100" },
  { type: "draw", emoji: "🖌️", title: "Draw & Create", desc: "Paint, colour and save your artwork!", bg: "from-fuchsia-200 to-pink-100", href: "/draw" },
];

export default function StudentGames() {
  const { t } = useI18n();

  return (
    <Shell title={t("nav.games")}>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-extrabold">{t("games.heading")}</h1>
        </div>
        <p className="text-sm text-muted-foreground">{t("games.subhead")}</p>

        <div className="grid grid-cols-2 gap-3">
          {GAMES.map((g, idx) => {
            const href = g.type === "draw" ? g.href : `/games/${g.slug}`;
            const label = g.type === "draw" ? g.title : t(g.titleKey);
            const desc  = g.type === "draw" ? g.desc  : t(g.descKey);
            const testId = g.type === "draw" ? "game-draw" : `game-${g.slug}`;
            return (
              <motion.div
                key={href}
                initial={{ opacity: 0, scale: 0.5, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 240, damping: 14, delay: idx * 0.08 }}
                whileHover={{ scale: 1.06, rotate: idx % 2 === 0 ? -2 : 2 }}
                whileTap={{ scale: 0.94 }}
              >
                <Link href={href}>
                  <Card className={`hover-elevate active-elevate-2 cursor-pointer border-0 shadow-md overflow-hidden bg-gradient-to-br ${g.bg}`} data-testid={testId}>
                    <CardContent className="p-4 flex flex-col items-center text-center gap-1 aspect-square justify-center">
                      <motion.div
                        className="text-5xl"
                        animate={{ y: [0, -6, 0], rotate: [0, -8, 8, 0] }}
                        transition={{ duration: 2.8, repeat: Infinity, delay: idx * 0.25, ease: "easeInOut" }}
                      >
                        {g.emoji}
                      </motion.div>
                      <div className="font-bold text-sm">{label}</div>
                      <div className="text-[11px] text-foreground/70 line-clamp-2">{desc}</div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
