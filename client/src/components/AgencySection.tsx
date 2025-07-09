
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Award, 
  CheckCircle,
  ArrowRight,
  Star,
  Target,
  BarChart3,
  Briefcase
} from 'lucide-react';

const AgencySection = () => {
  const topAgencies = [
    {
      name: "TechCorp Academy",
      logo: "/api/placeholder/80/80",
      students: "12,547",
      courses: 45,
      rating: 4.9,
      category: "AI & Machine Learning",
      verified: true
    },
    {
      name: "Design Masters",
      logo: "/api/placeholder/80/80", 
      students: "8,932",
      courses: 32,
      rating: 4.8,
      category: "UI/UX Design",
      verified: true
    },
    {
      name: "Code Academy Pro",
      logo: "/api/placeholder/80/80",
      students: "15,643",
      courses: 67,
      rating: 4.7,
      category: "Web Development",
      verified: true
    },
    {
      name: "Data Science Hub",
      logo: "/api/placeholder/80/80",
      students: "9,234",
      courses: 28,
      rating: 4.9,
      category: "Data Science",
      verified: true
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Build Your Learning Community",
      description: "Create courses, track student progress, and build a loyal following"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights into learner behavior, completion rates, and engagement"
    },
    {
      icon: Briefcase,
      title: "Talent Pipeline",
      description: "Connect directly with top-performing students for hiring opportunities"
    },
    {
      icon: Award,
      title: "Brand Authority",
      description: "Establish your company as a thought leader in your industry"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
            <Building2 className="h-4 w-4 mr-2" />
            For Companies & Agencies
          </Badge>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Top Agencies Trust Garouli
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join industry-leading companies that are already building their learning communities 
            and discovering top talent through our platform.
          </p>
        </div>

        {/* Top Agencies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {topAgencies.map((agency, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white">
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-gray-400" />
                  </div>
                  {agency.verified && (
                    <div className="absolute -top-1 -right-1">
                      <CheckCircle className="h-6 w-6 text-blue-500 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                
                <h3 className="font-semibold text-lg mb-2">{agency.name}</h3>
                <Badge variant="secondary" className="text-xs mb-3">
                  {agency.category}
                </Badge>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{agency.rating}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <span>{agency.students} students</span>
                    <span>{agency.courses} courses</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Top Companies Choose Garouli
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <benefit.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-lg mb-3">{benefit.title}</h4>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-center text-white">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-4xl font-bold mb-4">
              Ready to Claim Your Agency Page?
            </h3>
            <p className="text-xl mb-6 opacity-90">
              Start your 3-month free trial today. No setup fees, cancel anytime.
            </p>
            <div className="mb-6">
              <div className="text-lg opacity-90 mb-2">Starting at</div>
              <div className="text-4xl font-bold">Free for 3 months</div>
              <div className="text-lg opacity-90">then $2,000/year</div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8"
              >
                <Target className="h-5 w-5 mr-2" />
                Claim Your Page
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 px-8"
              >
                Learn More
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
            <p className="text-sm opacity-75 mt-4">
              ✓ 3-month free trial ✓ Credit card required ✓ Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgencySection;
