import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Building, Users, BookOpen, Briefcase, CreditCard, Plus, Edit, Trash2, 
  BarChart3, TrendingUp, DollarSign, Calendar, Settings, Eye, MessageSquare,
  CheckCircle, Clock, XCircle, FileText, Search
} from 'lucide-react';
import { Link } from 'wouter';

const AgencyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [agency, setAgency] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [showJobDialog, setShowJobDialog] = useState(false);

  useEffect(() => {
    const fetchAgencyData = async () => {
      if (!user) return;

      try {
        // Fetch agency profile
        const userResponse = await apiRequest('GET', `/api/users/${user.id}`);
        const agencyResponse = await apiRequest('GET', `/api/agencies/user/${user.id}`);
        setAgency({ ...userResponse, ...agencyResponse });

        // Fetch agency courses
        const coursesResponse = await apiRequest('GET', `/api/courses?agencyId=${agencyResponse.id}`);
        setCourses(coursesResponse);

        // Fetch agency jobs
        const jobsResponse = await apiRequest('GET', `/api/jobs?agencyId=${agencyResponse.id}`);
        setJobs(jobsResponse);

        // Mock analytics data (would come from real analytics in production)
        setAnalytics({
          totalStudents: 1250,
          activeCourses: coursesResponse.length,
          monthlyRevenue: 15800,
          courseCompletions: 89,
          avgRating: 4.7,
          growthRate: 23.5
        });

      } catch (error) {
        console.error('Error fetching agency data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgencyData();
  }, [user]);

  const handleCreateCourse = async (courseData: any) => {
    try {
      const newCourse = await apiRequest('POST', '/api/courses', {
        ...courseData,
        agencyId: agency.id,
        instructorId: user.id
      });
      setCourses([...courses, newCourse]);
      setShowCourseDialog(false);
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleCreateJob = async (jobData: any) => {
    try {
      const newJob = await apiRequest('POST', '/api/jobs', {
        ...jobData,
        agencyId: agency.id
      });
      setJobs([...jobs, newJob]);
      setShowJobDialog(false);
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    try {
      await apiRequest('DELETE', `/api/courses/${courseId}`);
      setCourses(courses.filter(c => c.id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    try {
      await apiRequest('DELETE', `/api/jobs/${jobId}`);
      setJobs(jobs.filter(j => j.id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={agency?.logo} />
            <AvatarFallback className="text-lg">
              <Building className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{agency?.companyName}</h1>
            <p className="text-muted-foreground">{agency?.industry} • {agency?.size}</p>
            <Badge variant={agency?.status === 'trial' ? 'secondary' : 'default'} className="mt-1">
              {agency?.status === 'trial' ? 'Free Trial' : 'Active Subscription'}
            </Badge>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Upgrade Plan
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{analytics?.totalStudents?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{analytics?.growthRate}% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${analytics?.monthlyRevenue?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From course subscriptions</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{analytics?.activeCourses}</div>
            <p className="text-xs text-muted-foreground">Average rating: {analytics?.avgRating}/5</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Course Management</h2>
            <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Course</DialogTitle>
                  <DialogDescription>Add a new course to your catalog</DialogDescription>
                </DialogHeader>
                <CourseForm onSubmit={handleCreateCourse} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20" />
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold line-clamp-2">{course.title}</h3>
                        <Badge variant="outline" className="mt-1">
                          {course.level}
                        </Badge>
                      </div>
                      <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                        {course.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {course.totalEnrollments} students • {course.rating}/5 rating
                    </div>
                    <div className="flex space-x-2">
                      <Button asChild size="sm" variant="outline" className="flex-1">
                        <Link href={`/courses/${course.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setSelectedCourse(course)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Course</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the course and cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCourse(course.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Job Management</h2>
            <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Post Job
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Post New Job</DialogTitle>
                  <DialogDescription>Create a job posting to attract talent</DialogDescription>
                </DialogHeader>
                <JobForm onSubmit={handleCreateJob} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                          {job.status}
                        </Badge>
                        {job.remote && <Badge variant="outline">Remote</Badge>}
                      </div>
                      <p className="text-muted-foreground mb-2">{job.location} • {job.type}</p>
                      <p className="text-sm line-clamp-2 mb-3">{job.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{job.applications} applications</span>
                        <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                        {job.salary && <span>{job.salary}</span>}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {job.applications}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setSelectedJob(job)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Job Posting</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the job posting and cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteJob(job.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold">Analytics & Insights</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Course Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.slice(0, 5).map((course, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium truncate">{course.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {course.totalEnrollments} students
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{course.rating}/5</div>
                        <Progress value={(course.rating / 5) * 100} className="w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Revenue Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>This Month</span>
                    <span className="font-bold text-green-600">${analytics?.monthlyRevenue?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Growth Rate</span>
                    <span className="font-bold text-blue-600">+{analytics?.growthRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Avg. per Student</span>
                    <span className="font-bold">${(analytics?.monthlyRevenue / analytics?.totalStudents).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-6">
          <h2 className="text-2xl font-bold">Student Management</h2>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Enrollments</CardTitle>
                <div className="flex space-x-2">
                  <Input placeholder="Search students..." className="w-64" />
                  <Button size="sm" variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-center py-8">
                Student enrollment data will be displayed here when available
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <h2 className="text-2xl font-bold">Billing & Subscription</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Plan</span>
                  <Badge>{agency?.subscriptionTier} Plan</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Status</span>
                  <Badge variant={agency?.status === 'trial' ? 'secondary' : 'default'}>
                    {agency?.status}
                  </Badge>
                </div>
                {agency?.status === 'trial' && (
                  <div className="flex justify-between items-center">
                    <span>Trial Ends</span>
                    <span className="text-orange-600 font-medium">
                      {new Date(agency?.trialEndsAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>Monthly Cost</span>
                  <span className="font-bold">$199.00</span>
                </div>
                <Button className="w-full">
                  {agency?.status === 'trial' ? 'Upgrade Plan' : 'Manage Subscription'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Billing History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground text-center py-8">
                  No billing history available during trial period
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Course Form Component
const CourseForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    price: '0',
    tags: '',
    requirements: '',
    learningOutcomes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      requirements: formData.requirements.split('\n').filter(Boolean),
      learningOutcomes: formData.learningOutcomes.split('\n').filter(Boolean)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Course Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g. AI, Web Development"
            required
          />
        </div>
        <div>
          <Label htmlFor="level">Level</Label>
          <select
            id="level"
            className="w-full px-3 py-2 border rounded-md"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>
      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="AI, Machine Learning, Python"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="submit">Create Course</Button>
      </div>
    </form>
  );
};

// Job Form Component
const JobForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: 'full-time',
    remote: false,
    salary: '',
    experience: 'mid',
    requirements: '',
    benefits: '',
    skills: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      requirements: formData.requirements.split('\n').filter(Boolean),
      benefits: formData.benefits.split('\n').filter(Boolean),
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Job Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="New York, NY"
          />
        </div>
        <div>
          <Label htmlFor="salary">Salary Range</Label>
          <Input
            id="salary"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            placeholder="$80,000 - $120,000"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Employment Type</Label>
          <select
            id="type"
            className="w-full px-3 py-2 border rounded-md"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>
        <div>
          <Label htmlFor="experience">Experience Level</Label>
          <select
            id="experience"
            className="w-full px-3 py-2 border rounded-md"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          >
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
          </select>
        </div>
      </div>
      <div>
        <Label htmlFor="skills">Required Skills (comma-separated)</Label>
        <Input
          id="skills"
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          placeholder="React, Node.js, TypeScript"
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="remote"
          checked={formData.remote}
          onChange={(e) => setFormData({ ...formData, remote: e.target.checked })}
        />
        <Label htmlFor="remote">Remote work allowed</Label>
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="submit">Post Job</Button>
      </div>
    </form>
  );
};

export default AgencyDashboard;