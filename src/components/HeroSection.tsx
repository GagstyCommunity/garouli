
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Play, Users, BookOpen, Award } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white">
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="relative container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Learn Skills That Matter with <span className="text-yellow-400">Garouli</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Master AI, automation, and cutting-edge technology with courses from industry experts
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="What do you want to learn?"
                className="pl-12 pr-4 py-4 text-lg bg-white text-gray-900 border-0 rounded-lg shadow-lg"
              />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6">
                Search
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-4 text-lg">
              <Play className="mr-2 h-5 w-5" />
              Start Learning Free
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg">
              Browse Courses
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Users className="h-12 w-12 text-yellow-400 mb-2" />
              <div className="text-3xl font-bold">57,000+</div>
              <div className="text-lg opacity-80">Students</div>
            </div>
            <div className="flex flex-col items-center">
              <BookOpen className="h-12 w-12 text-yellow-400 mb-2" />
              <div className="text-3xl font-bold">210+</div>
              <div className="text-lg opacity-80">Courses</div>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-12 w-12 text-yellow-400 mb-2" />
              <div className="text-3xl font-bold">45+</div>
              <div className="text-lg opacity-80">Expert Instructors</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
