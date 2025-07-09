import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BookOpen, Trophy, Star, Clock, Target, Award, Code, ExternalLink, Calendar, Flame, Users, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';
import LearningCompetitions from '@/components/LearningCompetitions';
import StudyGroups from '@/components/StudyGroups';
import VoiceAssistant from '@/components/VoiceAssistant';
import IntegrationMarketplace from '@/components/IntegrationMarketplace';

interface StudentDashboardProps {
  isEnterprise?: boolean;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ isEnterprise = false }) => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [practicals, setPracticals] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [recommendedCourses, setRecommendedCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Fetch user profile with gamification data
        const userResponse = await apiRequest('GET', `/api/users/${user.id}`);
        setUserProfile(userResponse);

        // Fetch enrollments
        const enrollmentsResponse = await apiRequest('GET', `/api/users/${user.id}/enrollments`);
        setEnrollments(enrollmentsResponse);

        // Fetch practicals
        const practicalsResponse = await apiRequest('GET', `/api/users/${user.id}/practicals`);
        setPracticals(practicalsResponse);

        // Fetch badges
        const badgesResponse = await apiRequest('GET', `/api/users/${user.id}/badges`);
        setBadges(badgesResponse);

        // Fetch recommended courses (mock for now)
        const coursesResponse = await apiRequest('GET', '/api/courses?limit=3');
        setRecommendedCourses(coursesResponse.slice(0, 3));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const completedCourses = enrollments.filter(e => e.enrollment?.progress === 100);
  const inProgressCourses = enrollments.filter(e => e.enrollment?.progress > 0 && e.enrollment?.progress < 100);
  const totalXP = userProfile?.xpPoints || 0;
  const level = userProfile?.level || 1;
  const streak = userProfile?.streak || 0;

  const submittedPracticals = practicals.filter(p => p.status === 'submitted');
  const approvedPracticals = practicals.filter(p => p.status === 'approved');
  const featuredPracticals = practicals.filter(p => p.isFeatured);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {userProfile?.firstName || user?.email?.split('@')[0] || 'Learner'}!
          </h1>
          <p className="text-muted-foreground">
            Continue your learning journey and achieve your goals
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Learning Streak</div>
            <div className="flex items-center text-lg font-bold text-orange-500">
              <Flame className="h-4 w-4 mr-1" />
              {streak} days
            </div>
          </div>
          <Avatar className="h-16 w-16">
            <AvatarImage src={userProfile?.avatar} />
            <AvatarFallback className="text-lg">
              {(userProfile?.firstName?.[0] || user?.email?.[0] || 'L').toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total XP</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalXP.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Level {level}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{enrollments.length}</div>
            <p className="text-xs text-muted-foreground">{completedCourses.length} completed</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Practicals</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{practicals.length}</div>
            <p className="text-xs text-muted-foreground">{approvedPracticals.length} approved</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{badges.length}</div>
            <p className="text-xs text-muted-foreground">Achievements earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="practicals">Practicals</TabsTrigger>
          <TabsTrigger value="competitions">Compete</TabsTrigger>
          <TabsTrigger value="study-groups">Groups</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="integrations">Connect</TabsTrigger>
          <TabsTrigger value="recommended">Discover</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {inProgressCourses.slice(0, 3).map((enrollment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{enrollment.course?.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Progress: {enrollment.enrollment?.progress}%
                      </div>
                    </div>
                    <Progress value={enrollment.enrollment?.progress || 0} className="w-20" />
                  </div>
                ))}
                {inProgressCourses.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No courses in progress</p>
                )}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Recent Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {badges.slice(0, 4).map((userBadge, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 border rounded-lg">
                      <div className="text-2xl">{userBadge.badge?.icon || '🏆'}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{userBadge.badge?.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(userBadge.earnedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {badges.length === 0 && (
                    <p className="text-muted-foreground text-center py-4 col-span-2">No badges earned yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* My Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20" />
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold line-clamp-2">{enrollment.course?.title}</h3>
                      <Badge variant="outline" className="mt-1">
                        {enrollment.course?.level || 'Beginner'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{enrollment.enrollment?.progress || 0}%</span>
                      </div>
                      <Progress value={enrollment.enrollment?.progress || 0} />
                    </div>
                    <Button asChild size="sm" className="w-full">
                      <Link href={`/courses/${enrollment.course?.id}`}>
                        {enrollment.enrollment?.progress === 100 ? 'Review Course' : 'Continue Learning'}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {enrollments.length === 0 && (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses enrolled yet</h3>
                <p className="text-muted-foreground mb-4">Explore our course catalog to start learning</p>
                <Button asChild>
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Practicals Tab */}
        <TabsContent value="practicals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practicals.map((practical, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{practical.title}</CardTitle>
                    <Badge variant={practical.status === 'approved' ? 'default' : 'secondary'}>
                      {practical.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {practical.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Submitted: {new Date(practical.submittedAt).toLocaleDateString()}
                    </div>
                    {practical.score && (
                      <Badge variant="outline">{practical.score}/100</Badge>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button asChild size="sm" variant="outline" className="flex-1">
                      <a href={practical.submissionUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Project
                      </a>
                    </Button>
                    {practical.githubUrl && (
                      <Button asChild size="sm" variant="outline">
                        <a href={practical.githubUrl} target="_blank" rel="noopener noreferrer">
                          Code
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {practicals.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No practicals submitted yet</h3>
                <p className="text-muted-foreground">Complete course modules to submit your projects</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Certifications Tab */}
        <TabsContent value="certifications" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedCourses.map((enrollment, index) => (
              <Card key={index} className="border-2 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-green-600" />
                    Certificate of Completion
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold">{enrollment.course?.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Completed on {new Date(enrollment.enrollment?.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {enrollment.enrollment?.certificateUrl ? (
                      <Button asChild size="sm">
                        <a href={enrollment.enrollment.certificateUrl} target="_blank" rel="noopener noreferrer">
                          Download Certificate
                        </a>
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        Certificate Generating...
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {completedCourses.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No certificates earned yet</h3>
                <p className="text-muted-foreground">Complete courses to earn certificates</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Competitions Tab */}
        <TabsContent value="competitions" className="space-y-6">
          <LearningCompetitions />
        </TabsContent>

        {/* Study Groups Tab */}
        <TabsContent value="study-groups" className="space-y-6">
          <StudyGroups />
        </TabsContent>

        {/* Voice Assistant Tab */}
        <TabsContent value="voice" className="space-y-6">
          <VoiceAssistant />
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <IntegrationMarketplace />
        </TabsContent>

        {/* Recommended Tab */}
        <TabsContent value="recommended" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Recommended for You
              </CardTitle>
              <CardDescription>
                Based on your learning progress and interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedCourses.map((course, index) => (
                  <Card key={index} className="border-dashed">
                    <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20" />
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold line-clamp-2">{course.title}</h3>
                          <Badge variant="outline" className="mt-1">
                            {course.level}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {course.description}
                        </p>
                        <Button asChild size="sm" className="w-full">
                          <Link href={`/courses/${course.id}`}>View Course</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;