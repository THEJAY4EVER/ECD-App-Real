import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function GameHeader({ score, total, onReset }: { score: number; total?: number; onReset?: () => void }) {
  const { t } = useI18n();
  return (
    <Card className="p-3 flex items-center justify-between border-0 shadow-sm bg-gradient-to-r from-primary/10 to-secondary/20">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-secondary-foreground" />
        <span className="font-bold text-lg" data-testid="text-score">
          {t("games.score")}: {score}{total !== undefined && ` / ${total}`}
        </span>
      </div>
      {onReset && (
        <Button size="sm" variant="ghost" onClick={onReset} data-testid="button-reset">
          <RotateCcw className="w-4 h-4 mr-1" /> {t("games.reset")}
        </Button>
      )}
    </Card>
  );
}

export function GameSurface({ children }: { children: ReactNode }) {
  return <Card className="p-4 border-0 shadow-md min-h-[420px]">{children}</Card>;
}

export function WinBanner({ onPlayAgain }: { onPlayAgain: () => void }) {
  const { t } = useI18n();
  return (
    <Card className="p-6 text-center border-0 bg-gradient-to-br from-emerald-100 to-amber-100">
      <div className="text-6xl mb-2 animate-bounce">🎉</div>
      <div className="text-2xl font-extrabold text-primary mb-1">{t("games.youWin")}</div>
      <div className="text-sm text-muted-foreground mb-4">{t("games.youWinDesc")}</div>
      <Button onClick={onPlayAgain} className="font-bold" data-testid="button-play-again">
        <RotateCcw className="w-4 h-4 mr-1" /> {t("games.playAgain")}
      </Button>
    </Card>
  );
}
