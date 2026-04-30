import { Link } from "wouter";
import { useListStories } from "@workspace/api-client-react";
import { Shell } from "@/components/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function StudentStories() {
  const { t } = useI18n();
  const { data, isLoading } = useListStories();

  return (
    <Shell title={t("nav.stories")}>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-extrabold">{t("stories.heading")}</h1>
        </div>
        <p className="text-sm text-muted-foreground">{t("stories.subhead")}</p>

        {isLoading ? (
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid gap-3">
            {data?.map((s, idx) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -32 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 18, delay: idx * 0.07 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
              <Link href={`/stories/${s.id}`}>
                <Card className="hover-elevate active-elevate-2 cursor-pointer border-0 shadow-sm overflow-hidden" data-testid={`story-${s.id}`}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <motion.div
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-3xl shrink-0"
                      animate={{ rotate: [0, -6, 6, 0] }}
                      transition={{ duration: 3.6, repeat: Infinity, delay: idx * 0.3, ease: "easeInOut" }}
                    >
                      {s.emoji}
                    </motion.div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold truncate">{s.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">{s.summary}</div>
                      <div className="text-[11px] text-primary mt-1">{s.classLevel} · {s.readMinutes} {t("common.minutes")}</div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              </motion.div>
            ))}
            {!data?.length && (
              <Card className="p-6 text-center text-sm text-muted-foreground">{t("stories.empty")}</Card>
            )}
          </div>
        )}
      </div>
    </Shell>
  );
}
