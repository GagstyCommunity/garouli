
-- First, let's create comprehensive dummy data (10 entries each for all entities)
-- Clear existing dummy data to avoid conflicts
DELETE FROM public.course_quizzes WHERE module_id IN (SELECT id FROM course_modules WHERE course_id IN (SELECT id FROM courses WHERE instructor_id IN ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333')));
DELETE FROM public.course_modules WHERE course_id IN (SELECT id FROM courses WHERE instructor_id IN ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333'));
DELETE FROM public.course_enrollments WHERE course_id IN (SELECT id FROM courses WHERE instructor_id IN ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333'));
DELETE FROM public.courses WHERE instructor_id IN ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333');
DELETE FROM public.job_applications WHERE job_id IN (SELECT id FROM job_postings WHERE agency_id = '66666666-6666-6666-6666-666666666666');
DELETE FROM public.job_postings WHERE agency_id = '66666666-6666-6666-6666-666666666666';
DELETE FROM public.user_gamification WHERE user_id IN ('44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555');
DELETE FROM public.user_roles WHERE user_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666');
DELETE FROM public.profiles WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666');

-- Insert comprehensive dummy profiles (10 students, 10 teachers, 10 agencies, 10 admins)
-- Students (10)
INSERT INTO public.profiles (id, email, full_name, bio, avatar_url) VALUES
  ('s1111111-1111-1111-1111-111111111111', 'alice.student@email.com', 'Alice Johnson', 'Passionate AI student interested in machine learning and data science', 'https://images.unsplash.com/photo-1494790108755-2616b73e4019?w=150'),
  ('s2222222-2222-2222-2222-222222222222', 'bob.learner@email.com', 'Bob Smith', 'Full-stack developer learning AI to enhance my applications', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
  ('s3333333-3333-3333-3333-333333333333', 'carol.wilson@email.com', 'Carol Wilson', 'Data analyst transitioning to machine learning engineer', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'),
  ('s4444444-4444-4444-4444-444444444444', 'david.tech@email.com', 'David Brown', 'Computer science graduate exploring AI career opportunities', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'),
  ('s5555555-5555-5555-5555-555555555555', 'emma.coder@email.com', 'Emma Davis', 'Software engineer interested in natural language processing', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150'),
  ('s6666666-6666-6666-6666-666666666666', 'frank.dev@email.com', 'Frank Miller', 'Web developer learning computer vision and deep learning', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'),
  ('s7777777-7777-7777-7777-777777777777', 'grace.ai@email.com', 'Grace Lee', 'Mathematics graduate passionate about neural networks', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150'),
  ('s8888888-8888-8888-8888-888888888888', 'henry.ml@email.com', 'Henry Garcia', 'Data scientist expanding into reinforcement learning', 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150'),
  ('s9999999-9999-9999-9999-999999999999', 'ivy.neural@email.com', 'Ivy Rodriguez', 'Recent graduate interested in AI ethics and responsible AI', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'),
  ('s0000000-0000-0000-0000-000000000000', 'jack.future@email.com', 'Jack Thompson', 'Entrepreneur learning AI to build innovative solutions', 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150');

-- Teachers/Instructors (10)
INSERT INTO public.profiles (id, email, full_name, bio, avatar_url) VALUES
  ('t1111111-1111-1111-1111-111111111111', 'dr.sarah.ai@university.edu', 'Dr. Sarah Johnson', 'AI Research Professor with 15+ years in machine learning and neural networks', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'),
  ('t2222222-2222-2222-2222-222222222222', 'prof.mike.chen@tech.edu', 'Prof. Michael Chen', 'Data Science expert and author of 3 ML textbooks', 'https://images.unsplash.com/photo-1556157382-5d3db4833db3?w=150'),
  ('t3333333-3333-3333-3333-333333333333', 'dr.lisa.wang@ai.institute', 'Dr. Lisa Wang', 'Computer Vision specialist with industry experience at Google', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'),
  ('t4444444-4444-4444-4444-444444444444', 'prof.james.nlp@stanford.edu', 'Prof. James Wilson', 'Natural Language Processing expert and OpenAI researcher', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'),
  ('t5555555-5555-5555-5555-555555555555', 'dr.maria.robot@mit.edu', 'Dr. Maria Rodriguez', 'Robotics and AI integration specialist', 'https://images.unsplash.com/photo-1574015974293-817f0ebebb74?w=150'),
  ('t6666666-6666-6666-6666-666666666666', 'prof.alex.deep@berkeley.edu', 'Prof. Alex Thompson', 'Deep Learning pioneer with 100+ published papers', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150'),
  ('t7777777-7777-7777-7777-777777777777', 'dr.nina.ethics@harvard.edu', 'Dr. Nina Patel', 'AI Ethics and Responsible AI development expert', 'https://images.unsplash.com/photo-1594736797933-d0d4ae7e8175?w=150'),
  ('t8888888-8888-8888-8888-888888888888', 'prof.carlos.quantum@caltech.edu', 'Prof. Carlos Martinez', 'Quantum Computing and Quantum ML researcher', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'),
  ('t9999999-9999-9999-9999-999999999999', 'dr.emma.bio@johns.hopkins.edu', 'Dr. Emma Foster', 'Bioinformatics and AI in healthcare specialist', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150'),
  ('t0000000-0000-0000-0000-000000000000', 'prof.ryan.business@wharton.edu', 'Prof. Ryan Kim', 'AI in Business and Strategic AI implementation expert', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150');

-- Agencies (10)
INSERT INTO public.profiles (id, email, full_name, bio, avatar_url) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'contact@techcorp.ai', 'TechCorp AI Solutions', 'Leading AI recruitment and training agency specializing in enterprise solutions', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150'),
  ('a2222222-2222-2222-2222-222222222222', 'info@airecruit.com', 'AI Recruit Pro', 'Connecting top AI talent with innovative companies worldwide', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150'),
  ('a3333333-3333-3333-3333-333333333333', 'hello@neuralnext.io', 'Neural Next', 'Specialized in placing machine learning engineers and data scientists', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=150'),
  ('a4444444-4444-4444-4444-444444444444', 'team@datatalent.co', 'Data Talent Hub', 'Premier data science and analytics recruitment agency', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=150'),
  ('a5555555-5555-5555-5555-555555555555', 'contact@mlhunters.net', 'ML Hunters', 'Boutique agency focusing on senior ML and AI leadership roles', 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=150'),
  ('a6666666-6666-6666-6666-666666666666', 'info@roboticstalent.com', 'Robotics Talent Co', 'Specialized in robotics, autonomous systems, and AI hardware', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150'),
  ('a7777777-7777-7777-7777-777777777777', 'hello@quantumcareers.ai', 'Quantum Careers', 'Emerging tech recruitment in quantum computing and advanced AI', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=150'),
  ('a8888888-8888-8888-8888-888888888888', 'team@aiethics.jobs', 'AI Ethics Jobs', 'Focused on responsible AI and AI safety career opportunities', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=150'),
  ('a9999999-9999-9999-9999-999999999999', 'contact@healthai.careers', 'HealthAI Careers', 'Healthcare AI and medical technology talent acquisition', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=150'),
  ('a0000000-0000-0000-0000-000000000000', 'info@fintech.ai.jobs', 'FinTech AI Jobs', 'Financial technology and AI in finance recruitment', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=150');

-- Admins (10)
INSERT INTO public.profiles (id, email, full_name, bio, avatar_url) VALUES
  ('admin111-1111-1111-1111-111111111111', 'admin1@garouli.com', 'John Admin', 'Platform Administrator and Content Manager', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'),
  ('admin222-2222-2222-2222-222222222222', 'admin2@garouli.com', 'Sarah Admin', 'User Experience and Quality Assurance Manager', 'https://images.unsplash.com/photo-1494790108755-2616b73e4019?w=150'),
  ('admin333-3333-3333-3333-333333333333', 'admin3@garouli.com', 'Michael Admin', 'Technical Operations and System Administrator', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
  ('admin444-4444-4444-4444-444444444444', 'admin4@garouli.com', 'Lisa Admin', 'Content Moderation and Community Manager', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'),
  ('admin555-5555-5555-5555-555555555555', 'admin5@garouli.com', 'David Admin', 'Analytics and Business Intelligence Manager', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'),
  ('admin666-6666-6666-6666-666666666666', 'admin6@garouli.com', 'Emma Admin', 'Partner Relations and Agency Management', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'),
  ('admin777-7777-7777-7777-777777777777', 'admin7@garouli.com', 'James Admin', 'Security and Compliance Officer', 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150'),
  ('admin888-8888-8888-8888-888888888888', 'admin8@garouli.com', 'Maria Admin', 'Marketing and Growth Manager', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150'),
  ('admin999-9999-9999-9999-999999999999', 'admin9@garouli.com', 'Carlos Admin', 'Product Manager and Feature Development', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'),
  ('admin000-0000-0000-0000-000000000000', 'admin10@garouli.com', 'Nina Admin', 'Customer Success and Support Manager', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150');

-- Insert user roles
-- Students
INSERT INTO public.user_roles (user_id, role) VALUES
  ('s1111111-1111-1111-1111-111111111111', 'student'),
  ('s2222222-2222-2222-2222-222222222222', 'student'),
  ('s3333333-3333-3333-3333-333333333333', 'student'),
  ('s4444444-4444-4444-4444-444444444444', 'student'),
  ('s5555555-5555-5555-5555-555555555555', 'student'),
  ('s6666666-6666-6666-6666-666666666666', 'student'),
  ('s7777777-7777-7777-7777-777777777777', 'student'),
  ('s8888888-8888-8888-8888-888888888888', 'student'),
  ('s9999999-9999-9999-9999-999999999999', 'student'),
  ('s0000000-0000-0000-0000-000000000000', 'student');

-- Teachers
INSERT INTO public.user_roles (user_id, role) VALUES
  ('t1111111-1111-1111-1111-111111111111', 'instructor'),
  ('t2222222-2222-2222-2222-222222222222', 'instructor'),
  ('t3333333-3333-3333-3333-333333333333', 'instructor'),
  ('t4444444-4444-4444-4444-444444444444', 'instructor'),
  ('t5555555-5555-5555-5555-555555555555', 'instructor'),
  ('t6666666-6666-6666-6666-666666666666', 'instructor'),
  ('t7777777-7777-7777-7777-777777777777', 'instructor'),
  ('t8888888-8888-8888-8888-888888888888', 'instructor'),
  ('t9999999-9999-9999-9999-999999999999', 'instructor'),
  ('t0000000-0000-0000-0000-000000000000', 'instructor');

-- Agencies
INSERT INTO public.user_roles (user_id, role) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'enterprise'),
  ('a2222222-2222-2222-2222-222222222222', 'enterprise'),
  ('a3333333-3333-3333-3333-333333333333', 'enterprise'),
  ('a4444444-4444-4444-4444-444444444444', 'enterprise'),
  ('a5555555-5555-5555-5555-555555555555', 'enterprise'),
  ('a6666666-6666-6666-6666-666666666666', 'enterprise'),
  ('a7777777-7777-7777-7777-777777777777', 'enterprise'),
  ('a8888888-8888-8888-8888-888888888888', 'enterprise'),
  ('a9999999-9999-9999-9999-999999999999', 'enterprise'),
  ('a0000000-0000-0000-0000-000000000000', 'enterprise');

-- Admins
INSERT INTO public.user_roles (user_id, role) VALUES
  ('admin111-1111-1111-1111-111111111111', 'admin'),
  ('admin222-2222-2222-2222-222222222222', 'admin'),
  ('admin333-3333-3333-3333-333333333333', 'admin'),
  ('admin444-4444-4444-4444-444444444444', 'admin'),
  ('admin555-5555-5555-5555-555555555555', 'admin'),
  ('admin666-6666-6666-6666-666666666666', 'admin'),
  ('admin777-7777-7777-7777-777777777777', 'admin'),
  ('admin888-8888-8888-8888-888888888888', 'admin'),
  ('admin999-9999-9999-9999-999999999999', 'admin'),
  ('admin000-0000-0000-0000-000000000000', 'admin');

-- Insert comprehensive courses (10 courses across different categories)
INSERT INTO public.courses (id, instructor_id, title, short_description, description, category, difficulty, duration_hours, price, is_free, is_published, has_certification, rating, student_count, tags, thumbnail_url) VALUES
  ('course01-0001-0001-0001-000000000001', 't1111111-1111-1111-1111-111111111111', 'Machine Learning Fundamentals', 'Complete introduction to ML concepts and algorithms', 'Master the foundations of machine learning with hands-on projects, real-world datasets, and practical applications. This course covers supervised learning, unsupervised learning, and reinforcement learning with Python implementations.', 'Machine Learning', 'Beginner', 12, 199.99, false, true, true, 4.8, 245, ARRAY['Machine Learning', 'Python', 'Algorithms', 'Data Science'], 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=300'),
  
  ('course02-0002-0002-0002-000000000002', 't2222222-2222-2222-2222-222222222222', 'Deep Learning with TensorFlow', 'Build neural networks from scratch to advanced architectures', 'Dive deep into neural networks, CNNs, RNNs, and Transformers. Learn to build and deploy deep learning models using TensorFlow and Keras for computer vision, NLP, and more.', 'Deep Learning', 'Advanced', 20, 299.99, false, true, true, 4.9, 189, ARRAY['Deep Learning', 'TensorFlow', 'Neural Networks', 'AI'], 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=300'),
  
  ('course03-0003-0003-0003-000000000003', 't3333333-3333-3333-3333-333333333333', 'Computer Vision Mastery', 'From image processing to object detection and recognition', 'Master computer vision techniques including image preprocessing, feature extraction, object detection, facial recognition, and advanced CNN architectures like YOLO and R-CNN.', 'Computer Vision', 'Intermediate', 16, 249.99, false, true, true, 4.7, 156, ARRAY['Computer Vision', 'OpenCV', 'CNN', 'Image Processing'], 'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=300'),
  
  ('course04-0004-0004-0004-000000000004', 't4444444-4444-4444-4444-444444444444', 'Natural Language Processing', 'Build intelligent text processing systems', 'Learn to process and understand human language with NLP techniques, sentiment analysis, text classification, named entity recognition, and transformer models like BERT and GPT.', 'Natural Language Processing', 'Intermediate', 18, 279.99, false, true, true, 4.8, 203, ARRAY['NLP', 'Text Processing', 'BERT', 'Transformers'], 'https://images.unsplash.com/photo-1545587381-f2e4a0fdc8c9?w=300'),
  
  ('course05-0005-0005-0005-000000000005', 't5555555-5555-5555-5555-555555555555', 'Robotics and AI Integration', 'Build intelligent robotic systems', 'Combine AI with robotics to create autonomous systems. Learn robot programming, sensor integration, path planning, and AI-driven decision making for real-world robotic applications.', 'Robotics', 'Advanced', 24, 349.99, false, true, true, 4.6, 98, ARRAY['Robotics', 'AI', 'Autonomous Systems', 'Sensors'], 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300'),
  
  ('course06-0006-0006-0006-000000000006', 't6666666-6666-6666-6666-666666666666', 'AI Ethics and Responsible AI', 'Build ethical and fair AI systems', 'Understand the ethical implications of AI, bias detection and mitigation, fairness in ML models, privacy concerns, and responsible AI development practices.', 'AI Ethics', 'Beginner', 8, 149.99, false, true, true, 4.9, 312, ARRAY['AI Ethics', 'Bias', 'Fairness', 'Responsible AI'], 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300'),
  
  ('course07-0007-0007-0007-000000000007', 't7777777-7777-7777-7777-777777777777', 'Data Science Complete Bootcamp', 'From data collection to deployment', 'Complete data science pipeline including data collection, cleaning, analysis, visualization, machine learning, and model deployment. Includes Python, SQL, and cloud platforms.', 'Data Science', 'Beginner', 30, 399.99, false, true, true, 4.8, 276, ARRAY['Data Science', 'Python', 'SQL', 'Visualization'], 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300'),
  
  ('course08-0008-0008-0008-000000000008', 't8888888-8888-8888-8888-888888888888', 'Quantum Machine Learning', 'Explore the intersection of quantum computing and ML', 'Discover quantum algorithms for machine learning, quantum neural networks, and how quantum computing can enhance traditional ML approaches. Includes hands-on quantum programming.', 'Quantum Computing', 'Expert', 16, 449.99, false, true, true, 4.5, 67, ARRAY['Quantum Computing', 'Quantum ML', 'Advanced Physics', 'Qiskit'], 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300'),
  
  ('course09-0009-0009-0009-000000000009', 't9999999-9999-9999-9999-999999999999', 'AI in Healthcare', 'Medical AI applications and diagnostics', 'Apply AI to healthcare challenges including medical image analysis, drug discovery, patient data analysis, and building AI systems for clinical decision support.', 'Healthcare AI', 'Intermediate', 14, 299.99, false, true, true, 4.7, 134, ARRAY['Healthcare AI', 'Medical Imaging', 'Clinical AI', 'Biomedical'], 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300'),
  
  ('course10-0010-0010-0010-000000000010', 't0000000-0000-0000-0000-000000000000', 'AI for Business Strategy', 'Implement AI solutions in business contexts', 'Learn to identify AI opportunities in business, develop AI strategies, manage AI projects, and measure ROI of AI implementations. Perfect for business leaders and consultants.', 'Business AI', 'Beginner', 10, 199.99, false, true, true, 4.6, 189, ARRAY['Business AI', 'Strategy', 'ROI', 'Management'], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300');

-- Insert course modules (3-4 modules per course)
-- Course 1: Machine Learning Fundamentals
INSERT INTO public.course_modules (id, course_id, title, description, order_index, duration_minutes, is_free) VALUES
  ('mod-c1-m1-0000-0000-000000000001', 'course01-0001-0001-0001-000000000001', 'Introduction to Machine Learning', 'Understanding ML concepts, types, and applications', 1, 60, true),
  ('mod-c1-m2-0000-0000-000000000002', 'course01-0001-0001-0001-000000000001', 'Supervised Learning Algorithms', 'Linear regression, decision trees, and classification', 2, 90, false),
  ('mod-c1-m3-0000-0000-000000000003', 'course01-0001-0001-0001-000000000001', 'Unsupervised Learning', 'Clustering, dimensionality reduction, and pattern discovery', 3, 75, false),
  ('mod-c1-m4-0000-0000-000000000004', 'course01-0001-0001-0001-000000000001', 'Model Evaluation and Deployment', 'Testing, validation, and deploying ML models', 4, 85, false);

-- Course 2: Deep Learning with TensorFlow
INSERT INTO public.course_modules (id, course_id, title, description, order_index, duration_minutes, is_free) VALUES
  ('mod-c2-m1-0000-0000-000000000001', 'course02-0002-0002-0002-000000000002', 'Neural Network Fundamentals', 'Perceptrons, backpropagation, and basic architectures', 1, 90, true),
  ('mod-c2-m2-0000-0000-000000000002', 'course02-0002-0002-0002-000000000002', 'Convolutional Neural Networks', 'CNN architecture, image recognition, and transfer learning', 2, 120, false),
  ('mod-c2-m3-0000-0000-000000000003', 'course02-0002-0002-0002-000000000002', 'Recurrent Neural Networks', 'RNN, LSTM, GRU for sequence data', 3, 105, false),
  ('mod-c2-m4-0000-0000-000000000004', 'course02-0002-0002-0002-000000000002', 'Advanced Architectures', 'Transformers, attention mechanisms, and modern architectures', 4, 135, false);

-- Course 3: Computer Vision Mastery  
INSERT INTO public.course_modules (id, course_id, title, description, order_index, duration_minutes, is_free) VALUES
  ('mod-c3-m1-0000-0000-000000000001', 'course03-0003-0003-0003-000000000003', 'Image Processing Basics', 'Filters, transformations, and preprocessing techniques', 1, 75, true),
  ('mod-c3-m2-0000-0000-000000000002', 'course03-0003-0003-0003-000000000003', 'Feature Detection and Extraction', 'Edge detection, corner detection, and feature matching', 2, 90, false),
  ('mod-c3-m3-0000-0000-000000000003', 'course03-0003-0003-0003-000000000003', 'Object Detection and Recognition', 'YOLO, R-CNN, and real-time detection systems', 3, 105, false);

-- Insert comprehensive job postings (10 from different agencies)
INSERT INTO public.job_postings (id, agency_id, title, description, location, remote, salary_min, salary_max, requirements, benefits, employment_type) VALUES
  ('job-0001-0001-0001-000000000001', 'a1111111-1111-1111-1111-111111111111', 'Senior Machine Learning Engineer', 'Lead ML engineering team to build scalable AI solutions for enterprise clients. Design and implement ML pipelines, mentor junior engineers, and drive technical innovation.', 'San Francisco, CA', true, 150000, 220000, ARRAY['Python', 'TensorFlow/PyTorch', 'MLOps', 'AWS/GCP', '5+ years ML experience', 'Leadership experience'], ARRAY['Stock options', 'Health insurance', 'Remote work', '401k matching', 'Learning budget'], 'full-time'),
  
  ('job-0002-0002-0002-000000000002', 'a2222222-2222-2222-2222-222222222222', 'AI Research Scientist', 'Conduct cutting-edge research in deep learning and publish findings. Collaborate with academic institutions and develop novel AI algorithms.', 'New York, NY', true, 140000, 200000, ARRAY['PhD in AI/ML/CS', 'Published research papers', 'Deep Learning expertise', 'Python/R', 'Statistical analysis'], ARRAY['Research budget', 'Conference attendance', 'Flexible hours', 'Health insurance', 'Sabbatical options'], 'full-time'),
  
  ('job-0003-0003-0003-000000000003', 'a3333333-3333-3333-3333-333333333333', 'Computer Vision Engineer', 'Develop advanced computer vision systems for autonomous vehicles. Work with cameras, LiDAR, and sensor fusion technologies.', 'Austin, TX', false, 130000, 180000, ARRAY['Computer Vision', 'OpenCV', 'CNN architectures', 'C++/Python', 'Autonomous systems', 'Real-time processing'], ARRAY['Relocation assistance', 'Health insurance', 'Stock options', 'Tech stipend', 'Gym membership'], 'full-time'),
  
  ('job-0004-0004-0004-000000000004', 'a4444444-4444-4444-4444-444444444444', 'Data Scientist - NLP', 'Build NLP models for customer sentiment analysis, chatbots, and document processing. Work with large-scale text data and transformer models.', 'Seattle, WA', true, 120000, 160000, ARRAY['NLP expertise', 'BERT/GPT models', 'Python', 'Spark/Hadoop', 'Statistics', '3+ years experience'], ARRAY['Remote work', 'Health insurance', 'Professional development', 'Flexible PTO', 'Home office setup'], 'full-time'),
  
  ('job-0005-0005-0005-000000000005', 'a5555555-5555-5555-5555-555555555555', 'AI Product Manager', 'Drive AI product strategy and roadmap. Work with engineering teams to deliver AI-powered features and analyze market opportunities.', 'Los Angeles, CA', true, 140000, 190000, ARRAY['Product management', 'AI/ML understanding', 'Market analysis', 'Cross-functional leadership', 'MBA preferred', 'B2B experience'], ARRAY['Stock options', 'Health insurance', 'Professional development', 'Flexible work', 'Team retreats'], 'full-time'),
  
  ('job-0006-0006-0006-000000000006', 'a6666666-6666-6666-6666-666666666666', 'Robotics Software Engineer', 'Develop control systems and AI algorithms for industrial robots. Integrate sensors, actuators, and decision-making systems.', 'Boston, MA', false, 125000, 175000, ARRAY['Robotics engineering', 'ROS', 'C++/Python', 'Control systems', 'Sensor integration', 'Real-time systems'], ARRAY['Health insurance', 'Relocation assistance', 'Learning budget', '401k', 'Equipment provided'], 'full-time'),
  
  ('job-0007-0007-0007-000000000007', 'a7777777-7777-7777-7777-777777777777', 'Quantum ML Researcher', 'Research quantum algorithms for machine learning applications. Develop quantum neural networks and hybrid classical-quantum systems.', 'Remote', true, 160000, 220000, ARRAY['Quantum computing', 'Qiskit/Cirq', 'Quantum algorithms', 'PhD in Physics/CS', 'Research publications', 'Linear algebra'], ARRAY['Research freedom', 'Conference budget', 'Equipment provided', 'Flexible hours', 'Health insurance'], 'full-time'),
  
  ('job-0008-0008-0008-000000000008', 'a8888888-8888-8888-8888-888888888888', 'AI Ethics Consultant', 'Advise companies on responsible AI development. Conduct bias audits, develop ethical AI frameworks, and ensure regulatory compliance.', 'Washington, DC', true, 110000, 150000, ARRAY['AI ethics expertise', 'Policy knowledge', 'Bias detection', 'Regulatory compliance', 'Communication skills', 'Legal background preferred'], ARRAY['Impact-driven work', 'Professional development', 'Flexible schedule', 'Health insurance', 'Conference speaking'], 'full-time'),
  
  ('job-0009-0009-0009-000000000009', 'a9999999-9999-9999-9999-999999999999', 'Healthcare AI Engineer', 'Build AI systems for medical diagnosis and treatment planning. Work with medical imaging, patient data, and clinical decision support.', 'Chicago, IL', true, 135000, 185000, ARRAY['Healthcare AI', 'Medical imaging', 'HIPAA compliance', 'Clinical workflows', 'Deep learning', 'Python/R'], ARRAY['Healthcare mission', 'Health insurance', 'Research opportunities', 'Professional development', 'Flexible work'], 'full-time'),
  
  ('job-0010-0010-0010-000000000010', 'a0000000-0000-0000-0000-000000000000', 'MLOps Engineer', 'Build and maintain ML infrastructure and deployment pipelines. Automate model training, testing, and deployment processes.', 'Denver, CO', true, 125000, 170000, ARRAY['MLOps', 'Kubernetes', 'Docker', 'CI/CD', 'Cloud platforms', 'Monitoring tools', 'Infrastructure as code'], ARRAY['Remote work', 'Health insurance', 'Learning budget', 'Stock options', 'Flexible PTO'], 'full-time');

-- Insert agency subscriptions
INSERT INTO public.agency_subscriptions (user_id, status, annual_fee, current_period_start, current_period_end, trial_end) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'active', 2400.00, NOW() - INTERVAL '2 months', NOW() + INTERVAL '10 months', NOW() - INTERVAL '2 months'),
  ('a2222222-2222-2222-2222-222222222222', 'active', 2400.00, NOW() - INTERVAL '1 month', NOW() + INTERVAL '11 months', NOW() - INTERVAL '1 month'),
  ('a3333333-3333-3333-3333-333333333333', 'trial', 2400.00, NOW(), NOW() + INTERVAL '3 months', NOW() + INTERVAL '3 months'),
  ('a4444444-4444-4444-4444-444444444444', 'active', 2400.00, NOW() - INTERVAL '6 months', NOW() + INTERVAL '6 months', NOW() - INTERVAL '6 months'),
  ('a5555555-5555-5555-5555-555555555555', 'trial', 2400.00, NOW() - INTERVAL '1 month', NOW() + INTERVAL '2 months', NOW() + INTERVAL '2 months');
