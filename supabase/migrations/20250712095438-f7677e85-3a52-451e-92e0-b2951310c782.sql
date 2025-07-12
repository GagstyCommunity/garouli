
-- Create enhanced admin roles and permissions system
CREATE TYPE admin_role AS ENUM ('superadmin', 'admin', 'moderator', 'editor', 'verifier');

-- Enhanced admins table with granular permissions
DROP TABLE IF EXISTS public.admins CASCADE;
CREATE TABLE public.admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role admin_role NOT NULL DEFAULT 'moderator',
  permissions JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id)
);

-- Hackathons table for hackathon management
CREATE TABLE public.hackathons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  brief TEXT,
  rules TEXT,
  theme TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  submission_deadline TIMESTAMP WITH TIME ZONE,
  judging_deadline TIMESTAMP WITH TIME ZONE,
  max_participants INTEGER,
  prize_pool DECIMAL(10,2),
  prize_tiers JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft',
  cover_image TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Hackathon submissions
CREATE TABLE public.hackathon_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hackathon_id UUID REFERENCES public.hackathons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  team_name TEXT,
  project_title TEXT NOT NULL,
  description TEXT,
  demo_url TEXT,
  code_url TEXT,
  presentation_url TEXT,
  ai_analysis JSONB,
  judge_scores JSONB DEFAULT '{}',
  public_votes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'submitted',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(hackathon_id, user_id)
);

-- Communities table for community management
CREATE TABLE public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  tags TEXT[],
  cover_image TEXT,
  icon_image TEXT,
  created_by UUID REFERENCES auth.users(id),
  moderators UUID[],
  member_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  visibility TEXT DEFAULT 'public',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Community posts
CREATE TABLE public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  post_type TEXT DEFAULT 'discussion',
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  is_flagged BOOLEAN DEFAULT false,
  flag_reason TEXT,
  ai_moderation_score DECIMAL(3,2),
  status TEXT DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Events table for event management
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  event_type TEXT DEFAULT 'online',
  location TEXT,
  event_url TEXT,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  cover_image TEXT,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  tags TEXT[],
  certificate_enabled BOOLEAN DEFAULT false,
  certificate_template TEXT,
  host_id UUID REFERENCES auth.users(id),
  host_type TEXT DEFAULT 'admin',
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Event speakers
CREATE TABLE public.event_speakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  photo_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  talk_title TEXT,
  talk_duration INTEGER,
  speaking_order INTEGER DEFAULT 0,
  is_external BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Event participants
CREATE TABLE public.event_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'participant',
  status TEXT DEFAULT 'pending',
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  attended BOOLEAN DEFAULT false,
  certificate_issued BOOLEAN DEFAULT false,
  UNIQUE(event_id, user_id)
);

-- SEO metadata table
CREATE TABLE public.seo_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL UNIQUE,
  title TEXT,
  description TEXT,
  keywords TEXT[],
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  structured_data JSONB,
  is_indexed BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- CMS pages table
CREATE TABLE public.cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  meta_title TEXT,
  meta_description TEXT,
  status TEXT DEFAULT 'draft',
  version INTEGER DEFAULT 1,
  author_id UUID REFERENCES auth.users(id),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Admin activity logs
CREATE TABLE public.admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.admins(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hackathon_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin tables
CREATE POLICY "Admins can manage admin records" ON public.admins
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admins a 
      WHERE a.user_id = auth.uid() 
      AND a.is_active = true 
      AND a.role IN ('superadmin', 'admin')
    )
  );

-- RLS Policies for hackathons
CREATE POLICY "Everyone can view published hackathons" ON public.hackathons
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage hackathons" ON public.hackathons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admins a 
      WHERE a.user_id = auth.uid() AND a.is_active = true
    )
  );

-- RLS Policies for communities
CREATE POLICY "Everyone can view active communities" ON public.communities
  FOR SELECT USING (status = 'active' AND visibility = 'public');

CREATE POLICY "Admins can manage communities" ON public.communities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admins a 
      WHERE a.user_id = auth.uid() AND a.is_active = true
    )
  );

-- RLS Policies for events
CREATE POLICY "Everyone can view published events" ON public.events
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage events" ON public.events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admins a 
      WHERE a.user_id = auth.uid() AND a.is_active = true
    )
  );

-- RLS Policies for SEO and CMS (admin only)
CREATE POLICY "Admins can manage SEO metadata" ON public.seo_metadata
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admins a 
      WHERE a.user_id = auth.uid() 
      AND a.is_active = true 
      AND a.role IN ('superadmin', 'admin', 'editor')
    )
  );

CREATE POLICY "Admins can manage CMS pages" ON public.cms_pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admins a 
      WHERE a.user_id = auth.uid() 
      AND a.is_active = true 
      AND a.role IN ('superadmin', 'admin', 'editor')
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_admins_user_id ON public.admins(user_id);
CREATE INDEX idx_hackathons_status ON public.hackathons(status);
CREATE INDEX idx_hackathons_dates ON public.hackathons(start_date, end_date);
CREATE INDEX idx_communities_status ON public.communities(status);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_dates ON public.events(start_time, end_time);
CREATE INDEX idx_seo_metadata_path ON public.seo_metadata(page_path);
CREATE INDEX idx_cms_pages_slug ON public.cms_pages(slug);
CREATE INDEX idx_admin_logs_admin ON public.admin_activity_logs(admin_id);
CREATE INDEX idx_admin_logs_created ON public.admin_activity_logs(created_at);

-- Enhanced has_admin_role function
CREATE OR REPLACE FUNCTION public.has_admin_role(_user_id uuid, _role admin_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins
    WHERE user_id = _user_id
      AND role = _role
      AND is_active = true
  )
$$;

-- Function to check any admin role
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admins
    WHERE user_id = _user_id
      AND is_active = true
  )
$$;
