
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Code, 
  Palette, 
  BarChart3, 
  Shield, 
  Smartphone,
  Bot,
  Database,
  Cpu,
  Zap,
  Camera,
  Headphones
} from 'lucide-react';

const PopularCategories = () => {
  const categories = [
    { 
      icon: Brain, 
      name: 'Artificial Intelligence', 
      courses: 127, 
      color: 'bg-blue-500',
      description: 'Machine Learning, Deep Learning, NLP'
    },
    { 
      icon: Code, 
      name: 'Web Development', 
      courses: 98, 
      color: 'bg-green-500',
      description: 'React, Node.js, Full Stack'
    },
    { 
      icon: BarChart3, 
      name: 'Data Science', 
      courses: 87, 
      color: 'bg-purple-500',
      description: 'Python, R, Analytics, Visualization'
    },
    { 
      icon: Smartphone, 
      name: 'Mobile Development', 
      courses: 64, 
      color: 'bg-pink-500',
      description: 'React Native, Flutter, iOS, Android'
    },
    { 
      icon: Shield, 
      name: 'Cybersecurity', 
      courses: 56, 
      color: 'bg-red-500',
      description: 'Ethical Hacking, Network Security'
    },
    { 
      icon: Palette, 
      name: 'UI/UX Design', 
      courses: 45, 
      color: 'bg-orange-500',
      description: 'Figma, Adobe, User Research'
    },
    { 
      icon: Database, 
      name: 'DevOps & Cloud', 
      courses: 78, 
      color: 'bg-cyan-500',
      description: 'AWS, Docker, Kubernetes, CI/CD'
    },
    { 
      icon: Bot, 
      name: 'Automation', 
      courses: 34, 
      color: 'bg-amber-500',
      description: 'RPA, Zapier, Process Automation'
    },
    { 
      icon: Cpu, 
      name: 'Blockchain', 
      courses: 29, 
      color: 'bg-indigo-500',
      description: 'Smart Contracts, DeFi, Web3'
    },
    { 
      icon: Zap, 
      name: 'Digital Marketing', 
      courses: 67, 
      color: 'bg-yellow-500',
      description: 'SEO, Social Media, PPC, Analytics'
    },
    { 
      icon: Camera, 
      name: 'Content Creation', 
      courses: 43, 
      color: 'bg-rose-500',
      description: 'Video Editing, Photography, Writing'
    },
    { 
      icon: Headphones, 
      name: 'Audio Production', 
      courses: 21, 
      color: 'bg-teal-500',
      description: 'Podcasting, Music Production, Sound'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Popular Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our most in-demand skills and start learning from industry experts today
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 group"
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                <Badge variant="secondary" className="text-xs">
                  {category.courses} courses
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <a 
            href="/courses" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            View All Categories
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
