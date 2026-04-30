import { pgTable, text, integer, timestamp, uuid, jsonb, boolean } from "drizzle-orm/pg-core";

export type Attachment = {
  url: string;
  name: string;
  mimeType: string;
  kind: "image" | "audio" | "video" | "file";
  size?: number | null;
};

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role", { enum: ["student", "teacher", "admin"] }).notNull(),
  classLevel: text("class_level"),
  avatarColor: text("avatar_color"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const sessionsTable = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const lessonsTable = pgTable("lessons", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  classLevel: text("class_level").notNull(),
  youtubeId: text("youtube_id").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  description: text("description").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  milestone: text("milestone"),
  content: text("content"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const storiesTable = pgTable("stories", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  emoji: text("emoji").notNull(),
  classLevel: text("class_level").notNull(),
  summary: text("summary").notNull(),
  body: text("body").notNull(),
  moral: text("moral"),
  readMinutes: integer("read_minutes").notNull().default(3),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const assignmentsTable = pgTable("assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  classLevel: text("class_level").notNull(),
  dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
  instructions: text("instructions").notNull(),
  lessonId: uuid("lesson_id").references(() => lessonsTable.id, { onDelete: "set null" }),
  createdById: uuid("created_by_id").references(() => usersTable.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const materialsTable = pgTable("materials", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size"),
  subject: text("subject"),
  classLevel: text("class_level"),
  uploadedById: uuid("uploaded_by_id").references(() => usersTable.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const submissionsTable = pgTable("submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  assignmentId: uuid("assignment_id").notNull().references(() => assignmentsTable.id, { onDelete: "cascade" }),
  studentId: uuid("student_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  attachmentUrl: text("attachment_url"),
  attachments: jsonb("attachments").$type<Attachment[]>().default([]).notNull(),
  status: text("status", { enum: ["pending", "graded"] }).notNull().default("pending"),
  grade: text("grade"),
  feedback: text("feedback"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
  gradedAt: timestamp("graded_at", { withTimezone: true }),
});
