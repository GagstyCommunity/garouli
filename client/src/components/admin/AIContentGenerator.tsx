
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, BookOpen, FileText, HelpCircle, 
  Zap, Download, Copy, RefreshCw, Send, Bot
} from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedContent {
  id: string;
  type: string;
  title: string;
  content: string;
  prompt: string;
  created_at: string;
  status: 'generating' | 'completed' | 'error';
}

const AIContentGenerator = () => {
  const [activeTab, setActiveTab] = useState('course');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [progress, setProgress] = useState(0);
  
  const [coursePrompt, setCoursePrompt] = useState({
    topic: '',
    level: 'beginner',
    duration: '4',
    modules: '6',
    style: 'practical'
  });

  const [quizPrompt, setQuizPrompt] = useState({
    topic: '',
    questions: '10',
    difficulty: 'medium',
    type: 'multiple-choice'
  });

  const [blogPrompt, setBlogPrompt] = useState({
    topic: '',
    tone: 'professional',
    length: 'medium',
    target_audience: 'developers'
  });

  const [customPrompt, setCustomPrompt] = useState('');

  const generateContent = async (type: string, prompt: any) => {
    setIsGenerating(true);
    setProgress(0);
    
    try {
      // Simulate AI generation process
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setProgress(100);

      const mockContent = generateMockContent(type, prompt);
      
      setGeneratedContent(prev => [mockContent, ...prev]);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} generated successfully!`);
      
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content');
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  const generateMockContent = (type: string, prompt: any): GeneratedContent => {
    const mockContents = {
      course: {
        title: `Complete ${prompt.topic} Course`,
        content: `# ${prompt.topic} Mastery Course\n\n## Course Overview\nThis comprehensive ${prompt.level} level course will take you through ${prompt.topic} fundamentals and advanced concepts.\n\n## Modules:\n1. Introduction to ${prompt.topic}\n2. Setting up Development Environment\n3. Core Concepts\n4. Practical Applications\n5. Advanced Techniques\n6. Real-world Projects\n\nEach module includes video lectures, hands-on exercises, and quizzes to reinforce learning.`
      },
      quiz: {
        title: `${prompt.topic} Assessment Quiz`,
        content: `# ${prompt.topic} Quiz\n\n**Question 1:** What is the primary purpose of ${prompt.topic}?\nA) Option A\nB) Option B\nC) Option C\nD) Option D\n\n**Question 2:** Which of the following is a key feature?\nA) Feature A\nB) Feature B\nC) Feature C\nD) Feature D\n\n[Generated ${prompt.questions} questions total]`
      },
      blog: {
        title: `The Future of ${prompt.topic}`,
        content: `# The Future of ${prompt.topic}\n\nIn today's rapidly evolving technological landscape, ${prompt.topic} has emerged as a critical component for ${prompt.target_audience}. This comprehensive guide explores the latest trends, best practices, and future prospects.\n\n## Key Insights\n- Revolutionary approaches to implementation\n- Industry best practices\n- Future predictions and trends\n\n*Generated with ${prompt.tone} tone for ${prompt.target_audience} audience*`
      }
    };

    return {
      id: Date.now().toString(),
      type,
      title: mockContents[type as keyof typeof mockContents]?.title || `Generated ${type}`,
      content: mockContents[type as keyof typeof mockContents]?.content || 'Generated content...',
      prompt: JSON.stringify(prompt),
      created_at: new Date().toISOString(),
      status: 'completed'
    };
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Content copied to clipboard!');
  };

  const handleDownloadContent = (content: GeneratedContent) => {
    const blob = new Blob([content.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${content.title.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Content downloaded!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6" />
          AI Content Generator
        </h2>
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Bot className="h-3 w-3 mr-1" />
          Powered by Gemini AI
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="course">Course Generator</TabsTrigger>
          <TabsTrigger value="quiz">Quiz Generator</TabsTrigger>
          <TabsTrigger value="blog">Blog Generator</TabsTrigger>
          <TabsTrigger value="custom">Custom Prompt</TabsTrigger>
        </TabsList>

        <TabsContent value="course">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Generate Complete Course
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="course_topic">Course Topic *</Label>
                  <Input
                    id="course_topic"
                    value={coursePrompt.topic}
                    onChange={(e) => setCoursePrompt({...coursePrompt, topic: e.target.value})}
                    placeholder="React.js, Machine Learning, Python..."
                  />
                </div>
                <div>
                  <Label htmlFor="course_level">Difficulty Level</Label>
                  <Select value={coursePrompt.level} onValueChange={(value) => setCoursePrompt({...coursePrompt, level: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="course_duration">Duration (weeks)</Label>
                  <Input
                    id="course_duration"
                    type="number"
                    value={coursePrompt.duration}
                    onChange={(e) => setCoursePrompt({...coursePrompt, duration: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="course_modules">Number of Modules</Label>
                  <Input
                    id="course_modules"
                    type="number"
                    value={coursePrompt.modules}
                    onChange={(e) => setCoursePrompt({...coursePrompt, modules: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="course_style">Teaching Style</Label>
                <Select value={coursePrompt.style} onValueChange={(value) => setCoursePrompt({...coursePrompt, style: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="practical">Hands-on Practical</SelectItem>
                    <SelectItem value="theoretical">Theoretical</SelectItem>
                    <SelectItem value="mixed">Mixed Approach</SelectItem>
                    <SelectItem value="project-based">Project-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={() => generateContent('course', coursePrompt)}
                disabled={isGenerating || !coursePrompt.topic}
                className="w-full"
              >
                {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
                Generate Course
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Generate Quiz Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quiz_topic">Quiz Topic *</Label>
                  <Input
                    id="quiz_topic"
                    value={quizPrompt.topic}
                    onChange={(e) => setQuizPrompt({...quizPrompt, topic: e.target.value})}
                    placeholder="JavaScript ES6, Database Design..."
                  />
                </div>
                <div>
                  <Label htmlFor="quiz_questions">Number of Questions</Label>
                  <Input
                    id="quiz_questions"
                    type="number"
                    value={quizPrompt.questions}
                    onChange={(e) => setQuizPrompt({...quizPrompt, questions: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="quiz_difficulty">Difficulty</Label>
                  <Select value={quizPrompt.difficulty} onValueChange={(value) => setQuizPrompt({...quizPrompt, difficulty: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quiz_type">Question Type</Label>
                  <Select value={quizPrompt.type} onValueChange={(value) => setQuizPrompt({...quizPrompt, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                      <SelectItem value="mixed">Mixed Types</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                onClick={() => generateContent('quiz', quizPrompt)}
                disabled={isGenerating || !quizPrompt.topic}
                className="w-full"
              >
                {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
                Generate Quiz
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blog">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generate Blog Article
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="blog_topic">Article Topic *</Label>
                  <Input
                    id="blog_topic"
                    value={blogPrompt.topic}
                    onChange={(e) => setBlogPrompt({...blogPrompt, topic: e.target.value})}
                    placeholder="Web3 Development, AI Ethics..."
                  />
                </div>
                <div>
                  <Label htmlFor="blog_tone">Tone</Label>
                  <Select value={blogPrompt.tone} onValueChange={(value) => setBlogPrompt({...blogPrompt, tone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="blog_length">Article Length</Label>
                  <Select value={blogPrompt.length} onValueChange={(value) => setBlogPrompt({...blogPrompt, length: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (500-800 words)</SelectItem>
                      <SelectItem value="medium">Medium (800-1500 words)</SelectItem>
                      <SelectItem value="long">Long (1500+ words)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="blog_audience">Target Audience</Label>
                  <Select value={blogPrompt.target_audience} onValueChange={(value) => setBlogPrompt({...blogPrompt, target_audience: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developers">Developers</SelectItem>
                      <SelectItem value="beginners">Beginners</SelectItem>
                      <SelectItem value="professionals">Professionals</SelectItem>
                      <SelectItem value="general">General Audience</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button 
                onClick={() => generateContent('blog', blogPrompt)}
                disabled={isGenerating || !blogPrompt.topic}
                className="w-full"
              >
                {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
                Generate Article
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Custom AI Prompt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="custom_prompt">Enter your custom prompt</Label>
                <Textarea
                  id="custom_prompt"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Create a comprehensive guide for building a full-stack web application using React, Node.js, and PostgreSQL..."
                  rows={6}
                />
              </div>
              <Button 
                onClick={() => generateContent('custom', { prompt: customPrompt })}
                disabled={isGenerating || !customPrompt.trim()}
                className="w-full"
              >
                {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
                Generate Content
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generation Progress */}
      {isGenerating && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Generating content...</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Content History */}
      {generatedContent.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Content ({generatedContent.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedContent.map((content) => (
                <Card key={content.id} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{content.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {new Date(content.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleCopyContent(content.content)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDownloadContent(content)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Badge className="bg-blue-100 text-blue-800 capitalize">
                          {content.type}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm font-mono max-h-40 overflow-y-auto">
                        {content.content.substring(0, 500)}
                        {content.content.length > 500 && '...'}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIContentGenerator;
