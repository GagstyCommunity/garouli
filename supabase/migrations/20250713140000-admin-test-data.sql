
-- Insert test admin user data
DO $$
DECLARE
  admin_user_id UUID;
  super_admin_user_id UUID;
  moderator_user_id UUID;
BEGIN
  -- Create test admin users
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES 
  (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@garouli.com',
    '$2a$10$8qvZ7LkTr5CZnQ8U8qJ8xO8U8qJ8xO8U8qJ8xO8U8qJ8xO8U8qJ8xO', -- password: admin123
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"admin","full_name":"Admin User"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'superadmin@garouli.com',
    '$2a$10$8qvZ7LkTr5CZnQ8U8qJ8xO8U8qJ8xO8U8qJ8xO8U8qJ8xO8U8qJ8xO', -- password: admin123
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"superadmin","full_name":"Super Admin"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'moderator@garouli.com',
    '$2a$10$8qvZ7LkTr5CZnQ8U8qJ8xO8U8qJ8xO8U8qJ8xO8U8qJ8xO8U8qJ8xO', -- password: admin123
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"moderator","full_name":"Moderator User"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  ON CONFLICT (id) DO NOTHING;

  -- Get the user IDs
  admin_user_id := '11111111-1111-1111-1111-111111111111';
  super_admin_user_id := '22222222-2222-2222-2222-222222222222';
  moderator_user_id := '33333333-3333-3333-3333-333333333333';

  -- Insert admin roles
  INSERT INTO public.admins (user_id, role, is_active, permissions) VALUES
  (admin_user_id, 'admin', true, '{"manage_users": true, "manage_courses": true, "manage_content": true}'),
  (super_admin_user_id, 'superadmin', true, '{"full_access": true}'),
  (moderator_user_id, 'moderator', true, '{"manage_content": true, "moderate_users": true}')
  ON CONFLICT (user_id) DO NOTHING;

  -- Insert user roles
  INSERT INTO public.user_roles (user_id, role) VALUES
  (admin_user_id, 'admin'),
  (super_admin_user_id, 'superadmin'),
  (moderator_user_id, 'moderator')
  ON CONFLICT (user_id) DO NOTHING;

  -- Insert profiles
  INSERT INTO public.profiles (id, email, full_name, role) VALUES
  (admin_user_id, 'admin@garouli.com', 'Admin User', 'admin'),
  (super_admin_user_id, 'superadmin@garouli.com', 'Super Admin', 'superadmin'),
  (moderator_user_id, 'moderator@garouli.com', 'Moderator User', 'moderator')
  ON CONFLICT (id) DO NOTHING;

END $$;

-- Insert sample categories
INSERT INTO public.categories (name, description, slug, is_active) VALUES
('Web Development', 'Learn modern web development technologies', 'web-development', true),
('Data Science', 'Master data analysis and machine learning', 'data-science', true),
('Mobile Development', 'Build mobile apps for iOS and Android', 'mobile-development', true),
('Cloud Computing', 'Learn cloud platforms and DevOps', 'cloud-computing', true),
('Cybersecurity', 'Protect systems and networks from threats', 'cybersecurity', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample courses
INSERT INTO public.courses (title, description, instructor_id, category_id, price, difficulty_level, duration_hours, status) 
SELECT 
  course.title,
  course.description,
  (SELECT id FROM public.profiles WHERE role = 'instructor' LIMIT 1),
  cat.id,
  course.price,
  course.difficulty,
  course.duration,
  'published'
FROM (
  VALUES 
    ('Complete React Development', 'Master React from basics to advanced concepts', 99.99, 'beginner', 40),
    ('Python for Data Science', 'Learn data analysis with Python and pandas', 149.99, 'intermediate', 60),
    ('iOS App Development', 'Build native iOS apps with Swift', 199.99, 'intermediate', 80),
    ('AWS Cloud Fundamentals', 'Get started with Amazon Web Services', 129.99, 'beginner', 30),
    ('Ethical Hacking Basics', 'Learn cybersecurity fundamentals', 179.99, 'advanced', 50)
) AS course(title, description, price, difficulty, duration),
public.categories cat
WHERE cat.slug IN ('web-development', 'data-science', 'mobile-development', 'cloud-computing', 'cybersecurity')
AND course.title LIKE '%' || CASE 
  WHEN cat.slug = 'web-development' THEN 'React'
  WHEN cat.slug = 'data-science' THEN 'Python'
  WHEN cat.slug = 'mobile-development' THEN 'iOS'
  WHEN cat.slug = 'cloud-computing' THEN 'AWS'
  WHEN cat.slug = 'cybersecurity' THEN 'Hacking'
END || '%'
ON CONFLICT DO NOTHING;

-- Insert sample blog posts
INSERT INTO public.blogs (title, content, author_id, category, status, featured) VALUES
('Getting Started with React Hooks', 'Learn how to use React Hooks effectively in your applications...', '11111111-1111-1111-1111-111111111111', 'tutorial', 'published', true),
('Data Science Career Path', 'Complete guide to becoming a data scientist in 2024...', '11111111-1111-1111-1111-111111111111', 'career', 'published', false),
('Mobile App Design Trends', 'Latest trends in mobile app design and user experience...', '22222222-2222-2222-2222-222222222222', 'design', 'published', true),
('Cloud Security Best Practices', 'Essential security practices for cloud applications...', '33333333-3333-3333-3333-333333333333', 'security', 'published', false),
('Machine Learning Fundamentals', 'Introduction to machine learning concepts and algorithms...', '11111111-1111-1111-1111-111111111111', 'tutorial', 'published', true)
ON CONFLICT DO NOTHING;

-- Insert sample hackathons
INSERT INTO public.hackathons (title, description, theme, start_date, end_date, max_participants, prize_pool, status) VALUES
('AI Innovation Challenge', 'Build innovative AI solutions for real-world problems', 'Artificial Intelligence', NOW() + INTERVAL '30 days', NOW() + INTERVAL '37 days', 100, 10000.00, 'upcoming'),
('Web3 Hackathon', 'Create decentralized applications on blockchain', 'Blockchain & Web3', NOW() + INTERVAL '45 days', NOW() + INTERVAL '52 days', 150, 15000.00, 'upcoming'),
('Climate Tech Challenge', 'Develop technology solutions for climate change', 'Sustainability', NOW() + INTERVAL '60 days', NOW() + INTERVAL '67 days', 200, 20000.00, 'upcoming')
ON CONFLICT DO NOTHING;

-- Insert sample events
INSERT INTO public.events (title, description, event_type, start_date, end_date, max_attendees, price, status) VALUES
('React Conference 2024', 'Annual conference for React developers', 'conference', NOW() + INTERVAL '90 days', NOW() + INTERVAL '92 days', 500, 299.99, 'upcoming'),
('Data Science Workshop', 'Hands-on workshop for data science beginners', 'workshop', NOW() + INTERVAL '20 days', NOW() + INTERVAL '20 days', 50, 99.99, 'upcoming'),
('Cybersecurity Bootcamp', 'Intensive bootcamp for cybersecurity professionals', 'bootcamp', NOW() + INTERVAL '75 days', NOW() + INTERVAL '89 days', 30, 1999.99, 'upcoming')
ON CONFLICT DO NOTHING;
