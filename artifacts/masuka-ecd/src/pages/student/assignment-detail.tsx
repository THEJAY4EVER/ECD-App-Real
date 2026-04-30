import { useState, useMemo } from "react";
import { useRoute, Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetAssignment,
  useListSubmissions,
  useCreateSubmission,
  getListSubmissionsQueryKey,
  getGetStudentDashboardQueryKey,
} from "@workspace/api-client-react";
import { Shell } from "@/components/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { subjectMeta, gradeColor, useGradeLabel } from "@/lib/subjects";
import { AttachmentUploader, AttachmentList, type Attachment } from "@/components/AttachmentUploader";

export default function StudentAssignmentDetail() {
  const gradeLabel = useGradeLabel();
  const [, params] = useRoute("/assignments/:id");
  const id = params?.id ?? "";
  const qc = useQueryClient();
  const { toast } = useToast();
  const aQ = useGetAssignment(id);
  const sQ = useListSubmissions({ assignmentId: id });
  const submit = useCreateSubmission();
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const mySubmission = useMemo(() => sQ.data?.[0], [sQ.data]);

  async function onSubmit() {
    if (!content.trim() && attachments.length === 0) return;
    try {
      await submit.mutateAsync({
        data: {
          assignmentId: id,
          content: content.trim() || "(see attachments)",
          attachments,
        } as any,
      });
      await qc.invalidateQueries({ queryKey: getListSubmissionsQueryKey({ assignmentId: id }) });
      await qc.invalidateQueries({ queryKey: getGetStudentDashboardQueryKey() });
      setContent("");
      setAttachments([]);
      toast({ title: "Submitted! 🌟", description: "Your teacher will review it soon." });
    } catch {
      toast({ title: "Could not submit", variant: "destructive" });
    }
  }

  return (
    <Shell title="Homework">
      <div className="space-y-4">
        <Link href="/assignments">
          <Button variant="ghost" size="sm" className="-ml-2"><ChevronLeft className="w-4 h-4 mr-1" /> Homework</Button>
        </Link>

        {aQ.isLoading || !aQ.data ? (
          <Skeleton className="h-40 rounded-2xl" />
        ) : (
          <>
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full" style={{ background: subjectMeta(aQ.data.subject).color, color: "white" }}>
                    {subjectMeta(aQ.data.subject).emoji} {aQ.data.subject}
                  </span>
                  <span className="text-muted-foreground">Due {new Date(aQ.data.dueDate).toLocaleDateString()}</span>
                </div>
                <h1 className="text-xl font-extrabold" data-testid="text-title">{aQ.data.title}</h1>
                <p className="text-sm text-foreground/80 whitespace-pre-wrap">{aQ.data.instructions}</p>
              </CardContent>
            </Card>

            {mySubmission ? (
              <Card className="border-emerald-300 bg-emerald-50">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-5 h-5" /> Submitted
                  </div>
                  <div className="text-xs text-muted-foreground">{new Date(mySubmission.submittedAt).toLocaleString()}</div>
                  <p className="text-sm whitespace-pre-wrap">{mySubmission.content}</p>
                  <AttachmentList attachments={(mySubmission as any).attachments ?? []} />
                  {mySubmission.status === "graded" && (
                    <div className="mt-2 pt-2 border-t border-emerald-200 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge className={gradeColor(mySubmission.grade)}>{gradeLabel(mySubmission.grade)}</Badge>
                      </div>
                      {mySubmission.feedback && <p className="text-sm italic">"{mySubmission.feedback}"</p>}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="text-sm font-semibold">Your answer</div>
                  <Textarea
                    rows={4}
                    placeholder="Type, describe what you drew, or list what you did…"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    data-testid="input-content"
                  />
                  <div>
                    <div className="text-xs font-semibold mb-1 text-muted-foreground">Add a photo, file or voice note</div>
                    <AttachmentUploader attachments={attachments} onChange={setAttachments} disabled={submit.isPending} />
                  </div>
                  <Button
                    onClick={onSubmit}
                    disabled={(!content.trim() && attachments.length === 0) || submit.isPending}
                    className="w-full"
                    data-testid="button-submit"
                  >
                    <Send className="w-4 h-4 mr-1" /> {submit.isPending ? "Sending…" : "Submit"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </Shell>
  );
}
