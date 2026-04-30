import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, BookOpen, ClipboardList, Users, LogOut, Library, Gamepad2, Palette, ShieldCheck, FolderOpen } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { LanguagePicker } from "@/components/LanguagePicker";
import { MusicToggle } from "@/components/MusicToggle";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type Tab = { href: string; icon: typeof Home; label: string };

const STUDENT_TABS: Tab[] = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/lessons", icon: BookOpen, label: "Lessons" },
  { href: "/materials", icon: FolderOpen, label: "Materials" },
  { href: "/stories", icon: Library, label: "Stories" },
  { href: "/games", icon: Gamepad2, label: "Games" },
  { href: "/assignments", icon: ClipboardList, label: "Tasks" },
];

const TEACHER_TABS: Tab[] = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/assignments", icon: ClipboardList, label: "Assignments" },
  { href: "/materials", icon: FolderOpen, label: "Materials" },
  { href: "/students", icon: Users, label: "Students" },
];

const ADMIN_TABS: Tab[] = [
  { href: "/", icon: ShieldCheck, label: "Dashboard" },
  { href: "/users", icon: Users, label: "Users" },
];

function getTabs(role: string | undefined): Tab[] {
  if (role === "admin") return ADMIN_TABS;
  if (role === "teacher") return TEACHER_TABS;
  return STUDENT_TABS;
}

export function Shell({ children, title }: { children: ReactNode; title?: string }) {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const [loc, navigate] = useLocation();
  const tabs = getTabs(user?.role);
  const isAdmin = user?.role === "admin";
  const isTeacher = user?.role === "teacher";

  const [showSettings, setShowSettings] = useState(false);
  useEffect(() => {
    const id = setInterval(() => setShowSettings((v) => !v), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      style={{ paddingBottom: "calc(4rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <header
        className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/settings"
            className="flex items-center gap-2 rounded-lg p-1 -ml-1 hover:bg-muted transition-colors shrink-0"
            data-testid="link-settings"
            aria-label={t("settings.title")}
          >
            <Logo size={36} className="rounded-full bg-white shadow-sm shrink-0" />
            <div className="text-left" style={{ minWidth: "9rem" }}>
              <div className="relative h-5 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  {showSettings ? (
                    <motion.div
                      key="settings"
                      initial={{ y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -12, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="absolute text-sm font-semibold leading-tight text-primary whitespace-nowrap"
                    >
                      {t("settings.title")}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="title"
                      initial={{ y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -12, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="absolute text-sm font-semibold leading-tight whitespace-nowrap"
                    >
                      {title ?? t("app.title")}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="text-xs text-muted-foreground leading-tight truncate max-w-[9rem]">{user?.fullName}</div>
            </div>
          </Link>
          <div className="flex items-center gap-1">
            {!isTeacher && !isAdmin && <MusicToggle />}
            {!isAdmin && <LanguagePicker />}
            <Button
              size="sm"
              variant="ghost"
              onClick={async () => { await logout(); navigate("/login"); }}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4">{children}</main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-border"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div
          className="max-w-2xl mx-auto grid h-16"
          style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
        >
          {tabs.map((tab) => {
            const active = loc === tab.href || (tab.href !== "/" && loc.startsWith(tab.href));
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
                data-testid={`tab-${tab.label.toLowerCase()}`}
              >
                {isTeacher || isAdmin ? (
                  <Icon className={cn("w-5 h-5", active && "scale-110")} />
                ) : (
                  <motion.span
                    animate={active ? { scale: [1, 1.25, 1.1], y: [0, -3, 0] } : { scale: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.span>
                )}
                <span className="text-[11px] font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
