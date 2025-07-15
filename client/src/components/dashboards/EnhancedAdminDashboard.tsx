
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  Briefcase,
  DollarSign,
  TrendingUp,
  Search,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const EnhancedAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalAgencies: 0,
    totalCourses: 0,
    totalJobs: 0,
    totalRevenue: 0,
    activeSubscriptions: 0
  });

  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Fetch user roles separately
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Create a map of user roles for easy lookup
      const userRolesMap = {};
      rolesData?.forEach(role => {
        if (!userRolesMap[role.user_id]) {
          userRolesMap[role.user_id] = [];
        }
        userRolesMap[role.user_id].push(role.role);
      });

      // Combine profiles with their roles
      const profilesWithRoles = profilesData?.map(profile => ({
        ...profile,
        user_roles: userRolesMap[profile.id] || []
      })) || [];

      // Fetch courses with instructor info
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select(`
          *,
          profiles!courses_instructor_id_fkey(full_name)
        `);

      if (coursesError) throw coursesError;

      // Fetch jobs with agency info
      const { data: jobsData, error: jobsError } = await supabase
        .from('job_postings')
        .select(`
          *,
          profiles!job_postings_agency_id_fkey(full_name)
        `);

      if (jobsError) throw jobsError;

      // Fetch agency subscriptions
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('agency_subscriptions')
        .select('*');

      if (subscriptionsError) throw subscriptionsError;

      // Process data
      const students = profilesWithRoles.filter(user => 
        user.user_roles.includes('student')
      );
      
      const instructors = profilesWithRoles.filter(user => 
        user.user_roles.includes('instructor')
      );
      
      const agenciesData = profilesWithRoles.filter(user => 
        user.user_roles.includes('enterprise')
      );

      const activeSubscriptions = subscriptionsData?.filter(sub => sub.status === 'active').length || 0;
      const totalRevenue = subscriptionsData?.reduce((sum, sub) => sum + (sub.annual_fee || 0), 0) || 0;

      setStats({
        totalUsers: profilesWithRoles.length,
        totalStudents: students.length,
        totalInstructors: instructors.length,
        totalAgencies: agenciesData.length,
        totalCourses: coursesData?.length || 0,
        totalJobs: jobsData?.length || 0,
        totalRevenue,
        activeSubscriptions
      });

      setUsers(profilesWithRoles);
      setCourses(coursesData || []);
      setJobs(jobsData || []);
      setAgencies(agenciesData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCourseStatus = async (courseId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_published: !currentStatus })
        .eq('id', courseId);

      if (error) throw error;
      
      await fetchDashboardData();
      toast.success(`Course ${!currentStatus ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      console.error('Error updating course status:', error);
      toast.error('Failed to update course status');
    }
  };

  const handleToggleJobStatus = async (jobId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('job_postings')
        .update({ is_active: !currentStatus })
        .eq('id', jobId);

      if (error) throw error;
      
      await fetchDashboardData();
      toast.success(`Job ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Failed to update job status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">Loading admin dashboard...</div>
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
              Active learning content
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Job Postings</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalAgencies} partner agencies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeSubscriptions} active subscriptions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="agencies">Agencies</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users
              .filter(user => 
                user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .slice(0, 12)
              .map((user) => (
                <Card key={user.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={user.avatar_url} />
                        <AvatarFallback>
                          {user.full_name?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{user.full_name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {user.user_roles?.map((role, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid gap-4">
            {courses.slice(0, 10).map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription>
                        by {course.profiles?.full_name || 'Unknown'} • {course.category}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={course.is_published ? 'default' : 'secondary'}>
                        {course.is_published ? 'Published' : 'Draft'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleCourseStatus(course.id, course.is_published)}
                      >
                        {course.is_published ? (
                          <XCircle className="h-4 w-4 mr-1" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        )}
                        {course.is_published ? 'Unpublish' : 'Publish'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{course.student_count || 0} students</span>
                    <span>Rating: {course.rating}/5</span>
                    <span>${course.price}</span>
                    <span>{course.duration_hours}h</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <div className="grid gap-4">
            {jobs.slice(0, 10).map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription>
                        by {job.profiles?.full_name || 'Unknown'} • {job.location}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={job.is_active ? 'default' : 'secondary'}>
                        {job.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleJobStatus(job.id, job.is_active)}
                      >
                        {job.is_active ? (
                          <XCircle className="h-4 w-4 mr-1" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        )}
                        {job.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{job.employment_type}</span>
                    <span>${job.salary_min?.toLocaleString()} - ${job.salary_max?.toLocaleString()}</span>
                    <span>{job.remote ? 'Remote' : 'On-site'}</span>
                    <span>{job.applications_count || 0} applications</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="agencies" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agencies.slice(0, 8).map((agency) => (
              <Card key={agency.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={agency.avatar_url} />
                      <AvatarFallback>
                        {agency.full_name?.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{agency.full_name}</p>
                      <p className="text-sm text-gray-500 truncate">{agency.email}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-2">{agency.bio}</p>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="outline">Enterprise</Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAdminDashboard;
