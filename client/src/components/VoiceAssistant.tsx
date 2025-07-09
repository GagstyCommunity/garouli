
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Mic, MicOff, Volume2, VolumeX, Settings, Play, Pause } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceCommand {
  command: string;
  description: string;
  example: string;
}

const VoiceAssistant: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioPlayback, setAudioPlayback] = useState(true);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  const voiceCommands: VoiceCommand[] = [
    {
      command: "Start course",
      description: "Begin or resume a specific course",
      example: "Start machine learning course"
    },
    {
      command: "Next lesson",
      description: "Move to the next lesson in current course",
      example: "Next lesson"
    },
    {
      command: "Explain concept",
      description: "Get explanation of a specific topic",
      example: "Explain neural networks"
    },
    {
      command: "Take quiz",
      description: "Start a quiz for current topic",
      example: "Take quiz on Python basics"
    },
    {
      command: "Show progress",
      description: "Display learning progress and statistics",
      example: "Show my progress"
    },
    {
      command: "Search courses",
      description: "Find courses on specific topics",
      example: "Search for React courses"
    }
  ];

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        processVoiceCommand(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice recognition error",
          description: "Please try again or check your microphone permissions.",
          variant: "destructive"
        });
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && isVoiceEnabled) {
      setIsListening(true);
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const processVoiceCommand = async (command: string) => {
    setIsProcessing(true);
    
    try {
      // Simulate AI processing of voice command
      let response = '';
      const lowerCommand = command.toLowerCase();

      if (lowerCommand.includes('start') && lowerCommand.includes('course')) {
        response = 'I\'ve found your course and starting it now. You can continue from where you left off.';
      } else if (lowerCommand.includes('next lesson')) {
        response = 'Moving to the next lesson. This lesson covers advanced concepts, so take your time.';
      } else if (lowerCommand.includes('explain')) {
        const concept = lowerCommand.replace('explain', '').trim();
        response = `Let me explain ${concept}. This is a fundamental concept that builds on previous topics we've covered.`;
      } else if (lowerCommand.includes('quiz')) {
        response = 'Starting a quiz for you. I\'ve prepared 5 questions based on your recent learning progress.';
      } else if (lowerCommand.includes('progress')) {
        response = 'You\'ve completed 65% of your current course with an average score of 87%. Great job! You\'re on track to finish this week.';
      } else if (lowerCommand.includes('search')) {
        response = 'I found several courses matching your interests. Would you like me to show you the most popular ones first?';
      } else {
        response = 'I understand you said "' + command + '". Could you please rephrase or try one of the available commands?';
      }

      setResponse(response);
      
      // Text-to-speech if enabled
      if (audioPlayback && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }

    } catch (error) {
      console.error('Error processing voice command:', error);
      setResponse('Sorry, I couldn\'t process that command. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice Learning Assistant
          </CardTitle>
          <CardDescription>
            Control your learning experience with voice commands
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Voice Controls */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <Button
                size="lg"
                variant={isListening ? "destructive" : "default"}
                onClick={isListening ? stopListening : startListening}
                disabled={!isVoiceEnabled || isProcessing}
                className="relative"
              >
                {isListening ? (
                  <>
                    <MicOff className="h-5 w-5 mr-2" />
                    Stop Listening
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5 mr-2" />
                    Start Listening
                  </>
                )}
              </Button>
              
              {isProcessing && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm text-muted-foreground">Processing...</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="voice-enabled">Voice Input</Label>
                <Switch
                  id="voice-enabled"
                  checked={isVoiceEnabled}
                  onCheckedChange={setIsVoiceEnabled}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="audio-enabled">Audio Response</Label>
                <Switch
                  id="audio-enabled"
                  checked={audioPlayback}
                  onCheckedChange={setAudioPlayback}
                />
              </div>
            </div>
          </div>

          {/* Transcript and Response */}
          {(transcript || response) && (
            <div className="space-y-4">
              {transcript && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      You said:
                    </Label>
                    <Badge variant="outline" className="text-blue-600">
                      Voice Input
                    </Badge>
                  </div>
                  <p className="text-blue-900 dark:text-blue-100">{transcript}</p>
                </div>
              )}

              {response && (
                <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-green-800 dark:text-green-200">
                      Assistant Response:
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-green-600">
                        AI Response
                      </Badge>
                      {audioPlayback && (
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => speakText(response)}
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={stopSpeaking}
                          >
                            <VolumeX className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-green-900 dark:text-green-100">{response}</p>
                </div>
              )}
            </div>
          )}

          {/* Status */}
          <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-lg">
            {isListening ? (
              <div className="text-center">
                <div className="animate-pulse text-red-500 mb-2">
                  <Mic className="h-8 w-8 mx-auto" />
                </div>
                <p className="text-sm font-medium">Listening for your command...</p>
                <p className="text-xs text-muted-foreground">Speak clearly and wait for the response</p>
              </div>
            ) : (
              <div className="text-center">
                <Mic className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Voice assistant ready</p>
                <p className="text-xs text-muted-foreground">Click "Start Listening" and speak a command</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Commands */}
      <Card>
        <CardHeader>
          <CardTitle>Available Voice Commands</CardTitle>
          <CardDescription>
            Try these commands to control your learning experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {voiceCommands.map((cmd, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{cmd.command}</h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => speakText(cmd.example)}
                    disabled={!audioPlayback}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{cmd.description}</p>
                <div className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-950/30 p-2 rounded">
                  Example: "{cmd.example}"
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Browser Compatibility Notice */}
      {!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
              <Settings className="h-5 w-5" />
              <div>
                <p className="font-medium">Voice recognition not supported</p>
                <p className="text-sm">Please use Chrome, Edge, or Safari for voice features.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VoiceAssistant;
