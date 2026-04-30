import type { Request, Response, NextFunction } from "express";
import { db, sessionsTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export type SessionUser = {
  id: string;
  username: string;
  fullName: string;
  role: "student" | "teacher" | "admin";
  classLevel: string | null;
  avatarColor: string | null;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}

export const SESSION_COOKIE = "masuka_session";

export async function loadUser(req: Request, _res: Response, next: NextFunction) {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return next();
  const rows = await db
    .select({
      id: usersTable.id,
      username: usersTable.username,
      fullName: usersTable.fullName,
      role: usersTable.role,
      classLevel: usersTable.classLevel,
      avatarColor: usersTable.avatarColor,
    })
    .from(sessionsTable)
    .innerJoin(usersTable, eq(usersTable.id, sessionsTable.userId))
    .where(eq(sessionsTable.token, token))
    .limit(1);
  if (rows[0]) {
    req.user = rows[0] as SessionUser;
  }
  next();
}

export function requireUser(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  if (req.user.role !== "admin") {
    res.status(403).json({ message: "Admin access required" });
    return;
  }
  next();
}

export function requireRole(role: "student" | "teacher") {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }
    if (req.user.role !== role && req.user.role !== "admin") {
      res.status(403).json({ message: "Forbidden" });
      return;
    }
    next();
  };
}
