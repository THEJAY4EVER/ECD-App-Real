import { Router, type IRouter } from "express";
import { db, materialsTable, usersTable } from "@workspace/db";
import { eq, and, or, isNull } from "drizzle-orm";
import { requireUser } from "../middlewares/auth";
import { ObjectStorageService } from "../lib/objectStorage";

const router: IRouter = Router();
const storageService = new ObjectStorageService();

const MATERIAL_FIELDS = {
  id: materialsTable.id,
  title: materialsTable.title,
  description: materialsTable.description,
  fileUrl: materialsTable.fileUrl,
  fileName: materialsTable.fileName,
  mimeType: materialsTable.mimeType,
  fileSize: materialsTable.fileSize,
  subject: materialsTable.subject,
  classLevel: materialsTable.classLevel,
  uploadedById: materialsTable.uploadedById,
  createdAt: materialsTable.createdAt,
} as const;

router.get("/materials", requireUser, async (req, res) => {
  const user = req.user!;

  let rows;
  if (user.role === "teacher" || user.role === "admin") {
    rows = await db
      .select(MATERIAL_FIELDS)
      .from(materialsTable)
      .orderBy(materialsTable.createdAt);
  } else {
    const classLevel = user.classLevel;
    rows = await db
      .select(MATERIAL_FIELDS)
      .from(materialsTable)
      .where(
        classLevel
          ? or(isNull(materialsTable.classLevel), eq(materialsTable.classLevel, classLevel))
          : isNull(materialsTable.classLevel)
      )
      .orderBy(materialsTable.createdAt);
  }

  res.json(rows);
});

router.post("/materials", requireUser, async (req, res) => {
  const user = req.user!;
  if (user.role !== "teacher") {
    res.status(403).json({ message: "Only teachers can upload materials" });
    return;
  }

  const { title, description, fileUrl, fileName, mimeType, fileSize, subject, classLevel } = req.body as {
    title?: string;
    description?: string;
    fileUrl?: string;
    fileName?: string;
    mimeType?: string;
    fileSize?: number;
    subject?: string;
    classLevel?: string;
  };

  if (!title?.trim() || !fileUrl || !fileName || !mimeType) {
    res.status(400).json({ message: "title, fileUrl, fileName, and mimeType are required" });
    return;
  }

  const [material] = await db
    .insert(materialsTable)
    .values({
      title: title.trim(),
      description: description?.trim() || null,
      fileUrl,
      fileName,
      mimeType,
      fileSize: fileSize ?? null,
      subject: subject?.trim() || null,
      classLevel: classLevel?.trim() || null,
      uploadedById: user.id,
    })
    .returning(MATERIAL_FIELDS);

  res.status(201).json(material);
});

router.delete("/materials/:id", requireUser, async (req, res) => {
  const user = req.user!;
  if (user.role !== "teacher") {
    res.status(403).json({ message: "Only teachers can delete materials" });
    return;
  }

  const { id } = req.params;

  const [existing] = await db
    .select({ id: materialsTable.id, uploadedById: materialsTable.uploadedById, fileUrl: materialsTable.fileUrl })
    .from(materialsTable)
    .where(eq(materialsTable.id, id))
    .limit(1);

  if (!existing) {
    res.status(404).json({ message: "Material not found" });
    return;
  }

  if (existing.uploadedById !== user.id) {
    res.status(403).json({ message: "You can only delete your own materials" });
    return;
  }

  await db.delete(materialsTable).where(eq(materialsTable.id, id));
  res.status(204).end();
});

export default router;
