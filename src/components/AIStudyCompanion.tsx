
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  courseContext?: string;
}

interface AIStudyCompanionProps {
  courseId?: string;
  moduleId?: string;
}

const AIStudyCompanion: React.FC<AIStudyCompanionProps> = ({ courseId, moduleId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = 'en-US';

      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recog.onerror = () => {
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }

    // Load previous chat history
    loadChatHistory();
  }, [courseId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    if (!user) return;

    try {
      const query = supabase
        .from('ai_interactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(20);

      if (courseId) {
        query.eq('course_id', courseId);
      }

      const { data } = await query;

      if (data) {
        const chatMessages: ChatMessage[] = data.flatMap(interaction => [
          {
            id: `${interaction.id}-user`,
            type: 'user' as const,
            content: interaction.question,
            timestamp: new Date(interaction.created_at || ''),
            courseContext: interaction.context_type
          },
          {
            id: `${interaction.id}-ai`,
            type: 'ai' as const,
            content: interaction.ai_response,
            timestamp: new Date(interaction.created_at || ''),
            courseContext: interaction.context_type
          }
        ]);

        setMessages(chatMessages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !user) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Get course context if available
      let courseContext = '';
      if (courseId) {
        const { data: course } = await supabase
          .from('courses')
          .select('title, description, category')
          .eq('id', courseId)
          .single();

        if (course) {
          courseContext = `Course: ${course.title}\nCategory: ${course.category}\nDescription: ${course.description}`;
        }
      }

      // Simulate AI response (in a real implementation, this would call an AI service)
      const aiResponse = await generateAIResponse(userMessage.content, courseContext);

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        courseContext: courseId ? 'course-specific' : 'general'
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save interaction to database
      await supabase.from('ai_interactions').insert({
        user_id: user.id,
        course_id: courseId || null,
        question: userMessage.content,
        ai_response: aiResponse,
        context_type: courseId ? 'course-specific' : 'general'
      });

      // Text-to-speech for AI response
      if (speechEnabled) {
        speakText(aiResponse);
      }

    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const generateAIResponse = async (question: string, courseContext: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Simple rule-based responses (in a real implementation, this would use OpenAI or similar)
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('help') || lowerQuestion.includes('stuck')) {
      return "I understand you need help! Can you be more specific about what you're struggling with? I can help explain concepts, provide examples, or break down complex topics into smaller parts.";
    }
    
    if (lowerQuestion.includes('explain') || lowerQuestion.includes('what is')) {
      return "I'd be happy to explain that concept! Let me break it down step by step. Could you specify which part you'd like me to focus on first?";
    }
    
    if (lowerQuestion.includes('example') || lowerQuestion.includes('show me')) {
      return "Great question! Here's a practical example to illustrate this concept. Would you like me to walk through it step by step or provide additional examples?";
    }
    
    if (lowerQuestion.includes('quiz') || lowerQuestion.includes('test')) {
      return "I can help you practice! Would you like me to create some practice questions on this topic, or would you prefer to review specific concepts first?";
    }

    if (courseContext) {
      return `Based on the course content, here's my response: I can help you understand this topic better. What specific aspect would you like to explore further? I can provide explanations, examples, or help you practice with exercises.`;
    }
    
    return "I'm here to help with your learning! Feel free to ask me about any concepts, request explanations, examples, or practice questions. How can I assist you today?";
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            AI Study Companion
          </div>
          <div className="flex items-center gap-2">
            {courseId && <Badge variant="secondary">Course Context</Badge>}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSpeechEnabled(!speechEnabled)}
            >
              {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="h-12 w-12 mx-auto mb-2 text-primary" />
              <p>Hi! I'm your AI study companion. Ask me anything about your courses!</p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-pulse flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your studies..."
            disabled={loading}
            className="flex-1"
          />
          {recognition && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={isListening ? stopListening : startListening}
              disabled={loading}
              className={isListening ? 'bg-red-100' : ''}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          )}
          <Button type="submit" disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AIStudyCompanion;
