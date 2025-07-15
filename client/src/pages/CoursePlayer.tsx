
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { ChevronLeft, Play, CheckCircle, Lock, Book, Clock } from 'lucide-react';
import { toast } from 'sonner';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentModule, setCurrentModule] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_instructor_id_fkey(full_name)
        `)
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;

      // Fetch course modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

      if (modulesError) throw modulesError;

      setCourse(courseData);
      setModules(modulesData || []);
      if (modulesData && modulesData.length > 0) {
        setCurrentModule(modulesData[0]);
      }

      // Calculate progress (mock for now)
      setProgress(25);
    } catch (error) {
      console.error('Error fetching course data:', error);
      toast.error('Failed to load course content');
    } finally {
      setLoading(false);
    }
  };

  const handleModuleClick = (module) => {
    if (module.is_free || true) { // Allow access for demo
      setCurrentModule(module);
    } else {
      toast.error('This module requires course enrollment');
    }
  };

  const markModuleComplete = async () => {
    // Mock completion for demo
    toast.success('Module completed!');
    setProgress(Math.min(progress + 25, 100));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <Button onClick={() => navigate('/courses')}>
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/courses/${courseId}`)}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Button>
              <div>
                <h1 className="text-xl font-bold">{course.title}</h1>
                <p className="text-sm text-muted-foreground">
                  by {course.profiles?.full_name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">Progress</p>
                <p className="text-xs text-muted-foreground">{progress}% Complete</p>
              </div>
              <Progress value={progress} className="w-32" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Course Content */}
          <div className="lg:col-span-3">
            {currentModule ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <Play className="h-5 w-5 mr-2 text-green-600" />
                        {currentModule.title}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-2">
                        <Clock className="h-4 w-4 mr-1" />
                        {currentModule.duration_minutes} minutes
                      </CardDescription>
                    </div>
                    <Badge variant={currentModule.is_free ? 'secondary' : 'default'}>
                      {currentModule.is_free ? 'Free' : 'Premium'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Video Player Placeholder */}
                  <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-6">
                    <div className="text-center text-white">
                      <Play className="h-16 w-16 mx-auto mb-4" />
                      <p className="text-lg">Video Player</p>
                      <p className="text-sm opacity-75">Module: {currentModule.title}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">About this module</h3>
                      <p className="text-gray-600">{currentModule.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t">
                      <Button variant="outline">
                        <Book className="h-4 w-4 mr-2" />
                        Resources
                      </Button>
                      <Button onClick={markModuleComplete}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Book className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">Select a module to start learning</h3>
                  <p className="text-gray-600">Choose a module from the sidebar to begin</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Course Modules Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Course Modules</CardTitle>
                <CardDescription>
                  {modules.filter(m => m.is_free).length} free • {modules.length - modules.filter(m => m.is_free).length} premium
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {modules.map((module, index) => (
                    <button
                      key={module.id}
                      onClick={() => handleModuleClick(module)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0 ${
                        currentModule?.id === module.id ? 'bg-green-50 border-l-4 border-l-green-600' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {module.is_free ? (
                              <Play className="h-4 w-4 text-green-600" />
                            ) : (
                              <Lock className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">
                              {index + 1}. {module.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {module.duration_minutes} min
                            </p>
                          </div>
                        </div>
                        {currentModule?.id === module.id && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Book className="h-4 w-4 mr-2" />
                    Download Resources
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Take Quiz
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Badge className="h-4 w-4 mr-2" />
                    Get Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
