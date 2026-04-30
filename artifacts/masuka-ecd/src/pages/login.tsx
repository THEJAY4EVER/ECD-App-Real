import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/Logo";
import { LanguagePicker } from "@/components/LanguagePicker";
import { ApiError } from "@workspace/api-client-react";

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useI18n();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const u = await login(username.trim(), password);
      toast({ title: `${t("auth.welcome")}, ${u.fullName.split(" ")[0]}!` });
      navigate("/");
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        const msg = (err.data as { message?: string })?.message;
        toast({
          title: "Account Disabled",
          description: msg ?? "This account has been disabled. Please contact the school administrator.",
          variant: "destructive",
        });
      } else {
        toast({
          title: t("auth.failed"),
          description: t("auth.failedDesc"),
          variant: "destructive",
        });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-emerald-100 via-amber-50 to-emerald-50 flex items-center justify-center p-4"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="absolute top-4 right-4" style={{ top: "calc(1rem + env(safe-area-inset-top, 0px))" }}>
        <LanguagePicker variant="outline" />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex mb-4" style={{ position: "relative" }}>
            <div
              className="w-28 h-28 rounded-full overflow-hidden bg-white"
              style={{
                boxShadow:
                  "0 0 0 4px #fff, 0 0 18px 6px rgba(34,139,34,0.55), 0 0 40px 14px rgba(34,139,34,0.25)",
                animation: "logo-glow 2.4s ease-in-out infinite alternate",
              }}
            >
              <img
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="Masuka Learn ECD"
                className="w-full h-full object-cover"
                style={{ transform: "scale(1.09)" }}
                data-testid="logo"
              />
            </div>
          </div>
          <style>{`
            @keyframes logo-glow {
              from { box-shadow: 0 0 0 4px #fff, 0 0 14px 5px rgba(34,139,34,0.45), 0 0 32px 10px rgba(34,139,34,0.18); }
              to   { box-shadow: 0 0 0 4px #fff, 0 0 28px 10px rgba(34,139,34,0.75), 0 0 60px 22px rgba(34,139,34,0.35); }
            }
          `}</style>
          <h1 className="text-3xl font-extrabold text-primary">{t("app.title")}</h1>
          <p className="text-sm text-secondary-foreground/80 italic">{t("app.tagline")}</p>
          <p className="text-xs text-muted-foreground mt-1">{t("app.subtitle")}</p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardContent className="pt-6 pb-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t("auth.username")}</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  data-testid="input-username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  autoComplete="current-password"
                  required
                  data-testid="input-password"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={busy}
                data-testid="button-login"
              >
                {busy ? t("auth.signingIn") : t("auth.signIn")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
