import { db, usersTable } from "@workspace/db";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function ensureAdmin(): Promise<void> {
  const [existing] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.role, "admin"))
    .limit(1);
  if (existing) return;

  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@Masuka1";
  const hash = await bcrypt.hash(adminPassword, 10);
  await db.insert(usersTable).values({
    username: "admin",
    passwordHash: hash,
    fullName: "School Administrator",
    role: "admin",
    classLevel: null,
    avatarColor: "#1E293B",
  });
  console.log("Seed: admin account created (username: admin)");
}
