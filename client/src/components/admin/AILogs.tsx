
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Search, Download, Eye, MessageSquare, BookOpen, Target, Award } from 'lucide-react';
import { toast } from 'sonner';

const AILogs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('learning-journeys');

  const handleExport = () => {
    toast.success('AI logs exported successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Logs & Feedback</h2>
        <Button onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-500" />
            AI System Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="learning-journeys">Learning Journeys</TabsTrigger>
              <TabsTrigger value="chat-sessions">Chat Sessions</TabsTrigger>
              <TabsTrigger value="feedback">AI Feedback</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <div className="mt-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search AI logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <TabsContent value="learning-journeys" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold">Alice Johnson's Learning Journey</h3>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Goal:</strong> Career change to Machine Learning Engineer</p>
                    <p className="text-sm"><strong>Progress:</strong> 65% complete</p>
                    <p className="text-sm"><strong>AI Recommendations:</strong> 3 courses suggested, 2 completed</p>
                    <p className="text-sm"><strong>Next Steps:</strong> Advanced Neural Networks course</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-500" />
                      <h3 className="font-semibold">Bob Smith's Learning Journey</h3>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Goal:</strong> Full Stack Development certification</p>
                    <p className="text-sm"><strong>Progress:</strong> 100% complete</p>
                    <p className="text-sm"><strong>AI Recommendations:</strong> 5 courses suggested, 5 completed</p>
                    <p className="text-sm"><strong>Achievement:</strong> Certified Full Stack Developer</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat-sessions" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold">React Fundamentals - Study Session</h3>
                    </div>
                    <Badge variant="outline">2 hours ago</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Student:</strong> Charlie Brown</p>
                    <p className="text-sm"><strong>Questions Asked:</strong> 12</p>
                    <p className="text-sm"><strong>Topics Covered:</strong> Hooks, State Management, Props</p>
                    <p className="text-sm"><strong>AI Confidence:</strong> 87% helpful responses</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <Eye className="h-4 w-4 mr-1" />
                      View Full Session
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-purple-500" />
                      <h3 className="font-semibold">AI-Generated Learning Assessment</h3>
                    </div>
                    <Badge variant="outline">Daily Report</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Student:</strong> Diana Prince</p>
                    <p className="text-sm"><strong>Strengths:</strong> Quick problem solving, consistent practice</p>
                    <p className="text-sm"><strong>Areas for Improvement:</strong> Code documentation, testing practices</p>
                    <p className="text-sm"><strong>Recommended Focus:</strong> Unit testing frameworks</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-500" />
                      <h3 className="font-semibold">AI Certification Recommendations</h3>
                    </div>
                    <Badge variant="outline">Updated</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm"><strong>Student:</strong> Eve Wilson</p>
                    <p className="text-sm"><strong>Current Level:</strong> Intermediate React Developer</p>
                    <p className="text-sm"><strong>Suggested Certification:</strong> Advanced React Patterns</p>
                    <p className="text-sm"><strong>Reasoning:</strong> Strong foundation, ready for advanced concepts</p>
                    <p className="text-sm"><strong>Confidence Score:</strong> 92%</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AILogs;
