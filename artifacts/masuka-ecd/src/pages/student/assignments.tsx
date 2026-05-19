import { useState } from "react";
import { Link } from "wouter";
import { useListAssignments, useListSubmissions, useListLessons } from "@workspace/api-client-react";
import { Shell } from "@/components/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { subjectMeta, gradeColor, useGradeLabel } from "@/lib/subjects";
import { BarChart2, BookOpen, CheckCircle2, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";

function scoreFromGrade(grade?: string | null): number | null {
  if (!grade) return null;
  const n = Number(grade);
  if (!isNaN(n)) return n;
  switch (grade) {
    case "excellent": return 90;
    case "good": return 75;
    case "developing": return 60;
    case "needs_support": return 35;
    default: return null;
  }
}

export default function StudentAssignments() {
  const gradeLabel = useGradeLabel();
  const aQ = useListAssignments();
  const sQ = useListSubmissions();
  const lQ = useListLessons();
  const [showProgress, setShowProgress] = useState(false);

  if (aQ.isLoading) {
    return <Shell title="Homework"><div className="space-y-2">{[0,1,2].map(i=><Skeleton key={i} className="h-20 rounded-2xl" />)}</div></Shell>;
  }

  const assignments = aQ.data ?? [];
  const submissions = sQ.data ?? [];
  const lessons = lQ.data ?? [];

  const submissionsByAssignment = new Map(submissions.map((s) => [s.assignmentId, s]));

  const submitted = submissions.length;
  const graded = submissions.filter((s) => s.status === "graded").length;
  const scores = submissions
    .map((s) => scoreFromGrade(s.grade))
    .filter((n): n is number => n !== null);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;

  return (
    <Shell title="Homework">
      <div className="space-y-3 pb-16">
        {assignments.map((a) => {
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
        {assignments.length === 0 && (
          <Card className="p-6 text-center text-sm text-muted-foreground">No homework yet 🎈</Card>
        )}
      </div>

      {/* ── Floating progress pill ── */}
      <motion.div
        className="fixed bottom-20 left-1/2 z-30"
        style={{ translateX: "-50%" }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.35, ease: "easeOut" }}
      >
        <button
          onClick={() => setShowProgress(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground shadow-lg text-sm font-semibold hover:bg-primary/90 active:scale-95 transition-transform"
          data-testid="button-progress"
        >
          <BarChart2 className="w-4 h-4" /> My Progress
        </button>
      </motion.div>

      {/* ── Progress dialog ── */}
      <Dialog open={showProgress} onOpenChange={setShowProgress}>
        <DialogContent className="max-w-sm max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-primary" /> My Progress
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Score card */}
            {avgScore !== null && (
              <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary flex flex-col items-center justify-center text-primary-foreground shrink-0">
                  <span className="text-2xl font-extrabold leading-none">{avgScore}</span>
                  <span className="text-[10px] opacity-80">/100</span>
                </div>
                <div>
                  <p className="text-sm font-bold">Average Score</p>
                  <p className="text-xs text-muted-foreground">Across {graded} graded assignment{graded !== 1 ? "s" : ""}</p>
                </div>
              </div>
            )}

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-muted/60 p-3 text-center">
                <BookOpen className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-lg font-extrabold">{lessons.length}</p>
                <p className="text-[10px] text-muted-foreground">Lessons</p>
              </div>
              <div className="rounded-xl bg-muted/60 p-3 text-center">
                <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
                <p className="text-lg font-extrabold">{submitted}</p>
                <p className="text-[10px] text-muted-foreground">Submitted</p>
              </div>
              <div className="rounded-xl bg-muted/60 p-3 text-center">
                <Clock className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                <p className="text-lg font-extrabold">{assignments.length - submitted}</p>
                <p className="text-[10px] text-muted-foreground">Pending</p>
              </div>
            </div>

            {/* Recent grades */}
            {submissions.filter((s) => s.status === "graded").length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2">Recent Grades</p>
                <div className="space-y-1.5">
                  {submissions
                    .filter((s) => s.status === "graded")
                    .slice(0, 6)
                    .map((s) => (
                      <div key={s.id} className="flex items-center gap-2 py-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="flex-1 text-xs truncate">{s.assignmentTitle}</span>
                        <Badge className={`${gradeColor(s.grade)} text-xs shrink-0`}>
                          {gradeLabel(s.grade)}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {submissions.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-4">
                Submit your first assignment to see your progress here! 🌟
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Shell>
  );
}
