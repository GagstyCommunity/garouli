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
import { 
  Code, DollarSign, Star, Clock, Target, CheckCircle, AlertCircle, 
  Calendar, FileText, ExternalLink, Github, Trophy, Briefcase, Plus
} from 'lucide-react';
import { Link } from 'wouter';

const ContributorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [earnings, setEarnings] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskDialog, setShowTaskDialog] = useState(false);

  useEffect(() => {
    const fetchContributorData = async () => {
      if (!user) return;

      try {
        // Fetch user profile
        const userResponse = await apiRequest('GET', `/api/users/${user.id}`);
        setProfile(userResponse);

        // Fetch contributor tasks
        const tasksResponse = await apiRequest('GET', `/api/contributor-tasks?userId=${user.id}`);
        setTasks(tasksResponse);

        // Mock earnings data (would come from real payment processing)
        setEarnings({
          totalEarned: 2450.50,
          pendingPayment: 125.00,
          thisMonth: 380.75,
          completedTasks: tasksResponse.filter((t: any) => t.status === 'completed').length,
          averageRating: 4.8
        });

        // Mock portfolio data
        setPortfolio([
          { id: 1, title: 'AI Chatbot Tutorial', type: 'Course Content', rating: 4.9, completedAt: '2024-01-15' },
          { id: 2, title: 'React Components Library', type: 'Code Review', rating: 4.7, completedAt: '2024-01-10' },
          { id: 3, title: 'Python Data Science Guide', type: 'Course Content', rating: 5.0, completedAt: '2024-01-05' }
        ]);

      } catch (error) {
        console.error('Error fetching contributor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContributorData();
  }, [user]);

  const activeTasks = tasks.filter(t => t.status === 'in_progress');
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

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
            <AvatarImage src={profile?.avatar} />
            <AvatarFallback className="text-lg">
              {(profile?.firstName?.[0] || user?.email?.[0] || 'C').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{profile?.firstName || 'Contributor'}</h1>
            <p className="text-muted-foreground">Expert Contributor • {earnings?.averageRating}/5 rating</p>
            <Badge variant="default" className="mt-1">
              Verified Contributor
            </Badge>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Public Profile
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Browse Tasks
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${earnings?.totalEarned?.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">${earnings?.thisMonth} this month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeTasks.length}</div>
            <p className="text-xs text-muted-foreground">{pendingTasks.length} pending review</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{completedTasks.length}</div>
            <p className="text-xs text-muted-foreground">Projects delivered</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{earnings?.averageRating}/5</div>
            <p className="text-xs text-muted-foreground">Average client rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Tasks</h2>
            <Button asChild>
              <Link href="/contribute">Browse Available Tasks</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...activeTasks, ...pendingTasks].map((task) => (
              <Card key={task.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">{task.title}</CardTitle>
                    <Badge variant={task.status === 'in_progress' ? 'default' : 'secondary'}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {task.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">${task.payment}</span>
                    <span className="text-muted-foreground">Due: {new Date(task.deadline).toLocaleDateString()}</span>
                  </div>
                  
                  {task.status === 'in_progress' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} />
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      {task.status === 'in_progress' ? 'Continue Work' : 'Start Task'}
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {activeTasks.length === 0 && pendingTasks.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No active tasks</h3>
                <p className="text-muted-foreground mb-4">Browse available tasks to start earning</p>
                <Button asChild>
                  <Link href="/contribute">Find Tasks</Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Portfolio</h2>
            <Button variant="outline">
              <Github className="h-4 w-4 mr-2" />
              Connect GitHub
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <Badge variant="outline" className="mt-1">{item.type}</Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{item.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Completed on {new Date(item.completedAt).toLocaleDateString()}
                  </p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Project
                    </Button>
                    <Button size="sm" variant="outline">
                      <Github className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Earnings Tab */}
        <TabsContent value="earnings" className="space-y-6">
          <h2 className="text-2xl font-bold">Earnings & Payments</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Earned</span>
                  <span className="font-bold text-green-600">${earnings?.totalEarned}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pending Payment</span>
                  <span className="font-bold text-orange-600">${earnings?.pendingPayment}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>This Month</span>
                  <span className="font-bold">${earnings?.thisMonth}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average per Task</span>
                  <span className="font-bold">${(earnings?.totalEarned / completedTasks.length || 0).toFixed(2)}</span>
                </div>
                <Button className="w-full mt-4">
                  Request Payout
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Tasks Completed</span>
                  <span className="font-bold">{completedTasks.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Rating</span>
                  <span className="font-bold">{earnings?.averageRating}/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>On-time Delivery</span>
                  <span className="font-bold text-green-600">96%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Client Satisfaction</span>
                  <span className="font-bold text-green-600">98%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-center py-8">
                Payment history will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Job Opportunities</h2>
            <Button variant="outline">
              <Briefcase className="h-4 w-4 mr-2" />
              View All Jobs
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Senior Frontend Developer</CardTitle>
                    <p className="text-muted-foreground">TechCorp Inc.</p>
                  </div>
                  <Badge variant="default">Recommended</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Remote • Full-time • $90k-$130k
                </p>
                <p className="text-sm">
                  Looking for an experienced React developer to join our growing team.
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1">Apply Now</Button>
                  <Button size="sm" variant="outline">Save</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">AI/ML Engineer</CardTitle>
                    <p className="text-muted-foreground">DataMind Solutions</p>
                  </div>
                  <Badge variant="outline">Match: 85%</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  San Francisco, CA • Full-time • $120k-$180k
                </p>
                <p className="text-sm">
                  Build cutting-edge AI solutions for enterprise clients.
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1">Apply Now</Button>
                  <Button size="sm" variant="outline">Save</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Career Recommendations</CardTitle>
              <CardDescription>
                Based on your skills and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Improve Your Profile</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Add more portfolio projects to increase your visibility to potential employers.
                  </p>
                  <Button size="sm" variant="outline">Add Project</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Skill Development</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Consider learning TypeScript to qualify for more high-paying roles.
                  </p>
                  <Button size="sm" variant="outline">Browse Courses</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContributorDashboard;