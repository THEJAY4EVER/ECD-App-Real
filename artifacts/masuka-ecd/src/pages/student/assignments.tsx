import { Link } from "wouter";
import { useListAssignments, useListSubmissions } from "@workspace/api-client-react";
import { Shell } from "@/components/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { subjectMeta, gradeColor, useGradeLabel } from "@/lib/subjects";

export default function StudentAssignments() {
  const gradeLabel = useGradeLabel();
  const aQ = useListAssignments();
  const sQ = useListSubmissions();

  if (aQ.isLoading) {
    return <Shell title="Homework"><div className="space-y-2">{[0,1,2].map(i=><Skeleton key={i} className="h-20 rounded-2xl" />)}</div></Shell>;
  }

  const submissionsByAssignment = new Map((sQ.data ?? []).map((s) => [s.assignmentId, s]));

  return (
    <Shell title="Homework">
      <div className="space-y-3">
        {(aQ.data ?? []).map((a) => {
          const m = subjectMeta(a.subject);
          const sub = submissionsByAssignment.get(a.id);
          return (
            <Link key={a.id} href={`/assignments/${a.id}`}>
              <Card className="cursor-pointer hover-elevate active-elevate-2" data-testid={`card-assignment-${a.id}`}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${m.bg} flex items-center justify-center text-2xl shrink-0`}>
                    {m.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.subject} · Due {new Date(a.dueDate).toLocaleDateString()}</div>
                  </div>
                  {sub ? (
                    <Badge className={gradeColor(sub.grade)} data-testid={`badge-status-${a.id}`}>{gradeLabel(sub.grade)}</Badge>
                  ) : (
                    <Badge variant="outline">To do</Badge>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
        {(aQ.data ?? []).length === 0 && (
          <Card className="p-6 text-center text-sm text-muted-foreground">No homework yet 🎈</Card>
        )}
      </div>
    </Shell>
  );
}
