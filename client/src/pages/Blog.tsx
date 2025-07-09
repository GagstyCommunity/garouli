import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, Clock, Search, Filter, BookOpen, TrendingUp, 
  User, Tag, ArrowRight, Heart, MessageCircle, Share2
} from 'lucide-react';
import { Link } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  publishedAt: string;
  readTime: number;
  category: string;
  tags: string[];
  featured: boolean;
  likes: number;
  comments: number;
  slug: string;
}

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        // Mock blog posts data - would come from API
        const mockPosts: BlogPost[] = [
          {
            id: '1',
            title: 'The Future of AI in Education: Transforming Learning for the Digital Age',
            excerpt: 'Explore how artificial intelligence is revolutionizing education, from personalized learning paths to intelligent tutoring systems that adapt to each student\'s needs.',
            content: '',
            author: {
              name: 'Dr. Sarah Chen',
              avatar: '',
              role: 'AI Education Researcher'
            },
            publishedAt: '2024-01-15',
            readTime: 8,
            category: 'AI & Technology',
            tags: ['AI', 'Education', 'Machine Learning', 'Future'],
            featured: true,
            likes: 245,
            comments: 32,
            slug: 'future-of-ai-in-education'
          },
          {
            id: '2',
            title: 'Building Your First Neural Network: A Beginner\'s Guide',
            excerpt: 'Step-by-step tutorial on creating your first neural network using Python and TensorFlow. Perfect for beginners starting their AI journey.',
            content: '',
            author: {
              name: 'Marcus Johnson',
              avatar: '',
              role: 'ML Engineer'
            },
            publishedAt: '2024-01-12',
            readTime: 12,
            category: 'Tutorials',
            tags: ['Neural Networks', 'Python', 'TensorFlow', 'Beginner'],
            featured: true,
            likes: 189,
            comments: 28,
            slug: 'building-first-neural-network'
          },
          {
            id: '3',
            title: 'Career Transition: From Developer to AI Specialist',
            excerpt: 'Real stories and practical advice from developers who successfully transitioned into AI and machine learning roles.',
            content: '',
            author: {
              name: 'Emma Rodriguez',
              avatar: '',
              role: 'Career Advisor'
            },
            publishedAt: '2024-01-10',
            readTime: 6,
            category: 'Career',
            tags: ['Career', 'AI Jobs', 'Transition', 'Professional Development'],
            featured: false,
            likes: 156,
            comments: 19,
            slug: 'developer-to-ai-specialist'
          },
          {
            id: '4',
            title: 'Top 10 AI Tools Every Developer Should Know in 2024',
            excerpt: 'Discover the essential AI tools and platforms that are shaping the development landscape and boosting productivity.',
            content: '',
            author: {
              name: 'Alex Kim',
              avatar: '',
              role: 'Tech Writer'
            },
            publishedAt: '2024-01-08',
            readTime: 10,
            category: 'Tools & Resources',
            tags: ['AI Tools', 'Development', 'Productivity', '2024'],
            featured: false,
            likes: 203,
            comments: 41,
            slug: 'top-ai-tools-2024'
          },
          {
            id: '5',
            title: 'Understanding Large Language Models: GPT, BERT, and Beyond',
            excerpt: 'Deep dive into the architecture and applications of large language models that are transforming natural language processing.',
            content: '',
            author: {
              name: 'Dr. Michael Zhang',
              avatar: '',
              role: 'NLP Researcher'
            },
            publishedAt: '2024-01-05',
            readTime: 15,
            category: 'AI & Technology',
            tags: ['LLM', 'GPT', 'BERT', 'NLP', 'Deep Learning'],
            featured: false,
            likes: 287,
            comments: 52,
            slug: 'understanding-large-language-models'
          },
          {
            id: '6',
            title: 'Building Scalable AI Applications with Cloud Platforms',
            excerpt: 'Learn how to deploy and scale AI applications using AWS, Google Cloud, and Azure. Best practices for production AI systems.',
            content: '',
            author: {
              name: 'Lisa Park',
              avatar: '',
              role: 'Cloud Architect'
            },
            publishedAt: '2024-01-03',
            readTime: 11,
            category: 'Cloud & Infrastructure',
            tags: ['Cloud', 'AWS', 'Azure', 'Deployment', 'Scalability'],
            featured: false,
            likes: 134,
            comments: 23,
            slug: 'scalable-ai-applications-cloud'
          }
        ];

        setPosts(mockPosts);
        setFeaturedPosts(mockPosts.filter(post => post.featured));
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(mockPosts.map(post => post.category)));
        setCategories(['All', ...uniqueCategories]);

      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI Learning <span className="text-primary">Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Insights, tutorials, and industry trends from AI education experts. 
              Stay ahead with the latest in artificial intelligence and machine learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 relative">
                    <Badge className="absolute top-4 left-4">Featured</Badge>
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="secondary">{post.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold line-clamp-2 mb-2">{post.title}</h3>
                        <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span>{post.author.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.readTime} min read</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                        <Button asChild>
                          <Link href={`/blog/${post.slug}`}>
                            Read More <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* All Posts */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              {selectedCategory === 'All' ? 'All Articles' : selectedCategory}
            </h2>
            <div className="text-muted-foreground">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 relative">
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold line-clamp-2 mb-2">{post.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback className="text-xs">{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span>{post.author.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readTime}m</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Heart className="h-3 w-3" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" asChild>
                        <Link href={`/blog/${post.slug}`}>
                          Read <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </section>

        {/* Newsletter Signup */}
        <section className="mt-20 py-16 bg-primary text-primary-foreground rounded-2xl">
          <div className="max-w-2xl mx-auto text-center px-6">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 opacity-90">
              Get the latest AI insights and tutorials delivered to your inbox weekly
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email" 
                className="bg-primary-foreground text-primary border-primary-foreground"
              />
              <Button variant="secondary" size="lg">
                Subscribe
              </Button>
            </div>
            <p className="text-sm opacity-75 mt-4">
              Join 10,000+ learners. No spam, unsubscribe anytime.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Blog;