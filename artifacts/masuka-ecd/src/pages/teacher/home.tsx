import { Link } from "wouter";
import { useGetTeacherDashboard } from "@workspace/api-client-react";
import { Shell } from "@/components/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users, ClipboardCheck, Hourglass, CheckCheck } from "lucide-react";
import { gradeColor, useGradeLabel } from "@/lib/subjects";

export default function TeacherHome() {
  const gradeLabel = useGradeLabel();
  const { data, isLoading } = useGetTeacherDashboard();

  if (isLoading || !data) return <Shell title="Dashboard"><Skeleton className="h-40 rounded-2xl" /></Shell>;

  const stats = [
    { icon: Users, label: "Students", value: data.totalStudents, color: "from-sky-400 to-blue-500" },
    { icon: ClipboardCheck, label: "Active tasks", value: data.activeAssignments, color: "from-emerald-400 to-green-500" },
    { icon: Hourglass, label: "Pending", value: data.pendingSubmissions, color: "from-amber-400 to-orange-500" },
    { icon: CheckCheck, label: "Graded this week", value: data.gradedThisWeek, color: "from-rose-400 to-pink-500" },
  ];

  return (
    <Shell title="Dashboard">
      <div className="space-y-6">
        <div>
          <div className="text-sm text-muted-foreground">Welcome back,</div>
          <div className="text-2xl font-extrabold">{data.teacherName}</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <Card key={s.label} className="overflow-hidden border-0 shadow-md" data-testid={`stat-${s.label}`}>
              <div className={`bg-gradient-to-br ${s.color} p-4 text-white`}>
                <s.icon className="w-5 h-5 opacity-80" />
                <div className="text-3xl font-extrabold mt-2">{s.value}</div>
                <div className="text-xs opacity-90">{s.label}</div>
              </div>
            </Card>
          ))}
        </div>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Class breakdown</h2>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {data.classBreakdown.map((c) => (
              <Card key={c.classLevel} className="p-3 flex items-center justify-between">
                <div className="font-semibold">{c.classLevel}</div>
                <Badge variant="outline">{c.studentCount} students</Badge>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Recent submissions</h2>
            <Link href="/assignments"><span className="text-xs text-primary font-semibold">View all</span></Link>
          </div>
          {data.recentSubmissions.length === 0 ? (
            <Card className="p-4 text-center text-sm text-muted-foreground">Nothing to grade right now ✨</Card>
          ) : (
            <div className="space-y-2">
              {data.recentSubmissions.slice(0, 6).map((s) => (
                <Link key={s.id} href={`/assignments/${s.assignmentId}`}>
                  <Card className="cursor-pointer hover-elevate active-elevate-2" data-testid={`card-submission-${s.id}`}>
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{s.studentName}</div>
                        <div className="text-xs text-muted-foreground truncate">{s.assignmentTitle}</div>
                      </div>
                      <Badge className={gradeColor(s.grade)}>{gradeLabel(s.grade)}</Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </Shell>
  );
}
