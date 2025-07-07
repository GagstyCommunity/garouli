
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import CourseFilters from '@/components/CourseFilters';
import CourseGrid from '@/components/CourseGrid';

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    categories: [],
    difficulty: [],
    duration: [],
    company: [],
    certification: false,
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Explore <span className="text-gradient">AI & Tech Courses</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Master cutting-edge skills with our AI-powered courses. Built by 1,000 AI teachers, 
            completely free for learners.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search courses, skills, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <CourseFilters filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Course Grid */}
          <div className="lg:col-span-3">
            <CourseGrid searchQuery={searchQuery} filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
