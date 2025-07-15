import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  FileText, 
  Upload, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Star,
  Download,
  Eye,
  Edit,
  Send
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Assignment {
  id: string;
  course_id: string;
  module_id: string;
  title: string;
  description: string;
  instructions: string;
  max_score: number;
  due_date: string;
  submission_format: string;
  created_at: string;
}

interface Submission {
  id: string;
  assignment_id: string;
  user_id: string;
  submission_text: string;
  file_urls: string[];
  submitted_at: string;
  score: number | null;
  feedback: string | null;
  status: 'draft' | 'submitted' | 'graded';
}

interface PracticalAssignmentsProps {
  courseId: string;
  moduleId?: string;
}

const PracticalAssignments: React.FC<PracticalAssignmentsProps> = ({ courseId, moduleId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAssignments();
    fetchSubmissions();
  }, [courseId, moduleId]);

  const fetchAssignments = async () => {
    try {
      let query = supabase
        .from('practical_assignments')
        .select('*')
        .eq('course_id', courseId);
      
      if (moduleId) {
        query = query.eq('module_id', moduleId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setAssignments(data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('assignment_submissions')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleSubmit = async (assignmentId: string) => {
    if (!user || !submissionText.trim()) {
      toast({
        title: "Error",
        description: "Please provide your submission content",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      
      // Upload files if any
      const fileUrls: string[] = [];
      for (const file of selectedFiles) {
        const fileName = `${user.id}/${assignmentId}/${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('assignment-submissions')
          .upload(fileName, file);

        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('assignment-submissions')
          .getPublicUrl(fileName);
        
        fileUrls.push(urlData.publicUrl);
      }

      // Check if submission already exists
      const existingSubmission = submissions.find(sub => sub.assignment_id === assignmentId);
      
      if (existingSubmission) {
        // Update existing submission
        const { error } = await supabase
          .from('assignment_submissions')
          .update({
            submission_text: submissionText,
            file_urls: fileUrls,
            submitted_at: new Date().toISOString(),
            status: 'submitted'
          })
          .eq('id', existingSubmission.id);

        if (error) throw error;
      } else {
        // Create new submission
        const { error } = await supabase
          .from('assignment_submissions')
          .insert({
            assignment_id: assignmentId,
            user_id: user.id,
            submission_text: submissionText,
            file_urls: fileUrls,
            submitted_at: new Date().toISOString(),
            status: 'submitted'
          });

        if (error) throw error;
      }

      await fetchSubmissions();
      setSubmissionText('');
      setSelectedFiles([]);
      setSelectedAssignment(null);

      toast({
        title: "Success",
        description: "Assignment submitted successfully!",
      });

    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast({
        title: "Error",
        description: "Failed to submit assignment",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getSubmissionForAssignment = (assignmentId: string) => {
    return submissions.find(sub => sub.assignment_id === assignmentId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'graded': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading assignments...</div>
        </CardContent>
      </Card>
    );
  }

  if (assignments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">No Practical Assignments</h3>
            <p>This course doesn't have any practical assignments yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Practical Assignments</h2>
        <Badge variant="outline">
          {assignments.length} assignments
        </Badge>
      </div>

      <div className="grid gap-6">
        {assignments.map((assignment) => {
          const submission = getSubmissionForAssignment(assignment.id);
          const overdue = isOverdue(assignment.due_date);
          
          return (
            <Card key={assignment.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      {assignment.title}
                    </CardTitle>
                    <p className="text-gray-600 mt-2">{assignment.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {submission && (
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      Due: {new Date(assignment.due_date).toLocaleDateString()}
                    </div>
                    {overdue && !submission && (
                      <Badge variant="destructive">Overdue</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Instructions:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {assignment.instructions}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Max Score: {assignment.max_score} points</span>
                    <span>Format: {assignment.submission_format}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {submission ? (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Submission
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Your Submission</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Submission Text:</Label>
                                <div className="bg-gray-50 rounded-lg p-4 mt-2">
                                  <p className="whitespace-pre-wrap">{submission.submission_text}</p>
                                </div>
                              </div>
                              
                              {submission.file_urls.length > 0 && (
                                <div>
                                  <Label>Uploaded Files:</Label>
                                  <div className="space-y-2 mt-2">
                                    {submission.file_urls.map((url, index) => (
                                      <a
                                        key={index}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-blue-600 hover:underline"
                                      >
                                        <Download className="h-4 w-4" />
                                        File {index + 1}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {submission.status === 'graded' && (
                                <div className="border-t pt-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <Label>Score:</Label>
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 text-yellow-500" />
                                      <span className="font-bold">
                                        {submission.score}/{assignment.max_score}
                                      </span>
                                    </div>
                                  </div>
                                  {submission.feedback && (
                                    <div>
                                      <Label>Feedback:</Label>
                                      <div className="bg-blue-50 rounded-lg p-4 mt-2">
                                        <p className="text-blue-800">{submission.feedback}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="text-sm text-gray-500">
                                Submitted: {new Date(submission.submitted_at).toLocaleString()}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        {submission.status !== 'graded' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAssignment(assignment);
                              setSubmissionText(submission.submission_text);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        )}
                      </>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            disabled={overdue}
                            onClick={() => setSelectedAssignment(assignment)}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Submit Assignment
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Submit Assignment: {assignment.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="submission">Your Solution:</Label>
                              <Textarea
                                id="submission"
                                value={submissionText}
                                onChange={(e) => setSubmissionText(e.target.value)}
                                placeholder="Write your solution here..."
                                rows={8}
                                className="mt-2"
                              />
                            </div>

                            <div>
                              <Label htmlFor="files">Upload Files (optional):</Label>
                              <Input
                                id="files"
                                type="file"
                                multiple
                                onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                                className="mt-2"
                              />
                              <p className="text-sm text-gray-500 mt-1">
                                Supported formats: PDF, DOC, DOCX, ZIP, images
                              </p>
                            </div>

                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setSelectedAssignment(null);
                                  setSubmissionText('');
                                  setSelectedFiles([]);
                                }}
                              >
                                Cancel
                              </Button>
                              <Button 
                                onClick={() => handleSubmit(assignment.id)}
                                disabled={submitting || !submissionText.trim()}
                              >
                                {submitting ? 'Submitting...' : 'Submit Assignment'}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>

                {submission && submission.status === 'graded' && (
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Your Score:</span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(submission.score || 0) / assignment.max_score * 100} 
                          className="w-24"
                        />
                        <span className="font-bold text-lg">
                          {submission.score}/{assignment.max_score}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PracticalAssignments;