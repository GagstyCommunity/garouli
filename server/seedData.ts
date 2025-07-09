
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

    // Seed 10 Users with different roles
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const insertedUsers = await db.insert(users).values([
      // Admin users (2)
      {
        email: 'admin@minutely.ai',
        username: 'admin',
        password: hashedPassword,
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        bio: 'Platform administrator with full system access',
        country: 'USA',
        xpPoints: 10000,
        level: 15,
        streak: 365,
        isVerified: true,
        referralCode: 'ADMIN001'
      },
      {
        email: 'superadmin@minutely.ai',
        username: 'superadmin',
        password: hashedPassword,
        role: 'admin',
        firstName: 'Super',
        lastName: 'Admin',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        bio: 'Senior platform administrator',
        country: 'Canada',
        xpPoints: 12000,
        level: 18,
        streak: 400,
        isVerified: true,
        referralCode: 'ADMIN002'
      },
      // Instructors (2)
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
      // Agency users (2)
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
      // Learners (3)
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
      // Contributor (1)
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
      }
    ]).returning();

    console.log('✅ Users seeded');

    // Seed 10 Agencies
    const insertedAgencies = await db.insert(agencies).values([
      {
        userId: insertedUsers[4].id, // Alex Thompson
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
        userId: insertedUsers[5].id, // Mike Rodriguez
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
      },
      {
        userId: insertedUsers[0].id, // Admin as agency owner
        companyName: 'MinutelyAI Corp',
        website: 'https://minutely.ai',
        description: 'Leading AI education platform',
        logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200',
        industry: 'Education',
        size: 'large',
        status: 'active',
        subscriptionTier: 'enterprise',
        billingCycle: 'yearly',
        totalSpent: '15000.00'
      },
      {
        userId: insertedUsers[2].id, // David Kim
        companyName: 'AI Learning Hub',
        website: 'https://ailearninghub.com',
        description: 'Specialized AI and ML training company',
        logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200',
        industry: 'Technology',
        size: 'medium',
        status: 'active',
        subscriptionTier: 'growth',
        billingCycle: 'monthly',
        totalSpent: '3500.00'
      },
      {
        userId: insertedUsers[3].id, // Emily Johnson
        companyName: 'Cloud Masters Academy',
        website: 'https://cloudmasters.com',
        description: 'Premier cloud computing training provider',
        logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200',
        industry: 'Technology',
        size: 'medium',
        status: 'active',
        subscriptionTier: 'growth',
        billingCycle: 'yearly',
        totalSpent: '4200.00'
      },
      {
        userId: insertedUsers[6].id, // Sarah Chen
        companyName: 'Future Tech Innovations',
        website: 'https://futuretech.com',
        description: 'Cutting-edge technology solutions',
        logo: 'https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?w=200',
        industry: 'Technology',
        size: 'startup',
        status: 'trial',
        subscriptionTier: 'starter',
        billingCycle: 'monthly',
        totalSpent: '500.00'
      },
      {
        userId: insertedUsers[7].id, // Marcus Rodriguez
        companyName: 'DevOps Excellence',
        website: 'https://devopsexcellence.com',
        description: 'DevOps consulting and training',
        logo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=200',
        industry: 'Consulting',
        size: 'small',
        status: 'active',
        subscriptionTier: 'growth',
        billingCycle: 'monthly',
        totalSpent: '2800.00'
      },
      {
        userId: insertedUsers[8].id, // Priya Patel
        companyName: 'FullStack Academy',
        website: 'https://fullstackacademy.com',
        description: 'Complete web development training',
        logo: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=200',
        industry: 'Education',
        size: 'small',
        status: 'active',
        subscriptionTier: 'starter',
        billingCycle: 'yearly',
        totalSpent: '1200.00'
      },
      {
        userId: insertedUsers[9].id, // Lisa Wang
        companyName: 'Data Science Pro',
        website: 'https://datasciencepro.com',
        description: 'Professional data science training',
        logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200',
        industry: 'Data Science',
        size: 'small',
        status: 'active',
        subscriptionTier: 'growth',
        billingCycle: 'monthly',
        totalSpent: '1800.00'
      },
      {
        userId: insertedUsers[1].id, // Super Admin
        companyName: 'Tech Education Global',
        website: 'https://techeduglobal.com',
        description: 'Global technology education provider',
        logo: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=200',
        industry: 'Education',
        size: 'large',
        status: 'active',
        subscriptionTier: 'enterprise',
        billingCycle: 'yearly',
        totalSpent: '12000.00'
      }
    ]).returning();

    console.log('✅ Agencies seeded');

    // Seed 10 Courses
    const insertedCourses = await db.insert(courses).values([
      {
        title: 'Complete AI Engineering Bootcamp',
        slug: 'ai-engineering-bootcamp',
        description: 'Master AI engineering from fundamentals to advanced applications. Build real-world AI systems.',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
        category: 'AI & Machine Learning',
        level: 'intermediate',
        duration: 1200,
        price: '199.99',
        instructorId: insertedUsers[2].id, // David Kim
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
        duration: 900,
        price: '149.99',
        instructorId: insertedUsers[3].id, // Emily Johnson
        agencyId: insertedAgencies[1].id,
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
        duration: 800,
        price: '99.99',
        instructorId: insertedUsers[2].id, // David Kim
        agencyId: insertedAgencies[2].id,
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
        duration: 600,
        price: '79.99',
        instructorId: insertedUsers[9].id, // Lisa Wang
        agencyId: insertedAgencies[3].id,
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
        duration: 480,
        price: '0.00',
        instructorId: insertedUsers[3].id, // Emily Johnson
        agencyId: insertedAgencies[4].id,
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
        duration: 1000,
        price: '249.99',
        instructorId: insertedUsers[2].id, // David Kim
        agencyId: insertedAgencies[5].id,
        status: 'published',
        rating: '4.8',
        totalEnrollments: 400,
        xpReward: 600,
        tags: ['Solidity', 'Ethereum', 'Smart Contracts', 'Web3'],
        requirements: ['Programming experience', 'Understanding of blockchain concepts'],
        learningOutcomes: ['Smart contract development', 'DApp creation', 'Blockchain deployment']
      },
      {
        title: 'Mobile App Development with Flutter',
        slug: 'flutter-mobile-development',
        description: 'Create beautiful cross-platform mobile apps using Flutter and Dart.',
        thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
        category: 'Mobile Development',
        level: 'intermediate',
        duration: 720,
        price: '129.99',
        instructorId: insertedUsers[2].id, // David Kim
        agencyId: insertedAgencies[6].id,
        status: 'published',
        rating: '4.7',
        totalEnrollments: 650,
        xpReward: 380,
        tags: ['Flutter', 'Dart', 'Mobile', 'Cross-platform'],
        requirements: ['Basic programming knowledge', 'Understanding of OOP'],
        learningOutcomes: ['Build mobile apps', 'Publish to app stores', 'Handle device features']
      },
      {
        title: 'Advanced JavaScript and TypeScript',
        slug: 'advanced-javascript-typescript',
        description: 'Master advanced JavaScript concepts and TypeScript for modern development.',
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
        category: 'Programming',
        level: 'advanced',
        duration: 540,
        price: '89.99',
        instructorId: insertedUsers[3].id, // Emily Johnson
        agencyId: insertedAgencies[7].id,
        status: 'published',
        rating: '4.9',
        totalEnrollments: 890,
        xpReward: 320,
        tags: ['JavaScript', 'TypeScript', 'ES6+', 'Advanced'],
        requirements: ['Solid JavaScript foundation', '1+ years experience'],
        learningOutcomes: ['Master advanced JS patterns', 'TypeScript proficiency', 'Modern development practices']
      },
      {
        title: 'Cloud Architecture with AWS',
        slug: 'aws-cloud-architecture',
        description: 'Design and implement scalable cloud solutions using Amazon Web Services.',
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
        category: 'Cloud Computing',
        level: 'intermediate',
        duration: 960,
        price: '179.99',
        instructorId: insertedUsers[3].id, // Emily Johnson
        agencyId: insertedAgencies[8].id,
        status: 'published',
        rating: '4.8',
        totalEnrollments: 720,
        xpReward: 450,
        tags: ['AWS', 'Cloud Architecture', 'Scalability', 'Infrastructure'],
        requirements: ['Basic cloud knowledge', 'Understanding of networking'],
        learningOutcomes: ['Design cloud solutions', 'Implement AWS services', 'Optimize costs']
      },
      {
        title: 'Machine Learning Operations (MLOps)',
        slug: 'mlops-machine-learning-operations',
        description: 'Learn to deploy, monitor, and maintain ML models in production environments.',
        thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
        category: 'AI & Machine Learning',
        level: 'advanced',
        duration: 840,
        price: '199.99',
        instructorId: insertedUsers[2].id, // David Kim
        agencyId: insertedAgencies[9].id,
        status: 'published',
        rating: '4.9',
        totalEnrollments: 380,
        xpReward: 500,
        tags: ['MLOps', 'Machine Learning', 'Production', 'Monitoring'],
        requirements: ['ML experience', 'Python proficiency', 'DevOps basics'],
        learningOutcomes: ['Deploy ML models', 'Monitor model performance', 'Automated ML pipelines']
      }
    ]).returning();

    console.log('✅ Courses seeded');

    // Seed Course Modules (10 per course)
    const moduleData = [];
    insertedCourses.forEach((course, courseIndex) => {
      for (let i = 1; i <= 10; i++) {
        moduleData.push({
          courseId: course.id,
          title: `Module ${i}: ${course.title.split(' ')[0]} ${['Fundamentals', 'Basics', 'Advanced Topics', 'Practical Applications', 'Real-world Projects', 'Best Practices', 'Industry Standards', 'Case Studies', 'Optimization', 'Final Project'][i-1]}`,
          description: `Comprehensive module covering ${course.category} concepts and practical implementations.`,
          orderIndex: i,
          duration: Math.floor(course.duration / 10),
          videoUrl: `https://example.com/video/${course.slug}/module-${i}`,
          content: `# Module ${i} Content\n\nThis module covers essential topics in ${course.category}.\n\n## Learning Objectives\n- Understand key concepts\n- Apply practical skills\n- Build real projects\n\n## Topics Covered\n1. Core principles\n2. Implementation strategies\n3. Best practices\n4. Real-world examples`,
          xpReward: 25
        });
      }
    });

    const insertedModules = await db.insert(courseModules).values(moduleData).returning();
    console.log('✅ Course modules seeded');

    // Seed Enhanced Quizzes with 50 questions each
    const quizData = insertedModules.map((module, index) => {
      // Generate 50 questions per quiz
      const questions = [];
      for (let i = 1; i <= 50; i++) {
        questions.push({
          question: `Question ${i}: What is the key concept related to ${module.title}?`,
          options: [
            `Option A for question ${i}`,
            `Option B for question ${i}`,
            `Option C for question ${i}`,
            `Option D for question ${i}`
          ],
          correct: i % 4, // Distribute correct answers
          explanation: `This is the correct answer for question ${i} because it demonstrates the core principle of the module.`,
          points: 2 // Each question worth 2 marks
        });
      }

      return {
        moduleId: module.id,
        title: `${module.title} Assessment Quiz`,
        questions: questions,
        passingScore: 70, // 70 marks out of 100 (50 questions × 2 marks)
        xpReward: 100
      };
    });

    await db.insert(quizzes).values(quizData);
    console.log('✅ Enhanced quizzes seeded (50 questions each, 2 marks per question, 70% pass)');

    // Seed 10 Enrollments
    const enrollmentData = [
      { userId: insertedUsers[6].id, courseId: insertedCourses[0].id, progress: 75 },
      { userId: insertedUsers[7].id, courseId: insertedCourses[1].id, progress: 90 },
      { userId: insertedUsers[8].id, courseId: insertedCourses[2].id, progress: 60 },
      { userId: insertedUsers[6].id, courseId: insertedCourses[3].id, progress: 45 },
      { userId: insertedUsers[7].id, courseId: insertedCourses[4].id, progress: 100, completedAt: new Date() },
      { userId: insertedUsers[8].id, courseId: insertedCourses[5].id, progress: 85 },
      { userId: insertedUsers[6].id, courseId: insertedCourses[6].id, progress: 30 },
      { userId: insertedUsers[7].id, courseId: insertedCourses[7].id, progress: 100, completedAt: new Date() },
      { userId: insertedUsers[8].id, courseId: insertedCourses[8].id, progress: 55 },
      { userId: insertedUsers[9].id, courseId: insertedCourses[9].id, progress: 40 }
    ];

    await db.insert(enrollments).values(enrollmentData);
    console.log('✅ Enrollments seeded');

    // Seed 10 Badges
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
        name: 'Learning Streak Master',
        description: 'Maintain a 30-day learning streak',
        icon: '🔥',
        type: 'streak',
        criteria: { streakDays: 30 },
        xpReward: 200,
        isActive: true
      },
      {
        name: 'Project Showcase Star',
        description: 'Submit 10 practical projects',
        icon: '⭐',
        type: 'practical',
        criteria: { practicalSubmissions: 10 },
        xpReward: 300,
        isActive: true
      },
      {
        name: 'Community Contributor',
        description: 'Complete 5 contributor tasks',
        icon: '🤝',
        type: 'contribution',
        criteria: { tasksCompleted: 5 },
        xpReward: 250,
        isActive: true
      },
      {
        name: 'AI Specialist',
        description: 'Complete 3 AI-related courses',
        icon: '🤖',
        type: 'course_completion',
        criteria: { aiCoursesCompleted: 3 },
        xpReward: 400,
        isActive: true
      },
      {
        name: 'Quiz Master',
        description: 'Pass 20 quizzes with 90%+ score',
        icon: '🧠',
        type: 'quiz',
        criteria: { highScoreQuizzes: 20 },
        xpReward: 300,
        isActive: true
      },
      {
        name: 'Code Warrior',
        description: 'Complete 5 coding challenges',
        icon: '⚔️',
        type: 'practical',
        criteria: { codingChallenges: 5 },
        xpReward: 350,
        isActive: true
      },
      {
        name: 'Knowledge Seeker',
        description: 'Complete courses in 3 different categories',
        icon: '📚',
        type: 'course_completion',
        criteria: { categoriesCompleted: 3 },
        xpReward: 400,
        isActive: true
      },
      {
        name: 'Mentor',
        description: 'Help 15 fellow learners',
        icon: '👨‍🏫',
        type: 'contribution',
        criteria: { helpCount: 15 },
        xpReward: 500,
        isActive: true
      },
      {
        name: 'Innovation Champion',
        description: 'Create innovative project solutions',
        icon: '💡',
        type: 'practical',
        criteria: { innovativeProjects: 3 },
        xpReward: 600,
        isActive: true
      }
    ];

    const insertedBadges = await db.insert(badges).values(badgeData).returning();
    console.log('✅ Badges seeded');

    // Seed 10 User Badges
    const userBadgeData = [
      { userId: insertedUsers[6].id, badgeId: insertedBadges[0].id },
      { userId: insertedUsers[7].id, badgeId: insertedBadges[0].id },
      { userId: insertedUsers[8].id, badgeId: insertedBadges[1].id },
      { userId: insertedUsers[6].id, badgeId: insertedBadges[2].id },
      { userId: insertedUsers[7].id, badgeId: insertedBadges[3].id },
      { userId: insertedUsers[8].id, badgeId: insertedBadges[4].id },
      { userId: insertedUsers[9].id, badgeId: insertedBadges[5].id },
      { userId: insertedUsers[6].id, badgeId: insertedBadges[6].id },
      { userId: insertedUsers[7].id, badgeId: insertedBadges[7].id },
      { userId: insertedUsers[8].id, badgeId: insertedBadges[8].id }
    ];

    await db.insert(userBadges).values(userBadgeData);
    console.log('✅ User badges seeded');

    // Seed 10 Course Reviews
    const reviewData = [
      {
        courseId: insertedCourses[0].id,
        userId: insertedUsers[6].id,
        rating: 5,
        review: 'Outstanding AI course! The instructor explains complex concepts clearly and the hands-on projects are incredibly valuable.',
        isVerified: true
      },
      {
        courseId: insertedCourses[1].id,
        userId: insertedUsers[7].id,
        rating: 5,
        review: 'Best DevOps course I have taken. Practical, up-to-date, and excellent instructor knowledge.',
        isVerified: true
      },
      {
        courseId: insertedCourses[2].id,
        userId: insertedUsers[8].id,
        rating: 5,
        review: 'Perfect introduction to full-stack development with AI integration. Highly recommended for beginners.',
        isVerified: true
      },
      {
        courseId: insertedCourses[3].id,
        userId: insertedUsers[6].id,
        rating: 4,
        review: 'Comprehensive data science course with excellent Python coverage and real-world datasets.',
        isVerified: true
      },
      {
        courseId: insertedCourses[4].id,
        userId: insertedUsers[7].id,
        rating: 4,
        review: 'Great cybersecurity fundamentals course. Free and high-quality content.',
        isVerified: false
      },
      {
        courseId: insertedCourses[5].id,
        userId: insertedUsers[8].id,
        rating: 5,
        review: 'Advanced blockchain course with excellent smart contract examples and real deployment scenarios.',
        isVerified: true
      },
      {
        courseId: insertedCourses[6].id,
        userId: insertedUsers[9].id,
        rating: 4,
        review: 'Solid Flutter course with good mobile development practices and cross-platform insights.',
        isVerified: true
      },
      {
        courseId: insertedCourses[7].id,
        userId: insertedUsers[6].id,
        rating: 5,
        review: 'Excellent advanced JavaScript and TypeScript course. Perfect for experienced developers.',
        isVerified: true
      },
      {
        courseId: insertedCourses[8].id,
        userId: insertedUsers[7].id,
        rating: 5,
        review: 'Top-notch AWS cloud architecture course with practical labs and real-world scenarios.',
        isVerified: true
      },
      {
        courseId: insertedCourses[9].id,
        userId: insertedUsers[8].id,
        rating: 5,
        review: 'Advanced MLOps course covering production ML deployment, monitoring, and best practices.',
        isVerified: true
      }
    ];

    await db.insert(courseReviews).values(reviewData);
    console.log('✅ Course reviews seeded');

    // Seed 10 Jobs
    const jobData = [
      {
        agencyId: insertedAgencies[0].id,
        title: 'Senior AI Engineer',
        slug: 'senior-ai-engineer',
        description: 'Join our team to build cutting-edge AI solutions. We are looking for someone with strong ML background.',
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
        agencyId: insertedAgencies[2].id,
        title: 'Full-Stack Developer',
        slug: 'fullstack-developer',
        description: 'Build amazing web applications with modern technologies and AI integration.',
        requirements: ['React expertise', 'Node.js proficiency', 'Database knowledge'],
        benefits: ['Stock options', 'Professional development', 'Work-life balance'],
        location: 'New York, NY',
        type: 'full-time',
        remote: true,
        salary: '$120,000 - $150,000',
        experience: 'mid',
        skills: ['React', 'Node.js', 'JavaScript', 'MongoDB'],
        status: 'active',
        applications: 32
      },
      {
        agencyId: insertedAgencies[3].id,
        title: 'Data Scientist',
        slug: 'data-scientist',
        description: 'Analyze complex datasets and build predictive models for business insights.',
        requirements: ['Python proficiency', 'Statistical knowledge', 'ML experience'],
        benefits: ['Research time', 'Conference budget', 'Flexible schedule'],
        location: 'Seattle, WA',
        type: 'full-time',
        remote: true,
        salary: '$110,000 - $140,000',
        experience: 'mid',
        skills: ['Python', 'R', 'SQL', 'Machine Learning'],
        status: 'active',
        applications: 22
      },
      {
        agencyId: insertedAgencies[4].id,
        title: 'Cybersecurity Analyst',
        slug: 'cybersecurity-analyst',
        description: 'Protect our systems and investigate security incidents.',
        requirements: ['Security certifications', 'Network knowledge', 'Incident response'],
        benefits: ['Security clearance', 'Training budget', 'Health benefits'],
        location: 'Washington, DC',
        type: 'full-time',
        remote: false,
        salary: '$90,000 - $120,000',
        experience: 'mid',
        skills: ['Security', 'Network', 'SIEM', 'Incident Response'],
        status: 'active',
        applications: 15
      },
      {
        agencyId: insertedAgencies[5].id,
        title: 'Blockchain Developer',
        slug: 'blockchain-developer',
        description: 'Develop smart contracts and decentralized applications.',
        requirements: ['Solidity expertise', 'Web3 knowledge', 'DApp development'],
        benefits: ['Token rewards', 'Cutting-edge tech', 'Global team'],
        location: 'Remote',
        type: 'contract',
        remote: true,
        salary: '$80 - $120/hour',
        experience: 'senior',
        skills: ['Solidity', 'Ethereum', 'Web3', 'Smart Contracts'],
        status: 'active',
        applications: 12
      },
      {
        agencyId: insertedAgencies[6].id,
        title: 'Mobile App Developer',
        slug: 'mobile-app-developer',
        description: 'Create beautiful mobile applications using Flutter and React Native.',
        requirements: ['Flutter/React Native', 'Mobile UI/UX', 'App store experience'],
        benefits: ['Device allowance', 'Flexible hours', 'Learning opportunities'],
        location: 'Los Angeles, CA',
        type: 'full-time',
        remote: true,
        salary: '$95,000 - $125,000',
        experience: 'mid',
        skills: ['Flutter', 'React Native', 'Mobile Development', 'UI/UX'],
        status: 'active',
        applications: 28
      },
      {
        agencyId: insertedAgencies[7].id,
        title: 'Frontend Developer',
        slug: 'frontend-developer',
        description: 'Build responsive and interactive user interfaces with modern frameworks.',
        requirements: ['React/Vue expertise', 'TypeScript', 'CSS frameworks'],
        benefits: ['Creative freedom', 'Modern stack', 'Growth opportunities'],
        location: 'Chicago, IL',
        type: 'full-time',
        remote: true,
        salary: '$85,000 - $110,000',
        experience: 'mid',
        skills: ['React', 'TypeScript', 'CSS', 'JavaScript'],
        status: 'active',
        applications: 35
      },
      {
        agencyId: insertedAgencies[8].id,
        title: 'Cloud Architect',
        slug: 'cloud-architect',
        description: 'Design and implement scalable cloud solutions and infrastructure.',
        requirements: ['AWS/Azure expertise', 'Architecture experience', 'DevOps knowledge'],
        benefits: ['Certification support', 'Conference attendance', 'Leadership role'],
        location: 'Denver, CO',
        type: 'full-time',
        remote: false,
        salary: '$140,000 - $180,000',
        experience: 'senior',
        skills: ['AWS', 'Azure', 'Architecture', 'DevOps'],
        status: 'active',
        applications: 20
      },
      {
        agencyId: insertedAgencies[9].id,
        title: 'MLOps Engineer',
        slug: 'mlops-engineer',
        description: 'Deploy and maintain machine learning models in production environments.',
        requirements: ['ML deployment', 'Docker/Kubernetes', 'CI/CD pipelines'],
        benefits: ['Cutting-edge tech', 'Research collaboration', 'Performance bonuses'],
        location: 'Boston, MA',
        type: 'full-time',
        remote: true,
        salary: '$130,000 - $160,000',
        experience: 'senior',
        skills: ['MLOps', 'Python', 'Kubernetes', 'CI/CD'],
        status: 'active',
        applications: 18
      }
    ];

    const insertedJobs = await db.insert(jobs).values(jobData).returning();
    console.log('✅ Jobs seeded');

    // Seed 10 Job Applications
    const applicationData = [
      {
        jobId: insertedJobs[0].id,
        userId: insertedUsers[6].id,
        resume: 'https://example.com/resumes/sarah-chen.pdf',
        coverLetter: 'I am excited to apply for the Senior AI Engineer position. My experience with machine learning...',
        portfolio: 'https://sarahchen.dev',
        status: 'pending'
      },
      {
        jobId: insertedJobs[1].id,
        userId: insertedUsers[7].id,
        resume: 'https://example.com/resumes/marcus-rodriguez.pdf',
        coverLetter: 'As a DevOps professional with 5+ years of experience...',
        portfolio: 'https://marcusdevops.com',
        status: 'reviewed'
      },
      {
        jobId: insertedJobs[2].id,
        userId: insertedUsers[8].id,
        resume: 'https://example.com/resumes/priya-patel.pdf',
        coverLetter: 'I am passionate about full-stack development and would love to join your team...',
        portfolio: 'https://priyapatel.dev',
        status: 'accepted'
      },
      {
        jobId: insertedJobs[3].id,
        userId: insertedUsers[9].id,
        resume: 'https://example.com/resumes/lisa-wang.pdf',
        coverLetter: 'My data science background makes me a perfect fit for this role...',
        portfolio: 'https://lisawang.data',
        status: 'pending'
      },
      {
        jobId: insertedJobs[4].id,
        userId: insertedUsers[6].id,
        resume: 'https://example.com/resumes/sarah-chen-security.pdf',
        coverLetter: 'I am interested in transitioning to cybersecurity...',
        portfolio: 'https://sarahchen.security',
        status: 'rejected'
      },
      {
        jobId: insertedJobs[5].id,
        userId: insertedUsers[7].id,
        resume: 'https://example.com/resumes/marcus-blockchain.pdf',
        coverLetter: 'Blockchain development is my passion and I have extensive Solidity experience...',
        portfolio: 'https://marcusblockchain.eth',
        status: 'pending'
      },
      {
        jobId: insertedJobs[6].id,
        userId: insertedUsers[8].id,
        resume: 'https://example.com/resumes/priya-mobile.pdf',
        coverLetter: 'I love creating beautiful mobile experiences with Flutter...',
        portfolio: 'https://priyamobile.app',
        status: 'reviewed'
      },
      {
        jobId: insertedJobs[7].id,
        userId: insertedUsers[9].id,
        resume: 'https://example.com/resumes/lisa-frontend.pdf',
        coverLetter: 'Frontend development is where I excel, especially with React and TypeScript...',
        portfolio: 'https://lisafrontend.dev',
        status: 'pending'
      },
      {
        jobId: insertedJobs[8].id,
        userId: insertedUsers[6].id,
        resume: 'https://example.com/resumes/sarah-cloud.pdf',
        coverLetter: 'Cloud architecture is my specialty with extensive AWS experience...',
        portfolio: 'https://sarahcloud.aws',
        status: 'accepted'
      },
      {
        jobId: insertedJobs[9].id,
        userId: insertedUsers[7].id,
        resume: 'https://example.com/resumes/marcus-mlops.pdf',
        coverLetter: 'MLOps combines my DevOps and ML interests perfectly...',
        portfolio: 'https://marcusmlops.ai',
        status: 'reviewed'
      }
    ];

    await db.insert(jobApplications).values(applicationData);
    console.log('✅ Job applications seeded');

    // Seed 10 Practicals
    const practicalData = [
      {
        userId: insertedUsers[6].id,
        courseId: insertedCourses[0].id,
        moduleId: insertedModules[0].id,
        title: 'AI Chatbot with Natural Language Processing',
        description: 'Built a conversational AI chatbot using OpenAI API with sentiment analysis and context awareness.',
        submissionUrl: 'https://github.com/sarahchen/ai-chatbot-nlp',
        githubUrl: 'https://github.com/sarahchen/ai-chatbot-nlp',
        status: 'featured',
        score: 98,
        feedback: 'Outstanding implementation with excellent NLP integration and user experience. Featured project!',
        isUrlValid: true,
        isFeatured: true
      },
      {
        userId: insertedUsers[7].id,
        courseId: insertedCourses[1].id,
        moduleId: insertedModules[10].id,
        title: 'Kubernetes Auto-scaling Pipeline',
        description: 'Created automated deployment pipeline with Kubernetes auto-scaling and monitoring.',
        submissionUrl: 'https://github.com/marcusrod/k8s-autoscale-pipeline',
        githubUrl: 'https://github.com/marcusrod/k8s-autoscale-pipeline',
        status: 'approved',
        score: 92,
        feedback: 'Excellent DevOps implementation with comprehensive monitoring and scaling strategies.',
        isUrlValid: true,
        isFeatured: false
      },
      {
        userId: insertedUsers[8].id,
        courseId: insertedCourses[2].id,
        moduleId: insertedModules[20].id,
        title: 'E-commerce Platform with AI Recommendations',
        description: 'Full-stack e-commerce application with AI-powered product recommendations and payment integration.',
        submissionUrl: 'https://github.com/priyapatel/ecommerce-ai-recommendations',
        githubUrl: 'https://github.com/priyapatel/ecommerce-ai-recommendations',
        status: 'approved',
        score: 95,
        feedback: 'Impressive full-stack implementation with sophisticated AI recommendation engine.',
        isUrlValid: true,
        isFeatured: true
      },
      {
        userId: insertedUsers[9].id,
        courseId: insertedCourses[3].id,
        moduleId: insertedModules[30].id,
        title: 'Customer Churn Prediction Model',
        description: 'Machine learning model to predict customer churn using advanced feature engineering.',
        submissionUrl: 'https://github.com/lisawang/customer-churn-prediction',
        githubUrl: 'https://github.com/lisawang/customer-churn-prediction',
        status: 'approved',
        score: 89,
        feedback: 'Good data science approach with solid feature engineering and model validation.',
        isUrlValid: true,
        isFeatured: false
      },
      {
        userId: insertedUsers[6].id,
        courseId: insertedCourses[4].id,
        moduleId: insertedModules[40].id,
        title: 'Network Security Scanner',
        description: 'Python-based network security scanner with vulnerability detection and reporting.',
        submissionUrl: 'https://github.com/sarahchen/network-security-scanner',
        githubUrl: 'https://github.com/sarahchen/network-security-scanner',
        status: 'approved',
        score: 87,
        feedback: 'Well-implemented security tool with comprehensive scanning capabilities.',
        isUrlValid: true,
        isFeatured: false
      },
      {
        userId: insertedUsers[7].id,
        courseId: insertedCourses[5].id,
        moduleId: insertedModules[50].id,
        title: 'DeFi Lending Protocol',
        description: 'Decentralized finance lending protocol with smart contracts and web3 interface.',
        submissionUrl: 'https://github.com/marcusrod/defi-lending-protocol',
        githubUrl: 'https://github.com/marcusrod/defi-lending-protocol',
        status: 'featured',
        score: 96,
        feedback: 'Exceptional blockchain implementation with sophisticated DeFi mechanics. Featured project!',
        isUrlValid: true,
        isFeatured: true
      },
      {
        userId: insertedUsers[8].id,
        courseId: insertedCourses[6].id,
        moduleId: insertedModules[60].id,
        title: 'Fitness Tracking Mobile App',
        description: 'Cross-platform fitness tracking app with Flutter, workout plans, and progress analytics.',
        submissionUrl: 'https://github.com/priyapatel/fitness-tracker-flutter',
        githubUrl: 'https://github.com/priyapatel/fitness-tracker-flutter',
        status: 'approved',
        score: 91,
        feedback: 'Great mobile app with intuitive UI and comprehensive fitness tracking features.',
        isUrlValid: true,
        isFeatured: false
      },
      {
        userId: insertedUsers[9].id,
        courseId: insertedCourses[7].id,
        moduleId: insertedModules[70].id,
        title: 'Real-time Collaboration Platform',
        description: 'Real-time collaborative workspace using TypeScript, WebSockets, and advanced state management.',
        submissionUrl: 'https://github.com/lisawang/realtime-collaboration-platform',
        githubUrl: 'https://github.com/lisawang/realtime-collaboration-platform',
        status: 'approved',
        score: 94,
        feedback: 'Advanced TypeScript implementation with excellent real-time collaboration features.',
        isUrlValid: true,
        isFeatured: true
      },
      {
        userId: insertedUsers[6].id,
        courseId: insertedCourses[8].id,
        moduleId: insertedModules[80].id,
        title: 'Serverless Microservices Architecture',
        description: 'AWS Lambda-based microservices with API Gateway, DynamoDB, and CloudWatch monitoring.',
        submissionUrl: 'https://github.com/sarahchen/serverless-microservices',
        githubUrl: 'https://github.com/sarahchen/serverless-microservices',
        status: 'approved',
        score: 93,
        feedback: 'Excellent cloud architecture with well-designed serverless microservices pattern.',
        isUrlValid: true,
        isFeatured: false
      },
      {
        userId: insertedUsers[7].id,
        courseId: insertedCourses[9].id,
        moduleId: insertedModules[90].id,
        title: 'MLOps Pipeline for Computer Vision',
        description: 'End-to-end MLOps pipeline for computer vision model deployment with automated retraining.',
        submissionUrl: 'https://github.com/marcusrod/mlops-computer-vision',
        githubUrl: 'https://github.com/marcusrod/mlops-computer-vision',
        status: 'featured',
        score: 97,
        feedback: 'Outstanding MLOps implementation with sophisticated automation and monitoring. Featured project!',
        isUrlValid: true,
        isFeatured: true
      }
    ];

    await db.insert(practicals).values(practicalData);
    console.log('✅ Practicals seeded');

    // Seed 10 Contributor Tasks
    const taskData = [
      {
        title: 'Update React Documentation for Version 18',
        description: 'Review and update all React course documentation to reflect React 18 features and best practices.',
        type: 'content',
        difficulty: 'medium',
        xpReward: 200,
        status: 'open',
        createdBy: insertedUsers[0].id
      },
      {
        title: 'Design New Course Thumbnail Templates',
        description: 'Create 10 modern, engaging thumbnail templates for different course categories.',
        type: 'design',
        difficulty: 'easy',
        xpReward: 150,
        status: 'assigned',
        assignedTo: insertedUsers[9].id,
        createdBy: insertedUsers[0].id
      },
      {
        title: 'Implement Dark Mode for Platform',
        description: 'Add comprehensive dark mode support throughout the platform with user preference persistence.',
        type: 'development',
        difficulty: 'hard',
        xpReward: 400,
        status: 'in_progress',
        assignedTo: insertedUsers[8].id,
        createdBy: insertedUsers[1].id
      },
      {
        title: 'Write AI Trends 2024 Blog Series',
        description: 'Research and write a comprehensive 5-part blog series about emerging AI trends.',
        type: 'content',
        difficulty: 'medium',
        xpReward: 300,
        status: 'completed',
        assignedTo: insertedUsers[9].id,
        createdBy: insertedUsers[0].id,
        submissionUrl: 'https://blog.minutely.ai/ai-trends-2024-series',
        feedback: 'Excellent research and writing quality. Great insights on emerging AI trends.',
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Create Interactive Code Playground',
        description: 'Develop an interactive code editor with syntax highlighting and real-time execution.',
        type: 'development',
        difficulty: 'hard',
        xpReward: 500,
        status: 'assigned',
        assignedTo: insertedUsers[7].id,
        createdBy: insertedUsers[1].id
      },
      {
        title: 'Optimize Database Query Performance',
        description: 'Analyze and optimize slow database queries across the platform for better performance.',
        type: 'development',
        difficulty: 'medium',
        xpReward: 250,
        status: 'open',
        createdBy: insertedUsers[0].id
      },
      {
        title: 'Create Mobile App UI/UX Guidelines',
        description: 'Develop comprehensive UI/UX guidelines for mobile app development courses.',
        type: 'design',
        difficulty: 'medium',
        xpReward: 220,
        status: 'in_progress',
        assignedTo: insertedUsers[8].id,
        createdBy: insertedUsers[2].id
      },
      {
        title: 'Build Automated Testing Framework',
        description: 'Create comprehensive automated testing framework for course content validation.',
        type: 'development',
        difficulty: 'hard',
        xpReward: 450,
        status: 'open',
        createdBy: insertedUsers[1].id
      },
      {
        title: 'Develop MLOps Best Practices Guide',
        description: 'Write detailed guide covering MLOps best practices and implementation strategies.',
        type: 'content',
        difficulty: 'hard',
        xpReward: 350,
        status: 'assigned',
        assignedTo: insertedUsers[6].id,
        createdBy: insertedUsers[2].id
      },
      {
        title: 'Create Accessibility Audit Tool',
        description: 'Develop tool to automatically audit platform accessibility and generate improvement reports.',
        type: 'development',
        difficulty: 'medium',
        xpReward: 280,
        status: 'completed',
        assignedTo: insertedUsers[7].id,
        createdBy: insertedUsers[0].id,
        submissionUrl: 'https://github.com/minutely/accessibility-audit-tool',
        feedback: 'Great tool with comprehensive accessibility checks. Very useful for platform improvement.',
        completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      }
    ];

    await db.insert(contributorTasks).values(taskData);
    console.log('✅ Contributor tasks seeded');

    // Seed 10 Blog Posts
    const blogData = [
      {
        title: 'The Future of AI in Education: Transforming Learning Experiences',
        slug: 'future-ai-education-transforming-learning',
        excerpt: 'Explore how artificial intelligence is revolutionizing education and creating personalized learning experiences.',
        content: '# The Future of AI in Education\n\nArtificial Intelligence is fundamentally transforming how we learn and teach...',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
        authorId: insertedUsers[2].id,
        category: 'AI & Technology',
        tags: ['AI', 'Education', 'Machine Learning', 'Future of Learning'],
        status: 'published',
        isSticky: true,
        viewCount: 3500,
        publishedAt: new Date('2024-01-15')
      },
      {
        title: 'Building Your First Neural Network: Complete Beginner Guide',
        slug: 'building-first-neural-network-beginner-guide',
        excerpt: 'Step-by-step tutorial for creating your first neural network using Python and TensorFlow.',
        content: '# Building Your First Neural Network\n\nNeural networks are the backbone of modern AI...',
        thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400',
        authorId: insertedUsers[9].id,
        category: 'Tutorials',
        tags: ['Neural Networks', 'Python', 'TensorFlow', 'Deep Learning'],
        status: 'published',
        isSticky: false,
        viewCount: 2800,
        publishedAt: new Date('2024-01-12')
      },
      {
        title: 'Career Transition: From Software Developer to AI Specialist',
        slug: 'career-transition-developer-to-ai-specialist',
        excerpt: 'Real stories and practical roadmap for developers transitioning into AI and machine learning careers.',
        content: '# Career Transition to AI\n\nMany software developers are making the leap to AI...',
        thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400',
        authorId: insertedUsers[3].id,
        category: 'Career Development',
        tags: ['Career Change', 'AI Jobs', 'Professional Development', 'Machine Learning'],
        status: 'published',
        isSticky: false,
        viewCount: 2200,
        publishedAt: new Date('2024-01-10')
      },
      {
        title: 'Top 15 AI Tools Every Developer Should Master in 2024',
        slug: 'top-ai-tools-developers-2024',
        excerpt: 'Comprehensive guide to the most essential AI tools that are revolutionizing software development.',
        content: '# Essential AI Tools for Developers\n\nThe AI tool landscape is expanding rapidly...',
        thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
        authorId: insertedUsers[2].id,
        category: 'Tools & Resources',
        tags: ['AI Tools', 'Development Tools', 'Productivity', 'Software Development'],
        status: 'published',
        isSticky: false,
        viewCount: 4200,
        publishedAt: new Date('2024-01-08')
      },
      {
        title: 'Understanding Large Language Models: Architecture and Applications',
        slug: 'understanding-large-language-models-architecture',
        excerpt: 'Deep dive into LLM architecture, training processes, and real-world applications in various industries.',
        content: '# Understanding Large Language Models\n\nLarge Language Models have transformed natural language processing...',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
        authorId: insertedUsers[2].id,
        category: 'AI & Technology',
        tags: ['LLM', 'Natural Language Processing', 'GPT', 'Transformer Architecture'],
        status: 'published',
        isSticky: false,
        viewCount: 3100,
        publishedAt: new Date('2024-01-05')
      },
      {
        title: 'DevOps Best Practices: Building Scalable Infrastructure',
        slug: 'devops-best-practices-scalable-infrastructure',
        excerpt: 'Essential DevOps practices for building and maintaining scalable, reliable infrastructure.',
        content: '# DevOps Best Practices\n\nBuilding scalable infrastructure requires careful planning...',
        thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400',
        authorId: insertedUsers[3].id,
        category: 'DevOps & Infrastructure',
        tags: ['DevOps', 'Infrastructure', 'Scalability', 'Cloud Computing'],
        status: 'published',
        isSticky: false,
        viewCount: 1900,
        publishedAt: new Date('2024-01-03')
      },
      {
        title: 'Modern Web Development: React 18 and Beyond',
        slug: 'modern-web-development-react-18-beyond',
        excerpt: 'Exploring the latest features in React 18 and emerging trends in modern web development.',
        content: '# Modern Web Development with React 18\n\nReact 18 introduces several groundbreaking features...',
        thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
        authorId: insertedUsers[3].id,
        category: 'Web Development',
        tags: ['React', 'Web Development', 'JavaScript', 'Frontend'],
        status: 'published',
        isSticky: false,
        viewCount: 2600,
        publishedAt: new Date('2024-01-01')
      },
      {
        title: 'Data Science in 2024: Trends and Opportunities',
        slug: 'data-science-2024-trends-opportunities',
        excerpt: 'Comprehensive overview of data science trends, emerging technologies, and career opportunities.',
        content: '# Data Science Trends 2024\n\nThe data science landscape continues to evolve...',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
        authorId: insertedUsers[9].id,
        category: 'Data Science',
        tags: ['Data Science', 'Analytics', 'Machine Learning', 'Career Trends'],
        status: 'published',
        isSticky: false,
        viewCount: 1800,
        publishedAt: new Date('2023-12-28')
      },
      {
        title: 'Cybersecurity Fundamentals: Protecting Digital Assets',
        slug: 'cybersecurity-fundamentals-protecting-digital-assets',
        excerpt: 'Essential cybersecurity concepts and practices for protecting personal and organizational digital assets.',
        content: '# Cybersecurity Fundamentals\n\nIn todays digital world, cybersecurity is more important than ever...',
        thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
        authorId: insertedUsers[3].id,
        category: 'Cybersecurity',
        tags: ['Cybersecurity', 'Digital Security', 'Privacy', 'Risk Management'],
        status: 'published',
        isSticky: false,
        viewCount: 1500,
        publishedAt: new Date('2023-12-25')
      },
      {
        title: 'The Rise of MLOps: Operationalizing Machine Learning',
        slug: 'rise-of-mlops-operationalizing-machine-learning',
        excerpt: 'Understanding MLOps practices and how to successfully deploy and maintain ML models in production.',
        content: '# The Rise of MLOps\n\nMLOps bridges the gap between machine learning development and operations...',
        thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
        authorId: insertedUsers[2].id,
        category: 'AI & Technology',
        tags: ['MLOps', 'Machine Learning', 'DevOps', 'Production ML'],
        status: 'published',
        isSticky: false,
        viewCount: 2400,
        publishedAt: new Date('2023-12-22')
      }
    ];

    await db.insert(blogPosts).values(blogData);
    console.log('✅ Blog posts seeded');

    console.log('🎉 Database seeding completed successfully!');
    
    return {
      users: insertedUsers.length,
      agencies: insertedAgencies.length,
      courses: insertedCourses.length,
      modules: moduleData.length,
      quizzes: quizData.length,
      enrollments: enrollmentData.length,
      practicals: practicalData.length,
      jobs: insertedJobs.length,
      applications: applicationData.length,
      badges: insertedBadges.length,
      userBadges: userBadgeData.length,
      reviews: reviewData.length,
      tasks: taskData.length,
      blogs: blogData.length
    };

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}
