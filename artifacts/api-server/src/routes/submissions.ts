import { Router, type IRouter } from "express";
import { db, assignmentsTable, submissionsTable, usersTable } from "@workspace/db";
import type { Attachment } from "@workspace/db";
import { and, desc, eq } from "drizzle-orm";
import { CreateSubmissionBody, GradeSubmissionBody } from "@workspace/api-zod";
import { requireUser, requireRole } from "../middlewares/auth";
import { ObjectStorageService } from "../lib/objectStorage";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

// Only accept attachment URLs that point at our private object storage route.
// Format produced by AttachmentUploader: `/api/storage/objects/<entityId>`.
const ATTACHMENT_URL_PREFIX = "/api/storage/objects/";

function isAcceptedAttachmentUrl(url: string): boolean {
  return url.startsWith(ATTACHMENT_URL_PREFIX);
}

function toEntityPath(url: string): string {
  return url.replace(/^\/api\/storage/, "");
}

function normalizeAttachments(input: unknown): Attachment[] {
  if (!Array.isArray(input)) return [];
  const out: Attachment[] = [];
  for (const a of input) {
    if (!a || typeof a !== "object") continue;
    const o = a as Record<string, unknown>;
    if (typeof o.url !== "string" || typeof o.name !== "string" || typeof o.mimeType !== "string") continue;
    const kind = o.kind === "image" || o.kind === "audio" || o.kind === "video" || o.kind === "file" ? o.kind : "file";
    out.push({
      url: o.url,
      name: o.name,
      mimeType: o.mimeType,
      kind,
      size: typeof o.size === "number" ? o.size : null,
    });
  }
  return out;
}

async function fetchSerialized(id: string) {
  const [row] = await db
    .select({
      s: submissionsTable,
      studentName: usersTable.fullName,
      assignmentTitle: assignmentsTable.title,
    })
    .from(submissionsTable)
    .innerJoin(usersTable, eq(usersTable.id, submissionsTable.studentId))
    .innerJoin(assignmentsTable, eq(assignmentsTable.id, submissionsTable.assignmentId))
    .where(eq(submissionsTable.id, id))
    .limit(1);
  if (!row) return null;
  return {
    id: row.s.id,
    assignmentId: row.s.assignmentId,
    assignmentTitle: row.assignmentTitle,
    studentId: row.s.studentId,
    studentName: row.studentName,
    submittedAt: row.s.submittedAt.toISOString(),
    content: row.s.content,
    attachmentUrl: row.s.attachmentUrl,
    attachments: row.s.attachments ?? [],
    status: row.s.status,
    grade: row.s.grade,
    feedback: row.s.feedback,
    gradedAt: row.s.gradedAt ? row.s.gradedAt.toISOString() : null,
  };
}

router.get("/submissions", requireUser, async (req, res) => {
  const assignmentId = typeof req.query.assignmentId === "string" ? req.query.assignmentId : undefined;
  const studentId = typeof req.query.studentId === "string" ? req.query.studentId : undefined;
  const filters = [];
  if (assignmentId) filters.push(eq(submissionsTable.assignmentId, assignmentId));
  if (studentId) filters.push(eq(submissionsTable.studentId, studentId));
  if (req.user!.role === "student") filters.push(eq(submissionsTable.studentId, req.user!.id));

  const where = filters.length === 0 ? undefined : filters.length === 1 ? filters[0] : and(...filters);

  const rows = await db
    .select({
      s: submissionsTable,
      studentName: usersTable.fullName,
      assignmentTitle: assignmentsTable.title,
    })
    .from(submissionsTable)
    .innerJoin(usersTable, eq(usersTable.id, submissionsTable.studentId))
    .innerJoin(assignmentsTable, eq(assignmentsTable.id, submissionsTable.assignmentId))
    .where(where)
    .orderBy(desc(submissionsTable.submittedAt));

  res.json(
    rows.map(({ s, studentName, assignmentTitle }) => ({
      id: s.id,
      assignmentId: s.assignmentId,
      assignmentTitle,
      studentId: s.studentId,
      studentName,
      submittedAt: s.submittedAt.toISOString(),
      content: s.content,
      attachmentUrl: s.attachmentUrl,
      attachments: s.attachments ?? [],
      status: s.status,
      grade: s.grade,
      feedback: s.feedback,
      gradedAt: s.gradedAt ? s.gradedAt.toISOString() : null,
    })),
  );
});

router.post("/submissions", requireRole("student"), async (req, res) => {
  const parsed = CreateSubmissionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input" });
    return;
  }
  const rawAttachments = normalizeAttachments((req.body as Record<string, unknown>)?.attachments);
  // Reject any attachment URL not pointing at our private object route — prevents
  // students from injecting arbitrary external URLs that the UI would render.
  for (const a of rawAttachments) {
    if (!isAcceptedAttachmentUrl(a.url)) {
      res.status(400).json({ message: "Invalid attachment URL" });
      return;
    }
  }
  // Bind each uploaded object to this student via ACL so the storage route can
  // enforce ownership on subsequent reads.
  for (const a of rawAttachments) {
    try {
      await objectStorageService.trySetObjectEntityAclPolicy(toEntityPath(a.url), {
        owner: req.user!.id,
        visibility: "private",
      });
    } catch (e) {
      req.log.warn({ err: e, url: a.url }, "Failed to set ACL on uploaded attachment");
    }
  }
  const [row] = await db
    .insert(submissionsTable)
    .values({
      assignmentId: parsed.data.assignmentId,
      studentId: req.user!.id,
      content: parsed.data.content,
      attachmentUrl: parsed.data.attachmentUrl ?? null,
      attachments: rawAttachments,
      status: "pending",
    })
    .returning();
  const out = await fetchSerialized(row.id);
  res.status(201).json(out);
});

router.post("/submissions/:id/grade", requireRole("teacher"), async (req, res) => {
  const parsed = GradeSubmissionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input" });
    return;
  }
  await db
    .update(submissionsTable)
    .set({
      grade: parsed.data.grade,
      feedback: parsed.data.feedback,
      status: "graded",
      gradedAt: new Date(),
    })
    .where(eq(submissionsTable.id, req.params.id));
  const out = await fetchSerialized(req.params.id);
  if (!out) {
    res.status(404).json({ message: "Submission not found" });
    return;
  }
  res.json(out);
});

export default router;
