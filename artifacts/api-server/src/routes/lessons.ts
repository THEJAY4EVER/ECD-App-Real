import { Router, type IRouter } from "express";
import { db, lessonsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireUser } from "../middlewares/auth";

const router: IRouter = Router();

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "#F59E0B",
  English: "#EC4899",
  Shona: "#10B981",
  "Environmental Science": "#22C55E",
  "Visual & Performing Arts": "#8B5CF6",
  "Heritage Studies": "#EF4444",
};

router.get("/lessons", requireUser, async (req, res) => {
  const subject = typeof req.query.subject === "string" ? req.query.subject : undefined;
  const rows = subject
    ? await db.select().from(lessonsTable).where(eq(lessonsTable.subject, subject))
    : await db.select().from(lessonsTable);
  res.json(rows);
});

router.get("/lessons/subjects", requireUser, async (_req, res) => {
  const rows = await db.select().from(lessonsTable);
  const counts = new Map<string, number>();
  for (const r of rows) counts.set(r.subject, (counts.get(r.subject) ?? 0) + 1);
  const out = Array.from(counts.entries()).map(([subject, lessonCount]) => ({
    subject,
    lessonCount,
    color: SUBJECT_COLORS[subject] ?? "#3B82F6",
  }));
  res.json(out);
});

router.get("/lessons/:id", requireUser, async (req, res) => {
  const [row] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, req.params.id)).limit(1);
  if (!row) {
    res.status(404).json({ message: "Lesson not found" });
    return;
  }
  res.json(row);
});

export default router;
