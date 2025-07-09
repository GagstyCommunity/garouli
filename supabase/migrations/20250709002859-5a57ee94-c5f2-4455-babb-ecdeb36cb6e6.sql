
-- Create enum for subscription status
CREATE TYPE subscription_status AS ENUM ('trial', 'active', 'cancelled', 'expired');

-- Create agency subscriptions table
CREATE TABLE public.agency_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status subscription_status DEFAULT 'trial',
  trial_end TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  annual_fee DECIMAL(10,2) DEFAULT 2000.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create course modules table
CREATE TABLE public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  video_url TEXT,
  duration_minutes INTEGER,
  is_free BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create course quizzes table
CREATE TABLE public.course_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user progress table
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ,
  watch_time_minutes INTEGER DEFAULT 0,
  quiz_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  certificate_url TEXT,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  verification_hash TEXT UNIQUE,
  blockchain_hash TEXT,
  UNIQUE(user_id, course_id)
);

-- Create job postings table
CREATE TABLE public.job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  remote BOOLEAN DEFAULT false,
  salary_min INTEGER,
  salary_max INTEGER,
  requirements TEXT[],
  benefits TEXT[],
  employment_type TEXT DEFAULT 'full-time',
  is_active BOOLEAN DEFAULT true,
  applications_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES job_postings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  cover_letter TEXT,
  resume_url TEXT,
  status TEXT DEFAULT 'pending',
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, user_id)
);

-- Create course reviews table
CREATE TABLE public.course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

-- Create AI interactions table for chatbot
CREATE TABLE public.ai_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  context_type TEXT, -- 'course', 'general', 'assignment'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create course recommendations table
CREATE TABLE public.course_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  recommendation_score DECIMAL(3,2),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_course_id ON user_progress(course_id);
CREATE INDEX idx_job_postings_agency_id ON job_postings(agency_id);
CREATE INDEX idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX idx_course_reviews_course_id ON course_reviews(course_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Enable RLS on all tables
ALTER TABLE public.agency_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Agency subscriptions: users can view their own
CREATE POLICY "Users can view own subscription" ON agency_subscriptions
  FOR SELECT USING (user_id = auth.uid());

-- Course modules: everyone can view published course modules
CREATE POLICY "Everyone can view course modules" ON course_modules
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM courses WHERE id = course_modules.course_id AND is_published = true
  ));

-- User progress: users can view/update their own progress
CREATE POLICY "Users can manage own progress" ON user_progress
  FOR ALL USING (user_id = auth.uid());

-- Certificates: users can view their own certificates
CREATE POLICY "Users can view own certificates" ON certificates
  FOR SELECT USING (user_id = auth.uid());

-- Job postings: everyone can view active jobs, agencies can manage their own
CREATE POLICY "Everyone can view active jobs" ON job_postings
  FOR SELECT USING (is_active = true);

CREATE POLICY "Agencies can manage own jobs" ON job_postings
  FOR ALL USING (agency_id = auth.uid());

-- Job applications: users can view their own applications
CREATE POLICY "Users can manage own applications" ON job_applications
  FOR ALL USING (user_id = auth.uid());

-- Course reviews: everyone can view approved reviews, users can manage their own
CREATE POLICY "Everyone can view approved reviews" ON course_reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can manage own reviews" ON course_reviews
  FOR ALL USING (user_id = auth.uid());

-- AI interactions: users can view their own interactions
CREATE POLICY "Users can manage own AI interactions" ON ai_interactions
  FOR ALL USING (user_id = auth.uid());

-- Course recommendations: users can view their own recommendations
CREATE POLICY "Users can view own recommendations" ON course_recommendations
  FOR SELECT USING (user_id = auth.uid());

-- Notifications: users can view their own notifications
CREATE POLICY "Users can manage own notifications" ON notifications
  FOR ALL USING (user_id = auth.uid());

-- Functions to calculate course completion
CREATE OR REPLACE FUNCTION calculate_course_completion(p_user_id UUID, p_course_id UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  total_modules INTEGER;
  completed_modules INTEGER;
  completion_percentage DECIMAL(5,2);
BEGIN
  -- Get total modules for the course
  SELECT COUNT(*) INTO total_modules
  FROM course_modules
  WHERE course_id = p_course_id;
  
  -- Get completed modules for the user
  SELECT COUNT(*) INTO completed_modules
  FROM user_progress up
  JOIN course_modules cm ON up.module_id = cm.id
  WHERE up.user_id = p_user_id 
    AND cm.course_id = p_course_id 
    AND up.completed_at IS NOT NULL;
  
  -- Calculate percentage
  IF total_modules > 0 THEN
    completion_percentage := (completed_modules::DECIMAL / total_modules::DECIMAL) * 100;
  ELSE
    completion_percentage := 0;
  END IF;
  
  RETURN completion_percentage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update course ratings
CREATE OR REPLACE FUNCTION update_course_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses 
  SET rating = (
    SELECT AVG(rating)::DECIMAL(3,2)
    FROM course_reviews 
    WHERE course_id = NEW.course_id AND is_approved = true
  ),
  student_count = (
    SELECT COUNT(DISTINCT user_id)
    FROM course_enrollments
    WHERE course_id = NEW.course_id
  )
  WHERE id = NEW.course_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update course ratings when reviews are added/updated
CREATE TRIGGER update_course_rating_trigger
  AFTER INSERT OR UPDATE ON course_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_course_rating();

-- Add some sample data for testing
INSERT INTO course_modules (course_id, title, description, order_index, duration_minutes) 
SELECT id, 'Introduction to ' || title, 'Learn the basics of ' || title, 1, 30
FROM courses LIMIT 5;

INSERT INTO course_modules (course_id, title, description, order_index, duration_minutes) 
SELECT id, 'Advanced ' || title, 'Deep dive into ' || title, 2, 45
FROM courses LIMIT 5;
