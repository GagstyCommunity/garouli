
-- Create missing tables for recommendation engine and course interactions
CREATE TABLE public.user_learning_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  preferred_categories TEXT[],
  preferred_difficulty TEXT,
  learning_objectives TEXT[],
  target_completion_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE public.course_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  interaction_type TEXT NOT NULL,
  interaction_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.user_learning_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_learning_goals
CREATE POLICY "Users can manage their own learning goals"
  ON public.user_learning_goals
  FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for course_interactions  
CREATE POLICY "Users can manage their own course interactions"
  ON public.course_interactions
  FOR ALL
  USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX idx_course_interactions_user_course ON public.course_interactions(user_id, course_id);
CREATE INDEX idx_course_interactions_type ON public.course_interactions(interaction_type);
CREATE INDEX idx_user_learning_goals_user ON public.user_learning_goals(user_id);
