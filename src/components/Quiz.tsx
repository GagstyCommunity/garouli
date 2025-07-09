
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
}

interface QuizProps {
  moduleId: string;
  courseId: string;
  onComplete?: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ moduleId, courseId, onComplete }) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizQuestions();
  }, [moduleId]);

  const fetchQuizQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('course_quizzes')
        .select('*')
        .eq('module_id', moduleId);

      if (error) {
        console.error('Error fetching quiz questions:', error);
        return;
      }

      if (data && data.length > 0) {
        // Transform the data to match our QuizQuestion interface
        const transformedQuestions: QuizQuestion[] = data.map(item => ({
          id: item.id,
          question: item.question,
          options: Array.isArray(item.options) ? item.options as string[] : [],
          correct_answer: item.correct_answer,
          explanation: item.explanation || ''
        }));
        setQuestions(transformedQuestions);
      } else {
        // Generate sample questions if none exist
        const sampleQuestions: QuizQuestion[] = [
          {
            id: '1',
            question: 'What is the main topic covered in this module?',
            options: [
              'Basic concepts and fundamentals',
              'Advanced techniques only',
              'Historical background',
              'Future predictions'
            ],
            correct_answer: 0,
            explanation: 'This module focuses on building a strong foundation with basic concepts.'
          },
          {
            id: '2',
            question: 'Which approach is recommended for beginners?',
            options: [
              'Jump straight to advanced topics',
              'Start with fundamentals and build up',
              'Learn everything at once',
              'Skip the basics'
            ],
            correct_answer: 1,
            explanation: 'Starting with fundamentals ensures a solid understanding before advancing.'
          }
        ];
        setQuestions(sampleQuestions);
      }
    } catch (error) {
      console.error('Error in fetchQuizQuestions:', error);
    } finally {
      setLoading(false);
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

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setShowResult(true);
    setIsSubmitted(true);
    
    // Save quiz result
    saveQuizResult(finalScore);
    onComplete?.(finalScore);
  };

  const saveQuizResult = async (quizScore: number) => {
    if (!user) return;

    try {
      await supabase.from('user_progress').upsert({
        user_id: user.id,
        course_id: courseId,
        module_id: moduleId,
        quiz_score: quizScore,
        completed_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving quiz result:', error);
    }
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
          <div className="text-sm text-gray-500">
            {Math.round(progress)}% Complete
          </div>
        </div>
        <Progress value={progress} className="w-full" />
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
