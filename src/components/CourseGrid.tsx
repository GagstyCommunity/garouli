
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star, Play } from 'lucide-react';

interface CourseGridProps {
  searchQuery: string;
  filters: {
    categories: string[];
    difficulty: string[];
    duration: string[];
    company: string[];
    certification: boolean;
  };
}

const CourseGrid: React.FC<CourseGridProps> = ({ searchQuery, filters }) => {
  // Mock course data - in a real app, this would come from an API
  const courses = [
    {
      id: 1,
      title: 'AI Fundamentals & Machine Learning',
      description: 'Master the basics of artificial intelligence and machine learning with hands-on projects.',
      category: 'Artificial Intelligence',
      difficulty: 'Beginner',
      duration: '10-20 hours',
      company: 'Google',
      rating: 4.8,
      studentsCount: 15420,
      price: 'Free',
      thumbnail: '/placeholder.svg',
      certification: true,
      tags: ['Python', 'TensorFlow', 'Neural Networks']
    },
    {
      id: 2,
      title: 'DevOps with Docker & Kubernetes',
      description: 'Learn container orchestration and modern DevOps practices.',
      category: 'DevOps & Cloud',
      difficulty: 'Intermediate',
      duration: '20+ hours',
      company: 'AWS',
      rating: 4.9,
      studentsCount: 8930,
      price: 'Free',
      thumbnail: '/placeholder.svg',
      certification: true,
      tags: ['Docker', 'Kubernetes', 'CI/CD']
    },
    {
      id: 3,
      title: 'Full-Stack Web Development',
      description: 'Build modern web applications with React, Node.js, and MongoDB.',
      category: 'Web Development',
      difficulty: 'Intermediate',
      duration: '20+ hours',
      company: 'Meta',
      rating: 4.7,
      studentsCount: 12340,
      price: 'Free',
      thumbnail: '/placeholder.svg',
      certification: true,
      tags: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: 4,
      title: 'Data Science with Python',
      description: 'Analyze data and build predictive models using Python and popular libraries.',
      category: 'Data Science',
      difficulty: 'Beginner',
      duration: '10-20 hours',
      company: 'Microsoft',
      rating: 4.6,
      studentsCount: 9876,
      price: 'Free',
      thumbnail: '/placeholder.svg',
      certification: false,
      tags: ['Python', 'Pandas', 'Matplotlib']
    },
    {
      id: 5,
      title: 'Cybersecurity Essentials',
      description: 'Learn the fundamentals of cybersecurity and ethical hacking.',
      category: 'Cybersecurity',
      difficulty: 'Beginner',
      duration: '2-10 hours',
      company: 'Nvidia',
      rating: 4.5,
      studentsCount: 6543,
      price: 'Free',
      thumbnail: '/placeholder.svg',
      certification: true,
      tags: ['Security', 'Ethical Hacking', 'Network Security']
    },
    {
      id: 6,
      title: 'Blockchain Development',
      description: 'Build decentralized applications on Ethereum and other blockchains.',
      category: 'Blockchain',
      difficulty: 'Advanced',
      duration: '20+ hours',
      company: 'OpenAI',
      rating: 4.8,
      studentsCount: 4321,
      price: 'Free',
      thumbnail: '/placeholder.svg',
      certification: true,
      tags: ['Solidity', 'Ethereum', 'Smart Contracts']
    }
  ];

  // Filter courses based on search query and filters
  const filteredCourses = courses.filter(course => {
    // Search query filter
    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !course.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(course.category)) {
      return false;
    }

    // Difficulty filter
    if (filters.difficulty.length > 0 && !filters.difficulty.includes(course.difficulty)) {
      return false;
    }

    // Duration filter
    if (filters.duration.length > 0 && !filters.duration.includes(course.duration)) {
      return false;
    }

    // Company filter
    if (filters.company.length > 0 && !filters.company.includes(course.company)) {
      return false;
    }

    // Certification filter
    if (filters.certification && !course.certification) {
      return false;
    }

    return true;
  });

  return (
    <div>
      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {filteredCourses.length} Course{filteredCourses.length !== 1 ? 's' : ''} Found
        </h2>
        <div className="text-sm text-muted-foreground">
          Showing all free courses
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 hover-scale">
            <CardHeader className="p-0">
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-white/90 text-foreground">
                    {course.price}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="outline" className="bg-white/90">
                    {course.company}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                  <Button size="sm" className="bg-white text-black hover:bg-white/90">
                    <Play className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {course.category}
                </Badge>
                <Badge 
                  variant={course.difficulty === 'Beginner' ? 'secondary' : 
                          course.difficulty === 'Intermediate' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {course.difficulty}
                </Badge>
                {course.certification && (
                  <Badge variant="outline" className="text-xs">
                    Certificate
                  </Badge>
                )}
              </div>
              
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {course.title}
              </h3>
              
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {course.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {course.studentsCount.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {course.rating}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {course.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="p-4 pt-0">
              <Button className="w-full" variant="default">
                Enroll Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No courses found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
};

export default CourseGrid;
