import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { supabaseAdmin } from "./supabase";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return res.status(401).json({ error: error.message });
      }

      res.json({ user: data.user, session: data.session });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/auth/logout', async (req, res) => {
    try {
      const { data, error } = await supabaseAdmin.auth.signOut();
      
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Admin role check route
  app.get('/api/auth/admin-check/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      
      const { data, error } = await supabaseAdmin
        .from('admins')
        .select('role, is_active')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return res.json({ isAdmin: false });
      }

      res.json({ isAdmin: true, role: data.role });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
