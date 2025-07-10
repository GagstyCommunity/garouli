
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Users, Clock, Play, TrendingUp } from 'lucide-react';

const TrendingCourses = () => {
  const courses = [
    {
      id: 1,
      title: "Complete AI Masterclass 2025",
      instructor: "Dr. Sarah Chen",
      description: "Master ChatGPT, Midjourney, and 20+ AI tools that are transforming industries",
      thumbnail: "/api/placeholder/300/200",
      rating: 4.9,
      students: "12,547",
      duration: "8.5 hours",
      level: "All Levels",
      category: "Artificial Intelligence",
      tags: ["ChatGPT", "Midjourney", "AI Tools"],
      trending: true,
      price: "Free",
      originalPrice: "$199"
    },
    {
      id: 2,
      title: "Full Stack Development Bootcamp",
      instructor: "Mike Rodriguez",
      description: "Build 12 real-world projects using React, Node.js, and modern web technologies",
      thumbnail: "/api/placeholder/300/200",
      rating: 4.8,
      students: "8,932",
      duration: "32 hours",
      level: "Beginner",
      category: "Web Development",
      tags: ["React", "Node.js", "JavaScript"],
      trending: true,
      price: "Free",
      originalPrice: "$299"
    },
    {
      id: 3,
      title: "Data Science with Python",
      instructor: "Prof. Amanda Liu",
      description: "Complete data science pipeline from data collection to machine learning models",
      thumbnail: "/api/placeholder/300/200",
      rating: 4.7,
      students: "15,643",
      duration: "24 hours",
      level: "Intermediate",
      category: "Data Science",
      tags: ["Python", "Pandas", "Machine Learning"],
      trending: true,
      price: "Free",
      originalPrice: "$249"
    },
    {
      id: 4,
      title: "Cybersecurity Fundamentals",
      instructor: "James Wilson",
      description: "Learn ethical hacking, network security, and protect systems from cyber threats",
      thumbnail: "/api/placeholder/300/200",
      rating: 4.6,
      students: "6,789",
      duration: "16 hours",
      level: "Beginner",
      category: "Cybersecurity",
      tags: ["Ethical Hacking", "Network Security"],
      trending: false,
      price: "Free",
      originalPrice: "$179"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
              Trending Courses
            </h2>
            <p className="text-xl text-gray-600">
              Most popular courses this week - all completely free
            </p>
          </div>
          <Button variant="outline" size="lg">
            View All Courses
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="p-0">
                <div className="relative">
                  <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <Play className="h-12 w-12 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  {course.trending && (
                    <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white">
                      🔥 Trending
                    </Badge>
                  )}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    {course.duration}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {course.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {course.level}
                  </Badge>
                </div>
                
                <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </CardTitle>
                
                <CardDescription className="text-sm mb-3 line-clamp-2">
                  {course.description}
                </CardDescription>
                
                <div className="text-sm text-gray-600 mb-3">
                  by {course.instructor}
                </div>
                
                <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{course.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {course.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-green-600">{course.price}</span>
                    <span className="text-sm text-gray-500 line-through ml-2">{course.originalPrice}</span>
                  </div>
                  <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                    Enroll Free
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingCourses;
