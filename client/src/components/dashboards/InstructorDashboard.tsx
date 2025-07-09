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
  BookOpen, Users, DollarSign, Star, TrendingUp, Plus, Edit, Trash2, 
  Eye, MessageSquare, Calendar, FileText, BarChart3, Target, Play
} from 'lucide-react';
import { Link } from 'wouter';

const InstructorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [earnings, setEarnings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCourseDialog, setShowCourseDialog] = useState(false);

  useEffect(() => {
    const fetchInstructorData = async () => {
      if (!user) return;

      try {
        // Fetch instructor courses
        const coursesResponse = await apiRequest('GET', `/api/courses?instructorId=${user.id}`);
        setCourses(coursesResponse);

        // Mock student data
        setStudents([
          { id: 1, name: 'John Doe', email: 'john@example.com', enrolledCourses: 3, progress: 75, lastActive: '2024-01-15' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', enrolledCourses: 2, progress: 90, lastActive: '2024-01-14' },
          { id: 3, name: 'Mike Johnson', email: 'mike@example.com', enrolledCourses: 1, progress: 45, lastActive: '2024-01-13' }
        ]);

        // Mock analytics data
        setAnalytics({
          totalStudents: 1247,
          totalEnrollments: 3521,
          averageRating: 4.8,
          completionRate: 87,
          monthlyGrowth: 15.3,
          topCourse: coursesResponse[0]?.title || 'AI Fundamentals'
        });

        // Mock earnings data
        setEarnings({
          totalRevenue: 18450.75,
          thisMonth: 2890.50,
          pendingPayout: 650.25,
          averagePerStudent: 28.50
        });

      } catch (error) {
        console.error('Error fetching instructor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorData();
  }, [user]);

  const handleCreateCourse = async (courseData: any) => {
    try {
      const newCourse = await apiRequest('POST', '/api/courses', {
        ...courseData,
        instructorId: user.id
      });
      setCourses([...courses, newCourse]);
      setShowCourseDialog(false);
    } catch (error) {
      console.error('Error creating course:', error);
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
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="text-lg">
              {(user?.email?.[0] || 'I').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
            <p className="text-muted-foreground">
              {analytics?.totalStudents} students • {analytics?.averageRating}/5 rating
            </p>
            <Badge variant="default" className="mt-1">
              Verified Instructor
            </Badge>
          </div>
        </div>
        <div className="flex space-x-2">
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
                <DialogDescription>Design and publish a new learning experience</DialogDescription>
              </DialogHeader>
              <CourseForm onSubmit={handleCreateCourse} />
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm">
            View Profile
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{analytics?.totalStudents?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{analytics?.monthlyGrowth}% this month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${earnings?.totalRevenue?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">${earnings?.thisMonth} this month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{courses.length}</div>
            <p className="text-xs text-muted-foreground">{analytics?.completionRate}% avg completion</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{analytics?.averageRating}/5</div>
            <p className="text-xs text-muted-foreground">Based on {analytics?.totalEnrollments} reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Course Management</h2>
            <Button onClick={() => setShowCourseDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 relative">
                  <div className="absolute top-2 right-2">
                    <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                      {course.status}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold line-clamp-2">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{course.category}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Students:</span>
                        <span className="font-medium ml-1">{course.totalEnrollments || 0}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Rating:</span>
                        <span className="font-medium ml-1">{course.rating || 'N/A'}/5</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button asChild size="sm" variant="outline" className="flex-1">
                        <Link href={`/courses/${course.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-4 w-4" />
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

            {courses.length === 0 && (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-4">Create your first course to start teaching</p>
                <Button onClick={() => setShowCourseDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Student Management</h2>
            <div className="flex space-x-2">
              <Input placeholder="Search students..." className="w-64" />
              <Button variant="outline">Export Data</Button>
            </div>
          </div>

          <div className="space-y-4">
            {students.map((student) => (
              <Card key={student.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{student.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        {student.enrolledCourses} courses • Last active: {student.lastActive}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm">Progress:</span>
                        <Progress value={student.progress} className="w-20" />
                        <span className="text-sm font-medium">{student.progress}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold">Performance Analytics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
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
                          {course.totalEnrollments || 0} students
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{course.rating || 'N/A'}/5</div>
                        <Progress value={(course.rating / 5) * 100 || 0} className="w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Completion Rate</span>
                  <span className="font-bold text-green-600">{analytics?.completionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Student Satisfaction</span>
                  <span className="font-bold">{analytics?.averageRating}/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Monthly Growth</span>
                  <span className="font-bold text-blue-600">+{analytics?.monthlyGrowth}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Top Course</span>
                  <span className="font-bold truncate max-w-32">{analytics?.topCourse}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Earnings Tab */}
        <TabsContent value="earnings" className="space-y-6">
          <h2 className="text-2xl font-bold">Earnings & Payouts</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Revenue Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Revenue</span>
                  <span className="font-bold text-green-600">${earnings?.totalRevenue}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>This Month</span>
                  <span className="font-bold">${earnings?.thisMonth}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pending Payout</span>
                  <span className="font-bold text-orange-600">${earnings?.pendingPayout}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Avg. per Student</span>
                  <span className="font-bold">${earnings?.averagePerStudent}</span>
                </div>
                <Button className="w-full">
                  Request Payout
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payout History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground text-center py-8">
                  Payout history will be displayed here
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
    learningOutcomes: '',
    requirements: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      learningOutcomes: formData.learningOutcomes.split('\n').filter(Boolean),
      requirements: formData.requirements.split('\n').filter(Boolean)
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
          placeholder="e.g. Complete AI Development Course"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe what students will learn..."
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
          <Label htmlFor="level">Difficulty Level</Label>
          <select
            id="level"
            className="w-full px-3 py-2 border rounded-md"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="learningOutcomes">Learning Outcomes (one per line)</Label>
        <Textarea
          id="learningOutcomes"
          value={formData.learningOutcomes}
          onChange={(e) => setFormData({ ...formData, learningOutcomes: e.target.value })}
          placeholder="Students will be able to..."
        />
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

export default InstructorDashboard;