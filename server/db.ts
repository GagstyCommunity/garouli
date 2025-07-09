import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://zolgkqqwjwirqfrhcgox.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvbGdrcXF3andpcnFmcmhjZ294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5ODc4OTcsImV4cCI6MjA2NzU2Mzg5N30.JgSk8Eb9XAVOamF9bEHqQOTicds7zlAc0hqBN5EAudA';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// For direct database queries with Drizzle
const connectionString = process.env.DATABASE_URL || `postgresql://postgres:[YOUR_PASSWORD]@db.zolgkqqwjwirqfrhcgox.supabase.co:5432/postgres`;
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
