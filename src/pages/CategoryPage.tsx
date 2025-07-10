
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Clock, 
  Users, 
  Star,
  BookOpen,
  Filter
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [loading, setLoading] = useState(true);

  const categoryDisplayName = category?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) || '';

  useEffect(() => {
    fetchCourses();
  }, [category]);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, selectedDifficulty]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_instructor_id_fkey(full_name, avatar_url)
        `)
        .eq('category', category)
        .eq('is_published', true);

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = courses;

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(course => course.difficulty === selectedDifficulty);
    }

    setFilteredCourses(filtered);
  };

  const handleEnrollCourse = async (courseId) => {
    // This will be implemented with proper authentication
    navigate(`/courses/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">Loading courses...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">{categoryDisplayName} Courses</h1>
            <p className="text-xl mb-8 opacity-90">
              Master {categoryDisplayName.toLowerCase()} with our comprehensive courses
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg bg-white text-gray-900 border-0 rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Difficulty Level</h4>
                    <div className="space-y-2">
                      {['all', 'Beginner', 'Intermediate', 'Advanced', 'Expert'].map((level) => (
                        <button
                          key={level}
                          onClick={() => setSelectedDifficulty(level)}
                          className={`w-full text-left p-2 rounded-lg transition-colors ${
                            selectedDifficulty === level
                              ? 'bg-blue-50 text-blue-600 border border-blue-200'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {level === 'all' ? 'All Levels' : level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {filteredCourses.length} {categoryDisplayName} Course{filteredCourses.length !== 1 ? 's' : ''}
              </h2>
              <p className="text-gray-600">
                Learn from industry experts and advance your {categoryDisplayName.toLowerCase()} skills
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg relative overflow-hidden">
                    {course.thumbnail_url ? (
                      <img 
                        src={course.thumbnail_url} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-white opacity-80" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-white text-gray-800">
                        {course.difficulty}
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="bg-black/50 text-white">
                        ${course.price}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg hover:text-blue-600 transition-colors">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.short_description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">{course.duration_hours}h</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">{course.student_count}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm text-gray-600">{course.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        by {course.profiles?.full_name || 'Anonymous'}
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleEnrollCourse(course.id)}
                        className="group-hover:bg-blue-600 transition-colors"
                      >
                        View Course
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">No courses found</h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? `No courses match your search "${searchTerm}"`
                    : `No ${categoryDisplayName.toLowerCase()} courses available yet`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
