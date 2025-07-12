
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Trophy, Plus, Edit, Eye, Users, Calendar, Target, 
  Award, Code, ExternalLink, Star, TrendingUp 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Hackathon {
  id: string;
  title: string;
  slug: string;
  description: string;
  theme: string;
  start_date: string;
  end_date: string;
  submission_deadline: string;
  max_participants: number;
  prize_pool: number;
  status: string;
  submissions_count?: number;
}

interface Submission {
  id: string;
  project_title: string;
  team_name: string;
  demo_url: string;
  code_url: string;
  public_votes: number;
  ai_analysis: any;
  status: string;
  user: {
    full_name: string;
    email: string;
  };
}

const HackathonManagement = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
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
    prize_pool: 5000,
    status: 'draft'
  });

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      const { data, error } = await supabase
        .from('hackathons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Add mock submissions count for demo
      const enrichedData = data?.map(hackathon => ({
        ...hackathon,
        submissions_count: Math.floor(Math.random() * 50) + 5
      })) || [];

      setHackathons(enrichedData);
    } catch (error) {
      console.error('Error fetching hackathons:', error);
      toast.error('Failed to load hackathons');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async (hackathonId: string) => {
    try {
      const { data, error } = await supabase
        .from('hackathon_submissions')
        .select(`
          *,
          user:profiles(full_name, email)
        `)
        .eq('hackathon_id', hackathonId)
        .order('public_votes', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    }
  };

  const handleCreateHackathon = async () => {
    try {
      const slug = newHackathon.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const { error } = await supabase
        .from('hackathons')
        .insert([{
          ...newHackathon,
          slug,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;

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
        prize_pool: 5000,
        status: 'draft'
      });
      fetchHackathons();
    } catch (error) {
      console.error('Error creating hackathon:', error);
      toast.error('Failed to create hackathon');
    }
  };

  const updateHackathonStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('hackathons')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Hackathon ${status} successfully!`);
      fetchHackathons();
    } catch (error) {
      console.error('Error updating hackathon:', error);
      toast.error('Failed to update hackathon');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      case 'judging': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-orange-100 text-orange-800';
    }
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
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newHackathon.title}
                  onChange={(e) => setNewHackathon({...newHackathon, title: e.target.value})}
                  placeholder="AI Innovation Challenge 2024"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newHackathon.description}
                  onChange={(e) => setNewHackathon({...newHackathon, description: e.target.value})}
                  placeholder="Build the next generation of AI-powered applications..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Input
                  id="theme"
                  value={newHackathon.theme}
                  onChange={(e) => setNewHackathon({...newHackathon, theme: e.target.value})}
                  placeholder="Artificial Intelligence"
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
              <div>
                <Label htmlFor="submission_deadline">Submission Deadline</Label>
                <Input
                  id="submission_deadline"
                  type="datetime-local"
                  value={newHackathon.submission_deadline}
                  onChange={(e) => setNewHackathon({...newHackathon, submission_deadline: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="max_participants">Max Participants</Label>
                <Input
                  id="max_participants"
                  type="number"
                  value={newHackathon.max_participants}
                  onChange={(e) => setNewHackathon({...newHackathon, max_participants: parseInt(e.target.value)})}
                />
              </div>
              <div className="col-span-2 flex gap-2">
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

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathons.map((hackathon) => (
              <Card key={hackathon.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{hackathon.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{hackathon.theme}</p>
                    </div>
                    <Badge className={getStatusColor(hackathon.status)}>
                      {hackathon.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {hackathon.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>{hackathon.submissions_count} submissions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span>${hackathon.prize_pool?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-500" />
                      <span>{new Date(hackathon.start_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-red-500" />
                      <span>{hackathon.max_participants} max</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setSelectedHackathon(hackathon.id);
                        fetchSubmissions(hackathon.id);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {hackathon.status === 'draft' ? (
                      <Button 
                        size="sm" 
                        onClick={() => updateHackathonStatus(hackathon.id, 'published')}
                      >
                        Publish
                      </Button>
                    ) : hackathon.status === 'published' ? (
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => updateHackathonStatus(hackathon.id, 'active')}
                      >
                        Start
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="submissions">
          {selectedHackathon ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Submissions ({submissions.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {submissions.map((submission) => (
                  <Card key={submission.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{submission.project_title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {submission.team_name} • {submission.user?.full_name}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{submission.public_votes}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {submission.demo_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={submission.demo_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Demo
                            </a>
                          </Button>
                        )}
                        {submission.code_url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={submission.code_url} target="_blank" rel="noopener noreferrer">
                              <Code className="h-4 w-4 mr-1" />
                              Code
                            </a>
                          </Button>
                        )}
                        <Badge variant="outline" className="ml-auto">
                          {submission.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Select a hackathon to view submissions</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Hackathons</p>
                    <p className="text-2xl font-bold">{hackathons.length}</p>
                  </div>
                  <Trophy className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
                    <p className="text-2xl font-bold">
                      {hackathons.reduce((sum, h) => sum + (h.submissions_count || 0), 0)}
                    </p>
                  </div>
                  <Code className="h-8 w-8 text-green-500" />
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
