import { createClient } from '@supabase/supabase-js';
import type { Database } from '../client/src/integrations/supabase/types';

const supabaseUrl = process.env.SUPABASE_URL?.startsWith('http') 
  ? process.env.SUPABASE_URL 
  : 'https://zolgkqqwjwirqfrhcgox.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);