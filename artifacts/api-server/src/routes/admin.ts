import { Router, type IRouter } from "express";
import { db, usersTable, sessionsTable } from "@workspace/db";
import { eq, ne, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

function generatePassword(length = 12): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
  const bytes = randomBytes(length);
  return Array.from(bytes)
    .map((b) => chars[b % chars.length])
    .join("");
}

function slugifyUsername(fullName: string): string {
  return fullName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .join(".");
}

async function uniqueUsername(base: string): Promise<string> {
  let candidate = base;
  let attempt = 0;
  while (true) {
    const [existing] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.username, candidate))
      .limit(1);
    if (!existing) return candidate;
    attempt++;
    candidate = `${base}${attempt}`;
  }
}

function isValidUsername(u: string): boolean {
  return /^[a-z0-9._-]{3,30}$/.test(u);
}

const AVATAR_COLORS = [
  "#F59E0B", "#10B981", "#0EA5E9", "#EC4899",
  "#8B5CF6", "#EF4444", "#F97316", "#06B6D4",
];

function randomColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

const USER_FIELDS = {
  id: usersTable.id,
  username: usersTable.username,
  fullName: usersTable.fullName,
  role: usersTable.role,
  classLevel: usersTable.classLevel,
  avatarColor: usersTable.avatarColor,
  isActive: usersTable.isActive,
  createdAt: usersTable.createdAt,
} as const;

router.get("/admin/users", requireAdmin, async (_req, res) => {
  const users = await db
    .select(USER_FIELDS)
    .from(usersTable)
    .where(ne(usersTable.role, "admin"))
    .orderBy(usersTable.createdAt);
  res.json(users);
});

router.post("/admin/users", requireAdmin, async (req, res) => {
  const { fullName, role, classLevel, avatarColor, username: customUsername, password: customPassword } = req.body as {
    fullName?: string;
    role?: string;
    classLevel?: string;
    avatarColor?: string;
    username?: string;
    password?: string;
  };

  if (!fullName || !role) {
    res.status(400).json({ message: "fullName and role are required" });
    return;
  }
  if (role !== "student" && role !== "teacher") {
    res.status(400).json({ message: "role must be student or teacher" });
    return;
  }
  if (role === "student" && !classLevel) {
    res.status(400).json({ message: "classLevel is required for students" });
    return;
  }

  let username: string;
  if (customUsername) {
    const clean = customUsername.trim().toLowerCase();
    if (!isValidUsername(clean)) {
      res.status(400).json({ message: "Username must be 3–30 characters and contain only letters, numbers, dots, hyphens, or underscores" });
      return;
    }
    const [taken] = await db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.username, clean))
      .limit(1);
    if (taken) {
      res.status(409).json({ message: `Username "${clean}" is already taken` });
      return;
    }
    username = clean;
  } else {
    const baseUsername = slugifyUsername(fullName);
    username = await uniqueUsername(baseUsername || "user");
  }

  const password = customPassword?.trim() || generatePassword();
  if (customPassword && customPassword.trim().length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters" });
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);

  const [user] = await db
    .insert(usersTable)
    .values({
      username,
      passwordHash,
      fullName,
      role: role as "student" | "teacher",
      classLevel: role === "student" ? (classLevel ?? null) : null,
      avatarColor: avatarColor ?? randomColor(),
      isActive: true,
    })
    .returning(USER_FIELDS);

  res.status(201).json({ ...user, password });
});

router.patch("/admin/users/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { fullName, classLevel, avatarColor, password, isActive } = req.body as {
    fullName?: string;
    classLevel?: string;
    avatarColor?: string;
    password?: string;
    isActive?: boolean;
  };

  const [existing] = await db
    .select({ id: usersTable.id, role: usersTable.role })
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);

  if (!existing || existing.role === "admin") {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const updates: Record<string, unknown> = {};
  if (fullName !== undefined) updates.fullName = fullName;
  if (classLevel !== undefined) updates.classLevel = classLevel || null;
  if (avatarColor !== undefined) updates.avatarColor = avatarColor;
  if (isActive !== undefined) updates.isActive = Boolean(isActive);

  if (password !== undefined) {
    if (password.trim().length < 6) {
      res.status(400).json({ message: "Password must be at least 6 characters" });
      return;
    }
    updates.passwordHash = await bcrypt.hash(password.trim(), 10);
    await db.delete(sessionsTable).where(eq(sessionsTable.userId, id));
  }

  if (isActive === false) {
    await db.delete(sessionsTable).where(eq(sessionsTable.userId, id));
  }

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ message: "No fields to update" });
    return;
  }

  const [updated] = await db
    .update(usersTable)
    .set(updates)
    .where(eq(usersTable.id, id))
    .returning(USER_FIELDS);

  res.json(updated);
});

router.delete("/admin/users/:id", requireAdmin, async (req, res) => {
  const { id } = req.params;

  const [existing] = await db
    .select({ id: usersTable.id, role: usersTable.role })
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);

  if (!existing || existing.role === "admin") {
    res.status(404).json({ message: "User not found" });
    return;
  }

  await db.delete(usersTable).where(eq(usersTable.id, id));
  res.status(204).end();
});

router.post("/admin/users/:id/reset-password", requireAdmin, async (req, res) => {
  const { id } = req.params;

  const [existing] = await db
    .select({ id: usersTable.id, role: usersTable.role })
    .from(usersTable)
    .where(eq(usersTable.id, id))
    .limit(1);

  if (!existing || existing.role === "admin") {
    res.status(404).json({ message: "User not found" });
    return;
  }

  const password = generatePassword();
  const passwordHash = await bcrypt.hash(password, 10);

  await db.update(usersTable).set({ passwordHash }).where(eq(usersTable.id, id));
  await db.delete(sessionsTable).where(eq(sessionsTable.userId, id));

  res.json({ password });
});

router.get("/admin/stats", requireAdmin, async (_req, res) => {
  const [{ teacherCount }] = await db
    .select({ teacherCount: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(eq(usersTable.role, "teacher"));
  const [{ studentCount }] = await db
    .select({ studentCount: sql<number>`count(*)::int` })
    .from(usersTable)
    .where(eq(usersTable.role, "student"));
  res.json({
    teacherCount: Number(teacherCount) || 0,
    studentCount: Number(studentCount) || 0,
  });
});

export default router;
