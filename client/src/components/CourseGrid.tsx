
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

interface Course {
  id: string;
  title: string;
  short_description: string;
  category: string;
  difficulty: string;
  duration_hours: number;
  student_count: number;
  rating: number;
  thumbnail_url: string;
  tags: string[];
  price: number;
  is_free: boolean;
  has_certification: boolean;
}

const CourseGrid: React.FC<CourseGridProps> = ({ searchQuery, filters }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, [searchQuery, filters]);

  const fetchCourses = async () => {
    try {
      let query = supabase
        .from('courses')
        .select('*')
        .eq('is_published', true);

      // Apply search filter
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%`);
      }

      // Apply category filter
      if (filters.categories.length > 0) {
        query = query.in('category', filters.categories);
      }

      // Apply difficulty filter
      if (filters.difficulty.length > 0) {
        query = query.in('difficulty', filters.difficulty);
      }

      // Apply certification filter
      if (filters.certification) {
        query = query.eq('has_certification', true);
      }

      const { data, error } = await query.order('student_count', { ascending: false });

      if (error) throw error;

      let filteredCourses = data || [];

      // Apply duration filter (client-side since it's range-based)
      if (filters.duration.length > 0) {
        filteredCourses = filteredCourses.filter(course => {
          return filters.duration.some(duration => {
            switch (duration) {
              case '2-10 hours':
                return course.duration_hours >= 2 && course.duration_hours <= 10;
              case '10-20 hours':
                return course.duration_hours > 10 && course.duration_hours <= 20;
              case '20+ hours':
                return course.duration_hours > 20;
              default:
                return true;
            }
          });
        });
      }

      setCourses(filteredCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-xl font-semibold mb-2">Loading courses...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {courses.length} Course{courses.length !== 1 ? 's' : ''} Found
        </h2>
        <div className="text-sm text-muted-foreground">
          Showing all courses
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 hover-scale">
            <CardHeader className="p-0">
              <div className="relative">
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-white/90 text-foreground">
                    {course.is_free ? 'Free' : `$${course.price}`}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="outline" className="bg-white/90">
                    {course.category}
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
                {course.has_certification && (
                  <Badge variant="outline" className="text-xs">
                    Certificate
                  </Badge>
                )}
              </div>
              
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {course.title}
              </h3>
              
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {course.short_description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.duration_hours}h
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {course.student_count.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {course.rating}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {course.tags?.slice(0, 3).map((tag) => (
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

      {courses.length === 0 && (
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
