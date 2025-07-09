import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table with enhanced fields
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("learner"), // learner, instructor, admin, agency, contributor
  firstName: text("first_name"),
  lastName: text("last_name"),
  avatar: text("avatar"),
  bio: text("bio"),
  country: text("country"),
  xpPoints: integer("xp_points").default(0),
  level: integer("level").default(1),
  streak: integer("streak").default(0),
  lastLoginAt: timestamp("last_login_at"),
  isVerified: boolean("is_verified").default(false),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  referralCode: text("referral_code").unique(),
  referredBy: text("referred_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Agencies table
export const agencies = pgTable("agencies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  companyName: text("company_name").notNull(),
  website: text("website"),
  description: text("description"),
  logo: text("logo"),
  industry: text("industry"),
  size: text("size"), // startup, small, medium, large, enterprise
  status: text("status").default("trial"), // trial, active, suspended, cancelled
  subscriptionTier: text("subscription_tier").default("starter"), // starter, growth, enterprise
  trialEndsAt: timestamp("trial_ends_at"),
  billingCycle: text("billing_cycle").default("monthly"), // monthly, yearly
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Courses table
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  category: text("category").notNull(),
  level: text("level").notNull(), // beginner, intermediate, expert
  duration: integer("duration"), // in minutes
  price: decimal("price", { precision: 10, scale: 2 }).default("0"),
  instructorId: integer("instructor_id").references(() => users.id),
  agencyId: integer("agency_id").references(() => agencies.id),
  status: text("status").default("draft"), // draft, published, archived
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  totalEnrollments: integer("total_enrollments").default(0),
  xpReward: integer("xp_reward").default(100),
  tags: text("tags").array(),
  requirements: text("requirements").array(),
  learningOutcomes: text("learning_outcomes").array(),
  isSponsored: boolean("is_sponsored").default(false),
  sponsorId: integer("sponsor_id").references(() => agencies.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course modules table
export const courseModules = pgTable("course_modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull(),
  duration: integer("duration"), // in minutes
  videoUrl: text("video_url"),
  content: text("content"), // markdown content
  xpReward: integer("xp_reward").default(20),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quizzes table
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").references(() => courseModules.id).notNull(),
  title: text("title").notNull(),
  questions: json("questions"), // array of question objects
  passingScore: integer("passing_score").default(70),
  xpReward: integer("xp_reward").default(50),
  createdAt: timestamp("created_at").defaultNow(),
});

// Course enrollments
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  progress: integer("progress").default(0), // percentage
  completedAt: timestamp("completed_at"),
  certificateUrl: text("certificate_url"),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
});

// Practical submissions
export const practicals = pgTable("practicals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  moduleId: integer("module_id").references(() => courseModules.id),
  title: text("title").notNull(),
  description: text("description"),
  submissionUrl: text("submission_url").notNull(),
  githubUrl: text("github_url"),
  status: text("status").default("submitted"), // submitted, approved, featured, rejected
  score: integer("score"),
  feedback: text("feedback"),
  isUrlValid: boolean("is_url_valid"),
  isFeatured: boolean("is_featured").default(false),
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

// Jobs table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  agencyId: integer("agency_id").references(() => agencies.id).notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  requirements: text("requirements").array(),
  benefits: text("benefits").array(),
  location: text("location"),
  type: text("type").notNull(), // full-time, part-time, contract, internship
  remote: boolean("remote").default(false),
  salary: text("salary"),
  experience: text("experience"), // entry, mid, senior
  skills: text("skills").array(),
  status: text("status").default("active"), // active, closed, draft
  applications: integer("applications").default(0),
  postedAt: timestamp("posted_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

// Job applications
export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  resume: text("resume"),
  coverLetter: text("cover_letter"),
  portfolio: text("portfolio"),
  status: text("status").default("pending"), // pending, reviewed, accepted, rejected
  appliedAt: timestamp("applied_at").defaultNow(),
});

// Badges and achievements
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  type: text("type").notNull(), // course_completion, streak, practical, contribution
  criteria: json("criteria"), // conditions for earning
  xpReward: integer("xp_reward").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User badges (earned badges)
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  badgeId: integer("badge_id").references(() => badges.id).notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Course reviews
export const courseReviews = pgTable("course_reviews", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  rating: integer("rating").notNull(), // 1-5
  review: text("review"),
  isVerified: boolean("is_verified").default(false), // verified completion
  createdAt: timestamp("created_at").defaultNow(),
});

// Contributor tasks
export const contributorTasks = pgTable("contributor_tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // development, content, design, marketing
  difficulty: text("difficulty").default("medium"), // easy, medium, hard
  xpReward: integer("xp_reward").default(100),
  status: text("status").default("open"), // open, assigned, in_progress, completed, cancelled
  assignedTo: integer("assigned_to").references(() => users.id),
  createdBy: integer("created_by").references(() => users.id),
  submissionUrl: text("submission_url"),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow(),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
});

// Blog posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  thumbnail: text("thumbnail"),
  authorId: integer("author_id").references(() => users.id).notNull(),
  category: text("category"),
  tags: text("tags").array(),
  status: text("status").default("draft"), // draft, published, archived
  isSticky: boolean("is_sticky").default(false),
  viewCount: integer("view_count").default(0),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ many, one }) => ({
  enrollments: many(enrollments),
  practicals: many(practicals),
  userBadges: many(userBadges),
  courseReviews: many(courseReviews),
  agency: one(agencies, {
    fields: [users.id],
    references: [agencies.userId],
  }),
}));

export const agenciesRelations = relations(agencies, ({ one, many }) => ({
  user: one(users, {
    fields: [agencies.userId],
    references: [users.id],
  }),
  courses: many(courses),
  jobs: many(jobs),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  instructor: one(users, {
    fields: [courses.instructorId],
    references: [users.id],
  }),
  agency: one(agencies, {
    fields: [courses.agencyId],
    references: [agencies.id],
  }),
  modules: many(courseModules),
  enrollments: many(enrollments),
  reviews: many(courseReviews),
}));

export const courseModulesRelations = relations(courseModules, ({ one, many }) => ({
  course: one(courses, {
    fields: [courseModules.courseId],
    references: [courses.id],
  }),
  quizzes: many(quizzes),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  role: true,
  bio: true,
  country: true,
});

export const insertAgencySchema = createInsertSchema(agencies).pick({
  companyName: true,
  website: true,
  description: true,
  industry: true,
  size: true,
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  title: true,
  description: true,
  category: true,
  level: true,
  price: true,
  tags: true,
  requirements: true,
  learningOutcomes: true,
});

export const insertJobSchema = createInsertSchema(jobs).pick({
  title: true,
  description: true,
  requirements: true,
  benefits: true,
  location: true,
  type: true,
  remote: true,
  salary: true,
  experience: true,
  skills: true,
});

export const insertPracticalSchema = createInsertSchema(practicals).pick({
  title: true,
  description: true,
  submissionUrl: true,
  githubUrl: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  excerpt: true,
  content: true,
  category: true,
  tags: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Agency = typeof agencies.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type CourseModule = typeof courseModules.$inferSelect;
export type Enrollment = typeof enrollments.$inferSelect;
export type Practical = typeof practicals.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type JobApplication = typeof jobApplications.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type UserBadge = typeof userBadges.$inferSelect;
export type CourseReview = typeof courseReviews.$inferSelect;
export type ContributorTask = typeof contributorTasks.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
