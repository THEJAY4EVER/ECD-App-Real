import { Link } from "wouter";
import { useGetStudentDashboard } from "@workspace/api-client-react";
import { Shell } from "@/components/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { subjectMeta, gradeColor, useGradeLabel } from "@/lib/subjects";
import { Flame, Play, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

export default function StudentHome() {
  const gradeLabel = useGradeLabel();
  const { data, isLoading } = useGetStudentDashboard();

  return (
    <Shell title="Home">
      {isLoading || !data ? (
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-6">
          <motion.div initial={{ scale: 0.85, opacity: 0, y: -10 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 14 }}>
            <Card className="overflow-hidden border-0 shadow-lg">
              <div
                className="p-5 text-white relative"
                style={{ background: `linear-gradient(135deg, ${data.avatarColor}, #ef6f3c)` }}
              >
                <div className="text-sm opacity-90">Mhoro,</div>
                <div className="text-2xl font-extrabold" data-testid="text-greeting">{data.studentName.split(" ")[0]}!</div>
                <div className="text-xs mt-1 opacity-90">{data.classLevel}</div>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="mt-4 inline-flex items-center gap-1 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-sm font-semibold"
                >
                  <Flame className="w-4 h-4" /> {data.streakDays}-day streak
                </motion.div>
              </div>
            </Card>
          </motion.div>

          <section>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" /> Tasks due
            </h2>
            {data.dueAssignments.length === 0 ? (
              <Card className="p-4 text-center text-sm text-muted-foreground">All caught up! 🎉</Card>
            ) : (
              <div className="space-y-2">
                {data.dueAssignments.map((a) => {
                  const m = subjectMeta(a.subject);
                  return (
                    <Link key={a.id} href={`/assignments/${a.id}`}>
                      <Card className="cursor-pointer hover-elevate active-elevate-2" data-testid={`card-due-${a.id}`}>
                        <CardContent className="p-4 flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${m.bg} flex items-center justify-center text-2xl`}>
                            {m.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">{a.title}</div>
                            <div className="text-xs text-muted-foreground">{a.subject} · Due {new Date(a.dueDate).toLocaleDateString()}</div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Play className="w-5 h-5 text-secondary" /> Recent lessons
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {data.recentLessons.slice(0, 4).map((l, i) => {
                const m = subjectMeta(l.subject);
                return (
                  <motion.div key={l.id} initial={{ scale: 0.7, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: i * 0.06 }} whileTap={{ scale: 0.95 }}>
                  <Link href={`/lessons/${l.id}`}>
                    <Card className="overflow-hidden cursor-pointer hover-elevate active-elevate-2" data-testid={`card-lesson-${l.id}`}>
                      <div className="aspect-video relative bg-muted">
                        <img src={l.thumbnailUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                            <Play className="w-5 h-5 text-primary fill-primary ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="text-xs font-semibold leading-tight line-clamp-2">{l.title}</div>
                        <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                          <span>{m.emoji}</span> {l.subject}
                        </div>
                      </div>
                    </Card>
                  </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {data.recentGrades.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-3">Recent feedback</h2>
              <div className="space-y-2">
                {data.recentGrades.slice(0, 3).map((s) => (
                  <Card key={s.id} className="p-3" data-testid={`card-grade-${s.id}`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{s.assignmentTitle}</div>
                        {s.feedback && <div className="text-xs text-muted-foreground truncate">{s.feedback}</div>}
                      </div>
                      <Badge className={gradeColor(s.grade)}>{gradeLabel(s.grade)}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </Shell>
  );
}
