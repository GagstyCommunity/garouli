
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Trophy, Star, Clock, Target, Award } from 'lucide-react';

interface StudentDashboardProps {
  isEnterprise?: boolean;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ isEnterprise = false }) => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [gamification, setGamification] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Fetch course enrollments
        const { data: enrollmentData } = await supabase
          .from('course_enrollments')
          .select(`
            *,
            courses (
              id,
              title,
              thumbnail_url,
              difficulty,
              duration_hours,
              instructor_id
            )
          `)
          .eq('user_id', user.id);

        // Fetch gamification data
        const { data: gamificationData } = await supabase
          .from('user_gamification')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setEnrollments(enrollmentData || []);
        setGamification(gamificationData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const completedCourses = enrollments.filter(e => e.progress === 100);
  const inProgressCourses = enrollments.filter(e => e.progress > 0 && e.progress < 100);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.user_metadata?.full_name || 'Student'}!
        </h1>
        <p className="text-muted-foreground">
          Continue your learning journey and track your progress
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total XP</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gamification?.total_xp || 0}</div>
            <p className="text-xs text-muted-foreground">
              Level {gamification?.level || 1}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrollments.length}</div>
            <p className="text-xs text-muted-foreground">
              {inProgressCourses.length} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCourses.length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((completedCourses.length / (enrollments.length || 1)) * 100)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gamification?.streak_days || 0}</div>
            <p className="text-xs text-muted-foreground">
              Days active
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Continue Learning</CardTitle>
                <CardDescription>
                  Pick up where you left off
                </CardDescription>
              </CardHeader>
              <CardContent>
                {inProgressCourses.length > 0 ? (
                  <div className="space-y-4">
                    {inProgressCourses.map((enrollment) => (
                      <div key={enrollment.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          <BookOpen className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{enrollment.courses.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {enrollment.courses.difficulty} • {enrollment.courses.duration_hours}h
                          </p>
                          <div className="mt-2">
                            <Progress value={enrollment.progress} className="w-full" />
                            <p className="text-xs text-muted-foreground mt-1">
                              {enrollment.progress}% complete
                            </p>
                          </div>
                        </div>
                        <Button>Continue</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No courses in progress</p>
                    <Button className="mt-4" onClick={() => window.location.href = '/courses'}>
                      Browse Courses
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>
                Badges and milestones you've earned
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gamification?.badges?.map((badge: string, index: number) => (
                  <div key={index} className="text-center p-4 border rounded-lg">
                    <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                    <Badge variant="secondary">{badge}</Badge>
                  </div>
                )) || (
                  <div className="col-span-full text-center py-8">
                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No badges earned yet</p>
                    <p className="text-sm text-muted-foreground">Complete courses to earn your first badge!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>
                Track your overall learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {completedCourses.length}/{enrollments.length} courses completed
                    </span>
                  </div>
                  <Progress 
                    value={enrollments.length > 0 ? (completedCourses.length / enrollments.length) * 100 : 0} 
                    className="w-full" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Time Invested
                    </h4>
                    <p className="text-2xl font-bold">
                      {enrollments.reduce((total, e) => total + (e.courses.duration_hours * (e.progress / 100)), 0).toFixed(1)}h
                    </p>
                    <p className="text-sm text-muted-foreground">Total learning time</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium flex items-center">
                      <Star className="h-4 w-4 mr-2" />
                      Current Level
                    </h4>
                    <p className="text-2xl font-bold">Level {gamification?.level || 1}</p>
                    <p className="text-sm text-muted-foreground">
                      {gamification?.total_xp || 0} XP earned
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
