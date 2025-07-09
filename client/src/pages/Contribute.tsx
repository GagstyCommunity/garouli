import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Code, DollarSign, Clock, Target, Trophy, Users, Star, 
  CheckCircle, Calendar, Briefcase, BookOpen, Award
} from 'lucide-react';
import { Link } from 'wouter';

const Contribute: React.FC = () => {
  const [availableTasks, setAvailableTasks] = useState<any[]>([]);
  const [jobOpportunities, setJobOpportunities] = useState<any[]>([]);
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  useEffect(() => {
    // Mock available tasks
    setAvailableTasks([
      {
        id: 1,
        title: 'Create React Components for AI Course',
        description: 'Build interactive React components for our new AI fundamentals course including quiz systems and progress tracking.',
        category: 'Frontend Development',
        payment: 850,
        deadline: '2024-02-15',
        difficulty: 'Intermediate',
        skills: ['React', 'TypeScript', 'UI/UX'],
        estimatedHours: 15,
        company: 'Minutely AI Academy',
        postedAt: '2024-01-08'
      },
      {
        id: 2,
        title: 'AI Content Generation Pipeline',
        description: 'Develop n8n workflows for automated content generation using OpenAI APIs for course creation and student assessments.',
        category: 'AI/ML Engineering',
        payment: 1200,
        deadline: '2024-02-20',
        difficulty: 'Advanced',
        skills: ['n8n', 'OpenAI API', 'Python', 'Automation'],
        estimatedHours: 20,
        company: 'TechCorp',
        postedAt: '2024-01-10'
      },
      {
        id: 3,
        title: 'Course Video Editing & Production',
        description: 'Edit and produce high-quality educational videos for web development courses with professional transitions and animations.',
        category: 'Video Production',
        payment: 600,
        deadline: '2024-02-10',
        difficulty: 'Beginner',
        skills: ['Video Editing', 'After Effects', 'Premiere Pro'],
        estimatedHours: 12,
        company: 'EduCreate Studios',
        postedAt: '2024-01-12'
      },
      {
        id: 4,
        title: 'Technical Documentation Writer',
        description: 'Create comprehensive documentation for API endpoints and developer guides for our learning management system.',
        category: 'Technical Writing',
        payment: 450,
        deadline: '2024-02-25',
        difficulty: 'Intermediate',
        skills: ['Technical Writing', 'API Documentation', 'Markdown'],
        estimatedHours: 10,
        company: 'DevDocs Inc',
        postedAt: '2024-01-05'
      }
    ]);

    // Mock job opportunities
    setJobOpportunities([
      {
        id: 1,
        title: 'Senior Full-Stack Developer',
        company: 'Minutely AI Academy',
        location: 'Remote',
        type: 'Full-time',
        salary: '$95k - $140k',
        description: 'Join our core team building the future of AI-powered education.',
        requirements: ['5+ years experience', 'React', 'Node.js', 'AI/ML interest'],
        postedAt: '2024-01-10'
      },
      {
        id: 2,
        title: 'AI/ML Engineer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$120k - $180k',
        description: 'Build cutting-edge AI solutions for enterprise education platforms.',
        requirements: ['3+ years ML experience', 'Python', 'TensorFlow/PyTorch', 'Cloud platforms'],
        postedAt: '2024-01-12'
      },
      {
        id: 3,
        title: 'Frontend Developer (Part-time)',
        company: 'EduTech Solutions',
        location: 'Remote',
        type: 'Part-time',
        salary: '$40k - $60k',
        description: 'Create beautiful, accessible interfaces for educational applications.',
        requirements: ['2+ years React', 'TypeScript', 'Accessibility knowledge'],
        postedAt: '2024-01-08'
      }
    ]);
  }, []);

  const handleApplyForTask = (task: any) => {
    setSelectedTask(task);
    setShowApplicationDialog(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Contribute & Get <span className="text-primary">Hired</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join our contributor network. Work on cutting-edge educational technology projects, 
              build your portfolio, and get hired by top companies in the EdTech space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline">
                View Available Tasks
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Contributors Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center">
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Competitive Pay</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Earn $25-100+ per hour on projects that match your expertise
                </p>
                <div className="text-2xl font-bold text-primary">$450-$1200</div>
                <p className="text-sm text-muted-foreground">Average project value</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-500/20">
              <CardHeader className="text-center">
                <Trophy className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <CardTitle>Build Portfolio</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Work on real projects that showcase your skills to potential employers
                </p>
                <div className="text-2xl font-bold text-blue-500">95%</div>
                <p className="text-sm text-muted-foreground">Get hired within 6 months</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-500/20">
              <CardHeader className="text-center">
                <Target className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <CardTitle>Skill Development</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  Learn cutting-edge technologies while working with industry experts
                </p>
                <div className="text-2xl font-bold text-green-500">4.9/5</div>
                <p className="text-sm text-muted-foreground">Contributor satisfaction</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Available Tasks Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Available Tasks</h2>
            <div className="flex space-x-2">
              <Input placeholder="Search tasks..." className="w-64" />
              <Button variant="outline">Filter</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableTasks.map((task) => (
              <Card key={task.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">{task.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline">{task.category}</Badge>
                        <Badge className={getDifficultyColor(task.difficulty)}>
                          {task.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">${task.payment}</div>
                      <div className="text-sm text-muted-foreground">{task.estimatedHours}h estimated</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground line-clamp-3">{task.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {task.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Briefcase className="h-4 w-4" />
                      <span>{task.company}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button 
                      className="flex-1"
                      onClick={() => handleApplyForTask(task)}
                    >
                      Apply Now
                    </Button>
                    <Button variant="outline" size="icon">
                      <BookOpen className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg">Load More Tasks</Button>
          </div>
        </div>
      </section>

      {/* Job Opportunities Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Career Opportunities</h2>
            <Button asChild>
              <Link href="/jobs">View All Jobs</Link>
            </Button>
          </div>

          <div className="space-y-6">
            {jobOpportunities.map((job) => (
              <Card key={job.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold">{job.title}</h3>
                          <p className="text-muted-foreground">{job.company}</p>
                        </div>
                        <Badge variant="default">{job.type}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Location</span>
                          <p className="font-medium">{job.location}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Salary</span>
                          <p className="font-medium">{job.salary}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Posted</span>
                          <p className="font-medium">{new Date(job.postedAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4">{job.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requirements.map((req: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button asChild>
                      <Link href={`/jobs/${job.id}`}>Apply Now</Link>
                    </Button>
                    <Button variant="outline">Save Job</Button>
                    <Button variant="outline">Share</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Sarah Chen</CardTitle>
                <CardDescription>Full-Stack Developer</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  "Started as a contributor on React projects. Within 4 months, I was hired 
                  full-time by one of the companies I worked with."
                </p>
                <div className="flex justify-center items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle>Marcus Johnson</CardTitle>
                <CardDescription>AI/ML Engineer</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  "The AI content generation projects helped me build an impressive portfolio. 
                  Now I'm leading ML initiatives at a major EdTech company."
                </p>
                <div className="flex justify-center items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <CardTitle>Emma Rodriguez</CardTitle>
                <CardDescription>Technical Writer</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-4">
                  "Contributing to documentation projects improved my technical writing skills. 
                  I now freelance for multiple tech companies."
                </p>
                <div className="flex justify-center items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of developers, designers, and content creators who are building 
              their careers through our contributor network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auth">Join as Contributor</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Application Dialog */}
      <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Apply for Task</DialogTitle>
            <DialogDescription>
              Submit your application for: {selectedTask?.title}
            </DialogDescription>
          </DialogHeader>
          <TaskApplicationForm task={selectedTask} onClose={() => setShowApplicationDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Task Application Form Component
const TaskApplicationForm: React.FC<{ task: any; onClose: () => void }> = ({ task, onClose }) => {
  const [formData, setFormData] = useState({
    coverLetter: '',
    portfolio: '',
    expectedDelivery: '',
    questions: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle application submission
    console.log('Application submitted:', formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="coverLetter">Cover Letter</Label>
        <Textarea
          id="coverLetter"
          value={formData.coverLetter}
          onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
          placeholder="Explain why you're the right fit for this task..."
          rows={4}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="portfolio">Portfolio Links</Label>
        <Input
          id="portfolio"
          value={formData.portfolio}
          onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
          placeholder="GitHub, portfolio website, relevant work samples..."
        />
      </div>

      <div>
        <Label htmlFor="expectedDelivery">Expected Delivery Date</Label>
        <Input
          id="expectedDelivery"
          type="date"
          value={formData.expectedDelivery}
          onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="questions">Questions or Additional Notes</Label>
        <Textarea
          id="questions"
          value={formData.questions}
          onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
          placeholder="Any questions about the requirements or additional information..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Submit Application
        </Button>
      </div>
    </form>
  );
};

export default Contribute;