import { Router, type IRouter } from "express";
import { db, assignmentsTable, lessonsTable, submissionsTable, usersTable } from "@workspace/db";
import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { requireRole } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/dashboard/teacher", requireRole("teacher"), async (req, res) => {
  const [{ totalStudents }] = await db
    .select({ totalStudents: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(eq(usersTable.role, "student"));
  const [{ activeAssignments }] = await db
    .select({ activeAssignments: sql<number>`count(*)::int` })
    .from(assignmentsTable)
    .where(gte(assignmentsTable.dueDate, new Date()));
  const [{ pendingSubmissions }] = await db
    .select({ pendingSubmissions: sql<number>`count(*)::int` })
    .from(submissionsTable)
    .where(eq(submissionsTable.status, "pending"));
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [{ gradedThisWeek }] = await db
    .select({ gradedThisWeek: sql<number>`count(*)::int` })
    .from(submissionsTable)
    .where(and(eq(submissionsTable.status, "graded"), gte(submissionsTable.gradedAt, weekAgo)));

  const recents = await db
    .select({ s: submissionsTable, studentName: usersTable.fullName, assignmentTitle: assignmentsTable.title })
    .from(submissionsTable)
    .innerJoin(usersTable, eq(usersTable.id, submissionsTable.studentId))
    .innerJoin(assignmentsTable, eq(assignmentsTable.id, submissionsTable.assignmentId))
    .orderBy(desc(submissionsTable.submittedAt))
    .limit(8);

  const classRows = await db
    .select({ classLevel: usersTable.classLevel, c: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(eq(usersTable.role, "student"))
    .groupBy(usersTable.classLevel);

  res.json({
    teacherName: req.user!.fullName,
    totalStudents: Number(totalStudents) || 0,
    activeAssignments: Number(activeAssignments) || 0,
    pendingSubmissions: Number(pendingSubmissions) || 0,
    gradedThisWeek: Number(gradedThisWeek) || 0,
    recentSubmissions: recents.map(({ s, studentName, assignmentTitle }) => ({
      id: s.id,
      assignmentId: s.assignmentId,
      assignmentTitle,
      studentId: s.studentId,
      studentName,
      submittedAt: s.submittedAt.toISOString(),
      content: s.content,
      attachmentUrl: s.attachmentUrl,
      status: s.status,
      grade: s.grade,
      feedback: s.feedback,
      gradedAt: s.gradedAt ? s.gradedAt.toISOString() : null,
    })),
    classBreakdown: classRows.map((r) => ({ classLevel: r.classLevel ?? "Unassigned", studentCount: Number(r.c) || 0 })),
  });
});

router.get("/dashboard/student", requireRole("student"), async (req, res) => {
  const user = req.user!;
  const dueRows = await db
    .select()
    .from(assignmentsTable)
    .where(and(eq(assignmentsTable.classLevel, user.classLevel ?? ""), gte(assignmentsTable.dueDate, new Date())))
    .orderBy(assignmentsTable.dueDate)
    .limit(5);
  const submitted = await db
    .select({ assignmentId: submissionsTable.assignmentId })
    .from(submissionsTable)
    .where(eq(submissionsTable.studentId, user.id));
  const submittedIds = new Set(submitted.map((s) => s.assignmentId));
  const dueAssignments = await Promise.all(
    dueRows
      .filter((a) => !submittedIds.has(a.id))
      .map(async (a) => {
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
      }),
  );

  const recentLessons = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.classLevel, user.classLevel ?? ""))
    .orderBy(desc(lessonsTable.createdAt))
    .limit(6);

  const recentGradedRows = await db
    .select({ s: submissionsTable, assignmentTitle: assignmentsTable.title })
    .from(submissionsTable)
    .innerJoin(assignmentsTable, eq(assignmentsTable.id, submissionsTable.assignmentId))
    .where(and(eq(submissionsTable.studentId, user.id), eq(submissionsTable.status, "graded")))
    .orderBy(desc(submissionsTable.gradedAt))
    .limit(5);

  res.json({
    studentName: user.fullName,
    classLevel: user.classLevel ?? "ECD A",
    avatarColor: user.avatarColor ?? "#F59E0B",
    streakDays: 3,
    dueAssignments,
    recentLessons,
    recentGrades: recentGradedRows.map(({ s, assignmentTitle }) => ({
      id: s.id,
      assignmentId: s.assignmentId,
      assignmentTitle,
      studentId: s.studentId,
      studentName: user.fullName,
      submittedAt: s.submittedAt.toISOString(),
      content: s.content,
      attachmentUrl: s.attachmentUrl,
      status: s.status,
      grade: s.grade,
      feedback: s.feedback,
      gradedAt: s.gradedAt ? s.gradedAt.toISOString() : null,
    })),
  });
});

// Suppress unused import warning
void inArray;

export default router;
