import { useRoute, Link } from "wouter";
import { useGetStudentProgress } from "@workspace/api-client-react";
import { Shell } from "@/components/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Sparkles } from "lucide-react";
import { gradeColor, useGradeLabel } from "@/lib/subjects";

const MILESTONE_COLOR: Record<string, string> = {
  emerging: "bg-rose-200 text-rose-900",
  developing: "bg-amber-200 text-amber-900",
  achieved: "bg-emerald-200 text-emerald-900",
  excelling: "bg-violet-200 text-violet-900",
};

export default function StudentProgress() {
  const gradeLabel = useGradeLabel();
  const [, params] = useRoute("/students/:id");
  const id = params?.id ?? "";
  const { data, isLoading } = useGetStudentProgress(id);

  return (
    <Shell title="Progress">
      <div className="space-y-4">
        <Link href="/students">
          <Button variant="ghost" size="sm" className="-ml-2"><ChevronLeft className="w-4 h-4 mr-1" /> Students</Button>
        </Link>

        {isLoading || !data ? (
          <Skeleton className="h-40 rounded-2xl" />
        ) : (
          <>
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="p-5 text-white" style={{ background: `linear-gradient(135deg, ${data.student.avatarColor}, #ef6f3c)` }}>
                <div className="text-xl font-extrabold" data-testid="text-name">{data.student.fullName}</div>
                <div className="text-xs opacity-90">{data.student.classLevel}</div>
              </div>
              <CardContent className="p-4 space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Submitted</span>
                    <span className="font-semibold">{data.submittedCount} / {data.totalAssignments}</span>
                  </div>
                  <Progress value={data.totalAssignments ? (data.submittedCount / data.totalAssignments) * 100 : 0} />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Graded</span>
                    <span className="font-semibold">{data.gradedCount} / {data.submittedCount || 1}</span>
                  </div>
                  <Progress value={data.submittedCount ? (data.gradedCount / data.submittedCount) * 100 : 0} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardContent className="p-4 flex gap-3">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-amber-900 uppercase tracking-wide">Auto progress report</div>
                  <p className="text-sm text-amber-900 mt-1" data-testid="text-summary">{data.summary}</p>
                  <div className="text-[10px] text-amber-800/70 mt-2">Generated {new Date(data.generatedAt).toLocaleString()}</div>
                </div>
              </CardContent>
            </Card>

            <section>
              <h2 className="text-sm font-bold mb-2">Grade breakdown</h2>
              <div className="grid grid-cols-2 gap-2">
                {data.gradeBreakdown.map((g) => (
                  <Card key={g.grade} className="p-3 flex items-center justify-between">
                    <Badge className={gradeColor(g.grade)}>{gradeLabel(g.grade)}</Badge>
                    <span className="text-xl font-extrabold">{g.count}</span>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-sm font-bold mb-2">Milestones</h2>
              <div className="space-y-2">
                {data.milestones.map((m, i) => (
                  <Card key={i} className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold">{m.name}</div>
                        <div className="text-xs text-muted-foreground">{m.area}</div>
                      </div>
                      <Badge className={MILESTONE_COLOR[m.level] ?? "bg-slate-200"}>{m.level}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </Shell>
  );
}
