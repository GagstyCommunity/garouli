
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Search, Plus, Edit, Trash2, Eye, CheckCircle, XCircle, AlertTriangle, Bot } from 'lucide-react';
import { toast } from 'sonner';

interface Blog {
  id: string;
  title: string;
  content: string;
  author: string;
  status: 'approved' | 'pending' | 'flagged';
  created_at: string;
  views: number;
  likes: number;
}

const BlogManagement = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      // Mock data - in real implementation, fetch from supabase
      const mockBlogs: Blog[] = [
        {
          id: '1',
          title: 'Getting Started with React Hooks',
          content: 'React Hooks have revolutionized how we write functional components...',
          author: 'John Doe',
          status: 'approved',
          created_at: '2024-01-15',
          views: 245,
          likes: 32
        },
        {
          id: '2',
          title: 'Machine Learning in 2024',
          content: 'The landscape of machine learning is rapidly evolving...',
          author: 'Jane Smith',
          status: 'pending',
          created_at: '2024-01-18',
          views: 0,
          likes: 0
        },
        {
          id: '3',
          title: 'Controversial AI Ethics Discussion',
          content: 'Some potentially inappropriate content flagged by AI...',
          author: 'Bob Johnson',
          status: 'flagged',
          created_at: '2024-01-20',
          views: 12,
          likes: 1
        }
      ];
      setBlogs(mockBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (blogId: string) => {
    setBlogs(blogs.map(blog => 
      blog.id === blogId ? { ...blog, status: 'approved' as const } : blog
    ));
    toast.success('Blog approved successfully!');
  };

  const handleReject = (blogId: string) => {
    setBlogs(blogs.map(blog => 
      blog.id === blogId ? { ...blog, status: 'flagged' as const } : blog
    ));
    toast.success('Blog rejected and flagged');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'flagged': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading blogs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Blog
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Blogs ({blogs.length})</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBlogs.map((blog) => (
              <Card key={blog.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <h3 className="text-lg font-semibold">{blog.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{blog.content}</p>
                      <p className="text-sm text-gray-500 mt-1">by {blog.author}</p>
                    </div>
                    <Badge className={getStatusColor(blog.status)}>
                      {blog.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>{blog.views} views</span>
                      <span>{blog.likes} likes</span>
                      <span>{blog.created_at}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Bot className="h-4 w-4 text-purple-500" />
                      </Button>
                      {blog.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove(blog.id)}
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReject(blog.id)}
                          >
                            <XCircle className="h-4 w-4 text-red-500" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManagement;
