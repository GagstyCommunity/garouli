
import { db } from './db';
import { 
  users, agencies, courses, courseModules, quizzes, enrollments, 
  practicals, jobs, jobApplications, badges, userBadges, 
  courseReviews, contributorTasks, blogPosts 
} from '@shared/schema';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await db.delete(userBadges);
    await db.delete(badges);
    await db.delete(jobApplications);
    await db.delete(jobs);
    await db.delete(courseReviews);
    await db.delete(practicals);
    await db.delete(enrollments);
    await db.delete(quizzes);
    await db.delete(courseModules);
    await db.delete(courses);
    await db.delete(agencies);
    await db.delete(contributorTasks);
    await db.delete(blogPosts);
    await db.delete(users);

    // Seed Users
    const insertedUsers = await db.insert(users).values([
      {
        email: 'admin@minutely.ai',
        username: 'admin',
        password: '$2b$10$hashedpassword1',
        role: 'admin',
        firstName: 'John',
        lastName: 'Admin',
        bio: 'Platform administrator with 10+ years in edtech',
        country: 'United States',
        xpPoints: 5000,
        level: 10,
        streak: 45,
        isVerified: true,
        referralCode: 'ADMIN001'
      },
      {
        email: 'instructor1@minutely.ai',
        username: 'sarah_dev',
        password: '$2b$10$hashedpassword2',
        role: 'instructor',
        firstName: 'Sarah',
        lastName: 'Johnson',
        bio: 'Full-stack developer and coding instructor',
        country: 'Canada',
        xpPoints: 3500,
        level: 7,
        streak: 23,
        isVerified: true,
        referralCode: 'INST001'
      },
      {
        email: 'instructor2@minutely.ai',
        username: 'mike_ai',
        password: '$2b$10$hashedpassword3',
        role: 'instructor',
        firstName: 'Mike',
        lastName: 'Chen',
        bio: 'AI/ML specialist and data science educator',
        country: 'Singapore',
        xpPoints: 4200,
        level: 8,
        streak: 67,
        isVerified: true,
        referralCode: 'INST002'
      },
      {
        email: 'agency1@techcorp.com',
        username: 'techcorp_admin',
        password: '$2b$10$hashedpassword4',
        role: 'agency',
        firstName: 'David',
        lastName: 'Wilson',
        bio: 'HR Director at TechCorp Solutions',
        country: 'United Kingdom',
        xpPoints: 1200,
        level: 3,
        streak: 12,
        isVerified: true,
        referralCode: 'AGENCY001'
      },
      {
        email: 'agency2@innovate.com',
        username: 'innovate_hr',
        password: '$2b$10$hashedpassword5',
        role: 'agency',
        firstName: 'Lisa',
        lastName: 'Rodriguez',
        bio: 'Learning & Development Manager',
        country: 'Spain',
        xpPoints: 800,
        level: 2,
        streak: 8,
        isVerified: true,
        referralCode: 'AGENCY002'
      },
      ...Array.from({ length: 5 }, (_, i) => ({
        email: `student${i + 1}@example.com`,
        username: `student_${i + 1}`,
        password: '$2b$10$hashedpassword' + (i + 6),
        role: 'learner' as const,
        firstName: ['Emma', 'Alex', 'Sophia', 'Ryan', 'Maya'][i],
        lastName: ['Smith', 'Brown', 'Davis', 'Miller', 'Wilson'][i],
        bio: `Passionate learner interested in ${['web development', 'data science', 'mobile apps', 'AI/ML', 'cybersecurity'][i]}`,
        country: ['United States', 'Germany', 'Australia', 'India', 'Brazil'][i],
        xpPoints: [1500, 2200, 800, 3100, 1800][i],
        level: [4, 5, 2, 6, 4][i],
        streak: [15, 28, 5, 42, 19][i],
        isVerified: true,
        referralCode: `STUDENT00${i + 1}`
      }))
    ]).returning();

    console.log('✅ Users seeded');

    // Seed Agencies
    const insertedAgencies = await db.insert(agencies).values([
      {
        userId: insertedUsers[3].id, // agency1
        companyName: 'TechCorp Solutions',
        website: 'https://techcorp.com',
        description: 'Leading technology solutions provider specializing in enterprise software',
        industry: 'Technology',
        size: 'large',
        status: 'active',
        subscriptionTier: 'enterprise',
        billingCycle: 'yearly',
        totalSpent: '24999.99'
      },
      {
        userId: insertedUsers[4].id, // agency2
        companyName: 'Innovate Digital',
        website: 'https://innovatedigital.com',
        description: 'Digital transformation consultancy helping businesses modernize',
        industry: 'Consulting',
        size: 'medium',
        status: 'active',
        subscriptionTier: 'growth',
        billingCycle: 'monthly',
        totalSpent: '8500.00'
      }
    ]).returning();

    console.log('✅ Agencies seeded');

    // Seed Courses
    const insertedCourses = await db.insert(courses).values([
      {
        title: 'Complete Full-Stack Web Development',
        slug: 'complete-fullstack-web-development',
        description: 'Master modern web development with React, Node.js, and MongoDB',
        category: 'Web Development',
        level: 'beginner',
        duration: 2400, // 40 hours
        price: '199.99',
        instructorId: insertedUsers[1].id,
        agencyId: insertedAgencies[0].id,
        status: 'published',
        rating: '4.8',
        totalEnrollments: 1247,
        xpReward: 500,
        tags: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
        requirements: ['Basic HTML/CSS knowledge', 'Computer with internet'],
        learningOutcomes: ['Build full-stack applications', 'Deploy to cloud platforms', 'Implement authentication'],
        isSponsored: true,
        sponsorId: insertedAgencies[0].id
      },
      {
        title: 'AI & Machine Learning Fundamentals',
        slug: 'ai-machine-learning-fundamentals',
        description: 'Learn the basics of AI, ML algorithms, and practical implementations',
        category: 'Data Science',
        level: 'intermediate',
        duration: 1800, // 30 hours
        price: '299.99',
        instructorId: insertedUsers[2].id,
        status: 'published',
        rating: '4.9',
        totalEnrollments: 892,
        xpReward: 600,
        tags: ['Python', 'TensorFlow', 'Scikit-learn', 'AI'],
        requirements: ['Python programming knowledge', 'Basic mathematics'],
        learningOutcomes: ['Understand ML algorithms', 'Build predictive models', 'Deploy ML applications']
      },
      {
        title: 'Mobile App Development with React Native',
        slug: 'mobile-app-development-react-native',
        description: 'Create cross-platform mobile apps using React Native',
        category: 'Mobile Development',
        level: 'intermediate',
        duration: 2000, // 33 hours
        price: '249.99',
        instructorId: insertedUsers[1].id,
        status: 'published',
        rating: '4.7',
        totalEnrollments: 654,
        xpReward: 550,
        tags: ['React Native', 'Mobile', 'iOS', 'Android'],
        requirements: ['React knowledge', 'JavaScript proficiency'],
        learningOutcomes: ['Build mobile apps', 'Publish to app stores', 'Handle device features']
      },
      {
        title: 'Cybersecurity Essentials',
        slug: 'cybersecurity-essentials',
        description: 'Learn fundamental cybersecurity concepts and practices',
        category: 'Security',
        level: 'beginner',
        duration: 1500, // 25 hours
        price: '179.99',
        instructorId: insertedUsers[2].id,
        status: 'published',
        rating: '4.6',
        totalEnrollments: 423,
        xpReward: 450,
        tags: ['Security', 'Networking', 'Encryption', 'Ethics'],
        requirements: ['Basic computer knowledge'],
        learningOutcomes: ['Understand security threats', 'Implement security measures', 'Conduct security audits']
      },
      {
        title: 'Advanced JavaScript Patterns',
        slug: 'advanced-javascript-patterns',
        description: 'Deep dive into advanced JavaScript concepts and design patterns',
        category: 'Programming',
        level: 'expert',
        duration: 1200, // 20 hours
        price: '149.99',
        instructorId: insertedUsers[1].id,
        status: 'published',
        rating: '4.9',
        totalEnrollments: 789,
        xpReward: 400,
        tags: ['JavaScript', 'Design Patterns', 'Advanced'],
        requirements: ['Solid JavaScript knowledge', '2+ years experience'],
        learningOutcomes: ['Master design patterns', 'Write maintainable code', 'Optimize performance']
      }
    ]).returning();

    console.log('✅ Courses seeded');

    // Seed Course Modules
    const moduleData = [];
    for (let courseIndex = 0; courseIndex < insertedCourses.length; courseIndex++) {
      const course = insertedCourses[courseIndex];
      const moduleCount = Math.floor(Math.random() * 8) + 5; // 5-12 modules per course
      
      for (let i = 0; i < moduleCount; i++) {
        moduleData.push({
          courseId: course.id,
          title: `Module ${i + 1}: ${['Introduction', 'Getting Started', 'Core Concepts', 'Practical Examples', 'Advanced Topics', 'Best Practices', 'Real-world Projects', 'Testing', 'Deployment', 'Optimization', 'Security', 'Final Project'][i] || `Advanced Topic ${i - 11}`}`,
          description: `Detailed explanation of ${['basics', 'fundamentals', 'key concepts', 'implementation', 'advanced features'][Math.floor(Math.random() * 5)]}`,
          orderIndex: i,
          duration: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
          videoUrl: `https://example.com/videos/course_${course.id}_module_${i + 1}.mp4`,
          content: `# Module Content\n\nThis module covers important concepts in ${course.category}.\n\n## Learning Objectives\n- Understand core principles\n- Apply knowledge practically\n- Build real projects`,
          xpReward: Math.floor(Math.random() * 50) + 20
        });
      }
    }
    await db.insert(courseModules).values(moduleData);

    console.log('✅ Course modules seeded');

    // Seed Quizzes
    const quizData = moduleData.slice(0, 20).map((module, index) => ({
      moduleId: index + 1, // Assuming sequential IDs
      title: `Quiz: ${module.title}`,
      questions: [
        {
          question: "What is the main concept covered in this module?",
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct: 0,
          explanation: "This is the correct answer because..."
        },
        {
          question: "Which of the following is a best practice?",
          options: ["Practice A", "Practice B", "Practice C", "Practice D"],
          correct: 1,
          explanation: "This practice is recommended because..."
        }
      ],
      passingScore: 70,
      xpReward: 30
    }));
    await db.insert(quizzes).values(quizData);

    console.log('✅ Quizzes seeded');

    // Seed Enrollments
    const enrollmentData = [];
    const students = insertedUsers.slice(5); // Students only
    for (const student of students) {
      const numEnrollments = Math.floor(Math.random() * 3) + 1; // 1-3 courses per student
      const selectedCourses = insertedCourses
        .sort(() => 0.5 - Math.random())
        .slice(0, numEnrollments);
      
      for (const course of selectedCourses) {
        enrollmentData.push({
          userId: student.id,
          courseId: course.id,
          progress: Math.floor(Math.random() * 100),
          enrolledAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) // Last 90 days
        });
      }
    }
    await db.insert(enrollments).values(enrollmentData);

    console.log('✅ Enrollments seeded');

    // Seed Practicals
    const practicalData = enrollmentData.slice(0, 15).map((enrollment, index) => ({
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      moduleId: Math.floor(Math.random() * 5) + 1,
      title: `Practical Assignment ${index + 1}`,
      description: `Build a project demonstrating your understanding of the course concepts`,
      submissionUrl: `https://github.com/student${enrollment.userId}/project-${index + 1}`,
      githubUrl: `https://github.com/student${enrollment.userId}/project-${index + 1}`,
      status: ['submitted', 'approved', 'featured'][Math.floor(Math.random() * 3)],
      score: Math.floor(Math.random() * 40) + 60, // 60-100
      feedback: `Great work! ${['Excellent implementation', 'Good understanding of concepts', 'Well-structured code'][Math.floor(Math.random() * 3)]}`,
      isUrlValid: true,
      isFeatured: Math.random() > 0.8
    }));
    await db.insert(practicals).values(practicalData);

    console.log('✅ Practicals seeded');

    // Seed Jobs
    const jobData = [
      {
        agencyId: insertedAgencies[0].id,
        title: 'Senior Full-Stack Developer',
        slug: 'senior-fullstack-developer-techcorp',
        description: 'Join our dynamic team to build scalable web applications using modern technologies.',
        requirements: ['5+ years React experience', 'Node.js proficiency', 'Database design'],
        benefits: ['Competitive salary', 'Remote work', 'Health insurance', 'Learning budget'],
        location: 'London, UK',
        type: 'full-time',
        remote: true,
        salary: '£60,000 - £80,000',
        experience: 'senior',
        skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
        status: 'active',
        applications: 23
      },
      {
        agencyId: insertedAgencies[1].id,
        title: 'AI/ML Engineer',
        slug: 'ai-ml-engineer-innovate',
        description: 'Work on cutting-edge AI projects and help shape the future of technology.',
        requirements: ['Python expertise', 'TensorFlow/PyTorch', 'MLOps experience'],
        benefits: ['Stock options', 'Flexible hours', 'Conference budget', 'Mentorship'],
        location: 'Madrid, Spain',
        type: 'full-time',
        remote: false,
        salary: '€55,000 - €75,000',
        experience: 'mid',
        skills: ['Python', 'TensorFlow', 'Docker', 'Kubernetes'],
        status: 'active',
        applications: 18
      },
      {
        agencyId: insertedAgencies[0].id,
        title: 'Frontend Developer Intern',
        slug: 'frontend-developer-intern-techcorp',
        description: 'Learn and grow with our experienced team while building user interfaces.',
        requirements: ['Basic React knowledge', 'HTML/CSS/JS', 'Git familiarity'],
        benefits: ['Mentorship program', 'Learning opportunities', 'Potential full-time offer'],
        location: 'Remote',
        type: 'internship',
        remote: true,
        salary: '£20,000 - £25,000',
        experience: 'entry',
        skills: ['React', 'JavaScript', 'CSS', 'Git'],
        status: 'active',
        applications: 45
      }
    ];
    
    const insertedJobs = await db.insert(jobs).values(jobData).returning();

    console.log('✅ Jobs seeded');

    // Seed Job Applications
    const applicationData = [];
    const applicableStudents = insertedUsers.slice(5, 8); // First 3 students
    for (const job of insertedJobs) {
      for (const student of applicableStudents) {
        if (Math.random() > 0.5) { // 50% chance of application
          applicationData.push({
            jobId: job.id,
            userId: student.id,
            resume: `Resume for ${student.firstName} ${student.lastName}`,
            coverLetter: `I am excited to apply for the ${job.title} position...`,
            portfolio: `https://portfolio.${student.username}.com`,
            status: ['pending', 'reviewed', 'accepted', 'rejected'][Math.floor(Math.random() * 4)]
          });
        }
      }
    }
    await db.insert(jobApplications).values(applicationData);

    console.log('✅ Job applications seeded');

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
        name: 'Code Master',
        description: 'Complete 5 programming courses',
        icon: '💻',
        type: 'course_completion',
        criteria: { programmingCourses: 5 },
        xpReward: 500,
        isActive: true
      },
      {
        name: 'Streak Champion',
        description: 'Maintain a 30-day learning streak',
        icon: '🔥',
        type: 'streak',
        criteria: { streakDays: 30 },
        xpReward: 300,
        isActive: true
      },
      {
        name: 'Community Helper',
        description: 'Help 10 fellow learners',
        icon: '🤝',
        type: 'contribution',
        criteria: { helpCount: 10 },
        xpReward: 200,
        isActive: true
      },
      {
        name: 'Project Showcase',
        description: 'Have a project featured',
        icon: '⭐',
        type: 'practical',
        criteria: { featuredProjects: 1 },
        xpReward: 400,
        isActive: true
      }
    ];
    
    const insertedBadges = await db.insert(badges).values(badgeData).returning();

    console.log('✅ Badges seeded');

    // Seed User Badges
    const userBadgeData = [];
    for (const user of insertedUsers) {
      const numBadges = Math.floor(Math.random() * 3) + 1; // 1-3 badges per user
      const userBadges = insertedBadges
        .sort(() => 0.5 - Math.random())
        .slice(0, numBadges);
      
      for (const badge of userBadges) {
        userBadgeData.push({
          userId: user.id,
          badgeId: badge.id,
          earnedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000) // Last 60 days
        });
      }
    }
    await db.insert(userBadges).values(userBadgeData);

    console.log('✅ User badges seeded');

    // Seed Course Reviews
    const reviewData = [];
    for (const course of insertedCourses) {
      const numReviews = Math.floor(Math.random() * 8) + 3; // 3-10 reviews per course
      const reviewers = insertedUsers
        .filter(u => u.role === 'learner')
        .sort(() => 0.5 - Math.random())
        .slice(0, numReviews);
      
      for (const reviewer of reviewers) {
        reviewData.push({
          courseId: course.id,
          userId: reviewer.id,
          rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
          review: [
            'Excellent course! Learned so much.',
            'Great instructor and clear explanations.',
            'Practical examples were very helpful.',
            'Would recommend to anyone starting out.',
            'Comprehensive content and good pacing.'
          ][Math.floor(Math.random() * 5)],
          isVerified: true
        });
      }
    }
    await db.insert(courseReviews).values(reviewData);

    console.log('✅ Course reviews seeded');

    // Seed Contributor Tasks
    const taskData = [
      {
        title: 'Update React Documentation',
        description: 'Review and update the React course documentation for latest best practices',
        type: 'content',
        difficulty: 'medium',
        xpReward: 150,
        status: 'open',
        createdBy: insertedUsers[0].id, // admin
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 2 weeks from now
      },
      {
        title: 'Design Course Thumbnails',
        description: 'Create attractive thumbnails for the new AI/ML course series',
        type: 'design',
        difficulty: 'easy',
        xpReward: 100,
        status: 'assigned',
        assignedTo: insertedUsers[5].id, // student
        createdBy: insertedUsers[1].id, // instructor
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1 week from now
      },
      {
        title: 'Implement Advanced Search',
        description: 'Add elasticsearch integration for advanced course search functionality',
        type: 'development',
        difficulty: 'hard',
        xpReward: 300,
        status: 'in_progress',
        assignedTo: insertedUsers[6].id, // student
        createdBy: insertedUsers[0].id, // admin
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000) // 3 weeks from now
      }
    ];
    await db.insert(contributorTasks).values(taskData);

    console.log('✅ Contributor tasks seeded');

    // Seed Blog Posts
    const blogData = [
      {
        title: 'The Future of AI in Education',
        slug: 'future-ai-education',
        excerpt: 'Exploring how artificial intelligence is revolutionizing the way we learn and teach.',
        content: '# The Future of AI in Education\n\nArtificial Intelligence is transforming education in unprecedented ways...\n\n## Key Benefits\n\n- Personalized learning paths\n- Intelligent tutoring systems\n- Automated assessment\n\n## Challenges\n\n- Privacy concerns\n- Implementation costs\n- Teacher training needs',
        authorId: insertedUsers[2].id, // AI instructor
        category: 'Technology',
        tags: ['AI', 'Education', 'Future', 'Technology'],
        status: 'published',
        isSticky: true,
        viewCount: 1247,
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        title: 'Building Your First React Application',
        slug: 'building-first-react-app',
        excerpt: 'A step-by-step guide to creating your first React application from scratch.',
        content: '# Building Your First React Application\n\nReact is a powerful library for building user interfaces...\n\n## Getting Started\n\n1. Install Node.js\n2. Create React App\n3. Understand components\n\n## Best Practices\n\n- Component composition\n- State management\n- Performance optimization',
        authorId: insertedUsers[1].id, // React instructor
        category: 'Programming',
        tags: ['React', 'JavaScript', 'Tutorial', 'Beginner'],
        status: 'published',
        isSticky: false,
        viewCount: 892,
        publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
      },
      {
        title: 'Career Tips for New Developers',
        slug: 'career-tips-new-developers',
        excerpt: 'Essential advice for developers just starting their career journey.',
        content: '# Career Tips for New Developers\n\nStarting a career in development can be overwhelming...\n\n## Essential Skills\n\n- Problem-solving\n- Continuous learning\n- Communication\n\n## Building Your Portfolio\n\n- Personal projects\n- Open source contributions\n- Professional networking',
        authorId: insertedUsers[0].id, // admin
        category: 'Career',
        tags: ['Career', 'Tips', 'Development', 'Advice'],
        status: 'published',
        isSticky: false,
        viewCount: 654,
        publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 days ago
      }
    ];
    await db.insert(blogPosts).values(blogData);

    console.log('✅ Blog posts seeded');

    console.log('🎉 Database seeding completed successfully!');
    console.log(`
    Seeded data summary:
    - ${insertedUsers.length} users
    - ${insertedAgencies.length} agencies  
    - ${insertedCourses.length} courses
    - ${moduleData.length} course modules
    - ${quizData.length} quizzes
    - ${enrollmentData.length} enrollments
    - ${practicalData.length} practicals
    - ${insertedJobs.length} jobs
    - ${applicationData.length} job applications
    - ${insertedBadges.length} badges
    - ${userBadgeData.length} user badges
    - ${reviewData.length} course reviews
    - ${taskData.length} contributor tasks
    - ${blogData.length} blog posts
    `);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

export { seedDatabase };
