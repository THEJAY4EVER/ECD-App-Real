import type { ComponentType } from "react";
import { useRoute, Link } from "wouter";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import MemoryGame from "@/components/games/MemoryGame";
import ColorTapGame from "@/components/games/ColorTapGame";
import CountingGame from "@/components/games/CountingGame";
import PhonicsGame from "@/components/games/PhonicsGame";
import ShapeSorterGame from "@/components/games/ShapeSorterGame";
import AnimalSoundGame from "@/components/games/AnimalSoundGame";

const GAMES: Record<string, { titleKey: string; Component: ComponentType }> = {
  memory: { titleKey: "games.memory.title", Component: MemoryGame },
  colors: { titleKey: "games.colors.title", Component: ColorTapGame },
  counting: { titleKey: "games.counting.title", Component: CountingGame },
  phonics: { titleKey: "games.phonics.title", Component: PhonicsGame },
  shapes: { titleKey: "games.shapes.title", Component: ShapeSorterGame },
  animals: { titleKey: "games.animals.title", Component: AnimalSoundGame },
};

export default function GamePlay() {
  const [, params] = useRoute("/games/:slug");
  const { t } = useI18n();
  const slug = params?.slug ?? "";
  const game = GAMES[slug];

  return (
    <Shell title={game ? t(game.titleKey) : t("nav.games")}>
      <div className="space-y-3">
        <Link href="/games">
          <Button variant="ghost" size="sm" className="-ml-2" data-testid="button-back">
            <ChevronLeft className="w-4 h-4 mr-1" /> {t("nav.games")}
          </Button>
        </Link>
        {game ? <game.Component /> : <div className="text-center text-muted-foreground py-8">{t("games.notFound")}</div>}
      </div>
    </Shell>
  );
}
