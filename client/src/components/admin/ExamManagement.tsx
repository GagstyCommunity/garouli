
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, Plus, Search, Edit, Trash2, Clock, Target, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  marks: number;
}

interface Exam {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  duration: number; // in minutes
  totalQuestions: number;
  totalMarks: number;
  passPercentage: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  attempts: number;
  averageScore: number;
}

const ExamManagement = () => {
  const [exams, setExams] = useState<Exam[]>([
    {
      id: '1',
      title: 'Web Development Fundamentals Final Exam',
      courseId: '1',
      courseName: 'Complete Web Development Bootcamp',
      duration: 120,
      totalQuestions: 50,
      totalMarks: 100,
      passPercentage: 70,
      status: 'published',
      createdAt: '2024-01-15',
      attempts: 234,
      averageScore: 78.5
    },
    {
      id: '2',
      title: 'JavaScript Advanced Concepts Test',
      courseId: '1',
      courseName: 'Complete Web Development Bootcamp',
      duration: 60,
      totalQuestions: 25,
      totalMarks: 50,
      passPercentage: 65,
      status: 'draft',
      createdAt: '2024-01-20',
      attempts: 0,
      averageScore: 0
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExam, setSelectedExam] = useState<string | null>(null);

  const sampleQuestions: Question[] = [
    {
      id: '1',
      questionText: 'What does HTML stand for?',
      options: [
        'Hyper Text Markup Language',
        'High Tech Modern Language',
        'Home Tool Markup Language',
        'Hyperlink Text Markup Language'
      ],
      correctAnswer: 0,
      explanation: 'HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages.',
      marks: 2
    },
    {
      id: '2',
      questionText: 'Which CSS property is used to change the text color?',
      options: ['text-color', 'color', 'font-color', 'text-style'],
      correctAnswer: 1,
      explanation: 'The "color" property in CSS is used to set the color of text.',
      marks: 2
    }
  ];

  const filteredExams = exams.filter(exam =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateExam = () => {
    toast.success('Exam creation dialog would open here');
  };

  const handleEditExam = (examId: string) => {
    toast.success(`Edit exam ${examId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Exam & Quiz Management</h2>
        <Button onClick={handleCreateExam}>
          <Plus className="h-4 w-4 mr-2" />
          Create Exam
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Exams ({exams.length})</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search exams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredExams.map((exam) => (
              <Card key={exam.id} className="border-l-4 border-l-purple-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <ClipboardCheck className="h-5 w-5 text-purple-500" />
                        <h3 className="text-lg font-semibold">{exam.title}</h3>
                        <Badge className={getStatusColor(exam.status)}>
                          {exam.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Course: {exam.courseName}</p>
                      <p className="text-xs text-gray-500">Created: {exam.createdAt}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {exam.duration} min
                      </Badge>
                      <Badge variant="outline">
                        <Target className="h-3 w-3 mr-1" />
                        {exam.passPercentage}% pass
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="font-semibold text-blue-600">{exam.totalQuestions}</div>
                      <div className="text-xs text-gray-600">Questions</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="font-semibold text-green-600">{exam.totalMarks}</div>
                      <div className="text-xs text-gray-600">Total Marks</div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <div className="font-semibold text-orange-600">{exam.attempts}</div>
                      <div className="text-xs text-gray-600">Attempts</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="font-semibold text-purple-600">{exam.averageScore}%</div>
                      <div className="text-xs text-gray-600">Avg Score</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Duration: {exam.duration} minutes</span>
                      <span>Pass: {exam.passPercentage}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedExam(selectedExam === exam.id ? null : exam.id)}
                      >
                        <BookOpen className="h-4 w-4 mr-1" />
                        {selectedExam === exam.id ? 'Hide' : 'Preview'} Questions
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditExam(exam.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Questions Preview */}
                  {selectedExam === exam.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-3">Sample Questions Preview</h4>
                      <div className="space-y-4">
                        {sampleQuestions.map((question, index) => (
                          <div key={question.id} className="p-3 bg-white rounded border">
                            <div className="flex items-start justify-between mb-2">
                              <h5 className="font-medium text-sm">
                                Q{index + 1}. {question.questionText}
                              </h5>
                              <Badge variant="outline" className="text-xs">
                                {question.marks} marks
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                              {question.options.map((option, optionIndex) => (
                                <div 
                                  key={optionIndex} 
                                  className={`text-xs p-2 rounded ${
                                    optionIndex === question.correctAnswer 
                                      ? 'bg-green-100 text-green-800 font-medium' 
                                      : 'bg-gray-100'
                                  }`}
                                >
                                  {String.fromCharCode(65 + optionIndex)}. {option}
                                </div>
                              ))}
                            </div>
                            <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                              <strong>Explanation:</strong> {question.explanation}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-center">
                        <Button variant="outline" size="sm">
                          View All {exam.totalQuestions} Questions
                        </Button>
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

export default ExamManagement;
