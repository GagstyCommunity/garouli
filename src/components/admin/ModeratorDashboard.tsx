
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Flag, AlertTriangle, CheckCircle, XCircle, 
  MessageSquare, FileText, Users, Bot, TrendingUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FlaggedContent {
  id: string;
  title: string;
  content: string;
  type: 'post' | 'comment' | 'course' | 'job';
  reason: string;
  ai_score: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user: {
    full_name: string;
    email: string;
  };
}

const ModeratorDashboard = () => {
  const [flaggedContent, setFlaggedContent] = useState<FlaggedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchFlaggedContent();
  }, []);

  const fetchFlaggedContent = async () => {
    try {
      // Mock data for demonstration
      const mockData: FlaggedContent[] = [
        {
          id: '1',
          title: 'Suspicious Course Content',
          content: 'This course contains content that may violate our community guidelines...',
          type: 'course',
          reason: 'Inappropriate content',
          ai_score: 0.85,
          status: 'pending',
          created_at: new Date().toISOString(),
          user: {
            full_name: 'John Doe',
            email: 'john@example.com'
          }
        },
        {
          id: '2',
          title: 'Spam Job Posting',
          content: 'Work from home, earn $5000 per week with no experience required...',
          type: 'job',
          reason: 'Spam content',
          ai_score: 0.92,
          status: 'pending',
          created_at: new Date().toISOString(),
          user: {
            full_name: 'Jane Smith',
            email: 'jane@example.com'
          }
        },
        {
          id: '3',
          title: 'Offensive Community Post',
          content: 'Post contains offensive language and personal attacks...',
          type: 'post',
          reason: 'Harassment',
          ai_score: 0.78,
          status: 'pending',
          created_at: new Date().toISOString(),
          user: {
            full_name: 'Bob Wilson',
            email: 'bob@example.com'
          }
        }
      ];

      setFlaggedContent(mockData);
    } catch (error) {
      console.error('Error fetching flagged content:', error);
      toast.error('Failed to load flagged content');
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (contentId: string, action: 'approve' | 'reject') => {
    try {
      setFlaggedContent(prev => 
        prev.map(item => 
          item.id === contentId 
            ? { ...item, status: action === 'approve' ? 'approved' : 'rejected' }
            : item
        )
      );
      
      toast.success(`Content ${action}d successfully`);
    } catch (error) {
      console.error('Error moderating content:', error);
      toast.error('Failed to moderate content');
    }
  };

  const filteredContent = flaggedContent.filter(content => {
    switch (activeTab) {
      case 'pending':
        return content.status === 'pending';
      case 'approved':
        return content.status === 'approved';
      case 'rejected':
        return content.status === 'rejected';
      default:
        return true;
    }
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'post': return <MessageSquare className="h-4 w-4" />;
      case 'course': return <FileText className="h-4 w-4" />;
      case 'job': return <Users className="h-4 w-4" />;
      default: return <Flag className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'post': return 'bg-blue-100 text-blue-800';
      case 'course': return 'bg-green-100 text-green-800';
      case 'job': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-red-600';
    if (score >= 0.6) return 'text-orange-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getAIScoreLevel = (score: number) => {
    if (score >= 0.8) return 'High Risk';
    if (score >= 0.6) return 'Medium Risk';
    if (score >= 0.4) return 'Low Risk';
    return 'Very Low Risk';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading moderation queue...</div>;
  }

  const stats = {
    total: flaggedContent.length,
    pending: flaggedContent.filter(c => c.status === 'pending').length,
    approved: flaggedContent.filter(c => c.status === 'approved').length,
    rejected: flaggedContent.filter(c => c.status === 'rejected').length,
    highRisk: flaggedContent.filter(c => c.ai_score >= 0.8).length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Flag className="h-6 w-6" />
          Moderation Dashboard
        </h2>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Flagged</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Flag className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                <p className="text-2xl font-bold">{stats.highRisk}</p>
              </div>
              <Bot className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
          <TabsTrigger value="all">All Items</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {filteredContent.map((content) => (
              <Card key={content.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getTypeColor(content.type)}>
                          {getTypeIcon(content.type)}
                          <span className="ml-1 capitalize">{content.type}</span>
                        </Badge>
                        <Badge variant="outline">
                          {content.reason}
                        </Badge>
                        <Badge variant="outline" className={getAIScoreColor(content.ai_score)}>
                          <Bot className="h-3 w-3 mr-1" />
                          {getAIScoreLevel(content.ai_score)}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{content.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        by {content.user.full_name} ({content.user.email}) • 
                        {new Date(content.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      className={
                        content.status === 'approved' ? 'bg-green-100 text-green-800' :
                        content.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {content.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm line-clamp-3">{content.content}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>AI Confidence Score</span>
                      <span className={`font-medium ${getAIScoreColor(content.ai_score)}`}>
                        {(content.ai_score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress 
                      value={content.ai_score * 100} 
                      className="h-2"
                    />
                  </div>

                  {content.status === 'pending' && (
                    <div className="flex gap-2 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => handleModeration(content.id, 'approve')}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => handleModeration(content.id, 'reject')}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {filteredContent.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {activeTab === 'pending' ? 'No content pending moderation' : 
                     `No ${activeTab} content found`}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModeratorDashboard;
