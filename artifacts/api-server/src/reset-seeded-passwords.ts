/**
 * reset-seeded-passwords.ts
 *
 * One-time script: resets the passwords of the named accounts that were
 * seeded with weak/static passwords during the initial run, replacing them
 * with cryptographically random strong passwords.
 *
 * Writes an updated .local/school-credentials.md.
 * No passwords are printed to stdout or hardcoded in source.
 */
import { db, usersTable, sessionsTable } from "@workspace/db";
import bcrypt from "bcryptjs";
import { eq, inArray, notInArray } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function generatePassword(length = 12): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
  const bytes = randomBytes(length);
  return Array.from(bytes).map((b) => chars[b % chars.length]).join("");
}

const SEEDED_USERNAMES = [
  "mrs.chiweshe",
  "mrs.moyo",
  "ruvimbo.mutasa",
  "takudzwa.banda",
  "chipo.marange",
  "farai.sibanda",
  "tafadzwa.nhamo",
  "nyasha.chipanga",
  "simbarashe.dube",
  "tariro.mhike",
  "tinashe.zvenyika",
  "kudakwashe.makoni",
  "mazvita.chauke",
  "tanatswa.chirwa",
  "blessing.ndlovu",
  "rutendo.dziva",
  "tinevimbo.chiremba",
  "panashe.mupfurutsa",
  "vimbai.mangena",
  "anashe.chirume",
  "kudzai.machakaire",
  "tatenda.gwenzi",
];

async function resetPasswords() {
  const users = await db
    .select({ id: usersTable.id, username: usersTable.username, fullName: usersTable.fullName, role: usersTable.role, classLevel: usersTable.classLevel })
    .from(usersTable)
    .where(inArray(usersTable.username, SEEDED_USERNAMES));

  if (users.length === 0) {
    process.stdout.write("No seeded accounts found — nothing to reset.\n");
    return;
  }

  const results: { user: typeof users[0]; password: string }[] = [];

  for (const user of users) {
    const password = generatePassword();
    const passwordHash = await bcrypt.hash(password, 10);
    await db.update(usersTable).set({ passwordHash }).where(eq(usersTable.id, user.id));
    await db.delete(sessionsTable).where(eq(sessionsTable.userId, user.id));
    results.push({ user, password });
    process.stdout.write(`RESET ${user.username}\n`);
  }

  process.stdout.write(`\n${results.length} passwords reset.\n`);

  const teachers = results.filter((r) => r.user.role === "teacher");
  const ecdA = results.filter((r) => r.user.classLevel === "ECD A");
  const ecdB = results.filter((r) => r.user.classLevel === "ECD B");
  const today = new Date().toISOString().slice(0, 10);

  const rows = (list: typeof results) =>
    list.map(({ user, password }) =>
      `| ${user.fullName} | \`${user.username}\` | \`${password}\` |`
    ).join("\n");

  const others = await db
    .select({ fullName: usersTable.fullName, username: usersTable.username, role: usersTable.role, classLevel: usersTable.classLevel })
    .from(usersTable)
    .where(notInArray(usersTable.username, [...SEEDED_USERNAMES, "admin"]))
    .orderBy(usersTable.role, usersTable.fullName);

  const otherRows = others.length > 0
    ? others.map((u) => `| ${u.fullName} | \`${u.username}\` | ${u.role}${u.classLevel ? ` — ${u.classLevel}` : ""} |`).join("\n")
    : "| *(none)* | | |";

  const doc = `# Masuka Junior School — Account Credentials
**Date created:** ${today}
**CONFIDENTIAL — keep this file secure and do not share it publicly.**

The admin panel for managing users is at: **/users** (log in as \`admin\` first).

---

## Teachers

| Full Name | Username | Password |
|---|---|---|
${rows(teachers)}

---

## ECD A Students

| Full Name | Username | Password |
|---|---|---|
${rows(ecdA)}

---

## ECD B Students

| Full Name | Username | Password |
|---|---|---|
${rows(ecdB)}

---

## Other accounts in the database (not managed by this script)

These accounts exist in the database but are not part of the named roster above.
Use the **/users** admin page to reset their passwords individually.

| Full Name | Username | Role |
|---|---|---|
${otherRows}

---

## Notes for the administrator

- All passwords are randomly generated and unique.
- **Student passwords** are 12-character random strings. ECD teachers typically log in on behalf of young children.
- **Teacher passwords** are 12-character random strings. Teachers should change their password after first login.
- To add, edit, or deactivate any account, visit the **/users** page while logged in as \`admin\`.
- To reset a forgotten password, use the "Reset password" button on the /users page — it generates a new random password.
`;

  const outDir = path.resolve(__dirname, "../../../.local");
  mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "school-credentials.md");
  writeFileSync(outPath, doc, "utf8");
  process.stdout.write(`Credentials written to .local/school-credentials.md\n`);
}

resetPasswords()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
