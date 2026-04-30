import { useRoute, Link } from "wouter";
import { useGetStory } from "@workspace/api-client-react";
import { Shell } from "@/components/Shell";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Sparkles } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import { Narrator } from "@/components/Narrator";
import { useI18n } from "@/lib/i18n";

export default function StoryDetail() {
  const { t } = useI18n();
  const [, params] = useRoute("/stories/:id");
  const id = params?.id ?? "";
  const { data, isLoading, error } = useGetStory(id);

  return (
    <Shell title={t("nav.stories")}>
      <div className="space-y-4">
        <Link href="/stories">
          <Button variant="ghost" size="sm" className="-ml-2" data-testid="button-back">
            <ChevronLeft className="w-4 h-4 mr-1" /> {t("nav.stories")}
          </Button>
        </Link>

        {isLoading ? (
          <Skeleton className="h-64 rounded-2xl" />
        ) : !data || error ? (
          <Card className="p-6 text-center text-sm text-muted-foreground border-0">{t("stories.empty")}</Card>
        ) : (
          <>
            <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-amber-50 via-orange-50 to-emerald-50 text-center">
              <div className="text-7xl mb-2">{data.emoji}</div>
              <h1 className="text-2xl font-extrabold text-primary" data-testid="text-title">{data.title}</h1>
              <div className="text-xs text-muted-foreground mt-1">{data.classLevel} · {data.readMinutes} {t("common.minutes")}</div>
            </Card>

            <Card className="p-5 border-0 shadow-sm">
              <div className="flex justify-end mb-2">
                <Narrator text={`${data.title}. ${data.body}${data.moral ? `. The moral of the story is: ${data.moral}` : ""}`} />
              </div>
              <Markdown source={data.body} />
            </Card>

            {data.moral && (
              <Card className="p-4 border-0 bg-gradient-to-br from-amber-100 to-yellow-50">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-amber-900">{t("stories.moral")}</div>
                    <div className="text-sm text-amber-900 italic">{data.moral}</div>
                  </div>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </Shell>
  );
}
