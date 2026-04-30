/**
 * seed-users.ts
 *
 * One-shot script: creates named teacher and student accounts for Masuka Junior School.
 * Run with:  pnpm --filter @workspace/api-server seed-users
 *
 * - Generates a cryptographically random password for every account.
 * - Skips any username that already exists (fully idempotent).
 * - Writes credentials ONLY to .local/school-credentials.md (not stdout).
 * - No passwords appear in source code or terminal output.
 */
import { db, usersTable } from "@workspace/db";
import bcrypt from "bcryptjs";
import { eq, notInArray } from "drizzle-orm";
import { randomBytes } from "node:crypto";
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const AVATAR_COLORS = [
  "#F59E0B", "#10B981", "#0EA5E9", "#EC4899",
  "#8B5CF6", "#EF4444", "#F97316", "#06B6D4",
];

function pickColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

/** Generate a random password with mixed case, digits, and symbols. */
function generatePassword(length = 12): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
  const bytes = randomBytes(length);
  return Array.from(bytes).map((b) => chars[b % chars.length]).join("");
}

async function userExists(username: string): Promise<boolean> {
  const [row] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.username, username))
    .limit(1);
  return !!row;
}

interface AccountSpec {
  fullName: string;
  username: string;
  role: "teacher" | "student";
  classLevel?: string;
}

const TEACHERS: AccountSpec[] = [
  { fullName: "Mrs. T. Chiweshe", username: "mrs.chiweshe", role: "teacher" },
  { fullName: "Mrs. R. Moyo",     username: "mrs.moyo",     role: "teacher" },
];

const ECD_A_STUDENTS: AccountSpec[] = [
  { fullName: "Ruvimbo Mutasa",    username: "ruvimbo.mutasa",    role: "student", classLevel: "ECD A" },
  { fullName: "Takudzwa Banda",    username: "takudzwa.banda",    role: "student", classLevel: "ECD A" },
  { fullName: "Chipo Marange",     username: "chipo.marange",     role: "student", classLevel: "ECD A" },
  { fullName: "Farai Sibanda",     username: "farai.sibanda",     role: "student", classLevel: "ECD A" },
  { fullName: "Tafadzwa Nhamo",    username: "tafadzwa.nhamo",    role: "student", classLevel: "ECD A" },
  { fullName: "Nyasha Chipanga",   username: "nyasha.chipanga",   role: "student", classLevel: "ECD A" },
  { fullName: "Simbarashe Dube",   username: "simbarashe.dube",   role: "student", classLevel: "ECD A" },
  { fullName: "Tariro Mhike",      username: "tariro.mhike",      role: "student", classLevel: "ECD A" },
  { fullName: "Tinashe Zvenyika",  username: "tinashe.zvenyika",  role: "student", classLevel: "ECD A" },
  { fullName: "Kudakwashe Makoni", username: "kudakwashe.makoni", role: "student", classLevel: "ECD A" },
];

const ECD_B_STUDENTS: AccountSpec[] = [
  { fullName: "Mazvita Chauke",     username: "mazvita.chauke",     role: "student", classLevel: "ECD B" },
  { fullName: "Tanatswa Chirwa",    username: "tanatswa.chirwa",    role: "student", classLevel: "ECD B" },
  { fullName: "Blessing Ndlovu",    username: "blessing.ndlovu",    role: "student", classLevel: "ECD B" },
  { fullName: "Rutendo Dziva",      username: "rutendo.dziva",      role: "student", classLevel: "ECD B" },
  { fullName: "Tinevimbo Chiremba", username: "tinevimbo.chiremba", role: "student", classLevel: "ECD B" },
  { fullName: "Panashe Mupfurutsa", username: "panashe.mupfurutsa", role: "student", classLevel: "ECD B" },
  { fullName: "Vimbai Mangena",     username: "vimbai.mangena",     role: "student", classLevel: "ECD B" },
  { fullName: "Anashe Chirume",     username: "anashe.chirume",     role: "student", classLevel: "ECD B" },
  { fullName: "Kudzai Machakaire",  username: "kudzai.machakaire",  role: "student", classLevel: "ECD B" },
  { fullName: "Tatenda Gwenzi",     username: "tatenda.gwenzi",     role: "student", classLevel: "ECD B" },
];

const ALL_ACCOUNTS: AccountSpec[] = [...TEACHERS, ...ECD_A_STUDENTS, ...ECD_B_STUDENTS];

interface CreatedAccount {
  spec: AccountSpec;
  password: string;
  skipped: boolean;
}

async function createAccounts(): Promise<CreatedAccount[]> {
  const results: CreatedAccount[] = [];

  for (let i = 0; i < ALL_ACCOUNTS.length; i++) {
    const spec = ALL_ACCOUNTS[i];
    if (await userExists(spec.username)) {
      process.stdout.write(`SKIP  ${spec.username} (already exists)\n`);
      results.push({ spec, password: "", skipped: true });
      continue;
    }
    const password = generatePassword();
    const passwordHash = await bcrypt.hash(password, 10);
    await db.insert(usersTable).values({
      username: spec.username,
      passwordHash,
      fullName: spec.fullName,
      role: spec.role,
      classLevel: spec.classLevel ?? null,
      avatarColor: pickColor(i),
      isActive: true,
    });
    process.stdout.write(`OK    ${spec.username}\n`);
    results.push({ spec, password, skipped: false });
  }

  return results;
}

async function getOtherAccounts(seededUsernames: string[]): Promise<{ fullName: string; username: string; role: string; classLevel: string | null }[]> {
  return db
    .select({ fullName: usersTable.fullName, username: usersTable.username, role: usersTable.role, classLevel: usersTable.classLevel })
    .from(usersTable)
    .where(notInArray(usersTable.username, [...seededUsernames, "admin"]))
    .orderBy(usersTable.role, usersTable.fullName);
}

async function writeCredentials(accounts: CreatedAccount[]): Promise<void> {
  const created = accounts.filter((a) => !a.skipped);
  const skipped = accounts.filter((a) => a.skipped);
  const teachers = created.filter((a) => a.spec.role === "teacher");
  const ecdA = created.filter((a) => a.spec.classLevel === "ECD A");
  const ecdB = created.filter((a) => a.spec.classLevel === "ECD B");
  const today = new Date().toISOString().slice(0, 10);

  const rows = (list: CreatedAccount[]) =>
    list.map(({ spec, password }) =>
      `| ${spec.fullName} | \`${spec.username}\` | \`${password}\` |`
    ).join("\n");

  const seededUsernames = accounts.map((a) => a.spec.username);
  const others = await getOtherAccounts(seededUsernames);

  const otherRows = others.length > 0
    ? others.map((u) => `| ${u.fullName} | \`${u.username}\` | ${u.role}${u.classLevel ? ` — ${u.classLevel}` : ""} |`).join("\n")
    : "| *(none)* | | |";

  const skippedNote = skipped.length > 0
    ? `\n> **Note:** ${skipped.length} account(s) already existed and were not re-created: ` +
      skipped.map((a) => `\`${a.spec.username}\``).join(", ") +
      `.\n> Run \`pnpm --filter @workspace/api-server reset-seeded-passwords\` to get fresh passwords for those accounts.\n`
    : "";

  const doc = `# Masuka Junior School — Account Credentials
**Date created:** ${today}
**CONFIDENTIAL — keep this file secure and do not share it publicly.**

The admin panel for managing users is at: **/users** (log in as \`admin\` first).
${skippedNote}
---

## Teachers (newly created this run)

| Full Name | Username | Password |
|---|---|---|
${teachers.length > 0 ? rows(teachers) : "| *(all already existed — run reset-seeded-passwords)* | | |"}

---

## ECD A Students (newly created this run)

| Full Name | Username | Password |
|---|---|---|
${ecdA.length > 0 ? rows(ecdA) : "| *(all already existed — run reset-seeded-passwords)* | | |"}

---

## ECD B Students (newly created this run)

| Full Name | Username | Password |
|---|---|---|
${ecdB.length > 0 ? rows(ecdB) : "| *(all already existed — run reset-seeded-passwords)* | | |"}

---

## Other accounts in the database (not managed by this script)

These accounts exist in the database but are not part of the named roster above.
Use the **/users** admin page to reset their passwords individually.

| Full Name | Username | Role |
|---|---|---|
${otherRows}

---

## Notes for the administrator

- All passwords are 12-character random strings (no patterns or predictable sequences).
- **Student passwords** — ECD teachers typically log in on behalf of young children.
- **Teacher passwords** — Teachers should change their password after first login.
- To add, edit, or deactivate any account, visit the **/users** page while logged in as \`admin\`.
- To reset a forgotten password, use the "Reset password" button on the /users page.
`;

  const outDir = path.resolve(__dirname, "../../../.local");
  mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "school-credentials.md");
  writeFileSync(outPath, doc, "utf8");
  process.stdout.write(`\nCredentials written to .local/school-credentials.md\n`);
}

async function main() {
  const accounts = await createAccounts();
  const created = accounts.filter((a) => !a.skipped).length;
  process.stdout.write(`\n${created} accounts created, ${accounts.length - created} skipped.\n`);
  await writeCredentials(accounts);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
