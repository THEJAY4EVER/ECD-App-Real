import { useState } from "react";
import { Shell } from "@/components/Shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { FileText, Image, Music, Video, BookOpen, Search, Download, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { subjectMeta } from "@/lib/subjects";

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

const SUBJECT_ALL = "All Subjects";

export default function StudentMaterials() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState(SUBJECT_ALL);

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ["materials"],
    queryFn: fetchMaterials,
  });

  const subjects = [SUBJECT_ALL, ...Array.from(new Set(materials.map((m) => m.subject).filter(Boolean) as string[]))];

  const filtered = materials.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch = !q || m.title.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q) || m.subject?.toLowerCase().includes(q);
    const matchSubject = filterSubject === SUBJECT_ALL || m.subject === filterSubject;
    return matchSearch && matchSubject;
  });

  return (
    <Shell title="Materials">
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold">📚 Learning Materials</h2>
          {user?.classLevel && (
            <p className="text-sm text-muted-foreground">Showing materials for your class: <strong>{user.classLevel}</strong></p>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search materials…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {subjects.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {subjects.map((s) => (
              <button
                key={s}
                onClick={() => setFilterSubject(s)}
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  filterSubject === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50"
                }`}
              >
                {s === SUBJECT_ALL ? "📖 " : (s ? subjectMeta(s).emoji + " " : "")}
                {s}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="py-10 text-center text-muted-foreground text-sm animate-pulse">Loading materials…</div>
        ) : filtered.length === 0 ? (
          <div className="py-14 text-center space-y-3">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <BookOpen className="w-14 h-14 mx-auto text-primary/30" />
            </motion.div>
            <p className="text-muted-foreground text-sm">No materials available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((m, i) => {
              const Icon = mimeIcon(m.mimeType);
              const isImage = m.mimeType.startsWith("image/");
              const subMeta = m.subject ? subjectMeta(m.subject) : null;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border bg-card overflow-hidden shadow-sm"
                >
                  <div className="flex items-start gap-3 p-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={subMeta ? { backgroundColor: subMeta.color + "22" } : { backgroundColor: "var(--muted)" }}
                    >
                      <Icon className="w-6 h-6" style={subMeta ? { color: subMeta.color } : {}} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm">{m.title}</p>
                      {m.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{m.description}</p>
                      )}
                      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">{mimeLabel(m.mimeType)}</Badge>
                        {m.subject && (
                          <Badge
                            className="text-xs text-white"
                            style={subMeta ? { backgroundColor: subMeta.color } : {}}
                          >
                            {subMeta?.emoji} {m.subject}
                          </Badge>
                        )}
                        {m.classLevel && (
                          <Badge variant="outline" className="text-xs">{m.classLevel}</Badge>
                        )}
                        {m.fileSize && (
                          <span className="text-xs text-muted-foreground">{formatBytes(m.fileSize)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 pb-3">
                    <a
                      href={`/api/storage${m.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="block"
                    >
                      <Button variant="outline" size="sm" className="w-full gap-2">
                        {isImage ? (
                          <><ExternalLink className="w-3.5 h-3.5" /> View</>
                        ) : (
                          <><Download className="w-3.5 h-3.5" /> Open / Download</>
                        )}
                      </Button>
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Shell>
  );
}
