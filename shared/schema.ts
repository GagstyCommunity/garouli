import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  full_name: text("full_name"),
  avatar_url: text("avatar_url"),
  created_at: timestamp("created_at").defaultNow(),
});

// Quiz Attempts tracking
export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  course_id: text("course_id").notNull(),
  module_id: text("module_id").notNull(),
  attempt_number: integer("attempt_number").notNull(),
  score: integer("score").notNull(),
  total_questions: integer("total_questions").notNull(),
  passed: boolean("passed").notNull(),
  answers: json("answers"), // Store user answers
  started_at: timestamp("started_at").defaultNow(),
  completed_at: timestamp("completed_at"),
});

// Certificates
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  course_id: text("course_id").notNull(),
  certificate_url: text("certificate_url"),
  verification_hash: text("verification_hash").notNull(),
  issued_at: timestamp("issued_at").defaultNow(),
  linkedin_shared: boolean("linkedin_shared").default(false),
});

// Badges
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  badge_type: text("badge_type").notNull(), // course_completion, quiz_master, streak_learner, etc.
  badge_name: text("badge_name").notNull(),
  badge_description: text("badge_description"),
  badge_icon: text("badge_icon"),
  earned_at: timestamp("earned_at").defaultNow(),
  course_id: text("course_id"), // Optional, for course-specific badges
});

// Course Progress
export const courseProgress = pgTable("course_progress", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(),
  course_id: text("course_id").notNull(),
  module_id: text("module_id").notNull(),
  completed: boolean("completed").default(false),
  completion_percentage: integer("completion_percentage").default(0),
  time_spent_minutes: integer("time_spent_minutes").default(0),
  last_accessed: timestamp("last_accessed").defaultNow(),
});

// Practical Assignments
export const practicalAssignments = pgTable("practical_assignments", {
  id: serial("id").primaryKey(),
  course_id: text("course_id").notNull(),
  module_id: text("module_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  instructions: text("instructions"),
  submission_format: text("submission_format"), // code, file, url, text
  max_score: integer("max_score").default(100),
  created_at: timestamp("created_at").defaultNow(),
});

// Assignment Submissions
export const assignmentSubmissions = pgTable("assignment_submissions", {
  id: serial("id").primaryKey(),
  assignment_id: integer("assignment_id").notNull(),
  user_id: integer("user_id").notNull(),
  submission_content: text("submission_content"),
  submission_url: text("submission_url"),
  score: integer("score"),
  feedback: text("feedback"),
  submitted_at: timestamp("submitted_at").defaultNow(),
  reviewed_at: timestamp("reviewed_at"),
  reviewed_by: integer("reviewed_by"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  full_name: true,
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({
  id: true,
  started_at: true,
});

export const insertCertificateSchema = createInsertSchema(certificates).omit({
  id: true,
  issued_at: true,
});

export const insertBadgeSchema = createInsertSchema(badges).omit({
  id: true,
  earned_at: true,
});

export const insertCourseProgressSchema = createInsertSchema(courseProgress).omit({
  id: true,
  last_accessed: true,
});

export const insertPracticalAssignmentSchema = createInsertSchema(practicalAssignments).omit({
  id: true,
  created_at: true,
});

export const insertAssignmentSubmissionSchema = createInsertSchema(assignmentSubmissions).omit({
  id: true,
  submitted_at: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type CourseProgress = typeof courseProgress.$inferSelect;
export type PracticalAssignment = typeof practicalAssignments.$inferSelect;
export type AssignmentSubmission = typeof assignmentSubmissions.$inferSelect;
