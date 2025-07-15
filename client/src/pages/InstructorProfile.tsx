
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Star, 
  Users, 
  BookOpen, 
  Award, 
  Calendar,
  MapPin,
  Link as LinkIcon,
  Play,
  Clock
} from 'lucide-react';
import Navigation from '@/components/Navigation';

const InstructorProfile = () => {
  const { username } = useParams();
  const [instructor, setInstructor] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    avgRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructorData = async () => {
      if (!username) return;

      try {
        // For now, we'll use username as the instructor ID
        // In a real app, you'd have a username field in profiles
        const { data: instructorData, error: instructorError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', username)
          .single();

        if (instructorError) {
          console.error('Error fetching instructor:', instructorError);
          return;
        }

        setInstructor(instructorData);

        // Fetch instructor's courses
        const { data: coursesData } = await supabase
          .from('courses')
          .select(`
            *,
            course_enrollments (
              id,
              user_id
            )
          `)
          .eq('instructor_id', instructorData.id)
          .eq('is_published', true);

        setCourses(coursesData || []);

        // Calculate stats
        const totalStudents = coursesData?.reduce((sum, course) => 
          sum + (course.course_enrollments?.length || 0), 0) || 0;
        const totalCourses = coursesData?.length || 0;
        const avgRating = coursesData?.reduce((sum, course) => sum + (course.rating || 0), 0) / totalCourses || 0;

        setStats({
          totalStudents,
          totalCourses,
          avgRating: Number(avgRating.toFixed(1))
        });
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!instructor) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Instructor not found</h1>
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <Avatar className="w-32 h-32 border-4 border-white">
              <AvatarFallback className="text-4xl">
                {instructor.full_name?.charAt(0) || 'I'}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{instructor.full_name}</h1>
              <p className="text-xl text-blue-100 mb-4">{instructor.bio}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{stats.avgRating}</span>
                  <span className="text-blue-200">Instructor Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span className="font-semibold">{stats.totalStudents.toLocaleString()}</span>
                  <span className="text-blue-200">Students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span className="font-semibold">{stats.totalCourses}</span>
                  <span className="text-blue-200">Courses</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <Badge variant="secondary" className="bg-white text-gray-800">
                  <Award className="h-4 w-4 mr-1" />
                  Top Instructor
                </Badge>
                <Badge variant="secondary" className="bg-white text-gray-800">
                  <Calendar className="h-4 w-4 mr-1" />
                  Joined 2023
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-200 rounded-t-lg relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="h-12 w-12 text-gray-400" />
                    </div>
                    <Badge className="absolute top-2 right-2">
                      {course.difficulty}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.short_description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold">{course.rating || 0}</span>
                        <span className="text-sm text-gray-500">({course.student_count || 0})</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration_hours}h</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold">
                        {course.is_free ? 'Free' : `$${course.price}`}
                      </div>
                      <Button size="sm">View Course</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>About {instructor.full_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {instructor.bio || "This instructor hasn't provided a detailed bio yet."}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span>San Francisco, CA</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <LinkIcon className="h-5 w-5 text-gray-400" />
                      <a href="#" className="text-blue-600 hover:underline">
                        www.instructor-website.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Teaching Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Students</span>
                      <span className="font-semibold">{stats.totalStudents.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Courses</span>
                      <span className="font-semibold">{stats.totalCourses}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Average Rating</span>
                      <span className="font-semibold">{stats.avgRating}/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Response Time</span>
                      <span className="font-semibold">2 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Student Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold">John Smith</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">
                        Amazing instructor! Clear explanations and great course content. Highly recommend.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarFallback>MJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold">Mary Johnson</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600">
                        The best courses I've taken online. Very practical and well-structured.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InstructorProfile;
