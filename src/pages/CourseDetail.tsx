
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  Award, 
  BookOpen, 
  Download,
  Share2,
  Heart,
  MessageCircle
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';

const CourseDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<any>(null);
  const [instructor, setInstructor] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!slug) return;

      try {
        // Fetch course by ID (using slug as ID for now)
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', slug)
          .eq('is_published', true)
          .single();

        if (courseError) {
          console.error('Error fetching course:', courseError);
          return;
        }

        setCourse(courseData);

        // Fetch instructor profile
        const { data: instructorData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', courseData.instructor_id)
          .single();

        setInstructor(instructorData);

        // Check if user is enrolled
        if (user) {
          const { data: enrollmentData } = await supabase
            .from('course_enrollments')
            .select('*')
            .eq('user_id', user.id)
            .eq('course_id', courseData.id)
            .single();

          setIsEnrolled(!!enrollmentData);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug, user]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!course) return;

    try {
      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.id,
          course_id: course.id,
          progress: 0
        });

      if (error) {
        throw error;
      }

      setIsEnrolled(true);
      toast({
        title: "Enrolled successfully!",
        description: "You can now start learning this course."
      });
    } catch (error: any) {
      console.error('Error enrolling:', error);
      toast({
        title: "Error enrolling",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
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
            <h1 className="text-2xl font-bold mb-4">Course not found</h1>
            <Button onClick={() => navigate('/courses')}>
              Browse Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <Badge variant="secondary" className="mb-2">
                  {course.category}
                </Badge>
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-xl text-gray-300 mb-6">{course.short_description}</p>
              </div>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{course.rating || 0}</span>
                  <span className="text-gray-300">(1,234 ratings)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>{course.student_count || 0} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>{course.duration_hours}h total</span>
                </div>
              </div>

              {instructor && (
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {instructor.full_name?.charAt(0) || 'I'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">Created by {instructor.full_name}</p>
                    <p className="text-gray-300 text-sm">{instructor.bio}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-4">
                <Badge variant="outline">
                  {course.difficulty}
                </Badge>
                {course.has_certification && (
                  <Badge variant="outline">
                    <Award className="h-4 w-4 mr-1" />
                    Certificate
                  </Badge>
                )}
                <Badge variant="outline">
                  Last updated 12/2024
                </Badge>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-white text-gray-900 sticky top-24">
                <CardContent className="p-6">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <Play className="h-16 w-16 text-gray-400" />
                  </div>
                  
                  <div className="text-center mb-6">
                    {course.is_free ? (
                      <div className="text-3xl font-bold text-green-600">Free</div>
                    ) : (
                      <div className="text-3xl font-bold">${course.price}</div>
                    )}
                  </div>

                  {isEnrolled ? (
                    <Button 
                      className="w-full mb-4" 
                      onClick={() => navigate(`/learn/${course.id}`)}
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <Button 
                      className="w-full mb-4" 
                      onClick={handleEnroll}
                    >
                      Enroll Now
                    </Button>
                  )}

                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  <div className="text-sm text-gray-600 space-y-2">
                    <p>✓ Full lifetime access</p>
                    <p>✓ Access on mobile and TV</p>
                    <p>✓ Certificate of completion</p>
                    <p>✓ 30-day money-back guarantee</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>What you'll learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <span>Master the fundamentals of AI and machine learning</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <span>Build real-world projects using Python</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <span>Understand data preprocessing and analysis</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <span>Deploy models to production environments</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Course Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {course.description || "This comprehensive course will take you through the fundamentals of modern technology and AI. You'll learn practical skills that you can apply immediately in your work and projects."}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum">
                <Card>
                  <CardHeader>
                    <CardTitle>Course Curriculum</CardTitle>
                    <CardDescription>
                      {course.duration_hours} hours • 45 lectures • All levels
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="section-1">
                        <AccordionTrigger>Section 1: Introduction to AI</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                              <div className="flex items-center space-x-2">
                                <Play className="h-4 w-4" />
                                <span>What is Artificial Intelligence?</span>
                              </div>
                              <span className="text-sm text-gray-500">10:30</span>
                            </div>
                            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                              <div className="flex items-center space-x-2">
                                <Play className="h-4 w-4" />
                                <span>History and Evolution of AI</span>
                              </div>
                              <span className="text-sm text-gray-500">15:45</span>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="section-2">
                        <AccordionTrigger>Section 2: Machine Learning Basics</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                              <div className="flex items-center space-x-2">
                                <Play className="h-4 w-4" />
                                <span>Introduction to Machine Learning</span>
                              </div>
                              <span className="text-sm text-gray-500">20:15</span>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="instructor">
                {instructor && (
                  <Card>
                    <CardHeader>
                      <CardTitle>About the Instructor</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="text-2xl">
                            {instructor.full_name?.charAt(0) || 'I'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{instructor.full_name}</h3>
                          <p className="text-gray-600 mb-4">{instructor.bio}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>1,234 students</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <BookOpen className="h-4 w-4" />
                              <span>5 courses</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4" />
                              <span>4.8 rating</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
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
                            Excellent course! The instructor explains complex concepts in a very understandable way. Highly recommended for beginners.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Related Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-200 rounded"></div>
                    <div>
                      <h4 className="font-semibold">Advanced AI Concepts</h4>
                      <p className="text-sm text-gray-600">$49.99</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-200 rounded"></div>
                    <div>
                      <h4 className="font-semibold">Python for Data Science</h4>
                      <p className="text-sm text-gray-600">Free</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
