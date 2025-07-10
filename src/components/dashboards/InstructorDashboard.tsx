
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, BookOpen, Users, DollarSign, TrendingUp, Eye, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRevenue: 0,
    totalCourses: 0,
    avgRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructorData = async () => {
      if (!user) return;

      try {
        // Fetch instructor's courses
        const { data: coursesData } = await supabase
          .from('courses')
          .select(`
            *,
            course_enrollments (
              id,
              user_id,
              progress
            )
          `)
          .eq('instructor_id', user.id);

        setCourses(coursesData || []);

        // Calculate stats
        const totalStudents = coursesData?.reduce((sum, course) => 
          sum + (course.course_enrollments?.length || 0), 0) || 0;
        
        const totalCourses = coursesData?.length || 0;
        const avgRating = coursesData?.reduce((sum, course) => sum + (course.rating || 0), 0) / totalCourses || 0;

        setStats({
          totalStudents,
          totalRevenue: 0, // TODO: Calculate from actual payments
          totalCourses,
          avgRating: Number(avgRating.toFixed(1))
        });
      } catch (error) {
        console.error('Error fetching instructor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Instructor Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your courses and track your teaching success
          </p>
        </div>
        <Button onClick={() => navigate('/instructor/create-course')} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Create Course
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Across all courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {courses.filter(c => c.is_published).length} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRating}</div>
            <p className="text-xs text-muted-foreground">
              Student feedback
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Course Management</CardTitle>
              <CardDescription>
                Create, edit, and manage your courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {courses.length > 0 ? (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold">{course.title}</h3>
                          <Badge variant={course.is_published ? "default" : "secondary"}>
                            {course.is_published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {course.course_enrollments?.length || 0} students • 
                          {course.difficulty} • 
                          {course.duration_hours}h
                        </p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {course.student_count || 0}
                          </span>
                          <span className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            {course.rating || 0}/5
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No courses created yet</p>
                  <Button onClick={() => navigate('/instructor/create-course')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Course
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Course Analytics</CardTitle>
              <CardDescription>
                Track student engagement and course performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Analytics coming soon</p>
                <p className="text-sm text-muted-foreground">
                  Detailed course performance metrics will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Instructor Profile</CardTitle>
              <CardDescription>
                Manage your public instructor profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Profile management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InstructorDashboard;
