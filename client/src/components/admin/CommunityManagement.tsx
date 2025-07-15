
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
  MessageSquare, Plus, Eye, Edit, Users, TrendingUp, 
  Flag, CheckCircle, XCircle, Bot, Pin
} from 'lucide-react';
import { toast } from 'sonner';

interface Post {
  id: string;
  community_id: string;
  user_id: string;
  title: string;
  content: string | null;
  post_type: string;
  upvotes: number;
  downvotes: number;
  reply_count: number;
  is_pinned: boolean;
  is_flagged: boolean;
  flag_reason: string | null;
  ai_moderation_score: number | null;
  status: string;
  created_at: string;
  updated_at: string;
  user?: {
    full_name: string;
    email: string;
  } | null;
}

interface Community {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  tags: string[] | null;
  cover_image: string | null;
  icon_image: string | null;
  member_count: number;
  post_count: number;
  visibility: string;
  status: string;
  created_at: string;
}

const CommunityManagement = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('communities');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    title: '',
    description: '',
    tags: '',
    visibility: 'public',
    status: 'active'
  });

  useEffect(() => {
    fetchCommunities();
    fetchFlaggedPosts();
  }, []);

  const fetchCommunities = async () => {
    try {
      // Use mock data since the database relationships aren't fully set up yet
      const mockCommunities: Community[] = [
        {
          id: '1',
          title: 'AI & Machine Learning',
          slug: 'ai-ml',
          description: 'Discuss latest trends in AI and machine learning',
          tags: ['AI', 'ML', 'Data Science'],
          cover_image: null,
          icon_image: null,
          member_count: 1250,
          post_count: 340,
          visibility: 'public',
          status: 'active',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Web Development',
          slug: 'web-dev',
          description: 'Frontend and backend web development discussions',
          tags: ['React', 'Node.js', 'JavaScript'],
          cover_image: null,
          icon_image: null,
          member_count: 2100,
          post_count: 580,
          visibility: 'public',
          status: 'active',
          created_at: new Date().toISOString()
        }
      ];

      setCommunities(mockCommunities);
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast.error('Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  const fetchFlaggedPosts = async () => {
    try {
      // Mock flagged posts data
      const mockPosts: Post[] = [
        {
          id: '1',
          community_id: '1',
          user_id: 'user-1',
          title: 'Suspicious AI content',
          content: 'This post contains potentially harmful AI-generated content...',
          post_type: 'discussion',
          upvotes: 5,
          downvotes: 12,
          reply_count: 3,
          is_pinned: false,
          is_flagged: true,
          flag_reason: 'Harmful content',
          ai_moderation_score: 0.85,
          status: 'flagged',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            full_name: 'John Doe',
            email: 'john@example.com'
          }
        }
      ];

      setPosts(mockPosts);
    } catch (error) {
      console.error('Error fetching flagged posts:', error);
      toast.error('Failed to load flagged posts');
    }
  };

  const handleCreateCommunity = async () => {
    try {
      // For demo purposes, just show success message
      toast.success('Community created successfully!');
      setIsCreateDialogOpen(false);
      setNewCommunity({
        title: '',
        description: '',
        tags: '',
        visibility: 'public',
        status: 'active'
      });
      fetchCommunities();
    } catch (error) {
      console.error('Error creating community:', error);
      toast.error('Failed to create community');
    }
  };

  const handleModerateCommunity = async (communityId: string, action: 'approve' | 'suspend') => {
    try {
      // Update the local state for demo purposes
      setCommunities(prev => 
        prev.map(community => 
          community.id === communityId 
            ? { ...community, status: action === 'approve' ? 'active' : 'suspended' }
            : community
        )
      );
      
      toast.success(`Community ${action}d successfully`);
    } catch (error) {
      console.error('Error moderating community:', error);
      toast.error('Failed to moderate community');
    }
  };

  const handleModeratePost = async (postId: string, action: 'approve' | 'remove') => {
    try {
      // Update the local state for demo purposes
      setPosts(prev => 
        prev.map(post => 
          post.id === postId 
            ? { ...post, status: action === 'approve' ? 'published' : 'removed', is_flagged: false }
            : post
        )
      );
      
      toast.success(`Post ${action}d successfully`);
    } catch (error) {
      console.error('Error moderating post:', error);
      toast.error('Failed to moderate post');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'flagged': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAIScoreColor = (score: number | null) => {
    if (!score) return 'text-gray-500';
    if (score >= 0.8) return 'text-red-600';
    if (score >= 0.6) return 'text-orange-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getAIScoreLevel = (score: number | null) => {
    if (!score) return 'Unknown';
    if (score >= 0.8) return 'High Risk';
    if (score >= 0.6) return 'Medium Risk';
    if (score >= 0.4) return 'Low Risk';
    return 'Very Low Risk';
  };

  const filteredCommunities = communities.filter(community =>
    community.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading communities...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6" />
          Community Management
        </h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Community
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Community</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newCommunity.title}
                  onChange={(e) => setNewCommunity({...newCommunity, title: e.target.value})}
                  placeholder="AI & Machine Learning"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCommunity.description}
                  onChange={(e) => setNewCommunity({...newCommunity, description: e.target.value})}
                  placeholder="Describe the community purpose..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={newCommunity.tags}
                  onChange={(e) => setNewCommunity({...newCommunity, tags: e.target.value})}
                  placeholder="AI, ML, Data Science"
                />
              </div>
              <div>
                <Label htmlFor="visibility">Visibility</Label>
                <Select value={newCommunity.visibility} onValueChange={(value) => setNewCommunity({...newCommunity, visibility: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateCommunity} className="flex-1">
                  Create Community
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
          <TabsTrigger value="communities">Communities ({communities.length})</TabsTrigger>
          <TabsTrigger value="moderation">Flagged Posts ({posts.filter(p => p.is_flagged).length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="communities" className="mt-6">
          <div className="mb-4">
            <Input
              placeholder="Search communities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
          
          <div className="grid gap-4">
            {filteredCommunities.map((community) => (
              <Card key={community.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{community.title}</CardTitle>
                      <p className="text-muted-foreground mt-2">{community.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(community.status)}>
                        {community.status}
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
                      <Users className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="font-medium">Members</p>
                        <p className="text-muted-foreground">{community.member_count.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="font-medium">Posts</p>
                        <p className="text-muted-foreground">{community.post_count}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-500" />
                      <div>
                        <p className="font-medium">Visibility</p>
                        <p className="text-muted-foreground capitalize">{community.visibility}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="font-medium">Created</p>
                        <p className="text-muted-foreground">{new Date(community.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  {community.tags && community.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-4">
                      {community.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    {community.status === 'active' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleModerateCommunity(community.id, 'suspend')}
                      >
                        <XCircle className="h-4 w-4 mr-1 text-red-500" />
                        Suspend
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleModerateCommunity(community.id, 'approve')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        Activate
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Pin className="h-4 w-4 mr-1" />
                      Feature
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="moderation" className="mt-6">
          <div className="space-y-4">
            {posts.filter(p => p.is_flagged).map((post) => (
              <Card key={post.id} className="border-orange-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        by {post.user?.full_name || 'Unknown'} ({post.user?.email})
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{post.flag_reason}</Badge>
                        {post.ai_moderation_score && (
                          <Badge variant="outline" className={getAIScoreColor(post.ai_moderation_score)}>
                            <Bot className="h-3 w-3 mr-1" />
                            {getAIScoreLevel(post.ai_moderation_score)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(post.status)}>
                      {post.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm line-clamp-3">{post.content}</p>
                  
                  {post.ai_moderation_score && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>AI Confidence Score</span>
                        <span className={`font-medium ${getAIScoreColor(post.ai_moderation_score)}`}>
                          {(post.ai_moderation_score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress 
                        value={post.ai_moderation_score * 100} 
                        className="h-2"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{post.upvotes} upvotes, {post.downvotes} downvotes</span>
                    <span>{post.reply_count} replies</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>

                  {post.status === 'flagged' && (
                    <div className="flex gap-2 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => handleModeratePost(post.id, 'approve')}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleModeratePost(post.id, 'remove')}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {posts.filter(p => p.is_flagged).length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">No flagged posts requiring attention</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Communities</p>
                    <p className="text-2xl font-bold">{communities.length}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                    <p className="text-2xl font-bold">
                      {communities.reduce((sum, c) => sum + c.member_count, 0).toLocaleString()}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                    <p className="text-2xl font-bold">
                      {communities.reduce((sum, c) => sum + c.post_count, 0).toLocaleString()}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityManagement;
