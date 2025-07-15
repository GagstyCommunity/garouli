
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Star, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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
}

const TrendingCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('student_count', { ascending: false })
        .limit(6);

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loading Courses...</h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trending <span className="text-gradient">Courses</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the most popular courses chosen by thousands of learners worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {courses.map((course) => (
            <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 hover-scale">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={course.thumbnail_url} 
                  alt={course.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
                    {course.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-white/90 border-0">
                    {course.difficulty}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {course.short_description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    {course.duration_hours}h
                  </div>
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    {course.student_count.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <Star size={14} className="mr-1 text-yellow-400 fill-current" />
                    {course.rating}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {course.tags?.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold">
                    {course.is_free ? 'Free' : `$${course.price}`}
                  </div>
                </div>

                <Link to={`/courses/${course.id}`}>
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                    <BookOpen size={16} className="mr-2" />
                    Start Learning
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/courses">
            <Button variant="outline" size="lg" className="hover-scale">
              View All Courses
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingCourses;
