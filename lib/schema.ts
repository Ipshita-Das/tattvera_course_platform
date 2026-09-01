import { pgTable, text, timestamp, doublePrecision, integer, boolean, unique } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const courses = pgTable("course", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  price: doublePrecision("price").default(0.0).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
});

export const chapters = pgTable("chapter", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  courseId: text("courseId").notNull().references(() => courses.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
});

export const lessons = pgTable("lesson", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  content: text("content"),
  chapterId: text("chapterId").notNull().references(() => chapters.id, { onDelete: "cascade" }),
  order: integer("order").notNull(),
  isDone: boolean("isDone").default(false).notNull(),
});

export const enrollments = pgTable("enrollment", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  courseId: text("courseId").notNull().references(() => courses.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
}, (t) => ({
  unq: unique().on(t.userId, t.courseId)
}));