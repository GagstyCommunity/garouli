
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
  MessageSquare, Plus, Edit, Eye, Users, TrendingUp, 
  Flag, CheckCircle, XCircle, Pin, MessageCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Community {
  id: string;
  title: string;
  slug: string;
  description: string;
  tags: string[];
  member_count: number;
  post_count: number;
  visibility: string;
  status: string;
  created_at: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  upvotes: number;
  downvotes: number;
  reply_count: number;
  is_flagged: boolean;
  ai_moderation_score: number;
  status: string;
  created_at: string;
  user: {
    full_name: string;
    email: string;
  };
}

const CommunityManagement = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
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
  }, []);

  const fetchCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommunities(data || []);
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast.error('Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (communityId: string) => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          user:profiles(full_name, email)
        `)
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to load posts');
    }
  };

  const handleCreateCommunity = async () => {
    try {
      const slug = newCommunity.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const tags = newCommunity.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      const { error } = await supabase
        .from('communities')
        .insert([{
          ...newCommunity,
          slug,
          tags,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) throw error;

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

  const updateCommunityStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('communities')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Community ${status} successfully!`);
      fetchCommunities();
    } catch (error) {
      console.error('Error updating community:', error);
      toast.error('Failed to update community');
    }
  };

  const moderatePost = async (postId: string, action: string) => {
    try {
      const updates: any = {};
      
      if (action === 'approve') {
        updates.status = 'published';
        updates.is_flagged = false;
      } else if (action === 'flag') {
        updates.is_flagged = true;
        updates.status = 'flagged';
      } else if (action === 'remove') {
        updates.status = 'removed';
      }

      const { error } = await supabase
        .from('community_posts')
        .update(updates)
        .eq('id', postId);

      if (error) throw error;
      
      toast.success(`Post ${action}d successfully!`);
      if (selectedCommunity) {
        fetchPosts(selectedCommunity);
      }
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
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getModerationColor = (score: number) => {
    if (score >= 0.8) return 'text-red-600';
    if (score >= 0.5) return 'text-yellow-600';
    return 'text-green-600';
  };

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
                  placeholder="AI Developers Hub"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCommunity.description}
                  onChange={(e) => setNewCommunity({...newCommunity, description: e.target.value})}
                  placeholder="A place for AI developers to share knowledge..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={newCommunity.tags}
                  onChange={(e) => setNewCommunity({...newCommunity, tags: e.target.value})}
                  placeholder="AI, Machine Learning, Development"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={newCommunity.status} onValueChange={(value) => setNewCommunity({...newCommunity, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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

      <Tabs defaultValue="communities" className="w-full">
        <TabsList>
          <TabsTrigger value="communities">Communities</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="communities">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <Card key={community.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{community.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {community.description?.substring(0, 100)}...
                      </p>
                    </div>
                    <Badge className={getStatusColor(community.status)}>
                      {community.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {community.tags?.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>{community.member_count} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-green-500" />
                      <span>{community.post_count} posts</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setSelectedCommunity(community.id);
                        fetchPosts(community.id);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    {community.status === 'active' ? (
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => updateCommunityStatus(community.id, 'suspended')}
                      >
                        Suspend
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => updateCommunityStatus(community.id, 'active')}
                      >
                        Activate
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="moderation">
          {selectedCommunity ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Posts Moderation ({posts.length})</h3>
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id} className={post.is_flagged ? 'border-red-200 bg-red-50' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold flex items-center gap-2">
                            {post.title}
                            {post.is_flagged && <Flag className="h-4 w-4 text-red-500" />}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            by {post.user?.full_name} • {new Date(post.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-sm mt-2 line-clamp-2">{post.content}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline">{post.status}</Badge>
                          {post.ai_moderation_score && (
                            <span className={`text-xs ${getModerationColor(post.ai_moderation_score)}`}>
                              AI Score: {(post.ai_moderation_score * 100).toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>↑ {post.upvotes}</span>
                          <span>↓ {post.downvotes}</span>
                          <span>💬 {post.reply_count}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => moderatePost(post.id, 'approve')}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => moderatePost(post.id, 'flag')}
                          >
                            <Flag className="h-4 w-4 mr-1" />
                            Flag
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => moderatePost(post.id, 'remove')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Select a community to view posts for moderation</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                  <MessageCircle className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Communities</p>
                    <p className="text-2xl font-bold">
                      {communities.filter(c => c.status === 'active').length}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-500" />
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
