
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import PopularCategories from '@/components/PopularCategories';
import TrendingCourses from '@/components/TrendingCourses';
import ExpertStory from '@/components/ExpertStory';
import AgencySection from '@/components/AgencySection';
import FeaturedCourses from '@/components/FeaturedCourses';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import NewsletterSignup from '@/components/NewsletterSignup';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  BookOpen, 
  Users, 
  Award, 
  Zap, 
  Target, 
  Briefcase,
  TrendingUp,
  Star,
  ArrowRight
} from 'lucide-react';

const Index = () => {
  const [stats, setStats] = useState({
    totalStudents: 57000,
    totalCourses: 340,
    totalInstructors: 1247,
    successRate: 98
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch course count
      const { count: courseCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      // Fetch total students (sum of student_count from courses)
      const { data: coursesData } = await supabase
        .from('courses')
        .select('student_count')
        .eq('is_published', true);

      const totalStudents = coursesData?.reduce((sum, course) => sum + (course.student_count || 0), 0) || 57000;

      setStats(prev => ({
        ...prev,
        totalCourses: courseCount || prev.totalCourses,
        totalStudents: totalStudents || prev.totalStudents
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Learning',
      description: 'Personalized learning paths powered by artificial intelligence'
    },
    {
      icon: Target,
      title: 'Practical Projects',
      description: 'Build real-world projects that showcase your skills'
    },
    {
      icon: Users,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals and thought leaders'
    },
    {
      icon: Award,
      title: 'Verified Certificates',
      description: 'Earn certificates recognized by top employers'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      
      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalStudents.toLocaleString()}+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalCourses}+</div>
              <div className="text-gray-600">Expert Courses</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalInstructors}+</div>
              <div className="text-gray-600">Industry Experts</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.successRate}%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <PopularCategories />

      {/* Trending Courses */}
      <TrendingCourses />

      {/* Expert Story */}
      <ExpertStory />

      {/* Agency Section */}
      <AgencySection />

      {/* Featured Courses */}
      <FeaturedCourses />

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Garouli?
            </h2>
            <p className="text-xl text-gray-600">
              Experience the future of online learning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Testimonials */}
      <Testimonials />

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who are already transforming their careers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Star className="h-5 w-5 mr-2" />
              Start Learning Free
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <ArrowRight className="h-5 w-5 mr-2" />
              Explore Courses
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
