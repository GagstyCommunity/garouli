
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  Briefcase, 
  Trophy,
  AlertTriangle,
  TrendingUp,
  Eye,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Smile
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalInstructors: number;
  totalAgencies: number;
  totalCourses: number;
  totalJobs: number;
  totalBattles: number;
  totalBlogs: number;
  pendingCourses: number;
  flaggedBlogs: number;
  unverifiedInstructors: number;
  todayLogins: number;
  todayBadges: number;
  redFlags: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalAgencies: 0,
    totalCourses: 0,
    totalJobs: 0,
    totalBattles: 0,
    totalBlogs: 0,
    pendingCourses: 0,
    flaggedBlogs: 0,
    unverifiedInstructors: 0,
    todayLogins: 0,
    todayBadges: 0,
    redFlags: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch basic stats
      const [
        { count: totalUsers },
        { count: totalCourses },
        { count: totalJobs },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('job_postings').select('*', { count: 'exact', head: true }),
      ]);

      // Mock data for features not yet implemented
      setStats({
        totalUsers: totalUsers || 0,
        totalStudents: Math.floor((totalUsers || 0) * 0.7),
        totalInstructors: Math.floor((totalUsers || 0) * 0.2),
        totalAgencies: Math.floor((totalUsers || 0) * 0.1),
        totalCourses: totalCourses || 0,
        totalJobs: totalJobs || 0,
        totalBattles: 5, // Mock data
        totalBlogs: 12, // Mock data
        pendingCourses: Math.floor((totalCourses || 0) * 0.3),
        flaggedBlogs: 2, // Mock data
        unverifiedInstructors: 3, // Mock data
        todayLogins: 24, // Mock data
        todayBadges: 8, // Mock data
        redFlags: 1, // Mock data
      });

      // Mock recent activity
      setRecentActivity([
        { type: 'user_signup', user: 'Alice Johnson', time: '2 hours ago', status: 'success' },
        { type: 'course_submitted', user: 'Bob Smith', course: 'Advanced React Patterns', time: '4 hours ago', status: 'pending' },
        { type: 'red_flag', user: 'Charlie Brown', reason: 'Inappropriate comment', time: '6 hours ago', status: 'warning' },
        { type: 'certificate_issued', user: 'Diana Prince', course: 'JavaScript Fundamentals', time: '8 hours ago', status: 'success' },
        { type: 'instructor_verification', user: 'Eve Wilson', time: '1 day ago', status: 'pending' },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    toast.success(`${action} action triggered!`);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_signup': return <Users className="h-4 w-4" />;
      case 'course_submitted': return <BookOpen className="h-4 w-4" />;
      case 'red_flag': return <AlertTriangle className="h-4 w-4" />;
      case 'certificate_issued': return <Trophy className="h-4 w-4" />;
      case 'instructor_verification': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'warning': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalStudents} students, {stats.totalInstructors} instructors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingCourses} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs & Battles</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs + stats.totalBattles}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalJobs} jobs, {stats.totalBattles} battles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayLogins}</div>
            <p className="text-xs text-muted-foreground">
              {stats.todayBadges} badges earned
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Pending Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Unverified Instructors</p>
                <p className="text-xs text-muted-foreground">Require LinkedIn verification</p>
              </div>
              <Badge variant="outline">{stats.unverifiedInstructors}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Pending Courses</p>
                <p className="text-xs text-muted-foreground">Awaiting approval</p>
              </div>
              <Badge variant="outline">{stats.pendingCourses}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Flagged Blogs</p>
                <p className="text-xs text-muted-foreground">Need moderation</p>
              </div>
              <Badge variant="outline">{stats.flaggedBlogs}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Red Flags</p>
                <p className="text-xs text-muted-foreground">User behavior alerts</p>
              </div>
              <Badge variant="destructive">{stats.redFlags}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleQuickAction('Add New Course')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Course
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleQuickAction('Verify Instructors')}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Verify Instructors
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleQuickAction('Review Red Flags')}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Review Red Flags
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => handleQuickAction('View Happy Users')}
            >
              <Smile className="h-4 w-4 mr-2" />
              👋 View Happy Users
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`p-1 rounded-full ${getStatusColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.user}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.course && `Course: ${activity.course}`}
                      {activity.reason && `Reason: ${activity.reason}`}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
