import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const LANG_BCP47: Record<string, string> = {
  en: "en-GB",
  fr: "fr-FR",
  zh: "zh-CN",
  sn: "en-ZA",
  nd: "en-ZA",
};

// Strip markdown, emoji and other symbols so the read-aloud voice only
// pronounces words and numbers, not punctuation/decorations.
function stripForSpeech(s: string): string {
  let out = s
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^>\s+/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/\|/g, " ")
    .replace(/\n{2,}/g, ". ")
    .replace(/\s+/g, " ");
  // Remove all emoji & pictographic symbols (BMP + supplementary planes).
  try {
    out = out.replace(/\p{Extended_Pictographic}/gu, " ");
  } catch {
    // Fallback for engines without Unicode property escapes
    out = out.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, " ");
  }
  // Variation selectors / ZWJ used to compose emoji
  out = out.replace(/[\u200D\uFE0F]/g, "");
  // Keep only letters, digits, whitespace and basic sentence punctuation.
  out = out.replace(/[^\p{L}\p{N}\s.,!?'-]/gu, " ");
  return out.replace(/\s+/g, " ").trim();
}

export function Narrator({ text }: { text: string }) {
  const { t, lang } = useI18n();
  const [supported, setSupported] = useState(true);
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!supported) {
    return (
      <span className="text-[10px] text-muted-foreground" data-testid="text-narrate-unsupported">
        {t("narrator.unavailable")}
      </span>
    );
  }

  function play() {
    const synth = window.speechSynthesis;
    if (state === "paused") {
      synth.resume();
      setState("playing");
      return;
    }
    synth.cancel();
    setUnavailable(false);
    const cleaned = stripForSpeech(text);
    if (!cleaned) {
      setUnavailable(true);
      setState("idle");
      return;
    }
    const u = new SpeechSynthesisUtterance(cleaned);
    u.lang = LANG_BCP47[lang] ?? "en-GB";
    u.rate = 0.9;
    u.pitch = 1.1;
    const voices = synth.getVoices();
    const match = voices.find((v) => v.lang.toLowerCase().startsWith(u.lang.toLowerCase().split("-")[0]));
    if (match) u.voice = match;
    u.onend = () => setState("idle");
    u.onerror = () => { setState("idle"); setUnavailable(true); };
    setState("playing");
    synth.speak(u);
    // Detect environments without TTS voices: if speak didn't start, show fallback
    window.setTimeout(() => {
      if (!synth.speaking && !synth.pending) {
        setState("idle");
        setUnavailable(true);
      }
    }, 250);
  }

  function pause() {
    window.speechSynthesis.pause();
    setState("paused");
  }

  function stop() {
    window.speechSynthesis.cancel();
    setState("idle");
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        {state !== "playing" ? (
          <Button size="sm" onClick={play} className="font-bold" data-testid="button-narrate-play">
            <Play className="w-4 h-4 mr-1" /> {state === "paused" ? t("narrator.resume") : t("narrator.play")}
          </Button>
        ) : (
          <Button size="sm" variant="secondary" onClick={pause} data-testid="button-narrate-pause">
            <Pause className="w-4 h-4 mr-1" /> {t("narrator.pause")}
          </Button>
        )}
        {state !== "idle" && (
          <Button size="sm" variant="ghost" onClick={stop} data-testid="button-narrate-stop">
            <Square className="w-4 h-4 mr-1" /> {t("narrator.stop")}
          </Button>
        )}
      </div>
      {unavailable && (
        <span className="text-[10px] text-muted-foreground" data-testid="text-narrate-unavailable">
          {t("narrator.unavailable")}
        </span>
      )}
    </div>
  );
}
