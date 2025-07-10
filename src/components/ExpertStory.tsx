
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  Award, 
  Globe, 
  Star,
  TrendingUp,
  Zap,
  Heart
} from 'lucide-react';

const ExpertStory = () => {
  const stats = [
    { icon: Users, value: '1,247', label: 'Expert Instructors', color: 'text-blue-600' },
    { icon: BookOpen, value: '340+', label: 'Free Courses', color: 'text-green-600' },
    { icon: Star, value: '4.8/5', label: 'Average Rating', color: 'text-yellow-600' },
    { icon: Globe, value: '180+', label: 'Countries', color: 'text-purple-600' }
  ];

  const expertTypes = [
    {
      title: "Industry Veterans",
      description: "Former executives from Google, Microsoft, Tesla, and unicorn startups",
      icon: Award,
      count: "420+"
    },
    {
      title: "Academic Leaders",
      description: "PhD professors from MIT, Stanford, Harvard, and top universities",
      icon: BookOpen,
      count: "280+"
    },
    {
      title: "Startup Founders",
      description: "Successful entrepreneurs who built and exited companies",
      icon: TrendingUp,
      count: "190+"
    },
    {
      title: "Freelance Masters",
      description: "Top-rated freelancers and consultants earning 6-figures",
      icon: Zap,
      count: "357+"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
            <Heart className="h-4 w-4 mr-2" />
            Built by Experts, For Learners
          </Badge>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Taught by 1,247+ Industry Experts
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Our instructors aren't just teachers—they're the practitioners, innovators, and leaders 
            who are shaping the future of technology and business.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-4 ${stat.color}`}>
                <stat.icon className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Expert Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {expertTypes.map((type, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                  <type.icon className="h-7 w-7 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-2">{type.count}</div>
                <h3 className="font-semibold text-lg mb-3">{type.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{type.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call-to-Action */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Join the Teaching Revolution
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            Are you an expert in your field? Share your knowledge and help millions learn for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8">
              Become an Instructor
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8">
              Learn from Experts
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpertStory;
