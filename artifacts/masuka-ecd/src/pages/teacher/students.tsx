import { Link } from "wouter";
import { useListStudents } from "@workspace/api-client-react";
import { Shell } from "@/components/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function TeacherStudents() {
  const { data, isLoading } = useListStudents();

  return (
    <Shell title="Students">
      <div className="space-y-3">
        {isLoading ? (
          [0,1,2].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)
        ) : (
          (data ?? []).map((s) => (
            <Link key={s.id} href={`/students/${s.id}`}>
              <Card className="cursor-pointer hover-elevate active-elevate-2" data-testid={`card-student-${s.id}`}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow"
                    style={{ background: s.avatarColor }}
                  >
                    {s.fullName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{s.fullName}</div>
                    <div className="text-xs text-muted-foreground">{s.classLevel}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{s.gradedCount}/{s.submissionCount} graded</Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </Shell>
  );
}
