import { Shell } from "@/components/Shell";
import { useI18n, LANGUAGES, type Lang } from "@/lib/i18n";
import { useTheme, type Theme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Moon, Monitor, Check, Info, Mail, MapPin, Heart, Lightbulb, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { t } = useI18n();
  return (
    <Shell title={t("settings.title")}>
      <div className="space-y-4" data-testid="page-settings">
        <ThemeCard />
        <LanguageCard />
        <MissionCard />
        <AboutCard />
      </div>
    </Shell>
  );
}

function ThemeCard() {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  const opts: { value: Theme; label: string; Icon: typeof Sun }[] = [
    { value: "light", label: t("settings.theme.light"), Icon: Sun },
    { value: "dark", label: t("settings.theme.dark"), Icon: Moon },
    { value: "system", label: t("settings.theme.system"), Icon: Monitor },
  ];
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Sun className="w-4 h-4 text-amber-500" /> {t("settings.theme.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {opts.map(({ value, label, Icon }) => {
            const active = theme === value;
            return (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={cn(
                  "rounded-xl border p-3 flex flex-col items-center gap-1 transition-colors",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:bg-muted",
                )}
                data-testid={`theme-${value}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
                {active && <Check className="w-3 h-3" />}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function LanguageCard() {
  const { t, lang, setLang } = useI18n();
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <span aria-hidden>🌍</span> {t("settings.language.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          {LANGUAGES.map((l) => {
            const active = lang === l.code;
            return (
              <button
                key={l.code}
                onClick={() => setLang(l.code as Lang)}
                className={cn(
                  "rounded-xl border p-3 flex items-center gap-3 transition-colors text-left",
                  active
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted",
                )}
                data-testid={`settings-lang-${l.code}`}
              >
                <span className="text-2xl" aria-hidden>{l.flag}</span>
                <span className="flex-1 font-medium">{l.label}</span>
                {active && <Check className="w-4 h-4 text-primary" />}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function MissionCard() {
  return (
    <Card data-testid="card-mission">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" /> Mission
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-muted-foreground">
          At the intersection of pedagogy and innovation, Masuka IT Team is redefining the ECD landscape. Our application leverages intuitive technology to provide educators and parents with the tools needed to accelerate cognitive growth and foster a lifelong love for learning.
        </p>
      </CardContent>
    </Card>
  );
}

function AboutCard() {
  const { t } = useI18n();
  const { user } = useAuth();
  return (
    <Card data-testid="card-about">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" /> {t("settings.about.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <Logo size={56} className="rounded-full bg-white shadow-sm shrink-0" />
          <div>
            <div className="font-bold leading-tight">{t("app.title")}</div>
            <div className="text-xs text-muted-foreground">{t("app.tagline")}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {t("settings.about.version")} 1.0.0
            </div>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("settings.about.description")}
        </p>

        <div className="rounded-xl bg-muted/50 p-3 space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            <span>{t("settings.about.address")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary shrink-0" />
            <a href="mailto:masukachristianhigh1@gmail.com" className="hover:underline break-all">
              masukachristianhigh1@gmail.com
            </a>
          </div>
        </div>

        <div className="rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground flex items-start gap-2">
          <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <span>{t("settings.about.credits")}</span>
        </div>

        <div className="rounded-xl bg-primary/5 border border-primary/20 p-3 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <HeartHandshake className="w-4 h-4 shrink-0" />
            For feedback and support contact the Masuka IT Team
          </div>
          <div className="space-y-1.5 text-xs text-muted-foreground pl-6">
            <div>
              <a href="mailto:jainosjunior@gmail.com" className="text-primary hover:underline font-medium">jainosjunior@gmail.com</a>
              <div className="text-[11px]">Jainos Junior T Mugova</div>
            </div>
            <div>
              <a href="mailto:mudimu19t@gmail.com" className="text-primary hover:underline font-medium">mudimu19t@gmail.com</a>
              <div className="text-[11px]">Takudzwa Mudimu</div>
            </div>
          </div>
        </div>

        {user && (
          <div className="text-[11px] text-muted-foreground text-center">
            {t("settings.about.signedInAs")} <span className="font-medium">{user.fullName}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
