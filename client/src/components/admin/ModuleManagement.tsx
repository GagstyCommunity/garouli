import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Layers, Plus, Search, Edit, Trash2, GripVertical, Video, FileText, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Module {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  order: number;
  lessonsCount: number;
  duration: number;
  status: 'draft' | 'published';
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'practical';
  duration: number;
  moduleId: string;
  order: number;
}

const ModuleManagement = () => {
  const [modules, setModules] = useState<Module[]>([
    {
      id: '1',
      title: 'Introduction to Web Development',
      description: 'Learn the basics of HTML, CSS, and JavaScript',
      courseId: '1',
      courseName: 'Complete Web Development Bootcamp',
      order: 1,
      lessonsCount: 5,
      duration: 120,
      status: 'published'
    },
    {
      id: '2',
      title: 'Advanced React Concepts',
      description: 'Deep dive into React hooks, context, and performance',
      courseId: '1',
      courseName: 'Complete Web Development Bootcamp',
      order: 2,
      lessonsCount: 8,
      duration: 200,
      status: 'draft'
    }
  ]);

  const [lessons, setLessons] = useState<Lesson[]>([
    { id: '1', title: 'HTML Fundamentals', type: 'video', duration: 30, moduleId: '1', order: 1 },
    { id: '2', title: 'CSS Styling', type: 'video', duration: 45, moduleId: '1', order: 2 },
    { id: '3', title: 'JavaScript Basics Quiz', type: 'quiz', duration: 15, moduleId: '1', order: 3 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const filteredModules = modules.filter(module =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getModuleLessons = (moduleId: string) => 
    lessons.filter(lesson => lesson.moduleId === moduleId);

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
      case 'quiz': return <HelpCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Module & Lesson Management</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Module
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Modules Overview</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search modules or courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredModules.map((module) => (
              <Card key={module.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                        <Layers className="h-5 w-5 text-blue-500" />
                        <h3 className="text-lg font-semibold">{module.title}</h3>
                        <Badge className={getStatusColor(module.status)}>
                          {module.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{module.description}</p>
                      <p className="text-xs text-gray-500">Course: {module.courseName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {module.lessonsCount} lessons
                      </Badge>
                      <Badge variant="outline">
                        {module.duration} min
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Order: {module.order}</span>
                      <span>Duration: {module.duration} minutes</span>
                      <span>Lessons: {module.lessonsCount}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
                      >
                        {selectedModule === module.id ? 'Hide' : 'Show'} Lessons
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Lessons List */}
                  {selectedModule === module.id && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Lessons</h4>
                        <Button size="sm" variant="outline">
                          <Plus className="h-3 w-3 mr-1" />
                          Add Lesson
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {getModuleLessons(module.id).map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <GripVertical className="h-3 w-3 text-gray-400 cursor-move" />
                              {getLessonIcon(lesson.type)}
                              <span className="text-sm font-medium">{lesson.title}</span>
                              <Badge variant="secondary" className="text-xs">
                                {lesson.type}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">{lesson.duration} min</span>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleManagement;
