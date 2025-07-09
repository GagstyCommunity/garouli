import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";
import { insertUserSchema, insertAgencySchema, insertCourseSchema, insertJobSchema, insertPracticalSchema, insertBlogPostSchema } from "@shared/schema";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {

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

  const httpServer = createServer(app);
  return httpServer;
}
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { db } from "./db";
import { seedDatabase } from "./seed";

const app = new Hono().basePath("/api");

// Seed database endpoint
app.post("/seed", async (c) => {
  try {
    await seedDatabase();
    return c.json({ 
      success: true, 
      message: "Database seeded successfully with comprehensive dummy data!" 
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return c.json({ 
      success: false, 
      error: "Failed to seed database",
      details: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "healthy", timestamp: new Date().toISOString() });
});

export const runtime = "edge";
export default handle(app);