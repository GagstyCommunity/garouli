
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Star, 
  Users,
  Eye,
  GitBranch,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CodeSubmission {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  created_at: string;
  reviews_count: number;
  average_rating: number;
  status: 'pending' | 'reviewed' | 'completed';
}

interface Review {
  id: string;
  submission_id: string;
  reviewer: {
    id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  feedback: string;
  suggestions: string[];
  created_at: string;
}

const PeerReviewSystem = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<CodeSubmission[]>([]);
  const [mySubmissions, setMySubmissions] = useState<CodeSubmission[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<CodeSubmission | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Mock data until backend is implemented
      const mockSubmissions: CodeSubmission[] = [
        {
          id: '1',
          title: 'React Todo App',
          description: 'A simple todo app built with React hooks',
          code: `function TodoApp() {
  const [todos, setTodos] = useState([]);
  
  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
  };
  
  return (
    <div>
      <h1>Todo App</h1>
      {/* Rest of component */}
    </div>
  );
}`,
          language: 'javascript',
          author: {
            id: '2',
            name: 'Alice Johnson',
            avatar: '/placeholder.svg'
          },
          created_at: new Date().toISOString(),
          reviews_count: 3,
          average_rating: 4.2,
          status: 'pending'
        },
        {
          id: '2',
          title: 'Python Data Analysis',
          description: 'Data analysis script using pandas',
          code: `import pandas as pd
import matplotlib.pyplot as plt

def analyze_data(filename):
    df = pd.read_csv(filename)
    
    # Basic statistics
    stats = df.describe()
    
    # Create visualization
    df.plot(kind='hist')
    plt.show()
    
    return stats`,
          language: 'python',
          author: {
            id: '3',
            name: 'Bob Smith',
            avatar: '/placeholder.svg'
          },
          created_at: new Date().toISOString(),
          reviews_count: 1,
          average_rating: 3.8,
          status: 'pending'
        }
      ];

      const mockMySubmissions: CodeSubmission[] = [
        {
          id: '3',
          title: 'Express API Server',
          description: 'RESTful API built with Express.js',
          code: `const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
          language: 'javascript',
          author: {
            id: user.id,
            name: user.user_metadata?.full_name || 'You',
            avatar: user.user_metadata?.avatar_url
          },
          created_at: new Date().toISOString(),
          reviews_count: 2,
          average_rating: 4.5,
          status: 'reviewed'
        }
      ];

      setSubmissions(mockSubmissions);
      setMySubmissions(mockMySubmissions);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!selectedSubmission || !reviewText || rating === 0) {
      toast.error('Please provide a rating and feedback');
      return;
    }

    try {
      const newReview: Review = {
        id: Math.random().toString(),
        submission_id: selectedSubmission.id,
        reviewer: {
          id: user?.id || '',
          name: user?.user_metadata?.full_name || 'Anonymous',
          avatar: user?.user_metadata?.avatar_url
        },
        rating,
        feedback: reviewText,
        suggestions: [],
        created_at: new Date().toISOString()
      };

      setReviews(prev => [...prev, newReview]);
      setReviewText('');
      setRating(0);
      setSelectedSubmission(null);
      
      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  const getLanguageColor = (language: string) => {
    const colors = {
      javascript: 'bg-yellow-100 text-yellow-800',
      python: 'bg-blue-100 text-blue-800',
      java: 'bg-red-100 text-red-800',
      typescript: 'bg-blue-100 text-blue-800'
    };
    return colors[language as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => setRating(star) : undefined}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center">Loading submissions...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            Peer Code Review System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="review" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="review">Available for Review</TabsTrigger>
              <TabsTrigger value="my-submissions">My Submissions</TabsTrigger>
              <TabsTrigger value="my-reviews">My Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="review" className="space-y-4 mt-6">
              <div className="grid gap-4">
                {submissions.map((submission) => (
                  <Card key={submission.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={submission.author.avatar} />
                            <AvatarFallback>
                              {submission.author.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{submission.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              by {submission.author.name}
                            </p>
                          </div>
                        </div>
                        <Badge className={getLanguageColor(submission.language)}>
                          {submission.language}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        {submission.description}
                      </p>

                      <div className="bg-gray-50 p-3 rounded-md mb-3">
                        <pre className="text-sm overflow-x-auto">
                          <code>{submission.code.substring(0, 200)}...</code>
                        </pre>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {submission.reviews_count} reviews
                          </div>
                          <div className="flex items-center gap-1">
                            {renderStars(submission.average_rating)}
                            <span>({submission.average_rating})</span>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Review Code
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="my-submissions" className="space-y-4 mt-6">
              <div className="grid gap-4">
                {mySubmissions.map((submission) => (
                  <Card key={submission.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{submission.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {submission.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getLanguageColor(submission.language)}>
                            {submission.language}
                          </Badge>
                          <Badge variant={
                            submission.status === 'completed' ? 'default' : 
                            submission.status === 'reviewed' ? 'secondary' : 'outline'
                          }>
                            {submission.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {submission.reviews_count} reviews
                          </div>
                          <div className="flex items-center gap-1">
                            {renderStars(submission.average_rating)}
                            <span>({submission.average_rating})</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="my-reviews" className="space-y-4 mt-6">
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No reviews submitted yet</p>
                <p className="text-sm text-muted-foreground">
                  Start reviewing code to help other students improve!
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Review Modal */}
      {selectedSubmission && (
        <Card className="fixed inset-4 z-50 bg-white shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Review: {selectedSubmission.title}</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedSubmission(null)}
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                <code>{selectedSubmission.code}</code>
              </pre>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Rating</label>
                <div className="mt-1">
                  {renderStars(rating, true)}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Feedback</label>
                <Textarea
                  placeholder="Provide constructive feedback..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>

              <Button onClick={submitReview} className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Submit Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PeerReviewSystem;
