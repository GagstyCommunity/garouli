
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Play, 
  Star, 
  Users, 
  BookOpen, 
  Award,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (searchTerm.trim()) {
      window.location.href = `/courses?search=${encodeURIComponent(searchTerm)}`;
    } else {
      window.location.href = '/courses';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const stats = [
    { icon: Users, value: '57,000+', label: 'Active Learners' },
    { icon: BookOpen, value: '340+', label: 'Free Courses' },
    { icon: Award, value: '1,247+', label: 'Expert Instructors' },
    { icon: Globe, value: '180+', label: 'Countries' }
  ];

  const features = [
    '100% Free - No hidden costs',
    'Learn from industry experts',
    'Get certified upon completion',
    'Mobile-friendly learning'
  ];

  const popularSearches = [
    'AI Tools', 'Web Development', 'Data Science', 'Digital Marketing', 
    'Python', 'React', 'Machine Learning', 'UI/UX Design'
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-purple-600/5"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      
      <div className="relative container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            {/* Badge */}
            <Badge className="mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 px-4 py-2 text-sm font-medium">
              <Zap className="h-4 w-4 mr-2" />
              Trusted by 57,000+ learners worldwide
            </Badge>

            {/* Main Headline */}
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Learn{' '}
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                AI & Tech
              </span>{' '}
              <br />
              Skills for{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Free
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Master in-demand skills with 340+ free courses created by 1,247+ industry experts. 
              No payment required. Start learning today.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center justify-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="What do you want to learn? Try 'AI Tools', 'Web Development'..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-14 pr-32 py-6 text-lg border-2 border-gray-200 rounded-2xl focus:border-yellow-500 focus:ring-yellow-500 shadow-lg bg-white/80 backdrop-blur-sm"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Button 
                  onClick={handleSearch}
                  size="lg"
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-8 rounded-xl"
                >
                  Search
                </Button>
              </div>
            </div>
            
            {/* Popular Searches */}
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500 mr-2">Popular:</span>
              <div className="inline-flex flex-wrap gap-2">
                {popularSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchTerm(term)}
                    className="text-sm bg-white/50 hover:bg-white text-gray-700 hover:text-gray-900 px-3 py-1 rounded-full border border-gray-200 hover:border-gray-300 transition-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              onClick={() => window.location.href = '/courses'}
            >
              <BookOpen className="h-6 w-6 mr-2" />
              Start Learning Free
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-8 py-6 text-lg rounded-2xl bg-white/80 backdrop-blur-sm"
              onClick={() => window.location.href = '/auth'}
            >
              <Play className="h-6 w-6 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl mb-4 shadow-lg">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Social Proof */}
          <div className="text-center mt-16">
            <p className="text-gray-600 mb-4">Trusted by learners from</p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-gray-400">Google</div>
              <div className="text-2xl font-bold text-gray-400">Microsoft</div>
              <div className="text-2xl font-bold text-gray-400">Amazon</div>
              <div className="text-2xl font-bold text-gray-400">Tesla</div>
              <div className="text-2xl font-bold text-gray-400">Meta</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
