import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Image as ImageIcon, Mic, Paperclip, Square, X, Camera, Loader2 } from "lucide-react";

export type Attachment = {
  url: string;
  name: string;
  mimeType: string;
  kind: "image" | "audio" | "video" | "file";
  size?: number | null;
};

function kindFromMime(mt: string): Attachment["kind"] {
  if (mt.startsWith("image/")) return "image";
  if (mt.startsWith("audio/")) return "audio";
  if (mt.startsWith("video/")) return "video";
  return "file";
}

async function uploadFile(file: Blob, name: string): Promise<Attachment> {
  const meta = { name, size: file.size, contentType: file.type || "application/octet-stream" };
  const r = await fetch("/api/storage/uploads/request-url", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(meta),
  });
  if (!r.ok) throw new Error(`Upload URL failed: ${r.status}`);
  const { uploadURL, objectPath } = (await r.json()) as { uploadURL: string; objectPath: string };
  const put = await fetch(uploadURL, {
    method: "PUT",
    headers: { "Content-Type": meta.contentType },
    body: file,
  });
  if (!put.ok) throw new Error(`Upload failed: ${put.status}`);
  return {
    url: `/api/storage${objectPath}`,
    name,
    mimeType: meta.contentType,
    kind: kindFromMime(meta.contentType),
    size: file.size,
  };
}

export function AttachmentUploader({
  attachments,
  onChange,
  disabled,
}: {
  attachments: Attachment[];
  onChange: (a: Attachment[]) => void;
  disabled?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!recording) return;
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [recording]);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const next = [...attachments];
      for (const f of Array.from(files)) {
        const att = await uploadFile(f, f.name);
        next.push(att);
      }
      onChange(next);
    } catch (e) {
      toast({ title: "Upload failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
      if (photoRef.current) photoRef.current.value = "";
    }
  }

  async function startRecording() {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast({ title: "Recording not supported on this device", variant: "destructive" });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setRecording(false);
        setSeconds(0);
        setUploading(true);
        try {
          const ext = (rec.mimeType || "audio/webm").includes("webm") ? "webm" : "ogg";
          const att = await uploadFile(blob, `voice-${Date.now()}.${ext}`);
          onChange([...attachments, att]);
        } catch (e) {
          toast({ title: "Upload failed", description: (e as Error).message, variant: "destructive" });
        } finally {
          setUploading(false);
        }
      };
      recRef.current = rec;
      rec.start();
      setRecording(true);
      setSeconds(0);
    } catch (e) {
      toast({ title: "Microphone permission denied", description: (e as Error).message, variant: "destructive" });
    }
  }

  function stopRecording() {
    recRef.current?.stop();
  }

  function remove(i: number) {
    const next = attachments.slice();
    next.splice(i, 1);
    onChange(next);
  }

  const busy = uploading || disabled;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <input
          ref={photoRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          data-testid="input-photo"
        />
        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          data-testid="input-file"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => photoRef.current?.click()}
          data-testid="button-photo"
        >
          <Camera className="w-4 h-4 mr-1" /> Photo
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
          data-testid="button-file"
        >
          <Paperclip className="w-4 h-4 mr-1" /> File
        </Button>
        {recording ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={stopRecording}
            data-testid="button-stop-record"
          >
            <Square className="w-4 h-4 mr-1" /> {seconds}s
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={startRecording}
            data-testid="button-record"
          >
            <Mic className="w-4 h-4 mr-1" /> Voice
          </Button>
        )}
      </div>
      {uploading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="w-3 h-3 animate-spin" /> Uploading…
        </div>
      )}
      {attachments.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {attachments.map((a, i) => (
            <Card key={i} className="relative p-2 flex items-center gap-2 text-xs" data-testid={`attachment-${i}`}>
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
                aria-label="Remove"
              >
                <X className="w-3 h-3" />
              </button>
              {a.kind === "image" ? (
                <div className="w-12 h-12 rounded bg-emerald-100 flex items-center justify-center"><ImageIcon className="w-5 h-5 text-emerald-600" /></div>
              ) : a.kind === "audio" ? (
                <div className="w-12 h-12 rounded bg-violet-100 flex items-center justify-center"><Mic className="w-5 h-5 text-violet-600" /></div>
              ) : (
                <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center"><Paperclip className="w-5 h-5 text-slate-600" /></div>
              )}
              <div className="flex-1 min-w-0 truncate">{a.name}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function AttachmentList({ attachments }: { attachments: Attachment[] }) {
  if (!attachments || attachments.length === 0) return null;
  return (
    <div className="space-y-2 mt-2">
      {attachments.map((a, i) => (
        <div key={i} className="rounded-xl bg-white/60 p-2" data-testid={`view-attachment-${i}`}>
          {a.kind === "image" ? (
            <a href={a.url} target="_blank" rel="noreferrer" className="block">
              <img src={a.url} alt={a.name} className="w-full rounded-lg max-h-72 object-contain bg-black/5" />
            </a>
          ) : a.kind === "audio" ? (
            <audio controls src={a.url} className="w-full" data-testid={`audio-${i}`} />
          ) : a.kind === "video" ? (
            <video controls src={a.url} className="w-full rounded-lg max-h-72" />
          ) : (
            <a href={a.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs text-primary underline">
              <Paperclip className="w-3 h-3" /> {a.name}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
