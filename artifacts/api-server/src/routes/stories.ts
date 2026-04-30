import { Router, type IRouter } from "express";
import { db, storiesTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { requireUser } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/stories", requireUser, async (_req, res) => {
  const rows = await db.select().from(storiesTable).orderBy(desc(storiesTable.createdAt));
  res.json(rows);
});

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

router.get("/stories/:id", requireUser, async (req, res) => {
  const id = req.params.id;
  if (!UUID_RE.test(id)) {
    res.status(404).json({ message: "Story not found" });
    return;
  }
  const [row] = await db.select().from(storiesTable).where(eq(storiesTable.id, id)).limit(1);
  if (!row) {
    res.status(404).json({ message: "Story not found" });
    return;
  }
  res.json(row);
});

export default router;
