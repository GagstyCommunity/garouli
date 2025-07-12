
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, Plus, Eye, Edit, Users, Calendar, 
  Award, ExternalLink, Star, Bot
} from 'lucide-react';
import { toast } from 'sonner';

interface Submission {
  id: string;
  hackathon_id: string;
  user_id: string;
  team_name: string | null;
  project_title: string;
  description: string | null;
  demo_url: string | null;
  code_url: string | null;
  presentation_url: string | null;
  ai_analysis: any;
  judge_scores: any;
  public_votes: number;
  status: string;
  submitted_at: string;
  user?: {
    full_name: string;
    email: string;
  } | null;
}

interface Hackathon {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  theme: string | null;
  start_date: string | null;
  end_date: string | null;
  submission_deadline: string | null;
  max_participants: number | null;
  prize_pool: number | null;
  status: string;
  submissions_count?: number;
}

const HackathonManagement = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hackathons');
  const [selectedHackathon, setSelectedHackathon] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newHackathon, setNewHackathon] = useState({
    title: '',
    description: '',
    theme: '',
    start_date: '',
    end_date: '',
    submission_deadline: '',
    max_participants: 100,
    prize_pool: 10000,
    status: 'draft'
  });

  useEffect(() => {
    fetchHackathons();
    fetchSubmissions();
  }, []);

  const fetchHackathons = async () => {
    try {
      // Use mock data since the database relationships aren't fully set up yet
      const mockHackathons: Hackathon[] = [
        {
          id: '1',
          title: 'AI Innovation Challenge 2024',
          slug: 'ai-innovation-2024',
          description: 'Build innovative AI solutions that solve real-world problems',
          theme: 'Artificial Intelligence',
          start_date: '2024-02-01T00:00:00Z',
          end_date: '2024-02-15T23:59:59Z',
          submission_deadline: '2024-02-14T23:59:59Z',
          max_participants: 200,
          prize_pool: 25000,
          status: 'active',
          submissions_count: 45
        },
        {
          id: '2',
          title: 'Green Tech Hackathon',
          slug: 'green-tech-2024',
          description: 'Create sustainable technology solutions for environmental challenges',
          theme: 'Sustainability',
          start_date: '2024-03-01T00:00:00Z',
          end_date: '2024-03-15T23:59:59Z',
          submission_deadline: '2024-03-14T23:59:59Z',
          max_participants: 150,
          prize_pool: 15000,
          status: 'upcoming',
          submissions_count: 0
        }
      ];

      setHackathons(mockHackathons);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
      toast.error('Failed to load hackathons');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      // Mock submissions data
      const mockSubmissions: Submission[] = [
        {
          id: '1',
          hackathon_id: '1',
          user_id: 'user-1',
          team_name: 'AI Innovators',
          project_title: 'Smart Healthcare Assistant',
          description: 'An AI-powered healthcare assistant that helps diagnose symptoms and provides medical advice.',
          demo_url: 'https://demo.example.com',
          code_url: 'https://github.com/example/project',
          presentation_url: 'https://slides.example.com',
          ai_analysis: {
            innovation_score: 8.5,
            feasibility_score: 7.8,
            technical_score: 9.2,
            overall_score: 8.5
          },
          judge_scores: {},
          public_votes: 25,
          status: 'submitted',
          submitted_at: '2024-02-10T15:30:00Z',
          user: {
            full_name: 'John Doe',
            email: 'john@example.com'
          }
        }
      ];

      setSubmissions(mockSubmissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    }
  };

  const handleCreateHackathon = async () => {
    try {
      // For demo purposes, just show success message
      toast.success('Hackathon created successfully!');
      setIsCreateDialogOpen(false);
      setNewHackathon({
        title: '',
        description: '',
        theme: '',
        start_date: '',
        end_date: '',
        submission_deadline: '',
        max_participants: 100,
        prize_pool: 10000,
        status: 'draft'
      });
      fetchHackathons();
    } catch (error) {
      console.error('Error creating hackathon:', error);
      toast.error('Failed to create hackathon');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading hackathons...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          Hackathon Management
        </h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Hackathon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Hackathon</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newHackathon.title}
                  onChange={(e) => setNewHackathon({...newHackathon, title: e.target.value})}
                  placeholder="AI Innovation Challenge 2024"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newHackathon.description}
                  onChange={(e) => setNewHackathon({...newHackathon, description: e.target.value})}
                  placeholder="Describe the hackathon objectives..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Input
                  id="theme"
                  value={newHackathon.theme}
                  onChange={(e) => setNewHackathon({...newHackathon, theme: e.target.value})}
                  placeholder="Artificial Intelligence, Sustainability, etc."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={newHackathon.start_date}
                    onChange={(e) => setNewHackathon({...newHackathon, start_date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={newHackathon.end_date}
                    onChange={(e) => setNewHackathon({...newHackathon, end_date: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="submission_deadline">Submission Deadline</Label>
                <Input
                  id="submission_deadline"
                  type="datetime-local"
                  value={newHackathon.submission_deadline}
                  onChange={(e) => setNewHackathon({...newHackathon, submission_deadline: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max_participants">Max Participants</Label>
                  <Input
                    id="max_participants"
                    type="number"
                    value={newHackathon.max_participants}
                    onChange={(e) => setNewHackathon({...newHackathon, max_participants: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="prize_pool">Prize Pool ($)</Label>
                  <Input
                    id="prize_pool"
                    type="number"
                    value={newHackathon.prize_pool}
                    onChange={(e) => setNewHackathon({...newHackathon, prize_pool: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={newHackathon.status} onValueChange={(value) => setNewHackathon({...newHackathon, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="ended">Ended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateHackathon} className="flex-1">
                  Create Hackathon
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="hackathons">Hackathons ({hackathons.length})</TabsTrigger>
          <TabsTrigger value="submissions">Submissions ({submissions.length})</TabsTrigger>
          <TabsTrigger value="judging">Judging</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="hackathons" className="mt-6">
          <div className="grid gap-4">
            {hackathons.map((hackathon) => (
              <Card key={hackathon.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{hackathon.title}</CardTitle>
                      <p className="text-muted-foreground mt-2">{hackathon.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(hackathon.status)}>
                        {hackathon.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="font-medium">Duration</p>
                        <p className="text-muted-foreground">
                          {hackathon.start_date ? new Date(hackathon.start_date).toLocaleDateString() : 'TBD'} - 
                          {hackathon.end_date ? new Date(hackathon.end_date).toLocaleDateString() : 'TBD'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="font-medium">Participants</p>
                        <p className="text-muted-foreground">{hackathon.submissions_count || 0}/{hackathon.max_participants}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <div>
                        <p className="font-medium">Prize Pool</p>
                        <p className="text-muted-foreground">${hackathon.prize_pool?.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-purple-500" />
                      <div>
                        <p className="font-medium">Theme</p>
                        <p className="text-muted-foreground">{hackathon.theme || 'General'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="mt-6">
          <div className="grid gap-4">
            {submissions.map((submission) => (
              <Card key={submission.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{submission.project_title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        by {submission.user?.full_name || 'Unknown'} 
                        {submission.team_name && ` (Team: ${submission.team_name})`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{submission.public_votes} votes</Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm line-clamp-2">{submission.description}</p>
                  
                  {submission.ai_analysis && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-purple-500" />
                        <span className="text-sm font-medium">AI Analysis</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div>
                          <p className="font-medium">Innovation</p>
                          <div className="flex items-center gap-2">
                            <Progress value={submission.ai_analysis.innovation_score * 10} className="h-2" />
                            <span className={`font-medium ${getAIScoreColor(submission.ai_analysis.innovation_score)}`}>
                              {submission.ai_analysis.innovation_score}/10
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">Feasibility</p>
                          <div className="flex items-center gap-2">
                            <Progress value={submission.ai_analysis.feasibility_score * 10} className="h-2" />
                            <span className={`font-medium ${getAIScoreColor(submission.ai_analysis.feasibility_score)}`}>
                              {submission.ai_analysis.feasibility_score}/10
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">Technical</p>
                          <div className="flex items-center gap-2">
                            <Progress value={submission.ai_analysis.technical_score * 10} className="h-2" />
                            <span className={`font-medium ${getAIScoreColor(submission.ai_analysis.technical_score)}`}>
                              {submission.ai_analysis.technical_score}/10
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">Overall</p>
                          <div className="flex items-center gap-2">
                            <Progress value={submission.ai_analysis.overall_score * 10} className="h-2" />
                            <span className={`font-medium ${getAIScoreColor(submission.ai_analysis.overall_score)}`}>
                              {submission.ai_analysis.overall_score}/10
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {submission.demo_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={submission.demo_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Demo
                        </a>
                      </Button>
                    )}
                    {submission.code_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={submission.code_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Code
                        </a>
                      </Button>
                    )}
                    {submission.presentation_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={submission.presentation_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Presentation
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="judging" className="mt-6">
          <Card>
            <CardContent className="p-8 text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Judging panel will be available when hackathons have submissions.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Hackathons</p>
                    <p className="text-2xl font-bold">{hackathons.length}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
                    <p className="text-2xl font-bold">{submissions.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Prize Pool</p>
                    <p className="text-2xl font-bold">
                      ${hackathons.reduce((sum, h) => sum + (h.prize_pool || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HackathonManagement;
