import { useState } from "react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListAssignments,
  useCreateAssignment,
  useListSubjects,
  getListAssignmentsQueryKey,
} from "@workspace/api-client-react";
import { Shell } from "@/components/Shell";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { subjectMeta } from "@/lib/subjects";
import { useToast } from "@/hooks/use-toast";

const CLASSES = ["All", "ECD A", "ECD B", "Grade 1", "Grade 2"];

function classLabel(c: string) {
  return c === "All" ? "All classes" : c;
}

export default function TeacherAssignments() {
  const aQ = useListAssignments();
  const subjectsQ = useListSubjects();
  const create = useCreateAssignment();
  const qc = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", subject: "", classLevel: "All", instructions: "", dueDate: "" });

  async function onCreate() {
    if (!form.title || !form.subject || !form.classLevel || !form.instructions || !form.dueDate) return;
    try {
      await create.mutateAsync({ data: { ...form, dueDate: new Date(form.dueDate).toISOString() } });
      await qc.invalidateQueries({ queryKey: getListAssignmentsQueryKey() });
      setOpen(false);
      setForm({ title: "", subject: "", classLevel: "", instructions: "", dueDate: "" });
      toast({ title: "Assignment posted 🎉" });
    } catch {
      toast({ title: "Could not create assignment", variant: "destructive" });
    }
  }

  return (
    <Shell title="Assignments">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">All assignments</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" data-testid="button-new"><Plus className="w-4 h-4 mr-1" /> New</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New assignment</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="input-title" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <Label>Subject</Label>
                    <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
                      <SelectTrigger data-testid="select-subject"><SelectValue placeholder="Pick…" /></SelectTrigger>
                      <SelectContent>
                        {(subjectsQ.data ?? []).map((s) => (
                          <SelectItem key={s.subject} value={s.subject}>{subjectMeta(s.subject).emoji} {s.subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Class</Label>
                    <Select value={form.classLevel} onValueChange={(v) => setForm({ ...form, classLevel: v })}>
                      <SelectTrigger data-testid="select-class"><SelectValue placeholder="Pick…" /></SelectTrigger>
                      <SelectContent>
                        {CLASSES.map((c) => <SelectItem key={c} value={c}>{classLabel(c)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Due date</Label>
                  <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} data-testid="input-due" />
                </div>
                <div className="space-y-1.5">
                  <Label>Instructions</Label>
                  <Textarea rows={4} value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} data-testid="input-instructions" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={onCreate} disabled={create.isPending} data-testid="button-create">{create.isPending ? "Saving…" : "Post"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {aQ.isLoading ? (
          <div className="space-y-2">{[0,1,2].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div>
        ) : (
          <div className="space-y-2">
            {(aQ.data ?? []).map((a) => {
              const m = subjectMeta(a.subject);
              return (
                <Link key={a.id} href={`/assignments/${a.id}`}>
                  <Card className="cursor-pointer hover-elevate active-elevate-2" data-testid={`card-assignment-${a.id}`}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${m.bg} flex items-center justify-center text-2xl shrink-0`}>{m.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{a.title}</div>
                        <div className="text-xs text-muted-foreground">{classLabel(a.classLevel)} · Due {new Date(a.dueDate).toLocaleDateString()}</div>
                      </div>
                      <Badge variant="outline">{a.submissionCount} subs</Badge>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Shell>
  );
}
