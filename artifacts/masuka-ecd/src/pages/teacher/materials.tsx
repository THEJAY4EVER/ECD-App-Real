import { useState, useRef } from "react";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ObjectUploader } from "@workspace/object-storage-web";
import {
  FileText, Image, Music, Video, Trash2, Upload, BookOpen,
  Eye, Download, FileUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SUBJECTS = [
  "Mathematics", "English", "Shona", "Environmental Science",
  "Visual & Performing Arts", "Heritage Studies",
];

const CLASS_LEVELS = ["All Classes", "ECD A", "ECD B"];

type Material = {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  fileSize: number | null;
  subject: string | null;
  classLevel: string | null;
  uploadedById: string | null;
  createdAt: string;
};

function mimeIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType.startsWith("audio/")) return Music;
  if (mimeType.startsWith("video/")) return Video;
  return FileText;
}

function mimeLabel(mimeType: string) {
  if (mimeType.startsWith("image/")) return "Image";
  if (mimeType.startsWith("audio/")) return "Audio";
  if (mimeType.startsWith("video/")) return "Video";
  if (mimeType === "application/pdf") return "PDF";
  return "Document";
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function fetchMaterials(): Promise<Material[]> {
  const res = await fetch("/api/materials", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch materials");
  return res.json();
}

async function createMaterial(body: Partial<Material> & { fileUrl: string; fileName: string; mimeType: string; title: string }): Promise<Material> {
  const res = await fetch("/api/materials", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const { message } = await res.json().catch(() => ({}));
    throw new Error(message ?? "Failed to save material");
  }
  return res.json();
}

async function deleteMaterial(id: string): Promise<void> {
  const res = await fetch(`/api/materials/${id}`, { method: "DELETE", credentials: "include" });
  if (!res.ok) throw new Error("Failed to delete material");
}

export default function TeacherMaterials() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const [showUpload, setShowUpload] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Material | null>(null);
  const [filterSubject, setFilterSubject] = useState("All");
  const [filterClass, setFilterClass] = useState("All Classes");

  const pendingObjectPath = useRef("");

  const [pendingUpload, setPendingUpload] = useState<{
    fileUrl: string;
    fileName: string;
    mimeType: string;
    fileSize: number;
  } | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    subject: "",
    classLevel: "All Classes",
  });

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ["materials"],
    queryFn: fetchMaterials,
  });

  const createM = useMutation({
    mutationFn: createMaterial,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["materials"] });
      setShowUpload(false);
      setPendingUpload(null);
      setForm({ title: "", description: "", subject: "", classLevel: "All Classes" });
      toast({ title: "Material uploaded successfully" });
    },
    onError: (err: Error) => {
      toast({ title: err.message, variant: "destructive" });
    },
  });

  const deleteM = useMutation({
    mutationFn: deleteMaterial,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["materials"] });
      setDeleteTarget(null);
      toast({ title: "Material deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete material", variant: "destructive" });
    },
  });

  const filtered = materials.filter((m) => {
    const subjectMatch = filterSubject === "All" || m.subject === filterSubject;
    const classMatch = filterClass === "All Classes" || (m.classLevel ?? "All Classes") === filterClass;
    return subjectMatch && classMatch;
  });

  async function handleSave() {
    if (!pendingUpload) {
      toast({ title: "Please upload a file first", variant: "destructive" });
      return;
    }
    if (!form.title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }

    createM.mutate({
      ...pendingUpload,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      subject: form.subject || undefined,
      classLevel: form.classLevel === "All Classes" ? undefined : form.classLevel,
    });
  }

  return (
    <Shell title="Materials">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Learning Materials</h2>
          <Button size="sm" onClick={() => setShowUpload(true)} data-testid="btn-upload-material">
            <FileUp className="w-4 h-4 mr-1.5" /> Upload
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Subjects</SelectItem>
              {SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterClass} onValueChange={setFilterClass}>
            <SelectTrigger className="w-36 h-8 text-xs">
              <SelectValue placeholder="Class" />
            </SelectTrigger>
            <SelectContent>
              {CLASS_LEVELS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="py-10 text-center text-muted-foreground text-sm">Loading materials…</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <BookOpen className="w-10 h-10 mx-auto text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No materials yet. Upload the first one!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((m) => {
              const Icon = mimeIcon(m.mimeType);
              return (
                <div key={m.id} className="flex items-start gap-3 p-3 rounded-xl border bg-card">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{m.title}</p>
                    {m.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{m.description}</p>
                    )}
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <Badge variant="secondary" className="text-xs">{mimeLabel(m.mimeType)}</Badge>
                      {m.subject && <Badge variant="outline" className="text-xs">{m.subject}</Badge>}
                      {m.classLevel ? (
                        <Badge variant="outline" className="text-xs">{m.classLevel}</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-muted-foreground">All Classes</Badge>
                      )}
                      {m.fileSize && (
                        <span className="text-xs text-muted-foreground">{formatBytes(m.fileSize)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={`/api/storage${m.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex"
                    >
                      <Button size="icon" variant="ghost" className="h-8 w-8" title="View / Download">
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                    </a>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(m)}
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Upload Dialog ── */}
      <Dialog open={showUpload} onOpenChange={(open) => { if (!open) { setShowUpload(false); setPendingUpload(null); } }}>
        <DialogContent className="max-w-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload Material</DialogTitle>
            <DialogDescription>Upload a file and fill in the details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-xl border-2 border-dashed border-border p-4 flex flex-col items-center gap-3">
              {pendingUpload ? (
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 mx-auto rounded-lg bg-green-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-green-700">{pendingUpload.fileName}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(pendingUpload.fileSize)}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs h-6 text-muted-foreground"
                    onClick={() => setPendingUpload(null)}
                  >
                    Change file
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-muted-foreground/40" />
                  <p className="text-xs text-muted-foreground text-center">
                    Supports PDF, images, audio, video, Word, and text files (max 50 MB)
                  </p>
                  <ObjectUploader
                    maxFileSize={52428800}
                    maxNumberOfFiles={1}
                    onGetUploadParameters={async (file) => {
                      const res = await fetch("/api/storage/uploads/request-url", {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          name: file.name,
                          size: file.size,
                          contentType: file.type,
                        }),
                      });
                      const { uploadURL, objectPath } = await res.json();
                      pendingObjectPath.current = objectPath ?? "";
                      return { method: "PUT" as const, url: uploadURL, headers: { "Content-Type": file.type } };
                    }}
                    onComplete={(result) => {
                      const file = result.successful?.[0];
                      if (file) {
                        setPendingUpload({
                          fileUrl: pendingObjectPath.current,
                          fileName: file.name,
                          mimeType: file.type ?? "application/octet-stream",
                          fileSize: file.size ?? 0,
                        });
                        if (!form.title) {
                          setForm((f) => ({ ...f, title: file.name.replace(/\.[^.]+$/, "") }));
                        }
                      }
                    }}
                    buttonClassName="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium px-4 py-2 hover:bg-primary/90 transition-colors"
                  >
                    <Upload className="w-4 h-4" /> Choose File
                  </ObjectUploader>
                </>
              )}
            </div>
            <div className="space-y-2">
              <Label>Title <span className="text-destructive">*</span></Label>
              <Input
                placeholder="e.g. ECD A Maths Textbook Chapter 1"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                data-testid="input-material-title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Optional description for students…"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={form.subject} onValueChange={(v) => setForm((f) => ({ ...f, subject: v === "none" ? "" : v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Any Subject</SelectItem>
                    {SUBJECTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={form.classLevel} onValueChange={(v) => setForm((f) => ({ ...f, classLevel: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Classes">All Classes</SelectItem>
                    <SelectItem value="ECD A">ECD A</SelectItem>
                    <SelectItem value="ECD B">ECD B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => { setShowUpload(false); setPendingUpload(null); }}>Cancel</Button>
            <Button onClick={handleSave} disabled={createM.isPending || !pendingUpload}>
              {createM.isPending ? "Saving…" : "Save Material"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm ── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.title}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the material and its file. Students will no longer be able to access it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && deleteM.mutate(deleteTarget.id)}
              disabled={deleteM.isPending}
            >
              {deleteM.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Shell>
  );
}
