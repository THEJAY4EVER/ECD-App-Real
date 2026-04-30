import { Router, type IRouter } from "express";
import { db, sessionsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import { LoginBody } from "@workspace/api-zod";
import { SESSION_COOKIE, requireUser } from "../middlewares/auth";

const router: IRouter = Router();

router.post("/auth/login", async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input" });
    return;
  }
  const { username, password } = parsed.data;
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username.toLowerCase()))
    .limit(1);
  if (!user) {
    res.status(401).json({ message: "Invalid username or password" });
    return;
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    res.status(401).json({ message: "Invalid username or password" });
    return;
  }
  if (user.isActive === false) {
    res.status(403).json({ message: "This account has been disabled. Please contact the school administrator." });
    return;
  }
  const token = randomBytes(32).toString("hex");
  await db.insert(sessionsTable).values({ userId: user.id, token });
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 30,
    path: "/",
  });
  res.json({
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    role: user.role,
    classLevel: user.classLevel,
    avatarColor: user.avatarColor,
  });
});

router.post("/auth/logout", async (req, res) => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (token) {
    await db.delete(sessionsTable).where(eq(sessionsTable.token, token));
  }
  res.clearCookie(SESSION_COOKIE, { path: "/" });
  res.status(204).end();
});

router.get("/auth/me", requireUser, (req, res) => {
  res.json(req.user);
});

export default router;
