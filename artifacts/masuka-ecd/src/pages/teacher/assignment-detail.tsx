import { useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetAssignment,
  useGradeSubmission,
  useDeleteAssignment,
  getGetAssignmentQueryKey,
  getGetTeacherDashboardQueryKey,
  getListAssignmentsQueryKey,
  type Submission,
} from "@workspace/api-client-react";
import { Shell } from "@/components/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import { ChevronLeft, Trash2 } from "lucide-react";
import { gradeColor, useGradeLabel, subjectMeta } from "@/lib/subjects";
import { useToast } from "@/hooks/use-toast";
import { AttachmentList } from "@/components/AttachmentUploader";

const GRADES = ["excellent", "good", "developing", "needs_support"] as const;

export default function TeacherAssignmentDetail() {
  const gradeLabel = useGradeLabel();
  const [, params] = useRoute("/assignments/:id");
  const id = params?.id ?? "";
  const { data, isLoading } = useGetAssignment(id);
  const qc = useQueryClient();
  const [, navigate] = useLocation();
  const del = useDeleteAssignment();
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function onDelete() {
    try {
      await del.mutateAsync({ id });
      await qc.invalidateQueries({ queryKey: getListAssignmentsQueryKey() });
      await qc.invalidateQueries({ queryKey: getGetTeacherDashboardQueryKey() });
      toast({ title: "Assignment deleted" });
      setConfirmOpen(false);
      navigate("/assignments");
    } catch {
      toast({ title: "Could not delete assignment", variant: "destructive" });
    }
  }

  const classLabel = data?.classLevel === "All" ? "All classes" : data?.classLevel;

  return (
    <Shell title="Homework">
      <div className="space-y-4">
        <Link href="/assignments">
          <Button variant="ghost" size="sm" className="-ml-2"><ChevronLeft className="w-4 h-4 mr-1" /> Homework</Button>
        </Link>

        {isLoading || !data ? (
          <Skeleton className="h-40 rounded-2xl" />
        ) : (
          <>
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full" style={{ background: subjectMeta(data.subject).color, color: "white" }}>
                    {subjectMeta(data.subject).emoji} {data.subject}
                  </span>
                  <span className="text-muted-foreground">{classLabel} · Due {new Date(data.dueDate).toLocaleDateString()}</span>
                </div>
                <h1 className="text-xl font-extrabold" data-testid="text-title">{data.title}</h1>
                <p className="text-sm text-foreground/80 whitespace-pre-wrap">{data.instructions}</p>
                <div className="pt-2">
                  <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 border-rose-200"
                        data-testid="button-delete-assignment"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete assignment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete this assignment?</DialogTitle>
                        <DialogDescription>
                          "{data.title}" will be removed for all students, along with any submissions they made. This cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmOpen(false)} data-testid="button-cancel-delete">
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={onDelete}
                          disabled={del.isPending}
                          data-testid="button-confirm-delete"
                        >
                          {del.isPending ? "Deleting…" : "Delete"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-lg font-bold mb-3">Submissions ({data.submissions.length})</h2>
              {data.submissions.length === 0 ? (
                <Card className="p-4 text-center text-sm text-muted-foreground">No submissions yet</Card>
              ) : (
                <div className="space-y-2">
                  {data.submissions.map((s) => (
                    <SubmissionCard key={s.id} submission={s} assignmentId={id} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}

function SubmissionCard({ submission, assignmentId }: { submission: Submission; assignmentId: string }) {
  const gradeLabel = useGradeLabel();
  const qc = useQueryClient();
  const grade = useGradeSubmission();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [g, setG] = useState<typeof GRADES[number]>(submission.grade as any ?? "good");
  const [fb, setFb] = useState(submission.feedback ?? "");

  async function onSave() {
    try {
      await grade.mutateAsync({ id: submission.id, data: { grade: g, feedback: fb } });
      await qc.invalidateQueries({ queryKey: getGetAssignmentQueryKey(assignmentId) });
      await qc.invalidateQueries({ queryKey: getGetTeacherDashboardQueryKey() });
      toast({ title: "Graded ⭐" });
      setOpen(false);
    } catch {
      toast({ title: "Could not save grade", variant: "destructive" });
    }
  }

  return (
    <Card data-testid={`card-submission-${submission.id}`}>
      <CardContent className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-sm">{submission.studentName}</div>
          <Badge className={gradeColor(submission.grade)}>{gradeLabel(submission.grade)}</Badge>
        </div>
        <div className="text-xs text-muted-foreground">{new Date(submission.submittedAt).toLocaleString()}</div>
        <p className="text-sm whitespace-pre-wrap bg-muted/50 p-2 rounded-lg">{submission.content}</p>
        <AttachmentList attachments={(submission as any).attachments ?? []} />
        {submission.feedback && <p className="text-xs italic text-muted-foreground">Feedback: "{submission.feedback}"</p>}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" className="w-full" data-testid={`button-grade-${submission.id}`}>
              {submission.status === "graded" ? "Update grade" : "Grade"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Grade — {submission.studentName}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <div className="text-xs font-semibold mb-2">Level</div>
                <div className="grid grid-cols-2 gap-2">
                  {GRADES.map((opt) => (
                    <Button
                      key={opt}
                      variant={g === opt ? "default" : "outline"}
                      onClick={() => setG(opt)}
                      className="justify-start"
                      data-testid={`grade-${opt}`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full mr-2 ${gradeColor(opt).split(" ")[0]}`} />
                      {gradeLabel(opt)}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold mb-2">Feedback</div>
                <Textarea rows={3} value={fb} onChange={(e) => setFb(e.target.value)} placeholder="Encouraging note…" data-testid="input-feedback" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={onSave} disabled={grade.isPending} data-testid="button-save-grade">{grade.isPending ? "Saving…" : "Save"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
