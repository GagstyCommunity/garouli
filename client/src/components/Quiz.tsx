
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Award, Clock, AlertTriangle, Trophy, Share2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  marks: number;
}

interface QuizAttempt {
  id: string;
  attempt_number: number;
  score: number;
  total_questions: number;
  passed: boolean;
  completed_at: string;
}

interface QuizProps {
  moduleId: string;
  courseId: string;
  onComplete?: (score: number, passed: boolean) => void;
}

const Quiz: React.FC<QuizProps> = ({ moduleId, courseId, onComplete }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [maxScore, setMaxScore] = useState(100); // 50 questions × 2 marks = 100
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes
  const [quizStarted, setQuizStarted] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [canAttempt, setCanAttempt] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateData, setCertificateData] = useState<any>(null);

  useEffect(() => {
    fetchQuizQuestions();
  }, [moduleId]);

  // Timer effect
  useEffect(() => {
    if (quizStarted && timeRemaining > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Time's up - auto submit
            const currentAnswers = [...answers];
            if (selectedAnswer !== null) {
              currentAnswers[currentQuestion] = selectedAnswer;
            }
            calculateScore(currentAnswers);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, timeRemaining, isSubmitted, answers, selectedAnswer, currentQuestion]);

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeRemaining(3600); // 60 minutes
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchQuizQuestions = async () => {
    try {
      // Check previous attempts first
      await checkPreviousAttempts();
      
      const { data, error } = await supabase
        .from('course_quizzes')
        .select('*')
        .eq('module_id', moduleId)
        .limit(50);

      if (error) {
        console.error('Error fetching quiz questions:', error);
        generateSampleQuestions();
        return;
      }

      if (data && data.length >= 10) {
        const transformedQuestions: QuizQuestion[] = data.map(item => ({
          id: item.id,
          question: item.question,
          options: Array.isArray(item.options) ? item.options as string[] : [],
          correct_answer: item.correct_answer,
          explanation: item.explanation || '',
          marks: 2
        }));
        setQuestions(transformedQuestions.slice(0, 50)); // Ensure exactly 50 questions
      } else {
        generateSampleQuestions();
      }
    } catch (error) {
      console.error('Error in fetchQuizQuestions:', error);
      generateSampleQuestions();
    } finally {
      setLoading(false);
    }
  };

  const generateSampleQuestions = () => {
    const sampleQuestions: QuizQuestion[] = Array.from({ length: 50 }, (_, i) => ({
      id: `q${i + 1}`,
      question: `Question ${i + 1}: What is an important concept in this course module?`,
      options: [
        'Understanding the fundamentals is crucial',
        'Advanced concepts without basics',
        'Random information',
        'Unrelated topics'
      ],
      correct_answer: 0,
      explanation: 'Understanding fundamentals provides a solid foundation for learning.',
      marks: 2
    }));
    setQuestions(sampleQuestions);
  };

  const checkPreviousAttempts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('course_enrollments')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (data && data.length > 0) {
        const attemptCount = data.length;
        setCanAttempt(attemptCount < 3);
        
        const attemptHistory: QuizAttempt[] = data.map(attempt => ({
          id: attempt.id,
          attempt_number: attemptCount,
          score: attempt.progress || 0,
          total_questions: 50,
          passed: (attempt.progress || 0) >= 70,
          completed_at: attempt.enrolled_at
        }));
        setAttempts(attemptHistory);
      }
    } catch (error) {
      console.error('Error checking attempts:', error);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz completed
      calculateScore(newAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || null);
      setShowExplanation(false);
    }
  };

  const calculateScore = (finalAnswers: number[]) => {
    const correctCount = finalAnswers.reduce((count, answer, index) => {
      return answer === questions[index].correct_answer ? count + 1 : count;
    }, 0);

    const scorePercentage = Math.round((correctCount / questions.length) * 100);
    const totalMarks = correctCount * 2; // 2 marks per question
    const passed = scorePercentage >= 70;
    
    setTotalScore(totalMarks);
    setShowResult(true);
    setIsSubmitted(true);
    
    // Save quiz result and handle certificate
    saveQuizResult(scorePercentage, totalMarks, passed, finalAnswers);
    
    if (passed) {
      generateCertificate(scorePercentage);
      awardBadges();
    }
    
    onComplete?.(scorePercentage, passed);
  };

  const saveQuizResult = async (scorePercentage: number, marks: number, passed: boolean, userAnswers: number[]) => {
    if (!user) return;

    try {
      const attemptNumber = attempts.length + 1;
      
      // Save to course_enrollments for tracking attempts
      await supabase.from('course_enrollments').insert({
        user_id: user.id,
        course_id: courseId,
        progress: scorePercentage,
        completed_at: passed ? new Date().toISOString() : null
      });

      // Also save detailed quiz attempt data if we have the schema
      try {
        await supabase.from('quiz_attempts').insert({
          user_id: user.id,
          course_id: courseId,
          module_id: moduleId,
          attempt_number: attemptNumber,
          score: marks,
          total_questions: questions.length,
          passed: passed,
          answers: JSON.stringify(userAnswers),
          completed_at: new Date().toISOString()
        });
      } catch (schemaError) {
        console.log('Quiz attempts table not available, using basic tracking');
      }

      toast({
        title: passed ? "Congratulations!" : "Quiz Completed",
        description: passed 
          ? `You passed with ${scorePercentage}%! Certificate generated.`
          : `You scored ${scorePercentage}%. You need 70% to pass. ${3 - attemptNumber} attempts remaining.`,
        variant: passed ? "default" : "destructive",
      });

    } catch (error) {
      console.error('Error saving quiz result:', error);
      toast({
        title: "Error",
        description: "Failed to save quiz results",
        variant: "destructive",
      });
    }
  };

  const generateCertificate = async (score: number) => {
    if (!user) return;
    
    try {
      const verificationHash = Math.random().toString(36).substring(2, 15);
      const certificateData = {
        user_id: user.id,
        course_id: courseId,
        verification_hash: verificationHash,
        score: score,
        issued_date: new Date().toISOString(),
        user_name: user.user_metadata?.full_name || user.email
      };

      setCertificateData(certificateData);
      setShowCertificate(true);

      // Save certificate to database
      await supabase.from('certificates').insert({
        user_id: user.id,
        course_id: courseId,
        verification_hash: verificationHash,
        certificate_url: `https://certificates.example.com/${verificationHash}`,
      });

    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  const awardBadges = async () => {
    if (!user) return;
    
    try {
      const badges = [
        {
          user_id: user.id,
          badge_type: 'course_completion',
          badge_name: 'Course Completion',
          badge_description: 'Successfully completed the course quiz',
          badge_icon: '🎓',
          course_id: courseId
        },
        {
          user_id: user.id,
          badge_type: 'quiz_master',
          badge_name: 'Quiz Master',
          badge_description: 'Achieved 70% or higher on course quiz',
          badge_icon: '🏆',
          course_id: courseId
        }
      ];

      await supabase.from('badges').insert(badges);
      
      toast({
        title: "Badges Earned!",
        description: "You've earned new badges for completing this course!",
      });

    } catch (error) {
      console.error('Error awarding badges:', error);
    }
  };

  const shareToLinkedIn = () => {
    if (!certificateData) return;
    
    const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent('Course Completion Certificate')}&organizationName=${encodeURIComponent('Learning Platform')}&issueYear=${new Date().getFullYear()}&issueMonth=${new Date().getMonth() + 1}&certUrl=${encodeURIComponent(`https://certificates.example.com/${certificateData.verification_hash}`)}`;
    
    window.open(linkedInUrl, '_blank');
    
    // Mark as shared
    supabase.from('certificates').update({
      linkedin_shared: true
    }).eq('verification_hash', certificateData.verification_hash);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
    setShowExplanation(false);
    setScore(0);
    setIsSubmitted(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading quiz...</div>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            No quiz available for this module yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Quiz start screen with attempts check
  if (!quizStarted) {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-blue-500" />
              Course Quiz
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Quiz Instructions</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• 50 questions, 2 marks each (Total: 100 marks)</li>
                <li>• 70% required to pass (70 marks)</li>
                <li>• Maximum 3 attempts allowed</li>
                <li>• Time limit: 60 minutes</li>
                <li>• You can review questions before submitting</li>
              </ul>
            </div>

            {attempts.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">Previous Attempts</h3>
                <div className="space-y-2">
                  {attempts.map((attempt, index) => (
                    <div key={attempt.id} className="flex justify-between text-sm">
                      <span>Attempt {index + 1}:</span>
                      <span className={attempt.passed ? 'text-green-600 font-semibold' : 'text-red-600'}>
                        {attempt.score}% {attempt.passed ? '(PASSED)' : '(FAILED)'}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-yellow-700 text-sm mt-2">
                  Attempts remaining: {3 - attempts.length}
                </p>
              </div>
            )}

            {!canAttempt ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-red-800 font-semibold">Maximum attempts reached</p>
                <p className="text-red-600 text-sm">You have used all 3 attempts for this quiz.</p>
              </div>
            ) : (
              <div className="text-center">
                <Button onClick={startQuiz} size="lg" className="px-8">
                  <Clock className="h-4 w-4 mr-2" />
                  Start Quiz
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Certificate Modal */}
        <Dialog open={showCertificate} onOpenChange={setShowCertificate}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-gold-500" />
                Congratulations!
              </DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-lg">
                <Trophy className="h-12 w-12 mx-auto mb-3 text-yellow-300" />
                <h3 className="text-xl font-bold">Certificate Earned!</h3>
                <p className="text-blue-100">Course Completion Certificate</p>
                {certificateData && (
                  <p className="text-sm text-blue-200 mt-2">
                    Verification: {certificateData.verification_hash}
                  </p>
                )}
              </div>
              
              <div className="space-y-3">
                <Button onClick={shareToLinkedIn} className="w-full" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share on LinkedIn
                </Button>
                <Button onClick={() => setShowCertificate(false)} className="w-full">
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  if (showResult) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-yellow-500" />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">{score}%</div>
            <p className="text-gray-600">
              You scored {score}% ({answers.filter((answer, index) => answer === questions[index].correct_answer).length} out of {questions.length} correct)
            </p>
          </div>
          
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4">
                <p className="font-medium mb-2">{question.question}</p>
                <div className="flex items-center gap-2">
                  {answers[index] === question.correct_answer ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className={answers[index] === question.correct_answer ? 'text-green-600' : 'text-red-600'}>
                    Your answer: {question.options[answers[index]]}
                  </span>
                </div>
                {answers[index] !== question.correct_answer && (
                  <p className="text-sm text-gray-600 mt-2">
                    Correct answer: {question.options[question.correct_answer]}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-2">{question.explanation}</p>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button onClick={resetQuiz} variant="outline">
              Retake Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Quiz: Question {currentQuestion + 1} of {questions.length}</CardTitle>
          <div className="flex items-center gap-4">
            <div className={`text-sm font-medium flex items-center gap-1 ${timeRemaining < 300 ? 'text-red-600' : 'text-gray-600'}`}>
              <Clock className="h-4 w-4" />
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-gray-500">
              {Math.round(progress)}% Complete
            </div>
          </div>
        </div>
        <Progress value={progress} className="w-full" />
        {timeRemaining < 300 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2 mt-2">
            <p className="text-red-800 text-sm font-medium flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              Warning: Less than 5 minutes remaining!
            </p>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">{currentQ.question}</h3>
          
          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {showExplanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">{currentQ.explanation}</p>
          </div>
        )}
        
        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            {selectedAnswer !== null && !showExplanation && (
              <Button
                onClick={() => setShowExplanation(true)}
                variant="outline"
              >
                Show Explanation
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              disabled={selectedAnswer === null}
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Quiz;
