import { Music, VolumeX } from "lucide-react";
import { useMusic } from "@/lib/music";
import { Button } from "@/components/ui/button";

export function MusicToggle() {
  const { enabled, toggle } = useMusic();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={enabled ? "Mute music" : "Play music"}
      className={enabled ? "text-primary" : "text-muted-foreground"}
      data-testid="button-music-toggle"
    >
      {enabled ? <Music className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
    </Button>
  );
}
