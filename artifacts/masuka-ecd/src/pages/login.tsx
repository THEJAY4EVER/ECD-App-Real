import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LanguagePicker } from "@/components/LanguagePicker";
import { ApiError } from "@workspace/api-client-react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { login } = useAuth();
  const { t } = useI18n();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      className="relative min-h-screen overflow-hidden flex flex-col"
      style={{ paddingTop: "env(safe-area-inset-top,0px)", paddingBottom: "env(safe-area-inset-bottom,0px)" }}
    >
      {/* ── Keyframe animations ── */}
      <style>{`
        @keyframes cloud-drift-1 {
          from { transform: translateX(-320px); }
          to   { transform: translateX(calc(100vw + 320px)); }
        }
        @keyframes cloud-drift-2 {
          from { transform: translateX(-220px); }
          to   { transform: translateX(calc(100vw + 220px)); }
        }
        @keyframes cloud-drift-3 {
          from { transform: translateX(calc(100vw + 180px)); }
          to   { transform: translateX(-180px); }
        }
        @keyframes kite-sway {
          0%,100% { transform: rotate(-6deg) translate(0px,  0px); }
          50%     { transform: rotate( 6deg) translate(10px,-14px); }
        }
        @keyframes sun-rays {
          0%,100% { opacity: 0.55; transform: scale(1);    }
          50%     { opacity: 0.85; transform: scale(1.12); }
        }
        @keyframes bird-flap {
          0%,100% { transform: translateY(0px);  }
          50%     { transform: translateY(-7px); }
        }
        @keyframes logo-glow {
          from { box-shadow: 0 0 0 4px #fff, 0 0 14px  5px rgba(34,139,34,0.45), 0 0 32px 10px rgba(34,139,34,0.18); }
          to   { box-shadow: 0 0 0 4px #fff, 0 0 28px 10px rgba(34,139,34,0.75), 0 0 60px 22px rgba(34,139,34,0.35); }
        }
      `}</style>

      {/* ── Sky gradient ── */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg,#29B5E8 0%,#81D4F7 38%,#B8EBD0 72%,#C8E6C9 100%)" }}
      />

      {/* ── Sun ── */}
      <div
        className="absolute"
        style={{
          top: "6%", right: "9%",
          width: 72, height: 72,
          borderRadius: "50%",
          background: "radial-gradient(circle,#FFF176 55%,#FFD740 100%)",
          animation: "sun-rays 4s ease-in-out infinite",
          boxShadow: "0 0 32px 14px rgba(255,236,64,0.45)",
        }}
      />
      {/* Sun halo */}
      <div
        className="absolute"
        style={{
          top: "calc(6% - 10px)", right: "calc(9% - 10px)",
          width: 92, height: 92,
          borderRadius: "50%",
          background: "rgba(255,236,64,0.15)",
          animation: "sun-rays 4s ease-in-out infinite",
        }}
      />

      {/* ── Cloud 1 — large, slow ── */}
      <div className="absolute" style={{ top: "7%", animation: "cloud-drift-1 30s linear infinite" }}>
        <svg width="140" height="60" viewBox="0 0 140 60" fill="none">
          <ellipse cx="70" cy="42" rx="60" ry="20" fill="white" fillOpacity="0.92"/>
          <ellipse cx="45" cy="34" rx="28" ry="22" fill="white" fillOpacity="0.92"/>
          <ellipse cx="95" cy="32" rx="32" ry="24" fill="white" fillOpacity="0.92"/>
          <ellipse cx="70" cy="28" rx="24" ry="20" fill="white"/>
        </svg>
      </div>

      {/* ── Cloud 2 — medium, slightly faster ── */}
      <div className="absolute" style={{ top: "16%", animation: "cloud-drift-2 22s linear infinite", animationDelay: "-10s" }}>
        <svg width="100" height="46" viewBox="0 0 100 46" fill="none">
          <ellipse cx="50" cy="34" rx="42" ry="16" fill="white" fillOpacity="0.88"/>
          <ellipse cx="32" cy="26" rx="22" ry="18" fill="white" fillOpacity="0.88"/>
          <ellipse cx="68" cy="24" rx="24" ry="20" fill="white" fillOpacity="0.88"/>
          <ellipse cx="50" cy="20" rx="18" ry="15" fill="white"/>
        </svg>
      </div>

      {/* ── Cloud 3 — small, drifts from right ── */}
      <div className="absolute" style={{ top: "11%", animation: "cloud-drift-3 26s linear infinite", animationDelay: "-6s" }}>
        <svg width="80" height="38" viewBox="0 0 80 38" fill="none">
          <ellipse cx="40" cy="28" rx="32" ry="13" fill="white" fillOpacity="0.80"/>
          <ellipse cx="25" cy="22" rx="17" ry="15" fill="white" fillOpacity="0.80"/>
          <ellipse cx="55" cy="20" rx="19" ry="16" fill="white" fillOpacity="0.80"/>
        </svg>
      </div>

      {/* ── Kite ── */}
      <div
        className="absolute"
        style={{ top: "13%", left: "14%", transformOrigin: "20px 0px", animation: "kite-sway 5s ease-in-out infinite" }}
      >
        <svg width="44" height="80" viewBox="0 0 44 80" fill="none">
          {/* Diamond body */}
          <polygon points="22,2 42,22 22,46 2,22" fill="#F44336"/>
          <polygon points="22,2 42,22 22,24 2,22" fill="#FF7043"/>
          <polygon points="22,24 42,22 22,46 2,22" fill="#D32F2F"/>
          {/* Cross lines */}
          <line x1="2" y1="22" x2="42" y2="22" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
          <line x1="22" y1="2" x2="22" y2="46" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5"/>
          {/* Tail bows */}
          <path d="M22 46 Q28 54 22 62 Q16 54 22 46" fill="#FFC107"/>
          <path d="M22 62 Q28 70 22 78 Q16 70 22 62" fill="#FF7043"/>
          {/* String */}
          <path d="M22 46 Q30 52 36 62" stroke="#8D6E63" strokeWidth="1.5" fill="none" strokeDasharray="3 3"/>
        </svg>
      </div>

      {/* ── Birds ── */}
      <div className="absolute" style={{ top: "9%", left: "40%", animation: "bird-flap 1.8s ease-in-out infinite" }}>
        <svg width="28" height="12" viewBox="0 0 28 12" fill="none">
          <path d="M14 6 Q7 0 0 4" stroke="#546E7A" strokeWidth="2" strokeLinecap="round" fill="none"/>
          <path d="M14 6 Q21 0 28 4" stroke="#546E7A" strokeWidth="2" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
      <div className="absolute" style={{ top: "14%", left: "55%", animation: "bird-flap 2.1s ease-in-out infinite", animationDelay: "-0.8s" }}>
        <svg width="20" height="9" viewBox="0 0 20 9" fill="none">
          <path d="M10 5 Q5 0 0 3" stroke="#546E7A" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
          <path d="M10 5 Q15 0 20 3" stroke="#546E7A" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        </svg>
      </div>

      {/* ── Landscape hills + trees (bottom) ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 430 220" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block", width:"100%", height:"auto", minHeight:180 }}>
          {/* Far hill */}
          <path d="M-10 130 Q80 60 190 95 Q290 40 390 85 Q415 75 440 88 L440 220 L-10 220Z" fill="#81C784"/>
          {/* Mid hill */}
          <path d="M-10 160 Q60 110 170 140 Q270 95 370 130 L440 120 L440 220 L-10 220Z" fill="#4CAF50"/>
          {/* Front hill */}
          <path d="M-10 185 Q90 148 210 172 Q310 138 440 162 L440 220 L-10 220Z" fill="#388E3C"/>

          {/* Trees — back row */}
          <rect x="56" y="62" width="8" height="28" fill="#5D4037"/>
          <ellipse cx="60" cy="56" rx="20" ry="24" fill="#1B5E20"/>
          <ellipse cx="60" cy="48" rx="14" ry="18" fill="#2E7D32"/>

          <rect x="178" y="52" width="9" height="30" fill="#5D4037"/>
          <ellipse cx="182" cy="46" rx="22" ry="26" fill="#1B5E20"/>
          <ellipse cx="182" cy="38" rx="16" ry="20" fill="#2E7D32"/>

          <rect x="296" y="60" width="8" height="26" fill="#5D4037"/>
          <ellipse cx="300" cy="54" rx="20" ry="23" fill="#1B5E20"/>
          <ellipse cx="300" cy="46" rx="14" ry="17" fill="#2E7D32"/>

          <rect x="376" y="68" width="7" height="22" fill="#5D4037"/>
          <ellipse cx="380" cy="63" rx="16" ry="19" fill="#1B5E20"/>
          <ellipse cx="380" cy="57" rx="11" ry="14" fill="#2E7D32"/>

          {/* Flowers / grass accents */}
          <circle cx="40"  cy="180" r="4" fill="#FF7043" opacity="0.9"/>
          <circle cx="130" cy="168" r="3" fill="#FFCA28" opacity="0.9"/>
          <circle cx="240" cy="173" r="4" fill="#FF7043" opacity="0.9"/>
          <circle cx="330" cy="165" r="3" fill="#AB47BC" opacity="0.9"/>
          <circle cx="400" cy="175" r="4" fill="#FFCA28" opacity="0.9"/>

          {/* Grass tufts */}
          {[30,90,155,210,275,345,395].map((x, i) => (
            <g key={i} transform={`translate(${x},${168 + (i % 3) * 6})`}>
              <line x1="0" y1="6" x2="-3" y2="0" stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="0" y1="6" x2=" 0" y2="0" stroke="#388E3C" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="0" y1="6" x2=" 3" y2="0" stroke="#2E7D32" strokeWidth="1.5" strokeLinecap="round"/>
            </g>
          ))}
        </svg>
      </div>

      {/* ── Language picker ── */}
      <div
        className="absolute right-4 z-20"
        style={{ top: "calc(1rem + env(safe-area-inset-top,0px))" }}
      >
        <LanguagePicker variant="outline" />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-5 pt-14 pb-52">
        {/* Logo + title */}
        <motion.div
          className="text-center mb-5"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex mb-3">
            <div
              className="w-24 h-24 rounded-full overflow-hidden bg-white"
              style={{ animation: "logo-glow 2.4s ease-in-out infinite alternate" }}
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
          <h1 className="text-3xl font-extrabold text-white drop-shadow-lg tracking-tight">
            {t("app.title")}
          </h1>
          <p className="text-sm text-white/90 italic drop-shadow mt-0.5">{t("app.tagline")}</p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="w-full max-w-sm"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.15 }}
        >
          <div className="bg-white rounded-3xl shadow-2xl px-6 pt-6 pb-7">
            <h2 className="text-xl font-extrabold text-center text-foreground mb-0.5">
              Welcome back! 👋
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-5">
              Login to continue your adventure.
            </p>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username">{t("auth.username")}</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  className="rounded-xl h-12"
                  data-testid="input-username"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">{t("auth.password")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    autoComplete="current-password"
                    required
                    className="rounded-xl h-12 pr-12"
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-bold rounded-xl mt-1"
                disabled={busy}
                data-testid="button-login"
              >
                {busy ? t("auth.signingIn") : t("auth.signIn")}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
