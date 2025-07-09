import { 
  users, agencies, courses, courseModules, enrollments, practicals, 
  jobs, jobApplications, badges, userBadges, courseReviews, contributorTasks, blogPosts,
  type User, type InsertUser, type Agency, type Course, type Job, type Practical, type BlogPost
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like, count } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  updateStripeCustomerId(userId: number, customerId: string): Promise<User>;
  updateUserStripeInfo(userId: number, info: { customerId: string, subscriptionId: string }): Promise<User>;
  
  // Agency management
  createAgency(agency: any): Promise<Agency>;
  getAgency(id: number): Promise<Agency | undefined>;
  getAgencyByUserId(userId: number): Promise<Agency | undefined>;
  updateAgency(id: number, updates: Partial<Agency>): Promise<Agency>;
  
  // Course management
  getCourses(filters?: any): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  getCourseBySlug(slug: string): Promise<Course | undefined>;
  createCourse(course: any): Promise<Course>;
  updateCourse(id: number, updates: Partial<Course>): Promise<Course>;
  deleteCourse(id: number): Promise<void>;
  
  // Enrollment management
  enrollUser(userId: number, courseId: number): Promise<any>;
  getUserEnrollments(userId: number): Promise<any[]>;
  updateEnrollmentProgress(userId: number, courseId: number, progress: number): Promise<any>;
  
  // Job management
  getJobs(filters?: any): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: any): Promise<Job>;
  updateJob(id: number, updates: Partial<Job>): Promise<Job>;
  deleteJob(id: number): Promise<void>;
  
  // Practical management
  createPractical(practical: any): Promise<Practical>;
  getUserPracticals(userId: number): Promise<Practical[]>;
  updatePractical(id: number, updates: Partial<Practical>): Promise<Practical>;
  
  // Badges and achievements
  getUserBadges(userId: number): Promise<any[]>;
  awardBadge(userId: number, badgeId: number): Promise<any>;
  
  // Blog management
  getBlogPosts(filters?: any): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: any): Promise<BlogPost>;
  updateBlogPost(id: number, updates: Partial<BlogPost>): Promise<BlogPost>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        role: insertUser.role || "learner",
        xpPoints: 0,
        level: 1,
        streak: 0,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateStripeCustomerId(userId: number, customerId: string): Promise<User> {
    return this.updateUser(userId, { stripeCustomerId: customerId });
  }

  async updateUserStripeInfo(userId: number, info: { customerId: string, subscriptionId: string }): Promise<User> {
    return this.updateUser(userId, { 
      stripeCustomerId: info.customerId, 
      stripeSubscriptionId: info.subscriptionId 
    });
  }

  // Agency methods
  async createAgency(agencyData: any): Promise<Agency> {
    const [agency] = await db
      .insert(agencies)
      .values({
        ...agencyData,
        status: "trial",
        subscriptionTier: "starter",
        trialEndsAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return agency;
  }

  async getAgency(id: number): Promise<Agency | undefined> {
    const [agency] = await db.select().from(agencies).where(eq(agencies.id, id));
    return agency || undefined;
  }

  async getAgencyByUserId(userId: number): Promise<Agency | undefined> {
    const [agency] = await db.select().from(agencies).where(eq(agencies.userId, userId));
    return agency || undefined;
  }

  async updateAgency(id: number, updates: Partial<Agency>): Promise<Agency> {
    const [agency] = await db
      .update(agencies)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(agencies.id, id))
      .returning();
    return agency;
  }

  // Course methods
  async getCourses(filters: any = {}): Promise<Course[]> {
    const result = await db.select().from(courses)
      .where(eq(courses.status, filters.status || "published"))
      .orderBy(desc(courses.createdAt));
    return result;
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async getCourseBySlug(slug: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.slug, slug));
    return course || undefined;
  }

  async createCourse(courseData: any): Promise<Course> {
    const [course] = await db
      .insert(courses)
      .values({
        ...courseData,
        slug: courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        status: "draft",
        rating: "0",
        totalEnrollments: 0,
        xpReward: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return course;
  }

  async updateCourse(id: number, updates: Partial<Course>): Promise<Course> {
    const [course] = await db
      .update(courses)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return course;
  }

  async deleteCourse(id: number): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  // Enrollment methods
  async enrollUser(userId: number, courseId: number): Promise<any> {
    const [enrollment] = await db
      .insert(enrollments)
      .values({
        userId,
        courseId,
        progress: 0,
        enrolledAt: new Date(),
      })
      .returning();
    return enrollment;
  }

  async getUserEnrollments(userId: number): Promise<any[]> {
    return db
      .select({
        enrollment: enrollments,
        course: courses,
      })
      .from(enrollments)
      .leftJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, userId))
      .orderBy(desc(enrollments.enrolledAt));
  }

  async updateEnrollmentProgress(userId: number, courseId: number, progress: number): Promise<any> {
    const [enrollment] = await db
      .update(enrollments)
      .set({ 
        progress,
        completedAt: progress >= 100 ? new Date() : null
      })
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)))
      .returning();
    return enrollment;
  }

  // Job methods
  async getJobs(filters: any = {}): Promise<Job[]> {
    const result = await db.select().from(jobs)
      .where(eq(jobs.status, filters.status || "active"))
      .orderBy(desc(jobs.postedAt));
    return result;
  }

  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  async createJob(jobData: any): Promise<Job> {
    const [job] = await db
      .insert(jobs)
      .values({
        ...jobData,
        slug: jobData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        status: "active",
        applications: 0,
        postedAt: new Date(),
      })
      .returning();
    return job;
  }

  async updateJob(id: number, updates: Partial<Job>): Promise<Job> {
    const [job] = await db
      .update(jobs)
      .set(updates)
      .where(eq(jobs.id, id))
      .returning();
    return job;
  }

  async deleteJob(id: number): Promise<void> {
    await db.delete(jobs).where(eq(jobs.id, id));
  }

  // Practical methods
  async createPractical(practicalData: any): Promise<Practical> {
    const [practical] = await db
      .insert(practicals)
      .values({
        ...practicalData,
        status: "submitted",
        submittedAt: new Date(),
      })
      .returning();
    return practical;
  }

  async getUserPracticals(userId: number): Promise<Practical[]> {
    return db
      .select()
      .from(practicals)
      .where(eq(practicals.userId, userId))
      .orderBy(desc(practicals.submittedAt));
  }

  async updatePractical(id: number, updates: Partial<Practical>): Promise<Practical> {
    const [practical] = await db
      .update(practicals)
      .set(updates)
      .where(eq(practicals.id, id))
      .returning();
    return practical;
  }

  // Badge methods
  async getUserBadges(userId: number): Promise<any[]> {
    return db
      .select({
        userBadge: userBadges,
        badge: badges,
      })
      .from(userBadges)
      .leftJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, userId))
      .orderBy(desc(userBadges.earnedAt));
  }

  async awardBadge(userId: number, badgeId: number): Promise<any> {
    const [userBadge] = await db
      .insert(userBadges)
      .values({
        userId,
        badgeId,
        earnedAt: new Date(),
      })
      .returning();
    return userBadge;
  }

  // Blog methods
  async getBlogPosts(filters: any = {}): Promise<BlogPost[]> {
    const result = await db.select().from(blogPosts)
      .where(eq(blogPosts.status, filters.status || "published"))
      .orderBy(desc(blogPosts.publishedAt));
    return result;
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async createBlogPost(postData: any): Promise<BlogPost> {
    const [post] = await db
      .insert(blogPosts)
      .values({
        ...postData,
        slug: postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        status: "draft",
        viewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return post;
  }

  async updateBlogPost(id: number, updates: Partial<BlogPost>): Promise<BlogPost> {
    const [post] = await db
      .update(blogPosts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return post;
  }
}

export const storage = new DatabaseStorage();
