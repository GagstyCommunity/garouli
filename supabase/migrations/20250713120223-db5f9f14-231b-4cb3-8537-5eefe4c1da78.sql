
-- Create test admin user in profiles table
INSERT INTO public.profiles (id, email, full_name, avatar_url, bio)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'admin@garouli.com',
  'Test Admin',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  'System Administrator'
);

-- Add admin role for test user
INSERT INTO public.user_roles (user_id, role)
VALUES ('11111111-1111-1111-1111-111111111111', 'admin');

-- Add to admins table with superadmin role
INSERT INTO public.admins (user_id, role, is_active, permissions)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'superadmin',
  true,
  '{"all": true}'
);

-- Populate courses with data from the public website
INSERT INTO public.courses (
  id, title, short_description, description, instructor_id, price, is_free, 
  duration_hours, has_certification, category, difficulty, tags, 
  thumbnail_url, video_preview_url, is_published, student_count, rating
) VALUES 
(
  gen_random_uuid(),
  'Complete Web Development Bootcamp',
  'Master HTML, CSS, JavaScript, React, Node.js and more in this comprehensive course',
  'This comprehensive bootcamp covers everything you need to become a full-stack web developer. Starting with HTML and CSS fundamentals, you''ll progress through JavaScript, React, Node.js, databases, and deployment strategies.',
  '11111111-1111-1111-1111-111111111111',
  199.99,
  false,
  120,
  true,
  'Web Development',
  'Beginner',
  ARRAY['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
  'https://sample-videos.com/zip/10/mp4/480/big_buck_bunny_480p_1mb.mp4',
  true,
  2847,
  4.8
),
(
  gen_random_uuid(),
  'Data Science with Python',
  'Learn data analysis, machine learning, and visualization with Python',
  'Comprehensive data science course covering Python programming, pandas, NumPy, matplotlib, scikit-learn, and machine learning algorithms. Perfect for beginners and intermediate learners.',
  '11111111-1111-1111-1111-111111111111',
  149.99,
  false,
  80,
  true,
  'Data Science',
  'Intermediate',
  ARRAY['Python', 'Pandas', 'Machine Learning', 'Data Analysis'],
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
  null,
  true,
  1923,
  4.7
),
(
  gen_random_uuid(),
  'UI/UX Design Fundamentals',
  'Master the principles of user interface and user experience design',
  'Learn the core principles of UI/UX design, including user research, wireframing, prototyping, and design thinking. Hands-on projects with Figma and Adobe XD.',
  '11111111-1111-1111-1111-111111111111',
  99.99,
  false,
  45,
  true,
  'Design',
  'Beginner',
  ARRAY['UI Design', 'UX Design', 'Figma', 'Prototyping'],
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
  null,
  true,
  1456,
  4.6
),
(
  gen_random_uuid(),
  'Mobile App Development with React Native',
  'Build cross-platform mobile apps using React Native',
  'Complete guide to React Native development, covering navigation, state management, API integration, and publishing to app stores.',
  '11111111-1111-1111-1111-111111111111',
  179.99,
  false,
  60,
  true,
  'Mobile Development',
  'Intermediate',
  ARRAY['React Native', 'Mobile Development', 'iOS', 'Android'],
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
  null,
  true,
  987,
  4.5
),
(
  gen_random_uuid(),
  'Digital Marketing Mastery',
  'Complete digital marketing course covering SEO, social media, and PPC',
  'Comprehensive digital marketing training including SEO, Google Ads, Facebook marketing, content strategy, and analytics. Perfect for businesses and marketers.',
  '11111111-1111-1111-1111-111111111111',
  129.99,
  false,
  40,
  true,
  'Marketing',
  'Beginner',
  ARRAY['SEO', 'Google Ads', 'Social Media', 'Content Marketing'],
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
  null,
  true,
  2156,
  4.4
),
(
  gen_random_uuid(),
  'Introduction to Programming',
  'Start your coding journey with fundamental programming concepts',
  'Perfect for absolute beginners. Learn programming fundamentals using Python, including variables, functions, loops, and basic data structures.',
  '11111111-1111-1111-1111-111111111111',
  0,
  true,
  25,
  false,
  'Programming',
  'Beginner',
  ARRAY['Python', 'Programming Basics', 'Logic Building'],
  'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&h=600&fit=crop',
  null,
  true,
  5432,
  4.9
);

-- Add instructor profile for the test admin
INSERT INTO public.instructor_profiles (
  user_id, bio, expertise_areas, teaching_experience, 
  total_students, average_rating, verified
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Experienced software engineer and educator with over 10 years in the industry. Passionate about teaching and helping students achieve their goals.',
  ARRAY['Web Development', 'Data Science', 'Mobile Development', 'UI/UX Design'],
  8,
  15000,
  4.7,
  true
);

-- Add some job postings
INSERT INTO public.job_postings (
  title, description, location, employment_type, salary_min, salary_max,
  requirements, benefits, remote, is_active
) VALUES 
(
  'Senior Frontend Developer',
  'We are looking for an experienced Frontend Developer to join our dynamic team. You will be responsible for developing user-facing features and ensuring great user experience.',
  'San Francisco, CA',
  'full-time',
  120000,
  180000,
  ARRAY['5+ years React experience', 'TypeScript proficiency', 'Modern CSS frameworks'],
  ARRAY['Health insurance', 'Flexible working hours', '401k matching'],
  true,
  true
),
(
  'Data Scientist',
  'Join our data team to work on cutting-edge machine learning projects. You will analyze large datasets and build predictive models.',
  'New York, NY',
  'full-time',
  130000,
  200000,
  ARRAY['Python/R expertise', 'Machine Learning experience', 'SQL proficiency'],
  ARRAY['Health insurance', 'Stock options', 'Professional development budget'],
  false,
  true
),
(
  'UX Designer',
  'Create exceptional user experiences for our digital products. Work closely with product managers and developers.',
  'Remote',
  'full-time',
  90000,
  140000,
  ARRAY['3+ years UX design experience', 'Figma proficiency', 'User research skills'],
  ARRAY['Health insurance', 'Home office stipend', 'Flexible PTO'],
  true,
  true
);

-- Add some blog posts
INSERT INTO public.blogs (title, content, author_id, approved) VALUES 
(
  'The Future of Web Development in 2024',
  'Web development continues to evolve at a rapid pace. In this article, we explore the latest trends and technologies shaping the future of web development, including AI integration, serverless architecture, and new JavaScript frameworks.',
  '11111111-1111-1111-1111-111111111111',
  true
),
(
  'Getting Started with Machine Learning',
  'Machine learning might seem intimidating at first, but with the right approach, anyone can learn it. This guide covers the basics of ML, popular algorithms, and practical applications in various industries.',
  '11111111-1111-1111-1111-111111111111',
  true
),
(
  'Design Thinking for Developers',
  'As a developer, understanding design thinking can significantly improve your problem-solving skills. Learn how to apply design thinking principles to create better software solutions.',
  '11111111-1111-1111-1111-111111111111',
  true
);

-- Add some battles/competitions
INSERT INTO public.battles (
  title, prompt, theme, status, start_date, end_date
) VALUES 
(
  'Build a Weather App',
  'Create a responsive weather application that displays current weather and 5-day forecast. Use any framework of your choice.',
  'Frontend Development',
  'active',
  NOW(),
  NOW() + INTERVAL '14 days'
),
(
  'Data Visualization Challenge',
  'Create an interactive dashboard that visualizes climate change data. Focus on user experience and meaningful insights.',
  'Data Science',
  'upcoming',
  NOW() + INTERVAL '7 days',
  NOW() + INTERVAL '21 days'
);
