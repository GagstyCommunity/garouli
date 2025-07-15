
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  User, 
  TrendingUp,
  Star,
  Eye,
  ArrowRight
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

const Codex = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCodexData();
  }, []);

  const fetchCodexData = async () => {
    try {
      // Fetch all published courses with instructor info
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_instructor_id_fkey(full_name, avatar_url)
        `)
        .eq('is_published', true)
        .order('student_count', { ascending: false });

      if (coursesError) throw coursesError;

      // Process categories with counts
      const categoryMap = {};
      coursesData?.forEach(course => {
        if (course.category) {
          categoryMap[course.category] = (categoryMap[course.category] || 0) + 1;
        }
      });

      const categoriesWithCounts = [
        { id: 'all', name: 'All Topics', count: coursesData?.length || 0 },
        ...Object.entries(categoryMap).map(([category, count]) => ({
          id: category.toLowerCase().replace(/\s+/g, '-'),
          name: category,
          count
        }))
      ];

      setCourses(coursesData || []);
      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error('Error fetching codex data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           course.category?.toLowerCase().replace(/\s+/g, '-') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredCourses = courses.filter(course => course.rating >= 4.7).slice(0, 6);
  const popularCourses = courses.sort((a, b) => (b.student_count || 0) - (a.student_count || 0)).slice(0, 6);

  const trendingTopics = categories
    .filter(cat => cat.id !== 'all')
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">Loading learning resources...</div>
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
            <h1 className="text-5xl font-bold mb-6">Garouli Codex</h1>
            <p className="text-xl mb-8 opacity-90">
              Your ultimate learning hub for AI, automation, and modern technology
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search courses, tutorials, and guides..."
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
            <div className="space-y-6">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-medium">{category.name}</span>
                        <Badge variant="secondary">{category.count}</Badge>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trending Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Trending Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {trendingTopics.map((topic, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <span className="text-sm font-medium">{topic.name}</span>
                        <Badge variant="outline" className="text-xs">{topic.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="latest" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="latest">Latest</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
              </TabsList>

              <TabsContent value="latest" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCourses.map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <Link to={`/courses/${course.id}`}>
                        <div className="aspect-video bg-gray-200 rounded-t-lg relative overflow-hidden">
                          {course.thumbnail_url ? (
                            <img 
                              src={course.thumbnail_url} 
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
                              <BookOpen className="h-16 w-16 text-white opacity-80" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          <Badge className="absolute top-2 right-2 bg-white text-gray-800">
                            {course.difficulty}
                          </Badge>
                          <div className="absolute bottom-4 left-4 text-white">
                            <div className="flex items-center space-x-2 text-sm">
                              <Clock className="h-4 w-4" />
                              <span>{course.duration_hours}h</span>
                            </div>
                          </div>
                        </div>
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary">{course.category}</Badge>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span>{course.rating}</span>
                            </div>
                          </div>
                          <CardTitle className="text-lg hover:text-blue-600 transition-colors">
                            {course.title}
                          </CardTitle>
                          <CardDescription>{course.short_description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {course.profiles?.full_name || 'Anonymous'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Eye className="h-4 w-4" />
                              <span>{course.student_count}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="featured" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredCourses.map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <Link to={`/courses/${course.id}`}>
                        <div className="aspect-video bg-gray-200 rounded-t-lg relative overflow-hidden">
                          {course.thumbnail_url ? (
                            <img 
                              src={course.thumbnail_url} 
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
                              <BookOpen className="h-16 w-16 text-white opacity-80" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
                            Featured
                          </Badge>
                          <Badge className="absolute top-2 right-2 bg-white text-gray-800">
                            {course.difficulty}
                          </Badge>
                          <div className="absolute bottom-4 left-4 text-white">
                            <div className="flex items-center space-x-2 text-sm">
                              <Clock className="h-4 w-4" />
                              <span>{course.duration_hours}h</span>
                            </div>
                          </div>
                        </div>
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary">{course.category}</Badge>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span>{course.rating}</span>
                            </div>
                          </div>
                          <CardTitle className="text-lg hover:text-blue-600 transition-colors">
                            {course.title}
                          </CardTitle>
                          <CardDescription>{course.short_description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {course.profiles?.full_name || 'Anonymous'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Eye className="h-4 w-4" />
                              <span>{course.student_count}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="popular" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {popularCourses.map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <Link to={`/courses/${course.id}`}>
                        <div className="aspect-video bg-gray-200 rounded-t-lg relative overflow-hidden">
                          {course.thumbnail_url ? (
                            <img 
                              src={course.thumbnail_url} 
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
                              <BookOpen className="h-16 w-16 text-white opacity-80" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          <Badge className="absolute top-2 right-2 bg-white text-gray-800">
                            {course.difficulty}
                          </Badge>
                          <div className="absolute bottom-4 left-4 text-white">
                            <div className="flex items-center space-x-2 text-sm">
                              <Clock className="h-4 w-4" />
                              <span>{course.duration_hours}h</span>
                            </div>
                          </div>
                        </div>
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary">{course.category}</Badge>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span>{course.rating}</span>
                            </div>
                          </div>
                          <CardTitle className="text-lg hover:text-blue-600 transition-colors">
                            {course.title}
                          </CardTitle>
                          <CardDescription>{course.short_description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {course.profiles?.full_name || 'Anonymous'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Eye className="h-4 w-4" />
                              <span>{course.student_count}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Courses
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Codex;
