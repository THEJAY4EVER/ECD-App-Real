import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useGetLesson } from "@workspace/api-client-react";
import { Shell } from "@/components/Shell";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Sparkles, BookOpen, ExternalLink, AlertCircle } from "lucide-react";
import { subjectMeta } from "@/lib/subjects";
import { Markdown } from "@/components/Markdown";
import { Narrator } from "@/components/Narrator";
import { Quiz } from "@/components/Quiz";

export default function LessonDetail() {
  const [, params] = useRoute("/lessons/:id");
  const id = params?.id ?? "";
  const { data, isLoading } = useGetLesson(id);
  const [iframeError, setIframeError] = useState(false);

  return (
    <Shell title="Lesson">
      <div className="space-y-4">
        <Link href="/lessons">
          <Button variant="ghost" size="sm" className="-ml-2" data-testid="button-back">
            <ChevronLeft className="w-4 h-4 mr-1" /> Lessons
          </Button>
        </Link>

        {isLoading || !data ? (
          <Skeleton className="aspect-video rounded-2xl" />
        ) : (
          <>
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="aspect-video bg-black relative">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${data.youtubeId}?rel=0&modestbranding=1&playsinline=1`}
                  title={data.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  onError={() => setIframeError(true)}
                  data-testid="iframe-youtube"
                />
              </div>
            </Card>
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href={`https://www.youtube.com/watch?v=${data.youtubeId}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1"
                data-testid="link-watch-youtube"
              >
                <Button variant="outline" className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" /> Watch on YouTube
                </Button>
              </a>
            </div>
            {iframeError && (
              <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>If the video doesn't play here, tap "Watch on YouTube" above.</div>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-full" style={{ background: subjectMeta(data.subject).color, color: "white" }}>
                  {subjectMeta(data.subject).emoji} {data.subject}
                </span>
                <span className="text-muted-foreground">{data.classLevel} · {data.durationMinutes} min</span>
              </div>
              <h1 className="text-xl font-extrabold mt-2" data-testid="text-title">{data.title}</h1>
              <p className="mt-2 text-sm text-foreground/80">{data.description}</p>
            </div>
            {data.content && (
              <Card className="p-4 border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-amber-50">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wide text-primary">Read & learn</span>
                  </div>
                  <Narrator text={`${data.title}. ${data.description}. ${data.content}`} />
                </div>
                <Markdown source={data.content} />
              </Card>
            )}
            <Quiz lessonId={data.id} />
            {data.milestone && (
              <Card className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 border-0">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-amber-900">Learning milestone</div>
                    <div className="text-sm text-amber-900">{data.milestone}</div>
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
