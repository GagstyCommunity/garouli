import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";
import { insertUserSchema, insertAgencySchema, insertCourseSchema, insertJobSchema, insertPracticalSchema, insertBlogPostSchema } from "@shared/schema";
import { db } from "./db";
import { 
  users, agencies, courses, courseModules, quizzes, enrollments, 
  practicals, jobs, jobApplications, badges, userBadges, 
  courseReviews, contributorTasks, blogPosts 
} from "@shared/schema";
import { eq, desc, asc, like, and } from "drizzle-orm";
import bcrypt from "bcryptjs";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {

  // Basic health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

      if (user.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user[0].password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const { password: _, ...userWithoutPassword } = user[0];
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, username, password, firstName, lastName, role = 'learner' } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await db.insert(users).values({
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        referralCode: `${username.toUpperCase()}${Math.random().toString(36).substr(2, 3)}`
      }).returning();

      const { password: _, ...userWithoutPassword } = newUser[0];
      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // Users routes
  app.get("/api/users", async (req, res) => {
    try {
      const allUsers = await db.select({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        avatar: users.avatar,
        bio: users.bio,
        country: users.country,
        xpPoints: users.xpPoints,
        level: users.level,
        streak: users.streak,
        isVerified: users.isVerified,
        createdAt: users.createdAt
      }).from(users);
      res.json(allUsers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await db.select().from(users).where(eq(users.id, parseInt(req.params.id))).limit(1);
      if (user.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = user[0];
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Courses routes
  app.get("/api/courses", async (req, res) => {
    try {
      const { category, level, search } = req.query;
      let query = db.select().from(courses);

      if (category) {
        query = query.where(eq(courses.category, category as string));
      }
      if (level) {
        query = query.where(eq(courses.level, level as string));
      }
      if (search) {
        query = query.where(like(courses.title, `%${search}%`));
      }

      const allCourses = await query.orderBy(desc(courses.totalEnrollments));
      res.json(allCourses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await db.select().from(courses).where(eq(courses.id, parseInt(req.params.id))).limit(1);
      if (course.length === 0) {
        return res.status(404).json({ error: "Course not found" });
      }

      // Get course modules
      const modules = await db.select().from(courseModules)
        .where(eq(courseModules.courseId, parseInt(req.params.id)))
        .orderBy(asc(courseModules.orderIndex));

      // Get course reviews
      const reviews = await db.select().from(courseReviews)
        .where(eq(courseReviews.courseId, parseInt(req.params.id)))
        .orderBy(desc(courseReviews.createdAt));

      res.json({ ...course[0], modules, reviews });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });

  // Enrollments routes
  app.get("/api/enrollments/user/:userId", async (req, res) => {
    try {
      const userEnrollments = await db.select().from(enrollments)
        .where(eq(enrollments.userId, parseInt(req.params.userId)));
      res.json(userEnrollments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch enrollments" });
    }
  });

  app.post("/api/enrollments", async (req, res) => {
    try {
      const { userId, courseId } = req.body;
      const newEnrollment = await db.insert(enrollments).values({
        userId,
        courseId,
        progress: 0
      }).returning();
      res.status(201).json(newEnrollment[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to create enrollment" });
    }
  });

  // Jobs routes
  app.get("/api/jobs", async (req, res) => {
    try {
      const { type, remote, experience } = req.query;
      let query = db.select().from(jobs);

      if (type) {
        query = query.where(eq(jobs.type, type as string));
      }
      if (remote !== undefined) {
        query = query.where(eq(jobs.remote, remote === 'true'));
      }
      if (experience) {
        query = query.where(eq(jobs.experience, experience as string));
      }

      const allJobs = await query.where(eq(jobs.status, 'active')).orderBy(desc(jobs.postedAt));
      res.json(allJobs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await db.select().from(jobs).where(eq(jobs.id, parseInt(req.params.id))).limit(1);
      if (job.length === 0) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json(job[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  // Job applications routes
  app.post("/api/job-applications", async (req, res) => {
    try {
      const { jobId, userId, resume, coverLetter, portfolio } = req.body;
      const newApplication = await db.insert(jobApplications).values({
        jobId,
        userId,
        resume,
        coverLetter,
        portfolio,
        status: 'pending'
      }).returning();
      res.status(201).json(newApplication[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit application" });
    }
  });

  // Practicals routes
  app.get("/api/practicals", async (req, res) => {
    try {
      const { userId, courseId, featured } = req.query;
      let query = db.select().from(practicals);

      if (userId) {
        query = query.where(eq(practicals.userId, parseInt(userId as string)));
      }
      if (courseId) {
        query = query.where(eq(practicals.courseId, parseInt(courseId as string)));
      }
      if (featured === 'true') {
        query = query.where(eq(practicals.isFeatured, true));
      }

      const allPracticals = await query.orderBy(desc(practicals.submittedAt));
      res.json(allPracticals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch practicals" });
    }
  });

  app.post("/api/practicals", async (req, res) => {
    try {
      const { userId, courseId, moduleId, title, description, submissionUrl, githubUrl } = req.body;
      const newPractical = await db.insert(practicals).values({
        userId,
        courseId,
        moduleId,
        title,
        description,
        submissionUrl,
        githubUrl,
        status: 'submitted',
        isUrlValid: true
      }).returning();
      res.status(201).json(newPractical[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit practical" });
    }
  });

  // Badges routes
  app.get("/api/badges", async (req, res) => {
    try {
      const allBadges = await db.select().from(badges).where(eq(badges.isActive, true));
      res.json(allBadges);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch badges" });
    }
  });

  app.get("/api/user-badges/:userId", async (req, res) => {
    try {
      const userBadgesList = await db.select().from(userBadges)
        .where(eq(userBadges.userId, parseInt(req.params.userId)));
      res.json(userBadgesList);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user badges" });
    }
  });

  // Blog routes
  app.get("/api/blog", async (req, res) => {
    try {
      const { category, featured } = req.query;
      let query = db.select().from(blogPosts);

      if (category) {
        query = query.where(eq(blogPosts.category, category as string));
      }
      if (featured === 'true') {
        query = query.where(eq(blogPosts.isSticky, true));
      }

      const posts = await query.where(eq(blogPosts.status, 'published'))
        .orderBy(desc(blogPosts.publishedAt));
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await db.select().from(blogPosts)
        .where(and(eq(blogPosts.slug, req.params.slug), eq(blogPosts.status, 'published')))
        .limit(1);

      if (post.length === 0) {
        return res.status(404).json({ error: "Blog post not found" });
      }

      // Increment view count
      await db.update(blogPosts)
        .set({ viewCount: post[0].viewCount + 1 })
        .where(eq(blogPosts.id, post[0].id));

      res.json(post[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // Contributor tasks routes
  app.get("/api/contributor-tasks", async (req, res) => {
    try {
      const { status, type } = req.query;
      let query = db.select().from(contributorTasks);

      if (status) {
        query = query.where(eq(contributorTasks.status, status as string));
      }
      if (type) {
        query = query.where(eq(contributorTasks.type, type as string));
      }

      const tasks = await query.orderBy(desc(contributorTasks.createdAt));
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contributor tasks" });
    }
  });

  // Agencies routes
  app.get("/api/agencies", async (req, res) => {
    try {
      const allAgencies = await db.select().from(agencies);
      res.json(allAgencies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agencies" });
    }
  });

  // Course reviews routes
  app.post("/api/course-reviews", async (req, res) => {
    try {
      const { courseId, userId, rating, review } = req.body;
      const newReview = await db.insert(courseReviews).values({
        courseId,
        userId,
        rating,
        review: review,
        isVerified: false
      }).returning();
      res.status(201).json(newReview[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to submit review" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);

      // Get user enrollments
      const userEnrollments = await db.select().from(enrollments)
        .where(eq(enrollments.userId, userId));

      // Get user practicals
      const userPracticals = await db.select().from(practicals)
        .where(eq(practicals.userId, userId));

      // Get user badges
      const userBadgesList = await db.select().from(userBadges)
        .where(eq(userBadges.userId, userId));

      // Get user data
      const user = await db.select().from(users)
        .where(eq(users.id, userId)).limit(1);

      const stats = {
        totalCourses: userEnrollments.length,
        completedCourses: userEnrollments.filter(e => e.progress === 100).length,
        totalXP: user[0]?.xpPoints || 0,
        currentLevel: user[0]?.level || 1,
        streak: user[0]?.streak || 0,
        practicalSubmissions: userPracticals.length,
        badgesEarned: userBadgesList.length,
        averageProgress: userEnrollments.length > 0 
          ? Math.round(userEnrollments.reduce((sum, e) => sum + e.progress, 0) / userEnrollments.length)
          : 0
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // ============= USER MANAGEMENT API =============

  // Get user profile
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update user profile
  app.put("/api/users/:id", async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(parseInt(req.params.id), updates);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get user enrollments
  app.get("/api/users/:id/enrollments", async (req, res) => {
    try {
      const enrollments = await storage.getUserEnrollments(parseInt(req.params.id));
      res.json(enrollments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get user practicals
  app.get("/api/users/:id/practicals", async (req, res) => {
    try {
      const practicals = await storage.getUserPracticals(parseInt(req.params.id));
      res.json(practicals);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get user badges
  app.get("/api/users/:id/badges", async (req, res) => {
    try {
      const badges = await storage.getUserBadges(parseInt(req.params.id));
      res.json(badges);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= COURSE MANAGEMENT API =============

  // Get all courses
  app.get("/api/courses", async (req, res) => {
    try {
      const filters = req.query;
      const courses = await storage.getCourses(filters);
      res.json(courses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get course by ID
  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(parseInt(req.params.id));
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.json(course);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create course
  app.post("/api/courses", async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Update course
  app.put("/api/courses/:id", async (req, res) => {
    try {
      const updates = req.body;
      const course = await storage.updateCourse(parseInt(req.params.id), updates);
      res.json(course);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete course
  app.delete("/api/courses/:id", async (req, res) => {
    try {
      await storage.deleteCourse(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Enroll in course
  app.post("/api/courses/:id/enroll", async (req, res) => {
    try {
      const { userId } = req.body;
      const enrollment = await storage.enrollUser(userId, parseInt(req.params.id));
      res.status(201).json(enrollment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Update course progress
  app.put("/api/courses/:id/progress", async (req, res) => {
    try {
      const { userId, progress } = req.body;
      const enrollment = await storage.updateEnrollmentProgress(userId, parseInt(req.params.id), progress);
      res.json(enrollment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= AGENCY MANAGEMENT API =============

  // Get agency profile
  app.get("/api/agencies/:id", async (req, res) => {
    try {
      const agency = await storage.getAgency(parseInt(req.params.id));
      if (!agency) {
        return res.status(404).json({ error: "Agency not found" });
      }
      res.json(agency);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Agency registration with Stripe
  app.post("/api/agencies/register", async (req, res) => {
    try {
      const { userData, agencyData, paymentMethodId } = req.body;

      // Create user first
      const user = await storage.createUser({ ...userData, role: "agency" });

      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: { userId: user.id.toString() }
      });

      // Setup trial subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ 
          price_data: {
            currency: 'usd',
            product_data: { name: 'Minutely AI Academy - Agency Starter' },
            unit_amount: 19900, // $199
            recurring: { interval: 'month' }
          }
        }],
        trial_period_days: 90,
        default_payment_method: paymentMethodId,
        expand: ['latest_invoice.payment_intent'],
      });

      // Update user with Stripe info
      await storage.updateUserStripeInfo(user.id, {
        customerId: customer.id,
        subscriptionId: subscription.id
      });

      // Create agency
      const agency = await storage.createAgency({
        ...agencyData,
        userId: user.id,
        status: "trial",
        trialEndsAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      });

      res.status(201).json({ user, agency, subscription: subscription.id });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Update agency profile
  app.put("/api/agencies/:id", async (req, res) => {
    try {
      const updates = req.body;
      const agency = await storage.updateAgency(parseInt(req.params.id), updates);
      res.json(agency);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= JOB MANAGEMENT API =============

  // Get all jobs
  app.get("/api/jobs", async (req, res) => {
    try {
      const filters = req.query;
      const jobs = await storage.getJobs(filters);
      res.json(jobs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get job by ID
  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(parseInt(req.params.id));
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json(job);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create job
  app.post("/api/jobs", async (req, res) => {
    try {
      const jobData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(jobData);
      res.status(201).json(job);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Update job
  app.put("/api/jobs/:id", async (req, res) => {
    try {
      const updates = req.body;
      const job = await storage.updateJob(parseInt(req.params.id), updates);
      res.json(job);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete job
  app.delete("/api/jobs/:id", async (req, res) => {
    try {
      await storage.deleteJob(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= PRACTICAL SUBMISSIONS API =============

  // Submit practical
  app.post("/api/practicals", async (req, res) => {
    try {
      const practicalData = insertPracticalSchema.parse(req.body);
      const practical = await storage.createPractical(practicalData);
      res.status(201).json(practical);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Update practical
  app.put("/api/practicals/:id", async (req, res) => {
    try {
      const updates = req.body;
      const practical = await storage.updatePractical(parseInt(req.params.id), updates);
      res.json(practical);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= BLOG/CMS API =============

  // Get blog posts
  app.get("/api/blog", async (req, res) => {
    try {
      const filters = req.query;
      const posts = await storage.getBlogPosts(filters);
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get blog post by ID
  app.get("/api/blog/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(parseInt(req.params.id));
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create blog post
  app.post("/api/blog", async (req, res) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(postData);
      res.status(201).json(post);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Update blog post
  app.put("/api/blog/:id", async (req, res) => {
    try {
      const updates = req.body;
      const post = await storage.updateBlogPost(parseInt(req.params.id), updates);
      res.json(post);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= STRIPE PAYMENT API =============

  // Create payment intent for one-time payments
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create or retrieve subscription
  app.post('/api/get-or-create-subscription', async (req, res) => {
    try {
      const { userId } = req.body;
      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        return res.json({
          subscriptionId: subscription.id,
          clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
        });
      }

      // Create new subscription
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.username,
      });

      await storage.updateStripeCustomerId(user.id, customer.id);

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price_data: {
            currency: 'usd',
            product_data: { name: 'Minutely AI Academy Premium' },
            unit_amount: 1999, // $19.99
            recurring: { interval: 'month' }
          }
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      await storage.updateUserStripeInfo(user.id, {
        customerId: customer.id,
        subscriptionId: subscription.id
      });

      res.json({
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const server = createServer(app);
  return server;
}