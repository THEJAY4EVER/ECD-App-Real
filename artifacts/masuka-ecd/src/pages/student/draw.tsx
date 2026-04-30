import { useEffect, useRef, useState } from "react";
import { Shell } from "@/components/Shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eraser, Trash2, Save, Download, Palette as PaletteIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const COLORS = ["#000000", "#dc2626", "#ea580c", "#facc15", "#16a34a", "#2563eb", "#9333ea", "#ec4899", "#92400e", "#ffffff"];
const SIZES = [4, 8, 14, 22];

type Drawing = { id: string; data: string; createdAt: number };

function loadGallery(): Drawing[] {
  try {
    return JSON.parse(localStorage.getItem("drawings") || "[]");
  } catch {
    return [];
  }
}

const GALLERY_CAP = 30;
function saveGallery(g: Drawing[]) {
  localStorage.setItem("drawings", JSON.stringify(g.slice(-GALLERY_CAP)));
}

export default function Draw() {
  const { t } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState("#2563eb");
  const [size, setSize] = useState(8);
  const [erasing, setErasing] = useState(false);
  const [gallery, setGallery] = useState<Drawing[]>([]);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setGallery(loadGallery());
    const c = canvasRef.current;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = rect.width * dpr;
    c.height = rect.height * dpr;
    const ctx = c.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = pos(e);
  }

  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || !last.current) return;
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    const p = pos(e);
    ctx.strokeStyle = erasing ? "#ffffff" : color;
    ctx.lineWidth = erasing ? size * 2 : size;
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  }

  function end() {
    drawing.current = false;
    last.current = null;
  }

  function clearAll() {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    const rect = c.getBoundingClientRect();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
  }

  function save() {
    const c = canvasRef.current!;
    const data = c.toDataURL("image/png");
    const item: Drawing = { id: crypto.randomUUID(), data, createdAt: Date.now() };
    const next = [...gallery, item].slice(-GALLERY_CAP);
    setGallery(next);
    saveGallery(next);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  }

  function download(d: Drawing) {
    const a = document.createElement("a");
    a.href = d.data;
    a.download = `masuka-drawing-${d.id.slice(0, 6)}.png`;
    a.click();
  }

  function remove(id: string) {
    const next = gallery.filter((g) => g.id !== id);
    setGallery(next);
    saveGallery(next);
  }

  return (
    <Shell title={t("nav.draw")}>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <PaletteIcon className="w-5 h-5 text-primary" />
          <h1 className="text-xl font-extrabold">{t("draw.heading")}</h1>
        </div>

        <Card className="p-3 border-0 shadow-md">
          <div className="flex flex-wrap gap-2 mb-2">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => { setColor(c); setErasing(false); }}
                style={{ background: c }}
                className={`w-9 h-9 rounded-full border-2 ${color === c && !erasing ? "border-primary ring-2 ring-primary scale-110" : "border-white"} shadow transition-transform hover:scale-110`}
                aria-label={`Color ${c}`}
                data-testid={`color-${c}`}
              />
            ))}
            <button
              onClick={() => setErasing(true)}
              className={`w-9 h-9 rounded-full bg-muted flex items-center justify-center ${erasing ? "ring-2 ring-primary scale-110" : ""} transition-transform hover:scale-110`}
              aria-label="Eraser"
              data-testid="button-eraser"
            >
              <Eraser className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 mb-3">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`w-9 h-9 rounded-full bg-white shadow flex items-center justify-center ${size === s ? "ring-2 ring-primary scale-110" : ""} transition-transform hover:scale-110`}
                aria-label={`Brush size ${s}`}
                data-testid={`size-${s}`}
              >
                <span className="rounded-full bg-foreground" style={{ width: s, height: s }} />
              </button>
            ))}
            <div className="flex-1" />
            <Button size="sm" variant="ghost" onClick={clearAll} data-testid="button-clear">
              <Trash2 className="w-4 h-4 mr-1" /> {t("draw.clear")}
            </Button>
          </div>

          <canvas
            ref={canvasRef}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
            className="w-full aspect-square rounded-2xl border-2 border-dashed border-primary/30 touch-none bg-white"
            data-testid="canvas-draw"
          />

          <div className="flex items-center justify-between mt-3">
            <AnimatePresence>
              {savedFlash && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-emerald-600 text-sm font-bold"
                >
                  ✨ {t("draw.saved")}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex-1" />
            <Button onClick={save} className="font-bold" data-testid="button-save">
              <Save className="w-4 h-4 mr-1" /> {t("draw.save")}
            </Button>
          </div>
        </Card>

        {gallery.length > 0 && (
          <div>
            <h2 className="text-sm font-bold mb-2 text-muted-foreground">{t("draw.gallery")} ({gallery.length})</h2>
            <div className="grid grid-cols-3 gap-2">
              {gallery.slice().reverse().map((d) => (
                <motion.div
                  key={d.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative group"
                >
                  <img src={d.data} alt="Drawing" className="w-full aspect-square object-cover rounded-xl border-2 border-white shadow-md" />
                  <div className="absolute top-1 right-1 flex flex-col gap-1">
                    <Button size="icon" variant="secondary" className="h-7 w-7 shadow" onClick={() => download(d)} aria-label="Download" data-testid={`download-${d.id}`}>
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="destructive" className="h-7 w-7 shadow" onClick={() => remove(d.id)} aria-label="Delete" data-testid={`remove-${d.id}`}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
