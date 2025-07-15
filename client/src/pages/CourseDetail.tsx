
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Award,
  CheckCircle,
  User
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [instructor, setInstructor] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentProgress, setEnrollmentProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, [id, user]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (courseError) throw courseError;

      // Fetch instructor details
      const { data: instructorData, error: instructorError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', courseData.instructor_id)
        .single();

      if (instructorError) throw instructorError;

      // Fetch course modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', id)
        .order('order_index');

      if (modulesError) throw modulesError;

      // Check if user is enrolled (if logged in)
      if (user) {
        const { data: enrollmentData, error: enrollmentError } = await supabase
          .from('course_enrollments')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', id)
          .single();

        if (!enrollmentError && enrollmentData) {
          setIsEnrolled(true);
          setEnrollmentProgress(enrollmentData.progress || 0);
        }
      }

      setCourse(courseData);
      setInstructor(instructorData);
      setModules(modulesData || []);
    } catch (error) {
      console.error('Error fetching course data:', error);
      toast.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please sign in to enroll in courses');
      navigate('/auth');
      return;
    }

    if (isEnrolled) {
      // Navigate to course player
      navigate(`/course/${id}/play`);
      return;
    }

    setEnrolling(true);
    try {
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.id,
          course_id: id,
          progress: 0
        });

      if (error) throw error;

      // Update course student count
      await supabase
        .from('courses')
        .update({ 
          student_count: (course.student_count || 0) + 1 
        })
        .eq('id', id);

      setIsEnrolled(true);
      toast.success('Successfully enrolled in course!');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">Loading course...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <Button onClick={() => navigate('/courses')}>
              Back to Courses
            </Button>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Badge className="mb-4 bg-white text-indigo-600">
                {course.category}
              </Badge>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl mb-6 opacity-90">{course.short_description}</p>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{course.duration_hours} hours</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{course.student_count} students</span>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-400 fill-current" />
                  <span>{course.rating} rating</span>
                </div>
                <Badge variant="secondary">{course.difficulty}</Badge>
              </div>

              {instructor && (
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={instructor.avatar_url} />
                    <AvatarFallback>
                      {instructor.full_name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Instructor: {instructor.full_name}</p>
                    <p className="text-sm opacity-75">{instructor.bio?.substring(0, 80)}...</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="lg:col-span-1">
              <Card className="bg-white text-gray-900">
                <CardHeader>
                  <div className="text-center">
                    {course.thumbnail_url ? (
                      <img 
                        src={course.thumbnail_url} 
                        alt={course.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <div className="text-3xl font-bold text-indigo-600 mb-2">
                      {course.is_free ? 'Free' : `$${course.price}`}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isEnrolled && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{enrollmentProgress}%</span>
                      </div>
                      <Progress value={enrollmentProgress} className="mb-2" />
                    </div>
                  )}
                  
                  <Button 
                    className="w-full mb-4" 
                    size="lg"
                    onClick={handleEnroll}
                    disabled={enrolling}
                  >
                    {enrolling ? (
                      'Enrolling...'
                    ) : isEnrolled ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Continue Learning
                      </>
                    ) : (
                      'Enroll Now'
                    )}
                  </Button>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span>Lifetime access</span>
                    </div>
                    {course.has_certification && (
                      <div className="flex items-center">
                        <Award className="h-4 w-4 text-yellow-500 mr-2" />
                        <span>Certificate of completion</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 text-blue-500 mr-2" />
                      <span>{modules.length} modules</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-6">{course.description}</p>
                
                {course.tags && course.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">What you'll learn</h4>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="curriculum" className="space-y-4">
            {modules.map((module, index) => (
              <Card key={module.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Module {index + 1}: {module.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      {module.is_free && <Badge variant="secondary">Free</Badge>}
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {module.duration_minutes} min
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{module.description}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="instructor" className="space-y-6">
            {instructor && (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={instructor.avatar_url} />
                      <AvatarFallback className="text-lg">
                        {instructor.full_name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{instructor.full_name}</CardTitle>
                      <CardDescription>Course Instructor</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{instructor.bio}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseDetail;
