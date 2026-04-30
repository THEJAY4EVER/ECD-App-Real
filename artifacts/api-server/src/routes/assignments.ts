import { Router, type IRouter } from "express";
import { db, assignmentsTable, submissionsTable, usersTable } from "@workspace/db";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { CreateAssignmentBody } from "@workspace/api-zod";
import { requireUser, requireRole } from "../middlewares/auth";

const router: IRouter = Router();

async function serializeAssignment(a: typeof assignmentsTable.$inferSelect) {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(submissionsTable)
    .where(eq(submissionsTable.assignmentId, a.id));
  return {
    id: a.id,
    title: a.title,
    subject: a.subject,
    classLevel: a.classLevel,
    dueDate: a.dueDate.toISOString(),
    createdAt: a.createdAt.toISOString(),
    instructions: a.instructions,
    submissionCount: Number(count) || 0,
    lessonId: a.lessonId,
  };
}

router.get("/assignments", requireUser, async (req, res) => {
  const classLevel = typeof req.query.classLevel === "string" ? req.query.classLevel : undefined;
  let rows;
  if (req.user!.role === "student") {
    const studentClass = req.user!.classLevel ?? "";
    rows = await db
      .select()
      .from(assignmentsTable)
      .where(inArray(assignmentsTable.classLevel, [studentClass, "All"]))
      .orderBy(desc(assignmentsTable.dueDate));
  } else if (classLevel) {
    rows = await db
      .select()
      .from(assignmentsTable)
      .where(eq(assignmentsTable.classLevel, classLevel))
      .orderBy(desc(assignmentsTable.dueDate));
  } else {
    rows = await db.select().from(assignmentsTable).orderBy(desc(assignmentsTable.dueDate));
  }
  const out = await Promise.all(rows.map(serializeAssignment));
  res.json(out);
});

router.post("/assignments", requireRole("teacher"), async (req, res) => {
  const parsed = CreateAssignmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input", errors: parsed.error.issues });
    return;
  }
  const [row] = await db
    .insert(assignmentsTable)
    .values({
      title: parsed.data.title,
      subject: parsed.data.subject,
      classLevel: parsed.data.classLevel,
      dueDate: new Date(parsed.data.dueDate),
      instructions: parsed.data.instructions,
      lessonId: parsed.data.lessonId ?? null,
      createdById: req.user!.id,
    })
    .returning();
  res.status(201).json(await serializeAssignment(row));
});

router.get("/assignments/:id", requireUser, async (req, res) => {
  const [a] = await db.select().from(assignmentsTable).where(eq(assignmentsTable.id, req.params.id)).limit(1);
  if (!a) {
    res.status(404).json({ message: "Assignment not found" });
    return;
  }
  const subs = await db
    .select({
      s: submissionsTable,
      studentName: usersTable.fullName,
    })
    .from(submissionsTable)
    .innerJoin(usersTable, eq(usersTable.id, submissionsTable.studentId))
    .where(
      req.user!.role === "student"
        ? and(eq(submissionsTable.assignmentId, a.id), eq(submissionsTable.studentId, req.user!.id))
        : eq(submissionsTable.assignmentId, a.id),
    )
    .orderBy(desc(submissionsTable.submittedAt));
  const base = await serializeAssignment(a);
  res.json({
    ...base,
    submissions: subs.map(({ s, studentName }) => ({
      id: s.id,
      assignmentId: s.assignmentId,
      assignmentTitle: a.title,
      studentId: s.studentId,
      studentName,
      submittedAt: s.submittedAt.toISOString(),
      content: s.content,
      attachments: s.attachments ?? [],
      attachmentUrl: s.attachmentUrl,
      status: s.status,
      grade: s.grade,
      feedback: s.feedback,
      gradedAt: s.gradedAt ? s.gradedAt.toISOString() : null,
    })),
  });
});

router.delete("/assignments/:id", requireRole("teacher"), async (req, res) => {
  await db.delete(assignmentsTable).where(eq(assignmentsTable.id, req.params.id));
  res.status(204).end();
});

export default router;
