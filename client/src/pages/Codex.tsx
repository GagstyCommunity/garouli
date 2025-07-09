import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Clock, 
  User, 
  TrendingUp,
  Star,
  Eye,
  ArrowRight
} from 'lucide-react';
import Navigation from '@/components/Navigation';

const Codex = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', count: 125 },
    { id: 'ai', name: 'AI & ML', count: 45 },
    { id: 'automation', name: 'Automation', count: 32 },
    { id: 'webdev', name: 'Web Development', count: 28 },
    { id: 'data', name: 'Data Science', count: 20 },
  ];

  const articles = [
    {
      id: 1,
      title: "Complete Guide to AI Prompt Engineering",
      description: "Master the art of crafting effective prompts for AI models to get better results",
      category: "AI & ML",
      difficulty: "Intermediate",
      readTime: "12 min",
      author: "Sarah Chen",
      views: "2.4k",
      rating: 4.8,
      featured: true,
      image: "/api/placeholder/400/250"
    },
    {
      id: 2,
      title: "Building Automated Workflows with Zapier",
      description: "Step-by-step guide to automating your business processes",
      category: "Automation",
      difficulty: "Beginner",
      readTime: "8 min",
      author: "Mike Rodriguez",
      views: "1.8k",
      rating: 4.6,
      featured: false,
      image: "/api/placeholder/400/250"
    },
    {
      id: 3,
      title: "Top 10 AI Tools for Content Creation",
      description: "Discover the best AI tools to boost your content creation workflow",
      category: "AI & ML",
      difficulty: "Beginner",
      readTime: "15 min",
      author: "Emily Johnson",
      views: "3.2k",
      rating: 4.9,
      featured: true,
      image: "/api/placeholder/400/250"
    },
    {
      id: 4,
      title: "React.js Best Practices for 2024",
      description: "Modern React development patterns and techniques",
      category: "Web Development",
      difficulty: "Advanced",
      readTime: "20 min",
      author: "David Kim",
      views: "2.1k",
      rating: 4.7,
      featured: false,
      image: "/api/placeholder/400/250"
    },
    {
      id: 5,
      title: "Data Visualization with Python",
      description: "Create stunning charts and graphs using matplotlib and seaborn",
      category: "Data Science",
      difficulty: "Intermediate",
      readTime: "18 min",
      author: "Lisa Wang",
      views: "1.9k",
      rating: 4.5,
      featured: false,
      image: "/api/placeholder/400/250"
    },
    {
      id: 6,
      title: "ChatGPT vs Claude: AI Comparison",
      description: "Detailed comparison of popular AI assistants and their capabilities",
      category: "AI & ML",
      difficulty: "Beginner",
      readTime: "10 min",
      author: "Alex Thompson",
      views: "4.1k",
      rating: 4.8,
      featured: true,
      image: "/api/placeholder/400/250"
    }
  ];

  const trendingTopics = [
    { name: "AI Automation", count: 45 },
    { name: "Prompt Engineering", count: 38 },
    { name: "No-Code Tools", count: 32 },
    { name: "ChatGPT Tips", count: 28 },
    { name: "Python Scripts", count: 24 },
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           article.category.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = articles.filter(article => article.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">Garouli Codex</h1>
            <p className="text-xl mb-8 opacity-90">
              Your ultimate learning hub for AI, automation, and modern technology
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search tutorials, guides, and tools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg bg-white text-gray-900 border-0 rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-medium">{category.name}</span>
                        <Badge variant="secondary">{category.count}</Badge>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Trending Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Trending Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {trendingTopics.map((topic, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <span className="text-sm font-medium">{topic.name}</span>
                        <Badge variant="outline" className="text-xs">{topic.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="latest" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="latest">Latest</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
              </TabsList>

              <TabsContent value="latest" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredArticles.map((article) => (
                    <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="aspect-video bg-gray-200 rounded-t-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <Badge className="absolute top-2 right-2 bg-white text-gray-800">
                          {article.difficulty}
                        </Badge>
                        <div className="absolute bottom-4 left-4 text-white">
                          <div className="flex items-center space-x-2 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{article.category}</Badge>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{article.rating}</span>
                          </div>
                        </div>
                        <CardTitle className="text-lg hover:text-blue-600 transition-colors">
                          {article.title}
                        </CardTitle>
                        <CardDescription>{article.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{article.author}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Eye className="h-4 w-4" />
                            <span>{article.views}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="featured" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredArticles.map((article) => (
                    <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="aspect-video bg-gray-200 rounded-t-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <Badge className="absolute top-2 left-2 bg-yellow-500 text-black">
                          Featured
                        </Badge>
                        <Badge className="absolute top-2 right-2 bg-white text-gray-800">
                          {article.difficulty}
                        </Badge>
                        <div className="absolute bottom-4 left-4 text-white">
                          <div className="flex items-center space-x-2 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{article.category}</Badge>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{article.rating}</span>
                          </div>
                        </div>
                        <CardTitle className="text-lg hover:text-blue-600 transition-colors">
                          {article.title}
                        </CardTitle>
                        <CardDescription>{article.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{article.author}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Eye className="h-4 w-4" />
                            <span>{article.views}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="popular" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredArticles
                    .sort((a, b) => parseFloat(b.views) - parseFloat(a.views))
                    .map((article) => (
                    <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="aspect-video bg-gray-200 rounded-t-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <Badge className="absolute top-2 right-2 bg-white text-gray-800">
                          {article.difficulty}
                        </Badge>
                        <div className="absolute bottom-4 left-4 text-white">
                          <div className="flex items-center space-x-2 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{article.category}</Badge>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{article.rating}</span>
                          </div>
                        </div>
                        <CardTitle className="text-lg hover:text-blue-600 transition-colors">
                          {article.title}
                        </CardTitle>
                        <CardDescription>{article.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{article.author}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Eye className="h-4 w-4" />
                            <span>{article.views}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <Button variant="outline" size="lg">
                Load More Articles
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Codex;