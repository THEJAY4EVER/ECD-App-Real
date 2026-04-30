import { Router, type IRouter } from "express";
import { db, assignmentsTable, submissionsTable, usersTable } from "@workspace/db";
import { and, eq, sql } from "drizzle-orm";
import { requireRole, requireUser } from "../middlewares/auth";

const router: IRouter = Router();

router.get("/students", requireRole("teacher"), async (_req, res) => {
  const students = await db.select().from(usersTable).where(eq(usersTable.role, "student"));
  const out = await Promise.all(
    students.map(async (s) => {
      const [{ submissionCount }] = await db
        .select({ submissionCount: sql<number>`count(*)::int` })
        .from(submissionsTable)
        .where(eq(submissionsTable.studentId, s.id));
      const [{ gradedCount }] = await db
        .select({ gradedCount: sql<number>`count(*)::int` })
        .from(submissionsTable)
        .where(and(eq(submissionsTable.studentId, s.id), eq(submissionsTable.status, "graded")));
      return {
        id: s.id,
        fullName: s.fullName,
        classLevel: s.classLevel ?? "ECD A",
        avatarColor: s.avatarColor ?? "#F59E0B",
        submissionCount: Number(submissionCount) || 0,
        gradedCount: Number(gradedCount) || 0,
      };
    }),
  );
  res.json(out);
});

const MILESTONE_TEMPLATE = [
  { name: "Counts to 20", area: "Cognitive" },
  { name: "Recognizes shapes & colors", area: "Cognitive" },
  { name: "Speaks in full sentences (English)", area: "Language" },
  { name: "Speaks in full sentences (Shona)", area: "Language" },
  { name: "Holds a pencil correctly", area: "Physical" },
  { name: "Hops on one foot", area: "Physical" },
  { name: "Shares & takes turns", area: "Socio-emotional" },
  { name: "Expresses feelings with words", area: "Socio-emotional" },
  { name: "Sings & dances to rhythm", area: "Creative" },
  { name: "Draws recognizable figures", area: "Creative" },
];

const GRADE_TO_LEVEL: Record<string, "emerging" | "developing" | "achieved" | "excelling"> = {
  needs_support: "emerging",
  developing: "developing",
  good: "achieved",
  excellent: "excelling",
};

router.get("/students/:id/progress", requireUser, async (req, res) => {
  if (req.user!.role !== "teacher" && req.user!.id !== req.params.id) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  const [student] = await db.select().from(usersTable).where(eq(usersTable.id, req.params.id)).limit(1);
  if (!student || student.role !== "student") {
    res.status(404).json({ message: "Student not found" });
    return;
  }
  const [{ totalAssignments }] = await db
    .select({ totalAssignments: sql<number>`count(*)::int` })
    .from(assignmentsTable)
    .where(eq(assignmentsTable.classLevel, student.classLevel ?? ""));
  const subs = await db.select().from(submissionsTable).where(eq(submissionsTable.studentId, student.id));
  const graded = subs.filter((s) => s.status === "graded");
  const counts: Record<string, number> = { excellent: 0, good: 0, developing: 0, needs_support: 0 };
  for (const g of graded) if (g.grade && counts[g.grade] !== undefined) counts[g.grade]++;
  const gradeBreakdown = Object.entries(counts).map(([grade, count]) => ({ grade, count }));

  const lastGrade = graded[graded.length - 1]?.grade ?? "developing";
  const baseLevel = GRADE_TO_LEVEL[lastGrade] ?? "developing";
  const levels: Array<"emerging" | "developing" | "achieved" | "excelling"> = ["emerging", "developing", "achieved", "excelling"];
  const baseIdx = levels.indexOf(baseLevel);

  const milestones = MILESTONE_TEMPLATE.map((m, i) => {
    const offset = ((i + counts.excellent + counts.good) % 3) - 1;
    const idx = Math.max(0, Math.min(3, baseIdx + offset));
    return { name: m.name, area: m.area, level: levels[idx] };
  });

  const studentSubs = subs.length;
  const summary = `${student.fullName} has submitted ${studentSubs} of ${Number(totalAssignments) || 0} assignments and has been graded on ${graded.length}. Highlights: ${counts.excellent} excellent and ${counts.good} good ratings. Areas to support: ${counts.needs_support} task(s) needing extra help.`;

  res.json({
    student: {
      id: student.id,
      fullName: student.fullName,
      classLevel: student.classLevel ?? "ECD A",
      avatarColor: student.avatarColor ?? "#F59E0B",
      submissionCount: studentSubs,
      gradedCount: graded.length,
    },
    totalAssignments: Number(totalAssignments) || 0,
    submittedCount: studentSubs,
    gradedCount: graded.length,
    gradeBreakdown,
    milestones,
    generatedAt: new Date().toISOString(),
    summary,
  });
});

export default router;
