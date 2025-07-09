
import { db } from './db';
import { 
  users, agencies, courses, courseModules, quizzes, enrollments, 
  practicals, jobs, jobApplications, badges, userBadges, 
  courseReviews, contributorTasks, blogPosts 
} from '@shared/schema';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await db.delete(userBadges);
    await db.delete(courseReviews);
    await db.delete(jobApplications);
    await db.delete(practicals);
    await db.delete(enrollments);
    await db.delete(quizzes);
    await db.delete(courseModules);
    await db.delete(jobs);
    await db.delete(courses);
    await db.delete(contributorTasks);
    await db.delete(blogPosts);
    await db.delete(badges);
    await db.delete(agencies);
    await db.delete(users);

    // Seed Users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const insertedUsers = await db.insert(users).values([
      {
        email: 'admin@minutely.ai',
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        bio: 'Platform administrator',
        country: 'USA',
        xpPoints: 5000,
        level: 10,
        streak: 365,
        isVerified: true,
        referralCode: 'ADMIN001'
      },
      {
        email: 'sarah.chen@google.com',
        username: 'sarahchen',
        password: hashedPassword,
        role: 'learner',
        firstName: 'Sarah',
        lastName: 'Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150',
        bio: 'AI Engineer passionate about machine learning and deep learning',
        country: 'USA',
        xpPoints: 2500,
        level: 8,
        streak: 45,
        isVerified: true,
        referralCode: 'SARAH001'
      },
      {
        email: 'marcus.rodriguez@microsoft.com',
        username: 'marcusrod',
        password: hashedPassword,
        role: 'learner',
        firstName: 'Marcus',
        lastName: 'Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        bio: 'DevOps Lead specializing in cloud infrastructure',
        country: 'Spain',
        xpPoints: 3200,
        level: 9,
        streak: 120,
        isVerified: true,
        referralCode: 'MARCUS001'
      },
      {
        email: 'priya.patel@stripe.com',
        username: 'priyapatel',
        password: hashedPassword,
        role: 'learner',
        firstName: 'Priya',
        lastName: 'Patel',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        bio: 'Full-Stack Developer with expertise in React and Node.js',
        country: 'India',
        xpPoints: 1800,
        level: 6,
        streak: 30,
        isVerified: true,
        referralCode: 'PRIYA001'
      },
      {
        email: 'david.kim@openai.com',
        username: 'davidkim',
        password: hashedPassword,
        role: 'instructor',
        firstName: 'David',
        lastName: 'Kim',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        bio: 'ML Engineer and course instructor specializing in AI',
        country: 'South Korea',
        xpPoints: 4500,
        level: 12,
        streak: 200,
        isVerified: true,
        referralCode: 'DAVID001'
      },
      {
        email: 'emily.johnson@aws.com',
        username: 'emilyjohnson',
        password: hashedPassword,
        role: 'instructor',
        firstName: 'Emily',
        lastName: 'Johnson',
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
        bio: 'Cloud Architect with 10+ years of experience',
        country: 'Canada',
        xpPoints: 3800,
        level: 10,
        streak: 150,
        isVerified: true,
        referralCode: 'EMILY001'
      },
      {
        email: 'alex.thompson@startup.com',
        username: 'alexthompson',
        password: hashedPassword,
        role: 'agency',
        firstName: 'Alex',
        lastName: 'Thompson',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        bio: 'Startup CTO and entrepreneur',
        country: 'UK',
        xpPoints: 2200,
        level: 7,
        streak: 60,
        isVerified: true,
        referralCode: 'ALEX001'
      },
      {
        email: 'lisa.wang@techcorp.com',
        username: 'lisawang',
        password: hashedPassword,
        role: 'contributor',
        firstName: 'Lisa',
        lastName: 'Wang',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=150',
        bio: 'Data Scientist and content creator',
        country: 'China',
        xpPoints: 1500,
        level: 5,
        streak: 25,
        isVerified: true,
        referralCode: 'LISA001'
      },
      {
        email: 'mike.rodriguez@agency.com',
        username: 'mikerod',
        password: hashedPassword,
        role: 'agency',
        firstName: 'Mike',
        lastName: 'Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        bio: 'Digital agency founder',
        country: 'Mexico',
        xpPoints: 1200,
        level: 4,
        streak: 15,
        isVerified: true,
        referralCode: 'MIKE001'
      },
      {
        email: 'john.doe@learner.com',
        username: 'johndoe',
        password: hashedPassword,
        role: 'learner',
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        bio: 'Aspiring developer learning AI and web development',
        country: 'USA',
        xpPoints: 800,
        level: 3,
        streak: 10,
        isVerified: false,
        referralCode: 'JOHN001'
      }
    ]).returning();

    console.log('✅ Users seeded');

    // Seed Agencies
    const insertedAgencies = await db.insert(agencies).values([
      {
        userId: insertedUsers[6].id, // Alex Thompson
        companyName: 'TechStart Solutions',
        website: 'https://techstart.com',
        description: 'Innovative startup building AI-powered solutions',
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
        industry: 'Technology',
        size: 'startup',
        status: 'active',
        subscriptionTier: 'growth',
        billingCycle: 'yearly',
        totalSpent: '2500.00'
      },
      {
        userId: insertedUsers[8].id, // Mike Rodriguez
        companyName: 'Digital Innovations Agency',
        website: 'https://digitalinnovations.com',
        description: 'Full-service digital agency specializing in AI integration',
        logo: 'https://images.unsplash.com/photo-1560472355-109703aa3edc?w=200',
        industry: 'Marketing',
        size: 'medium',
        status: 'active',
        subscriptionTier: 'enterprise',
        billingCycle: 'monthly',
        totalSpent: '5000.00'
      }
    ]).returning();

    console.log('✅ Agencies seeded');

    // Seed Courses
    const insertedCourses = await db.insert(courses).values([
      {
        title: 'Complete AI Engineering Bootcamp',
        slug: 'ai-engineering-bootcamp',
        description: 'Master AI engineering from fundamentals to advanced applications. Build real-world AI systems.',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
        category: 'AI & Machine Learning',
        level: 'intermediate',
        duration: 1200, // 20 hours
        price: '199.99',
        instructorId: insertedUsers[4].id, // David Kim
        agencyId: insertedAgencies[0].id,
        status: 'published',
        rating: '4.8',
        totalEnrollments: 1250,
        xpReward: 500,
        tags: ['AI', 'Machine Learning', 'Python', 'TensorFlow'],
        requirements: ['Basic Python knowledge', 'Understanding of mathematics'],
        learningOutcomes: ['Build AI models', 'Deploy ML systems', 'Understand neural networks'],
        isSponsored: true,
        sponsorId: insertedAgencies[0].id
      },
      {
        title: 'DevOps Master Class',
        slug: 'devops-master-class',
        description: 'Learn modern DevOps practices, CI/CD, and cloud infrastructure management.',
        thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400',
        category: 'DevOps & Cloud',
        level: 'intermediate',
        duration: 900, // 15 hours
        price: '149.99',
        instructorId: insertedUsers[5].id, // Emily Johnson
        status: 'published',
        rating: '4.7',
        totalEnrollments: 980,
        xpReward: 400,
        tags: ['DevOps', 'AWS', 'Docker', 'Kubernetes'],
        requirements: ['Basic Linux knowledge', 'Understanding of web applications'],
        learningOutcomes: ['Set up CI/CD pipelines', 'Manage cloud infrastructure', 'Container orchestration']
      },
      {
        title: 'Full-Stack Development with AI',
        slug: 'fullstack-ai-development',
        description: 'Build modern web applications integrated with AI capabilities using React and Node.js.',
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
        category: 'Web Development',
        level: 'beginner',
        duration: 800, // 13+ hours
        price: '99.99',
        instructorId: insertedUsers[4].id, // David Kim
        status: 'published',
        rating: '4.9',
        totalEnrollments: 1500,
        xpReward: 350,
        tags: ['React', 'Node.js', 'AI Integration', 'JavaScript'],
        requirements: ['Basic HTML/CSS knowledge'],
        learningOutcomes: ['Build full-stack applications', 'Integrate AI APIs', 'Deploy web apps']
      },
      {
        title: 'Data Science with Python',
        slug: 'data-science-python',
        description: 'Analyze data and build predictive models using Python and popular libraries.',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
        category: 'Data Science',
        level: 'beginner',
        duration: 600, // 10 hours
        price: '79.99',
        instructorId: insertedUsers[7].id, // Lisa Wang
        status: 'published',
        rating: '4.6',
        totalEnrollments: 750,
        xpReward: 300,
        tags: ['Python', 'Pandas', 'Matplotlib', 'Data Analysis'],
        requirements: ['Basic Python knowledge'],
        learningOutcomes: ['Data manipulation', 'Statistical analysis', 'Data visualization']
      },
      {
        title: 'Cybersecurity Essentials',
        slug: 'cybersecurity-essentials',
        description: 'Learn the fundamentals of cybersecurity and ethical hacking.',
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
        category: 'Cybersecurity',
        level: 'beginner',
        duration: 480, // 8 hours
        price: '0.00',
        instructorId: insertedUsers[5].id, // Emily Johnson
        status: 'published',
        rating: '4.5',
        totalEnrollments: 2000,
        xpReward: 250,
        tags: ['Security', 'Ethical Hacking', 'Network Security'],
        requirements: ['Basic computer knowledge'],
        learningOutcomes: ['Security fundamentals', 'Threat identification', 'Basic penetration testing']
      },
      {
        title: 'Blockchain Development',
        slug: 'blockchain-development',
        description: 'Build decentralized applications on Ethereum and other blockchains.',
        thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
        category: 'Blockchain',
        level: 'advanced',
        duration: 1000, // 16+ hours
        price: '249.99',
        instructorId: insertedUsers[4].id, // David Kim
        status: 'published',
        rating: '4.8',
        totalEnrollments: 400,
        xpReward: 600,
        tags: ['Solidity', 'Ethereum', 'Smart Contracts', 'Web3'],
        requirements: ['Programming experience', 'Understanding of blockchain concepts'],
        learningOutcomes: ['Smart contract development', 'DApp creation', 'Blockchain deployment']
      }
    ]).returning();

    console.log('✅ Courses seeded');

    // Seed Course Modules
    const moduleData = [];
    insertedCourses.forEach((course, courseIndex) => {
      for (let i = 1; i <= 6; i++) {
        moduleData.push({
          courseId: course.id,
          title: `Module ${i}: ${course.title.split(' ')[0]} Fundamentals ${i}`,
          description: `Learn the core concepts of ${course.category} in this comprehensive module.`,
          orderIndex: i,
          duration: Math.floor(course.duration / 6),
          videoUrl: `https://example.com/video/${course.slug}/module-${i}`,
          content: `# Module ${i} Content\n\nThis module covers essential topics in ${course.category}.\n\n## Learning Objectives\n- Understand key concepts\n- Apply practical skills\n- Build real projects`,
          xpReward: 20
        });
      }
    });

    const insertedModules = await db.insert(courseModules).values(moduleData).returning();
    console.log('✅ Course modules seeded');

    // Seed Quizzes
    const quizData = insertedModules.map(module => ({
      moduleId: module.id,
      title: `${module.title} Quiz`,
      questions: [
        {
          question: "What is the main topic of this module?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct: 0
        },
        {
          question: "Which concept is most important?",
          options: ["Concept 1", "Concept 2", "Concept 3", "Concept 4"],
          correct: 1
        }
      ],
      passingScore: 70,
      xpReward: 50
    }));

    await db.insert(quizzes).values(quizData);
    console.log('✅ Quizzes seeded');

    // Seed Enrollments
    const enrollmentData = [
      { userId: insertedUsers[1].id, courseId: insertedCourses[0].id, progress: 75 },
      { userId: insertedUsers[2].id, courseId: insertedCourses[1].id, progress: 90 },
      { userId: insertedUsers[3].id, courseId: insertedCourses[2].id, progress: 60 },
      { userId: insertedUsers[1].id, courseId: insertedCourses[3].id, progress: 45 },
      { userId: insertedUsers[9].id, courseId: insertedCourses[4].id, progress: 30 },
      { userId: insertedUsers[1].id, courseId: insertedCourses[5].id, progress: 15 },
      { userId: insertedUsers[2].id, courseId: insertedCourses[0].id, progress: 100, completedAt: new Date() },
      { userId: insertedUsers[3].id, courseId: insertedCourses[1].id, progress: 100, completedAt: new Date() }
    ];

    await db.insert(enrollments).values(enrollmentData);
    console.log('✅ Enrollments seeded');

    // Seed Badges
    const badgeData = [
      {
        name: 'First Course Completed',
        description: 'Complete your first course',
        icon: '🎓',
        type: 'course_completion',
        criteria: { coursesCompleted: 1 },
        xpReward: 100,
        isActive: true
      },
      {
        name: 'Learning Streak',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        type: 'streak',
        criteria: { streakDays: 7 },
        xpReward: 150,
        isActive: true
      },
      {
        name: 'Project Master',
        description: 'Submit 5 practical projects',
        icon: '🚀',
        type: 'practical',
        criteria: { practicalSubmissions: 5 },
        xpReward: 200,
        isActive: true
      },
      {
        name: 'Community Contributor',
        description: 'Complete 3 contributor tasks',
        icon: '🤝',
        type: 'contribution',
        criteria: { tasksCompleted: 3 },
        xpReward: 250,
        isActive: true
      },
      {
        name: 'AI Specialist',
        description: 'Complete 3 AI-related courses',
        icon: '🤖',
        type: 'course_completion',
        criteria: { aiCoursesCompleted: 3 },
        xpReward: 300,
        isActive: true
      }
    ];

    const insertedBadges = await db.insert(badges).values(badgeData).returning();
    console.log('✅ Badges seeded');

    // Seed User Badges
    const userBadgeData = [
      { userId: insertedUsers[1].id, badgeId: insertedBadges[0].id },
      { userId: insertedUsers[2].id, badgeId: insertedBadges[0].id },
      { userId: insertedUsers[1].id, badgeId: insertedBadges[1].id },
      { userId: insertedUsers[2].id, badgeId: insertedBadges[2].id }
    ];

    await db.insert(userBadges).values(userBadgeData);
    console.log('✅ User badges seeded');

    // Seed Course Reviews
    const reviewData = [
      {
        courseId: insertedCourses[0].id,
        userId: insertedUsers[1].id,
        rating: 5,
        review: 'Excellent course! The AI concepts were explained clearly and the hands-on projects were very helpful.',
        isVerified: true
      },
      {
        courseId: insertedCourses[1].id,
        userId: insertedUsers[2].id,
        rating: 5,
        review: 'Best DevOps course I\'ve taken. The instructor knows their stuff and the content is up-to-date.',
        isVerified: true
      },
      {
        courseId: insertedCourses[2].id,
        userId: insertedUsers[3].id,
        rating: 5,
        review: 'Great introduction to full-stack development with AI. Perfect for beginners.',
        isVerified: true
      },
      {
        courseId: insertedCourses[0].id,
        userId: insertedUsers[9].id,
        rating: 4,
        review: 'Very comprehensive course. Would recommend to anyone interested in AI.',
        isVerified: false
      }
    ];

    await db.insert(courseReviews).values(reviewData);
    console.log('✅ Course reviews seeded');

    // Seed Jobs
    const jobData = [
      {
        agencyId: insertedAgencies[0].id,
        title: 'Senior AI Engineer',
        slug: 'senior-ai-engineer',
        description: 'Join our team to build cutting-edge AI solutions. We\'re looking for someone with strong ML background.',
        requirements: ['5+ years ML experience', 'Python expertise', 'Deep learning knowledge'],
        benefits: ['Remote work', 'Equity package', 'Health insurance'],
        location: 'San Francisco, CA',
        type: 'full-time',
        remote: true,
        salary: '$150,000 - $200,000',
        experience: 'senior',
        skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning'],
        status: 'active',
        applications: 25
      },
      {
        agencyId: insertedAgencies[1].id,
        title: 'DevOps Engineer',
        slug: 'devops-engineer',
        description: 'Help us scale our infrastructure and improve our deployment processes.',
        requirements: ['3+ years DevOps experience', 'AWS knowledge', 'Docker/Kubernetes'],
        benefits: ['Flexible hours', 'Learning budget', 'Team retreats'],
        location: 'Austin, TX',
        type: 'full-time',
        remote: false,
        salary: '$100,000 - $130,000',
        experience: 'mid',
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
        status: 'active',
        applications: 18
      },
      {
        agencyId: insertedAgencies[0].id,
        title: 'Full-Stack Developer Intern',
        slug: 'fullstack-intern',
        description: 'Great opportunity for students to gain real-world experience in full-stack development.',
        requirements: ['Computer Science student', 'React knowledge', 'Node.js basics'],
        benefits: ['Mentorship', 'Real projects', 'Potential full-time offer'],
        location: 'Remote',
        type: 'internship',
        remote: true,
        salary: '$20/hour',
        experience: 'entry',
        skills: ['React', 'Node.js', 'JavaScript', 'Git'],
        status: 'active',
        applications: 45
      }
    ];

    const insertedJobs = await db.insert(jobs).values(jobData).returning();
    console.log('✅ Jobs seeded');

    // Seed Job Applications
    const applicationData = [
      {
        jobId: insertedJobs[0].id,
        userId: insertedUsers[1].id,
        resume: 'https://example.com/resumes/sarah-chen.pdf',
        coverLetter: 'I am excited to apply for the Senior AI Engineer position...',
        portfolio: 'https://sarahchen.dev',
        status: 'pending'
      },
      {
        jobId: insertedJobs[1].id,
        userId: insertedUsers[2].id,
        resume: 'https://example.com/resumes/marcus-rodriguez.pdf',
        coverLetter: 'As a DevOps professional with 5+ years of experience...',
        portfolio: 'https://marcusdevops.com',
        status: 'reviewed'
      },
      {
        jobId: insertedJobs[2].id,
        userId: insertedUsers[9].id,
        resume: 'https://example.com/resumes/john-doe.pdf',
        coverLetter: 'I am a Computer Science student looking for internship opportunities...',
        portfolio: 'https://johndoe.github.io',
        status: 'pending'
      }
    ];

    await db.insert(jobApplications).values(applicationData);
    console.log('✅ Job applications seeded');

    // Seed Practicals
    const practicalData = [
      {
        userId: insertedUsers[1].id,
        courseId: insertedCourses[0].id,
        moduleId: insertedModules[0].id,
        title: 'AI Chatbot Implementation',
        description: 'Built a conversational AI chatbot using OpenAI API',
        submissionUrl: 'https://github.com/sarahchen/ai-chatbot',
        githubUrl: 'https://github.com/sarahchen/ai-chatbot',
        status: 'approved',
        score: 95,
        feedback: 'Excellent implementation with clean code and good documentation.',
        isUrlValid: true,
        isFeatured: true
      },
      {
        userId: insertedUsers[2].id,
        courseId: insertedCourses[1].id,
        moduleId: insertedModules[6].id,
        title: 'Kubernetes Deployment Pipeline',
        description: 'Created automated deployment pipeline using Kubernetes',
        submissionUrl: 'https://github.com/marcusrod/k8s-pipeline',
        githubUrl: 'https://github.com/marcusrod/k8s-pipeline',
        status: 'approved',
        score: 88,
        feedback: 'Great work on the automation. Consider adding more monitoring.',
        isUrlValid: true,
        isFeatured: false
      },
      {
        userId: insertedUsers[3].id,
        courseId: insertedCourses[2].id,
        moduleId: insertedModules[12].id,
        title: 'E-commerce React App',
        description: 'Full-stack e-commerce application with AI recommendations',
        submissionUrl: 'https://github.com/priyapatel/ecommerce-ai',
        githubUrl: 'https://github.com/priyapatel/ecommerce-ai',
        status: 'submitted',
        score: null,
        feedback: null,
        isUrlValid: true,
        isFeatured: false
      }
    ];

    await db.insert(practicals).values(practicalData);
    console.log('✅ Practicals seeded');

    // Seed Contributor Tasks
    const taskData = [
      {
        title: 'Update Course Content for React 18',
        description: 'Review and update course materials to reflect React 18 changes',
        type: 'content',
        difficulty: 'medium',
        xpReward: 200,
        status: 'open',
        createdBy: insertedUsers[0].id
      },
      {
        title: 'Design New Course Thumbnails',
        description: 'Create engaging thumbnail designs for 5 new courses',
        type: 'design',
        difficulty: 'easy',
        xpReward: 150,
        status: 'assigned',
        assignedTo: insertedUsers[7].id,
        createdBy: insertedUsers[0].id
      },
      {
        title: 'Implement Dark Mode',
        description: 'Add dark mode support to the platform UI',
        type: 'development',
        difficulty: 'hard',
        xpReward: 300,
        status: 'in_progress',
        assignedTo: insertedUsers[3].id,
        createdBy: insertedUsers[0].id
      },
      {
        title: 'Write Blog Post on AI Trends',
        description: 'Research and write comprehensive blog post about 2024 AI trends',
        type: 'content',
        difficulty: 'medium',
        xpReward: 180,
        status: 'completed',
        assignedTo: insertedUsers[7].id,
        createdBy: insertedUsers[0].id,
        submissionUrl: 'https://blog.minutely.ai/ai-trends-2024',
        feedback: 'Excellent research and writing. Great job!',
        completedAt: new Date()
      }
    ];

    await db.insert(contributorTasks).values(taskData);
    console.log('✅ Contributor tasks seeded');

    // Seed Blog Posts
    const blogData = [
      {
        title: 'The Future of AI in Education: How Minutely is Leading the Way',
        slug: 'future-ai-education',
        excerpt: 'Discover how AI is transforming education and why personalized learning is the future.',
        content: '# The Future of AI in Education\n\nArtificial Intelligence is revolutionizing education...',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
        authorId: insertedUsers[4].id,
        category: 'AI & Technology',
        tags: ['AI', 'Education', 'Future', 'Technology'],
        status: 'published',
        isSticky: true,
        viewCount: 2500,
        publishedAt: new Date('2024-01-15')
      },
      {
        title: 'Building Your First Neural Network: A Beginner\'s Guide',
        slug: 'building-first-neural-network',
        excerpt: 'Step-by-step tutorial on creating your first neural network using Python and TensorFlow.',
        content: '# Building Your First Neural Network\n\nNeural networks are the foundation of modern AI...',
        thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400',
        authorId: insertedUsers[7].id,
        category: 'Tutorials',
        tags: ['Neural Networks', 'Python', 'TensorFlow', 'Beginner'],
        status: 'published',
        isSticky: false,
        viewCount: 1800,
        publishedAt: new Date('2024-01-12')
      },
      {
        title: 'Career Transition: From Developer to AI Specialist',
        slug: 'developer-to-ai-specialist',
        excerpt: 'Real stories and practical advice from developers who successfully transitioned into AI.',
        content: '# Career Transition to AI\n\nMany developers are making the transition to AI...',
        thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400',
        authorId: insertedUsers[5].id,
        category: 'Career',
        tags: ['Career', 'AI Jobs', 'Transition', 'Professional Development'],
        status: 'published',
        isSticky: false,
        viewCount: 1200,
        publishedAt: new Date('2024-01-10')
      },
      {
        title: 'Top 10 AI Tools Every Developer Should Know in 2024',
        slug: 'top-ai-tools-2024',
        excerpt: 'Discover the essential AI tools that are shaping development and boosting productivity.',
        content: '# Top AI Tools for Developers\n\nThe AI landscape is evolving rapidly...',
        thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
        authorId: insertedUsers[4].id,
        category: 'Tools & Resources',
        tags: ['AI Tools', 'Development', 'Productivity', '2024'],
        status: 'published',
        isSticky: false,
        viewCount: 3200,
        publishedAt: new Date('2024-01-08')
      },
      {
        title: 'Understanding Large Language Models: GPT, BERT, and Beyond',
        slug: 'understanding-large-language-models',
        excerpt: 'Deep dive into LLM architecture and applications in natural language processing.',
        content: '# Understanding Large Language Models\n\nLarge Language Models have transformed NLP...',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
        authorId: insertedUsers[4].id,
        category: 'AI & Technology',
        tags: ['LLM', 'GPT', 'BERT', 'NLP', 'Deep Learning'],
        status: 'published',
        isSticky: false,
        viewCount: 2100,
        publishedAt: new Date('2024-01-05')
      }
    ];

    await db.insert(blogPosts).values(blogData);
    console.log('✅ Blog posts seeded');

    console.log('🎉 Database seeding completed successfully!');
    
    return {
      users: insertedUsers.length,
      agencies: insertedAgencies.length,
      courses: insertedCourses.length,
      modules: insertedModules.length,
      enrollments: enrollmentData.length,
      jobs: insertedJobs.length,
      badges: insertedBadges.length,
      blogs: blogData.length
    };

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}
