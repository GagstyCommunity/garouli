
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, Plus, Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  category: string;
  difficulty: string;
  duration_hours: number;
  is_published: boolean;
  student_count: number;
  rating: number;
  created_at: string;
  instructor_name?: string;
}

const CourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // First get courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;

      if (coursesData) {
        // Get instructor profiles separately to avoid join issues
        const instructorIds = [...new Set(coursesData.map(course => course.instructor_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', instructorIds);

        // Merge the data
        const enrichedCourses = coursesData.map(course => ({
          ...course,
          instructor_name: profilesData?.find(p => p.id === course.instructor_id)?.full_name || 'Unknown Instructor',
          description: course.description || '',
          category: course.category || 'General',
          difficulty: course.difficulty || 'Beginner',
          duration_hours: course.duration_hours || 0,
          student_count: course.student_count || 0,
          rating: course.rating || 0
        })) as Course[];

        setCourses(enrichedCourses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublished = async (courseId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_published: !currentStatus })
        .eq('id', courseId);

      if (error) throw error;

      setCourses(courses.map(course => 
        course.id === courseId ? { ...course, is_published: !currentStatus } : course
      ));
      
      toast.success(`Course ${!currentStatus ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course status');
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.instructor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading courses...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Course Management</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Course
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Courses ({courses.length})</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCourses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-5 w-5 text-blue-500" />
                        <h3 className="text-lg font-semibold">{course.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                      <p className="text-sm text-gray-500 mt-1">by {course.instructor_name}</p>
                    </div>
                    <Badge variant={course.is_published ? 'default' : 'secondary'}>
                      {course.is_published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>{course.category}</span>
                      <span>{course.difficulty}</span>
                      <span>{course.duration_hours}h</span>
                      <span>{course.student_count} students</span>
                      <span>⭐ {course.rating}/5</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={course.is_published ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleTogglePublished(course.id, course.is_published)}
                      >
                        {course.is_published ? (
                          <>
                            <XCircle className="h-4 w-4 mr-1" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Publish
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseManagement;
